import { ADVECT, DISPLAY, DIVERGENCE, FLOOD, GRADIENT, PRESSURE, SCALE, SPLAT, VERT } from "./shaders";

type Program = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Swap = { read: Target; write: Target; swap: () => void };

export type InkSettings = {
  simRes: number;
  dyeRes: number;
  iterations: number;
  velocityKeep: number;
  dyeKeep: number;
  radius: number;
  force: number;
  amount: number;
  edge: [number, number];
  rim: number;
  strength: number;
};

export type Stroke = { ax: number; ay: number; bx: number; by: number; vx: number; vy: number };

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);

/**
 * The overlay's GPU work: the opening flood and the cursor ink (a small stable-fluids solver).
 * Coordinates handed in are CSS px; the canvas may be rendered at a higher pixel ratio.
 */
export class InkEngine {
  readonly gl: WebGL2RenderingContext;
  private programs: Record<string, Program> = {};
  private vao: WebGLVertexArrayObject;
  private velocity!: Swap;
  private dye!: Swap;
  private divergence!: Target;
  private pressure!: Swap;
  private s: InkSettings;
  private cssW = 1;
  private cssH = 1;
  private ratio = 1;
  private houses: number[];
  /** Seconds of ink activity left to simulate after the last stroke (lets the engine go idle). */
  private life = 0;
  time = 0;

  static create(canvas: HTMLCanvasElement, settings: InkSettings, houses: readonly string[]) {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
    return new InkEngine(gl, settings, houses);
  }

  private constructor(gl: WebGL2RenderingContext, settings: InkSettings, houses: readonly string[]) {
    this.gl = gl;
    this.s = settings;
    this.houses = houses.flatMap(hex);
    this.vao = gl.createVertexArray()!;
    const sources: Record<string, string> = { ADVECT, SPLAT, DIVERGENCE, PRESSURE, GRADIENT, SCALE, DISPLAY, FLOOD };
    for (const [name, frag] of Object.entries(sources)) this.programs[name] = this.program(frag);
    gl.disable(gl.BLEND);
  }

  private program(frag: string): Program {
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    const u: Program["u"] = {};
    const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(prog, i)!;
      const key = info.name.replace(/\[0\]$/, "");
      u[key] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, u };
  }

  private target(w: number, h: number, internal: number, format: number): Target {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  }

  private swap(w: number, h: number, internal: number, format: number): Swap {
    const pair: Swap = {
      read: this.target(w, h, internal, format),
      write: this.target(w, h, internal, format),
      swap() { const t = pair.read; pair.read = pair.write; pair.write = t; },
    };
    return pair;
  }

  /** (Re)allocate for a viewport in CSS px at a device pixel ratio. */
  resize(cssW: number, cssH: number, ratio: number) {
    const gl = this.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    this.cssW = cssW; this.cssH = cssH; this.ratio = ratio;
    canvas.width = Math.round(cssW * ratio);
    canvas.height = Math.round(cssH * ratio);
    const aspect = cssW / cssH;
    const dims = (res: number) => (aspect >= 1 ? [Math.round(res * aspect), res] : [res, Math.round(res / aspect)]);
    const [sw, sh] = dims(this.s.simRes);
    const [dw, dh] = dims(this.s.dyeRes);
    this.velocity = this.swap(sw, sh, gl.RG16F, gl.RG);
    this.pressure = this.swap(sw, sh, gl.R16F, gl.RED);
    this.divergence = this.target(sw, sh, gl.R16F, gl.RED);
    this.dye = this.swap(dw, dh, gl.R16F, gl.RED);
  }

  setSettings(settings: InkSettings) { this.s = settings; }

  private use(p: Program, target: Target | null) {
    const gl = this.gl;
    gl.useProgram(p.prog);
    gl.bindVertexArray(this.vao);
    if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.w, target.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); }
  }

  private tex(p: Program, name: string, unit: number, t: Target) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(p.u[name], unit);
  }

  private draw() { this.gl.drawArrays(this.gl.TRIANGLES, 0, 3); }

  /** Opening: draw the flood at progress p (0 = all dark, 1 = page fully shown). */
  flood(p: number, dark: string, rimOn: boolean, spacingFrac: number, rimFrac: number, dt: number, glow = 0, glowColor = "#000000") {
    const gl = this.gl;
    this.time += dt;
    const P = this.programs.FLOOD;
    this.use(P, null);
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    gl.uniform2f(P.u.uRes, w, h);
    gl.uniform2f(P.u.uCenter, w / 2, h / 2);
    gl.uniform1f(P.u.uP, p);
    gl.uniform1f(P.u.uSpacing, h * spacingFrac);
    gl.uniform3fv(P.u.uDark, hex(dark));
    gl.uniform3fv(P.u.uHouses, this.houses);
    gl.uniform1f(P.u.uRimPx, h * spacingFrac * rimFrac);
    gl.uniform1f(P.u.uTime, this.time);
    gl.uniform1f(P.u.uRimOn, rimOn ? 1 : 0);
    gl.uniform1f(P.u.uGlow, glow);
    gl.uniform3fv(P.u.uGlowColor, hex(glowColor));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.draw();
  }

  /** True while there is ink or motion worth simulating. */
  get busy() { return this.life > 0; }

  /** One ink step: add strokes, run the solver, and display. `hole` is the Idea's footprint (CSS px). */
  step(dt: number, strokes: Stroke[], page: string, hole: { cx: number; cy: number; r: number } | null) {
    const gl = this.gl;
    const s = this.s;
    dt = Math.min(dt, 1 / 30);
    this.time += dt;
    const f = dt * 60;
    if (strokes.length) this.life = 2.2;
    this.life -= dt;

    const vel = this.velocity, dye = this.dye;
    const velTexel: [number, number] = [1 / vel.read.w, 1 / vel.read.h];

    // 1. Advect velocity by itself.
    let P = this.programs.ADVECT;
    this.use(P, vel.write);
    this.tex(P, "uVelocity", 0, vel.read);
    this.tex(P, "uSource", 1, vel.read);
    gl.uniform2f(P.u.uVelTexel, ...velTexel);
    gl.uniform1f(P.u.uDt, dt);
    gl.uniform1f(P.u.uKeep, Math.pow(s.velocityKeep, f));
    this.draw();
    vel.swap();

    // 2. Strokes: push velocity along the motion and lay down ink.
    const aspect = this.cssW / this.cssH;
    for (const k of strokes) {
      const a: [number, number] = [k.ax / this.cssW, 1 - k.ay / this.cssH];
      const b: [number, number] = [k.bx / this.cssW, 1 - k.by / this.cssH];
      // px/s → grid cells/s, scaled by the force setting.
      const scale = s.force / 1000;
      const fx = (k.vx / this.cssW) * vel.read.w * scale;
      const fy = (-k.vy / this.cssH) * vel.read.h * scale;
      P = this.programs.SPLAT;
      this.use(P, vel.write);
      this.tex(P, "uTarget", 0, vel.read);
      gl.uniform2f(P.u.uA, ...a);
      gl.uniform2f(P.u.uB, ...b);
      gl.uniform1f(P.u.uAspect, aspect);
      gl.uniform1f(P.u.uRadius, s.radius);
      gl.uniform3f(P.u.uValue, fx, fy, 0);
      this.draw();
      vel.swap();
      this.use(P, dye.write);
      this.tex(P, "uTarget", 0, dye.read);
      gl.uniform3f(P.u.uValue, s.amount, 0, 0);
      this.draw();
      dye.swap();
    }

    // 3. Make the flow incompressible (divergence → pressure → subtract the gradient).
    P = this.programs.DIVERGENCE;
    this.use(P, this.divergence);
    this.tex(P, "uVelocity", 0, vel.read);
    gl.uniform2f(P.u.uTexel, ...velTexel);
    this.draw();

    P = this.programs.SCALE;
    this.use(P, this.pressure.write);
    this.tex(P, "uSource", 0, this.pressure.read);
    gl.uniform1f(P.u.uKeep, 0.8);
    this.draw();
    this.pressure.swap();

    P = this.programs.PRESSURE;
    for (let i = 0; i < s.iterations; i++) {
      this.use(P, this.pressure.write);
      this.tex(P, "uPressure", 0, this.pressure.read);
      this.tex(P, "uDivergence", 1, this.divergence);
      gl.uniform2f(P.u.uTexel, ...velTexel);
      this.draw();
      this.pressure.swap();
    }

    P = this.programs.GRADIENT;
    this.use(P, vel.write);
    this.tex(P, "uPressure", 0, this.pressure.read);
    this.tex(P, "uVelocity", 1, vel.read);
    gl.uniform2f(P.u.uTexel, ...velTexel);
    this.draw();
    vel.swap();

    // 4. Carry the ink along and let it fade.
    P = this.programs.ADVECT;
    this.use(P, dye.write);
    this.tex(P, "uVelocity", 0, vel.read);
    this.tex(P, "uSource", 1, dye.read);
    gl.uniform2f(P.u.uVelTexel, ...velTexel);
    gl.uniform1f(P.u.uDt, dt);
    gl.uniform1f(P.u.uKeep, Math.pow(s.dyeKeep, f));
    this.draw();
    dye.swap();

    this.display(page, hole);
  }

  private display(page: string, hole: { cx: number; cy: number; r: number } | null) {
    const gl = this.gl;
    const s = this.s;
    const P = this.programs.DISPLAY;
    this.use(P, null);
    this.tex(P, "uDye", 0, this.dye.read);
    this.tex(P, "uVelocity", 1, this.velocity.read);
    gl.uniform2f(P.u.uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(P.u.uEdge, ...s.edge);
    gl.uniform1f(P.u.uRim, s.rim);
    gl.uniform1f(P.u.uStrength, s.strength);
    gl.uniform3fv(P.u.uPage, hex(page));
    gl.uniform3fv(P.u.uHouses, this.houses);
    gl.uniform1f(P.u.uTime, this.time);
    if (hole && hole.r > 0) {
      gl.uniform3f(P.u.uHole, hole.cx * this.ratio, (this.cssH - hole.cy) * this.ratio, hole.r * this.ratio);
    } else gl.uniform3f(P.u.uHole, 0, 0, 0);
    this.draw();
  }

  /** Paint nothing (black = no change under the difference blend). */
  clear() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  dispose() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

import { type Brush, SUB } from "./brush";
import { ADVECT, DISPLAY, DIVERGENCE, FLOOD, GRADIENT, PRESSURE, SCALE, SPLAT, VERT } from "./shaders";

type Program = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Swap = { read: Target; write: Target; swap: () => void };

export type InkSettings = {
  /** Velocity grid: cells on the viewport's short side. */
  simRes: number;
  /** Ink texture: fraction of the canvas's device pixels, capped on the long side. */
  dyeScale: number;
  dyeMax: number;
  iterations: number;
  /** Solver step (s) and per-step retention of velocity, ink and pressure. */
  step: number;
  velocityKeep: number;
  dyeKeep: number;
  pressureKeep: number;
  /** Brush radius: the smaller of a fraction of the viewport height and of its width (CSS px). */
  radiusH: number;
  radiusW: number;
  /** Brush delay behind the pointer (ms, on top of its smoothing) and the velocity splat's radius (share of the
   *  ink radius: a narrower push than the ink stretches it into tails and swirls). */
  lag: number;
  velocityRadius: number;
  /** Brush speed (px/s) above which a move pushes no harder: a flick lays ink but barely slides it. */
  maxSpeed: number;
  /** Brush speed (px/s) below which it lays proportionally less ink (a brush easing to a stop doesn't pool). */
  inkSpeed: number;
  /** Share of the brush's velocity added to the fluid per step; ink added per step and its cap; display threshold. */
  force: number;
  amount: number;
  maxInk: number;
  edge: number;
  /** Gold rim width (CSS px; 0 = none) and overall strength (reduced motion paints faintly). */
  rimPx: number;
  strength: number;
};

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);

/**
 * The overlay's GPU work: the opening flood and the cursor ink (a small stable-fluids solver).
 * The ink runs on a fixed timestep (independent of the display's refresh rate) and is displayed interpolated
 * between its last two steps. Coordinates handed in are CSS px; the canvas may be rendered at a higher pixel ratio.
 */
export class InkEngine {
  readonly gl: WebGL2RenderingContext;
  private programs: Record<string, Program> = {};
  private vao: WebGLVertexArrayObject;
  private velocity!: Swap;
  private dye!: Swap;
  private dyePrev!: Target;
  private divergence!: Target;
  private pressure!: Swap;
  private targets: Target[] = [];
  s: InkSettings;
  private cssW = 1;
  private cssH = 1;
  private ratio = 1;
  private gold: number[];
  private goldBright: number[];
  private pts = new Float32Array(2 * (SUB + 1));
  /** Solver clock (ms, performance.now timeline), whether it is running, and ms of activity left before idling. */
  private simT = 0;
  private running = false;
  private life = 0;
  private seen = -Infinity;
  time = 0;

  static create(canvas: HTMLCanvasElement, settings: InkSettings, gold: string, goldBright: string) {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
    return new InkEngine(gl, settings, gold, goldBright);
  }

  private constructor(gl: WebGL2RenderingContext, settings: InkSettings, gold: string, goldBright: string) {
    this.gl = gl;
    this.s = settings;
    this.gold = hex(gold);
    this.goldBright = hex(goldBright);
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
    const t = { tex, fbo, w, h };
    this.targets.push(t);
    this.wipe(t);
    return t;
  }

  private wipe(t: Target) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.viewport(0, 0, t.w, t.h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private swap(w: number, h: number, internal: number, format: number): Swap {
    const pair: Swap = {
      read: this.target(w, h, internal, format),
      write: this.target(w, h, internal, format),
      swap() { const t = pair.read; pair.read = pair.write; pair.write = t; },
    };
    return pair;
  }

  /** (Re)allocate for a viewport in CSS px at a device pixel ratio. Sizes follow the screen. */
  resize(cssW: number, cssH: number, ratio: number) {
    const gl = this.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    this.cssW = cssW; this.cssH = cssH; this.ratio = ratio;
    canvas.width = Math.round(cssW * ratio);
    canvas.height = Math.round(cssH * ratio);
    for (const t of this.targets) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); }
    this.targets = [];
    const short = Math.min(cssW, cssH);
    const sim = this.s.simRes / short;
    const sw = Math.max(16, Math.round(cssW * sim)), sh = Math.max(16, Math.round(cssH * sim));
    const dyeK = Math.min(this.s.dyeScale * ratio, this.s.dyeMax / Math.max(cssW, cssH));
    const dw = Math.max(16, Math.round(cssW * dyeK)), dh = Math.max(16, Math.round(cssH * dyeK));
    this.velocity = this.swap(sw, sh, gl.RG16F, gl.RG);
    this.pressure = this.swap(sw, sh, gl.R16F, gl.RED);
    this.divergence = this.target(sw, sh, gl.R16F, gl.RED);
    this.dye = this.swap(dw, dh, gl.R16F, gl.RED);
    this.dyePrev = this.target(dw, dh, gl.R16F, gl.RED);
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
    gl.uniform3fv(P.u.uGold, this.gold);
    gl.uniform3fv(P.u.uGoldBright, this.goldBright);
    gl.uniform1f(P.u.uRimPx, h * spacingFrac * rimFrac);
    gl.uniform1f(P.u.uTime, this.time);
    gl.uniform1f(P.u.uRimOn, rimOn ? 1 : 0);
    gl.uniform1f(P.u.uGlow, glow);
    gl.uniform3fv(P.u.uGlowColor, hex(glowColor));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.draw();
  }

  /**
   * Per display frame: run as many fixed solver steps as the clock owes (at most 4), then display the ink
   * interpolated to `now`. Wakes on new pointer samples and idles (clearing everything) once the ink is gone.
   */
  update(now: number, brush: Brush, page: string) {
    const H = this.s.step * 1000;
    if (brush.latest > this.seen) {
      this.seen = brush.latest;
      if (!this.running) {
        this.running = true;
        // Steps sit on a fixed grid of the clock, so the result doesn't depend on when a frame happened to land.
        this.simT = Math.floor(now / H) * H - H;
        brush.place(this.simT - this.s.lag);
      }
      this.life = 2000;
    }
    if (!this.running) return;
    if (now - this.simT > 4 * H) this.simT = Math.floor(now / H) * H - H; // after a stall, don't try to catch up
    while (this.simT + H <= now) {
      this.stepOnce(brush, this.simT, this.simT + H);
      this.simT += H;
      this.life -= H;
    }
    if (this.life <= 0) {
      this.running = false;
      for (const t of this.targets) this.wipe(t);
      this.clear();
      return;
    }
    this.display(page, (now - this.simT) / H);
  }

  private stepOnce(brush: Brush, t0: number, t1: number) {
    const gl = this.gl;
    const s = this.s;
    const dt = (t1 - t0) / 1000;
    const vel = this.velocity, dye = this.dye;
    const velTexel: [number, number] = [1 / vel.read.w, 1 / vel.read.h];
    const invView: [number, number] = [1 / this.cssW, 1 / this.cssH];

    // 0. Keep the previous ink for display interpolation.
    let P = this.programs.SCALE;
    this.use(P, this.dyePrev);
    this.tex(P, "uSource", 0, dye.read);
    gl.uniform1f(P.u.uKeep, 1);
    this.draw();

    // 1. Advect velocity by itself.
    P = this.programs.ADVECT;
    this.use(P, vel.write);
    this.tex(P, "uVelocity", 0, vel.read);
    this.tex(P, "uSource", 1, vel.read);
    gl.uniform2f(P.u.uInvView, ...invView);
    gl.uniform1f(P.u.uDt, dt);
    gl.uniform1f(P.u.uKeep, s.velocityKeep);
    this.draw();
    vel.swap();

    // 2. The brush's path over this step: push the fluid along it and lay down ink.
    const n = brush.step(t0 - s.lag, t1 - s.lag, this.pts);
    if (n) {
      this.life = Math.max(this.life, 2000);
      const pts = this.pts;
      for (let i = 0; i < n; i++) pts[i * 2 + 1] = this.cssH - pts[i * 2 + 1];
      const radius = Math.min(s.radiusH * this.cssH, s.radiusW * this.cssW);
      P = this.programs.SPLAT;
      this.use(P, vel.write);
      this.tex(P, "uTarget", 0, vel.read);
      gl.uniform2fv(P.u.uPts, pts);
      gl.uniform1i(P.u.uN, n);
      gl.uniform2f(P.u.uView, this.cssW, this.cssH);
      gl.uniform1f(P.u.uRadius, radius * s.velocityRadius);
      const sp = Math.hypot(brush.vx, brush.vy);
      const k = s.force * (sp > s.maxSpeed ? s.maxSpeed / sp : 1);
      gl.uniform3f(P.u.uValue, brush.vx * k, -brush.vy * k, 0);
      gl.uniform1f(P.u.uMax, 0);
      this.draw();
      vel.swap();
      this.use(P, dye.write);
      this.tex(P, "uTarget", 0, dye.read);
      gl.uniform1f(P.u.uRadius, radius);
      gl.uniform3f(P.u.uValue, s.amount * Math.min(1, sp / s.inkSpeed), 0, 0);
      gl.uniform1f(P.u.uMax, s.maxInk);
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
    gl.uniform1f(P.u.uKeep, s.pressureKeep);
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
    gl.uniform2f(P.u.uInvView, ...invView);
    gl.uniform1f(P.u.uDt, dt);
    gl.uniform1f(P.u.uKeep, s.dyeKeep);
    this.draw();
    dye.swap();
  }

  private display(page: string, alpha: number) {
    const gl = this.gl;
    const s = this.s;
    const P = this.programs.DISPLAY;
    this.use(P, null);
    this.tex(P, "uDye", 0, this.dye.read);
    this.tex(P, "uDyePrev", 1, this.dyePrev);
    gl.uniform1f(P.u.uAlpha, Math.min(1, Math.max(0, alpha)));
    gl.uniform1f(P.u.uEdge, s.edge);
    gl.uniform1f(P.u.uRimPx, s.rimPx * this.ratio);
    gl.uniform1f(P.u.uStrength, s.strength);
    gl.uniform3fv(P.u.uPage, hex(page));
    gl.uniform3fv(P.u.uGold, this.gold);
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

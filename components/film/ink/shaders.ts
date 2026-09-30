/**
 * GLSL for the film's overlay: a stable-fluids ink (after Stam's method as described in GPU Gems ch. 38) and the
 * opening's halftone flood. Written for this project; all shaders are WebGL2 (GLSL ES 3.0).
 */

export const VERT = /* glsl */ `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // One oversized triangle covers the screen.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const HEAD = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
`;

/** Semi-Lagrangian advection of any field by the velocity field (velocity in grid cells per second). */
export const ADVECT = HEAD + /* glsl */ `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uVelTexel;
uniform float uDt;
uniform float uKeep;
void main() {
  vec2 back = vUv - uDt * texture(uVelocity, vUv).xy * uVelTexel;
  outColor = uKeep * texture(uSource, back);
}`;

/** Adds a stroke: a capsule from the previous to the current pointer position, soft-edged. */
export const SPLAT = HEAD + /* glsl */ `
uniform sampler2D uTarget;
uniform vec2 uA;
uniform vec2 uB;
uniform float uAspect;
uniform float uRadius;
uniform vec3 uValue;
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  pa.x *= uAspect; ba.x *= uAspect;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  float t = clamp(segment(vUv, uA, uB) / uRadius, 0.0, 1.0);
  float w = pow(1.0 - t * t, 2.0);
  vec4 v = texture(uTarget, vUv) + vec4(uValue * w, 0.0);
  // Ink saturates (a stroke can't pile up forever); velocity is left free.
  if (uValue.y == 0.0 && uValue.z == 0.0) v.x = min(v.x, 1.25);
  outColor = v;
}`;

export const DIVERGENCE = HEAD + /* glsl */ `
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  // Solid walls at the screen edge: reflect the normal component.
  vec2 c = texture(uVelocity, vUv).xy;
  if (vUv.x - uTexel.x < 0.0) L = -c.x;
  if (vUv.x + uTexel.x > 1.0) R = -c.x;
  if (vUv.y - uTexel.y < 0.0) B = -c.y;
  if (vUv.y + uTexel.y > 1.0) T = -c.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

export const PRESSURE = HEAD + /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float d = texture(uDivergence, vUv).x;
  outColor = vec4(0.25 * (L + R + B + T - d), 0.0, 0.0, 1.0);
}`;

export const GRADIENT = HEAD + /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 v = texture(uVelocity, vUv).xy - 0.5 * vec2(R - L, T - B);
  outColor = vec4(v, 0.0, 1.0);
}`;

export const SCALE = HEAD + /* glsl */ `
uniform sampler2D uSource;
uniform float uKeep;
void main() { outColor = uKeep * texture(uSource, vUv); }`;

/**
 * Ink display for a canvas composited with mix-blend-mode: difference. White = full inversion of whatever is under
 * it (page → deep ink, dark text → light), black = no change. A thin rim in the houses' colours rides the ink's edge
 * while it moves; the Idea cuts a soft hole so the ink reads as *behind* it.
 */
export const DISPLAY = HEAD + /* glsl */ `
uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform vec2 uRes;
uniform vec2 uEdge;
uniform float uRim;
uniform float uStrength;
uniform vec3 uPage;
uniform vec3 uHouses[5];
uniform vec3 uHole;       // centre (px, canvas space) and radius (px)
uniform float uTime;
vec3 through(vec3 page, vec3 want) {
  // The colour that, differenced with the page, shows as "want".
  return mix(page + want, page - want, step(want, page));
}
void main() {
  float d = texture(uDye, vUv).x;
  float mask = smoothstep(uEdge.x, uEdge.y, d);
  vec2 frag = vUv * uRes;
  float hole = uHole.z > 0.0 ? smoothstep(uHole.z * 0.62, uHole.z * 0.95, length(frag - uHole.xy)) : 1.0;
  mask *= hole;
  // Rim: a band of constant screen width (~3px) along the edge, strongest where the ink is moving.
  float fw = max(fwidth(d), 1e-4);
  float band = (1.0 - smoothstep(1.2, 3.0, abs(d - uEdge.x) / fw)) * hole;
  float speed = length(texture(uVelocity, vUv).xy);
  float rim = band * uRim * smoothstep(4.0, 40.0, speed);
  float k = fract(atan(vUv.y - 0.5, vUv.x - 0.5) * 0.8 + vUv.x * 2.0 - vUv.y * 1.3 + uTime * 0.35) * 5.0;
  int i = int(floor(k));
  vec3 hue = mix(uHouses[i], uHouses[(i + 1) % 5], fract(k));
  vec3 col = mix(vec3(mask), clamp(through(uPage, hue), 0.0, 1.0), clamp(rim, 0.0, 1.0));
  outColor = vec4(col * uStrength, 1.0);
}`;

/**
 * The opening flood: a lattice of halftone dots grows outward from the centre, the dots merge into bands and the
 * page shows through them. Signed distances to the lattice's circles are united with a smooth minimum (so
 * neighbouring dots bridge like liquid); the rim between dark and page cycles through the five houses' colours.
 */
export const FLOOD = HEAD + /* glsl */ `
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uP;
uniform float uSpacing;
uniform vec3 uDark;
uniform vec3 uHouses[5];
uniform float uRimPx;
uniform float uTime;
uniform float uRimOn;
uniform vec3 uGlowColor;
uniform float uGlow;
float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 q = frag - uCenter;
  float far = length(uRes) * 0.5;
  // A lattice rotated -28deg with every other row shifted: neighbours meet along diagonals.
  float c = cos(-0.49), s = sin(-0.49);
  vec2 r = mat2(c, -s, s, c) * q / uSpacing;
  float sdf = 1e5;
  float gNear = 0.0, dNear = 1e5;
  vec2 cell = floor(r);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 id = cell + vec2(float(i), float(j));
      vec2 centre = id + 0.5 + vec2(mod(id.y, 2.0) * 0.5, 0.0);
      // The front: dots near the middle start first; every dot grows from nothing to over-full.
      vec2 world = mat2(c, s, -s, c) * (centre * uSpacing);
      float d0 = length(world) / far;
      // Front (measured on the reference): a small patch at T0, the corners by about +450 ms; each dot takes
      // ~350 ms to swell. Alternate rows of the slanted lattice run larger, so dots bridge along the rows into
      // wavy diagonal bands first; a final swell closes the last holes by ~+750 ms.
      // Fitted to the reference's measured page coverage: 10 % at +333 ms, 50 % at +481 ms, 75 % at +566 ms.
      float born = 0.36 * pow(d0, 0.62);               // accelerating front
      float g = clamp((uP - born) / 0.3, 0.0, 1.0);
      g = g * g * (3.0 - 2.0 * g);
      float row = mod(id.y, 2.0) < 0.5 ? 1.0 : 0.4;
      float size = g * row * (0.9 + 0.2 * hash(id)) * 0.6 + smoothstep(0.52, 0.8, uP) * 0.62;
      float dd = length(r - centre) - size;
      if (dd < dNear) { dNear = dd; gNear = g; }
      sdf = smin(sdf, g > 0.0 ? dd : 1e5, 0.16 * g + 0.001);
    }
  }
  float px = sdf * uSpacing;               // signed distance in px (negative = page shows)
  float open = 1.0 - smoothstep(-0.75, 0.75, px);
  // A thin coloured rim hugging each dot that has appeared (never around dots still to come).
  float rimW = uRimPx * (0.35 + 0.65 * gNear);
  float rimT = (1.0 - smoothstep(rimW * 0.5, rimW, px)) * step(0.0, px) * smoothstep(0.0, 0.08, gNear);
  rimT *= uRimOn * (1.0 - smoothstep(0.6, 0.9, uP));
  float k = fract(length(q) / far * 3.0 - uTime * 0.25 + uP * 2.0) * 5.0;
  int hi = int(floor(k));
  vec3 hue = mix(uHouses[hi], uHouses[(hi + 1) % 5], fract(k));
  vec3 col = mix(uDark, hue, clamp(rimT, 0.0, 1.0));
  float alpha = (1.0 - open);
  // Newborn dots are tinted with the rim colours before the page shows through them.
  float tint = uRimOn * open * (1.0 - smoothstep(0.18, 0.5, gNear));
  col = mix(col, hue, tint);
  alpha = max(alpha, tint);
  // Dark-on-dark palettes: the opened dots glow gold first, then clear to the page.
  float glow = uGlow * open * (1.0 - smoothstep(0.4, 0.92, uP));
  outColor = vec4(col * alpha + uGlowColor * glow, alpha + glow);
}`;

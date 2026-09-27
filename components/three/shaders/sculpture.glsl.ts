import { simplexNoise3D } from "./noise.glsl";

/**
 * The sculpture is a torus-knot path swept with a (super)elliptical cross-section, built entirely
 * in the vertex shader so it can twist, breathe, ripple and "grow in" with no CPU work.
 * Geometry is just a grid of (t, u) parameters: t runs along the knot, u around the profile.
 * Normals come from finite differences of the same surface function, so they stay exact
 * under any displacement.
 */
export const sculptureVertexHeader = /* glsl */ `
attribute vec2 aParam;
uniform float uTime;
uniform float uReveal;
uniform float uP;
uniform float uQ;
uniform float uKnotR;
uniform float uTubeR;
uniform float uBreath;
uniform float uWidth;
uniform float uThick;
uniform float uExp;
uniform float uTwist;
uniform float uTwistSpeed;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uNoiseSpeed;
uniform float uRippleAmp;
uniform float uRippleFreq;
uniform float uRippleSpeed;
varying vec3 vKaPos;

${simplexNoise3D}

const float KA_TAU = 6.28318530718;

vec3 kaKnot(float a) {
  float tube = uTubeR * (1.0 + uBreath * sin(3.0 * a + uTime * 0.21));
  float r = uKnotR + tube * cos(uQ * a);
  return vec3(r * cos(uP * a), r * sin(uP * a), tube * sin(uQ * a));
}

float kaGrow(float t) {
  // The ribbon draws itself along its length as uReveal goes 0 → 1.
  return smoothstep(0.0, 0.14, uReveal * 1.2 - t);
}

vec3 kaSurface(float t, float u) {
  float a = t * KA_TAU;
  vec3 c = kaKnot(a);
  vec3 T = normalize(kaKnot(a + 0.0025) - kaKnot(a - 0.0025));
  vec3 R = normalize(vec3(c.xy, 0.0) + vec3(0.0, 0.0, 1e-4));
  vec3 B = normalize(cross(T, R));
  vec3 N = cross(B, T);

  // Superellipse profile: exponent 2 = ellipse, higher = flatter faces with crisp edges.
  float ang = u * KA_TAU;
  float cu = cos(ang);
  float su = sin(ang);
  float e = 2.0 / uExp;
  vec2 prof = vec2(sign(cu) * pow(abs(cu), e) * uWidth, sign(su) * pow(abs(su), e) * uThick);

  float grow = kaGrow(t);
  float swell = 1.0 + uRippleAmp * sin(t * uRippleFreq * KA_TAU - uTime * uRippleSpeed);
  prof *= grow * swell;

  float tw = uTwist * a + uTime * uTwistSpeed;
  float ct = cos(tw);
  float st = sin(tw);
  vec2 rp = vec2(prof.x * ct - prof.y * st, prof.x * st + prof.y * ct);

  vec3 p = c + N * rp.x + B * rp.y;
  vec3 outward = N * rp.x + B * rp.y;
  float n = snoise(p * uNoiseFreq + vec3(0.0, uTime * uNoiseSpeed, uTime * uNoiseSpeed * 0.6));
  p += normalize(outward + 1e-6) * n * uNoiseAmp * grow;
  return p;
}
`;

/** Replaces three's `beginnormal_vertex`: evaluates position + normal once, used by begin_vertex below. */
export const sculptureBeginNormal = /* glsl */ `
float kaT = aParam.x;
// Profile runs clockwise so the grid's triangle winding faces outward (front faces = outside).
float kaU = 1.0 - aParam.y;
vec3 kaPos = kaSurface(kaT, kaU);
const float kaEt = 0.0015;
const float kaEu = 0.004;
vec3 kaDt = kaSurface(kaT + kaEt, kaU) - kaSurface(kaT - kaEt, kaU);
vec3 kaDu = kaSurface(kaT, kaU + kaEu) - kaSurface(kaT, kaU - kaEu);
vec3 objectNormal = normalize(cross(kaDt, kaDu) + 1e-7);
// Point outward (away from the knot's centre line).
if (dot(objectNormal, kaPos - kaKnot(kaT * KA_TAU)) < 0.0) objectNormal = -objectNormal;
vKaPos = kaPos;
`;

export const sculptureBeginVertex = /* glsl */ `
vec3 transformed = kaPos;
`;

export const sculptureFragmentHeader = /* glsl */ `
uniform float uTime;
uniform float uRoughVar;
varying vec3 vKaPos;
${simplexNoise3D}
`;

/** Fine variation in polish, like a hand-finished casting — breaks up the "CG plastic" uniformity. */
export const sculptureRoughness = /* glsl */ `
float roughnessFactor = roughness;
float kaPolish = snoise(vKaPos * 3.2 + vec3(0.0, 0.0, uTime * 0.04)) * 0.5
               + snoise(vKaPos * 9.0) * 0.25;
roughnessFactor = clamp(roughnessFactor * (1.0 + uRoughVar * kaPolish), 0.03, 1.0);
`;

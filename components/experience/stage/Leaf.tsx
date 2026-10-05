"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

const vert = /* glsl */ `
uniform float uBend, uTime, uSway;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vView;
#include <fog_pars_vertex>
void main() {
  vUv = uv;
  vec3 p = position;
  // Curl across the width (a leaf's cup) and droop toward the tip; a little sway.
  float x = uv.x * 2.0 - 1.0;
  p.z += uBend * (x * x) - uBend * 0.6 * uv.y * uv.y + sin(uTime * 0.8 + uv.y * 3.0) * uSway * uv.y;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  vN = normalize(normalMatrix * vec3(-2.0 * uBend * x, 1.2 * uBend * uv.y, 1.0));
  vView = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const frag = /* glsl */ `
uniform vec3 uLeaf, uBack, uGold, uLight;
uniform float uMap, uTime, uWet, uNight;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vView;
#include <fog_pars_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
void main() {
  // Leaf outline: widest a third of the way up, a point at the tip.
  float y = vUv.y, x = vUv.x * 2.0 - 1.0;
  float hw = sin(3.14159 * pow(y, 0.75)) * (1.0 - 0.15 * y);
  if (abs(x) > hw) discard;
  float rel = x / max(hw, 1e-3);
  // Veins: the midrib, lateral veins sweeping up and out, a fine net. Backlit, veins read lighter.
  float mid = smoothstep(0.022, 0.0, abs(x));
  float lat = smoothstep(0.045, 0.0, abs(fract((y - abs(x) * 0.6) * 12.0) - 0.5)) * smoothstep(0.02, 0.1, abs(x));
  float net = smoothstep(0.66, 0.72, noise(vUv * vec2(70.0, 110.0)));
  float veins = max(mid, lat * 0.7) + net * 0.12;
  vec3 V = normalize(vView), N = normalize(vN);
  // Light through the blade: brighter toward the middle, darker toward the rim; a little mottling.
  float through = 0.12 + 0.4 * (1.0 - rel * rel) + 0.15 * (noise(vUv * 6.0) - 0.5);
  vec3 col = mix(uLeaf, uBack, through);
  col = mix(col, uBack * 1.35, veins * 0.45 * (1.0 - uMap));
  // Wet sheen.
  vec3 L = normalize(vec3(0.3, 0.8, 0.5));
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 28.0) * (0.4 + 0.6 * noise(vUv * 14.0));
  col += uLight * spec * 1.4 + uLight * pow(max(dot(N, V), 0.0), 6.0) * 0.06;
  // Rain beads: a few round drops per cell, lit from above with a dark rim.
  vec2 g = vUv * vec2(26.0, 44.0);
  vec2 cell = floor(g), f = fract(g);
  vec2 c = 0.25 + 0.5 * hash2(cell);
  float r = 0.12 + 0.22 * hash(cell + 7.0);
  float d = length(f - c) / r;
  float has = step(0.55, hash(cell + 3.0)) * uWet;
  float bead = (1.0 - smoothstep(0.85, 1.0, d)) * has;
  float hi = smoothstep(0.45, 0.0, length(f - c + vec2(0.25, -0.3) * r) / r) * has;
  col = mix(col, col * 0.6, bead * smoothstep(0.6, 1.0, d));
  col += vec3(1.0, 0.97, 0.9) * hi * 0.9;
  // The map (X05): the blade goes dark and translucent; a network of veins glows gold like a city's roads, with a
  // few contour lines drifting across.
  vec2 q = vUv * vec2(9.0, 14.0);
  vec2 ci = floor(q), cf = fract(q);
  float d1 = 9.0, d2 = 9.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j));
    vec2 pt = o + 0.15 + 0.7 * hash2(ci + o) - cf;
    float dd = dot(pt, pt);
    if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd;
  }
  float web = 1.0 - smoothstep(0.0, 0.06, sqrt(d2) - sqrt(d1));
  float n1 = noise(vUv * 2.5) * 5.0 + noise(vUv * 7.0) * 0.5;
  float contour = 1.0 - smoothstep(0.0, 0.05, 0.5 - abs(fract(n1) - 0.5));
  float roads = max(mid, web * 0.75);
  col = mix(col, vec3(0.012, 0.03, 0.014) + col * 0.08, uMap);
  col += uGold * (roads * 1.1 + contour * 0.18) * uMap;
  col *= mix(1.0, 0.4, uNight);
  float edgeFade = smoothstep(0.0, 0.03, hw - abs(x));
  gl_FragColor = vec4(col, edgeFade);
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

/** A giant leaf (procedural blade, veins, rain beads, backlit). With `map`, its veins glow as a gold contour map (X05). */
export function Leaf({ position, rotation, size, bend = 0.25, map = 0, calm, night, sway = 0.03 }: {
  position: THREE.Vector3Tuple | THREE.Vector3; rotation?: THREE.Euler | THREE.EulerTuple; size: [number, number]; bend?: number; map?: number; calm: boolean; night: boolean; sway?: number;
}) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, side: THREE.DoubleSide, transparent: true, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uLeaf: { value: new THREE.Color("#040B03") }, uBack: { value: new THREE.Color("#18300D") }, uGold: { value: new THREE.Color("#F2C25E") },
      uLight: { value: new THREE.Color("#FFE7A8") }, uBend: { value: bend }, uTime: { value: 0 }, uSway: { value: sway }, uMap: { value: map },
      uWet: { value: 1 }, uNight: { value: 0 },
    }]),
  }), [bend, map, sway]);
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = calm ? 0 : clock.elapsedTime;
    mat.uniforms.uNight.value = night ? 1 : 0;
  });
  return (
    <mesh position={position} rotation={rotation} material={mat}>
      <planeGeometry args={[size[0], size[1], 24, 32]} />
    </mesh>
  );
}

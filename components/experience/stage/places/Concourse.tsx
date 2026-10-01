"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { interaction } from "../../actions";
import type { Runtime } from "../../journey";
import { route } from "../../route";
import { thingEvents } from "../common";
import { CONC_OPENINGS_Z } from "../layout";
import { lightSurface, placeColours, plaster, stone, type Theme } from "../look";

const PLACE = 4;
const OPENINGS = 13;
const W = 64, D = 44, HH = 13;
// The concourse faces the camera's line of sight at this place.
const CENTER: [number, number, number] = [12, 0, -186];
const ROT_Y = -0.83;
const GAP = 4.5;
const HALF = 1.5;
const OPEN_X = (k: number) => -2.2 + (k - 6) * GAP;

const STREAM_VERT = /* glsl */ `
uniform float uTime; uniform float uLaunch[6]; uniform float uPixelRatio; uniform float uSize;
uniform vec3 uTargets[${OPENINGS}];
attribute vec4 aSeed;
varying float vGlow;
void main() {
  // Each point rides one stream: from the Idea (near the camera's side) out to one of the thirteen openings.
  int k = int(aSeed.x);
  vec3 a = vec3(0.0, 1.6, 10.0);
  vec3 b = uTargets[k];
  float t = fract(aSeed.y + uTime * (0.045 + aSeed.z * 0.03));
  vec3 mid = mix(a, b, 0.5) + vec3(sin(aSeed.w * 6.28) * 5.0, 2.2 + aSeed.w * 3.0, 0.0);
  vec3 p = mix(mix(a, mid, t), mix(mid, b, t), t);
  p += vec3(sin(t * 12.0 + aSeed.w * 30.0), cos(t * 9.0 + aSeed.w * 21.0), 0.0) * 0.12;
  // Launch waves travel along every stream.
  float wave = 0.0;
  for (int i = 0; i < 6; i++) {
    float age = uTime - uLaunch[i];
    if (age > 0.0 && age < 3.5) wave += exp(-pow((t - age / 3.0) * 9.0, 2.0)) * (1.0 - age / 3.5);
  }
  vGlow = 0.35 + min(1.0, wave) * 0.65;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * uPixelRatio * (0.6 + aSeed.z) * (1.0 + wave * 1.4) / -mv.z, 9.0 * uPixelRatio);
}`;
const STREAM_FRAG = /* glsl */ `
uniform vec3 uGold; uniform vec3 uBright;
varying float vGlow;
void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  gl_FragColor = vec4(mix(uGold, uBright, vGlow), smoothstep(0.5, 0.1, r) * (0.45 + 0.55 * vGlow));
}`;

/**
 * The Concourse (no world colour, gold the only accent): a vast bright hall of pale stone. The Idea bursts into
 * thousands of gold streams that run out through thirteen tall openings, one for each industry. Launch sends a wave
 * through every stream.
 */
export function Concourse({ theme, rtRef, mobile, onEnter }: { theme: Theme; rtRef: { current: Runtime }; mobile: boolean; onEnter: (id: string) => void }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    wall: plaster(c.wall),
    floor: stone(c.floor),
    opening: lightSurface(theme === "light" ? "#fff7e8" : "#f1dfb9", theme === "light" ? 1 : 0.85),
  }), [c, theme]);
  // The middle opening sits exactly where the route walks out of the hall (local x −2.2).
  const targets = useMemo(() => Array.from({ length: OPENINGS }, (_, k) => new THREE.Vector3(OPEN_X(k), 2.6, CONC_OPENINGS_Z)), []);
  const count = mobile ? 2200 : 6500;
  const stream = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const r = (n: number) => { const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
      seed[i * 4] = i % OPENINGS; seed[i * 4 + 1] = r(1); seed[i * 4 + 2] = r(2); seed[i * 4 + 3] = r(3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, 0), 60);
    const m = new THREE.ShaderMaterial({
      vertexShader: STREAM_VERT,
      fragmentShader: STREAM_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 }, uLaunch: { value: new Array(6).fill(-99) }, uPixelRatio: { value: 1 }, uSize: { value: mobile ? 48 : 64 },
        uTargets: { value: targets }, uGold: { value: new THREE.Color("#c9a45c") }, uBright: { value: new THREE.Color("#f0d49a") },
      },
    });
    return { g, m };
  }, [count, mobile, targets]);

  useFrame(({ clock, gl }) => {
    const u = stream.m.uniforms;
    const t = clock.elapsedTime;
    u.uTime.value = t;
    u.uPixelRatio.value = gl.getPixelRatio();
    // Launch times arrive on the performance clock; convert to the stage clock.
    const now = performance.now();
    const arr = u.uLaunch.value as number[];
    for (let i = 0; i < 6; i++) {
      const l = interaction.launches[i];
      arr[i] = l == null ? -99 : t - (now - l) / 1000;
    }
  });

  const process = route[PLACE].things[0];
  const pEv = thingEvents(PLACE, process.id, rtRef, onEnter);
  return (
    <group position={CENTER} rotation={[0, ROT_Y, 0]}>
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
      </mesh>
      {/* The far wall with thirteen tall openings of light. */}
      {Array.from({ length: OPENINGS + 1 }, (_, k) => {
        const x0 = k === 0 ? -W / 2 : OPEN_X(k - 1) + HALF;
        const x1 = k === OPENINGS ? W / 2 : OPEN_X(k) - HALF;
        return (
          <mesh key={k} material={mats.wall} position={[(x0 + x1) / 2, HH / 2, CONC_OPENINGS_Z]} castShadow receiveShadow>
            <boxGeometry args={[x1 - x0, HH, 1.2]} />
          </mesh>
        );
      })}
      <mesh material={mats.wall} position={[0, HH - 2, CONC_OPENINGS_Z]} castShadow>
        <boxGeometry args={[W, 4, 1.2]} />
      </mesh>
      {targets.map((p, k) => (
        <mesh key={k} material={mats.opening} position={[p.x, 4.6, CONC_OPENINGS_Z - 1.4]} {...(k === 6 ? pEv : {})}>
          <planeGeometry args={[HALF * 2, 9.2]} />
        </mesh>
      ))}
      {/* Low side walls; the hall is open to a high, diffuse sky. */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.wall} position={[s * W / 2, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 4, D]} />
        </mesh>
      ))}
      <points geometry={stream.g} material={stream.m} frustumCulled={false} />
    </group>
  );
}

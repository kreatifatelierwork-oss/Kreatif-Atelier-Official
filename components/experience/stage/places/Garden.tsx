"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BREATHS, interaction } from "../../actions";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { thingEvents } from "../common";
import { GARDEN_POOL, GARDEN_STONES } from "../layout";
import { placeColours, plaster, stone, type Theme } from "../look";

const PLACE = 6;
const POOL_R = 6.2;

const RIPPLE_VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const RIPPLE_FRAG = /* glsl */ `
uniform float uTime; uniform float uCalm; uniform float uLattice; uniform vec3 uLine; uniform vec3 uGlass;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  // Slow concentric ripples; breathing stills them.
  float w = sin(r * 26.0 - uTime * 1.6) * 0.5 + 0.5;
  float ring = smoothstep(0.86, 1.0, w) * (1.0 - r) * (1.0 - uCalm);
  // In the still water, the reflection of a glass lattice that is not in the garden (the next place).
  vec2 g = abs(fract(p * vec2(4.0, 7.0) + vec2(0.5, 0.0)) - 0.5);
  float lattice = (1.0 - smoothstep(0.0, 0.035, min(g.x, g.y))) * uLattice * (1.0 - r * 0.6);
  vec3 col = uLine * ring + uGlass * lattice;
  gl_FragColor = vec4(col, max(ring * 0.6, lattice * 0.8));
}`;

/**
 * The Garden Court (Asraya, fresh jade): the one place with no roof. A still round pool, smooth stones around it,
 * slow ripples and soft green-white sky light. Hold Breathe to breathe in, let go to breathe out: the water stills
 * and the light slows. After three breaths the pool is perfectly still, and its reflection shows a lattice of glass
 * that is not in the garden; the route dives through it into Rudra Yugen's world.
 */
export function Garden({ theme, rtRef }: { theme: Theme; rtRef: { current: Runtime } }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    ground: stone(c.floor),
    wall: plaster(c.wall),
    water: new THREE.MeshStandardMaterial({ color: theme === "light" ? "#bfe9d3" : "#06301f", roughness: 0.3, metalness: 0.5, envMapIntensity: 1.1 }),
    stone: new THREE.MeshStandardMaterial({ color: theme === "light" ? "#eef4f0" : "#c9d6cf", roughness: 0.5, envMapIntensity: 0.6, emissive: "#c9a45c", emissiveIntensity: 0 }),
  }), [c, theme]);
  const ripple = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: RIPPLE_VERT,
    fragmentShader: RIPPLE_FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 }, uCalm: { value: 0 }, uLattice: { value: 0 },
      uLine: { value: new THREE.Color(theme === "light" ? "#ffffff" : "#8fe8bd") }, uGlass: { value: new THREE.Color(theme === "light" ? "#0fb5e4" : "#5fd6f5") },
    },
  }), [theme]);
  const stones = useRef<(THREE.Mesh | null)[]>([]);
  const things = route[PLACE].things;
  const phase = useRef(0);
  const inhaled = useRef(false);

  useFrame((_, dt) => {
    // The breath: in while held (four seconds), out when released; a full in-and-out counts.
    const held = interaction.breathHeld;
    interaction.breath += ((held ? 1 : 0) - interaction.breath) * Math.min(1, dt / (held ? 1.6 : 1.4));
    if (interaction.breath > 0.9) inhaled.current = true;
    if (inhaled.current && interaction.breath < 0.12) { inhaled.current = false; interaction.breaths = Math.min(BREATHS, interaction.breaths + 1); }
    const still = interaction.breaths / BREATHS;
    const calm = Math.max(still, interaction.breath * 0.6);
    phase.current += dt * (1 - 0.8 * calm);
    const u = ripple.uniforms;
    u.uTime.value = phase.current;
    u.uCalm.value += (calm - u.uCalm.value) * Math.min(1, dt * 2);
    u.uLattice.value += ((still >= 1 ? 1 : 0) - u.uLattice.value) * Math.min(1, dt * 0.8);
    mats.water.roughness = 0.3 - 0.27 * u.uCalm.value;
    const hover = useUi.getState().hover;
    stones.current.forEach((m, k) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      const on = hover === things[k]?.id ? 0.4 : 0;
      mat.emissiveIntensity += (on - mat.emissiveIntensity) * Math.min(1, dt * 6);
    });
  });

  return (
    <group>
      <mesh material={mats.ground} position={[64, 0, -263]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 96]} />
      </mesh>
      {/* A low wall around the court, open where the route comes in from the arch and where it dives on. */}
      <group position={[64, 0.55, -263]} rotation={[-Math.PI / 2, 0, 0]}>
        {[[1.98, 2.0], [4.66, 2.92]].map(([from, len]) => (
          <mesh key={from} material={mats.wall} rotation={[0, 0, from]} castShadow receiveShadow>
            <torusGeometry args={[15, 0.45, 10, 72, len]} />
          </mesh>
        ))}
      </group>
      <group position={GARDEN_POOL}>
        <mesh material={mats.ground} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <ringGeometry args={[POOL_R, POOL_R + 0.7, 96]} />
        </mesh>
        <mesh material={mats.water} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[POOL_R, 96]} />
        </mesh>
        <mesh material={ripple} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[POOL_R * 2, POOL_R * 2]} />
        </mesh>
      </group>
      {GARDEN_STONES.map((p, k) => (
        <mesh
          key={k}
          ref={(m) => { stones.current[k] = m; }}
          material={mats.stone.clone()}
          position={[p[0], 0.42, p[2]]}
          scale={[1.15 - k * 0.08, 0.5, 0.9 + k * 0.05]}
          castShadow
          receiveShadow
          {...(things[k] ? thingEvents(PLACE, things[k].id, rtRef) : {})}
        >
          <sphereGeometry args={[1, 32, 20]} />
        </mesh>
      ))}
    </group>
  );
}

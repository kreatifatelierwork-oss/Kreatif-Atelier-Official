"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { interaction, STONES } from "../../actions";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { thingEvents } from "../common";
import { WATER_STONES } from "../layout";
import { lightSurface, placeColours, plaster, stone, type Theme } from "../look";
import { markShadows } from "../shadows";

const PLACE = 5;
// The court is laid along the route: local −z runs from the entry toward the arch.
const CENTER: [number, number, number] = [42, 0, -222.5];
const ROT_Y = -0.626;
const HALF_W = 11, Z_NEAR = 16, Z_FAR = -20, HH = 9;
const ARCH_W = 4.6, ARCH_H = 7.2;

/** The far wall as one piece with an arched opening (a rectangle with a round-topped hole). */
function archWallGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-HALF_W, 0); s.lineTo(HALF_W, 0); s.lineTo(HALF_W, HH); s.lineTo(-HALF_W, HH); s.lineTo(-HALF_W, 0);
  const h = new THREE.Path();
  const r = ARCH_W / 2;
  h.moveTo(-r, 0); h.lineTo(-r, ARCH_H - r); h.absarc(0, ARCH_H - r, r, Math.PI, 0, true); h.lineTo(r, 0); h.lineTo(-r, 0);
  s.holes.push(h);
  return new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 24 });
}

/**
 * The Water Court (Valora, sunrise coral): an indoor court of still water, a quiet study alcove on the near side and,
 * across the water, a tall arch blazing with coral light from outside. Lay a stone (or click the water) and stepping
 * stones rise along the route; when the path reaches the arch, the outside floods in. The four stones nearest the
 * arch are Valora's four offerings.
 */
export function WaterCourt({ theme, rtRef }: { theme: Theme; rtRef: { current: Runtime } }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    wall: plaster(c.wall),
    rim: stone(c.floor),
    water: new THREE.MeshStandardMaterial({ color: theme === "light" ? "#f2b49c" : "#3a140a", roughness: 0.07, metalness: 0.55, envMapIntensity: 1.1 }),
    stone: new THREE.MeshStandardMaterial({ color: theme === "light" ? "#f7ece6" : "#d9c9c0", roughness: 0.55, envMapIntensity: 0.6, emissive: "#c9a45c", emissiveIntensity: 0 }),
    outside: lightSurface("#ff8a5e", theme === "light" ? 1.05 : 1),
  }), [c, theme]);
  const arch = useMemo(archWallGeometry, []);
  const stones = useRef<(THREE.Mesh | null)[]>([]);
  const outside = useRef<THREE.Mesh>(null);
  const things = route[PLACE].things;

  useFrame((_, dt) => {
    const laid = interaction.stones;
    const hover = useUi.getState().hover;
    stones.current.forEach((m, k) => {
      if (!m) return;
      const up = k < laid ? 0.14 : -0.7;
      if (Math.abs(up - m.position.y) > 0.002) markShadows();
      m.position.y += (up - m.position.y) * Math.min(1, dt * 3.2);
      const off = k - (STONES - things.length);
      const lit = off >= 0 && hover === things[off]?.id ? 0.45 : 0;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity += (lit - mat.emissiveIntensity) * Math.min(1, dt * 6);
    });
    if (outside.current) {
      const k = laid / STONES;
      (outside.current.material as THREE.MeshBasicMaterial).color.set("#ff8a5e").multiplyScalar(1 + k * 0.55);
    }
  });

  // Clicking the water lays the next stone too.
  const lay = () => { if (Math.abs(rtRef.current.s - PLACE) < 0.3) interaction.stones = Math.min(STONES, interaction.stones + 1); };
  return (
    <group>
      <group position={CENTER} rotation={[0, ROT_Y, 0]}>
        <mesh material={mats.water} position={[0, 0.02, (Z_NEAR + Z_FAR) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={lay}>
          <planeGeometry args={[HALF_W * 2 - 2.4, Z_NEAR - Z_FAR - 1.2]} />
        </mesh>
        {/* The stone rim around the water. */}
        {[-1, 1].map((sd) => (
          <mesh key={sd} material={mats.rim} position={[sd * (HALF_W - 0.6), 0.1, (Z_NEAR + Z_FAR) / 2]} receiveShadow castShadow>
            <boxGeometry args={[1.2, 0.2, Z_NEAR - Z_FAR]} />
          </mesh>
        ))}
        {[-1, 1].map((sd) => (
          <mesh key={sd} material={mats.wall} position={[sd * HALF_W, HH / 2, (Z_NEAR + Z_FAR) / 2]} castShadow receiveShadow>
            <boxGeometry args={[0.9, HH, Z_NEAR - Z_FAR]} />
          </mesh>
        ))}
        <mesh geometry={arch} material={mats.wall} position={[0, 0, Z_FAR - 1]} castShadow receiveShadow />
        {/* The study alcove: a deep niche with a long bench. */}
        <group position={[-HALF_W + 2.2, 0, 9]}>
          <mesh material={mats.rim} position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[2.2, 0.9, 6]} /></mesh>
          <mesh material={mats.wall} position={[-0.6, 0.95, 0]} castShadow><boxGeometry args={[1, 0.12, 5.2]} /></mesh>
        </group>
        {/* Outside the arch: the coral light the court is lit by. */}
        <mesh ref={outside} material={mats.outside} position={[0, 6, Z_FAR - 6]}>
          <planeGeometry args={[30, 18]} />
        </mesh>
      </group>
      {WATER_STONES.map((p, k) => (
        <mesh
          key={k}
          ref={(m) => { stones.current[k] = m; }}
          material={k >= STONES - things.length ? mats.stone.clone() : mats.stone}
          position={[p[0], -0.7, p[2]]}
          castShadow
          receiveShadow
          {...(k >= STONES - things.length ? thingEvents(PLACE, things[k - (STONES - things.length)].id, rtRef) : {})}
        >
          <cylinderGeometry args={[k >= STONES - things.length ? 1.05 : 0.85, k >= STONES - things.length ? 1.15 : 0.95, 0.5, 40]} />
        </mesh>
      ))}
    </group>
  );
}

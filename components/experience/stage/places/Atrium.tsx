"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Runtime } from "../../journey";
import { goldMetal, lightSurface, placeColours, plaster, stone, type Theme } from "../look";

const R = 14;
const H = 22;
const GAP = 0.32;

/** The ✦ (the brand motif, never a logo): the four-pointed star as a thin gold form. */
function starShape() {
  const s = new THREE.Shape();
  const k = 0.16;
  s.moveTo(0, 1);
  s.quadraticCurveTo(k, k, 1, 0);
  s.quadraticCurveTo(k, -k, 0, -1);
  s.quadraticCurveTo(-k, -k, -1, 0);
  s.quadraticCurveTo(-k, k, 0, 1);
  return s;
}

/**
 * The Atrium: a tall round hall of pale plaster open to the sky through its oculus. One shaft of daylight falls on a
 * shallow well of light where the Idea first rises; a deep doorway leads toward the Studio Floor. It is also the
 * Gallery (the curved wall at golden hour) and the post-credits scene (dusk, the ✦ waiting where the Idea rose).
 */
export function Atrium({ theme, rtRef }: { theme: Theme; rtRef: { current: Runtime } }) {
  const c = useMemo(() => placeColours(0, theme), [theme]);
  const mats = useMemo(() => ({
    wall: plaster(c.wall),
    floor: stone(c.floor),
    well: lightSurface(theme === "light" ? "#fffaf0" : "#f4e6c4", theme === "light" ? 1 : 0.9),
    door: lightSurface("#e8c98a", theme === "light" ? 0.55 : 0.8),
    gold: goldMetal(),
  }), [c, theme]);
  const wallGeo = useMemo(() => new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI + GAP, Math.PI * 2 - GAP * 2), []);
  const star = useMemo(() => new THREE.ExtrudeGeometry(starShape(), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }), []);
  const starRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const s = rtRef.current.s;
    const g = starRef.current;
    if (!g) return;
    // The ✦ returns only for the post-credits scene.
    const k = Math.min(1, Math.max(0, (s - 9.4) / 0.6));
    g.visible = k > 0.001;
    g.scale.setScalar(0.42 * k * k * (3 - 2 * k));
    g.rotation.y = clock.elapsedTime * 0.25;
    g.position.y = 1.55 + Math.sin(clock.elapsedTime * 0.9) * 0.05;
  });

  // The doorway's returns: two thick wall ends either side of the gap, deep enough to read as a passage.
  const doorX = Math.sin(GAP) * R;
  const doorZ = -Math.cos(GAP) * R;
  return (
    <group>
      <mesh geometry={wallGeo} material={mats.wall} position={[0, H / 2, 0]} receiveShadow castShadow />
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[R, 96]} />
      </mesh>
      {/* The cornice around the oculus. */}
      <mesh material={mats.wall} position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[R - 0.4, 0.45, 12, 128]} />
      </mesh>
      {/* The well of light in the floor, ringed by a low stone lip. */}
      <mesh material={mats.floor} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <ringGeometry args={[1.75, 2.35, 96]} />
      </mesh>
      <mesh material={mats.well} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 96]} />
      </mesh>
      {/* The doorway toward the Studio Floor: two returns and a lintel, its reveals softly lit in gold. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh material={mats.wall} position={[side * (doorX + 0.9), 4.5, doorZ - 1.6]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 9, 4.4]} />
          </mesh>
          <mesh material={mats.door} position={[side * doorX, 4.2, doorZ - 1.6]} rotation={[0, -side * Math.PI / 2, 0]}>
            <planeGeometry args={[4.2, 8.4]} />
          </mesh>
        </group>
      ))}
      <mesh material={mats.wall} position={[0, 9.6, doorZ - 1.6]} castShadow>
        <boxGeometry args={[doorX * 2 + 3.6, 1.2, 4.4]} />
      </mesh>
      {/* A long, low bench along the Gallery's wall. */}
      <mesh material={mats.wall} position={[-10.6, 0.3, 4.2]} rotation={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.6, 7]} />
      </mesh>
      <group ref={starRef} position={[0, 1.55, 0]} visible={false}>
        <mesh geometry={star} material={mats.gold} position={[0, 0, -0.04]} castShadow />
      </group>
    </group>
  );
}

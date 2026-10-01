"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { thingEvents } from "../common";
import { STUDIO_PANELS } from "../layout";
import { lightSurface, placeColours, plaster, stone, type Theme } from "../look";
import { markShadows } from "../shadows";

const PLACE = 1;
const A = new THREE.Vector3(0, 0, -40);
const W = 32, D = 44, HH = 10;

/** One About panel: a tall slab that is a line drawing until you look at it, then builds itself into plaster. */
function Panel({ k, id, theme, rtRef, onEnter, built0 }: { k: number; id: string; theme: Theme; rtRef: { current: Runtime }; onEnter: (id: string) => void; built0: number }) {
  const geo = useMemo(() => new THREE.BoxGeometry(2.4, 3.6, 0.2), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const face = useMemo(() => new THREE.MeshStandardMaterial({ color: c.wall.clone().offsetHSL(0, 0, theme === "light" ? 0.03 : 0.04), roughness: 0.9, transparent: true, opacity: built0 }), [c, theme, built0]);
  const line = useMemo(() => new THREE.LineBasicMaterial({ color: theme === "light" ? "#2a2e38" : "#d9d3c7", transparent: true, opacity: 0.8 }), [theme]);
  const built = useRef(built0);
  const mesh = useRef<THREE.Mesh>(null);
  const ev = useMemo(() => thingEvents(PLACE, id, rtRef, onEnter), [id, rtRef, onEnter]);
  const p = STUDIO_PANELS[k];
  useFrame((_, dt) => {
    const u = useUi.getState();
    const want = u.hover === id || u.room === id || built0 > 0.5 ? 1 : built.current > 0.98 ? 1 : 0;
    if (Math.abs(want - built.current) > 0.002) markShadows();
    built.current += (want - built.current) * Math.min(1, dt * 2.2);
    face.opacity = built.current;
    face.depthWrite = built.current > 0.95;
    line.opacity = 0.85 * (1 - built.current * 0.85);
    if (mesh.current) mesh.current.castShadow = built.current > 0.6;
  });
  return (
    <group position={[p[0], 1.8, p[2]]} rotation={[0, -0.32, 0]}>
      <mesh ref={mesh} geometry={geo} material={face} receiveShadow {...ev} />
      <lineSegments geometry={edges} material={line} />
    </group>
  );
}

/**
 * The Studio Floor: a long, pale working hall lit from high side windows, with low tables and the four About panels.
 * At the far end a tall doorway is full of indigo light: the way into Aurelius's world.
 */
export function Studio({ theme, rtRef, onEnter }: { theme: Theme; rtRef: { current: Runtime }; onEnter: (id: string) => void }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    wall: plaster(c.wall),
    floor: stone(c.floor),
    table: plaster(c.wall.clone().offsetHSL(0, 0, theme === "light" ? -0.04 : 0.03), 0.7),
    window: lightSurface(theme === "light" ? "#fffdf6" : "#f2e6cc", 1),
    indigo: lightSurface("#3d4bff", theme === "light" ? 1.15 : 1),
  }), [c, theme]);
  const things = route[PLACE].things;
  return (
    <group>
      <group position={A.toArray()}>
        <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[W, D]} />
        </mesh>
        {/* The left wall is pierced by tall windows (the light comes from there); the right wall is plain. */}
        {Array.from({ length: 6 }, (_, i) => (
          <group key={i} position={[-W / 2, 0, -D / 2 + 3.6 + i * 7.3]}>
            <mesh material={mats.wall} position={[0, HH / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, HH, 3.6]} />
            </mesh>
            <mesh material={mats.window} position={[-0.42, 5.2, 3.65]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[3.7, 7.6]} />
            </mesh>
          </group>
        ))}
        <mesh material={mats.wall} position={[W / 2, HH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, HH, D]} />
        </mesh>
        {/* A ceiling of long beams with light between them. */}
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} material={mats.wall} position={[-W / 2 + 2 + i * 3.6, HH + 0.4, 0]} castShadow>
            <boxGeometry args={[0.9, 0.8, D]} />
          </mesh>
        ))}
        {/* Long low tables on the left of the floor. */}
        {[[-8.5, -6], [-9.5, -16]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} rotation={[0, 0.04, 0]}>
            <mesh material={mats.table} position={[0, 0.82, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.12, 7.5]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={mats.table} position={[0, 0.4, s * 3.2]} castShadow>
                <boxGeometry args={[1.8, 0.8, 0.14]} />
              </mesh>
            ))}
          </group>
        ))}
        {/* The far wall, with the tall doorway of indigo light toward the Drafting Hall. */}
        <mesh material={mats.wall} position={[-11, HH / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[10, HH, 0.8]} />
        </mesh>
        <mesh material={mats.wall} position={[7, HH / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[18, HH, 0.8]} />
        </mesh>
        <mesh material={mats.wall} position={[-4, HH - 0.9, -D / 2]} castShadow>
          <boxGeometry args={[4, 1.8, 0.8]} />
        </mesh>
        <mesh material={mats.indigo} position={[-4, 4.1, -D / 2 - 1.4]}>
          <planeGeometry args={[4, 8.2]} />
        </mesh>
      </group>
      {things.map((t, k) => (
        <Panel key={t.id} k={k} id={t.id} theme={theme} rtRef={rtRef} onEnter={onEnter} built0={k < 2 ? 1 : 0} />
      ))}
    </group>
  );
}

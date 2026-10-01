"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { FilmState } from "@/components/film/state";
import { interaction } from "../../actions";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { makeBuildMaterial, makeBuildUniforms, thingEvents } from "../common";
import { DRAFT_FORMATS, DRAFT_MODELS, DRAFT_SERVICES, DRAFT_TABLE } from "../layout";
import { lightSurface, placeColours, plaster, stone, type Theme } from "../look";
import { markShadows } from "../shadows";

const PLACE = 2;
const FLIGHTS = 7;
const LENS_PX = 110;
// The hall (world units): x −27..3, z −64..−106, 26 high. The route leaves through the open back of the left wall.
const X0 = -27, X1 = 3, Z0 = -64, Z1 = -106, HH = 26;

/** One flight of eight steps, its origin at the bottom step. */
function flightGeometry() {
  const steps = Array.from({ length: 8 }, (_, j) => new THREE.BoxGeometry(2.2, 0.36, 0.42).translate(0, j * 0.36 + 0.18, -j * 0.42 - 0.21));
  const g = mergeGeometries(steps)!;
  steps.forEach((s) => s.dispose());
  return g;
}

const ease = (t: number) => t * t * (3 - 2 * t);

/** Seeded scatter: where each flight floats before the angle is found. */
const SCATTER = Array.from({ length: FLIGHTS }, (_, k) => {
  const r = (n: number) => { const x = Math.sin((k + 1) * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
  return {
    pos: new THREE.Vector3((r(1) - 0.5) * 12, 3 + r(2) * 9, (r(3) - 0.5) * 8),
    rot: new THREE.Euler((r(4) - 0.5) * 1.6, (r(5) - 0.5) * 2.4, (r(6) - 0.5) * 1.2),
  };
});

/**
 * The Drafting Hall (Aurelius, royal indigo): a tall hall still drawn in construction lines, lit by one tall window.
 * Stair flights float at odd angles, going nowhere. Find the angle (hold the button, or drag across the scene) and
 * they turn into one continuous stair up to the window; then the hall builds itself from the floor up. Until then
 * the Lens shows the finished hall through the drawing, wherever the pointer is.
 */
export function Drafting({ theme, rtRef, filmRef, onEnter }: { theme: Theme; rtRef: { current: Runtime }; filmRef: { current: FilmState }; onEnter: (id: string) => void }) {
  const { gl, size } = useThree();
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const u = useMemo(() => makeBuildUniforms(0.02, HH), []);
  const mats = useMemo(() => {
    const wallC = c.wall.clone();
    return {
      wall: makeBuildMaterial({ color: wallC, roughness: 0.9, envMapIntensity: 0.35 }, u),
      flight: makeBuildMaterial({ color: wallC.clone().offsetHSL(0, 0, theme === "light" ? 0.04 : 0.05), roughness: 0.85, envMapIntensity: 0.4 }, u),
      floor: stone(c.floor),
      model: plaster(new THREE.Color(theme === "light" ? "#f6f7fb" : "#d9dcef"), 0.8),
      table: plaster(c.wall.clone().offsetHSL(0, 0, theme === "light" ? -0.06 : 0.04), 0.75),
      line: new THREE.LineBasicMaterial({ color: theme === "light" ? "#3d4bff" : "#8d97ff", transparent: true, opacity: 0.85 }),
      window: lightSurface(theme === "light" ? "#c9cdff" : "#7b86ff", 1.1),
    };
  }, [c, theme, u]);
  const flightGeo = useMemo(flightGeometry, []);
  const flightEdges = useMemo(() => new THREE.EdgesGeometry(flightGeo, 30), [flightGeo]);

  // Walls as boxes (so the window is a real opening the light falls through), and their construction lines.
  const walls = useMemo(() => {
    const W = X1 - X0, Dd = Z0 - Z1, cx = (X0 + X1) / 2, cz = (Z0 + Z1) / 2;
    const list: { size: [number, number, number]; pos: [number, number, number] }[] = [
      { size: [0.9, HH, Dd], pos: [X1, HH / 2, cz] }, // right
      { size: [0.9, HH, 28], pos: [X0, HH / 2, Z0 - 14] }, // left, front part (the back part is the way out)
      { size: [(W - 3) / 2, HH, 0.9], pos: [X0 + (W - 3) / 4, HH / 2, Z1] }, // back, left of the window
      { size: [(W - 3) / 2, HH, 0.9], pos: [X1 - (W - 3) / 4, HH / 2, Z1] }, // back, right of the window
      { size: [3, 4, 0.9], pos: [cx, 2, Z1] }, // under the window
      { size: [3, 6, 0.9], pos: [cx, HH - 3, Z1] }, // over the window
    ];
    return list.map((w) => {
      const g = new THREE.BoxGeometry(...w.size);
      return { ...w, g, e: new THREE.EdgesGeometry(g) };
    });
  }, []);
  // Faint drafting grid on the right and back walls.
  const grid = useMemo(() => {
    const pts: number[] = [];
    for (let y = 2; y < HH; y += 3) { pts.push(X1 - 0.5, y, Z0, X1 - 0.5, y, Z1); pts.push(X0, y, Z1 + 0.5, X1, y, Z1 + 0.5); }
    for (let z = Z0; z > Z1; z -= 3.5) pts.push(X1 - 0.5, 0, z, X1 - 0.5, HH, z);
    for (let x = X0; x < X1; x += 3.5) pts.push(x, 0, Z1 + 0.5, x, HH, Z1 + 0.5);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const gridMat = useMemo(() => new THREE.LineBasicMaterial({ color: theme === "light" ? "#3d4bff" : "#8d97ff", transparent: true, opacity: 0.18 }), [theme]);

  const flights = useRef<(THREE.Group | null)[]>([]);
  const models = useRef<(THREE.Group | null)[]>([]);
  const built = useRef(0);
  const lastAngle = useRef(-1);
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), qa: new THREE.Quaternion(), p: new THREE.Vector3() }), []);
  const aligned = useMemo(() => Array.from({ length: FLIGHTS }, (_, k) => new THREE.Vector3(DRAFT_TABLE[0] - 1.5 - k * 0.25, k * 2.88, DRAFT_TABLE[2] - 5 - k * 3.36)), []);

  // Drag across the scene (not the captions) to turn the flights into line.
  useEffect(() => {
    let last: number | null = null;
    const here = () => Math.abs(rtRef.current.s - PLACE) < 0.3 && !useUi.getState().room;
    const down = (e: PointerEvent) => { last = here() && (e.target as HTMLElement).tagName === "CANVAS" ? e.clientX : null; };
    const move = (e: PointerEvent) => {
      if (last == null || !here()) return;
      interaction.angle = Math.min(1, interaction.angle + Math.abs(e.clientX - last) / 900);
      last = e.clientX;
    };
    const up = () => { last = null; };
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => { window.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [rtRef]);

  useFrame((_, dt) => {
    const s = rtRef.current.s;
    const here = Math.abs(s - PLACE) < 0.5;
    if (interaction.angleHeld) interaction.angle = Math.min(1, interaction.angle + dt / 2.6);
    const a = interaction.angle;
    if (a >= 1) built.current = Math.min(1, built.current + dt / 2.8);
    if (here && (lastAngle.current !== a || (built.current > 0 && built.current < 1))) markShadows();
    lastAngle.current = a;
    interaction.built = built.current;
    u.uBuilt.value = ease(built.current);
    // The Lens: the finished hall shows through the drawing around the pointer.
    const p = filmRef.current.pointer;
    const dpr = gl.getPixelRatio();
    const lensOn = here && built.current < 1 && p.active && !useUi.getState().room;
    u.uLens.value.set(p.x * dpr, (size.height - p.y) * dpr, lensOn ? LENS_PX * dpr : 0);
    mats.line.opacity = 0.85 * (1 - 0.8 * ease(built.current));
    gridMat.opacity = 0.18 * (1 - ease(built.current));
    // The flights turn into line, one after another.
    flights.current.forEach((g, k) => {
      if (!g) return;
      const t = ease(Math.min(1, Math.max(0, a * 1.6 - k * 0.09)));
      tmp.p.copy(SCATTER[k].pos).add(aligned[k]).lerp(aligned[k], t);
      g.position.copy(tmp.p);
      tmp.q.setFromEuler(SCATTER[k].rot);
      g.quaternion.copy(tmp.q.slerp(tmp.qa.identity(), t));
    });
    // Offerings lift when hovered.
    const hover = useUi.getState().hover;
    models.current.forEach((g, k) => {
      if (!g) return;
      const on = hover === route[PLACE].things[k]?.id ? 1 : 0;
      g.position.y += ((DRAFT_MODELS[k][1] + on * 0.22) - g.position.y) * Math.min(1, dt * 8);
      g.rotation.y += dt * (0.15 + on * 0.6);
    });
  });

  const things = route[PLACE].things;
  const offerings = things.filter((t) => !t.room);
  const services = things.find((t) => t.id === "services")!;
  const formats = things.find((t) => t.id === "engagement-models")!;
  const sEv = thingEvents(PLACE, services.id, rtRef, onEnter);
  const fEv = thingEvents(PLACE, formats.id, rtRef, onEnter);
  return (
    <group>
      <mesh material={mats.floor} position={[(X0 + X1) / 2, 0, (Z0 + Z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[X1 - X0, Z0 - Z1]} />
      </mesh>
      {walls.map((w, i) => (
        <group key={i} position={w.pos}>
          <mesh geometry={w.g} material={mats.wall} castShadow receiveShadow />
          <lineSegments geometry={w.e} material={mats.line} />
        </group>
      ))}
      <lineSegments geometry={grid} material={gridMat} />
      {/* The one light: the sky beyond the tall window. */}
      <mesh material={mats.window} position={[(X0 + X1) / 2, 13, Z1 - 3]}>
        <planeGeometry args={[9, 22]} />
      </mesh>
      {Array.from({ length: FLIGHTS }, (_, k) => (
        <group key={k} ref={(g) => { flights.current[k] = g; }}>
          <mesh geometry={flightGeo} material={mats.flight} castShadow receiveShadow />
          <lineSegments geometry={flightEdges} material={mats.line} />
        </group>
      ))}
      {/* The drafting table and the four models of what Aurelius does. */}
      <group position={DRAFT_TABLE}>
        <mesh material={mats.table} position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.4, 0.1, 1.5]} />
        </mesh>
        {[-2.8, 2.8].map((x) => (
          <mesh key={x} material={mats.table} position={[x, 0.45, 0]} castShadow>
            <boxGeometry args={[0.12, 0.9, 1.3]} />
          </mesh>
        ))}
      </group>
      {offerings.map((t, k) => (
        <group key={t.id} ref={(g) => { models.current[k] = g; }} position={DRAFT_MODELS[k]} {...thingEvents(PLACE, t.id, rtRef)}>
          <Model k={k} material={mats.model} />
        </group>
      ))}
      {/* Our Services: a lectern with the six services as a stack of sheets. */}
      <group position={DRAFT_SERVICES} {...sEv}>
        <mesh material={mats.table} position={[0, -0.6, 0]} castShadow receiveShadow><boxGeometry args={[1.1, 1.2, 0.8]} /></mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} material={mats.model} position={[0, 0.05 + i * 0.035, 0]} rotation={[0, i * 0.05, 0]} castShadow>
            <boxGeometry args={[0.9, 0.025, 0.62]} />
          </mesh>
        ))}
      </group>
      {/* Engagement Models: three stacked slabs, one per model. */}
      <group position={DRAFT_FORMATS} {...fEv}>
        {[1.4, 1.1, 0.8].map((w, i) => (
          <mesh key={i} material={i === 1 ? mats.model : mats.table} position={[0, -0.7 + i * 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.4, w * 0.7]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Abstract maquettes (never icons): a folded plane, a stepped block, a curved shell, an open frame. */
function Model({ k, material }: { k: number; material: THREE.Material }) {
  const frame = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.42, 0.42, 0.42)), []);
  if (k === 0) return (
    <group>
      <mesh material={material} position={[-0.1, 0.12, 0]} rotation={[0, 0, 0.6]} castShadow><boxGeometry args={[0.32, 0.02, 0.36]} /></mesh>
      <mesh material={material} position={[0.12, 0.12, 0]} rotation={[0, 0, -0.6]} castShadow><boxGeometry args={[0.32, 0.02, 0.36]} /></mesh>
    </group>
  );
  if (k === 1) return (
    <group>
      {[0, 1, 2].map((i) => <mesh key={i} material={material} position={[0, 0.05 + i * 0.1, -i * 0.06]} castShadow><boxGeometry args={[0.38, 0.1, 0.36 - i * 0.1]} /></mesh>)}
    </group>
  );
  if (k === 2) return <mesh material={material} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.2, 0.05, 12, 32, Math.PI]} /></mesh>;
  return (
    <lineSegments geometry={frame} position={[0, 0.22, 0]}>
      <lineBasicMaterial color="#c9a45c" />
    </lineSegments>
  );
}

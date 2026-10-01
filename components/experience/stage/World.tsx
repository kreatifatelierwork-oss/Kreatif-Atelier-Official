"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { FilmState } from "@/components/film/state";
import { Idea } from "@/components/film/stage/Idea";
import { experienceConfig as X } from "@/lib/config";
import type { Runtime } from "../journey";
import { LAST } from "../route";
import { MONUMENT } from "./layout";
import { PlaceLight } from "./Light";
import { Atrium } from "./places/Atrium";
import { Concourse } from "./places/Concourse";
import { Drafting } from "./places/Drafting";
import { Garden } from "./places/Garden";
import { Lattice } from "./places/Lattice";
import { Projection } from "./places/Projection";
import { Roof } from "./places/Roof";
import { Studio } from "./places/Studio";
import { WaterCourt } from "./places/WaterCourt";

type Props = {
  rtRef: { current: Runtime };
  filmRef: { current: FilmState };
  theme: "light" | "dark";
  mobile: boolean;
  calm: boolean;
  riseAtRef: { current: number | null };
  onEnter: (thing: string) => void;
};

/** Where the Idea floats in each frame (distance ahead, right, up from the camera's hold), clear of the caption. */
const IDEA_FRAMING: [number, number, number][] = [
  [8, 1.7, 0.2], // Atrium: right of the title
  [12, 1.0, 1.7], // Studio Floor: high, right of centre, above the panels
  [10, 2.3, -0.4], // Drafting Hall: right of centre, clear of the window (caption left)
  [10, 2.4, 0.6], // Projection Hall: right (caption lower left)
  [12, 2.6, -0.8], // Concourse: low right, where the streams begin
  [10, 2.6, 0.2], // Water Court: right (caption left)
  [11, 2.6, 1.9], // Garden Court: high right (caption centred low)
  [10, -3, 1.2], // Glass Lattice: left (caption right)
  [24, 6, 0], // Roof: it condenses into the monument instead
  [9, 0, 0], // Gallery (hidden)
  [9, 0, 0], // Post-credits (hidden)
];
/** The Idea's form per place: raw → blueprint → story → movement → people → futures → monument. */
const FORM = [0, 0, 1, 2, 3, 4, 4, 5, 6, 6, 6];

/** Draws a place only while you are near it (and every place from the Roof, where the whole world is in view). */
function Near({ index, rtRef, children }: { index: number; rtRef: { current: Runtime }; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = rtRef.current.s;
    const roof = s > 7.15 && s < 8.85;
    const near = index === 0 ? s < 1.7 || s > 8.2 : Math.abs(s - index) < 1.7;
    if (g.current) g.current.visible = near || (roof && index > 0 && index < 8) || (index === 8 && s > 6.8 && s < 9.6);
  });
  return <group ref={g}>{children}</group>;
}

/**
 * The Atelier: every place on the route, built around the fixed camera path; one light per place; the gold Idea
 * travelling with you, changing form act by act, and condensing into the solid gold monument at the Roof.
 */
export function World({ rtRef, filmRef, theme, mobile, calm, riseAtRef, onEnter }: Props) {
  const idea = useRef<THREE.Group>(null);
  const formRef = useRef(0);
  const fadeRef = useRef(1);
  const framing = useMemo(() => X.camera.map((c, i) => {
    const pos = new THREE.Vector3(...c.pos);
    const dir = new THREE.Vector3(...c.look).sub(pos).normalize();
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, dir).normalize();
    const [d, r, u] = IDEA_FRAMING[i];
    return pos.addScaledVector(dir, d).addScaledVector(right, r).addScaledVector(up, u);
  }), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const monument = useMemo(() => new THREE.Vector3(...MONUMENT), []);

  useFrame(() => {
    const s = rtRef.current.s;
    const i = Math.min(LAST - 1, Math.floor(s));
    const f = Math.min(1, Math.max(0, s - i));
    const e = f * f * (3 - 2 * f);
    const g = idea.current;
    if (!g) return;
    tmp.copy(framing[i]).lerp(framing[i + 1], e);
    // Rising to the Roof, the Idea flies to the monument and its light condenses into gold.
    if (s > 7 && s < 8.5) tmp.lerp(monument, Math.min(1, Math.max(0, (s - 7.2) / 0.8)));
    g.position.copy(tmp);
    formRef.current = FORM[Math.round(s)];
    const fade = s < 7.4 ? 1 : s < 8 ? 1 - (s - 7.4) / 0.6 : 0;
    fadeRef.current = fade;
    g.visible = fade > 0.01;
  });

  return (
    <>
      <PlaceLight rtRef={rtRef} theme={theme} mobile={mobile} />
      <Near index={0} rtRef={rtRef}><Atrium theme={theme} rtRef={rtRef} /></Near>
      <Near index={1} rtRef={rtRef}><Studio theme={theme} rtRef={rtRef} onEnter={onEnter} /></Near>
      <Near index={2} rtRef={rtRef}><Drafting theme={theme} rtRef={rtRef} filmRef={filmRef} onEnter={onEnter} /></Near>
      <Near index={3} rtRef={rtRef}><Projection theme={theme} rtRef={rtRef} filmRef={filmRef} onEnter={onEnter} /></Near>
      <Near index={4} rtRef={rtRef}><Concourse theme={theme} rtRef={rtRef} mobile={mobile} onEnter={onEnter} /></Near>
      <Near index={5} rtRef={rtRef}><WaterCourt theme={theme} rtRef={rtRef} /></Near>
      <Near index={6} rtRef={rtRef}><Garden theme={theme} rtRef={rtRef} /></Near>
      <Near index={7} rtRef={rtRef}><Lattice theme={theme} rtRef={rtRef} mobile={mobile} /></Near>
      <Near index={8} rtRef={rtRef}><Roof theme={theme} rtRef={rtRef} /></Near>
      <group ref={idea} scale={0.9}>
        <Idea stateRef={filmRef} palette={theme === "light" ? "a" : "b"} mobile={mobile} calm={calm} riseAtRef={riseAtRef} formRef={formRef} fadeRef={fadeRef} />
      </group>
    </>
  );
}

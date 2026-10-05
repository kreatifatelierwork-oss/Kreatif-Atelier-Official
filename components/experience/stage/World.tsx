"use client";

import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useUi, type Runtime } from "../journey";
import { LAST, route } from "../route";
import { Ribbon } from "./Ribbon";
import { Atlas } from "./sets/Atlas";
import { Canopy } from "./sets/Canopy";
import { Jungle } from "./sets/Jungle";
import { Land, LAND_PLATES } from "./sets/Lands";
import { Sky, sunAt } from "./Sky";

type Props = {
  rtRef: { current: Runtime };
  theme: "light" | "dark";
  mobile: boolean;
  calm: boolean;
  riseAtRef: { current: number | null };
};

/** The one light per chapter: the sun's colour and strength, and the sky fill. */
const LIGHT: { sun: string; k: number; sky: string; ground: string; fill: number }[] = [
  { sun: "#FFE2A6", k: 0.9, sky: "#A9BC93", ground: "#10180C", fill: 0.55 }, // The Seed (under the canopy)
  { sun: "#FFE9BC", k: 1.6, sky: "#C2D6B8", ground: "#1A2614", fill: 0.75 }, // The Climb
  { sun: "#FFD49A", k: 2.6, sky: "#F2D8B0", ground: "#3B4A2A", fill: 1.0 }, // Above the Canopy
  { sun: "#FFC98A", k: 2.6, sky: "#F2D2AC", ground: "#3A3A30", fill: 1.0 }, // The Five Peaks
  { sun: "#FFA866", k: 2.0, sky: "#4B4C9A", ground: "#2A1A12", fill: 0.7 }, // Aurelius
  { sun: "#FF6FB0", k: 1.6, sky: "#4A1036", ground: "#14060E", fill: 0.6 }, // GGP
  { sun: "#FFB384", k: 2.2, sky: "#F2A07C", ground: "#1E4A50", fill: 0.9 }, // Valora
  { sun: "#FFEACC", k: 2.0, sky: "#CFE4D4", ground: "#1E3A2A", fill: 1.0 }, // Asraya
  { sun: "#BFF4FF", k: 1.8, sky: "#9EDCEB", ground: "#0B2430", fill: 0.8 }, // Rudra Yugen
  { sun: "#FFB884", k: 2.2, sky: "#E2A88B", ground: "#3A2C30", fill: 0.9 }, // The Summit
  { sun: "#9FB2FF", k: 0.8, sky: "#1A2348", ground: "#05070F", fill: 0.5 }, // The Night Sky
  { sun: "#FFE0AE", k: 2.4, sky: "#F5DDB8", ground: "#23321C", fill: 0.9 }, // Return
];

/** Which stretches are mounted: the current place ± 2 (assets stream per chapter as the camera nears them). */
const near = (place: number, from: number, to: number) => place >= from - 2 && place <= to + 2;

/**
 * The world of "One Take Across the World": the sky, the one sun, the Idea, and each chapter's set, built around the
 * fixed camera path. Sets mount (and load their plates) only near the camera.
 */
export function World({ rtRef, theme, mobile, calm, riseAtRef }: Props) {
  const place = useUi((s) => s.place);
  const night = theme === "dark";
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const data = useMemo(() => LIGHT.map((l) => ({ sun: new THREE.Color(l.sun), sky: new THREE.Color(l.sky), ground: new THREE.Color(l.ground), k: l.k, fill: l.fill })), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const s = rtRef.current.s;
    const i = Math.min(LAST - 1, Math.floor(s)), f = s - i;
    const a = data[route[i].chapter], b = data[route[i + 1].chapter];
    const dim = night ? 0.45 : 1;
    const sun = sunRef.current, hemi = hemiRef.current;
    if (sun) {
      sunAt(s, tmp);
      sun.position.copy(camera.position).addScaledVector(tmp, 100);
      sun.target.position.copy(camera.position);
      sun.target.updateMatrixWorld();
      sun.color.copy(a.sun).lerp(b.sun, f);
      sun.intensity = (a.k + (b.k - a.k) * f) * dim;
    }
    if (hemi) {
      hemi.color.copy(a.sky).lerp(b.sky, f);
      hemi.groundColor.copy(a.ground).lerp(b.ground, f);
      hemi.intensity = (a.fill + (b.fill - a.fill) * f) * dim;
    }
  });
  return (
    <>
      <Sky rtRef={rtRef} night={night} />
      <directionalLight ref={sunRef} />
      <hemisphereLight ref={hemiRef} />
      <Suspense fallback={null}>
        {near(place, 0, 6) && <Jungle rtRef={rtRef} mobile={mobile} calm={calm} night={night} />}
      </Suspense>
      <Suspense fallback={null}>
        {near(place, 6, 12) && <Canopy rtRef={rtRef} mobile={mobile} calm={calm} night={night} />}
      </Suspense>
      <Suspense fallback={null}>
        {near(place, 11, 13) && <Atlas mobile={mobile} night={night} />}
      </Suspense>
      {LAND_PLATES.map((L, k) => (
        <Suspense key={L.name} fallback={null}>
          {near(place, L.from, L.to) && <Land k={k} rtRef={rtRef} mobile={mobile} calm={calm} night={night} />}
        </Suspense>
      ))}
      <Ribbon rtRef={rtRef} mobile={mobile} calm={calm} riseAtRef={riseAtRef} />
    </>
  );
}

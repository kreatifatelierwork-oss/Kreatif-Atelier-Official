"use client";

import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { experienceConfig as X } from "@/lib/config";
import type { Runtime } from "../journey";
import { LAST } from "../route";
import { LIGHTS, type Theme } from "./look";

/**
 * One light per place (C7): a single directional light that moves, recolours and re-aims as you travel, casting the
 * only shadows in the world. The studio HDRI is a reflection environment only (never visible); a soft sky/ground
 * fill keeps the shade side readable without becoming a second light.
 */
export function PlaceLight({ rtRef, theme, mobile }: { rtRef: { current: Runtime }; theme: Theme; mobile: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const tmp = useRef({ a: new THREE.Color(), b: new THREE.Color(), p: new THREE.Vector3(), q: new THREE.Vector3(), t: new THREE.Vector3(), u: new THREE.Vector3() });

  useFrame(() => {
    const rt = rtRef.current;
    const L = sun.current;
    if (!L) return;
    const k = tmp.current;
    const i = Math.min(LAST - 1, Math.floor(rt.s));
    const f = Math.min(1, Math.max(0, rt.s - i));
    const e = f * f * (3 - 2 * f);
    const A = X.anchors, a = LIGHTS[i], b = LIGHTS[i + 1];
    // Aim at the place (the Roof aims at the middle of the route below).
    const anchorOf = (n: number, out: THREE.Vector3) => (n === 8 ? out.set(20, 0, -170) : out.set(...A[n]));
    anchorOf(i, k.t); anchorOf(i + 1, k.u);
    k.t.lerp(k.u, e);
    k.p.set(...a.from); k.q.set(...b.from);
    k.p.lerp(k.q, e);
    L.position.copy(k.t).add(k.p);
    L.target.position.copy(k.t);
    L.target.updateMatrixWorld();
    k.a.set(a.colour); k.b.set(b.colour);
    L.color.copy(k.a).lerp(k.b, e);
    // Mid-passage the light dims a little: you walk through the haze, not through a bright cut.
    const dim = 1 - 0.25 * Math.sin(Math.PI * f);
    L.intensity = (a.intensity + (b.intensity - a.intensity) * e) * dim * (theme === "light" ? 1 : 0.9);
    const big = i === 7 || i === 8;
    const cam = L.shadow.camera as THREE.OrthographicCamera;
    const span = big ? 90 : 30;
    if (cam.right !== span) { cam.left = -span; cam.right = span; cam.top = span; cam.bottom = -span; cam.updateProjectionMatrix(); }
    if (fill.current) fill.current.intensity = theme === "light" ? 0.9 : 0.22;
  });

  return (
    <>
      <Environment files="/hdri/photo_studio_01_1k.hdr" background={false} environmentIntensity={theme === "light" ? 0.55 : 0.28} />
      <hemisphereLight ref={fill} args={[theme === "light" ? "#f6f7fb" : "#1b2234", theme === "light" ? "#cfd3db" : "#05070d", 0.9]} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={mobile ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-near={1}
        shadow-camera-far={140}
      />
    </>
  );
}

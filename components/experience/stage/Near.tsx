"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type * as THREE from "three";
import type { Runtime } from "../journey";

/** Draws its children only while the camera is within `range` places of `place`. */
export function Near({ rtRef, place, range = 1.05, children }: { rtRef: { current: Runtime }; place: number; range?: number; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current) g.current.visible = Math.abs(rtRef.current.s - place) < range; });
  return <group ref={g}>{children}</group>;
}

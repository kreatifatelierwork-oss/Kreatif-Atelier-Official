"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import type * as THREE from "three";
import { config } from "@/lib/config";
import { scrollStore } from "@/lib/scroll/store";
import { pointer } from "@/lib/three/pointer";
import { stageStore } from "@/lib/three/stage";

type Props = {
  /** Bounding radius of the content, in its own units — it is scaled to fit the DOM anchor. */
  radius: number;
  animated: boolean;
  children: React.ReactNode;
};

/**
 * Places the hero composition where `[data-hero-anchor]` sits in the DOM (so layout stays in
 * CSS, at every breakpoint), lets it travel up with the page as the hero scrolls away, and
 * leans it toward the pointer. Reads scroll only as `progress` from the store.
 */
export function HeroRig({ radius, animated, children }: Props) {
  const place = useRef<THREE.Group>(null);
  const lean = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);

  useFrame((_, delta) => {
    const anchor = stageStore.getState().anchor;
    const group = place.current;
    if (!anchor || !group) return;

    // World units per CSS pixel on the z = 0 plane.
    const worldHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const unit = worldHeight / anchor.vh;

    const { progress } = scrollStore.getState();
    const travelled = progress * stageStore.getState().maxScroll * config.three.hero.parallax;

    group.position.set((anchor.cx - anchor.vw / 2) * unit, -(anchor.cy - anchor.vh / 2 - travelled) * unit, 0);
    group.scale.setScalar((Math.min(anchor.width, anchor.height) * unit) / (2 * radius));

    if (animated && lean.current) {
      const { leanX, leanY, leanDamping } = config.three.hero;
      const tx = pointer.active ? -pointer.y * leanX : 0;
      const ty = pointer.active ? pointer.x * leanY : 0;
      easing.dampE(lean.current.rotation, [tx, ty, 0], 1 / leanDamping, delta);
    }
  });

  return (
    <group ref={place}>
      <group ref={lean}>{children}</group>
    </group>
  );
}

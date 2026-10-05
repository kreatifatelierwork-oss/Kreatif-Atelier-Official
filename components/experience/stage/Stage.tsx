"use client";

import { advance as advanceR3F, Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { onFrame } from "@/components/film/loop";
import type { FilmState } from "@/components/film/state";
import type { Runtime } from "../journey";
import { CameraRig } from "./CameraRig";
import { FOV, stageView } from "./layout";
import { World } from "./World";

type Props = {
  rtRef: { current: Runtime };
  filmRef: { current: FilmState };
  theme: "light" | "dark";
  mobile: boolean;
  calm: boolean;
  riseAtRef: { current: number | null };
  onReady: () => void;
  onEnter: (thing: string) => void;
};

/** Drives this canvas from the film's shared loop (first, so the ink and the DOM read this frame's state). */
function SharedLoop({ onReady }: { onReady: () => void }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    get().clock.elapsedTime = performance.now() / 1000;
    if (new URLSearchParams(window.location.search).has("tune")) Object.assign(window, { __r3f: get });
    stageView.camera = get().camera as THREE.PerspectiveCamera;
    let n = 0;
    const off = onFrame((now) => {
      advanceR3F(now / 1000, true, get());
      if (++n === 3) onReady();
    }, 0);
    return () => { off(); stageView.camera = null; };
  }, [get, onReady]);
  return null;
}

/** The one 3D canvas for /experience (lazy-loaded after the gate). */
export default function Stage({ rtRef, theme, mobile, calm, riseAtRef, onReady }: Props) {
  return (
    <Canvas
      className="xp-stage"
      frameloop="never"
      // Measure the layout size, not the transformed one: the stage mounts during the opening's zoom.
      resize={{ offsetSize: true }}
      dpr={mobile ? [1, 1.5] : [1, 1.5]}
      gl={{ antialias: !mobile, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: mobile ? FOV.mobile : FOV.desktop, near: 0.1, far: 400, position: [0, 1, 0] }}
    >
      <SharedLoop onReady={onReady} />
      <CameraRig rtRef={rtRef} theme={theme} />
      <World rtRef={rtRef} theme={theme} mobile={mobile} calm={calm} riseAtRef={riseAtRef} />
    </Canvas>
  );
}

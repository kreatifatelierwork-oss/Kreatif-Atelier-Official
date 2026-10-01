"use client";

import { advance as advanceR3F, Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { onFrame } from "@/components/film/loop";
import { shadowDirty } from "./shadows";
import type { FilmState } from "@/components/film/state";
import type { Runtime } from "../journey";
import { CameraRig } from "./CameraRig";
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
function SharedLoop({ onReady, rtRef }: { onReady: () => void; rtRef: { current: Runtime } }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    get().clock.elapsedTime = performance.now() / 1000;
    const gl = get().gl;
    if (new URLSearchParams(window.location.search).has("tune")) Object.assign(window, { __r3f: get });
    // The world is static between moves: the one shadow map is redrawn only while something changes.
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    let n = 0;
    let lastS = -1;
    return onFrame((now) => {
      const s = rtRef.current.s;
      if (s !== lastS || shadowDirty.frames > 0 || n % 30 === 0) {
        gl.shadowMap.needsUpdate = true;
        lastS = s;
        if (shadowDirty.frames > 0) shadowDirty.frames--;
      }
      advanceR3F(now / 1000, true, get());
      if (++n === 3) onReady();
    }, 0);
  }, [get, onReady, rtRef]);
  return null;
}

/** The one 3D canvas for /experience (lazy-loaded after the gate). */
export default function Stage({ rtRef, filmRef, theme, mobile, calm, riseAtRef, onReady, onEnter }: Props) {
  return (
    <Canvas
      className="xp-stage"
      frameloop="never"
      shadows
      // Measure the layout size, not the transformed one: the stage mounts during the opening's zoom.
      resize={{ offsetSize: true }}
      dpr={mobile ? [1, 1.5] : [1, 1.5]}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      camera={{ fov: mobile ? 55 : 42, near: 0.1, far: 400, position: [0, 1.7, 9] }}
    >
      <SharedLoop onReady={onReady} rtRef={rtRef} />
      <CameraRig rtRef={rtRef} theme={theme} />
      <World rtRef={rtRef} filmRef={filmRef} theme={theme} mobile={mobile} calm={calm} riseAtRef={riseAtRef} onEnter={onEnter} />
    </Canvas>
  );
}

"use client";

import { advance, Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { onFrame } from "../loop";
import type { FilmState } from "../state";
import { Idea } from "./Idea";

type Props = {
  stateRef: { current: FilmState };
  palette: "a" | "b";
  mobile: boolean;
  calm: boolean;
  riseAtRef: { current: number | null };
  onReady: () => void;
  onSwap?: (step: number) => void;
};

function ReadyAfterFrames({ onReady }: { onReady: () => void }) {
  const n = useRef(0);
  useFrame(() => { if (++n.current === 3) onReady(); });
  return null;
}

/** Renders this canvas from the film's shared loop (first, so the ink can read the Idea's footprint). */
function SharedLoop() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    // R3F's delta is timestamp − clock.elapsedTime: start the clock now so the first delta is one frame, not "since load".
    get().clock.elapsedTime = performance.now() / 1000;
    return onFrame((now) => advance(now / 1000, true, get()), 0);
  }, [get]);
  return null;
}

/** The film's one 3D canvas (lazy-loaded; transparent over the page colour). */
export default function FilmStage({ stateRef, palette, mobile, calm, riseAtRef, onReady, onSwap }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      aria-hidden="true"
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 35, position: [0, 0, mobile ? 14 : 9], near: 0.1, far: 60 }}
      // Above the ink (z 20) once the opening ends: the ink passes behind the Idea, as on the reference.
      style={{ pointerEvents: "none", zIndex: 30 }}
      frameloop="never"
    >
      <SharedLoop />
      <Idea stateRef={stateRef} palette={palette} mobile={mobile} calm={calm} riseAtRef={riseAtRef} onSwap={onSwap} />
      <ReadyAfterFrames onReady={onReady} />
    </Canvas>
  );
}

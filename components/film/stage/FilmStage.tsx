"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
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

/** The film's one 3D canvas (lazy-loaded; transparent over the page colour). */
export default function FilmStage({ stateRef, palette, mobile, calm, riseAtRef, onReady, onSwap }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      aria-hidden="true"
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 35, position: [0, 0, mobile ? 14 : 9], near: 0.1, far: 60 }}
      style={{ pointerEvents: "none" }}
    >
      <Idea stateRef={stateRef} palette={palette} mobile={mobile} calm={calm} riseAtRef={riseAtRef} onSwap={onSwap} />
      <ReadyAfterFrames onReady={onReady} />
    </Canvas>
  );
}

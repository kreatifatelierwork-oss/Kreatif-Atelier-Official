"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { config, sculptureVariants } from "@/lib/config";
import { scrollStore } from "@/lib/scroll/store";
import { trackPointer } from "@/lib/three/pointer";
import type { Tier } from "@/lib/three/quality";
import { stepDown } from "@/lib/three/quality";
import type { SculptureId } from "@/lib/three/stage";
import { stageStore } from "@/lib/three/stage";
import { HeroRig } from "./HeroRig";
import { Lights } from "./Lights";
import { GoldDust } from "./Particles/GoldDust";
import { PostFX } from "./PostFX";
import { GoldSculpture, sculptureRadius } from "./Sculpture/GoldSculpture";

export type ExperienceProps = {
  tier: Tier;
  sculpture: SculptureId;
  reducedMotion: boolean;
  /** Canvas faded fully out (scrolled past the hero): stop rendering altogether. */
  hidden: boolean;
  onProgress: (value: number) => void;
  onReady: () => void;
};

/** Signals "ready" once real frames have been drawn (shaders compiled, environment baked). */
function ReadySignal({ frames, onReady }: { frames: number; onReady: () => void }) {
  const count = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    count.current += 1;
    if (count.current >= frames) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

/** Pauses the render loop while the canvas is hidden; in reduced motion, redraws only when layout changes. */
function FrameGate({ hidden, reducedMotion, ready }: { hidden: boolean; reducedMotion: boolean; ready: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    setFrameloop(hidden ? "never" : reducedMotion ? "demand" : "always");
    if (!hidden) invalidate();
  }, [hidden, reducedMotion, ready, setFrameloop, invalidate]);

  useEffect(() => {
    if (!reducedMotion) return;
    const unsubStage = stageStore.subscribe(() => invalidate());
    const unsubScroll = scrollStore.subscribe(() => invalidate());
    return () => {
      unsubStage();
      unsubScroll();
    };
  }, [reducedMotion, invalidate]);

  return null;
}

/**
 * The one and only <Canvas>, fixed behind the DOM. Phase 3: the hero composition —
 * liquid-gold sculpture, gold dust, studio lighting, post-processing — with quality tiers.
 */
export default function Experience({ tier: initialTier, sculpture, reducedMotion, hidden, onProgress, onReady }: ExperienceProps) {
  const [tier, setTier] = useState<Tier>(initialTier);
  const settings = config.three.tiers[tier];
  const [dprMin, dprMax] = settings.dpr;
  const [dpr, setDpr] = useState<number>(dprMax);
  const [ready, setReady] = useState(false);
  const variant = sculptureVariants[sculpture];
  const animated = !reducedMotion;

  useEffect(() => (animated ? trackPointer() : undefined), [animated]);
  useEffect(() => onProgress(0.7), [onProgress]);

  return (
    <Canvas
      dpr={dpr}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ fov: config.three.camera.fov, position: [0, 0, config.three.camera.z], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping;
        gl.toneMappingExposure = config.three.exposure;
        onProgress(0.85);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[config.three.background]} />

      <PerformanceMonitor
        flipflops={3}
        onChange={({ factor }) => setDpr(Math.round((dprMin + (dprMax - dprMin) * factor) * 10) / 10)}
        onFallback={() => setTier((t) => stepDown(t))}
      />

      <Lights envResolution={settings.envResolution} boost={variant.lightBoost} />

      <HeroRig radius={sculptureRadius(variant)} animated={animated}>
        <GoldSculpture variant={variant} segments={settings.sculptureSegments} animated={animated} revealing={ready} />
        <GoldDust count={settings.dust} animated={animated} opacity={ready ? 1 : 0} />
      </HeroRig>

      {settings.postfx !== "none" && <PostFX level={settings.postfx} />}

      <FrameGate hidden={hidden} reducedMotion={reducedMotion} ready={ready} />
      <ReadySignal
        frames={reducedMotion ? 1 : 3}
        onReady={() => {
          setReady(true);
          onReady();
        }}
      />
    </Canvas>
  );
}

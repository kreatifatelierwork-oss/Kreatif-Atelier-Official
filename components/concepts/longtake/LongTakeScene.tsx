"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";
import { activeReel, REELS, sampleJourney, worldCentre, type JourneySample } from "./journey";
import { ANCHORS, WorldsGroup, type Palette } from "./Worlds";

type Props = {
  palette: Palette;
  reducedMotion: boolean;
  /** Where the timeline wants to be (0–6), and where the camera actually is (written here each frame). */
  targetRef: React.RefObject<number>;
  sRef: React.RefObject<number>;
  /** 0 → 1 during the opening pull-back from inside the core. */
  openingRef: React.RefObject<number>;
  /** 0–1 per world: how present it is (drives annotations + assembly). */
  presenceRef: React.RefObject<number[]>;
  raiseRef: React.RefObject<number>;
  /** 0–1 haze, written for the DOM (text dissolves into it). */
  hazeRef: React.RefObject<number>;
  /** Screen positions (px) of the current world's four annotation anchors, for the HTML labels. */
  anchorsRef: React.RefObject<{ reel: number; presence: number; pts: { x: number; y: number }[] }>;
  mobile: boolean;
  onReady: () => void;
};

const colour = (hex: string) => new THREE.Color(hex);

export function LongTakeScene({ palette, reducedMotion, targetRef, sRef, openingRef, presenceRef, raiseRef, hazeRef, anchorsRef, mobile, onReady }: Props) {
  const dof = useRef<DepthOfFieldEffect>(null);
  const sample = useRef<JourneySample>(sampleJourney(0));
  const finaleRef = useRef(0);
  const frames = useRef(0);
  const skyRef = useRef<THREE.Color>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const lookAt = useRef(new THREE.Vector3());
  const bgs = useMemo(() => L.worlds.map((w) => colour(w[palette].bg)), [palette]);
  const hazes = useMemo(() => L.worlds.map((w) => colour(w[palette].haze)), [palette]);
  const corePos = useMemo(() => new THREE.Vector3(0, 0.4, 3.4), []);

  useFrame((state, dt) => {
    if (++frames.current === 3) onReady();

    // Follow the timeline. Long jumps fly through the worlds in between (never a cut) — unless reduced motion.
    const target = targetRef.current ?? 0;
    let s = sRef.current ?? 0;
    if (reducedMotion) s = target;
    else {
      const k = 1 - Math.exp(-dt / (L.follow * 0.5));
      const step = (target - s) * k;
      s += Math.sign(step) * Math.min(Math.abs(step), dt * 2.4);
    }
    sRef.current = s;
    const j = sampleJourney(s, sample.current);

    // Opening: pull back out of the core's light into the first framing.
    const open = reducedMotion ? 1 : (openingRef.current ?? 1);
    const eo = 1 - Math.pow(1 - open, 3);
    const cam = state.camera;
    cam.position.lerpVectors(corePos, j.pos, eo);
    if (!reducedMotion && !mobile) {
      cam.position.x += state.pointer.x * 0.35;
      cam.position.y += state.pointer.y * 0.2;
    }
    lookAt.current.lerp(j.target, reducedMotion ? 1 : Math.min(1, dt * 6));
    cam.lookAt(lookAt.current);

    // Colour of the world: blend the two worlds' skies, lifting into luminous haze mid-flight.
    const a = j.reel, b = Math.min(REELS - 1, j.reel + 1);
    const bg = skyRef.current;
    const fog = fogRef.current;
    if (!bg || !fog) return;
    bg.copy(bgs[a]).lerp(bgs[b], j.blend);
    const hz = hazes[a].clone().lerp(hazes[b], j.blend);
    const haze = reducedMotion ? 0 : Math.max(j.haze, 1 - eo);
    bg.lerp(hz, haze * 0.75);
    hazeRef.current = haze;
    fog.color.copy(bg);
    // Holding on a world: its neighbours recede into the world's colour. Overviews stay clear.
    const overview = Math.max(1 - Math.min(1, s), Math.min(1, Math.max(0, s - 5)));
    const holdNear = THREE.MathUtils.lerp(15, 34, overview), holdFar = THREE.MathUtils.lerp(48, 100, overview);
    fog.near = THREE.MathUtils.lerp(holdNear, 3, haze);
    fog.far = THREE.MathUtils.lerp(holdFar, 26, haze);

    // Presence per world: 1 when holding on it.
    const prev = presenceRef.current ?? [];
    presenceRef.current = Array.from({ length: REELS }, (_, i) => {
      const want = Math.abs(s - i) < 0.5 ? 1 - Math.min(1, j.haze * 1.4) : 0;
      const was = prev[i] ?? 0;
      return was + (want - was) * Math.min(1, dt * (reducedMotion ? 60 : 3));
    });
    finaleRef.current = Math.min(1, Math.max(0, s - 5));

    // Project the active world's annotation anchors to the screen.
    const r = activeReel(s);
    if (r >= 1 && r <= 5) {
      const c = worldCentre(r);
      const rotY = Math.atan2(c.x, c.z);
      const v = new THREE.Vector3();
      anchorsRef.current = {
        reel: r,
        presence: presenceRef.current[r] ?? 0,
        pts: ANCHORS.map(([x, y, z]) => {
          v.set(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY).add(c).project(cam);
          return { x: ((v.x + 1) / 2) * state.size.width, y: ((1 - v.y) / 2) * state.size.height };
        }),
      };
    } else anchorsRef.current = { reel: r, presence: 0, pts: [] };

    // Rack focus: sharp on the world when holding, soft while travelling or waking from the core.
    if (dof.current) {
      dof.current.target = lookAt.current;
      dof.current.bokehScale = reducedMotion ? 0.0001 : 2.2 + haze * 6;
    }
  });

  const isB = palette === "b";
  return (
    <>
      <color ref={skyRef} attach="background" args={[L.worlds[0][palette].bg]} />
      <fog ref={fogRef} attach="fog" args={[L.worlds[0][palette].bg, 30, 95]} />
      <ambientLight intensity={isB ? 0.25 : 0.7} />
      <directionalLight position={[8, 14, 10]} intensity={isB ? 1.2 : 2.2} color="#FFF4E4" />
      <directionalLight position={[-10, 4, -8]} intensity={isB ? 0.8 : 0.9} color="#DDE8FF" />
      <Environment frames={1} resolution={128}>
        <color attach="background" args={[isB ? "#07070c" : "#EDEAE4"]} />
        <Lightformer form="rect" intensity={isB ? 2 : 4} color="#FFFFFF" position={[0, 6, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 4]} />
        <Lightformer form="rect" intensity={isB ? 3 : 3} color="#FFE6C2" position={[-6, 1, 3]} rotation={[0, Math.PI / 2.4, 0]} scale={[0.6, 8]} />
        <Lightformer form="rect" intensity={isB ? 2 : 2} color="#D6E4FF" position={[6, 1, 2]} rotation={[0, -Math.PI / 2.4, 0]} scale={[0.5, 7]} />
      </Environment>

      <WorldsGroup
        palette={palette}
        animated={!reducedMotion}
        presenceRef={presenceRef}
        raiseRef={raiseRef}
        finaleRef={finaleRef}
      />

      <EffectComposer multisampling={mobile ? 0 : 4}>
        {mobile ? <></> : <DepthOfField ref={dof} focalLength={0.04} bokehScale={0.6} height={540} />}
        <Bloom mipmapBlur intensity={isB ? 1.1 : 0.35} luminanceThreshold={isB ? 0.55 : 0.92} luminanceSmoothing={0.3} radius={0.75} />
        <Vignette offset={0.32} darkness={isB ? 0.7 : 0} />
        {/* Light palette: Neutral keeps whites white and colours clean; glow palette: AgX for filmic highlights. */}
        <ToneMapping mode={isB ? ToneMappingMode.AGX : ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </>
  );
}

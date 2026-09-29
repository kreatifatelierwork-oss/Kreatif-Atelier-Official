"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";
import { activeReel, ECOSYSTEM, followTimeline, isVertical, REELS, sampleJourney, worldCentre, type JourneySample } from "./journey";
import type { PlayState } from "./play";
import { ANCHORS, faceYaw, WorldsGroup, type Palette } from "./Worlds";

export type Anchors = { reel: number; presence: number; pts: { x: number; y: number }[] };

export type SceneProps = {
  palette: Palette;
  reducedMotion: boolean;
  mobile: boolean;
  /** Timeline target (0–7) and the camera's actual position on it (written here every frame). */
  targetRef: React.RefObject<number>;
  sRef: React.RefObject<number>;
  /** 0 → 1 during the opening pull-back from inside the core. */
  openingRef: React.RefObject<number>;
  presenceRef: React.RefObject<number[]>;
  playRef: React.RefObject<PlayState>;
  /** 0–1 haze for the DOM (text dissolves into it). */
  hazeRef: React.RefObject<number>;
  anchorsRef: React.RefObject<Anchors>;
  onReady: () => void;
};

/** The studio HDRI, lighting and reflections only (never visible). Phones stay on 1K; desktop upgrades to 2K. */
function StudioEnvironment({ palette, mobile }: { palette: Palette; mobile: boolean }) {
  const [file, setFile] = useState<string>(L.environment.files.small);
  useEffect(() => {
    if (mobile) return;
    const id = window.setTimeout(() => setFile(L.environment.files.large), 6000);
    return () => window.clearTimeout(id);
  }, [mobile]);
  const isB = palette === "b";
  return (
    <Environment
      files={file}
      background={false}
      resolution={mobile ? L.environment.resolution.mobile : L.environment.resolution.desktop}
      environmentIntensity={L.environment.intensity[palette]}
    >
      {/* Soft highlight panels on top of the studio light. */}
      <Lightformer form="rect" intensity={isB ? 1.5 : 2.4} color="#FFFFFF" position={[0, 6, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 4]} />
      <Lightformer form="rect" intensity={isB ? 2 : 2.2} color="#FFE6C2" position={[-6, 1, 3]} rotation={[0, Math.PI / 2.4, 0]} scale={[0.6, 8]} />
      <Lightformer form="rect" intensity={isB ? 1.5 : 1.6} color="#D6E4FF" position={[6, 1, 2]} rotation={[0, -Math.PI / 2.4, 0]} scale={[0.5, 7]} />
    </Environment>
  );
}

export function Scene(props: SceneProps) {
  const { palette, reducedMotion, mobile, targetRef, sRef, openingRef, presenceRef, playRef, hazeRef, anchorsRef, onReady } = props;
  const dof = useRef<DepthOfFieldEffect>(null);
  const sample = useRef<JourneySample | null>(null);
  const finaleRef = useRef(0);
  const frames = useRef(0);
  const skyRef = useRef<THREE.Color>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const lookAt = useRef(new THREE.Vector3());
  const bgs = useMemo(() => L.worlds.map((w) => new THREE.Color(w[palette].bg)), [palette]);
  const hazes = useMemo(() => L.worlds.map((w) => new THREE.Color(w[palette].haze)), [palette]);
  const corePos = useMemo(() => new THREE.Vector3(0, 0.4, 3.4), []);
  const tmp = useRef({ v: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), hz: new THREE.Color() });

  useFrame((state, dt) => {
    if (++frames.current === 3) onReady();
    dt = Math.min(dt, 0.05);

    // Follow the timeline — long jumps fly through the worlds in between; reduced motion cuts.
    const target = targetRef.current ?? 0;
    const s = reducedMotion ? target : followTimeline(sRef.current ?? 0, target, dt);
    sRef.current = s;
    const j = sampleJourney(s, mobile, sample.current ?? undefined);
    sample.current = j;

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

    // Sky: blend the two worlds, lifting into luminous haze of their colours mid-flight.
    const bg = skyRef.current, fog = fogRef.current;
    if (!bg || !fog) return;
    const a = j.reel, b = Math.min(REELS - 1, j.reel + 1);
    bg.copy(bgs[a]).lerp(bgs[b], j.blend);
    const hz = tmp.current.hz.copy(hazes[a]).lerp(hazes[b], j.blend);
    const haze = reducedMotion ? 0 : Math.max(j.haze, 1 - eo);
    bg.lerp(hz, haze * 0.75);
    hazeRef.current = haze;
    fog.color.copy(bg);
    // Fog follows the framing: holding on a world its neighbours recede into its colour; overviews stay clear.
    const overview = Math.max(1 - Math.min(1, s), Math.max(0, 1 - Math.abs(s - ECOSYSTEM)));
    const dist = cam.position.distanceTo(j.target);
    const near = Math.max(15, dist * THREE.MathUtils.lerp(0.85, 1.05, overview)), far = near + THREE.MathUtils.lerp(33, 80, overview);
    fog.near = THREE.MathUtils.lerp(near, 3, haze);
    fog.far = THREE.MathUtils.lerp(far, 26, haze);

    // Presence per world: 1 when holding on it.
    const prev = presenceRef.current ?? [];
    presenceRef.current = Array.from({ length: REELS }, (_, i) => {
      const want = Math.abs(s - i) < 0.5 ? 1 - Math.min(1, j.haze * 1.4) : 0;
      const was = prev[i] ?? 0;
      return was + (want - was) * Math.min(1, dt * (reducedMotion ? 60 : 3));
    });
    finaleRef.current = Math.min(1, Math.max(0, 1 - Math.abs(s - ECOSYSTEM)));

    // The orrery only turns by hand at the core; elsewhere it eases home.
    const play = playRef.current;
    if (play && Math.abs(s) > 0.3) play.yawTarget = 0;

    // Project the active world's label anchors to the screen.
    const r = activeReel(s);
    if (isVertical(r)) {
      const c = worldCentre(r);
      const yaw = faceYaw(r);
      const { v, up } = tmp.current;
      anchorsRef.current = {
        reel: r,
        presence: presenceRef.current[r] ?? 0,
        pts: ANCHORS.map(([x, y, z]) => {
          v.set(x, y, z).applyAxisAngle(up, yaw).add(c).applyAxisAngle(up, play?.yaw ?? 0).project(cam);
          return { x: ((v.x + 1) / 2) * state.size.width, y: ((1 - v.y) / 2) * state.size.height };
        }),
      };
    } else anchorsRef.current = { reel: r, presence: 0, pts: [] };

    // Rack focus: sharp on the subject when holding, soft while travelling or waking from the core.
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
      <ambientLight intensity={isB ? 0.2 : 0.45} />
      <directionalLight position={[8, 14, 10]} intensity={isB ? 1 : 1.6} color="#FFF4E4" />
      <directionalLight position={[-10, 4, -8]} intensity={isB ? 0.6 : 0.7} color="#DDE8FF" />
      <Suspense fallback={null}>
        <StudioEnvironment palette={palette} mobile={mobile} />
      </Suspense>

      <WorldsGroup palette={palette} animated={!reducedMotion} presenceRef={presenceRef} playRef={playRef} finaleRef={finaleRef} />

      <EffectComposer multisampling={mobile ? 0 : 4}>
        {mobile ? <></> : <DepthOfField ref={dof} focalLength={0.04} bokehScale={2.2} height={540} />}
        <Bloom mipmapBlur intensity={isB ? 1.1 : 0.35} luminanceThreshold={isB ? 0.55 : 0.92} luminanceSmoothing={0.3} radius={0.75} />
        <Vignette offset={0.32} darkness={isB ? 0.7 : 0} />
        {/* Light palette: Neutral keeps whites white and colours clean; glow palette: AgX for filmic highlights. */}
        <ToneMapping mode={isB ? ToneMappingMode.AGX : ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </>
  );
}

"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { easing } from "maath";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Lights } from "@/components/three/Lights";
import { config, conceptConfig } from "@/lib/config";

type Props = {
  /** 0 before "Roll film"; ramps to 1 as the projector warms up. */
  beam: number;
  /** The type wall fades up only once the opening titles have played. */
  showWall: boolean;
  /** Virtual playhead 0–1 (the reel's timeline). */
  playheadRef: React.RefObject<number>;
  headline: { lead: string; emphasis: string };
  reducedMotion: boolean;
};

const FONT = "/fonts/cormorant-garamond-500.woff";
const FONT_ITALIC = "/fonts/cormorant-garamond-400-italic.woff";
/** Camera dolly: z at playhead 0 and where the type wall sits. */
const START_Z = 9;
const WALL_Z = -2;

/** Soft round sprite for dust motes (points are square without it). */
function useDotTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Dust hanging in the projector beam. */
function BeamDust({ intensityRef }: { intensityRef: React.RefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const n = 1400, p = new Float32Array(n * 3);
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) p.set([(r() - 0.5) * 9, (r() - 0.5) * 6, -6 + r() * 14], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const dot = useDotTexture();
  useFrame((state, dt) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.y += dt * 0.01;
    pts.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    (pts.material as THREE.PointsMaterial).opacity = 0.55 * (intensityRef.current ?? 0);
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.04} map={dot} color="#FFE4B8" transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/**
 * A projector beam: an open cone from the lamp, brightest along its core and fading with distance,
 * breathing with a little lamp flicker. Additive, so it only ever adds light to the dark.
 */
const beamMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  uniforms: { uIntensity: { value: 0 }, uColor: { value: new THREE.Color(conceptConfig.production.beamColor) }, uTime: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal; varying vec3 vView; varying float vAlong;
    void main() {
      vAlong = uv.y; // 1 at the lamp, 0 at the far end
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = normalize(-mv.xyz);
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    uniform float uIntensity; uniform vec3 uColor; uniform float uTime;
    varying vec3 vNormal; varying vec3 vView; varying float vAlong;
    void main() {
      float core = pow(abs(dot(normalize(vNormal), normalize(vView))), 3.0);
      float fade = smoothstep(0.0, 0.55, vAlong) * (0.35 + 0.65 * vAlong);
      float haze = 0.85 + 0.15 * sin(vAlong * 40.0 - uTime * 1.3);
      float a = core * fade * haze * uIntensity * 0.42;
      gl_FragColor = vec4(uColor * a, a);
    }`,
});

function ProjectorBeam({ intensityRef }: { intensityRef: React.RefObject<number> }) {
  // High and to the left, so the cone cuts diagonally across the frame rather than straight at us.
  const lamp = useMemo(() => new THREE.Vector3(-8, 6.5, 5), []);
  const aim = useMemo(() => new THREE.Vector3(2.5, -1.2, -9), []);
  const { position, quaternion, length } = useMemo(() => {
    const dir = aim.clone().sub(lamp);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize());
    return { position: lamp.clone().add(dir.multiplyScalar(0.5)), quaternion: q, length: len };
  }, [lamp, aim]);
  useFrame((state) => {
    beamMaterial.uniforms.uIntensity.value = intensityRef.current ?? 0;
    beamMaterial.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh position={position} quaternion={quaternion} material={beamMaterial}>
      <cylinderGeometry args={[0.18, 5.2, length, 64, 1, true]} />
    </mesh>
  );
}

export function ProductionScene({ beam, showWall, playheadRef, headline, reducedMotion }: Props) {
  const dof = useRef<DepthOfFieldEffect>(null);
  const beamLevel = useRef(0);
  const wallLevel = useRef(0);
  const wallTarget = useRef(new THREE.Vector3(0, 0, WALL_Z));
  const words = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    // Projector warm-up with a slight flicker, like a lamp catching.
    const flicker = reducedMotion ? 1 : 0.92 + Math.sin(state.clock.elapsedTime * 37) * 0.03 + Math.sin(state.clock.elapsedTime * 11) * 0.05;
    beamLevel.current += (beam * flicker - beamLevel.current) * Math.min(1, dt * (reducedMotion ? 30 : 2.2));

    // Dolly through the type wall as the reel plays.
    const p = playheadRef.current ?? 0;
    const travel = Math.min(1, p / 0.62);
    const z = START_Z + (WALL_Z - 1.5 - START_Z) * travel;
    if (reducedMotion) state.camera.position.set(0, 0.2, z);
    else easing.damp3(state.camera.position, [state.pointer.x * 0.25, 0.2 + state.pointer.y * 0.15, z], 0.35, dt);
    state.camera.lookAt(0, 0, WALL_Z - 6);

    // Rack focus: soft until the camera is near, then sharp, then soft again as we pass through.
    const dist = Math.abs(state.camera.position.z - WALL_Z);
    if (dof.current) {
      dof.current.target = wallTarget.current;
      const blur = dist > 7 ? 5 : dist < 1.4 ? 7 : 0.4;
      easing.damp(dof.current, "bokehScale", blur, reducedMotion ? 0 : 0.5, dt);
    }
    wallLevel.current += ((showWall ? 1 : 0) - wallLevel.current) * Math.min(1, dt * (reducedMotion ? 30 : 1.2));
    if (words.current) {
      words.current.visible = wallLevel.current > 0.01;
      words.current.scale.setScalar(0.96 + wallLevel.current * 0.04);
      words.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (!m || !("emissiveIntensity" in m)) return;
        m.transparent = true;
        m.opacity = wallLevel.current;
        m.emissiveIntensity = 0.1 + beamLevel.current * 0.45;
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#030305"]} />
      <fog attach="fog" args={["#030305", 6, 22]} />
      <Lights envResolution={128} boost={0.7} />

      {/* The projector: a light cone from high behind the audience into the dark. */}
      <ProjectorBeam intensityRef={beamLevel} />
      <BeamDust intensityRef={beamLevel} />

      {/* The type wall the camera dollies through (real text lives in the DOM; this is aria-hidden scenery). */}
      <group ref={words} position={[0, 0.1, WALL_Z]}>
        <Text font={FONT} fontSize={0.82} letterSpacing={0.02} anchorX="center" anchorY="bottom" position={[0, 0.05, 0]}>
          {headline.lead.toUpperCase()}
          <meshStandardMaterial color={config.three.gold} metalness={0.85} roughness={0.28} emissive="#8C6A3F" emissiveIntensity={0.2} />
        </Text>
        <Text font={FONT_ITALIC} fontSize={0.95} anchorX="center" anchorY="top" position={[0, -0.05, 0.25]}>
          {headline.emphasis}
          <meshStandardMaterial color="#F3EBDD" metalness={0.2} roughness={0.5} emissive="#E8C98A" emissiveIntensity={0.2} />
        </Text>
      </group>

      <EffectComposer multisampling={4}>
        <DepthOfField ref={dof} focalLength={0.03} bokehScale={5} height={560} />
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.7} luminanceSmoothing={0.3} radius={0.8} />
        <Vignette offset={0.3} darkness={0.85} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </>
  );
}

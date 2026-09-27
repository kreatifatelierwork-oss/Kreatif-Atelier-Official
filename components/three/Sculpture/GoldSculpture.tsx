"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { config, type SculptureVariant } from "@/lib/config";
import {
  sculptureBeginNormal,
  sculptureBeginVertex,
  sculptureFragmentHeader,
  sculptureRoughness,
  sculptureVertexHeader,
} from "../shaders/sculpture.glsl";

type Props = {
  variant: SculptureVariant;
  segments: readonly [number, number];
  /** False with reduced motion: one still, fully formed pose. */
  animated: boolean;
  /** Starts the grow-in once the scene is ready. */
  revealing: boolean;
};

type SculptureUniforms = Record<"uTime" | "uReveal", { value: number }>;

/** A still frame chosen to look composed when nothing moves (reduced motion). */
const STILL_TIME = 7.5;

export function GoldSculpture({ variant, segments, animated, revealing }: Props) {
  const [segT, segU] = segments;
  const spinRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const revealStart = useRef<number | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: animated ? 0 : STILL_TIME },
      uReveal: { value: animated ? 0 : 1 },
      uP: { value: variant.p },
      uQ: { value: variant.q },
      uKnotR: { value: variant.knotRadius },
      uTubeR: { value: variant.tubeRadius },
      uBreath: { value: variant.breath },
      uWidth: { value: variant.width },
      uThick: { value: variant.thickness },
      uExp: { value: variant.exponent },
      uTwist: { value: variant.twist },
      uTwistSpeed: { value: variant.twistSpeed },
      uNoiseAmp: { value: variant.noiseAmp },
      uNoiseFreq: { value: variant.noiseFreq },
      uNoiseSpeed: { value: variant.noiseSpeed },
      uRippleAmp: { value: variant.rippleAmp },
      uRippleFreq: { value: variant.rippleFreq },
      uRippleSpeed: { value: variant.rippleSpeed },
      uRoughVar: { value: variant.roughnessVariation },
    }),
    [variant, animated],
  );

  // A flat grid of (t, u) parameters; the vertex shader turns it into the knot.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, segT, segU);
    g.setAttribute("aParam", g.getAttribute("uv").clone());
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), variant.knotRadius + variant.tubeRadius + 0.5);
    return g;
  }, [segT, segU, variant.knotRadius, variant.tubeRadius]);

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(config.three.gold),
      metalness: 1,
      roughness: variant.roughness,
      clearcoat: variant.clearcoat,
      clearcoatRoughness: variant.clearcoatRoughness,
      envMapIntensity: variant.envIntensity,
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${sculptureVertexHeader}`)
        .replace("#include <beginnormal_vertex>", sculptureBeginNormal)
        .replace("#include <begin_vertex>", sculptureBeginVertex);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>\n${sculptureFragmentHeader}`)
        .replace("#include <roughnessmap_fragment>", sculptureRoughness);
    };
    m.customProgramCacheKey = () => `ka-sculpture-${variant.clearcoat > 0 ? "cc" : "plain"}`;
    m.userData.uniforms = uniforms;
    return m;
  }, [variant, uniforms]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!animated || !mesh) return;
    const u = (mesh.material as THREE.Material).userData.uniforms as SculptureUniforms;
    u.uTime.value += delta;
    if (spinRef.current) spinRef.current.rotation.z += delta * variant.spin;

    if (revealing) {
      if (revealStart.current === null) revealStart.current = state.clock.elapsedTime;
      const t = Math.min(1, (state.clock.elapsedTime - revealStart.current) / config.three.hero.revealSeconds);
      u.uReveal.value = 1 - Math.pow(1 - t, 3);
    }
  });

  return (
    <group rotation={variant.tilt}>
      <group ref={spinRef}>
        <mesh ref={meshRef} geometry={geometry} material={material} />
      </group>
    </group>
  );
}

/** Radius of the sculpture's bounding circle, used to fit it inside the hero anchor. */
export const sculptureRadius = (v: SculptureVariant) => v.knotRadius + v.tubeRadius + Math.max(v.width, v.thickness);

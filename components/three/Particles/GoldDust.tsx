"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { config } from "@/lib/config";

const vertexShader = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
varying float vGlow;
varying float vAlpha;

void main() {
  vec3 p = position;
  // Slow, individual orbits — dust hanging in warm air, never a uniform drift.
  float speed = 0.06 + aSeed.x * 0.1;
  float t = uTime * speed;
  p += vec3(
    sin(t + aSeed.y * 6.2831),
    cos(t * 0.83 + aSeed.z * 6.2831),
    sin(t * 0.61 + aSeed.w * 6.2831)
  ) * (0.12 + aSeed.x * 0.3);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // Mostly fine glints, with the odd large, soft, dim mote drifting out of focus.
  float bokeh = pow(aSeed.w, 6.0);
  float size = uSize * (0.45 + bokeh * 4.5);
  gl_PointSize = size * uPixelRatio * (6.0 / max(0.5, -mv.z));

  float twinkle = 0.55 + 0.45 * sin(uTime * (0.5 + aSeed.y * 1.6) + aSeed.z * 40.0);
  vGlow = mix(0.7, 2.6, pow(aSeed.y, 4.0)) * twinkle * mix(1.0, 0.18, bokeh);
  vAlpha = twinkle * mix(1.0, 0.45, bokeh);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vGlow;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.0, d);
  disc *= disc;
  float a = disc * vAlpha * uOpacity;
  gl_FragColor = vec4(uColor * vGlow * a, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

type Props = { count: number; animated: boolean; opacity: number };

/** Deterministic PRNG (mulberry32) so the dust layout is identical on every render and visit. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createDustGeometry(count: number) {
  const { clustered, innerRadius, outerRadius } = config.three.dust;
  const random = seeded(20250928);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    if (i < count * clustered) {
      // Spherical shell around the sculpture, flattened a little in depth.
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const radius = innerRadius + Math.pow(random(), 0.7) * (outerRadius - innerRadius);
      v.setFromSphericalCoords(radius, phi, theta);
      v.z *= 0.6;
    } else {
      // Loose field across the whole frame, near and far.
      v.set((random() - 0.5) * 16, (random() - 0.5) * 9, -6 + random() * 9);
    }
    positions.set([v.x, v.y, v.z], i * 3);
    seeds.set([random(), random(), random(), random()], i * 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  return g;
}

/** Gold dust: a few thousand soft points, most clustered around the sculpture, some drifting across the frame. */
export function GoldDust({ count, animated, opacity }: Props) {
  const dpr = useThree((s) => s.viewport.dpr);

  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => createDustGeometry(count), [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: animated ? 0 : 12 },
          uSize: { value: config.three.dust.size },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color(config.three.dust.color) },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [animated],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uPixelRatio.value = dpr;
    if (animated) u.uTime.value += delta;
    // Ease the dust in with the sculpture.
    u.uOpacity.value += (opacity * config.three.dust.opacity - u.uOpacity.value) * Math.min(1, delta * 1.5);
    if (!animated) u.uOpacity.value = opacity * config.three.dust.opacity;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

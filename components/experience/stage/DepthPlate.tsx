"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Runtime } from "../journey";
import { hold, plate } from "./kit";

/**
 * The interim world (until a place's splat arrives): a plate displaced into real geometry by its depth map (Depth
 * Anything V2, scripts/v5/depth.py). Every vertex sits on its pixel's viewing ray from an anchor behind the stretch,
 * at the distance its depth gives, so the camera moves inside a deep diorama with true parallax. Steep depth edges
 * thin out instead of stretching into rubber sheets.
 */
const vert = /* glsl */ `
uniform sampler2D uDepth;
uniform float uNear, uFar, uTanX, uTanY, uHorizon;
uniform vec2 uTexel;
varying vec2 vUv;
varying float vEdge;
varying float vDist;
#include <fog_pars_vertex>
float distAt(vec2 uv) {
  // Above the plate's horizon the painted sky is a distant backdrop, never geometry overhead.
  float d = texture2D(uDepth, uv).r * (1.0 - smoothstep(uHorizon - 0.14, uHorizon + 0.04, uv.y));
  // Disparity (white = near) → distance, interpolating in inverse depth.
  return 1.0 / mix(1.0 / uFar, 1.0 / uNear, pow(d, 1.35));
}
void main() {
  vUv = uv;
  float z = distAt(uv);
  float zx = distAt(uv + vec2(uTexel.x * 2.0, 0.0)), zy = distAt(uv + vec2(0.0, uTexel.y * 2.0));
  vEdge = max(abs(z - zx), abs(z - zy)) / z;
  vDist = z;
  vec3 ray = vec3((uv.x * 2.0 - 1.0) * uTanX, (uv.y * 2.0 - 1.0) * uTanY, -1.0);
  vec4 mvPosition = modelViewMatrix * vec4(ray * z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const frag = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity, uDim;
uniform vec3 uTint;
varying vec2 vUv;
varying float vEdge;
varying float vDist;
#include <fog_pars_fragment>
void main() {
  vec4 c = texture2D(uMap, vUv);
  // Stretched faces across a depth edge fade out (the layer behind shows through).
  float keep = 1.0 - smoothstep(0.08, 0.3, vEdge);
  // The plate's top and side edges dissolve into the sky, so no edge is ever seen from inside the diorama.
  keep *= smoothstep(1.0, 0.82, vUv.y) * smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
  gl_FragColor = vec4(c.rgb * uTint * uDim, uOpacity * keep);
  #include <colorspace_fragment>
}`;

/** Where a stretch's diorama is anchored: behind its first hold, looking along the stretch. */
export function plateAnchor(from: number, to: number, back = 30) {
  const a = hold(from), b = hold(to);
  const dir = b.pos.clone().sub(a.pos).add(a.dir.clone().multiplyScalar(40)).normalize();
  const position = a.pos.clone().addScaledVector(dir, -back);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(position, position.clone().add(dir), new THREE.Vector3(0, 1, 0)));
  return { position, quaternion };
}

export function DepthPlate({ rtRef, name, mobile, from, to, anchor, horizon = 1.1, back = 30, near = 14, far = 420, fovX = 112, aspect, night, tint = "#ffffff" }: {
  rtRef: { current: Runtime }; name: string; mobile: boolean; from: number; to: number;
  /** The place the diorama is anchored behind (default: the stretch's first). */ anchor?: number;
  /** The plate's horizon (0 = bottom, 1 = top); sky above it stays far. */ horizon?: number;
  /** How far behind the stretch's first hold the anchor sits (m): the camera then moves inside the diorama. */
  back?: number; near?: number; far?: number; fovX?: number; aspect: number; night: boolean; tint?: string;
}) {
  const [map, depth] = useTexture([plate(name, mobile), `/v5/depth/${name}.png`]);
  const { mat, geo, pos, quat } = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    depth.colorSpace = THREE.NoColorSpace;
    depth.minFilter = depth.magFilter = THREE.LinearFilter;
    const tanX = Math.tan(THREE.MathUtils.degToRad(fovX) / 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: true, side: THREE.DoubleSide, fog: false,
      uniforms: {
        uMap: { value: map }, uDepth: { value: depth }, uNear: { value: near }, uFar: { value: far }, uTanX: { value: tanX }, uHorizon: { value: horizon },
        uTanY: { value: tanX / aspect }, uTexel: { value: new THREE.Vector2(1 / 1022, 1 / (1022 / aspect)) },
        uOpacity: { value: 1 }, uDim: { value: 1 }, uTint: { value: new THREE.Color(tint) },
      },
    });
    const n = mobile ? [160, 90] : [320, 180];
    const geo = new THREE.PlaneGeometry(1, 1, n[0], Math.round(n[0] / aspect));
    const { position: pos, quaternion: quat } = plateAnchor(anchor ?? from, to, back);
    return { mat, geo, pos, quat };
  }, [map, depth, near, far, fovX, aspect, mobile, from, to, anchor, horizon, back, tint]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const s = rtRef.current.s;
    const o = Math.min(THREE.MathUtils.smoothstep(s, from - 0.9, from - 0.3), 1 - THREE.MathUtils.smoothstep(s, to + 0.3, to + 0.9));
    mat.uniforms.uOpacity.value = o;
    mat.uniforms.uDim.value = night ? 0.42 : 1;
    if (ref.current) ref.current.visible = o > 0.003;
  });
  return <mesh ref={ref} geometry={geo} material={mat} position={pos} quaternion={quat} renderOrder={-4} frustumCulled={false} />;
}

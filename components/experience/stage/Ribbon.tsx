"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { Runtime } from "../journey";
import { LAST } from "../route";
import { pointAt } from "./kit";

const N = 96;

const vert = /* glsl */ `
attribute float aT;
attribute float aSide;
varying float vT;
varying float vSide;
#include <fog_pars_vertex>
void main() {
  vT = aT; vSide = aSide;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}`;
const frag = /* glsl */ `
uniform float uTime, uShow;
uniform vec3 uGold, uHot;
varying float vT;
varying float vSide;
void main() {
  // Bright filaments along the length, a hot core, fading at both ends.
  float edge = 1.0 - abs(vSide);
  float fil = 0.55 + 0.45 * sin(vSide * 9.0 + vT * 30.0 - uTime * 2.2);
  float ends = smoothstep(0.0, 0.12, vT) * (1.0 - smoothstep(0.55, 1.0, vT));
  float core = pow(edge, 3.0);
  vec3 col = mix(uGold, uHot, core * 0.8) * (0.55 + 0.6 * fil);
  float a = (0.25 + 0.75 * core) * ends * uShow * (0.6 + 0.4 * pow(edge, 0.6));
  gl_FragColor = vec4(col * a, a);
}`;

/**
 * The Idea: a folded ribbon of gold light just ahead of the camera, on the route the camera is about to take. It
 * leads the way, banks with the path, and folds over itself as it goes (never a sphere).
 */
export function Ribbon({ rtRef, mobile, calm, riseAtRef }: { rtRef: { current: Runtime }; mobile: boolean; calm: boolean; riseAtRef: { current: number | null } }) {
  const { mesh, mat, pos } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array((N + 1) * 2 * 3);
    const t = new Float32Array((N + 1) * 2), side = new Float32Array((N + 1) * 2);
    const idx: number[] = [];
    for (let k = 0; k <= N; k++) {
      t[k * 2] = t[k * 2 + 1] = k / N;
      side[k * 2] = -1; side[k * 2 + 1] = 1;
      if (k < N) { const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
    g.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
    g.setIndex(idx);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide, fog: false,
      uniforms: { uTime: { value: 0 }, uShow: { value: 0 }, uGold: { value: new THREE.Color("#C9A45C") }, uHot: { value: new THREE.Color("#FFF1C8") } },
    });
    const mesh = new THREE.Mesh(g, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 3;
    return { mesh, mat, pos };
  }, []);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), q: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), cam: new THREE.Vector3() }), []);
  useFrame(({ camera, clock }) => {
    const now = performance.now();
    const rise = riseAtRef.current;
    const show = rise == null ? 0 : calm ? 1 : Math.min(1, (now - rise) / 2200);
    mat.uniforms.uShow.value = show;
    mat.uniforms.uTime.value = calm ? 0 : clock.elapsedTime;
    const s = rtRef.current.s;
    const time = calm ? 0 : clock.elapsedTime;
    const len = mobile ? 0.5 : 0.62;
    tmp.cam.copy(camera.position);
    for (let k = 0; k <= N; k++) {
      const f = k / N;
      const u = Math.min(LAST, s + 0.1 + f * len);
      pointAt(u, tmp.p);
      pointAt(Math.min(LAST, u + 0.01), tmp.q);
      tmp.t.subVectors(tmp.q, tmp.p).normalize();
      if (tmp.t.lengthSq() < 1e-6) tmp.t.set(0, 0, -1);
      tmp.b.crossVectors(tmp.t, tmp.up).normalize();
      if (tmp.b.lengthSq() < 1e-6) tmp.b.set(1, 0, 0);
      tmp.n.crossVectors(tmp.b, tmp.t).normalize();
      // Below the eye line, swinging side to side, and folding (the width turns through the ribbon's normal).
      const d = tmp.p.distanceTo(tmp.cam);
      const swing = Math.sin(f * 7.0 + time * 0.6) * (0.25 + d * 0.06);
      const fall = -(0.35 + d * 0.035);
      tmp.p.addScaledVector(tmp.b, swing).addScaledVector(tmp.n, fall);
      const fold = f * 9.0 + time * 0.8;
      const w = (0.05 + d * 0.012) * (0.4 + 0.6 * Math.sin(Math.PI * Math.min(1, f * 1.4)));
      const wx = Math.cos(fold) * w, wy = Math.sin(fold) * w;
      const i = k * 6;
      pos[i] = tmp.p.x - tmp.b.x * wx - tmp.n.x * wy; pos[i + 1] = tmp.p.y - tmp.b.y * wx - tmp.n.y * wy; pos[i + 2] = tmp.p.z - tmp.b.z * wx - tmp.n.z * wy;
      pos[i + 3] = tmp.p.x + tmp.b.x * wx + tmp.n.x * wy; pos[i + 4] = tmp.p.y + tmp.b.y * wx + tmp.n.y * wy; pos[i + 5] = tmp.p.z + tmp.b.z * wx + tmp.n.z * wy;
    }
    mesh.geometry.attributes.position.needsUpdate = true;
  });
  return <primitive object={mesh} />;
}

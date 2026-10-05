"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { Runtime } from "../journey";
import { LAST, route } from "../route";
import { hold } from "./kit";

/** Per chapter: zenith, horizon, sun colour, and the sun's place (yaw from the chapter's first view, elevation). */
export const SKIES: { zenith: string; horizon: string; sun: string; yaw: number; elev: number; size: number }[] = [
  { zenith: "#93AFC4", horizon: "#F3E2BC", sun: "#FFE9B8", yaw: -8, elev: 22, size: 0.035 }, // The Seed
  { zenith: "#86AED6", horizon: "#F6E8CA", sun: "#FFF0C8", yaw: 30, elev: 60, size: 0.04 }, // The Climb
  { zenith: "#5F7FA8", horizon: "#F8C88A", sun: "#FFF1CF", yaw: 0, elev: 2.5, size: 0.05 }, // Above the Canopy
  { zenith: "#5C7AA3", horizon: "#F6BF85", sun: "#FFEBC2", yaw: 6, elev: 4, size: 0.05 }, // The Five Peaks
  { zenith: "#1B1F5E", horizon: "#E2744A", sun: "#FFB070", yaw: 40, elev: 2, size: 0.04 }, // Aurelius
  { zenith: "#14060E", horizon: "#4A0E2E", sun: "#FF6FB0", yaw: 0, elev: 40, size: 0.02 }, // GGP
  { zenith: "#5E5596", horizon: "#FF8C5E", sun: "#FFD49A", yaw: 25, elev: 3, size: 0.05 }, // Valora
  { zenith: "#97B6C4", horizon: "#F3DBBE", sun: "#FFF1D2", yaw: 15, elev: 10, size: 0.04 }, // Asraya
  { zenith: "#06172A", horizon: "#2C6C86", sun: "#B8F2FF", yaw: -40, elev: 6, size: 0.03 }, // Rudra Yugen
  { zenith: "#33386F", horizon: "#EE875A", sun: "#FFC48A", yaw: -45, elev: 4, size: 0.045 }, // The Summit
  { zenith: "#030716", horizon: "#18224A", sun: "#FFB070", yaw: -60, elev: -2, size: 0.03 }, // The Night Sky
  { zenith: "#A6B8CB", horizon: "#F7D6A6", sun: "#FFF0CC", yaw: -12, elev: 8, size: 0.05 }, // Return
];

const vert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // always at the far plane
}`;
const frag = /* glsl */ `
uniform vec3 uZenith, uHorizon, uSun, uSunDir;
uniform float uSize, uNight;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, -0.2, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(max(h, 0.0), 0.55));
  col = mix(col, uHorizon * 0.7, smoothstep(0.0, -0.2, h));
  float c = max(dot(d, uSunDir), 0.0);
  col += uSun * (smoothstep(1.0 - uSize * 0.06, 1.0 - uSize * 0.04, c) * 1.6 + pow(c, 18.0) * 0.55 + pow(c, 3.0) * 0.12);
  col *= mix(1.0, 0.32, uNight);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const sunDirOf = (chapter: number) => {
  const first = route.findIndex((p) => p.chapter === chapter);
  const { dir } = hold(Math.max(0, first));
  const yaw = Math.atan2(dir.x, -dir.z) + THREE.MathUtils.degToRad(SKIES[chapter].yaw);
  const e = THREE.MathUtils.degToRad(SKIES[chapter].elev);
  return new THREE.Vector3(Math.sin(yaw) * Math.cos(e), Math.sin(e), -Math.cos(yaw) * Math.cos(e));
};
let dirs: THREE.Vector3[] | null = null;
const sunDir = (chapter: number) => (dirs ??= SKIES.map((_, c) => sunDirOf(c)))[chapter];

/** The sky around the camera: its colours and the one sun blend from chapter to chapter with the camera's position. */
export function Sky({ rtRef, night }: { rtRef: { current: Runtime }; night: boolean }) {
  const data = useMemo(() => SKIES.map((k, c) => ({
    zenith: new THREE.Color(k.zenith), horizon: new THREE.Color(k.horizon), sun: new THREE.Color(k.sun), dir: sunDir(c), size: k.size,
  })), []);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() }, uSun: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3() }, uSize: { value: 0.04 }, uNight: { value: 0 },
    },
  }), []);
  const mesh = useMemo(() => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(390, 32, 16), mat);
    m.renderOrder = -10;
    m.frustumCulled = false;
    return m;
  }, [mat]);
  useFrame(({ camera }) => {
    const s = rtRef.current.s;
    const i = Math.min(LAST - 1, Math.floor(s)), f = s - i;
    const a = data[route[i].chapter], b = data[route[i + 1].chapter];
    const u = mat.uniforms;
    u.uZenith.value.copy(a.zenith).lerp(b.zenith, f);
    u.uHorizon.value.copy(a.horizon).lerp(b.horizon, f);
    u.uSun.value.copy(a.sun).lerp(b.sun, f);
    u.uSunDir.value.copy(a.dir).lerp(b.dir, f).normalize();
    u.uSize.value = a.size + (b.size - a.size) * f;
    u.uNight.value = night ? 1 : 0;
    mesh.position.copy(camera.position);
  });
  return <primitive object={mesh} />;
}

/** The sun's direction at route position s (for the one directional light and the god rays). */
export function sunAt(s: number, out: THREE.Vector3) {
  const i = Math.min(LAST - 1, Math.floor(Math.max(0, s))), f = s - i;
  return out.copy(sunDir(route[i].chapter)).lerp(sunDir(route[i + 1].chapter), f).normalize();
}

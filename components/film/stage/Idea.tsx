"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { filmConfig as F } from "@/lib/config";
import type { FilmState } from "../state";
import { TRAIL } from "../state";
import { buildForms, FORM_COUNT } from "./forms";

const VERT = /* glsl */ `
attribute vec3 aF0; attribute vec3 aF1; attribute vec3 aF2; attribute vec3 aF3;
attribute vec3 aF4; attribute vec3 aF5; attribute vec3 aF6;
attribute vec4 aRand;
uniform float uFrom; uniform float uTo; uniform float uMix; uniform float uRise; uniform float uTime;
uniform float uPulse; uniform float uStreak; uniform float uSize; uniform float uPixelRatio; uniform float uPush;
uniform vec4 uImp[${TRAIL}]; uniform float uImpAge[${TRAIL}]; uniform vec2 uAspect;
uniform vec3 uGold; uniform vec3 uGoldBright; uniform vec3 uHouses[5];
varying vec3 vColor; varying float vAlpha;
vec3 form(float k) {
  if (k < 0.5) return aF0; if (k < 1.5) return aF1; if (k < 2.5) return aF2; if (k < 3.5) return aF3;
  if (k < 4.5) return aF4; if (k < 5.5) return aF5; return aF6;
}
void main() {
  float m = clamp(uMix * 1.3 - aRand.y * 0.3, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 p = mix(form(uFrom), form(uTo), m);
  // The change of form streaks particles outward mid-way (a dissolve), then they settle.
  float mid = sin(3.14159 * m);
  vec3 dir = normalize(vec3(sin(aRand.w * 40.0), cos(aRand.x * 33.0), sin(aRand.y * 27.0)) + 1e-4);
  p += dir * mid * 0.5 * uStreak;
  // The raw idea is restless.
  float rawW = (1.0 - step(0.5, uFrom)) * (1.0 - m) + (1.0 - step(0.5, uTo)) * m;
  p += rawW * 0.05 * vec3(sin(uTime * 1.3 + aRand.w * 20.0), sin(uTime * 1.1 + aRand.x * 17.0), cos(uTime * 0.9 + aRand.y * 23.0));
  // Rise: particles gather from below and condense into the form (a ghost that materialises).
  float rd = clamp(uRise * 1.35 - aRand.y * 0.35, 0.0, 1.0);
  float re = 1.0 - pow(1.0 - rd, 3.0);
  vec3 start = p * 1.8 + vec3((aRand.x - 0.5) * 3.2, -4.8 - aRand.y * 2.4, (aRand.w - 0.5) * 2.0);
  p = mix(start, p, re);
  p *= 1.0 + uPulse * 0.09 * (0.6 + aRand.x);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  // Pushed by the cursor's recent motion (screen space), like the ink.
  vec2 suv = clip.xy / clip.w * 0.5 + 0.5;
  vec2 push = vec2(0.0);
  for (int i = 0; i < ${TRAIL}; i++) {
    vec2 d = (suv - uImp[i].xy) * uAspect;
    push += uImp[i].zw * exp(-dot(d, d) / 0.014) * exp(-uImpAge[i] / 0.5);
  }
  mv.xy += push * uPush * (0.5 + aRand.x);
  gl_Position = projectionMatrix * mv;
  float ghost = max(1.0 - re * re, mid * 0.85);
  gl_PointSize = uSize * (0.55 + aRand.x * 0.9) * uPixelRatio / -mv.z * (1.0 + ghost * 1.2);
  vec3 gold = mix(uGold, uGoldBright, aRand.w);
  vColor = mix(gold, uHouses[int(aRand.z)], ghost);
  vAlpha = mix(0.25, 1.0, re);
}`;

const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.16, r) * vAlpha);
}`;

const hex = (c: string) => new THREE.Color(c);

type Props = {
  stateRef: { current: FilmState };
  palette: "a" | "b";
  mobile: boolean;
  calm: boolean;
  /** performance.now() at which the rise starts (null = not yet). */
  riseAtRef: { current: number | null };
  onSwap?: (step: number) => void;
};

/**
 * The Idea: one cloud of gold light that changes form. It looks at the cursor with weight (a quick first move, then a
 * long, damped settle), is nudged by the cursor's motion, and changes form when the pointer moves onto it.
 */
export function Idea({ stateRef, palette, mobile, calm, riseAtRef, onSwap }: Props) {
  const count = mobile ? F.idea.count.mobile : F.idea.count.desktop;
  const outer = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const inner = useRef<THREE.Group>(null);
  const { camera, size, gl } = useThree();
  const pal = F.palettes[palette];

  const { geometry, material } = useMemo(() => {
    const { forms, rand } = buildForms(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(forms[0], 3));
    forms.forEach((f, k) => g.setAttribute(`aF${k}`, new THREE.BufferAttribute(f, 3)));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: palette === "b" ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 0 }, uRise: { value: 0 }, uTime: { value: 0 },
        uPulse: { value: 0 }, uStreak: { value: calm ? 0 : 1 }, uSize: { value: mobile ? 26 : 30 }, uPixelRatio: { value: 1 },
        uPush: { value: calm ? 0 : 0.12 },
        uImp: { value: Array.from({ length: TRAIL }, () => new THREE.Vector4(-9, -9, 0, 0)) },
        uImpAge: { value: new Array(TRAIL).fill(99) },
        uAspect: { value: new THREE.Vector2(1, 1) },
        uGold: { value: hex(pal.gold) }, uGoldBright: { value: hex(pal.goldBright) },
        uHouses: { value: F.ghost.map(hex) },
      },
    });
    return { geometry: g, material: m };
  }, [count, palette, mobile, calm, pal.gold, pal.goldBright]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const motion = useRef({ fy: 0, sy: 0, fp: 0, sp: 0, cur: 0, from: 0, to: 0, swapAt: -1, swapSeen: 0, pulseAt: -1e4, pulseSeen: 0, frames: 0, fpsT: 0 });
  const tmpRef = useRef({ c: new THREE.Vector3(), e: new THREE.Vector3(), right: new THREE.Vector3() });

  useFrame(({ clock }, dt) => {
    const o = outer.current, n = inner.current, pts = pointsRef.current;
    if (!o || !n || !pts) return;
    const state = stateRef.current;
    const tmp = tmpRef.current;
    const now = performance.now();
    const t = clock.elapsedTime;
    const u = (pts.material as THREE.ShaderMaterial).uniforms;
    const mo = motion.current;
    const p = state.pointer;
    u.uTime.value = t;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uAspect.value.set(size.width / size.height, 1);

    // Rise.
    const riseAt = riseAtRef.current;
    u.uRise.value = riseAt == null ? 0 : Math.min(1, Math.max(0, (now - riseAt) / F.opening.ideaRiseMs));

    // Look at the pointer: two-stage follow (fast share + heavy tail).
    const yawMax = THREE.MathUtils.degToRad(calm ? F.idea.calmYaw : F.idea.yaw);
    const pitchMax = THREE.MathUtils.degToRad(calm ? F.idea.calmPitch : F.idea.pitch);
    const nx = p.active ? (p.x / size.width) * 2 - 1 : 0;
    const ny = p.active ? (p.y / size.height) * 2 - 1 : 0;
    const ty = nx * yawMax, tp = ny * pitchMax;
    const kf = 1 - Math.exp(-dt / F.idea.fastTau), ks = 1 - Math.exp(-dt / F.idea.slowTau);
    mo.fy += (ty - mo.fy) * kf; mo.sy += (ty - mo.sy) * ks;
    mo.fp += (tp - mo.fp) * kf; mo.sp += (tp - mo.sp) * ks;
    const share = F.idea.fastShare;
    o.rotation.y = mo.fy * share + mo.sy * (1 - share);
    o.rotation.x = mo.fp * share + mo.sp * (1 - share);
    if (!calm) {
      n.rotation.y += dt * 0.07;
      n.position.y = Math.sin(t * 0.8) * 0.06;
    }

    // Change of form (requested by the shell when the pointer moves onto the Idea, or a tap).
    if (state.requests.swap !== mo.swapSeen) {
      mo.swapSeen = state.requests.swap;
      if (mo.swapAt < 0 && u.uRise.value >= 1) {
        mo.from = mo.cur; mo.to = (mo.cur + 1) % FORM_COUNT; mo.swapAt = now;
        onSwap?.(mo.to);
      }
    }
    if (mo.swapAt >= 0) {
      const k = Math.min(1, (now - mo.swapAt) / (calm ? 300 : F.idea.swapMs));
      u.uFrom.value = mo.from; u.uTo.value = mo.to; u.uMix.value = k;
      if (k >= 1) { mo.cur = mo.to; mo.swapAt = -1; u.uFrom.value = mo.cur; u.uTo.value = mo.cur; u.uMix.value = 0; }
    }
    state.stats.form = mo.swapAt >= 0 ? mo.to : mo.cur;

    // Pulse on click.
    if (state.requests.pulse !== mo.pulseSeen) { mo.pulseSeen = state.requests.pulse; mo.pulseAt = now; }
    const pk = (now - mo.pulseAt) / 520;
    u.uPulse.value = pk >= 0 && pk < 1 && !calm ? Math.sin(Math.PI * pk) * (1 - pk) : 0;

    // The cursor's recent motion (newest first) for the push.
    const imp = u.uImp.value as THREE.Vector4[];
    const age = u.uImpAge.value as number[];
    p.trail.forEach((s, i) => {
      imp[i].set(s.x / size.width, 1 - s.y / size.height, (s.vx / size.width) * 0.25, (-s.vy / size.height) * 0.25);
      age[i] = (now - s.t) / 1000;
    });

    // Publish the footprint on screen (for the ink's hole and for hover).
    o.getWorldPosition(tmp.c);
    tmp.right.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(1.55 * o.scale.x);
    tmp.e.copy(tmp.c).add(tmp.right).project(camera);
    tmp.c.project(camera);
    const cx = (tmp.c.x * 0.5 + 0.5) * size.width, cy = (1 - (tmp.c.y * 0.5 + 0.5)) * size.height;
    const ex = (tmp.e.x * 0.5 + 0.5) * size.width;
    state.idea.cx = cx; state.idea.cy = cy;
    state.idea.r = Math.abs(ex - cx) * Math.min(1, u.uRise.value * 1.2);
    state.idea.visible = u.uRise.value > 0.2;
    state.stats.particles = count;
    mo.frames++;
    if (now - mo.fpsT > 500) { state.stats.fps = Math.round((mo.frames * 1000) / (now - mo.fpsT)); mo.frames = 0; mo.fpsT = now; }
  });

  return (
    <group ref={outer} position={[0, mobile ? -0.95 : -0.55, 0]}>
      <group ref={inner}>
        <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </group>
  );
}

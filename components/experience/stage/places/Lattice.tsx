"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { interaction, spark, SPARKS } from "../../actions";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { LATTICE_CLUSTERS } from "../layout";
import { placeColours, plaster, stone, type Theme } from "../look";
import { markShadows } from "../shadows";

const PLACE = 7;
// A sunken void (the route arrives low, from the dive through the pool) open to the sky.
const X0 = 51, X1 = 77, Z0 = -301, Z1 = -333, Y0 = -4, Y1 = 30;

const PATTERN_FRAG = /* glsl */ `
uniform float uShow; uniform vec3 uCyan; varying vec2 vUv;
void main() {
  vec2 p = vUv * vec2(9.0, 11.0);
  vec2 g = abs(fract(vec2(p.x + p.y, p.x - p.y) * 0.5) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.05, min(g.x, g.y));
  // The pattern resolves outward from the middle as more panes come into line.
  float reveal = uShow * smoothstep(uShow * 0.9 - 0.25, uShow * 0.9, 1.0 - length(vUv - 0.5) * 1.5);
  gl_FragColor = vec4(uCyan, line * reveal * 0.85);
}`;
const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/**
 * The Glass Lattice (Rudra Yugen, electric cyan): a tall void of thin glass panes hanging on threads; one cyan beam
 * enters from above and splits through them. Spark (or click the glass) and signals turn more panes into line; when
 * enough align, a pattern resolves across the far wall: the discovery. Four clusters of panes are Rudra Yugen's four
 * offerings.
 */
export function Lattice({ theme, rtRef, mobile }: { theme: Theme; rtRef: { current: Runtime }; mobile: boolean }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const count = mobile ? 90 : 200;
  const mats = useMemo(() => ({
    wall: plaster(c.wall),
    floor: stone(c.floor),
    glass: new THREE.MeshStandardMaterial({ color: theme === "light" ? "#e9f9ff" : "#9fe3f7", roughness: 0.04, metalness: 0.15, transparent: true, opacity: 0.42, envMapIntensity: 1.5, side: THREE.DoubleSide }),
    thread: new THREE.LineBasicMaterial({ color: theme === "light" ? "#7fb9cc" : "#3b7c90", transparent: true, opacity: 0.5 }),
    beam: new THREE.MeshBasicMaterial({ color: "#5fd6f5", transparent: true, opacity: theme === "light" ? 0.07 : 0.1, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }),
  }), [c, theme]);
  const pattern = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: PATTERN_FRAG, transparent: true, depthWrite: false,
    uniforms: { uShow: { value: 0 }, uCyan: { value: new THREE.Color(theme === "light" ? "#0fb5e4" : "#5fd6f5") } },
  }), [theme]);
  const panes = useMemo(() => Array.from({ length: count }, (_, i) => {
    const r = (n: number) => { const x = Math.sin((i + 1) * 91.17 + n * 47.3) * 43758.5453; return x - Math.floor(x); };
    const cluster = i % 5 < 4 ? i % 5 : -1;
    const base = cluster >= 0 && r(9) < 0.55
      ? new THREE.Vector3(...LATTICE_CLUSTERS[cluster]).add(new THREE.Vector3((r(1) - 0.5) * 4, (r(2) - 0.5) * 4, (r(3) - 0.5) * 3))
      : new THREE.Vector3(X0 + 2 + r(1) * (X1 - X0 - 4), 1 + r(2) * 23, Z0 - 4 - r(3) * (Z0 - Z1 - 7));
    return { base, cluster, yaw: r(4) * Math.PI * 2, tilt: (r(5) - 0.5) * 0.6, order: r(6), turn: 0, glow: 0 };
  }), [count]);
  const threads = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(panes.flatMap((p) => [p.base.x, p.base.y + 0.9, p.base.z, p.base.x, Y1, p.base.z]), 3));
    return g;
  }, [panes]);
  const beamGeo = useMemo(() => new THREE.CylinderGeometry(1.2, 6, Y1 - 2, 40, 1, true), []);
  const inst = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), s: new THREE.Vector3(1, 1, 1), col: new THREE.Color(), cy: new THREE.Color("#0fb5e4"), wh: new THREE.Color("#ffffff") }), []);
  const things = route[PLACE].things;

  useFrame((_, dt) => {
    const mesh = inst.current;
    if (!mesh) return;
    const done = interaction.sparks / SPARKS;
    const since = (performance.now() - interaction.sparkAt) / 1000;
    const hover = useUi.getState().hover;
    const hc = things.findIndex((t) => t.id === hover);
    panes.forEach((p, i) => {
      const want = p.order < done ? 1 : 0;
      if (Math.abs(want - p.turn) > 0.002) markShadows();
      p.turn += (want - p.turn) * Math.min(1, dt * 1.6);
      const lit = (p.cluster === hc && hc >= 0 ? 1 : 0) + (since < 1.2 && p.order < done ? (1.2 - since) * 0.6 : 0);
      p.glow += (lit - p.glow) * Math.min(1, dt * 5);
      // Aligned panes face down the void toward you and level out.
      tmp.e.set(p.tilt * (1 - p.turn), p.yaw * (1 - p.turn), 0);
      tmp.q.setFromEuler(tmp.e);
      tmp.m.compose(p.base, tmp.q, tmp.s);
      mesh.setMatrixAt(i, tmp.m);
      tmp.col.copy(tmp.wh).lerp(tmp.cy, Math.min(1, p.glow * 0.8 + p.turn * 0.25));
      mesh.setColorAt(i, tmp.col);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    pattern.uniforms.uShow.value += (done - pattern.uniforms.uShow.value) * Math.min(1, dt * 1.2);
  });

  const onGlass = (e: ThreeEvent<MouseEvent>) => {
    if (Math.abs(rtRef.current.s - PLACE) > 0.3) return;
    e.stopPropagation();
    spark(performance.now());
  };
  const onHover = (e: ThreeEvent<PointerEvent>) => {
    if (Math.abs(rtRef.current.s - PLACE) > 0.3 || e.instanceId == null) return;
    const p = panes[e.instanceId];
    if (p.cluster >= 0 && things[p.cluster]) useUi.getState().set({ hover: things[p.cluster].id });
  };
  return (
    <group>
      <mesh material={mats.floor} position={[(X0 + X1) / 2, Y0, (Z0 + Z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[X1 - X0, Z0 - Z1]} />
      </mesh>
      {[X0, X1].map((x) => (
        <mesh key={x} material={mats.wall} position={[x, (Y0 + Y1) / 2, (Z0 + Z1) / 2]} castShadow receiveShadow>
          <boxGeometry args={[0.9, Y1 - Y0, Z0 - Z1]} />
        </mesh>
      ))}
      <mesh material={mats.wall} position={[(X0 + X1) / 2, (Y0 + Y1) / 2, Z1]} receiveShadow>
        <boxGeometry args={[X1 - X0, Y1 - Y0, 0.9]} />
      </mesh>
      <mesh material={pattern} position={[(X0 + X1) / 2, 11, Z1 + 0.5]}>
        <planeGeometry args={[X1 - X0 - 2, 26]} />
      </mesh>
      <mesh geometry={beamGeo} material={mats.beam} position={[64, (Y1 + 2) / 2, -318]} />
      <lineSegments geometry={threads} material={mats.thread} />
      <instancedMesh ref={inst} args={[undefined, undefined, count]} material={mats.glass} castShadow onClick={onGlass} onPointerMove={onHover}>
        <boxGeometry args={[1.25, 1.8, 0.03]} />
      </instancedMesh>
    </group>
  );
}

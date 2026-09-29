"use client";

import { useVideoTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";
import { worldCentre } from "./journey";
import { NODE_COUNT, type PlayState } from "./play";

export type Palette = "a" | "b";

type Common = {
  index: number;
  palette: Palette;
  animated: boolean;
  presenceRef: React.RefObject<number[]>;
  playRef: React.RefObject<PlayState>;
};

const GOLD = "#E2BE7A";

/** Glossy coloured material (lit by the studio environment); in palette B it also glows from within. */
function useWorldMaterial(accent: string, palette: Palette, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: accent,
        roughness: 0.2,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        emissive: palette === "b" ? accent : "#000000",
        emissiveIntensity: palette === "b" ? 0.8 : 0,
        ...opts,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accent, palette],
  );
}

const useGold = () => useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2 }), []);

/* ── 1 · Aurelius — a rising spiral of slabs; hold to raise it ────────────────── */
function Aurelius({ index, palette, animated, playRef }: Common) {
  const mat = useWorldMaterial(L.worlds[index].accent, palette);
  const gold = useGold();
  const slabs = useRef<(THREE.Mesh | null)[]>([]);
  const axis = useRef<THREE.Mesh>(null);
  const N = 16;
  const geo = useMemo(() => new THREE.BoxGeometry(1.7, 0.16, 0.62), []);

  useFrame((state) => {
    const raise = playRef.current?.raise ?? 0;
    const t = animated ? state.clock.elapsedTime : 4;
    const step = 0.2 + raise * 0.04;
    slabs.current.forEach((m, i) => {
      if (!m) return;
      const shown = i < 10 + Math.round(raise * (N - 12));
      m.scale.setScalar(m.scale.x + ((shown ? 1 : 0.001) - m.scale.x) * 0.12);
      const a = i * 0.52 + t * 0.12;
      m.position.set(Math.cos(a) * 0.95, -1.7 + i * step, Math.sin(a) * 0.95);
      m.rotation.y = -a;
    });
    if (axis.current) axis.current.scale.y = 1 + raise * 0.55;
  });

  return (
    <group>
      <mesh ref={axis} material={gold}>
        <cylinderGeometry args={[0.035, 0.035, 5.2, 16]} />
      </mesh>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(el) => { slabs.current[i] = el; }} geometry={geo} material={i % 5 === 4 ? gold : mat} />
      ))}
    </group>
  );
}

/* ── 2 · Valora — an arch of tiles that bridges when you tap; a light runs across when it closes ── */
function Valora({ index, palette, animated, presenceRef, playRef }: Common) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette);
  const gold = useGold();
  const inst = useRef<THREE.InstancedMesh>(null);
  const shown = useRef(0);
  const N = 34;
  const o = useMemo(() => new THREE.Object3D(), []);
  const base = useMemo(() => new THREE.Color(accent), [accent]);
  const light = useMemo(() => new THREE.Color("#FFF6E8"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const m = inst.current;
    if (!m) return;
    const t = animated ? state.clock.elapsedTime : 3;
    const pres = presenceRef.current?.[index] ?? 0;
    const play = playRef.current;
    shown.current += ((play?.bridge ?? 0) - shown.current) * Math.min(1, dt * (animated ? 4 : 60));
    const bridge = shown.current;
    const complete = bridge > 0.995;
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const a = Math.PI * u;
      // Tiles near the piers are in place from the start; each tap fills toward the keystone.
      const need = 1 - Math.abs(u - 0.5) * 2;
      const placed = Math.min(1, Math.max(0, (bridge * 1.1 + 0.34 - need) / 0.12));
      const arrive = Math.min(1, pres * 1.4) * placed;
      const scatter = (1 - arrive) * 1.8;
      o.position.set(
        -Math.cos(a) * 2.3 + Math.sin(i * 7.1) * scatter,
        -1.6 + Math.sin(a) * 2.6 + Math.cos(i * 3.3) * scatter,
        Math.sin(i * 1.7 + t * 0.6) * 0.05 + Math.sin(i * 5.3) * scatter,
      );
      o.rotation.set(0, 0, a - Math.PI / 2 + (1 - arrive) * i);
      o.scale.setScalar(0.3 + 0.7 * arrive);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      // Once bridged, a light runs back and forth across the arch.
      const run = complete && animated ? Math.exp(-Math.pow((u - (0.5 + 0.5 * Math.sin(t * 1.4))) * 7, 2)) : complete ? 0.25 : 0;
      tmp.copy(base).lerp(light, run * 0.85);
      m.setColorAt(i, tmp);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={inst} args={[undefined, undefined, N]} material={mat}>
        <boxGeometry args={[0.2, 0.34, 0.34]} />
      </instancedMesh>
      {[-2.3, 2.3].map((x) => (
        <mesh key={x} material={gold} position={[x, -2.05, 0]}>
          <boxGeometry args={[0.7, 0.3, 0.7]} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 3 · Golden Guardian Productions — an iris that opens onto a projected film ──────────────────── */

/** Abstract procedural "film": drifting light leaks, colour bands, a gate flicker and grain. */
const filmShader = {
  uniforms: {
    uTime: { value: 0 },
    uOpen: { value: 0 },
    uAccent: { value: new THREE.Color(L.worlds[3].accent) },
    uVideo: { value: null as THREE.Texture | null },
    uUseVideo: { value: 0 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform float uTime; uniform float uOpen; uniform vec3 uAccent; uniform sampler2D uVideo; uniform float uUseVideo;
    varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
    void main(){
      vec2 uv = vUv;
      float t = uTime;
      // "Shots": every ~2.2 s the composition cuts to a new arrangement.
      float shot = floor(t / 2.2);
      vec2 o = vec2(h(vec2(shot, 1.)), h(vec2(shot, 7.)));
      float leak = smoothstep(0.9, 0.0, length(uv - (0.3 + 0.4 * o) - 0.12 * vec2(sin(t*0.7), cos(t*0.5))));
      float bands = 0.5 + 0.5 * sin((uv.x * 3. + uv.y * 1.2) * 3.1416 + t * 0.9 + shot);
      float drift = n(uv * 3. + vec2(t * 0.25, shot));
      vec3 warm = vec3(1.0, 0.82, 0.55), cool = vec3(0.55, 0.7, 1.0);
      vec3 col = mix(uAccent * 0.55, mix(cool, warm, o.x), bands * 0.55);
      col += leak * vec3(1.0, 0.86, 0.66) * 1.1 + drift * 0.18;
      if (uUseVideo > 0.5) col = texture2D(uVideo, uv).rgb;
      float flicker = 0.93 + 0.07 * h(vec2(floor(t * 24.), 3.));
      float grain = (h(uv * 900. + t) - 0.5) * 0.08;
      float vign = smoothstep(0.75, 0.25, length(uv - 0.5));
      gl_FragColor = vec4((col * flicker + grain) * vign * (0.25 + 0.95 * uOpen), 1.0);
      #include <colorspace_fragment>
    }`,
};

/** Point the film screen at a video texture instead of the procedural film. */
function applyVideo(mesh: THREE.Mesh | null, tex: THREE.Texture) {
  const m = mesh?.material as THREE.ShaderMaterial | undefined;
  if (!m) return;
  m.uniforms.uVideo.value = tex;
  m.uniforms.uUseVideo.value = 1;
}

function VideoFeed({ src, screenRef }: { src: string; screenRef: React.RefObject<THREE.Mesh | null> }) {
  const tex = useVideoTexture(src, { muted: true, loop: true, start: true });
  useEffect(() => applyVideo(screenRef.current, tex), [tex, screenRef]);
  return null;
}

function Aperture({ index, palette, animated, playRef }: Common) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette, { side: THREE.DoubleSide });
  const gold = useGold();
  const blades = useRef<(THREE.Group | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);
  const screen = useRef<THREE.Mesh>(null);
  const N = 9;
  const film = useMemo(() => new THREE.ShaderMaterial({ ...filmShader, uniforms: THREE.UniformsUtils.clone(filmShader.uniforms) }), []);
  const blade = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(1.1, 0.35, 1.9, 1.3);
    s.lineTo(1.2, 1.6);
    s.quadraticCurveTo(0.7, 0.7, 0, 0.5);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
  }, []);

  useFrame((state) => {
    const p = playRef.current;
    const open = p?.roll ?? 0.12;
    const breathe = animated ? 0.04 * Math.sin(state.clock.elapsedTime * 0.8) : 0;
    const o = Math.min(1, open + breathe);
    blades.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z = (i / N) * Math.PI * 2 + (animated ? state.clock.elapsedTime * 0.05 : 0);
      const inner = g.children[0] as THREE.Mesh;
      inner.position.set(0.35 + o * 1.05, 0, 0);
      inner.rotation.z = -0.35 - o * 0.75;
    });
    if (screen.current) {
      const u = (screen.current.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = p?.filmTime ?? 0;
      u.uOpen.value = o;
    }
    if (beam.current) (beam.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + o * (palette === "b" ? 0.38 : 0.26);
  });

  return (
    <group position={[0, 0.3, 0]}>
      <mesh material={gold}>
        <torusGeometry args={[2.35, 0.08, 20, 120]} />
      </mesh>
      {/* The film is seen through the iris — a window onto a projection (swap in video via config). */}
      <mesh ref={screen} position={[0, 0, -0.25]} material={film}>
        <circleGeometry args={[2.3, 96]} />
      </mesh>
      {L.play.ggpVideo && (
        <Suspense fallback={null}>
          <VideoFeed src={L.play.ggpVideo} screenRef={screen} />
        </Suspense>
      )}
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(el) => { blades.current[i] = el; }}>
          <mesh geometry={blade} material={mat} />
        </group>
      ))}
      <mesh ref={beam} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 3.2]}>
        <cylinderGeometry args={[0.45, 1.8, 6.4, 48, 1, true]} />
        <meshBasicMaterial color={palette === "b" ? accent : "#FFFFFF"} transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ── 4 · Rudra Yugen — a lattice whose nodes you light with sparks (or by passing the pointer over them) ── */
function Lattice({ index, palette, animated, presenceRef, playRef }: Common) {
  const accent = L.worlds[index].accent;
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const shown = useRef(new Float32Array(NODE_COUNT));
  const flare = useRef({ sparks: 0, at: -10 });
  const o = useMemo(() => new THREE.Object3D(), []);
  const dim = useMemo(() => new THREE.Color(palette === "b" ? "#0B3A4A" : "#9FD3E4"), [palette]);
  const lit = useMemo(() => new THREE.Color(palette === "b" ? "#9FF0FF" : accent), [palette, accent]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const { edges, verts } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.1, 1);
    const e = new THREE.EdgesGeometry(ico);
    const pos = ico.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      seen.set(v.toArray().map((x) => x.toFixed(3)).join(","), v);
    }
    return { edges: e, verts: [...seen.values()].slice(0, NODE_COUNT) };
  }, []);
  const nodeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: accent, emissiveIntensity: palette === "b" ? 1.2 : 0.35, roughness: 0.3 }), [accent, palette]);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", transmission: 1, thickness: 1.2, roughness: 0.06, ior: 1.45, iridescence: 0.6, attenuationColor: accent, attenuationDistance: 2.2 }), [accent]);

  useFrame((state, dt) => {
    const p = playRef.current;
    if (animated && group.current) group.current.rotation.y += dt * 0.1;
    if (animated && inner.current) { inner.current.rotation.x += dt * 0.4; inner.current.rotation.z += dt * 0.25; }
    const m = nodes.current;
    if (!m || !p) return;
    if (p.sparks !== flare.current.sparks) flare.current = { sparks: p.sparks, at: state.clock.elapsedTime };
    const since = state.clock.elapsedTime - flare.current.at;
    for (let i = 0; i < verts.length; i++) {
      shown.current[i] += (p.nodes[i] - shown.current[i]) * Math.min(1, dt * (animated ? 3 : 60));
      const burst = animated && since < 0.8 && p.nodes[i] > 0.5 ? (1 - since / 0.8) * 0.9 : 0;
      o.position.copy(verts[i]);
      o.scale.setScalar(0.07 * (1 + shown.current[i] * 0.7 + burst));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, tmp.copy(dim).lerp(lit, shown.current[i]));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  // Passing the pointer over the lattice lights the nearest node (only while you're in this world).
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const p = playRef.current;
    if (!p || (presenceRef.current?.[index] ?? 0) < 0.6 || !group.current) return;
    const local = group.current.worldToLocal(e.point.clone());
    let best = 0, bestD = Infinity;
    verts.forEach((v, i) => { const d = v.distanceToSquared(local); if (d < bestD) { bestD = d; best = i; } });
    if (bestD < 0.5) p.nodes[best] = 1;
  };

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={palette === "b" ? accent : "#0B6F8C"} transparent opacity={0.75} />
      </lineSegments>
      <instancedMesh ref={nodes} args={[undefined, undefined, NODE_COUNT]} material={nodeMat}>
        <sphereGeometry args={[1, 16, 12]} />
      </instancedMesh>
      <mesh ref={inner} material={glass}>
        <octahedronGeometry args={[1.05, 0]} />
      </mesh>
      <mesh onPointerMove={onMove} visible={false}>
        <sphereGeometry args={[2.35, 24, 16]} />
      </mesh>
    </group>
  );
}

/* ── 5 · Asraya — a balanced cairn; hold to breathe (the stones lift apart, the ripples slow) ── */
function Cairn({ index, palette, animated, playRef }: Common) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette, { roughness: 0.32, clearcoat: 0.6 });
  const pale = useMemo(() => new THREE.MeshPhysicalMaterial({ color: palette === "b" ? "#1a4a38" : "#F4F7F2", roughness: 0.4, clearcoat: 0.5 }), [palette]);
  const stones = useRef<(THREE.Mesh | null)[]>([]);
  const ripples = useRef<(THREE.Mesh | null)[]>([]);
  const phase = useRef(0);
  const sizes = [1.25, 1.0, 0.8, 0.62, 0.46];

  useFrame((state, dt) => {
    const t = animated ? state.clock.elapsedTime : 2;
    const breath = playRef.current?.breath ?? 0;
    const eased = breath * breath * (3 - 2 * breath);
    let y = -1.75;
    stones.current.forEach((m, i) => {
      if (!m) return;
      const r = sizes[i];
      y += r * 0.42 + eased * 0.16 * i;
      m.position.set(Math.sin(t * 0.5 + i) * 0.05 * i * (1 - eased), y + (animated ? Math.sin(t * 0.8 + i * 0.7) * 0.04 * i : 0), 0);
      m.rotation.z = animated ? Math.sin(t * 0.4 + i) * 0.05 * (1 - eased) : 0;
      y += r * 0.42;
    });
    phase.current += dt * 0.18 * (1 - eased * 0.75);
    ripples.current.forEach((m, i) => {
      if (!m) return;
      const p = ((animated ? phase.current : 0.3) + i / 3) % 1;
      m.scale.setScalar(1 + p * (2.4 + eased * 1.2));
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - p) * (0.45 + eased * 0.3);
    });
  });

  return (
    <group>
      {sizes.map((r, i) => (
        <mesh key={i} ref={(el) => { stones.current[i] = el; }} scale={[r, r * 0.42, r * 0.9]} material={i % 2 ? pale : mat}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { ripples.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.76, 0]}>
          <ringGeometry args={[1.25, 1.29, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 0 · The core — a small orrery of the five colours around a radiant sphere; light lines join the worlds ── */
function Core({ palette, animated, finaleRef }: { palette: Palette; animated: boolean; finaleRef: React.RefObject<number> }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const spokes = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const gold = useGold();
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,244,214,1)");
    gr.addColorStop(0.3, "rgba(255,214,150,0.5)");
    gr.addColorStop(1, "rgba(255,214,150,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  // Light "spokes": core → each world, and world → next world — thin glowing tubes (visible at any distance).
  const spokeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: palette === "b" ? GOLD : "#A8782C", transparent: true, opacity: 0.16, depthWrite: false, toneMapped: palette !== "b" }),
    [palette],
  );
  const spokeMeshes = useMemo(() => {
    const segs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 1; i <= 5; i++) {
      segs.push([new THREE.Vector3(0, 0, 0), worldCentre(i)]);
      segs.push([worldCentre(i), worldCentre(i === 5 ? 1 : i + 1)]);
    }
    const up = new THREE.Vector3(0, 1, 0);
    return segs.map(([a, b]) => {
      const len = a.distanceTo(b);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const q = new THREE.Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize());
      return { len, mid, q };
    });
  }, []);

  useFrame((state) => {
    const t = animated ? state.clock.elapsedTime : 0;
    rings.current.forEach((m, i) => { if (m) m.rotation.set(0.6 + i * 0.35, t * (0.08 + i * 0.03) + i, 0.2 * i); });
    const fin = finaleRef.current ?? 0;
    const first = spokes.current?.children[0] as THREE.Mesh | undefined;
    if (first) (first.material as THREE.MeshBasicMaterial).opacity = 0.03 + fin * 0.87; // shared by every spoke
    if (halo.current) halo.current.scale.setScalar(5 + fin * 3 + (animated ? Math.sin(t) * 0.2 : 0));
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.05, 64, 48]} />
        <meshPhysicalMaterial color={palette === "b" ? "#FFE3A8" : "#FFF7E6"} emissive="#FFD58A" emissiveIntensity={palette === "b" ? 2.2 : 0.6} roughness={0.18} clearcoat={1} />
      </mesh>
      <sprite ref={halo}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} blending={palette === "b" ? THREE.AdditiveBlending : THREE.NormalBlending} opacity={palette === "b" ? 0.9 : 0.75} />
      </sprite>
      {L.worlds.slice(1, 6).map((w, i) => (
        <mesh key={w.key} ref={(el) => { rings.current[i] = el; }}>
          <torusGeometry args={[1.6 + i * 0.28, 0.022, 12, 160]} />
          <meshStandardMaterial color={w.accent} emissive={w.accent} emissiveIntensity={palette === "b" ? 1.2 : 0.25} roughness={0.3} metalness={0.3} />
        </mesh>
      ))}
      <mesh material={gold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[L.ringRadius, 0.035, 12, 400]} />
      </mesh>
      <group ref={spokes}>
        {spokeMeshes.map((s, i) => (
          <mesh key={i} position={s.mid} quaternion={s.q} material={spokeMat}>
            <cylinderGeometry args={[0.16, 0.16, s.len, 8, 1, true]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Where each world's four "what we do" labels attach, in the world's local space (projected to HTML). */
export const ANCHORS: [number, number, number][] = [
  [-2.8, 1.3, 0.6],
  [2.9, 0.8, 0.6],
  [-3.0, -0.5, 0.6],
  [2.8, -1.1, 0.6],
];

export const faceYaw = (i: number) => {
  const c = worldCentre(i);
  return Math.atan2(c.x, c.z);
};

export function WorldsGroup({ palette, animated, presenceRef, playRef, finaleRef }: {
  palette: Palette; animated: boolean; presenceRef: React.RefObject<number[]>; playRef: React.RefObject<PlayState>;
  finaleRef: React.RefObject<number>;
}) {
  const root = useRef<THREE.Group>(null);
  const common = { palette, animated, presenceRef, playRef };
  const place = (i: number) => worldCentre(i).toArray() as [number, number, number];
  const face = (i: number) => [0, faceYaw(i), 0] as [number, number, number];

  // Drag-to-turn at the core rotates the whole orrery; it eases home as you leave.
  useFrame((_, dt) => {
    const p = playRef.current;
    if (!p || !root.current) return;
    p.yaw += (p.yawTarget - p.yaw) * Math.min(1, dt * 4);
    root.current.rotation.y = p.yaw;
  });

  return (
    <group ref={root}>
      <Core palette={palette} animated={animated} finaleRef={finaleRef} />
      <group position={place(1)} rotation={face(1)}><Aurelius index={1} {...common} /></group>
      <group position={place(2)} rotation={face(2)}><Valora index={2} {...common} /></group>
      <group position={place(3)} rotation={face(3)} scale={0.6}><Aperture index={3} {...common} /></group>
      <group position={place(4)} rotation={face(4)}><Lattice index={4} {...common} /></group>
      <group position={place(5)} rotation={face(5)}><Cairn index={5} {...common} /></group>
    </group>
  );
}

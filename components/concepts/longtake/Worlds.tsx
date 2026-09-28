"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";
import { worldCentre } from "./journey";

export type Palette = "a" | "b";

type WorldProps = {
  index: number;
  palette: Palette;
  animated: boolean;
  /** 0–1: how "present" this world is (1 while the camera holds on it). */
  presenceRef: React.RefObject<number[]>;
};

const GOLD = "#E2BE7A";

/** Glossy coloured material; in palette B it glows from within. */
function useWorldMaterial(accent: string, palette: Palette, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: accent,
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: palette === "b" ? accent : "#000000",
        emissiveIntensity: palette === "b" ? 0.85 : 0,
        ...opts,
      }),
    [accent, palette, opts],
  );
}

function useGold() {
  return useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.18 }), []);
}

/* ── 1 · Aurelius — a rising spiral of slabs ───────────────────────────── */
function Aurelius({ index, palette, animated, raiseRef }: WorldProps & { raiseRef: React.RefObject<number> }) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette);
  const gold = useGold();
  const slabs = useRef<(THREE.Mesh | null)[]>([]);
  const axis = useRef<THREE.Mesh>(null);
  const N = 16;
  const geo = useMemo(() => new THREE.BoxGeometry(1.7, 0.16, 0.62), []);

  useFrame((state) => {
    const raise = raiseRef.current ?? 0;
    const t = animated ? state.clock.elapsedTime : 4;
    const step = 0.2 + raise * 0.14;
    slabs.current.forEach((m, i) => {
      if (!m) return;
      const visible = i < 10 + Math.round(raise * (N - 10));
      const target = visible ? 1 : 0.001;
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * 0.12);
      const a = i * 0.52 + t * 0.12;
      m.position.set(Math.cos(a) * 0.95, -1.7 + i * step, Math.sin(a) * 0.95);
      m.rotation.y = -a;
    });
    if (axis.current) axis.current.scale.y = 1 + raise * 0.7;
  });

  return (
    <group>
      <mesh ref={axis} material={gold} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 5.2, 16]} />
      </mesh>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(el) => { slabs.current[i] = el; }} geometry={geo} material={i % 5 === 4 ? gold : mat} />
      ))}
    </group>
  );
}

/* ── 2 · Valora — an arch of many tiles meeting in the middle ─────────── */
function Valora({ index, palette, animated, presenceRef }: WorldProps) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette);
  const gold = useGold();
  const inst = useRef<THREE.InstancedMesh>(null);
  const N = 34;
  const o = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const m = inst.current;
    if (!m) return;
    const t = animated ? state.clock.elapsedTime : 3;
    const pres = presenceRef.current?.[index] ?? 0;
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const a = Math.PI * u;
      // Tiles assemble from both ends toward the keystone as the world comes into presence.
      const arrive = Math.min(1, Math.max(0, pres * 1.6 - Math.abs(u - 0.5) * 0.9));
      const scatter = (1 - arrive) * 1.8;
      o.position.set(-Math.cos(a) * 2.3 + Math.sin(i * 7.1) * scatter, -1.6 + Math.sin(a) * 2.6 + Math.cos(i * 3.3) * scatter, Math.sin(i * 1.7 + t * 0.6) * 0.06 + Math.sin(i * 5.3) * scatter);
      o.rotation.set(0, 0, a - Math.PI / 2 + (1 - arrive) * i);
      o.scale.setScalar(0.35 + 0.65 * arrive);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
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

/* ── 3 · Golden Guardian Productions — an iris aperture and a beam ────── */
function Aperture({ index, palette, animated }: WorldProps) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette, { side: THREE.DoubleSide });
  const gold = useGold();
  const blades = useRef<(THREE.Group | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);
  const N = 9;
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
    const t = animated ? state.clock.elapsedTime : 1.2;
    const open = 0.5 + 0.5 * Math.sin(t * 0.7);
    blades.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z = (i / N) * Math.PI * 2;
      const inner = g.children[0] as THREE.Mesh;
      inner.position.set(0.45 + open * 0.55, 0, 0);
      inner.rotation.z = -0.4 - open * 0.55;
    });
    if (beam.current) {
      const mm = beam.current.material as THREE.MeshBasicMaterial;
      mm.opacity = 0.12 + open * (palette === "b" ? 0.4 : 0.22);
    }
  });

  return (
    <group rotation={[0, 0, 0]} position={[0, 0.3, 0]}>
      <mesh material={gold}>
        <torusGeometry args={[2.35, 0.08, 20, 120]} />
      </mesh>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(el) => { blades.current[i] = el; }}>
          <mesh geometry={blade} material={mat} />
        </group>
      ))}
      <mesh ref={beam} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 3.2]}>
        <cylinderGeometry args={[0.45, 1.6, 6.4, 48, 1, true]} />
        <meshBasicMaterial color={palette === "b" ? accent : "#FFFFFF"} transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ── 4 · Rudra Yugen — a luminous lattice around a glass core ─────────── */
function Lattice({ index, palette, animated }: WorldProps) {
  const accent = L.worlds[index].accent;
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const { edges, verts } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.1, 1);
    const e = new THREE.EdgesGeometry(ico);
    const pos = ico.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      seen.set(v.toArray().map((n) => n.toFixed(3)).join(","), v);
    }
    return { edges: e, verts: [...seen.values()] };
  }, []);
  const nodeMat = useWorldMaterial(accent, palette, { emissive: accent, emissiveIntensity: palette === "b" ? 1.4 : 0.5 });
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", transmission: 1, thickness: 1.2, roughness: 0.05, ior: 1.45, iridescence: 0.6, attenuationColor: accent, attenuationDistance: 2.2 }), [accent]);

  useFrame((state, dt) => {
    if (!animated) return;
    if (group.current) group.current.rotation.y += dt * 0.12;
    if (inner.current) { inner.current.rotation.x += dt * 0.4; inner.current.rotation.z += dt * 0.25; }
    void state;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={palette === "b" ? accent : "#0B6F8C"} transparent opacity={0.85} />
      </lineSegments>
      {verts.map((v, i) => (
        <mesh key={i} position={v} material={nodeMat}>
          <sphereGeometry args={[0.07, 16, 12]} />
        </mesh>
      ))}
      <mesh ref={inner} material={glass}>
        <octahedronGeometry args={[1.05, 0]} />
      </mesh>
    </group>
  );
}

/* ── 5 · Asraya — a balanced cairn over slow ripples ──────────────────── */
function Cairn({ index, palette, animated }: WorldProps) {
  const accent = L.worlds[index].accent;
  const mat = useWorldMaterial(accent, palette, { roughness: 0.32, clearcoat: 0.6 });
  const pale = useMemo(() => new THREE.MeshPhysicalMaterial({ color: palette === "b" ? "#123d2d" : "#F4F7F2", roughness: 0.45, clearcoat: 0.5 }), [palette]);
  const stones = useRef<(THREE.Mesh | null)[]>([]);
  const ripples = useRef<(THREE.Mesh | null)[]>([]);
  const sizes = [1.25, 1.0, 0.8, 0.62, 0.46];

  useFrame((state) => {
    const t = animated ? state.clock.elapsedTime : 2;
    let y = -1.7;
    stones.current.forEach((m, i) => {
      if (!m) return;
      const r = sizes[i];
      y += r * 0.42;
      m.position.set(Math.sin(t * 0.5 + i) * 0.05 * i, y + Math.sin(t * 0.8 + i * 0.7) * 0.04 * i, 0);
      m.rotation.z = Math.sin(t * 0.4 + i) * 0.05;
      y += r * 0.42;
    });
    ripples.current.forEach((m, i) => {
      if (!m) return;
      const p = ((animated ? t * 0.18 : 0.3) + i / 3) % 1;
      m.scale.setScalar(1 + p * 2.4);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.5;
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
        <mesh key={i} ref={(el) => { ripples.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]}>
          <ringGeometry args={[1.25, 1.29, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 0 · The core — a small orrery of the five colours around a radiant sphere ── */
function Core({ palette, animated, finaleRef }: { palette: Palette; animated: boolean; finaleRef: React.RefObject<number> }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const spokes = useRef<THREE.LineSegments>(null);
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
  const spokeGeo = useMemo(() => {
    // Light lines core → each world, and world → next world (the ecosystem, shown fully in the finale).
    const pts: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const w = worldCentre(i), n = worldCentre(i === 5 ? 1 : i + 1);
      pts.push(0, 0, 0, w.x, w.y, w.z, w.x, w.y, w.z, n.x, n.y, n.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    const t = animated ? state.clock.elapsedTime : 0;
    rings.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.set(0.6 + i * 0.35, t * (0.08 + i * 0.03) + i, 0.2 * i);
    });
    const fin = finaleRef.current ?? 0;
    if (spokes.current) (spokes.current.material as THREE.LineBasicMaterial).opacity = 0.18 + fin * 0.7;
    if (halo.current) halo.current.scale.setScalar(5 + fin * 3 + (animated ? Math.sin(t) * 0.2 : 0));
    void dt;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.05, 64, 48]} />
        <meshPhysicalMaterial color={palette === "b" ? "#FFE3A8" : "#FFF7E6"} emissive="#FFD58A" emissiveIntensity={palette === "b" ? 2.2 : 0.6} roughness={0.2} clearcoat={1} />
      </mesh>
      <sprite ref={halo}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} blending={palette === "b" ? THREE.AdditiveBlending : THREE.NormalBlending} opacity={palette === "b" ? 0.9 : 0.75} />
      </sprite>
      {L.worlds.slice(1, 6).map((w, i) => (
        <mesh key={w.key} ref={(el) => { rings.current[i] = el; }}>
          <torusGeometry args={[1.6 + i * 0.28, 0.022, 12, 160]} />
          <meshStandardMaterial color={w.accent} emissive={w.accent} emissiveIntensity={palette === "b" ? 1.2 : 0.25} roughness={0.3} />
        </mesh>
      ))}
      <mesh material={gold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[L.ringRadius, 0.035, 12, 400]} />
      </mesh>
      <lineSegments ref={spokes} geometry={spokeGeo}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/** Where each world's four "what we do" annotations attach, in the world's local space (projected to HTML labels). */
export const ANCHORS: [number, number, number][] = [
  [-2.8, 1.3, 0.6],
  [2.9, 0.8, 0.6],
  [-3.0, -0.5, 0.6],
  [2.8, -1.1, 0.6],
];

export function WorldsGroup({ palette, animated, presenceRef, raiseRef, finaleRef }: {
  palette: Palette; animated: boolean; presenceRef: React.RefObject<number[]>; raiseRef: React.RefObject<number>;
  finaleRef: React.RefObject<number>;
}) {
  const common = { palette, animated, presenceRef };
  const place = (i: number) => {
    const c = worldCentre(i);
    return [c.x, c.y, c.z] as [number, number, number];
  };
  // Every world faces outward, toward where the camera arrives.
  const face = (i: number) => [0, Math.atan2(place(i)[0], place(i)[2]), 0] as [number, number, number];
  return (
    <>
      <Core palette={palette} animated={animated} finaleRef={finaleRef} />
      <group position={place(1)} rotation={face(1)}><Aurelius index={1} {...common} raiseRef={raiseRef} /></group>
      <group position={place(2)} rotation={face(2)}><Valora index={2} {...common} /></group>
      <group position={place(3)} rotation={face(3)} scale={0.7}><Aperture index={3} {...common} /></group>
      <group position={place(4)} rotation={face(4)}><Lattice index={4} {...common} /></group>
      <group position={place(5)} rotation={face(5)}><Cairn index={5} {...common} /></group>
    </>
  );
}

"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { World } from "@/lib/worlds";
import type { Runtime } from "../journey";
import { Mist } from "./Atmos";
import { crownTexture, pointAt, rng } from "./kit";

/**
 * The physical threshold between two worlds: a real 3D element on the route at the handover that the camera flies
 * through (a hole in the leaves, a bank of cloud, the cave mouth's rock ring, the water surface, a wall of ice), so
 * the change of world never reads as a cut. The two worlds fade across it under its cover.
 */
export function Threshold({ rtRef, world, calm, night }: { rtRef: { current: Runtime }; world: World; calm: boolean; night: boolean }) {
  const at = world.to + 0.5;
  const { p, dir } = useMemo(() => {
    const p = pointAt(at), q = pointAt(at + 0.02);
    return { p, dir: q.clone().sub(p).normalize() };
  }, [at]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir), [dir]);
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current) g.current.visible = Math.abs(rtRef.current.s - at) < 0.9; });
  const k = world.threshold;
  return (
    <group ref={g}>
      {(k === "canopy-break") && <LeafRing p={p} quat={quat} />}
      {(k === "cave-mouth" || k === "sea-arch") && <RockRing p={p} quat={quat} night={night} />}
      {(k === "water-surface") && <WaterSurface p={p} />}
      {(k === "ice-wall" || k === "glacier-exit") && <IceRing p={p} quat={quat} />}
      {/* Every threshold carries a bank of mist or cloud, thickest at the handover. */}
      <Mist box={{ min: [p.x - 14, p.y - 6, p.z - 14], max: [p.x + 14, p.y + 6, p.z + 14] }} count={k === "cloud-sea" || k === "canyon-descent" || k === "summit-ridge" || k === "night-descent" ? 40 : 16}
        size={[6, 16]} color={k === "ice-wall" || k === "glacier-exit" ? "#E6FAFF" : "#FFF1DC"} opacity={0.6} seed={Math.round(at * 13)} calm={calm} night={night} fog={false} />
    </group>
  );
}

/** A ring of leaf clusters with an opening on the route. */
function LeafRing({ p, quat }: { p: THREE.Vector3; quat: THREE.Quaternion }) {
  const mesh = useMemo(() => {
    const n = 90, r = rng(5);
    const mat = new THREE.MeshLambertMaterial({ map: crownTexture(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
    const inst = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 0.75), mat, n);
    const o = new THREE.Object3D();
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2, rad = 3 + r() * 9;
      o.position.set(Math.cos(a) * rad, Math.sin(a) * rad, (r() - 0.5) * 4).applyQuaternion(quat).add(p);
      o.quaternion.copy(quat).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 0.6, r() * 0.6, r() * 6.28)));
      o.scale.setScalar(4 + r() * 5);
      o.updateMatrix();
      inst.setMatrixAt(k, o.matrix);
    }
    return inst;
  }, [p, quat]);
  return <primitive object={mesh} />;
}

/** A rough ring of rock (a cave mouth or sea arch) around the route. */
function RockRing({ p, quat, night }: { p: THREE.Vector3; quat: THREE.Quaternion; night: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.TorusGeometry(9, 4.2, 24, 64);
    const a = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < a.count; i++) {
      const x = a.getX(i), y = a.getY(i), z = a.getZ(i);
      const n = 1 + 0.22 * Math.sin(x * 0.9 + z * 1.3) + 0.12 * Math.sin(y * 1.7 - x * 0.6);
      a.setXYZ(i, x * n, y * n, z * (1 + 0.4 * Math.sin(x + y)));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return <mesh geometry={geo} position={p} quaternion={quat}><meshLambertMaterial color={night ? "#15121a" : "#2a2228"} /></mesh>;
}

/** The water surface the camera breaks through (reef ↔ coast and lake). */
function WaterSurface({ p }: { p: THREE.Vector3 }) {
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[220, 220, 1, 1]} />
      <meshPhysicalMaterial color="#2A8C93" roughness={0.08} metalness={0} transmission={0.6} thickness={1.5} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** A wall of ice with an opening the camera passes through. */
function IceRing({ p, quat }: { p: THREE.Vector3; quat: THREE.Quaternion }) {
  return (
    <mesh position={p} quaternion={quat}>
      <ringGeometry args={[5, 40, 48, 1]} />
      <meshPhysicalMaterial color="#BFEFFF" roughness={0.15} transmission={0.7} thickness={3} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

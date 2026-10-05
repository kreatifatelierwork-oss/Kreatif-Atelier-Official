"use client";

import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { route } from "../../route";
import { FOV, holdCamera, phoneAt } from "../layout";
import { rng } from "../kit";

const idx = () => route.findIndex((p) => p.id === "atlas");

/** Each land's look (WORLD-PLAN.md): colour, the shape of its ground. */
const LANDS = [
  { name: "Aurelius", rock: "#3B3F9C", glow: "#6E74FF", kind: "ridges" },
  { name: "Golden Guardian Productions", rock: "#7A1D4F", glow: "#FF4C9A", kind: "spires" },
  { name: "Valora", rock: "#C8643F", glow: "#FF8A5C", kind: "coast" },
  { name: "Asraya", rock: "#2C7553", glow: "#3BE39A", kind: "lake" },
  { name: "Rudra Yugen", rock: "#9FD9EA", glow: "#4FD8FF", kind: "glacier" },
] as const;

/** Where a frame point of the atlas hold meets the ground (y = 0). */
function ground(at: readonly [number, number], fov: number, aspect: number) {
  const cam = holdCamera(idx(), fov, aspect);
  const v = new THREE.Vector3(at[0] * 2 - 1, 1 - at[1] * 2, 0.5).unproject(cam).sub(cam.position).normalize();
  const t = -cam.position.y / v.y;
  return cam.position.clone().addScaledVector(v, t);
}

/**
 * H13: the world below as a living atlas. A relief of the five lands, each in its colour, the gold route drawn over
 * the ground between them (in the order the journey visits them), clouds around the edges.
 */
export function Atlas({ mobile, night }: { mobile: boolean; night: boolean }) {
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const fov = mobile ? FOV.mobile : FOV.desktop;
  const { terrain, water, route3, rings } = useMemo(() => {
    const item = route[idx()].items.find((x) => x.k === "pins");
    const pins = item && item.k === "pins" ? item.items : [];
    const centres = LANDS.map((l) => {
      const pin = pins.find((p) => p.label === l.name)!;
      const at = mobile ? phoneAt(pin.at) : pin.at;
      return ground([at[0], at[1] + 0.075], fov, aspect);
    });
    const mid = centres.reduce((a, c) => a.add(c), new THREE.Vector3()).multiplyScalar(1 / centres.length);
    const W = 520, D = 420;
    const g = new THREE.PlaneGeometry(W, D, mobile ? 140 : 240, mobile ? 110 : 190);
    g.rotateX(-Math.PI / 2);
    g.translate(mid.x, 0, mid.z);
    const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3);
    const c = new THREE.Color(), tmp = new THREE.Color(), r = rng(3);
    const n2 = (x: number, z: number) => Math.sin(x * 0.045) * Math.cos(z * 0.05) + Math.sin(x * 0.11 + z * 0.07) * 0.5 + Math.sin(x * 0.23 - z * 0.19) * 0.25;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      let h = 6 + n2(x, z) * 5;
      c.set("#2E4A24").lerp(tmp.set("#4F6B2C"), 0.5 + 0.5 * Math.sin(x * 0.07 + z * 0.05));
      LANDS.forEach((l, k) => {
        const d = Math.hypot(x - centres[k].x, z - centres[k].z), f = Math.exp(-(d * d) / (2 * 34 * 34));
        if (f < 0.01) return;
        const ridge = Math.abs(Math.sin(x * 0.18 + z * 0.12)) + Math.abs(Math.sin(x * 0.07 - z * 0.21));
        if (l.kind === "ridges") h += f * (22 + ridge * 14);
        if (l.kind === "spires") h += f * (18 + Math.pow(ridge * 0.6, 3) * 40);
        if (l.kind === "glacier") h += f * (26 + ridge * 18);
        if (l.kind === "coast") h += f * (14 + ridge * 6) - Math.max(0, x - centres[k].x - 10) * 0.35 * f;
        if (l.kind === "lake") h -= f * 12;
        c.lerp(tmp.set(l.rock), Math.min(1, f * 1.6));
        if (l.kind === "glacier" && h > 26) c.lerp(tmp.set("#F2FBFF"), 0.6);
      });
      // Valora's coast: the sea to the east.
      const v = centres[2];
      if (x > v.x + 30) h -= (x - v.x - 30) * 0.5;
      p.setY(i, h + (r() - 0.5) * 0.6);
      c.toArray(col, i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    const terrain = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, fog: false }));
    const water = new THREE.Mesh(new THREE.PlaneGeometry(W, D).rotateX(-Math.PI / 2).translate(mid.x, 1.5, mid.z),
      new THREE.MeshStandardMaterial({ color: "#2B9AA0", roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85, fog: false }));
    // The route over the ground, in the order of the journey; and a ring at each land.
    const heightAt = (x: number, z: number) => {
      let best = 0, bd = Infinity;
      for (let i = 0; i < p.count; i += 7) { const d = (p.getX(i) - x) ** 2 + (p.getZ(i) - z) ** 2; if (d < bd) { bd = d; best = p.getY(i); } }
      return best;
    };
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k < centres.length - 1; k++) {
      const a = centres[k], b = centres[k + 1];
      for (let t = 0; t < 1; t += 0.1) {
        const x = a.x + (b.x - a.x) * t + Math.sin(t * Math.PI) * 14 * (k % 2 ? 1 : -1), z = a.z + (b.z - a.z) * t;
        pts.push(new THREE.Vector3(x, Math.max(2, heightAt(x, z)) + 1.5, z));
      }
    }
    const last = centres[centres.length - 1];
    pts.push(new THREE.Vector3(last.x, heightAt(last.x, last.z) + 1.5, last.z));
    const route3 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.7, 6),
      new THREE.MeshBasicMaterial({ color: "#FFD27A", toneMapped: false, fog: false }));
    const rings = centres.map((c0, k) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(5, 0.35, 6, 48), new THREE.MeshBasicMaterial({ color: LANDS[k].glow, toneMapped: false, fog: false, transparent: true, opacity: 0.9 }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(c0.x, heightAt(c0.x, c0.z) + 1.2, c0.z);
      return m;
    });
    return { terrain, water, route3, rings };
  }, [aspect, fov, mobile]);
  (terrain.material as THREE.MeshStandardMaterial).color.setScalar(night ? 0.45 : 1);
  return (
    <group>
      <primitive object={terrain} />
      <primitive object={water} />
      <primitive object={route3} />
      {rings.map((m, k) => <primitive key={k} object={m} />)}
    </group>
  );
}

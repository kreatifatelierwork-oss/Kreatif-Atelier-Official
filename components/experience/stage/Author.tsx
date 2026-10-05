"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { worlds } from "@/lib/worlds";

/**
 * `?author`: explore a world freely to author its camera route (only route data changes, never the engine).
 * W/A/S/D move, R/F up and down, Shift for speed, drag to look. P logs the pose as a route-data line
 * (`{ pos: [...], look: [...] }`) to copy into lib/route-data.ts or a company journey. Esc returns to the route.
 * `__worlds.set(id, { position, rotation, scale })` places a splat world live (then copy it into lib/worlds.ts).
 * Runs after the camera rig each frame and overrides the camera only while active; the rig itself is untouched.
 */
export function Author() {
  const camera = useThree((s) => s.camera);
  const st = useRef({ on: false, keys: new Set<string>(), yaw: 0, pitch: 0, pos: new THREE.Vector3(), drag: false });
  useEffect(() => {
    const s = st.current;
    const start = () => {
      if (s.on) return;
      s.on = true;
      s.pos.copy(camera.position);
      const e = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      s.yaw = e.y; s.pitch = e.x;
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { s.on = false; return; }
      if ("wasdrfWASDRF".includes(e.key) && e.key.length === 1) { start(); s.keys.add(e.key.toLowerCase()); e.stopPropagation(); e.preventDefault(); }
      if (e.key === "Shift") s.keys.add("shift");
      if (e.key.toLowerCase() === "p") {
        const look = new THREE.Vector3(0, 0, -40).applyQuaternion(camera.quaternion).add(camera.position);
        const r = (v: THREE.Vector3) => `[${[v.x, v.y, v.z].map((n) => +n.toFixed(2)).join(", ")}]`;
        console.log(`{ pos: ${r(camera.position)}, look: ${r(look)} },`);
      }
    };
    const up = (e: KeyboardEvent) => { s.keys.delete(e.key.toLowerCase()); if (e.key === "Shift") s.keys.delete("shift"); };
    const md = () => { s.drag = true; };
    const mu = () => { s.drag = false; };
    const mm = (e: PointerEvent) => {
      if (!s.drag) return;
      start();
      s.yaw -= e.movementX * 0.003;
      s.pitch = Math.max(-1.5, Math.min(1.5, s.pitch - e.movementY * 0.003));
    };
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", up, true);
    window.addEventListener("pointerdown", md);
    window.addEventListener("pointerup", mu);
    window.addEventListener("pointermove", mm);
    Object.assign(window, {
      __worlds: {
        list: () => worlds.map((w) => ({ id: w.id, ...w.transform })),
        set: (id: string, t: Partial<(typeof worlds)[number]["transform"]>) => { const w = worlds.find((x) => x.id === id); if (w) Object.assign(w.transform, t); return w?.transform; },
      },
    });
    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
      window.removeEventListener("pointerdown", md);
      window.removeEventListener("pointerup", mu);
      window.removeEventListener("pointermove", mm);
    };
  }, [camera]);
  useFrame((_, dt) => {
    const s = st.current;
    if (!s.on) return;
    const sp = (s.keys.has("shift") ? 40 : 8) * dt;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(s.pitch, s.yaw, 0, "YXZ"));
    const f = new THREE.Vector3(0, 0, -1).applyQuaternion(q), r = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
    if (s.keys.has("w")) s.pos.addScaledVector(f, sp);
    if (s.keys.has("s")) s.pos.addScaledVector(f, -sp);
    if (s.keys.has("d")) s.pos.addScaledVector(r, sp);
    if (s.keys.has("a")) s.pos.addScaledVector(r, -sp);
    if (s.keys.has("r")) s.pos.y += sp;
    if (s.keys.has("f")) s.pos.y -= sp;
    camera.position.copy(s.pos);
    camera.quaternion.copy(q);
  });
  return null;
}

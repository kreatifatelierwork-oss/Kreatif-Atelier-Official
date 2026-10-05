"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { mistTexture, rayTexture, rng } from "./kit";

type Box = { min: [number, number, number]; max: [number, number, number] };

/** Banks of mist: soft puffs scattered in a box, facing the camera, drifting slowly; the camera flies through them. */
export function Mist({ box, count, size = [6, 14], color = "#ffffff", opacity = 0.5, seed = 1, calm, night, fog = true }: {
  box: Box; count: number; size?: [number, number]; color?: string; opacity?: number; seed?: number; calm: boolean; night: boolean; fog?: boolean;
}) {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const r = rng(seed);
    const tex = mistTexture();
    for (let k = 0; k < count; k++) {
      const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, opacity: opacity * (0.5 + r() * 0.5), fog });
      const sp = new THREE.Sprite(m);
      sp.position.set(
        box.min[0] + r() * (box.max[0] - box.min[0]),
        box.min[1] + r() * (box.max[1] - box.min[1]),
        box.min[2] + r() * (box.max[2] - box.min[2]),
      );
      const sc = size[0] + r() * (size[1] - size[0]);
      sp.scale.set(sc * 1.8, sc, 1);
      m.rotation = r() * Math.PI * 2;
      sp.userData = { x: sp.position.x, ph: r() * 6.28, sp: 0.2 + r() * 0.4, o: m.opacity, near: sc * 0.8 };
      sp.renderOrder = 2;
      g.add(sp);
    }
    return g;
  }, [box, count, size, color, opacity, seed, fog]);
  useFrame(({ clock, camera }) => {
    const t = calm ? 0 : clock.elapsedTime;
    for (const c of group.children) {
      const u = c.userData as { x: number; ph: number; sp: number; o: number; near: number };
      c.position.x = u.x + Math.sin(t * 0.05 * u.sp + u.ph) * 2.5;
      const m = (c as THREE.Sprite).material as THREE.SpriteMaterial;
      m.color.set(color).multiplyScalar(night ? 0.35 : 1);
      // A puff thins out as the camera reaches it (you fly through mist, it never veils the lens).
      const d = c.position.distanceTo(camera.position);
      m.opacity = u.o * THREE.MathUtils.smoothstep(d, u.near, u.near * 2.6);
      c.visible = m.opacity > 0.004;
    }
  });
  return <primitive object={group} />;
}

/** Shafts of light from the one sun through gaps: long additive planes leaning along the sun's direction. */
export function Rays({ points, sun, length = 40, width = 4, color = "#FFE2A8", opacity = 0.35, night }: {
  points: [number, number, number][]; sun: THREE.Vector3; length?: number; width?: number; color?: string; opacity?: number; night: boolean;
}) {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const tex = rayTexture();
    const r = rng(7);
    for (const p of points) {
      const m = new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: opacity * (0.6 + r() * 0.4), side: THREE.DoubleSide, fog: false });
      const geo = new THREE.PlaneGeometry(width * (0.7 + r() * 0.6), length);
      geo.translate(0, -length / 2, 0); // the top of the shaft at the point, falling away from the sun
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(...p);
      // Point the shaft's length down the sun's direction.
      const down = sun.clone().negate().normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), down);
      mesh.renderOrder = 4;
      g.add(mesh);
    }
    return g;
  }, [points, sun, length, width, color, opacity]);
  useFrame(({ camera }) => {
    for (const c of group.children) {
      // Turn each shaft around its own axis to face the camera.
      const m = c as THREE.Mesh;
      const axis = new THREE.Vector3(0, -1, 0).applyQuaternion(m.quaternion);
      const to = camera.position.clone().sub(m.position);
      to.addScaledVector(axis, -to.dot(axis)).normalize();
      const nrm = new THREE.Vector3(0, 0, 1).applyQuaternion(m.quaternion);
      const ang = Math.atan2(new THREE.Vector3().crossVectors(nrm, to).dot(axis), nrm.dot(to));
      m.rotateOnWorldAxis(axis, ang);
      (m.material as THREE.MeshBasicMaterial).visible = !night;
    }
  });
  return <primitive object={group} />;
}

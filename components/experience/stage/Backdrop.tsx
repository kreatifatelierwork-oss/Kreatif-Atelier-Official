"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Runtime } from "../journey";
import { hold, plate, viewHeight } from "./kit";

const window01 = (s: number, a: number, b: number, fade: number) =>
  Math.min(THREE.MathUtils.smoothstep(s, a - fade, a), 1 - THREE.MathUtils.smoothstep(s, b, b + fade));

/**
 * A matte-painting plate as a curved panorama far around a stretch of the route (a section of a cylinder centred on
 * the stretch's holds). The camera moves inside it, so it shifts by real parallax; at the stretch's ends it hands over
 * to the next one. Never fogged: haze is painted in.
 */
export function Backdrop({ rtRef, name, mobile, from, to, radius = 220, span = 120, lift = 0, yaw = 0, aspect, tint = "#ffffff", night }: {
  rtRef: { current: Runtime }; name: string; mobile: boolean; from: number; to: number; radius?: number; span?: number;
  /** Vertical shift of the plate (fraction of its height). */ lift?: number; /** Extra yaw (degrees). */ yaw?: number;
  /** The plate image's width / height. */ aspect: number; tint?: string; night: boolean;
}) {
  const tex = useTexture(plate(name, mobile));
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.x = -1; // seen from inside
    tex.offset.x = 1;
    tex.anisotropy = 4;
    return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, transparent: true, depthWrite: false, fog: false, toneMapped: false, color: new THREE.Color(tint) });
  }, [tex, tint]);
  const { geo, pos } = useMemo(() => {
    const holds = Array.from({ length: to - from + 1 }, (_, k) => hold(from + k));
    const c = holds.reduce((a, h) => a.add(h.pos), new THREE.Vector3()).multiplyScalar(1 / holds.length);
    const d = holds.reduce((a, h) => a.add(h.dir), new THREE.Vector3()).normalize();
    const facing = Math.atan2(d.x, d.z) + THREE.MathUtils.degToRad(yaw); // three's cylinder: x = r sin θ, z = r cos θ
    const arc = THREE.MathUtils.degToRad(span);
    const height = (radius * arc) / aspect;
    const pitchY = Math.tan(Math.asin(THREE.MathUtils.clamp(d.y, -0.9, 0.9))) * radius;
    const g = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, facing - arc / 2, arc);
    return { geo: g, pos: new THREE.Vector3(c.x, c.y + pitchY + lift * height, c.z) };
  }, [from, to, radius, span, aspect, lift, yaw]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const o = window01(rtRef.current.s, from, to, 0.85);
    mat.opacity = o;
    mat.color.set(tint).multiplyScalar(night ? 0.42 : 1);
    if (ref.current) ref.current.visible = o > 0.003;
  });
  return <mesh ref={ref} geometry={geo} material={mat} position={pos} renderOrder={-5} frustumCulled={false} />;
}

/**
 * A foreground cut-out (leaves, rock, bamboo) a few metres in front of a hold, framing it. Coming in you approach it;
 * going on you fly through it.
 */
export function FrameCard({ name, mobile, place, ahead = 3, cover = 1.18, aspect, night, drop = 0 }: {
  name: string; mobile: boolean; place: number; ahead?: number; cover?: number; aspect: number; night: boolean; drop?: number;
}) {
  const tex = useTexture(plate(name, mobile));
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, alphaTest: 0.02, toneMapped: false });
  }, [tex]);
  mat.color.setScalar(night ? 0.38 : 0.92);
  const h = hold(place);
  const vh = viewHeight(ahead, camera.fov) * cover;
  const view = size.width / size.height;
  // Cover the whole view: as wide as the screen needs, keeping the image's proportions.
  const height = Math.max(vh, (vh * view) / aspect);
  const p = h.pos.clone().addScaledVector(h.dir, ahead).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(h.quat), -drop * height);
  return (
    <mesh position={p} quaternion={h.quat} material={mat} renderOrder={5}>
      <planeGeometry args={[height * aspect, height]} />
    </mesh>
  );
}

"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { FilmState } from "@/components/film/state";
import { Idea } from "@/components/film/stage/Idea";
import { experienceConfig as X } from "@/lib/config";
import { useUi, type Runtime } from "../journey";
import { LAST, route } from "../route";
import { thingAnchor } from "./layout";

/**
 * The Atelier, BLOCKED OUT: simple shells for every place on the route so the camera, the passages, the haze and
 * the things you can Enter all work end to end. The slice's places get their real form from the reference images
 * (image-first); nothing here is final art.
 */

type Props = {
  rtRef: { current: Runtime };
  filmRef: { current: FilmState };
  theme: "light" | "dark";
  mobile: boolean;
  calm: boolean;
  riseAtRef: { current: number | null };
  onEnter: (thing: string) => void;
};

const NEUTRAL = { light: "#E9EBEF", dark: "#141a2b" };

/** Wall material for a place: neutral plaster tinted by the place's colour (C5: dominant inside its world). */
function useMaterials(theme: "light" | "dark") {
  return useMemo(
    () =>
      route.map((p) => {
        const c = new THREE.Color(NEUTRAL[theme]);
        if (p.colour) c.lerp(new THREE.Color(p.colour), theme === "light" ? 0.22 : 0.3);
        return new THREE.MeshStandardMaterial({ color: c, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
      }),
    [theme],
  );
}

/** A hall: floor and two side walls, open at both ends and to the sky (so the Roof can look in). */
function Hall({ at, w, d, h, mat, rot = 0 }: { at: number[]; w: number; d: number; h: number; mat: THREE.Material; rot?: number }) {
  return (
    <group position={at as [number, number, number]} rotation={[0, rot, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat}><planeGeometry args={[w, d]} /></mesh>
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mat}><planeGeometry args={[d, h]} /></mesh>
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={mat}><planeGeometry args={[d, h]} /></mesh>
    </group>
  );
}

/** Things you can Enter: they lift and brighten when hovered or focused (from the scene or the DOM). */
function Things({ place, onEnter, rtRef }: { place: number; onEnter: (id: string) => void; rtRef: { current: Runtime } }) {
  const p = route[place];
  const hover = useUi((s) => s.hover);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const gold = useMemo(() => new THREE.Color("#C9A45C"), []);
  useFrame((_, dt) => {
    refs.current.forEach((m, k) => {
      if (!m) return;
      const on = hover === p.things[k].id ? 1 : 0;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity += (on * 0.6 - mat.emissiveIntensity) * Math.min(1, dt * 8);
      m.position.y = (m.userData.y as number) + mat.emissiveIntensity * 0.25;
    });
  });
  const near = () => Math.abs(rtRef.current.s - place) < 0.3;
  return (
    <>
      {p.things.map((t, k) => {
        const a = thingAnchor(place, k);
        if (!a) return null;
        const tall = place === 1 || place === 9;
        return (
          <mesh
            key={t.id}
            ref={(m) => { refs.current[k] = m; if (m) m.userData.y = a[1] + (tall ? 1.6 : 0.3); }}
            position={[a[0], a[1] + (tall ? 1.6 : 0.3), a[2]]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { if (!near()) return; e.stopPropagation(); useUi.getState().set({ hover: t.id }); document.body.style.cursor = t.room ? "pointer" : ""; }}
            onPointerOut={() => { if (useUi.getState().hover === t.id) useUi.getState().set({ hover: null }); document.body.style.cursor = ""; }}
            onClick={(e: ThreeEvent<MouseEvent>) => { if (!near() || !t.room) return; e.stopPropagation(); onEnter(t.id); }}
          >
            {tall ? <boxGeometry args={[2.2, 3.2, 0.18]} /> : <boxGeometry args={[0.7, 0.6, 0.7]} />}
            <meshStandardMaterial color="#F4F5F7" roughness={0.8} emissive={gold} emissiveIntensity={0} />
          </mesh>
        );
      })}
    </>
  );
}

export function World({ rtRef, filmRef, theme, mobile, calm, riseAtRef, onEnter }: Props) {
  const mats = useMaterials(theme);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const idea = useRef<THREE.Group>(null);
  const tmp = useMemo(() => ({ a: new THREE.Color(), b: new THREE.Color(), v: new THREE.Vector3(), w: new THREE.Vector3() }), []);
  const ideaAt = useMemo(() => X.camera.map((c) => new THREE.Vector3(...c.look)), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: "#C9A45C", metalness: 1, roughness: 0.28, emissive: "#3a2a0c" }), []);

  // One light per place (C7), coloured by the place; the Idea travels with you.
  useFrame(() => {
    const rt = rtRef.current;
    const i = Math.min(LAST - 1, Math.floor(rt.s));
    const f = Math.min(1, Math.max(0, rt.s - i));
    tmp.a.set(route[i].colour ?? "#ffffff");
    tmp.b.set(route[i + 1].colour ?? "#ffffff");
    if (sun.current) { sun.current.color.copy(tmp.a).lerp(tmp.b, f); sun.current.intensity = theme === "light" ? 2.2 : 1.4; }
    if (hemi.current) hemi.current.intensity = theme === "light" ? 1.1 : 0.25;
    if (idea.current) {
      tmp.v.copy(ideaAt[i]).lerp(ideaAt[i + 1], f);
      idea.current.position.copy(tmp.v);
      idea.current.visible = Math.round(rt.s) < 8;
    }
  });

  const A = X.anchors;
  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffffff", theme === "light" ? "#d9dce3" : "#05070d", 1]} />
      <directionalLight ref={sun} position={[30, 60, 20]} intensity={2} />

      {/* 0 · The Atrium: a round, sky-lit hall with an opening toward the Studio Floor. */}
      <group position={A[0]}>
        <mesh material={mats[0]}><cylinderGeometry args={[14, 14, 16, 64, 1, true, Math.PI + 0.32, Math.PI * 2 - 0.64]} /></mesh>
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats[0]}><circleGeometry args={[14, 64]} /></mesh>
      </group>
      {/* 1 · The Studio Floor */}
      <Hall at={A[1]} w={32} d={44} h={9} mat={mats[1]} />
      {/* 2 · The Drafting Hall (Aurelius): a tall hall of floating stair flights and a drafting table. */}
      <group>
        <Hall at={A[2]} w={26} d={40} h={26} mat={mats[2]} rot={0.3} />
        {[0, 1, 2, 3, 4].map((k) => (
          <mesh key={k} material={mats[2]} position={[A[2][0] - 6 + k * 3, 3 + k * 3.2, A[2][2] - 4 - k * 2]} rotation={[0.2 * k, 0.6 * k, 0.15]}>
            <boxGeometry args={[3, 0.4, 6]} />
          </mesh>
        ))}
        <mesh material={mats[2]} position={[A[2][0], 0.5, A[2][2] + 9.5]}><boxGeometry args={[7, 1, 1.6]} /></mesh>
      </group>
      {/* 3 · The Projection Hall (Golden Guardian Productions) */}
      <Hall at={A[3]} w={18} d={56} h={12} mat={mats[3]} />
      {/* 4 · The Concourse */}
      <Hall at={A[4]} w={60} d={40} h={14} mat={mats[4]} rot={-0.6} />
      {/* 5 · The Water Court (Valora) */}
      <group>
        <Hall at={A[5]} w={30} d={36} h={10} mat={mats[5]} rot={-0.4} />
        <mesh position={[A[5][0], 0.05, A[5][2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 30]} />
          <meshStandardMaterial color={theme === "light" ? "#ffd9cb" : "#2a0f07"} roughness={0.08} metalness={0.2} />
        </mesh>
      </group>
      {/* 6 · The Garden Court (Asraya): no roof, a round still pool. */}
      <group position={A[6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats[6]}><circleGeometry args={[16, 64]} /></mesh>
        <mesh position={[0, 0.04, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6, 64]} />
          <meshStandardMaterial color={theme === "light" ? "#c9efdc" : "#063321"} roughness={0.05} metalness={0.3} />
        </mesh>
      </group>
      {/* 7 · The Glass Lattice (Rudra Yugen) */}
      <group>
        <Hall at={A[7]} w={24} d={30} h={30} mat={mats[7]} />
        {Array.from({ length: mobile ? 24 : 60 }, (_, k) => (
          <mesh key={k} position={[A[7][0] + ((k * 37) % 20) - 10, 4 + ((k * 13) % 22), A[7][2] + ((k * 29) % 18) - 9]} rotation={[0, k * 0.7, 0]}>
            <planeGeometry args={[1.2, 1.8]} />
            <meshStandardMaterial color="#e1f6fd" transparent opacity={0.35} side={THREE.DoubleSide} roughness={0.05} />
          </mesh>
        ))}
      </group>
      {/* 8 · The Roof: the monument, the only solid gold object in the film (blocked out). */}
      <mesh position={[12, 38, -112]} material={gold}><icosahedronGeometry args={[2.6, 1]} /></mesh>

      {route.map((p) => (p.things.length ? <Things key={p.id} place={p.index} onEnter={onEnter} rtRef={rtRef} /> : null))}

      <group ref={idea} scale={0.9}>
        <Idea stateRef={filmRef} palette={theme === "light" ? "a" : "b"} mobile={mobile} calm={calm} riseAtRef={riseAtRef} />
      </group>
    </>
  );
}

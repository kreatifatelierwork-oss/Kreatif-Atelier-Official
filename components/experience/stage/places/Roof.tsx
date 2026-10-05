"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ribbonPoint } from "@/components/film/stage/forms";
import { experienceConfig as X } from "@/lib/experience";
import { useUi, type Runtime } from "../../journey";
import { MONUMENT, ROOF_TERRACE } from "../layout";
import { lightSurface, placeColours, stone, type Theme } from "../look";

const PLACE = 8;

/** The monument: the Idea's calm ribbon as a solid surface (the same shape its light condenses into). */
function monumentGeometry() {
  const U = 220, V = 18;
  const pos: number[] = [];
  const idx: number[] = [];
  const p = [0, 0, 0];
  for (let i = 0; i <= U; i++) {
    for (let j = 0; j <= V; j++) {
      ribbonPoint((i / U) * Math.PI * 2, (j / V) * 2 - 1, true, p);
      pos.push(p[0], p[1], p[2]);
    }
  }
  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const a = i * (V + 1) + j, b = a + V + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const ease = (t: number) => { const k = Math.min(1, Math.max(0, t)); return k * k * (3 - 2 * k); };

/**
 * The Roof (Legacy): high above the Atelier at a low warm sun. Below, every place you passed, joined by one gold line
 * (your route). On a terrace the Idea, light for the whole film, condenses into the only solid gold object in it.
 * Its moments: Vision (the monument turns and a ring of light opens), Pillars (five shafts of light rise around it),
 * Our ecosystem serves (six lights rise from the world below) and Impact (the route below lights up end to end).
 */
export function Roof({ theme, rtRef }: { theme: Theme; rtRef: { current: Runtime } }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    terrace: stone(c.floor.clone().offsetHSL(0, 0, theme === "light" ? 0.05 : 0.04)),
    pillar: lightSurface("#f4dfae", 1.15),
    ring: new THREE.MeshBasicMaterial({ color: "#e8c98a", transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }),
    route: new THREE.MeshBasicMaterial({ color: "#c9a45c", transparent: true, opacity: 0, fog: false, toneMapped: false }),
    spark: new THREE.MeshBasicMaterial({ color: "#f0d49a", transparent: true, opacity: 0, fog: false, toneMapped: false }),
  }), [c, theme]);
  const geo = useMemo(monumentGeometry, []);
  // Pillar geometry starts at the floor, so scaling it upward makes it rise.
  const pillarGeo = useMemo(() => new THREE.BoxGeometry(0.32, 7, 0.32).translate(0, 3.5, 0), []);
  const routeGeo = useMemo(() => {
    const pts = X.anchors.slice(0, 8).map(([x, , z]) => new THREE.Vector3(x, 0.35, z));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "centripetal"), 400, 0.35, 8, false);
  }, []);
  const monument = useRef<THREE.Group>(null);
  const pillars = useRef<(THREE.Mesh | null)[]>([]);
  const ring = useRef<THREE.Mesh>(null);
  const sparks = useRef<(THREE.Mesh | null)[]>([]);
  const t0 = useRef({ room: "" as string | null, at: 0 });

  useFrame(({ clock }, dt) => {
    const s = rtRef.current.s;
    const room = useUi.getState().room;
    const atRoof = Math.abs(s - PLACE) < 0.4;
    if (room !== t0.current.room) t0.current = { room, at: clock.elapsedTime };
    const since = clock.elapsedTime - t0.current.at;
    const m = monument.current;
    if (m) {
      // The Idea condenses into the monument as you rise to the Roof, and it stays there.
      const k = ease((s - 7.45) / 0.55);
      m.visible = k > 0.001;
      m.scale.setScalar(2.4 * (0.55 + 0.45 * k));
      m.rotation.y += dt * (room === "vision" && atRoof ? 0.5 : 0.08);
    }
    // The route below: visible from the Roof; Impact lights it end to end.
    const near = ease(1 - Math.abs(s - PLACE) / 0.9);
    const impact = room === "impact" && atRoof ? 0.45 + 0.4 * Math.sin(since * 2.2) : 0;
    mats.route.opacity = near * (0.55 + impact);
    // Pillars: five shafts of light rise around the monument, one after another.
    pillars.current.forEach((p, i) => {
      if (!p) return;
      const want = room === "pillars" && atRoof ? ease((since - i * 0.18) / 0.9) : 0;
      p.scale.y += (Math.max(0.001, want) - p.scale.y) * Math.min(1, dt * 5);
      p.visible = p.scale.y > 0.01;
    });
    // Vision: a ring of light opens around the terrace.
    if (ring.current) {
      const on = room === "vision" && atRoof;
      const k = on ? (since % 3.2) / 3.2 : 1;
      ring.current.scale.setScalar(1 + k * 3.5);
      mats.ring.opacity = on ? 0.55 * (1 - k) : 0;
    }
    // Our ecosystem serves: six lights rise from the places below toward the terrace.
    sparks.current.forEach((p, i) => {
      if (!p) return;
      const on = room === "our-ecosystem-serves" && atRoof;
      const k = on ? ((since * 0.35 + i / 6) % 1) : 0;
      const from = X.anchors[1 + i];
      p.position.set(from[0] + (MONUMENT[0] - from[0]) * k, 1 + (MONUMENT[1] - 1) * ease(k), from[2] + (MONUMENT[2] - from[2]) * k);
      p.visible = on;
    });
    mats.spark.opacity = room === "our-ecosystem-serves" && atRoof ? 0.95 : 0;
  });

  return (
    <group>
      <mesh geometry={routeGeo} material={mats.route} />
      <group position={ROOF_TERRACE}>
        <mesh material={mats.terrace} position={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[11, 0.8, 11]} />
        </mesh>
        <mesh ref={ring} material={mats.ring} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.6, 3.75, 96]} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => {
          const a = Math.PI * (0.15 + i * 0.175) + Math.PI;
          return (
            <mesh key={i} ref={(m) => { pillars.current[i] = m; }} geometry={pillarGeo} material={mats.pillar} position={[Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2]} scale={[1, 0.001, 1]} visible={false} />
          );
        })}
      </group>
      <group ref={monument} position={MONUMENT} visible={false}>
        <mesh geometry={geo} castShadow>
          <meshStandardMaterial attach="material" color="#c9a45c" metalness={1} roughness={0.22} envMapIntensity={1.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} ref={(m) => { sparks.current[i] = m; }} material={mats.spark} visible={false}>
          <sphereGeometry args={[0.35, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

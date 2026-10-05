"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { about } from "@/content/about";
import { c3 } from "@/content/experience";
import { holding } from "@/content/verticals";
import type { Runtime } from "../../journey";
import { route } from "../../route";
import { Mist } from "../Atmos";
import { Backdrop } from "../Backdrop";
import { crownForest, crownTexture, hold, plate, rng, viewHeight } from "../kit";
import { anchorFor, phoneAt } from "../layout";

type P = { rtRef: { current: Runtime }; mobile: boolean; calm: boolean; night: boolean };

const TREE = new THREE.Vector3(0, 0, -100);
const R = 3.2;
const idx = (id: string) => route.findIndex((p) => p.id === id);

/** Chapters 2–4: up the colossal tree, through the canopy, over the cloud sea to the five peaks (places 6–11). */
export function Canopy({ rtRef, mobile, calm, night }: P) {
  return (
    <group>
      <Backdrop rtRef={rtRef} name="p03-canopy" mobile={mobile} from={7} to={8} radius={230} span={124} lift={0.02} aspect={1.777} night={night} />
      <Backdrop rtRef={rtRef} name="p04-cloud-sea" mobile={mobile} from={9} to={11} radius={260} span={150} lift={-0.02} aspect={2.532} night={night} />
      <Tree mobile={mobile} />
      <Quote mobile={mobile} />
      <Crowns mobile={mobile} />
      <Ceiling mobile={mobile} />
      <Tiers mobile={mobile} />
      <BreakLeaves calm={calm} />
      <Clouds mobile={mobile} calm={calm} night={night} />
      <Peaks mobile={mobile} />
    </group>
  );
}

/** The giant tree the camera climbs: a moss-covered trunk rising into the canopy, with plants clinging to it. */
function Tree({ mobile }: { mobile: boolean }) {
  const [bark, ferns, monstera] = useTexture([plate("tex-bark", false), plate("p02-ferns", false), plate("p02-monstera", false)]);
  const group = useMemo(() => {
    bark.colorSpace = THREE.SRGBColorSpace;
    const t = bark.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(5, 22);
    t.needsUpdate = true;
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.85, R * 1.15, 66, 40, 1, true), new THREE.MeshStandardMaterial({ map: t, roughness: 0.92, color: "#c8d4b2" }));
    trunk.position.set(TREE.x, 32, TREE.z);
    g.add(trunk);
    // Epiphytes: ferns and leaves on the bark, all the way up.
    for (const tex of [ferns, monstera]) tex.colorSpace = THREE.SRGBColorSpace;
    const mats = [ferns, monstera].map((map) => new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, alphaTest: 0.04, side: THREE.DoubleSide, color: "#d0dcb8" }));
    const r = rng(44);
    for (let k = 0; k < (mobile ? 26 : 60); k++) {
      const y = 3 + r() * 52, a = r() * Math.PI * 2, rad = R * (1.12 - (y / 66) * 0.25);
      const kind = r() < 0.6 ? 0 : 1, h = kind ? 1.4 + r() * 1.4 : 1.0 + r() * 1.2;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(h * (kind ? 0.53 : 1.49), h), mats[kind]);
      m.position.set(TREE.x + Math.sin(a) * rad, y, TREE.z + Math.cos(a) * rad);
      m.rotation.y = a + (r() - 0.5) * 0.6;
      m.rotation.x = -0.2 + r() * 0.4;
      g.add(m);
    }
    return g;
  }, [bark, ferns, monstera, mobile]);
  return <primitive object={group} />;
}

/** H07: the philosophy quote spirals up the trunk in gold, line by line, as the camera rises past it. */
function Quote({ mobile }: { mobile: boolean }) {
  const words = c3(about.quote.text).split(" ");
  const lines: string[] = [];
  const per = mobile ? 3 : 4;
  for (let k = 0; k < words.length; k += per) lines.push(words.slice(k, k + per).join(" "));
  const camA = Math.atan2(hold(6).pos.x - TREE.x, hold(6).pos.z - TREE.z);
  return (
    <group position={TREE}>
      {lines.map((l, k) => {
        const y = 12.5 + k * 4.3;
        const a = camA - 0.55 + k * 0.32;
        const rad = R * (1.15 - (y / 66) * 0.3) + 0.06;
        return (
          <group key={k} rotation={[0, a, 0]}>
            <group position={[0, y, 0]}>
              <Text font="/fonts/cormorant-500.ttf" fontSize={0.78} {...({ curveRadius: rad } as object)} position={[0, 0, rad]} rotation={[0, 0, 0.06]}
                color="#FCE2A2" outlineColor="#E9A94A" outlineBlur={0.28} outlineOpacity={0.6} anchorX="center" anchorY="middle">
                {l}
              </Text>
              {/* A glowing gold band under each line. */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
                <torusGeometry args={[rad + 0.02, 0.018, 4, 64, 1.6]} />
                <meshBasicMaterial color="#F6C76A" toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

/** The canopy roof: thousands of tree crowns (cut-out cards), lit from the sunrise, rolling away to the horizon. */
function Crowns({ mobile }: { mobile: boolean }) {
  const mesh = useMemo(() => {
    const r = rng(12), spots: { x: number; y: number; z: number; s: number }[] = [];
    const n = mobile ? 900 : 2200;
    while (spots.length < n) {
      const x = (r() - 0.5) * 320, z = -60 - r() * 340;
      // Keep a shaft open around the trunk the camera climbs, and the camera's line out of the canopy.
      if (Math.hypot(x - TREE.x, z - TREE.z) < 10 || (Math.abs(x) < 34 && z > -165 && z < -88)) continue;
      const top = 52 + Math.sin(x * 0.03) * 3 + Math.cos(z * 0.025) * 3 + r() * 3;
      spots.push({ x, y: top - 4, z, s: 9 + r() * 9 });
    }
    return crownForest(spots, new THREE.Vector3(0, 0, 200));
  }, [mobile]);
  return <primitive object={mesh} />;
}

const spotsDef = [
  { at: [0.44, 0.66] as const, depth: 16, h: 0.13 },
  { at: [0.53, 0.43] as const, depth: 30, h: 0.07 },
  { at: [0.62, 0.21] as const, depth: 48, h: 0.055 },
];

/** The canopy seen from below: layers of leaf clusters overhead, open only where the camera climbs out (H07–H08). */
function Ceiling({ mobile }: { mobile: boolean }) {
  const mesh = useMemo(() => {
    const r = rng(19), n = mobile ? 160 : 360;
    const geo = new THREE.PlaneGeometry(1, 0.75);
    geo.rotateX(Math.PI / 2); // lying flat, seen from below
    const mat = new THREE.MeshLambertMaterial({ map: crownTexture(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
    const inst = new THREE.InstancedMesh(geo, mat, n);
    const o = new THREE.Object3D(), c = new THREE.Color();
    let k = 0;
    while (k < n) {
      const x = (r() - 0.5) * 120, z = -50 - r() * 110;
      if (x > -30 && x < 30 && z < -104 && z > -170) continue; // the opening the climb rises through
      if (Math.hypot(x - TREE.x, z - TREE.z) < 4.5) continue;
      o.position.set(x, 50 + r() * 14, z);
      o.rotation.set(0, r() * Math.PI * 2, 0);
      o.scale.setScalar(8 + r() * 10);
      o.updateMatrix();
      inst.setMatrixAt(k, o.matrix);
      inst.setColorAt(k++, c.setHSL(0.22 + r() * 0.08, 0.4, 0.5 + r() * 0.4));
    }
    return inst;
  }, [mobile]);
  return <primitive object={mesh} />;
}

/** H08: three layers of canopy, one word on each, passed on the way up. */
function Tiers({ mobile }: { mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const i = idx("motto");
  const spots = spotsDef;
  const crowns = useMemo(() => {
    const r = rng(77), spots: { x: number; y: number; z: number; s: number }[] = [];
    spots.length = 0;
    spotsDef.forEach((sp, t) => {
      const a = anchorFor(i, mobile ? [0.5, sp.at[1]] : sp.at, sp.depth, camera.fov, aspect);
      const vh = viewHeight(sp.depth, camera.fov);
      // The word is the subject: crowns stand either side of it and below it, never across it.
      const half = vh * sp.h * (mobile ? 0.6 : 1) * holding.motto[t].length * 0.3;
      for (let q = 0; q < 26; q++) {
        const sc = vh * (0.16 + r() * 0.12), side = q % 2 ? 1 : -1;
        const x = q < 6 ? a.x + (r() - 0.5) * half * 2 : a.x + side * (half + sc * 0.3 + r() * vh * 0.9);
        const y = q < 6 ? a.y - vh * sp.h * 0.6 - sc * 0.7 : a.y - sc * (0.45 + r() * 0.3);
        spots.push({ x, y, z: a.z + vh * 0.05 + r() * vh * 0.25, s: sc });
      }
    });
    return crownForest(spots, hold(i).pos);
  }, [aspect, camera.fov, i, mobile]);
  const rot = new THREE.Euler().setFromQuaternion(hold(i).quat);
  return (
    <group>
      <primitive object={crowns} />
      {holding.motto.map((w, t) => {
        const sp = spots[t];
        const a = anchorFor(i, mobile ? [0.5, sp.at[1]] : sp.at, sp.depth, camera.fov, aspect);
        const fs = viewHeight(sp.depth, camera.fov) * sp.h * (mobile ? 0.6 : 1);
        return (
          <group key={w} position={a} rotation={rot}>
            <Text font="/fonts/outfit-400.ttf" fontSize={fs} rotation={[-0.5, 0, 0]} color="#FFD98A" outlineColor="#F0A640" outlineBlur={fs * 0.3} outlineOpacity={0.6} anchorX="center" anchorY="middle">
              {w}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

/** H09: leaves scattering past the lens as the camera breaks out of the canopy. */
function BreakLeaves({ calm }: { calm: boolean }) {
  const tex = useTexture(plate("p02-monstera", false));
  const { mesh, seeds } = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const n = 70;
    const m = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, color: "#d8e6b8" });
    const inst = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.53, 1), m, n);
    const r = rng(90);
    const a = hold(7).pos, b = hold(8).pos;
    const seeds = Array.from({ length: n }, () => {
      const t = r();
      return { p: new THREE.Vector3().lerpVectors(a, b, 0.45 + t * 0.6).add(new THREE.Vector3((r() - 0.5) * 7, (r() - 0.5) * 5, (r() - 0.5) * 7)), s: 0.3 + r() * 0.5, w: r() * 6, v: 0.4 + r() };
    });
    return { mesh: inst, seeds };
  }, [tex]);
  useFrame(({ clock }) => {
    const t = calm ? 0 : clock.elapsedTime, o = new THREE.Object3D();
    seeds.forEach((d, k) => {
      o.position.copy(d.p).add(new THREE.Vector3(Math.sin(t * 0.3 * d.v + d.w) * 0.8, -((t * 0.25 * d.v + d.w) % 4) + 2, 0));
      o.rotation.set(t * d.v + d.w, t * 0.7 * d.v, d.w);
      o.scale.setScalar(d.s);
      o.updateMatrix();
      mesh.setMatrixAt(k, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <primitive object={mesh} />;
}

/** The sea of clouds: banks below and around the camera from the canopy break to the peaks. */
function Clouds({ mobile, calm, night }: { mobile: boolean; calm: boolean; night: boolean }) {
  return (
    <>
      <Mist box={{ min: [-200, 50, -480], max: [200, 62, -150] }} count={mobile ? 50 : 110} size={[30, 70]} color="#FFE4BE" opacity={0.6} seed={51} calm={calm} night={night} fog={false} />
      <Mist box={{ min: [-40, 60, -140], max: [40, 70, -100] }} count={mobile ? 5 : 10} size={[8, 16]} color="#FFFFFF" opacity={0.35} seed={53} calm={calm} night={night} fog={false} />
    </>
  );
}

/** A mountain: ridged noise on a peaked dome, snow by height and slope (one geometry, reused for all five). */
function mountainGeometry(seed: number) {
  const N = 120, g = new THREE.PlaneGeometry(2, 2, N, N);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3);
  const r = rng(seed), off = [r() * 100, r() * 100];
  const hash = (x: number, y: number) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const ridged = (x: number, y: number) => {
    let s = 0, amp = 0.5, f = 2.2;
    for (let o = 0; o < 6; o++) { s += amp * (1 - Math.abs(noise(x * f + off[0], y * f + off[1]) * 2 - 1)) ** 2; amp *= 0.5; f *= 2.05; }
    return s;
  };
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z);
    const dome = Math.max(0, 1 - d) ** 1.6;
    p.setY(i, dome * (0.62 + 0.55 * ridged(x, z)) - 0.05 * (1 - dome));
  }
  g.computeVertexNormals();
  const n = g.attributes.normal as THREE.BufferAttribute, c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), slope = n.getY(i);
    const snow = y > 0.42 + (1 - slope) * 0.35 && slope > 0.45;
    if (snow) c.set("#F3EDE6"); else if (y < 0.25) c.set("#2F3B24").lerp(new THREE.Color("#4A4A3E"), y / 0.25); else c.set("#5B5448").lerp(new THREE.Color("#3E3A34"), hash(i, 1) * 0.5);
    c.toArray(col, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
}

/** H12: five peaks rising out of the clouds, one under each pillar's label. */
function Peaks({ mobile }: { mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const i = idx("pillars");
  const item = route[i].items.find((x) => x.k === "pins");
  const geos = useMemo(() => [11, 23, 37, 41, 53].map(mountainGeometry), []);
  if (!item || item.k !== "pins") return null;
  return (
    <group>
      {item.items.map((pin, k) => {
        const at = mobile ? phoneAt(pin.at) : pin.at;
        const summit = anchorFor(i, [at[0], at[1] + 0.085], pin.depth, camera.fov, aspect);
        const base = 36, hgt = (summit.y - base) / 1.05;
        return (
          <mesh key={k} geometry={geos[k]} position={[summit.x, base, summit.z]} scale={[hgt * 0.9, hgt, hgt * 0.9]} rotation={[0, k * 1.3, 0]}>
            <meshLambertMaterial vertexColors fog={false} />
          </mesh>
        );
      })}
    </group>
  );
}

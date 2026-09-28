"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { easing } from "maath";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Lights } from "@/components/three/Lights";
import { config, conceptConfig } from "@/lib/config";

export type OrreryBody = { id: string; ring: number; index: number; label: string };

type Props = {
  bodies: OrreryBody[][];
  /** Loader progress 0–1: rings drop in and lock as it rises. */
  progress: number;
  entered: boolean;
  focused: OrreryBody | null;
  hovered: string | null;
  reducedMotion: boolean;
  dragRef: React.RefObject<{ yaw: number; pitch: number }>;
  windRef: React.RefObject<number>;
  onHover: (id: string | null) => void;
  onSelect: (body: OrreryBody) => void;
};

const C = conceptConfig.orrery;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const gold = new THREE.MeshStandardMaterial({ color: config.three.gold, metalness: 1, roughness: 0.2 });
const goldSoft = new THREE.MeshStandardMaterial({ color: config.three.gold, metalness: 1, roughness: 0.38 });
const obsidian = new THREE.MeshPhysicalMaterial({ color: "#07090f", metalness: 0.3, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 });
const divisionMaterials = [
  gold,
  new THREE.MeshPhysicalMaterial({ color: "#0d1220", metalness: 0.2, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02 }),
  new THREE.MeshStandardMaterial({ color: "#EFE4CF", metalness: 0.15, roughness: 0.42 }),
  new THREE.MeshPhysicalMaterial({ color: "#7A1E2B", metalness: 0.25, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04 }),
];

/** Engraved tick marks around a ring, one instanced mesh. */
function Ticks({ radius, count, length = 0.06 }: { radius: number; count: number; length?: number }) {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.006, length, 0.006), goldSoft, count);
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const major = i % 6 === 0;
      o.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      o.rotation.set(0, 0, a + Math.PI / 2);
      o.scale.set(1, major ? 1.9 : 1, 1);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    return m;
  }, [radius, count, length]);
  return <primitive object={mesh} />;
}

function Body({ body, radius, count, hovered, onHover, onSelect, registry }: {
  body: OrreryBody; radius: number; count: number; hovered: boolean;
  onHover: Props["onHover"]; onSelect: Props["onSelect"]; registry: React.RefObject<Map<string, THREE.Object3D>>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const a = (body.index / count) * Math.PI * 2;
  const geometry = useMemo(() => {
    if (body.ring === 0) return new THREE.SphereGeometry(0.085, 48, 32);
    if (body.ring === 1) return new THREE.SphereGeometry(0.17, 64, 48);
    return new THREE.OctahedronGeometry(0.075, 0);
  }, [body.ring]);
  const material = body.ring === 0 ? (body.index % 2 ? obsidian : gold) : body.ring === 1 ? divisionMaterials[body.index] : gold;

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    registry.current.set(body.id, m);
    easing.damp3(m.scale, hovered ? 1.35 : 1, 0.15, dt);
    if (body.ring === 2) m.rotation.y += dt * 0.8;
  });

  return (
    <mesh
      ref={ref}
      position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
      geometry={geometry}
      material={material}
      onPointerOver={(e) => { e.stopPropagation(); onHover(body.id); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }}
      onClick={(e) => { e.stopPropagation(); onSelect(body); }}
    >
      {hovered && (
        <Html center distanceFactor={7} position={[0, body.ring === 1 ? 0.34 : 0.22, 0]} style={{ pointerEvents: "none" }}>
          <span className="block rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[11px] tracking-[0.18em] whitespace-nowrap text-[#F3EBDD] uppercase backdrop-blur-sm">
            {body.label}
          </span>
        </Html>
      )}
    </mesh>
  );
}

export function OrreryScene({ bodies, progress, entered, focused, hovered, reducedMotion, dragRef, windRef, onHover, onSelect }: Props) {
  const root = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const spinRefs = useRef<(THREE.Group | null)[]>([]);
  const sun = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const dof = useRef<DepthOfFieldEffect>(null);
  const registry = useRef(new Map<string, THREE.Object3D>());
  const lookAtRef = useRef(new THREE.Vector3());
  const tmpRef = useRef(new THREE.Vector3());
  const ignite = useRef(0);

  const haloTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,226,170,1)");
    grad.addColorStop(0.25, "rgba(232,180,110,0.45)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const stars = useMemo(() => {
    const n = 700, p = new Float32Array(n * 3);
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().setFromSphericalCoords(18 + r() * 18, Math.acos(2 * r() - 1), r() * Math.PI * 2);
      p.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    const P = reducedMotion ? 1 : progress;
    const camera = state.camera;
    const lookAt = lookAtRef.current;
    const tmp = tmpRef.current;

    // Assembly: each ring drops in, spins down and locks in turn; the sun swells last.
    C.rings.forEach((ring, i) => {
      const a = smooth(i * 0.22, i * 0.22 + 0.38, P);
      const g = ringRefs.current[i];
      if (g) {
        g.position.y = (1 - a) * 3.5;
        g.scale.setScalar(0.55 + 0.45 * a);
      }
      const spin = spinRefs.current[i];
      if (spin) {
        const w = windRef.current ?? 0;
        const move = entered && !focused && !reducedMotion ? ring.speed * (1 + w * 6) : 0;
        spin.rotation.z += dt * move + (1 - a) * dt * 5;
      }
    });

    if (entered) ignite.current = Math.min(1, ignite.current + dt * (reducedMotion ? 10 : 0.9));
    const s = smooth(0.7, 1, P);
    if (sun.current) {
      sun.current.scale.setScalar(0.2 + 0.8 * s);
      (sun.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.25 + ignite.current * 3.2;
    }
    if (halo.current) {
      halo.current.scale.setScalar(1.2 + ignite.current * 2.6 + Math.sin(state.clock.elapsedTime * 1.3) * 0.08 * ignite.current);
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.15 + ignite.current * 0.65;
    }
    if (windRef.current) windRef.current = Math.abs(windRef.current) < 0.001 ? 0 : windRef.current * Math.exp(-C.windDamping * dt);

    // Whole mechanism turns with drag.
    if (root.current) {
      const d = dragRef.current ?? { yaw: 0, pitch: 0 };
      easing.dampE(root.current.rotation, [d.pitch, d.yaw + (entered && !focused && !reducedMotion ? state.clock.elapsedTime * 0.02 : 0), 0], 0.35, dt);
      const offset = entered || state.size.width < 768 ? 0 : C.introOffsetX;
      easing.damp3(root.current.position, [offset, 0, 0], reducedMotion ? 0 : 0.9, dt);
    }

    // Camera: wide view, or a flight to the chosen body with a focus pull.
    const target = focused ? registry.current.get(focused.id) : null;
    if (target) {
      target.getWorldPosition(tmp);
      const out = tmp.clone().normalize();
      const dest = tmp.clone().add(out.multiplyScalar(C.focusDistance)).add(new THREE.Vector3(0, 0.25, 0.9));
      if (reducedMotion) camera.position.copy(dest); else easing.damp3(camera.position, dest, 0.55, dt);
      easing.damp3(lookAt, tmp, 0.35, dt);
    } else {
      const base = C.camera.position;
      const dest: [number, number, number] = entered ? [base[0], base[1] * 0.8, base[2] * 0.88] : base;
      if (reducedMotion) camera.position.set(...dest); else easing.damp3(camera.position, dest, 0.8, dt);
      easing.damp3(lookAt, [0, 0, 0], 0.5, dt);
    }
    camera.lookAt(lookAt);

    if (dof.current) {
      dof.current.target = target ? tmp.clone() : null;
      easing.damp(dof.current, "bokehScale", target ? 6 : 0.0001, 0.4, dt);
    }
  });

  return (
    <>
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 14, 34]} />
      <Lights envResolution={128} boost={0.9} />
      <points geometry={stars}>
        <pointsMaterial size={0.06} color="#E8C98A" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>

      <group ref={root}>
        <mesh ref={sun}>
          <sphereGeometry args={[0.42, 64, 48]} />
          <meshStandardMaterial color={config.three.gold} emissive="#FFB65C" emissiveIntensity={0.25} metalness={0.6} roughness={0.25} />
        </mesh>
        <sprite ref={halo}>
          <spriteMaterial map={haloTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.2} />
        </sprite>

        {C.rings.map((ring, i) => (
          <group key={i} ref={(el) => { ringRefs.current[i] = el; }} rotation={ring.tilt as unknown as [number, number, number]}>
            <group ref={(el) => { spinRefs.current[i] = el; }}>
              <mesh material={gold}>
                <torusGeometry args={[ring.radius, 0.013, 16, 320]} />
              </mesh>
              <Ticks radius={ring.radius} count={72} />
              {bodies[i].map((body) => (
                <Body key={body.id} body={body} radius={ring.radius} count={bodies[i].length} hovered={hovered === body.id}
                  onHover={onHover} onSelect={onSelect} registry={registry} />
              ))}
            </group>
          </group>
        ))}

        {/* Outer rim + meridian: the frame of the instrument. */}
        <mesh material={goldSoft}>
          <torusGeometry args={[C.rimRadius, 0.02, 16, 400]} />
        </mesh>
        <Ticks radius={C.rimRadius} count={180} length={0.09} />
        <mesh material={goldSoft} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[C.rimRadius * 1.03, 0.008, 12, 400]} />
        </mesh>
        <mesh material={goldSoft} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[C.rimRadius * 1.06, 0.008, 12, 400]} />
        </mesh>
      </group>

      <EffectComposer multisampling={4}>
        <DepthOfField ref={dof} focalLength={0.035} bokehScale={0.0001} height={560} />
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.78} luminanceSmoothing={0.25} radius={0.72} />
        <Vignette offset={0.25} darkness={0.8} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </>
  );
}

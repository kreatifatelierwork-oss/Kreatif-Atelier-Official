"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { c3 } from "@/content/experience";
import { hero } from "@/content/site";
import type { Runtime } from "../../journey";
import { Mist, Rays } from "../Atmos";
import { Backdrop, FrameCard } from "../Backdrop";
import { hold, plate, pointAt, rng, viewHeight } from "../kit";
import { anchorFor } from "../layout";
import { Leaf } from "../Leaf";
import { Near } from "../Near";
import { sunAt } from "../Sky";

type P = { rtRef: { current: Runtime }; mobile: boolean; calm: boolean; night: boolean };

/** The path's x at depth z (the camera's route through the jungle), for keeping things off it. */
const pathX = (() => {
  const pts: [number, number][] = [];
  const v = new THREE.Vector3();
  for (let s = 0; s <= 6.0; s += 0.05) { pointAt(s, v); pts.push([v.z, v.x]); }
  return (z: number) => {
    for (let k = 1; k < pts.length; k++) if (pts[k][0] <= z) {
      const [z0, x0] = pts[k - 1], [z1, x1] = pts[k];
      return x0 + ((z - z0) / (z1 - z0 || 1)) * (x1 - x0);
    }
    return pts[pts.length - 1][1];
  };
})();

/** Chapter 1, The Seed: the monsoon jungle floor at dawn, along a stream (places 0–5, H01–H06). */
export function Jungle({ rtRef, mobile, calm, night }: P) {
  // Shafts fall steeply through gaps in the canopy (leaning a little away from the low sun).
  const sun = useMemo(() => { const d = sunAt(0.5, new THREE.Vector3()); return new THREE.Vector3(d.x * 0.35, 1, d.z * 0.35).normalize(); }, []);
  return (
    <group>
      <Backdrop rtRef={rtRef} name="p01-jungle-bg" mobile={mobile} from={0} to={6} radius={210} span={118} lift={0.06} aspect={1.775} night={night} />
      <Ground night={night} />
      <Stream calm={calm} night={night} />
      <Rocks />
      <Trunks mobile={mobile} />
      <Foliage mobile={mobile} />
      <Mist box={{ min: [-20, 1.5, -110], max: [20, 9, -8] }} count={mobile ? 10 : 22} size={[6, 14]} color="#FFF1D6" opacity={0.22} seed={3} calm={calm} night={night} />
      {!mobile && <Rays sun={sun} points={[[-3, 30, -40], [4, 30, -54], [7, 30, -70], [-5, 30, -84], [1, 30, -100]]} length={30} width={3.2} opacity={0.14} night={night} />}
      {/* H01, H03, H04, H05: foreground leaves framing the hold; the camera flies through them on the way on. */}
      <FrameCard rtRef={rtRef} name="p02-jungle-fg" mobile={mobile} place={0} ahead={2.4} aspect={1.773} night={night} drop={0.08} />
      <FrameCard rtRef={rtRef} name="p02-jungle-fg" mobile={mobile} place={2} ahead={2.6} aspect={1.773} night={night} drop={0.04} />
      <FrameCard rtRef={rtRef} name="p02-jungle-fg" mobile={mobile} place={4} ahead={2.2} aspect={1.773} night={night} drop={0.1} />
      <Seed calm={calm} night={night} />
      <MapLeaf calm={calm} night={night} mobile={mobile} />
      <Near rtRef={rtRef} place={3}><Legacy mobile={mobile} /></Near>
    </group>
  );
}

function Ground({ night }: { night: boolean }) {
  const moss = useTexture(plate("tex-sand", false));
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 140, 60, 90);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3);
    const c = new THREE.Color(), r = rng(11);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i) - 45;
      const off = Math.abs(x - pathX(z));
      p.setY(i, (off > 3 ? Math.min(1.2, (off - 3) * 0.12) : -0.15) + (r() - 0.5) * 0.25);
      c.setHSL(0.2 + r() * 0.06, 0.4, 0.06 + r() * 0.05);
      c.toArray(col, i * 3);
    }
    g.translate(0, 0, -45);
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  // Lambert: a matte forest floor (a standard material's grazing-angle sheen turned the whole floor tan).
  const map = useMemo(() => {
    const t = moss.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(22, 34);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [moss]);
  return <mesh geometry={geo}><meshLambertMaterial vertexColors map={map} color={night ? "#6a7a6a" : "#9aa07a"} /></mesh>;
}

const waterFrag = /* glsl */ `
uniform float uTime, uNight;
uniform vec3 uSky, uDeep;
varying vec2 vUv;
varying vec3 vView;
varying vec3 vWorld;
#include <fog_pars_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec3 V = normalize(vView);
  float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0) * 0.9;
  vec2 q = vWorld.xz * vec2(1.6, 0.7) + vec2(0.0, uTime * 0.6);
  float rip = noise(q) * 0.6 + noise(q * 2.7 + 3.1) * 0.4;
  vec3 col = mix(uDeep, uSky, clamp(fres * 0.9 + rip * 0.06, 0.0, 1.0));
  float glint = smoothstep(0.78, 0.82, noise(q * 3.5 - uTime * 0.3)) * fres;
  col += vec3(1.0, 0.92, 0.7) * glint * 1.4;
  float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
  col *= mix(1.0, 0.35, uNight);
  gl_FragColor = vec4(col, 0.92 * edge);
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;
const waterVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vView;
varying vec3 vWorld;
#include <fog_pars_vertex>
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vec4 mvPosition = viewMatrix * w;
  vView = cameraPosition - w.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

/** The stream the path follows: a reflective strip that catches the sky and the dawn glints. */
function Stream({ calm, night }: { calm: boolean; night: boolean }) {
  const { geo, mat } = useMemo(() => {
    const n = 120, pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let k = 0; k <= n; k++) {
      const z = 4 - (k / n) * 110, x = pathX(z) + 1.6 + Math.sin(z * 0.11) * 0.8, w = 0.9 + Math.sin(z * 0.07) * 0.35;
      pos.push(x - w, 0.02, z, x + w, 0.02, z);
      uv.push(0, k / n, 1, k / n);
      if (k < n) { const a = k * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    const m = new THREE.ShaderMaterial({
      vertexShader: waterVert, fragmentShader: waterFrag, transparent: true, fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
        uTime: { value: 0 }, uNight: { value: 0 }, uSky: { value: new THREE.Color("#F4C870") }, uDeep: { value: new THREE.Color("#0A0C06") },
      }]),
    });
    return { geo: g, mat: m };
  }, []);
  useFrame(({ clock }) => { mat.uniforms.uTime.value = calm ? 0 : clock.elapsedTime; mat.uniforms.uNight.value = night ? 1 : 0; });
  return <mesh geometry={geo} material={mat} renderOrder={1} />;
}

/** Mossy boulders along both banks. */
function Rocks() {
  const mesh = useMemo(() => {
    const base = mergeVertices(new THREE.IcosahedronGeometry(1, 3).deleteAttribute("normal").deleteAttribute("uv"));
    const p = base.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const k = 1 + 0.18 * Math.sin(x * 3.1 + z * 2.3) + 0.1 * Math.sin(y * 5.7 + x * 4.1);
      p.setXYZ(i, x * k, y * k * 0.62, z * k);
    }
    base.computeVertexNormals();
    const m = new THREE.MeshLambertMaterial({ color: "#ffffff" });
    const inst = new THREE.InstancedMesh(base, m, 46);
    const r = rng(9), o = new THREE.Object3D();
    for (let k = 0; k < 46; k++) {
      const z = 2 - r() * 104, side = r() < 0.5 ? -1 : 1;
      o.position.set(pathX(z) + 0.9 + side * (1.6 + r() * 2.2), -0.1, z);
      const sc = 0.35 + r() * 0.9;
      o.scale.set(sc * (1 + r() * 0.6), sc, sc);
      o.rotation.set(r() * 0.3, r() * 6.28, r() * 0.3);
      o.updateMatrix();
      inst.setMatrixAt(k, o.matrix);
      inst.setColorAt(k, new THREE.Color().setHSL(0.2 + r() * 0.08, 0.3, 0.04 + r() * 0.04));
    }
    return inst;
  }, []);
  return <primitive object={mesh} />;
}

/** Colossal trunks with buttress roots and hanging vines, either side of the path (two great ones frame H03). */
function Trunks({ mobile }: { mobile: boolean }) {
  const bark = useTexture(plate("tex-bark", false));
  const group = useMemo(() => {
    bark.colorSpace = THREE.SRGBColorSpace;
    bark.wrapS = bark.wrapT = THREE.RepeatWrapping;
    const g = new THREE.Group();
    const r = rng(21);
    const trees: [number, number, number][] = [[-5.2, -34, 2.3], [5.8, -36, 2.0], [-6.5, -60, 1.8], [7.5, -57, 2.2], [-3.4, -2, 0.9], [-9, -84, 2.4]];
    for (let k = 0; k < (mobile ? 18 : 30); k++) {
      const z = 2 - r() * 110, side = r() < 0.5 ? -1 : 1;
      const x = pathX(z) + side * (5 + r() * 14);
      trees.push([x, z, 0.6 + r() * 1.6]);
    }
    const texFor = (rad: number) => { const t = bark.clone(); t.repeat.set(Math.max(2, Math.round(rad * 3)), 10); t.needsUpdate = true; return t; };
    for (const [x, z, rad] of trees) {
      const h = 60 + rad * 2; // ends inside the canopy layer, so no top is ever seen
      const mat = new THREE.MeshStandardMaterial({ map: texFor(rad), roughness: 0.95, color: "#7b8768" });
      // The trunk flares into buttresses at the foot (a lathe profile: wide at the ground, quickly settling).
      const prof: THREE.Vector2[] = [];
      for (let k = 0; k <= 24; k++) {
        const y = (k / 24) ** 2 * h;
        prof.push(new THREE.Vector2(rad * (0.85 + 0.25 * (1 - y / h) + 1.5 * Math.exp(-y / (rad * 1.1))), y - 0.4));
      }
      const geo = new THREE.LatheGeometry(prof, 22);
      // Buttress ridges: push the flare out along a few directions.
      const pa = geo.attributes.position as THREE.BufferAttribute, ridges = 3 + Math.floor(r() * 3), ph = r() * 6.28;
      for (let i = 0; i < pa.count; i++) {
        const px = pa.getX(i), py = pa.getY(i), pz = pa.getZ(i), a = Math.atan2(pz, px);
        const flare = Math.exp(-(py + 0.4) / (rad * 1.1));
        const k = 1 + flare * 0.55 * Math.pow(Math.max(0, Math.cos((a + ph) * ridges)), 3) - flare * 0.25;
        pa.setXYZ(i, px * k, py, pz * k);
      }
      geo.computeVertexNormals();
      const trunk = new THREE.Mesh(geo, mat);
      trunk.position.set(x, 0, z);
      g.add(trunk);
    }
    // Vines hanging from the unseen canopy.
    const vineMat = new THREE.MeshStandardMaterial({ color: "#2f3a1f", roughness: 0.9 });
    for (let k = 0; k < (mobile ? 16 : 34); k++) {
      const z = 1 - r() * 105, x = pathX(z) + (r() - 0.5) * 18;
      if (Math.abs(x - pathX(z)) < 1.6) continue;
      const top = 22 + r() * 10, bottom = 2 + r() * 9;
      const sway = (r() - 0.5) * 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, top, z), new THREE.Vector3(x + sway, (top + bottom) / 2, z + (r() - 0.5) * 1.5), new THREE.Vector3(x + sway * 0.4, bottom, z),
      ]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.04 + r() * 0.05, 5), vineMat));
    }
    return g;
  }, [bark, mobile]);
  return <primitive object={group} />;
}

/** Ferns, monstera and leaf clusters cut out of the foreground plate, standing along both banks. */
function Foliage({ mobile }: { mobile: boolean }) {
  const [ferns, left, right, monstera] = useTexture([plate("p02-ferns", false), plate("p02-left", false), plate("p02-right", false), plate("p02-monstera", false)]);
  const group = useMemo(() => {
    const g = new THREE.Group();
    const r = rng(33);
    const kinds: [THREE.Texture, number][] = [[ferns, 640 / 430], [left, 600 / 1170], [right, 600 / 1170], [monstera, 400 / 760]];
    const mats = kinds.map(([t]) => {
      t.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, alphaTest: 0.04, side: THREE.DoubleSide, roughness: 0.6, color: "#b9c7a0" });
    });
    for (let k = 0; k < (mobile ? 90 : 220); k++) {
      const z = 3 - r() * 108, side = r() < 0.5 ? -1 : 1;
      const x = pathX(z) + side * (2.2 + r() * 12);
      const kind = r() < 0.55 ? 0 : r() < 0.5 ? (side < 0 ? 1 : 2) : 3;
      const aspect = kinds[kind][1];
      const h = kind === 0 ? 1.0 + r() * 1.4 : kind === 3 ? 1.6 + r() * 1.6 : 2.6 + r() * 2.6;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), mats[kind]);
      m.position.set(x, h / 2 - 0.2 + (kind === 3 ? 0.8 + r() * 2 : 0), z);
      m.rotation.y = (r() - 0.5) * 0.9 + (side < 0 ? 0.25 : -0.25);
      g.add(m);
    }
    return g;
  }, [ferns, left, right, monstera, mobile]);
  return <primitive object={group} />;
}

/** H02: the single drop of gold light falling onto a rain-wet leaf and splashing into the ribbon. */
function Seed({ calm, night }: { calm: boolean; night: boolean }) {
  const h = hold(1);
  // The blade fills the lower part of the macro frame, rising to the right.
  const leafPos = h.pos.clone().addScaledVector(h.dir, 2.4).add(new THREE.Vector3(-0.15, -0.55, 0));
  const hit = h.pos.clone().addScaledVector(h.dir, 2.3).add(new THREE.Vector3(-0.12, -0.32, 0));
  const drop = useRef<THREE.Mesh>(null);
  const splash = useMemo(() => {
    const n = 70, g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), v = new Float32Array(n * 3), r = rng(4);
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2, s = 0.25 + r() * 0.6;
      v[k * 3] = Math.cos(a) * s; v[k * 3 + 1] = 0.6 + r() * 1.2; v[k * 3 + 2] = Math.sin(a) * s * 0.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({ color: "#FFE0A0", size: 0.03, toneMapped: false, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(g, m);
    pts.position.copy(hit);
    pts.frustumCulled = false;
    return { pts, v, p };
  }, [hit]);
  useFrame(({ clock }) => {
    const period = 3.2, t = calm ? 2.2 : clock.elapsedTime % period;
    const fall = 1.1;
    if (drop.current) {
      const k = Math.min(1, t / fall);
      drop.current.position.copy(hit).add(new THREE.Vector3(0, 0.62 * (1 - k * k), 0));
      drop.current.visible = t < fall || calm;
    }
    const st = Math.max(0, t - fall), alive = st > 0 && st < 1.4;
    for (let k = 0; k < splash.v.length / 3; k++) {
      splash.p[k * 3] = splash.v[k * 3] * st * 0.35;
      splash.p[k * 3 + 1] = Math.max(0, splash.v[k * 3 + 1] * st * 0.35 - 0.9 * st * st * 0.35);
      splash.p[k * 3 + 2] = splash.v[k * 3 + 2] * st * 0.35;
    }
    splash.pts.geometry.attributes.position.needsUpdate = true;
    (splash.pts.material as THREE.PointsMaterial).opacity = alive && !calm ? 1 - st / 1.4 : 0;
  });
  return (
    <group>
      <Leaf position={leafPos} rotation={new THREE.Euler(-1.25, 0.2, -0.95)} size={[2.0, 4.2]} bend={0.32} calm={calm} night={night} />
      <mesh ref={drop} scale={[0.04, 0.058, 0.04]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#FFE6A8" toneMapped={false} />
      </mesh>
      <primitive object={splash.pts} />
    </group>
  );
}

/** H06: the giant leaf on the left of the frame, its veins glowing as the gold contour map (pins are DOM labels). */
function MapLeaf({ calm, night, mobile }: { calm: boolean; night: boolean; mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const at = mobile ? [0.36, 0.48] as const : [0.33, 0.5] as const;
  const c = anchorFor(5, at, 5.8, camera.fov, size.width / size.height);
  const h = hold(5);
  const e = new THREE.Euler().setFromQuaternion(h.quat);
  const vh = viewHeight(5.8, camera.fov);
  return <Leaf position={c} rotation={new THREE.Euler(e.x, e.y, e.z - 0.55)} size={[vh * 0.62, vh * 1.05]} bend={0.35} map={1} calm={calm} night={night} sway={0.015} />;
}

/** H04: "Where Strategy Meets Story. / Where Story Becomes Legacy." set into the clearing, behind a hanging vine. */
function Legacy({ mobile }: { mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const depth = 13, at = mobile ? [0.5, 0.36] as const : [0.47, 0.385] as const;
  const pos = anchorFor(3, at, depth, camera.fov, aspect);
  const h = hold(3);
  const lineH = viewHeight(depth, camera.fov) * (mobile ? 0.034 : 0.062);
  const rot = new THREE.Euler().setFromQuaternion(h.quat);
  const vine = anchorFor(3, mobile ? [0.3, 0.4] : [0.3, 0.4], 7, camera.fov, aspect);
  const props = { font: "/fonts/outfit-300.ttf", fontSize: lineH, color: "#FBE3A6", outlineColor: "#E5A94B", outlineBlur: lineH * 0.35, outlineOpacity: 0.55, anchorX: "center", anchorY: "middle", letterSpacing: 0.01 } as const;
  return (
    <group>
      <group position={pos} rotation={rot}>
        <group rotation={[0, mobile ? 0 : -0.22, mobile ? 0 : -0.05]}>
          <Text {...props} position={[0, lineH * 0.62, 0]}>{c3(hero.positioning[0])}</Text>
          <Text {...props} position={[lineH * (mobile ? 0 : 0.5), -lineH * 0.62, 0]}>{c3(hero.positioning[1])}</Text>
        </group>
      </group>
      {/* The hanging vine in front of the words. */}
      <mesh position={[vine.x, vine.y + 4, vine.z]}>
        <cylinderGeometry args={[0.07, 0.11, 22, 8]} />
        <meshStandardMaterial color="#26301a" roughness={0.9} />
      </mesh>
    </group>
  );
}

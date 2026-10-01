"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { FilmState } from "@/components/film/state";
import { interaction } from "../../actions";
import { useUi, type Runtime } from "../../journey";
import { route } from "../../route";
import { thingEvents } from "../common";
import { PROJ_FRAMES, PROJ_SCREEN } from "../layout";
import { lightSurface, placeColours, plaster, stone, type Theme } from "../look";

const PLACE = 3;
// The hall: x −39..−21, z −108..−139.5, 12 high. The route walks out through the screen at its right edge.
const X0 = -39, X1 = -21, Z0 = -108, Z1 = -139.5, HH = 12;
const APERTURE = new THREE.Vector3(-21.6, 9.2, -114);

const PROJECT = /* glsl */ `
uniform float uTime; uniform float uRoll; uniform float uFocus; uniform vec3 uBase; uniform vec3 uMagenta; uniform vec3 uGold;
varying vec2 vUv;
float blob(vec2 p, vec2 c, float r, float soft) { return smoothstep(r + soft, r - soft * 0.3, length(p - c)); }
void main() {
  vec2 p = vUv * vec2(1.8, 1.0);
  float t = uTime * 0.18;
  float soft = mix(0.32, 0.05, uFocus);
  float a = blob(p, vec2(0.55 + 0.25 * sin(t * 1.3), 0.52 + 0.18 * sin(t * 0.9 + 1.0)), 0.22, soft);
  float b = blob(p, vec2(1.2 + 0.22 * cos(t * 1.1), 0.45 + 0.2 * cos(t * 0.7)), 0.16, soft);
  float c = blob(p, vec2(0.95 + 0.3 * sin(t * 0.6 + 2.0), 0.3 + 0.12 * sin(t * 1.7)), 0.1, soft);
  float d = blob(p, vec2(1.45 + 0.1 * sin(t * 1.9), 0.7 + 0.1 * cos(t * 1.2)), 0.08, soft * 0.8);
  vec3 col = uBase;
  vec3 pic = mix(uBase * 0.6, uMagenta, a);
  pic = mix(pic, uGold, b * 0.85);
  pic = mix(pic, vec3(1.0, 0.92, 0.95), c * 0.6);
  pic = mix(pic, uMagenta * 1.2, d);
  // A soft vignette, like a projected frame.
  vec2 q = vUv - 0.5;
  float vig = smoothstep(0.75, 0.25, length(q * vec2(1.1, 1.4)));
  col = mix(col, pic, uRoll * vig);
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/**
 * The Projection Hall (Golden Guardian Productions, cinema magenta): a long, softly lit hall with one small aperture
 * high in the right wall and a screen across the far end. Hold Roll and the aperture opens: a beam crosses the hall
 * and a moving picture of light fills the screen; the pointer pulls focus. Four frames hang along the wall, one per
 * thing Golden Guardian makes. The route then walks you through the picture into the next place.
 */
export function Projection({ theme, rtRef, filmRef, onEnter }: { theme: Theme; rtRef: { current: Runtime }; filmRef: { current: FilmState }; onEnter: (id: string) => void }) {
  const c = useMemo(() => placeColours(PLACE, theme), [theme]);
  const mats = useMemo(() => ({
    wall: plaster(c.wall, 0.95),
    floor: stone(c.floor.clone().offsetHSL(0, 0, theme === "light" ? -0.06 : -0.02)),
    frame: plaster(c.wall.clone().offsetHSL(0, 0, theme === "light" ? -0.18 : 0.06), 0.6),
    aperture: lightSurface("#ffd2e6", 1.4),
    beam: new THREE.MeshBasicMaterial({ color: "#ff8cc0", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }),
  }), [c, theme]);
  const screen = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: PROJECT,
    transparent: true,
    uniforms: {
      uTime: { value: 0 }, uRoll: { value: 0 }, uFocus: { value: 0.5 },
      uBase: { value: new THREE.Color(theme === "light" ? "#f0d7e2" : "#2a0d1b") },
      uMagenta: { value: new THREE.Color("#e8307f") }, uGold: { value: new THREE.Color("#c9a45c") },
    },
  }), [theme]);
  const frameMats = useMemo(() => PROJ_FRAMES.map((_, k) => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: PROJECT,
    uniforms: {
      uTime: { value: k * 7 }, uRoll: { value: 0.55 }, uFocus: { value: 0.2 },
      uBase: { value: new THREE.Color(theme === "light" ? "#f4dde8" : "#24101a") },
      uMagenta: { value: new THREE.Color("#e8307f") }, uGold: { value: new THREE.Color("#c9a45c") },
    },
  })), [theme]);
  const beamGeo = useMemo(() => {
    const target = new THREE.Vector3(PROJ_SCREEN[0], PROJ_SCREEN[1], PROJ_SCREEN[2] + 0.2);
    const len = APERTURE.distanceTo(target);
    const g = new THREE.CylinderGeometry(0.15, 4.2, len, 32, 1, true);
    g.translate(0, -len / 2, 0);
    // Lay the cone along −z (from the aperture), then aim −z at the screen and move it to the aperture.
    g.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const m = new THREE.Matrix4().lookAt(APERTURE, target, new THREE.Vector3(0, 1, 0));
    m.setPosition(APERTURE);
    g.applyMatrix4(m);
    return g;
  }, []);
  const screenRef = useRef<THREE.Mesh>(null);
  const things = route[PLACE].things;
  const offerings = things.filter((t) => !t.room);
  const production = things.find((t) => t.room)!;

  useFrame(({ clock, camera }, dt) => {
    const held = interaction.rollHeld;
    interaction.roll += ((held ? 1 : interaction.roll > 0.98 ? 1 : 0) - interaction.roll) * Math.min(1, dt * (held ? 1.4 : 0.5));
    const roll = Math.max(interaction.roll, useUi.getState().room === production.id ? 1 : 0);
    const u = screen.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uRoll.value = 0.18 + 0.82 * roll;
    // Focus follows the pointer across the screen.
    const p = filmRef.current.pointer;
    const fx = p.active ? 1 - Math.min(1, Math.abs(p.x / window.innerWidth - 0.5) * 2.2) : 0.6;
    u.uFocus.value += (fx - u.uFocus.value) * Math.min(1, dt * 3);
    mats.beam.opacity = 0.11 * roll * (theme === "light" ? 0.8 : 1);
    frameMats.forEach((m, k) => {
      m.uniforms.uTime.value = clock.elapsedTime + k * 7;
      const on = useUi.getState().hover === offerings[k]?.id ? 1 : 0;
      m.uniforms.uRoll.value += ((0.45 + on * 0.55) - m.uniforms.uRoll.value) * Math.min(1, dt * 6);
    });
    // Walking through the picture: it thins as the camera reaches it.
    if (screenRef.current) {
      const d = camera.position.distanceTo(screenRef.current.position);
      screenRef.current.visible = d > 1.2;
    }
  });

  const pEv = thingEvents(PLACE, production.id, rtRef, onEnter);
  return (
    <group>
      <mesh material={mats.floor} position={[(X0 + X1) / 2, 0, (Z0 + Z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[X1 - X0, Z0 - Z1]} />
      </mesh>
      <mesh material={mats.wall} position={[X0, HH / 2, (Z0 + Z1) / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.8, HH, Z0 - Z1]} />
      </mesh>
      <mesh material={mats.wall} position={[X1, HH / 2, (Z0 + Z1) / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.8, HH, Z0 - Z1]} />
      </mesh>
      <mesh material={mats.wall} position={[(X0 + X1) / 2, HH + 0.4, (Z0 + Z1) / 2]} receiveShadow>
        <boxGeometry args={[X1 - X0 + 0.8, 0.8, Z0 - Z1]} />
      </mesh>
      {/* The aperture and its beam: the hall's one light. */}
      <mesh material={mats.aperture} position={APERTURE} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.3, 32]} />
      </mesh>
      <mesh geometry={beamGeo} material={mats.beam} />
      {/* The screen across the far end. */}
      <mesh ref={screenRef} material={screen} position={[(X0 + X1) / 2, 5, Z1]} {...pEv}>
        <planeGeometry args={[X1 - X0 - 0.8, 10]} />
      </mesh>
      {offerings.map((t, k) => (
        <group key={t.id} position={PROJ_FRAMES[k]} rotation={[0, -Math.PI / 2, 0]} {...thingEvents(PLACE, t.id, rtRef)}>
          <mesh material={mats.frame} position={[0, 0, -0.06]} castShadow><boxGeometry args={[2.6, 1.7, 0.1]} /></mesh>
          <mesh material={frameMats[k]} position={[0, 0, 0.0]}><planeGeometry args={[2.3, 1.4]} /></mesh>
        </group>
      ))}
    </group>
  );
}

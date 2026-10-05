/**
 * The world's look, per place and theme (DESIGN.md): pale plaster and stone in the Luminous theme, deep matte
 * surfaces in Cinema. Inside a vertical's world its colour is the light, the atmosphere and the tint of the
 * materials (C5); every place has exactly one light (C7). Values here are art direction, not navigation.
 */
import * as THREE from "three";
import { experienceConfig as X } from "@/lib/experience";

export type Theme = "light" | "dark";

/** The single light of each place: where it comes from (relative to the place's anchor), its colour and strength. */
export const LIGHTS: { from: [number, number, number]; colour: string; intensity: number }[] = [
  { from: [4, 30, 6], colour: "#fff6ea", intensity: 3.0 }, // Atrium: daylight through the oculus
  { from: [-26, 18, 4], colour: "#fff4e4", intensity: 2.8 }, // Studio Floor: high side windows
  { from: [6, 22, -26], colour: "#5c68ff", intensity: 4.2 }, // Drafting Hall: the tall indigo window
  { from: [10, 9, -18], colour: "#ff4f99", intensity: 4.0 }, // Projection Hall: the projector's beam
  { from: [-14, 26, 18], colour: "#fff1dc", intensity: 3.0 }, // Concourse: high diffuse daylight
  { from: [10, 10, -22], colour: "#ff7a50", intensity: 4.0 }, // Water Court: the arch to the outside
  { from: [-6, 34, -4], colour: "#5fe0a4", intensity: 3.4 }, // Garden Court: the open sky
  { from: [2, 36, -2], colour: "#34c8f2", intensity: 4.2 }, // Glass Lattice: one beam from above
  { from: [-40, 24, 30], colour: "#ffd9a0", intensity: 3.2 }, // Roof: a low warm sun
  { from: [16, 8, 12], colour: "#ffc98a", intensity: 2.6 }, // Gallery: a golden-hour shaft
  { from: [-10, 26, 8], colour: "#c9d4ff", intensity: 1.3 }, // Post-credits: dusk
];

const NEUTRAL = { light: { wall: "#eceef1", floor: "#dfe2e7" }, dark: { wall: "#1a2031", floor: "#121726" } };

/** Wall and floor colour for a place: neutral plaster, tinted toward its world's atmosphere when it has one. */
export function placeColours(index: number, theme: Theme) {
  const n = NEUTRAL[theme];
  const wall = new THREE.Color(n.wall);
  const floor = new THREE.Color(n.floor);
  const vivid = X.colour[index];
  if (vivid) {
    const atm = new THREE.Color(X.atmosphere[theme][index]);
    wall.lerp(atm, theme === "light" ? 0.85 : 0.75);
    floor.lerp(atm, theme === "light" ? 0.6 : 0.6).lerp(new THREE.Color(vivid), theme === "light" ? 0.08 : 0.1);
  }
  return { wall, floor, vivid: vivid ? new THREE.Color(vivid) : null };
}

export function plaster(color: THREE.Color, roughness = 0.92) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, envMapIntensity: 0.35 });
}

export function stone(color: THREE.Color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0, envMapIntensity: 0.7 });
}

export const GOLD = "#c9a45c";
export function goldMetal() {
  return new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.24, envMapIntensity: 1.25 });
}

/** A visible light source (a window, an aperture, an arch): unlit, so it reads as light, never a halo. */
export function lightSurface(color: THREE.Color | string, strength = 1) {
  const c = new THREE.Color(color).multiplyScalar(strength);
  return new THREE.MeshBasicMaterial({ color: c, toneMapped: false, fog: false });
}

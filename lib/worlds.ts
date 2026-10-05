/**
 * The splat worlds (World Labs Marble, saved by the user as design-refs/worlds/wNN-name.spz, + -collider.glb). Each
 * covers a stretch of one journey's places. `scripts/v5/worlds.mjs` converts what has arrived into public/v5/worlds
 * (LoD .rad when Spark's build-lod is available, the .spz otherwise, plus a lighter phone copy) and writes
 * lib/worlds.files.json; a world without a file falls back to its depth-mesh dioramas (the plates).
 *
 * `transform` places the world's own coordinates on the route (position, yaw/pitch/roll in degrees, uniform scale).
 * It is authored per world by exploring it in the browser (`?tune` → __worlds); only this data changes, never the
 * engine.
 */
import files from "./worlds.files.json";

export type WorldId =
  | "w01-jungle" | "w02-canopy" | "w03-clouds-peaks" | "w04-desert-canyon" | "w05-cave" | "w06-coast" | "w07-reef"
  | "w08-jade-lake" | "w09-ice-cave" | "w10-aurora" | "w11-summit" | "w12-dawn-clearing" | "w13-aurelius-city"
  | "w14-ggp-cavern" | "w15-valora-deep" | "w16-asraya-valley" | "w17-rudra-crystal" | "test-jungle";

export type World = {
  id: WorldId;
  journey: string;
  /** The places it covers (inclusive); it streams in from `from - 2` and unloads after `to + 2`. */
  from: number;
  to: number;
  transform: { position: [number, number, number]; rotation: [number, number, number]; scale: number };
  /** The physical threshold at its far end that covers the handover to the next world. */
  threshold?: "canopy-break" | "cloud-sea" | "canyon-descent" | "cave-mouth" | "sea-arch" | "water-surface" | "ice-wall" | "glacier-exit" | "summit-ridge" | "night-descent" | "portal";
};

const T0 = { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1 };

export const worlds: World[] = [
  { id: "w01-jungle", journey: "home", from: 0, to: 5, transform: T0, threshold: "canopy-break" },
  { id: "w02-canopy", journey: "home", from: 6, to: 8, transform: T0, threshold: "cloud-sea" },
  { id: "w03-clouds-peaks", journey: "home", from: 9, to: 12, transform: T0, threshold: "canyon-descent" },
  { id: "w04-desert-canyon", journey: "home", from: 13, to: 15, transform: T0, threshold: "cave-mouth" },
  { id: "w05-cave", journey: "home", from: 16, to: 18, transform: T0, threshold: "sea-arch" },
  { id: "w06-coast", journey: "home", from: 19, to: 20, transform: T0, threshold: "water-surface" },
  { id: "w07-reef", journey: "home", from: 21, to: 21, transform: T0, threshold: "water-surface" },
  { id: "w08-jade-lake", journey: "home", from: 22, to: 24, transform: T0, threshold: "ice-wall" },
  { id: "w09-ice-cave", journey: "home", from: 25, to: 26, transform: T0, threshold: "glacier-exit" },
  { id: "w10-aurora", journey: "home", from: 27, to: 27, transform: T0, threshold: "summit-ridge" },
  { id: "w11-summit", journey: "home", from: 28, to: 31, transform: T0, threshold: "night-descent" },
  { id: "w12-dawn-clearing", journey: "home", from: 35, to: 35, transform: T0 },
  { id: "w13-aurelius-city", journey: "aurelius", from: 0, to: 99, transform: T0, threshold: "portal" },
  { id: "w14-ggp-cavern", journey: "golden-guardian-productions", from: 0, to: 99, transform: T0, threshold: "portal" },
  { id: "w15-valora-deep", journey: "valora", from: 0, to: 99, transform: T0, threshold: "portal" },
  { id: "w16-asraya-valley", journey: "asraya", from: 0, to: 99, transform: T0, threshold: "portal" },
  { id: "w17-rudra-crystal", journey: "rudra-yugen", from: 0, to: 99, transform: T0, threshold: "portal" },
];

type Files = Record<string, { desktop: string; mobile?: string; paged?: boolean; collider?: string }>;
/** The files that have arrived (written by scripts/v5/worlds.mjs). */
export const worldFiles = files as Files;
export const worldFile = (id: WorldId, mobile: boolean) => {
  const f = worldFiles[id];
  if (!f) return null;
  return { url: mobile && f.mobile ? f.mobile : f.desktop, paged: !!f.paged, collider: f.collider };
};
/** The worlds of a journey that have a file (the others use the depth-mesh fallback). */
export const liveWorlds = (journey: string) => worlds.filter((w) => w.journey === journey && worldFiles[w.id]);

/** `?splat=test`: the pipeline test world (the jungle plate as real splats) stands in for w01. */
export const testSplat = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("splat") === "test" && !!worldFiles["test-jungle"];
export const TEST_WORLD: World = { id: "test-jungle", journey: "home", from: 0, to: 6, transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 } };
/** Is a journey's stretch already drawn by a splat world (so its plate fallback steps aside)? */
export const splatCovers = (journey: string, from: number, to: number) =>
  (journey === "home" && from === TEST_WORLD.from && testSplat()) || liveWorlds(journey).some((w) => w.from <= from && w.to >= Math.min(to, w.to) && from <= w.to);

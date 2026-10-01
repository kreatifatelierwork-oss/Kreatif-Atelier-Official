/**
 * Where things stand in the world (world units), by place and thing id. The camera holds and the route are fixed
 * (navigation is frozen); everything here is composed around them so the passages stay clear.
 */
import { route } from "../route";

type V3 = [number, number, number];

/** Studio Floor: the four About panels stand in a diagonal row on the right of the floor. */
export const STUDIO_PANELS: V3[] = [[-1, 0, -47], [2, 0, -44.5], [5, 0, -42], [8, 0, -39.5]];
/** Drafting Hall: the drafting table and the four models on it; the services lectern; the formats plinth. */
export const DRAFT_TABLE: V3 = [-8.6, 0, -79.2];
export const DRAFT_MODELS: V3[] = [[-10.9, 1.12, -79.4], [-9.4, 1.12, -79.2], [-7.9, 1.12, -79.0], [-6.4, 1.12, -78.8]];
export const DRAFT_SERVICES: V3 = [-15.5, 1.2, -86];
export const DRAFT_FORMATS: V3 = [-5.4, 1.1, -87];
/** Projection Hall: four frames down the right wall; the screen across the far end (you walk through it). */
export const PROJ_FRAMES: V3[] = [[-21.6, 3.1, -127], [-21.6, 3.1, -130.5], [-21.6, 3.1, -134], [-21.6, 3.1, -137.5]];
export const PROJ_SCREEN: V3 = [-30, 4.6, -139.5];
/** Concourse (local to its group, which faces the camera's line of sight): the far wall's thirteen openings. */
export const CONC_OPENINGS_Z = -18;
/** Water Court: the stepping stones from the near edge to the arch; the arch itself (on the route). */
export const WATER_STONES: V3[] = [
  [35.2, 0, -214.5], [37.4, 0, -217.6], [39.8, 0, -220.4], [42.4, 0, -223.2],
  [44.9, 0, -226.1], [47.2, 0, -229.1], [49.4, 0, -232.2], [51.2, 0, -235.2],
];
export const WATER_ARCH: V3 = [53.6, 0, -238.6];
/** Garden Court: the pool and its four stones. */
export const GARDEN_POOL: V3 = [64.6, 0, -266.5];
export const GARDEN_STONES: V3[] = [[57.6, 0, -264.5], [61.2, 0, -258.4], [68.2, 0, -258.6], [71.4, 0, -265.2]];
/** Glass Lattice: four clusters of panes in the void. */
export const LATTICE_CLUSTERS: V3[] = [[57.5, 6, -312], [61.5, 10.5, -316], [66.5, 7.5, -314], [70.5, 11.5, -318]];
/** The Roof: a terrace above the Atrium's level with the monument on it, right of centre in the aerial view. */
export const ROOF_TERRACE: V3 = [27.2, 53.2, -79.4];
export const MONUMENT: V3 = [26.8, 56, -79.2];
/** Gallery: the prints hang on the Atrium's curved wall. */
export const GALLERY_WALL: V3 = [-9, 2.2, -2];

const at = (list: V3[], k: number) => list[Math.max(0, Math.min(list.length - 1, k))];

/** The camera dollies toward this point when a thing's room is entered. */
export function thingAnchor(place: number, k: number): V3 | null {
  const p = route[place];
  if (!p || k < 0) return null;
  const t = p.things[k];
  const offering = p.things.filter((x) => !x.room && !x.founder).findIndex((x) => x.id === t.id);
  switch (p.id) {
    case "studio": return at(STUDIO_PANELS, k).map((v, i) => (i === 1 ? 1.7 : v)) as V3;
    case "aurelius":
      if (offering >= 0) return at(DRAFT_MODELS, offering);
      return t.id === "engagement-models" ? DRAFT_FORMATS : DRAFT_SERVICES;
    case "ggp": return offering >= 0 ? at(PROJ_FRAMES, offering) : PROJ_SCREEN;
    case "concourse": return [16, 2.2, -190];
    case "valora": return at(WATER_STONES, 4 + Math.max(0, offering));
    case "asraya": return at(GARDEN_STONES, Math.max(0, offering));
    case "rudra": return at(LATTICE_CLUSTERS, Math.max(0, offering));
    case "roof": return MONUMENT;
    case "gallery": return GALLERY_WALL;
    default: return null;
  }
}

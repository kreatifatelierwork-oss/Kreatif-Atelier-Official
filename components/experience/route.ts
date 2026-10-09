/**
 * The journeys (the home page and the five company pages) and the active one. The v5 home route: one place per reference frame (H01–H36), in twelve chapters. Each place lists what it says
 * (word for word from the content files; C3 punctuation at render) as scene items, each item set where its reference
 * frame shows it. `at` is the item's point in the reference frame (fractions of width and height); `depth` is how far
 * from the camera it sits in the world (metres), which gives it real parallax as the camera passes. A thing with a
 * room is a field-guide page that unfolds over the scene (Enter / Back, own link).
 */
import type { Service } from "@/content/services";
import { experienceConfig as X } from "@/lib/experience";
import type { RouteData } from "@/lib/route-data";

export const unnumbered = (marker: string) => marker.split(" · ").slice(1).join(" · ");
export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type At = readonly [number, number];
/** Type faces: light = geometric sans written in light (Outfit); serif = classical titles (Cormorant). */
export type Face = "light" | "serif";

export type Item =
  /** A film title card with letterbox bars (X09). */
  | { k: "card"; title: string; sub: string; tag?: "h1" | "h2" }
  /** A headline set in the world. `drawn`: rendered in 3D (occluded, curved); the DOM copy is visually hidden. */
  | { k: "head"; text: string; sub?: string; line?: string; tag: "h1" | "h2" | "p"; face: Face; at: At; size: number;
      align?: "left" | "center" | "right"; depth: number; tilt?: number; ornament?: boolean; drawn?: boolean;
      /** The words repeat a heading already read: hidden from assistive tech. */
      echo?: boolean }
  /** Narration in italic serif. */
  | { k: "voice"; text: string; at: At; size: number; align?: "left" | "center" | "right"; depth: number; drawn?: boolean }
  /** Callouts (X01): a ring on the object, a bent leader, the label. A callout with a room opens a field-guide page. */
  | { k: "callouts"; items: readonly { label: string; ring: At; at: At; depth: number; room?: string; side?: "left" | "right" | "up" }[] }
  /** Map / diagram pins (X05, H12, H13): a ring, a straight tick, a label. */
  | { k: "pins"; heading?: { text: string; at: At; size: number }; items: readonly { label: string; at: At; depth: number; mono?: boolean }[] }
  /** The two giant numerals made of light (H09). */
  | { k: "numerals"; at: At; depth: number }
  /** Text along a curve across the sky (H11). */
  | { k: "arc"; label: string; text: string; depth: number }
  /** A list carved or set as a column (H16 services, H33 credits, H32 notes). */
  | { k: "list"; heading?: string; items: readonly { title: string; body?: string }[]; at: At; depth: number; style: "carved" | "credits" | "journal" | "stars" | "profile" | "strata" | "reel" }
  /** A quiet pill (portal) or the gold button. */
  | { k: "button"; label: string; at: At; depth: number; href?: string; primary?: boolean }
  /** A company page's closing: Enquire (mail), Next, Back to the Atlas (stacked buttons, A06). */
  | { k: "onward"; at: At; depth: number; enquire: { label: string; href: string }; next: { label: string; href: string }; back: { label: string; href: string } }
  /** The closing scene's contact block (H36). */
  | { k: "closing"; at: At; depth: number };

export type Room = { kind: "text"; title: string; body: string } | { kind: "service"; service: Service };
export type Thing = { id: string; label: string; room?: Room };

export type Place = {
  id: string;
  index: number;
  /** 0-based chapter. */
  chapter: number;
  name: string;
  colour: string | null;
  items: Item[];
  things: Thing[];
};


export type Def = { id: string; chapter: number; items: Item[]; things?: Thing[] };

/** A journey: its places, the route data its camera flies (same engine), and its shareable links. */
export type Journey = {
  id: string;
  /** The page it lives on ("/", "/aurelius" …). */
  path: string;
  chapters: string[];
  /** The act bar's name for a chapter ("The Seed", "Aurelius · Arrival"). */
  chapterName: (c: number) => string;
  defs: Def[];
  data: RouteData;
  aliases: Record<string, { place: string; thing?: string }>;
  /** The film (docs/design/FILM-SHOTLIST.md): for each place, the index of the keyframe it sits on. Places that share
   *  a keyframe hold the film still while their text scrolls. */
  film: { places: number[] };
};

const journeys = new Map<string, Journey>();
export const registerJourney = (j: Journey) => journeys.set(j.path, j);
export const journeyFor = (path: string) => journeys.get(path.replace(/\/$/, "") || "/") ?? journeys.get("/")!;

// ---- The active journey ------------------------------------------------------------------------------------------
// Live bindings: every module that imports these (including the locked engine, which reads LAST) sees the journey
// that is active now. Switching swaps the route data under the same engine and the same feel.
export let active: Journey;
export let route: Place[] = [];
export let LAST = 0;
export let chapters: string[] = [];
export let chapterStart: number[] = [];
export let placeStart: number[] = [];
export let runningTime = 0;
/** Bumped on every switch, so caches and components keyed on it rebuild. */
export let journeyKey = 0;

export function setJourney(j: Journey) {
  if (active === j) return;
  active = j;
  journeyKey++;
  // The engine reads its per-place lists from experienceConfig: swap them (the feel constants are untouched).
  X.holdSeconds = j.data.holdSeconds;
  X.camera = j.data.camera;
  X.anchors = j.data.anchors;
  X.colour = j.data.colour;
  X.atmosphere = j.data.atmosphere;
  route = j.defs.map((d, index) => ({
    id: d.id, index, chapter: d.chapter, name: j.chapterName(d.chapter), colour: X.colour[index], items: d.items, things: d.things ?? [],
  }));
  LAST = route.length - 1;
  chapters = j.chapters;
  chapterStart = chapters.map((_, c) => route.findIndex((p) => p.chapter === c));
  placeStart = [];
  let t = 0;
  for (let i = 0; i < route.length; i++) {
    placeStart.push(t);
    t += X.holdSeconds[i] + (i < LAST ? X.travelSeconds : 0);
  }
  runningTime = placeStart[LAST] + X.holdSeconds[LAST];
}

/** Film-time at route position s (passage time is proportional to progress through the passage). */
export function filmTimeAt(s: number, holdElapsed = 0) {
  const i = Math.max(0, Math.min(LAST, Math.floor(s)));
  const f = s - i;
  if (f <= 0) return placeStart[i] + Math.min(holdElapsed, X.holdSeconds[i]);
  return placeStart[i] + X.holdSeconds[i] + f * X.travelSeconds;
}

/** Deep links: `#about`, `#about/our-philosophy`, or an alias (`#founders`, `#pricing`). */
export function parseHash(hash: string): { place: number; thing?: string } | null {
  const [pid, tid] = decodeURIComponent(hash.replace(/^#/, "")).split("/");
  const alias = active.aliases[pid];
  const place = route.findIndex((p) => p.id === (alias ? alias.place : pid));
  if (place < 0) return null;
  const want = tid ?? alias?.thing;
  const thing = want && route[place].things.some((t) => t.id === want && t.room) ? want : undefined;
  return { place, thing };
}
export const hashFor = (place: number, thing?: string | null) => `#${route[Math.max(0, Math.min(place, LAST))].id}${thing ? `/${thing}` : ""}`;

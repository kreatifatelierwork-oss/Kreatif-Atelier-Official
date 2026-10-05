/**
 * Movement along the route. `rt.s` (0 = the Atrium … LAST = post-credits) is the single source of truth; the camera,
 * the atmosphere, the captions and the act bar all read it. Per-frame values live in this plain object (never React
 * state); the UI store below changes only on discrete events (a new place, a room, the Index, the mode).
 */
import { create } from "zustand";
import { experienceConfig as X } from "@/lib/experience";
import { LAST } from "./route";

export type Mode = "watch" | "direct";
export type Phase = "gate" | "dip" | "flood" | "live";

export type Runtime = {
  s: number;
  /** Direct mode: where s is easing to. */
  target: number;
  mode: Mode;
  /** Seconds spent holding at the current place (Watch), for the film time. */
  holdElapsed: number;
  lastInput: number;
  /** A timed move (a jump, or Watch travelling to the next place). */
  move: { from: number; to: number; t0: number; dur: number } | null;
  /** The open room (a thing id in the current place) and how far the camera has moved into it (0..1). */
  room: string | null;
  dolly: number;
  /** Normalised pointer (-1..1) for parallax. */
  px: number;
  py: number;
};

export const createRuntime = (start = 0): Runtime => ({
  s: start, target: start, mode: "direct", holdElapsed: 0, lastInput: 0, move: null, room: null, dolly: 0, px: 0, py: 0,
});

type Ui = {
  phase: Phase;
  place: number;
  mode: Mode;
  /** The open room: a thing id in the current place. */
  room: string | null;
  indexOpen: boolean;
  /** A thing being hovered or focused (in the DOM or the scene). */
  hover: string | null;
  set: (p: Partial<Omit<Ui, "set">>) => void;
};

export const useUi = create<Ui>((set) => ({
  phase: "gate", place: 0, mode: "direct", room: null, indexOpen: false, hover: null,
  set: (p) => set(p),
}));

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clampS = (s: number) => Math.max(0, Math.min(LAST, s));

/** Travel to a place in about `jumpSeconds` whatever the distance (instant in reduced motion). */
export function jumpTo(rt: Runtime, place: number, now: number, reduced: boolean, dur = X.jumpSeconds * 1000) {
  const to = clampS(Math.round(place));
  rt.target = to;
  rt.holdElapsed = 0;
  if (reduced || Math.abs(to - rt.s) < 1e-3) { rt.s = to; rt.move = null; return; }
  rt.move = { from: rt.s, to, t0: now, dur };
}

/** Direct input (wheel, swipe): nudge the target by `delta` places. */
export function nudge(rt: Runtime, delta: number, now: number) {
  rt.mode = "direct";
  if (rt.move) { rt.target = rt.s; rt.move = null; }
  rt.target = clampS(rt.target + delta);
  rt.lastInput = now;
}

/** One frame of movement. */
export function advance(rt: Runtime, now: number, dt: number, reduced: boolean, paused: boolean) {
  const i = Math.round(rt.s);
  if (rt.move) {
    const k = Math.min(1, (now - rt.move.t0) / rt.move.dur);
    rt.s = rt.move.from + (rt.move.to - rt.move.from) * easeInOut(k);
    if (k >= 1) { rt.s = rt.move.to; rt.target = rt.s; rt.move = null; rt.holdElapsed = 0; }
    return;
  }
  if (rt.mode === "watch" && !paused) {
    rt.holdElapsed += dt;
    if (rt.holdElapsed >= X.holdSeconds[i]) {
      if (i >= LAST) { rt.mode = "direct"; return; }
      jumpTo(rt, i + 1, now, reduced, X.travelSeconds * 1000);
    }
    return;
  }
  // Direct: ease toward the target with a speed limit, then settle onto the nearest place once input stops.
  if (now - rt.lastInput > X.snapAfterMs) rt.target = Math.round(rt.target);
  const step = (rt.target - rt.s) * (1 - Math.exp(-dt / X.follow));
  const cap = X.maxPlacesPerSecond * dt;
  // Reduced motion: cut straight to whichever place the input has reached (the DOM crossfades).
  rt.s = reduced ? Math.round(rt.target) : rt.s + Math.max(-cap, Math.min(cap, step));
  if (Math.abs(rt.target - rt.s) < 1e-4) rt.s = rt.target;
  if (Math.abs(rt.s - Math.round(rt.s)) > 1e-3) rt.holdElapsed = 0;
}

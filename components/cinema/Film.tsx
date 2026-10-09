"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/components/film/loop";
import files from "@/lib/film.files.json";
import type { Runtime } from "../experience/journey";
import { active } from "../experience/route";
import { FilmEngine, type FilmEntry } from "./engine";

type Props = {
  rtRef: { current: Runtime };
  /** Phones get the centre-cropped encode. */
  mobile: boolean;
  /** Reduced motion and the still version: keyframe stills only, no scrubbing. */
  still: boolean;
  onReady: () => void;
};

export const filmFiles = files as unknown as Record<string, FilmEntry>;
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The world as a film. The route position `s` from the (locked) navigation engine is the only input: each place
 * sits on a keyframe of the film (`active.film.places`), and travelling between two places plays the clip between
 * their keyframes, forwards or backwards, exactly as far as `s` has gone. Only this mapping from progress to time is
 * new; the engine and its feel are untouched.
 */
export function Film({ rtRef, mobile, still, onReady }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const journey = active;
  useEffect(() => {
    const c = canvas.current;
    const entry = filmFiles[journey.id];
    if (!c || !entry) return;
    const variant = mobile ? "m" : "d";
    const size = () => {
      const r = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      c.width = Math.round(c.clientWidth * r);
      c.height = Math.round(c.clientHeight * r);
      engine.redraw();
    };
    const engine = new FilmEngine(c, entry, `/v5/film/${journey.id}`, variant, still);
    engine.preloadPosters();
    size();
    window.addEventListener("resize", size);
    if (new URLSearchParams(window.location.search).has("tune")) Object.assign(window, { __film: engine });
    const places = journey.film.places, keys = entry.keys;
    let ready = false;
    const off = onFrame(() => {
      const s = rtRef.current.s;
      const last = places.length - 1;
      const i = Math.max(0, Math.min(last - 1, Math.floor(s))), f = Math.max(0, Math.min(1, s - i));
      const ka = places[i], kb = places[Math.min(last, i + 1)];
      const filmed = (k: number) => k < engine.K.length && engine.hasFilm && (k <= entry.clips.length);
      if (still) {
        // Reduced motion / still version: the keyframe of the place you are at; the text carries the journey.
        engine.show(0, keys[places[Math.round(s)]]);
      } else if (filmed(ka) && filmed(kb)) {
        engine.show(engine.K[ka] + f * (engine.K[kb] - engine.K[ka]), null);
      } else {
        // A stretch whose clip has not arrived yet: hold the nearer keyframe's still.
        engine.show(0, keys[smooth(f) < 0.5 ? ka : kb]);
      }
      if (!ready && (engine.stats.draws > 0 || engine.stats.posterDraws > 0)) { ready = true; onReady(); }
    }, 0);
    return () => { off(); window.removeEventListener("resize", size); engine.dispose(); };
  }, [journey, mobile, still, rtRef, onReady]);
  return (
    <div className="xp-film" aria-hidden="true">
      <canvas ref={canvas} className="xp-film-canvas" />
      <div className="xp-film-vignette" />
    </div>
  );
}

"use client";

import { film } from "@/content/film";

type Props = {
  /**
   * gate = the glyph builds, then waits for a choice · leaving = the dip (glyph fades, backdrop stays) ·
   * clear = the flood has taken over (the overlay canvas draws the dark from T0) · fading = no WebGL: a plain fade.
   */
  mode: "gate" | "leaving" | "clear" | "fading";
  onChoose: (sound: boolean) => void;
};

/**
 * The opening's first movement: on near-black, four gold points whirl, gather into one, split to the tips of a
 * four-pointed star and bridge into the ✦ (the brand motif — not a logo). It holds there as the gate:
 * "Enter with sound" / "Enter in silence". Pure SVG + CSS, so it plays from the server-rendered HTML.
 */
export function Gate({ mode, onChoose }: Props) {
  return (
    <div className={`film-gate is-${mode}`} role="dialog" aria-label={film.gate.label}>
      <svg className="film-glyph" viewBox="-50 -50 100 100" aria-hidden="true">
        <defs>
          <filter id="film-goo" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
        <g filter="url(#film-goo)" className="film-glyph-fill">
          <g className="film-glyph-whirl">
            <circle cx="0" cy="-4.5" r="1.8" />
            <circle cx="4.5" cy="0" r="1.8" />
            <circle cx="0" cy="4.5" r="1.8" />
            <circle cx="-4.5" cy="0" r="1.8" />
          </g>
          <circle className="film-glyph-core" r="4.6" />
          <circle className="film-glyph-tip t-n" r="3.6" />
          <circle className="film-glyph-tip t-e" r="3.6" />
          <circle className="film-glyph-tip t-s" r="3.6" />
          <circle className="film-glyph-tip t-w" r="3.6" />
          <path className="film-glyph-star" d="M0,-30 C3.6,-3.6 3.6,-3.6 30,0 C3.6,3.6 3.6,3.6 0,30 C-3.6,3.6 -3.6,3.6 -30,0 C-3.6,-3.6 -3.6,-3.6 0,-30 Z" />
        </g>
      </svg>
      <div className="film-gate-fade">
      <div className="film-gate-choices">
        <button type="button" className="film-pill" disabled={mode !== "gate"} onClick={() => onChoose(true)}>
          <span aria-hidden="true" className="film-pill-dot" />
          {film.gate.withSound}
        </button>
        <button type="button" className="film-pill is-quiet" disabled={mode !== "gate"} onClick={() => onChoose(false)}>
          {film.gate.silent}
        </button>
      </div>
      </div>
    </div>
  );
}

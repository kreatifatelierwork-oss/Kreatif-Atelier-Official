"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { film } from "@/content/film";

export type HudHandle = {
  /** Film time in whole seconds since the film began (the real elapsed time). */
  setTime: (seconds: number) => void;
};

type Props = { visible: boolean; act: number; sound: boolean | null; onToggleSound: () => void };

const two = (n: number) => String(n).padStart(2, "0");

/**
 * The film's chrome (C2, C4): a top bar (the credit and the sound toggle) and one act bar with the act's name and
 * the real film time. No other readouts.
 */
export const Hud = forwardRef<HudHandle, Props>(function Hud({ visible, act, sound, onToggleSound }, ref) {
  const time = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    setTime(seconds) {
      if (time.current) time.current.textContent = `${two(Math.floor(seconds / 60))}:${two(seconds % 60)}`;
    },
  }));

  return (
    <div className={`film-hud ${visible ? "is-on" : ""}`}>
      <p className="film-hud-credit" aria-hidden="true"><span className="film-hud-star">✦</span> {film.credit}</p>
      <div className="film-hud-sound">
        {sound !== null && (
          <button type="button" className="film-hud-toggle" aria-pressed={sound} onClick={onToggleSound}>
            {sound ? film.sound.on : film.sound.off}
          </button>
        )}
      </div>
      <div className="film-actbar">
        <span>{film.actBar.act} {two(act)}</span>
        <span className="film-actbar-name">{film.acts[act]}</span>
        <span className="film-actbar-time">
          <span className="sr-only">{film.actBar.time} </span>
          <span ref={time}>00:00</span>
        </span>
      </div>
    </div>
  );
});

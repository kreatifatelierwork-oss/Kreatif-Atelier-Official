"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { film } from "@/content/film";

export type HudHandle = {
  set: (v: { tc: string; act: number; form: number; x: number; y: number; v: number; fps: number; particles: number; clock: string; levels: number[] }) => void;
};

type Props = { visible: boolean; sound: boolean | null; onToggleSound: () => void };

const pad = (n: number, w = 2) => String(Math.max(0, Math.round(n))).padStart(w, "0");

/**
 * The film's fine-print readouts (IBM Plex Mono). Every value is real: the film clock, the act and the Idea's form,
 * the visitor's own cursor, the renderer's frame rate and particle count, Hyderabad's local time and the live sound
 * level. Decorative for assistive tech (aria-hidden) except the sound toggle.
 */
export const Hud = forwardRef<HudHandle, Props>(function Hud({ visible, sound, onToggleSound }, ref) {
  const tc = useRef<HTMLSpanElement>(null);
  const act = useRef<HTMLSpanElement>(null);
  const form = useRef<HTMLSpanElement>(null);
  const cur = useRef<HTMLSpanElement>(null);
  const perf = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    set(v) {
      if (tc.current) tc.current.textContent = v.tc;
      if (act.current) act.current.textContent = `${film.hud.act} ${pad(v.act)} / 07 — ${film.acts[v.act]}`;
      if (form.current) form.current.textContent = `${film.hud.form} ${pad(v.form + 1)} / 07 — ${film.forms[v.form]}`;
      if (cur.current) cur.current.textContent = `${film.hud.cursor} X ${pad(v.x, 4)} · Y ${pad(v.y, 4)} · ${pad(v.v, 4)} px/s`;
      if (perf.current) perf.current.textContent = `${film.hud.fps} ${pad(v.fps)} · ${film.hud.particles} ${v.particles.toLocaleString("en-IN")}`;
      if (clock.current) clock.current.textContent = `${film.hud.city} ${v.clock} ${film.hud.timezone}`;
      v.levels.forEach((l, i) => { const b = bars.current[i]; if (b) b.style.transform = `scaleY(${0.12 + l * 0.88})`; });
    },
  }));

  return (
    <div className={`film-hud ${visible ? "is-on" : ""}`}>
      <p className="film-hud-credit" aria-hidden="true"><span className="film-hud-star">✦</span> {film.credit}</p>
      <div className="film-hud-sound">
        {sound !== null && (
          <button type="button" className="film-hud-toggle" aria-pressed={sound} onClick={onToggleSound}>
            <span className="film-hud-bars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <span key={i} ref={(el) => { bars.current[i] = el; }} />)}
            </span>
            {sound ? film.sound.on : film.sound.off}
          </button>
        )}
      </div>
      <div className="film-hud-read" aria-hidden="true">
        <span ref={act} />
        <span ref={form} />
        <span ref={cur} />
        <span ref={perf} />
      </div>
      <div className="film-hud-read is-right" aria-hidden="true">
        <span>TC <span ref={tc}>00:00:00:00</span></span>
        <span ref={clock} />
      </div>
    </div>
  );
});

"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { actNumeral, xp, type Act } from "@/content/experience";
import { film } from "@/content/film";
import { useUi } from "./journey";
import { route } from "./route";

export type ActBarHandle = { setTime: (seconds: number) => void };

type Props = { onJump: (place: number) => void; onToggleMode: () => void };

const two = (n: number) => String(n).padStart(2, "0");

/** The act and the place (C2): ["Act II", "Strategy", "The Drafting Hall"]. Set apart by space, not dots. */
export function actParts(act: Act, name: string): string[] {
  if (act === "credits") return [xp.credits, name];
  if (act === "post") return [xp.postCredits, name];
  return [`${xp.act} ${actNumeral(act)}`, film.acts[act], name];
}
/** For accessible names: "Act II, Strategy: The Drafting Hall". */
export function actLabel(act: Act, name: string) {
  const p = actParts(act, name);
  return p.length === 3 ? `${p[0]}, ${p[1]}: ${p[2]}` : `${p[0]}: ${p[1]}`;
}

/**
 * The act bar (C2): one hairline with a tick per place (each one jumps there), the current act and place, the real
 * film time, and Watch / Direct. The time is written by the loop through a ref, once a second.
 */
export const ActBar = forwardRef<ActBarHandle, Props>(function ActBar({ onJump, onToggleMode }, ref) {
  const place = useUi((s) => s.place);
  const mode = useUi((s) => s.mode);
  const time = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => ({
    setTime(sec) { if (time.current) time.current.textContent = `${two(Math.floor(sec / 60))}:${two(sec % 60)}`; },
  }));
  const p = route[place];
  return (
    <nav className="xp-actbar" aria-label={xp.sr.actBar}>
      <ol className="xp-ticks" aria-label={xp.sr.route}>
        {route.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className="xp-tick"
              aria-current={r.index === place ? "location" : undefined}
              aria-label={actLabel(r.act, r.name)}
              onClick={() => onJump(r.index)}
            />
          </li>
        ))}
      </ol>
      <p className="xp-actbar-row">
        <span className="xp-actbar-label" aria-live="polite">
          {actParts(p.act, p.name).map((t, i) => <span key={i} className={i === 2 || (i === 1 && typeof p.act !== "number") ? "is-place" : undefined}>{t}</span>)}
        </span>
        <button type="button" className="xp-mode" onClick={onToggleMode} aria-pressed={mode === "watch"}>
          {mode === "watch" ? film.modes.direct : film.modes.watch}
        </button>
        <span className="xp-actbar-time">
          <span className="sr-only">{xp.sr.filmTime} </span>
          <span ref={time}>00:00</span>
        </span>
      </p>
    </nav>
  );
});

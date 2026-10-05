"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { onFrame } from "@/components/film/loop";
import { film } from "@/content/film";
import { journey } from "@/content/journey";
import { experienceConfig as X } from "@/lib/experience";
import { useUi, type Runtime } from "./journey";
import { LAST, route } from "./route";

export type ActBarHandle = { setTime: (seconds: number) => void };

type Props = { rtRef: { current: Runtime }; onJump: (place: number) => void; onToggleMode: () => void };

const two = (n: number) => String(n).padStart(2, "0");

/** The journey trail: the camera's real altitude along the route, drawn as an elevation line (0..1 box). */
function trailPath() {
  const ys = X.camera.map((c) => c.pos[1]);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  const t = ys.map((y, i) => [i / Math.max(1, LAST), hi - lo < 1 ? 0.6 - Math.sin(i * 1.3) * 0.25 : 1 - Math.log1p(y - lo) / Math.log1p(hi - lo)] as const);
  return t.map(([x, y], i) => `${i ? "L" : "M"}${(x * 100).toFixed(2)} ${(y * 100).toFixed(2)}`).join(" ");
}

/**
 * The act bar (C2): one hairline across the bottom with the chapter and the real film time under it; the journey
 * trail rises from the corner as far as you have come. Each place has an invisible stop on the hairline (keyboard
 * and pointer jump there); Watch / Direct at the end.
 */
export const ActBar = forwardRef<ActBarHandle, Props>(function ActBar({ rtRef, onJump, onToggleMode }, ref) {
  const place = useUi((s) => s.place);
  const mode = useUi((s) => s.mode);
  const time = useRef<HTMLSpanElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => ({
    setTime(sec) { if (time.current) time.current.textContent = `${two(Math.floor(sec / 60))}:${two(sec % 60)}`; },
  }));
  useEffect(() => {
    let last = -1;
    return onFrame(() => {
      const k = Math.round((rtRef.current.s / LAST) * 2000) / 2000;
      if (k === last) return;
      last = k;
      trail.current?.style.setProperty("stroke-dashoffset", String(1 - k));
      dot.current?.style.setProperty("--k", String(k));
    }, 3);
  }, [rtRef]);
  const p = route[Math.min(place, LAST)];
  // The component is keyed on the journey, so this is computed once per journey.
  const [TRAIL_D] = useState(trailPath);
  return (
    <nav className="xp-actbar" aria-label={journey.sr.chapters}>
      <svg className="xp-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={TRAIL_D} className="xp-trail-all" pathLength={1} vectorEffect="non-scaling-stroke" />
        <path ref={trail} d={TRAIL_D} className="xp-trail-done" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="xp-hairline">
        <span ref={dot} className="xp-here" aria-hidden="true" />
        <ol className="xp-ticks">
          {route.map((r) => (
            <li key={r.id} style={{ left: `${(r.index / LAST) * 100}%` }}>
              <button
                type="button"
                className="xp-tick"
                aria-current={r.index === place ? "location" : undefined}
                aria-label={`${r.name}, ${r.index - route.findIndex((q) => q.chapter === r.chapter) + 1}`}
                onClick={() => onJump(r.index)}
              />
            </li>
          ))}
        </ol>
      </div>
      <p className="xp-actbar-row">
        <span className="xp-actbar-label" aria-live="polite">{p.name}</span>
        <span className="xp-actbar-time">
          <span className="sr-only">{journey.sr.filmTime} </span>
          <span ref={time}>00:00</span>
        </span>
        <button type="button" className="xp-mode" onClick={onToggleMode} aria-pressed={mode === "watch"}>
          {mode === "watch" ? film.modes.direct : film.modes.watch}
        </button>
      </p>
    </nav>
  );
});

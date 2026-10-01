"use client";

import { useEffect, useRef } from "react";
import { xp } from "@/content/experience";
import { experienceConfig as X } from "@/lib/config";
import { useUi } from "./journey";
import { route } from "./route";

type Props = { onJump: (place: number, thing?: string) => void; onClose: () => void };

/** Plan coordinates: the anchors seen from above (x → right, −z → up), fitted to a 400 × 300 box. */
const PLAN = (() => {
  const pts = X.anchors.slice(0, 8).map(([x, , z]) => [x, -z]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min(340 / (x1 - x0), 250 / (y1 - y0));
  return (i: number) => {
    const [x, y] = pts[Math.min(i, 7)];
    return [30 + (x - x0) * k, 275 - (y - y0) * k] as const;
  };
})();

/**
 * The Index: a floor plan of the Atelier (from the House of Light) with every place and a "you are here" dot, plus
 * the list of places and the rooms most people look for. Any choice is one click; the Index itself is the first.
 */
export function IndexPlan({ onJump, onClose }: Props) {
  const place = useUi((s) => s.place);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  const gallery = route.findIndex((p) => p.id === "gallery");
  const post = route.findIndex((p) => p.id === "post");
  // The roof, the gallery and post-credits share the atrium's footprint on the plan: list them, don't plot them.
  const plotted = route.filter((p) => p.index < 8);
  return (
    <div className="xp-index xp-panel" role="dialog" aria-modal="true" aria-label={xp.index} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className="xp-index-head">
        <p className="xp-label">{xp.index}</p>
        <button type="button" className="xp-link" onClick={onClose}>{xp.close}</button>
      </div>
      <div className="xp-index-body">
        <svg className="xp-plan" viewBox="0 0 400 300" role="img" aria-label={xp.sr.plan}>
          <polyline className="xp-plan-route" points={plotted.map((p) => PLAN(p.index).join(",")).join(" ")} />
          {plotted.map((p) => {
            const [x, y] = PLAN(p.index);
            return (
              <g key={p.id} className="xp-plan-room">
                <circle cx={x} cy={y} r={p.index === 0 ? 16 : 9} style={{ fill: p.colour ?? undefined }} className={p.colour ? "has-colour" : ""} />
                {p.index === place && <circle cx={x} cy={y} r={4} className="xp-plan-here"><title>{xp.sr.youAreHere}</title></circle>}
              </g>
            );
          })}
        </svg>
        <ul className="xp-index-list">
          {route.map((p, k) => (
            <li key={p.id}>
              <button ref={k === 0 ? first : undefined} type="button" aria-current={p.index === place ? "location" : undefined} onClick={() => onJump(p.index)}>
                {p.colour ? p.caption.title : p.id === "post" ? xp.postCredits : p.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="xp-index-list is-secondary">
          <li><button type="button" onClick={() => onJump(gallery, route[gallery].things.find((t) => t.room?.kind === "format")?.id)}>{xp.formats}</button></li>
          <li><button type="button" onClick={() => onJump(gallery)}>{xp.founders}</button></li>
          <li><button type="button" onClick={() => onJump(post)}>{xp.contact}</button></li>
        </ul>
      </div>
    </div>
  );
}

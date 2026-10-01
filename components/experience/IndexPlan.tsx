"use client";

import { useEffect, useRef } from "react";
import { about } from "@/content/about";
import { xp } from "@/content/experience";
import { film } from "@/content/film";
import { industriesIntro } from "@/content/industries";
import { experienceConfig as X } from "@/lib/config";
import { useUi } from "./journey";
import { aliases, route, unnumbered } from "./route";

type Props = { onJump: (place: number, thing?: string) => void; onClose: () => void; onWatch: () => void };

/** Plan coordinates: the places' anchors seen from above (x → right, −z → up), fitted to the plan box. */
const PLAN = (() => {
  const pts = X.anchors.slice(0, 8).map(([x, , z]) => [x, -z]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min(300 / (x1 - x0 || 1), 300 / (y1 - y0 || 1));
  return (i: number) => {
    const [x, y] = pts[Math.min(i, 7)];
    return [50 + (x - x0) * k, 330 - (y - y0) * k] as const;
  };
})();

const idx = (id: string) => route.findIndex((p) => p.id === id);
const thingLabel = (place: string, thing: string) => route[idx(place)].things.find((t) => t.id === thing)?.label ?? thing;

/** Sections people look for, each one click away (links shared as /#founders, /#pricing …). */
const SECTIONS: { label: string; alias: keyof typeof aliases }[] = [
  { label: unnumbered(about.marker), alias: "about" },
  { label: thingLabel("aurelius", "services"), alias: "services" },
  { label: thingLabel("aurelius", "engagement-models"), alias: "engagement-models" },
  { label: thingLabel("concourse", "how-we-work"), alias: "process" },
  { label: unnumbered(industriesIntro.marker), alias: "industries" },
  { label: thingLabel("roof", "vision"), alias: "vision" },
  { label: thingLabel("roof", "pillars"), alias: "pillars" },
  { label: thingLabel("roof", "our-ecosystem-serves"), alias: "serves" },
  { label: thingLabel("roof", "impact"), alias: "impact" },
  { label: thingLabel("gallery", "why-kreatif-atelier"), alias: "why-us" },
  { label: xp.founders, alias: "founders" },
  { label: xp.contact, alias: "contact" },
];

/**
 * The Index: a floor plan of the Atelier (from the House of Light) with a "you are here" dot, every place by name,
 * and the sections people look for. Any choice is one click; the Index itself is the first. Esc closes it, focus is
 * held inside while it is open and returns to the Index button on close.
 */
export function IndexPlan({ onJump, onClose, onWatch }: Props) {
  const place = useUi((s) => s.place);
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  const trap = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab" || !box.current) return;
    const f = box.current.querySelectorAll<HTMLElement>("button");
    const a = f[0], b = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  };
  const go = (alias: keyof typeof aliases) => {
    const a = aliases[alias];
    onJump(idx(a.place), a.thing);
  };
  const plotted = route.filter((p) => p.index < 8);
  const name = (p: (typeof route)[number]) => (p.colour ? p.caption.title : p.id === "post" ? xp.postCredits : p.name);
  return (
    <div ref={box} className="xp-index xp-panel" role="dialog" aria-modal="true" aria-label={xp.index} onKeyDown={trap}>
      <div className="xp-index-head">
        <p className="xp-label">{xp.index}</p>
        <button type="button" className="xp-link" onClick={onClose}>{xp.close}</button>
      </div>
      <div className="xp-index-body">
        <svg className="xp-plan" viewBox="0 0 400 380" role="img" aria-label={xp.sr.plan}>
          <polyline className="xp-plan-route" points={plotted.map((p) => PLAN(p.index).join(",")).join(" ")} />
          {plotted.map((p) => {
            const [x, y] = PLAN(p.index);
            return (
              <g key={p.id} className="xp-plan-room">
                <circle cx={x} cy={y} r={p.index === 0 ? 18 : 11} className={p.colour ? "has-colour" : ""} style={{ fill: p.colour ?? undefined }} />
                {(p.index === place || (place >= 8 && p.index === 0)) && (
                  <circle cx={x} cy={y} r={5} className="xp-plan-here"><title>{xp.sr.youAreHere}</title></circle>
                )}
              </g>
            );
          })}
        </svg>
        <nav aria-label={xp.sr.route}>
          <ol className="xp-index-list">
            {route.map((p, k) => (
              <li key={p.id}>
                <button ref={k === 0 ? first : undefined} type="button" aria-current={p.index === place ? "location" : undefined} onClick={() => onJump(p.index)}>
                  {name(p)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="xp-index-side">
          <ul className="xp-index-list is-secondary">
            {SECTIONS.map((s) => (
              <li key={s.alias}><button type="button" onClick={() => go(s.alias)}>{s.label}</button></li>
            ))}
          </ul>
          <button type="button" className="xp-btn" onClick={() => { onWatch(); onClose(); }}>{film.modes.watch}</button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { about } from "@/content/about";
import { c3 } from "@/content/experience";
import { film } from "@/content/film";
import { foundersIntro } from "@/content/founders";
import { industriesIntro } from "@/content/industries";
import { chapters, journey } from "@/content/journey";
import { processIntro } from "@/content/process";
import { contact } from "@/content/site";
import { holding, verticals } from "@/content/verticals";
import { whyIntro } from "@/content/why";
import { useUi } from "./journey";
import { chapterStart, route, unnumbered } from "./route";

type Props = { onJump: (place: number, thing?: string) => void; onClose: () => void; onWatch: () => void };

const idx = (id: string) => route.findIndex((p) => p.id === id);

/** Sections people look for, each one click away (their names from the content files). */
const SECTIONS: { label: string; place: string }[] = [
  { label: unnumbered(about.marker), place: "about" },
  { label: holding.labels.vision, place: "vision" },
  { label: holding.labels.pillars, place: "pillars" },
  { label: holding.labels.serves, place: "serves" },
  { label: holding.labels.impact, place: "impact" },
  { label: unnumbered(whyIntro.marker), place: "why-us" },
  { label: unnumbered(foundersIntro.marker), place: "founders" },
  { label: unnumbered(industriesIntro.marker), place: "industries" },
  { label: unnumbered(processIntro.marker), place: "process" },
  { label: unnumbered(contact.marker), place: "contact" },
];

/**
 * The Index: the twelve chapters, the sections people look for and the five company pages. Any choice is one click.
 * Esc closes it, focus is held inside while it is open and returns to the Index button on close.
 */
export function IndexPlan({ onJump, onClose, onWatch }: Props) {
  const place = useUi((s) => s.place);
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  const trap = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab" || !box.current) return;
    const f = box.current.querySelectorAll<HTMLElement>("button, a[href]");
    const a = f[0], b = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  };
  const chapter = route[place].chapter;
  return (
    <div ref={box} className="xp-index xp-panel" role="dialog" aria-modal="true" aria-label={journey.index} onKeyDown={trap}>
      <div className="xp-index-head">
        <p className="xp-label">{journey.index}</p>
        <button ref={first} type="button" className="xp-link" onClick={onClose}>{journey.close}</button>
      </div>
      <div className="xp-index-body">
        <nav aria-label={journey.sr.chapters}>
          <ol className="xp-index-list">
            {chapters.map((c, k) => (
              <li key={c}>
                <button type="button" aria-current={k === chapter ? "location" : undefined} onClick={() => onJump(chapterStart[k])}>
                  <span className="xp-index-n" aria-hidden="true">{String(k + 1).padStart(2, "0")}</span>{c}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="xp-index-side">
          <ul className="xp-index-list is-secondary">
            {SECTIONS.map((s) => (
              <li key={s.place}><button type="button" onClick={() => onJump(idx(s.place))}>{c3(s.label)}</button></li>
            ))}
          </ul>
          <ul className="xp-index-list is-secondary">
            {verticals.map((v) => (
              <li key={v.slug}><Link href={`/${v.slug}`}>{v.name}</Link></li>
            ))}
          </ul>
          <button type="button" className="xp-btn" onClick={() => { onWatch(); onClose(); }}>{film.modes.watch}</button>
        </div>
      </div>
    </div>
  );
}

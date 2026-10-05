"use client";

import { useEffect, useRef } from "react";
import { c3 } from "@/content/experience";
import { journey } from "@/content/journey";
import { servicesIntro } from "@/content/services";
import type { Room } from "./route";

/**
 * A field-guide page (X10): an explorer's journal sheet that unfolds over the scene for dense content and folds away
 * on Back (or Escape). Focus moves to its heading and is trapped inside while it is open.
 */
export function FieldGuide({ room, index, onBack }: { room: Room; index: number; onBack: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    head.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onBack(); return; }
      if (e.key !== "Tab" || !box.current) return;
      const f = box.current.querySelectorAll<HTMLElement>("button, a[href]");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [onBack]);
  return (
    <div ref={box} className="xp-guide" role="dialog" aria-modal="true" aria-labelledby="xp-guide-title">
      <div className="xp-guide-sheet">
        <p className="xp-guide-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
        <h2 id="xp-guide-title" ref={head} tabIndex={-1} className="xp-guide-title">{c3(room.kind === "text" ? room.title : room.service.title)}</h2>
        <span className="xp-guide-rule" aria-hidden="true" />
        {room.kind === "text" ? (
          <p className="xp-guide-body">{c3(room.body)}</p>
        ) : (
          <>
            <p className="xp-guide-tagline">{c3(room.service.tagline)}</p>
            <div className="xp-guide-cols">
              <section><h3>{servicesIntro.whatLabel}</h3><p>{c3(room.service.whatItIs)}</p></section>
              <section><h3>{servicesIntro.howLabel}</h3><p>{c3(room.service.howItWorks)}</p></section>
            </div>
            <ul className="xp-guide-features">
              {room.service.features.map((f) => <li key={f.title}><b>{c3(f.title)}</b><span>{c3(f.body)}</span></li>)}
            </ul>
          </>
        )}
        <button type="button" className="xp-btn" onClick={onBack}><span aria-hidden="true">‹</span> {journey.back}</button>
      </div>
    </div>
  );
}

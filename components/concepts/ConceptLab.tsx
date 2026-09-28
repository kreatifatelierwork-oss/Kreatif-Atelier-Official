"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { conceptLab } from "@/content/concepts";

// Each prototype is its own chunk (and its own canvas) — only the chosen one loads.
const concepts = {
  1: dynamic(() => import("./orrery/OrreryConcept"), { ssr: false }),
  2: dynamic(() => import("./production/ProductionConcept"), { ssr: false }),
  3: dynamic(() => import("./thread/ThreadConcept"), { ssr: false }),
} as const;

type ConceptId = keyof typeof concepts;

const readConcept = (): ConceptId => {
  const n = Number(new URLSearchParams(window.location.search).get("concept"));
  return n === 2 || n === 3 ? n : 1;
};
const noopSubscribe = () => () => {};

/** Prototype switcher: /concepts?concept=1|2|3 */
export function ConceptLab() {
  const id = useSyncExternalStore(noopSubscribe, readConcept, () => null);
  const [run, setRun] = useState(0);
  if (!id) return <div className="fixed inset-0 bg-ink" />;
  const Concept = concepts[id];

  return (
    <>
      <Concept key={run} />
      <nav
        aria-label={conceptLab.switcherLabel}
        className="fixed top-3 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 text-[11px] tracking-[0.14em] text-white/70 uppercase backdrop-blur-md"
      >
        {([1, 2, 3] as const).map((n) => (
          <a
            key={n}
            href={`?concept=${n}`}
            aria-current={n === id ? "page" : undefined}
            className="rounded-full px-3 py-1.5 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
          >
            {n} · {conceptLab.names[n]}
          </a>
        ))}
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full px-3 py-1.5 hover:text-white">
          ↺ {conceptLab.replay}
        </button>
      </nav>
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { conceptLab } from "@/content/concepts";
import { outfit } from "./fonts";
import { labHref, useLab, type ConceptId, type TypeStyle } from "./frame/useLab";

type ConceptProps = { type: TypeStyle };

// Each prototype is its own chunk (and its own canvas) — only the chosen one loads.
const concepts = {
  1: dynamic<ConceptProps>(() => import("./orrery/OrreryConcept"), { ssr: false }),
  2: dynamic<ConceptProps>(() => import("./production/ProductionConcept"), { ssr: false }),
  3: dynamic<ConceptProps>(() => import("./thread/ThreadConcept"), { ssr: false }),
} as const;

/** Prototype switcher: /concepts?concept=1|2|3&type=serif|sans */
export function ConceptLab() {
  const lab = useLab();
  const [run, setRun] = useState(0);
  if (!lab) return <div className="fixed inset-0 bg-ink" />;
  const Concept = concepts[lab.concept];

  return (
    <div data-type={lab.type} className={outfit.variable}>
      <Concept key={run} type={lab.type} />
      <nav
        aria-label={conceptLab.switcherLabel}
        className="fixed top-3 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/55 p-1 text-[10px] tracking-[0.14em] whitespace-nowrap text-white/70 uppercase backdrop-blur-md max-md:top-auto max-md:bottom-[4.2rem] max-md:scale-[0.86]"
      >
        {([1, 2, 3] as ConceptId[]).map((n) => (
          <a key={n} href={labHref(n, lab.type)} aria-current={n === lab.concept ? "page" : undefined}
            className="rounded-full px-2.5 py-1.5 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white">
            {n}<span className="max-md:hidden"> · {conceptLab.names[n]}</span>
          </a>
        ))}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-white/15" />
        <span className="px-1 text-white/40 max-md:hidden">{conceptLab.type.label}</span>
        {(["serif", "sans"] as const).map((t) => (
          <a key={t} href={labHref(lab.concept, t)} aria-current={t === lab.type ? "true" : undefined}
            className="rounded-full px-2.5 py-1.5 transition-colors hover:text-white aria-[current=true]:bg-gold/25 aria-[current=true]:text-gold-bright">
            {conceptLab.type[t]}
          </a>
        ))}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-white/15" />
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full px-2.5 py-1.5 hover:text-white">
          ↺<span className="max-md:hidden"> {conceptLab.replay}</span>
        </button>
      </nav>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { conceptLab, longTake } from "@/content/concepts";
import { outfit } from "./fonts";
import { labHref, useLab, type ConceptId, type PaletteId, type TypeStyle } from "./frame/useLab";

type ConceptProps = { type: TypeStyle; palette: PaletteId };

// Each prototype is its own chunk (and its own canvas) — only the chosen one loads.
const concepts = {
  1: dynamic<ConceptProps>(() => import("./orrery/OrreryConcept"), { ssr: false }),
  2: dynamic<ConceptProps>(() => import("./production/ProductionConcept"), { ssr: false }),
  3: dynamic<ConceptProps>(() => import("./thread/ThreadConcept"), { ssr: false }),
  4: dynamic<ConceptProps>(() => import("@/components/longtake/LongTake").then((m) => ({ default: ({ palette }: ConceptProps) => <m.LongTake paletteOverride={palette} /> })), { ssr: false }),
} as const;

/** Prototype switcher: /concepts?concept=1|2|3&type=serif|sans */
export function ConceptLab() {
  const lab = useLab();
  const [run, setRun] = useState(0);
  if (!lab) return <div className="fixed inset-0 bg-ink" />;
  const Concept = concepts[lab.concept];

  const four = lab.concept === 4;
  const names: Record<ConceptId, string> = { ...conceptLab.names, 4: longTake.name };

  return (
    <div data-type={four ? "sans" : lab.type} className={outfit.variable}>
      <Concept key={run} type={lab.type} palette={lab.palette} />
      <nav
        aria-label={conceptLab.switcherLabel}
        className={`fixed top-3 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full border p-1 text-[10px] tracking-[0.14em] whitespace-nowrap uppercase backdrop-blur-md max-md:top-auto max-md:bottom-[4.2rem] max-md:scale-[0.86] ${
          four && lab.palette === "a" ? "border-black/10 bg-white/60 text-black/60" : "border-white/10 bg-black/55 text-white/70"
        } ${four ? "max-md:bottom-[5.6rem]" : ""}`}
      >
        {([1, 2, 3, 4] as ConceptId[]).map((n) => (
          <a key={n} href={labHref(n, lab.type, lab.palette)} aria-current={n === lab.concept ? "page" : undefined}
            className="rounded-full px-2.5 py-1.5 transition-colors hover:opacity-100 aria-[current=page]:bg-current/15 aria-[current=page]:font-semibold">
            {n}<span className={n === lab.concept ? "max-md:hidden" : "hidden"}> · {names[n]}</span>
          </a>
        ))}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-current/20" />
        {four ? (
          <>
            <span className="px-1 opacity-50 max-md:hidden">{longTake.palette.label}</span>
            {(["a", "b"] as const).map((p) => (
              <a key={p} href={labHref(4, lab.type, p)} aria-current={p === lab.palette ? "true" : undefined}
                className="rounded-full px-2.5 py-1.5 aria-[current=true]:bg-current/15 aria-[current=true]:font-semibold">
                {longTake.palette[p]}
              </a>
            ))}
          </>
        ) : (
          <>
            <span className="px-1 opacity-50 max-md:hidden">{conceptLab.type.label}</span>
            {(["serif", "sans"] as const).map((t) => (
              <a key={t} href={labHref(lab.concept, t)} aria-current={t === lab.type ? "true" : undefined}
                className="rounded-full px-2.5 py-1.5 aria-[current=true]:bg-gold/25 aria-[current=true]:text-gold-bright">
                {conceptLab.type[t]}
              </a>
            ))}
          </>
        )}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-current/20" />
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full px-2.5 py-1.5">
          ↺<span className="max-md:hidden"> {conceptLab.replay}</span>
        </button>
      </nav>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { longTake } from "@/content/concepts";
import { founders } from "@/content/founders";

type Props = { open: boolean; reducedMotion: boolean; onClose: () => void };

/** The founders, as cut-out portraits on pearl cards (clean in both palettes); choose one to read the bio. */
export function FoundersPanel({ open, reducedMotion, onClose }: Props) {
  const [active, setActive] = useState(0);
  const f = founders[active];
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="founders" role="dialog" aria-modal="true" aria-labelledby="lt-founders-title"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.45 }}
          className="lt-glass absolute inset-0 z-40 overflow-y-auto px-[clamp(1.25rem,6vw,7rem)] py-[calc(var(--lt-inset)+3rem)]">
          <button type="button" autoFocus onClick={onClose} className="micro absolute top-[var(--lt-inset)] right-[var(--lt-inset)] opacity-70 hover:opacity-100">
            {longTake.foundersClose} <span aria-hidden="true">✕</span>
          </button>
          <h2 id="lt-founders-title" className="micro opacity-70">{longTake.founders}</h2>
          <ul className="mt-6 grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
            {founders.map((p, i) => (
              <li key={p.slug}>
                <motion.button type="button" onClick={() => setActive(i)} aria-pressed={i === active}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                  className={`lt-portrait group block w-full text-left transition-transform duration-500 ${i === active ? "is-active" : ""}`}>
                  <span className="relative block aspect-square overflow-hidden rounded-[6px]">
                    <Image src={p.cutout} alt="" width={640} height={640} sizes="(max-width: 768px) 45vw, 22vw"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                  </span>
                  <span className="headline mt-3 block text-[clamp(1rem,1.6vw,1.35rem)]">{p.name}</span>
                  <span className="micro mt-1 block text-[0.54rem] opacity-70">{p.role}</span>
                </motion.button>
              </li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            <motion.div key={f.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}
              className="mt-8 max-w-3xl" aria-live="polite">
              <p className="micro text-[0.56rem] opacity-70">{f.roleFull}</p>
              <p className="lt-statement mt-2 text-[clamp(1.05rem,1.5vw,1.35rem)] leading-snug">{f.bio}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

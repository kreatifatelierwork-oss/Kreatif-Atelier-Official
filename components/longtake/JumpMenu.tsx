"use client";

import { AnimatePresence, motion } from "framer-motion";
import { longTake } from "@/content/concepts";
import { verticals } from "@/content/verticals";
import { longTakeConfig as L } from "@/lib/config";
import { isVertical, REELS } from "./journey";
import { pad, reelName } from "./labels";

type Props = { open: boolean; reel: number; reducedMotion: boolean; onClose: () => void; onJump: (k: number) => void };

/** Every reel, one tap away. */
export function JumpMenu({ open, reel, reducedMotion, onClose, onJump }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="menu" role="dialog" aria-modal="true" aria-label={longTake.jumpLabel}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}
          className="lt-glass absolute inset-0 z-40 flex flex-col justify-center px-[clamp(1.25rem,8vw,9rem)]">
          <button type="button" onClick={onClose} className="micro absolute top-[var(--lt-inset)] right-[var(--lt-inset)] opacity-70 hover:opacity-100">
            {longTake.close} <span aria-hidden="true">✕</span>
          </button>
          <p className="micro opacity-50">{longTake.jumpLabel}</p>
          <ol className="mt-6 divide-y divide-[var(--lt-ink)]/10 border-y border-[var(--lt-ink)]/10">
            {Array.from({ length: REELS }, (_, k) => (
              <li key={k}>
                <motion.button type="button" autoFocus={k === reel} onClick={() => onJump(k)}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.04 * k, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex w-full items-center gap-5 py-3 text-left max-md:gap-3 max-md:py-2">
                  <span className="micro w-8 text-[0.6rem] opacity-50">{pad(k)}</span>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: L.worlds[k].accent }} />
                  <span className="headline flex-1 text-[clamp(1.3rem,3.2vw,2.6rem)] transition-transform duration-300 group-hover:translate-x-2">{reelName(k)}</span>
                  {isVertical(k) && <span className="micro text-right text-[0.56rem] opacity-55 max-md:hidden">{verticals[k - 1].tagline.join(" · ")}</span>}
                  {k === reel && <span className="micro text-[0.52rem] opacity-40 max-md:hidden">●</span>}
                </motion.button>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

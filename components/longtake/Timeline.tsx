"use client";

import { longTake } from "@/content/concepts";
import { longTakeConfig as L } from "@/lib/config";
import { isVertical, REELS } from "./journey";
import { pad, reelName } from "./labels";
import type { Palette } from "./Worlds";

type Props = {
  reel: number;
  palette: Palette;
  onJump: (k: number) => void;
  playheadRef: React.RefObject<HTMLDivElement | null>;
  tcRef: React.RefObject<HTMLSpanElement | null>;
};

/** The film's reel timeline — section index and navigation along the bottom edge. */
export function Timeline({ reel, palette, onJump, playheadRef, tcRef }: Props) {
  return (
    <nav aria-label={`${longTake.reel}s`} className="pointer-events-auto absolute right-[var(--lt-inset)] bottom-[var(--lt-inset)] left-[var(--lt-inset)]">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="micro text-[0.58rem]" aria-hidden="true">
          <span className="opacity-70">{longTake.reel} {pad(reel)} / {pad(REELS - 1)}</span>
          <span className="mx-2 opacity-25">—</span>
          <span style={{ color: palette === "a" && isVertical(reel) ? L.worlds[reel].accent : undefined }}>{reelName(reel)}</span>
        </p>
        <p className="micro text-[0.58rem] opacity-70" aria-hidden="true">
          <span className="max-md:hidden">TC </span><span ref={tcRef} className="tabular-nums">00:00:00:00</span>
        </p>
      </div>
      <ol className="relative grid grid-cols-8 gap-1.5">
        {Array.from({ length: REELS }, (_, k) => (
          <li key={k}>
            <button type="button" onClick={() => onJump(k)} aria-current={k === reel ? "step" : undefined}
              aria-label={`${longTake.reel} ${pad(k)}: ${reelName(k)}`} className="group block w-full py-2 text-left">
              <span className="block h-[3px] rounded-full transition-opacity duration-500" style={{ background: L.worlds[k].accent, opacity: k === reel ? 1 : 0.28 }} />
              <span className={`micro mt-2 block truncate text-[0.56rem] transition-opacity max-md:hidden ${k === reel ? "opacity-100" : "opacity-70 group-hover:opacity-80"}`}>
                {pad(k)} · {reelName(k)}
              </span>
            </button>
          </li>
        ))}
        <div ref={playheadRef} aria-hidden="true" className="pointer-events-none absolute top-[3px] h-3 w-px -translate-x-1/2 bg-[var(--lt-ink)]" />
      </ol>
    </nav>
  );
}

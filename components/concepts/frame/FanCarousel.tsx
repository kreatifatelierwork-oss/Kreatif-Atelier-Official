"use client";

import { useEffect, useRef } from "react";
import { frame } from "@/content/concepts";
import { conceptConfig } from "@/lib/config";

export type FanItem = { id: string; label: string; visual: React.ReactNode };

type Props = {
  ariaLabel: string;
  items: FanItem[];
  index: number;
  onIndex: (i: number) => void;
  eyebrow?: string;
  title: string;
  body: string;
  action: { label: string; onClick: () => void };
  reducedMotion: boolean;
};

const C = conceptConfig.carousel;

/** Shortest signed distance on a ring, so the carousel always has a neighbour on each side. */
const ringOffset = (i: number, current: number, n: number) => {
  let d = (i - current) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};

/**
 * TURA screen .02 — a fanned, depth-layered carousel. Centre card large and sharp; neighbours rotated
 * toward it in perspective, recessed, dimmed and blurred; the title overlaps the centre card's bottom edge,
 * then a short centred paragraph and a small pill button.
 */
export function FanCarousel({ ariaLabel, items, index, onIndex, eyebrow, title, body, action, reducedMotion }: Props) {
  const n = items.length;
  const drag = useRef<number | null>(null);
  const go = (delta: number) => onIndex((index + delta + n) % n);
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  // Arrow keys work whenever the carousel is on screen (there is only ever one).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goRef.current(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goRef.current(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const ease = reducedMotion ? "none" : `transform ${C.durationMs}ms cubic-bezier(0.22,1,0.36,1), filter ${C.durationMs}ms ease, opacity ${C.durationMs}ms ease`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="relative flex w-full flex-col items-center"
    >
      {eyebrow && <p className="micro mb-7 text-[0.6rem] text-gold">{eyebrow}</p>}
      <div
        className="relative h-[calc(var(--card-w)*0.9)] w-full touch-pan-y [--card-w:clamp(15rem,27vw,25rem)] [perspective:1600px] max-md:[--card-w:62vw]"
        onPointerDown={(e) => { drag.current = e.clientX; }}
        onPointerUp={(e) => {
          if (drag.current === null) return;
          const dx = e.clientX - drag.current;
          drag.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {items.map((item, i) => {
          const d = ringOffset(i, index, n);
          const side = Math.sign(d);
          const near = Math.abs(d) === 1;
          const hidden = Math.abs(d) > 1;
          const transform =
            d === 0
              ? "translateX(-50%) translateZ(0) rotateY(0deg) scale(1)"
              : `translateX(calc(-50% + ${side * (hidden ? 175 : 86)}%)) translateY(4%) translateZ(${-C.sideRecess}px) rotateY(${-side * C.sideRotate}deg) scale(${C.sideScale})`;
          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}: ${item.label}`}
              aria-hidden={d !== 0}
              onClick={() => { if (d !== 0) onIndex(i); }}
              className={`float-shadow absolute top-0 left-1/2 aspect-[10/9] w-[var(--card-w)] overflow-hidden rounded-[3px] border border-white/10 bg-[#0b0e16] ${d === 0 ? "" : "cursor-pointer"}`}
              style={{
                transform,
                transition: ease,
                zIndex: d === 0 ? 3 : near ? 2 : 1,
                opacity: hidden ? 0 : 1,
                filter: d === 0 ? "none" : `blur(${C.sideBlur}px) brightness(${C.sideBrightness})`,
                pointerEvents: hidden ? "none" : "auto",
              }}
            >
              {item.visual}
            </div>
          );
        })}

        <button type="button" onClick={() => go(-1)} aria-label={frame.prev}
          className="absolute top-1/2 left-[max(1rem,calc(50%-var(--card-w)*1.3))] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-cream-muted transition-colors hover:border-gold hover:text-gold-bright max-md:hidden">←</button>
        <button type="button" onClick={() => go(1)} aria-label={frame.next}
          className="absolute top-1/2 right-[max(1rem,calc(50%-var(--card-w)*1.3))] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-cream-muted transition-colors hover:border-gold hover:text-gold-bright max-md:hidden">→</button>
      </div>

      {/* Title overlapping the centre card's bottom edge, then paragraph and pill. */}
      <div aria-live="polite" className="relative z-10 -mt-[0.42em] text-center text-[clamp(2.3rem,5.2vw,5.4rem)]">
        <h2 className="headline text-cream [text-shadow:0_18px_36px_rgb(0_0_0/0.7)]">{title}</h2>
      </div>
      <p className="mt-6 max-w-[34rem] px-6 text-center text-[0.86rem] leading-[1.9] text-cream-muted">{body}</p>
      <button type="button" onClick={action.onClick}
        className="micro float-shadow mt-7 rounded-full border border-white/10 bg-[#0d1019] px-7 py-3.5 text-[0.62rem] text-cream transition-colors hover:border-gold/60 hover:text-gold-bright">
        {action.label}
      </button>
    </section>
  );
}

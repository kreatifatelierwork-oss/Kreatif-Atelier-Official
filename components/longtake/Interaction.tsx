"use client";

import { useEffect, useRef } from "react";
import { longTake } from "@/content/concepts";
import { completeWorld, spark, tapBridge, type PlayState } from "./play";

type Props = {
  world: 1 | 2 | 3 | 4 | 5 | number;
  playRef: React.RefObject<PlayState>;
  fillRef: React.RefObject<HTMLSpanElement | null>;
  done: boolean;
  reducedMotion: boolean;
};

/**
 * The world's playful interaction as one accessible pill: hold (pointer, Space/Enter held) or tap.
 * A click without a pointer (screen readers, keyboard click) or reduced motion completes it at once.
 */
export function Interaction({ world, playRef, fillRef, done, reducedMotion }: Props) {
  const cfg = longTake.play[world as 1 | 2 | 3 | 4 | 5];
  const labelRef = useRef<HTMLSpanElement>(null);
  const hold = cfg.kind === "hold";

  // Release on unmount (e.g. travelling away mid-hold).
  useEffect(() => () => { playRef.current.holding = false; }, [playRef]);

  // Asraya narrates the breath while you hold.
  useEffect(() => {
    if (world !== 5 || !("inhale" in cfg)) return;
    let frame = 0;
    const tick = () => {
      const p = playRef.current;
      if (labelRef.current && !done) {
        labelRef.current.textContent = p.holding ? cfg.inhale : p.breath > 0.05 ? cfg.exhale : cfg.idle;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [world, cfg, playRef, done]);

  const press = (on: boolean) => { playRef.current.holding = on; };

  return (
    <button
      type="button"
      className="micro lt-pill absolute bottom-[calc(var(--lt-inset)+4.6rem)] left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-full px-7 py-3 whitespace-nowrap max-md:bottom-[7.2rem] max-md:py-2.5"
      onPointerDown={hold ? (e) => { e.currentTarget.setPointerCapture(e.pointerId); press(true); } : undefined}
      onPointerUp={hold ? () => press(false) : undefined}
      onPointerCancel={hold ? () => press(false) : undefined}
      onKeyDown={hold ? (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); press(true); } } : undefined}
      onKeyUp={hold ? (e) => { if (e.key === " " || e.key === "Enter") press(false); } : undefined}
      onClick={(e) => {
        const p = playRef.current;
        if (reducedMotion || (hold && e.detail === 0)) { completeWorld(p, world); return; }
        if (world === 2) tapBridge(p, performance.now() / 1000);
        if (world === 4) spark(p, performance.now() / 1000);
      }}
      aria-pressed={done}
    >
      <span ref={fillRef} aria-hidden="true" className="absolute inset-y-0 left-0 bg-[var(--lt-accent)] opacity-25" />
      <span ref={labelRef} className="relative">{done ? `✓ ${cfg.done}` : cfg.idle}</span>
    </button>
  );
}

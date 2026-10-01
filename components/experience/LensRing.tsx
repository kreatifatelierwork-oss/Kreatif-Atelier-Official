"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/components/film/loop";
import type { FilmState } from "@/components/film/state";
import { interaction } from "./actions";
import { useUi, type Runtime } from "./journey";

/**
 * The Lens's ring (DESIGN.md): a 220px circle with a 1px hairline, no glow, fill or shadow. Inside it the scene
 * shows the Drafting Hall already built; it follows the pointer there until the hall has built itself.
 */
export function LensRing({ rtRef, filmRef }: { rtRef: { current: Runtime }; filmRef: { current: FilmState } }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => onFrame(() => {
    const d = el.current;
    if (!d) return;
    const p = filmRef.current.pointer;
    const on = Math.abs(rtRef.current.s - 2) < 0.35 && interaction.built < 1 && p.active && !useUi.getState().room;
    d.style.opacity = on ? "1" : "0";
    if (on) d.style.transform = `translate3d(${p.x - 110}px, ${p.y - 110}px, 0)`;
  }, 2), [rtRef, filmRef]);
  return <div ref={el} className="xp-lens" aria-hidden="true" />;
}

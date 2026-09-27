"use client";

import { createStore } from "zustand/vanilla";
import { sculptureVariants } from "@/lib/config";

/** Where the sculpture should sit, measured from the DOM (`[data-hero-anchor]`) with the page at the top. */
export type HeroAnchor = { cx: number; cy: number; width: number; height: number; vw: number; vh: number };

type StageState = {
  anchor: HeroAnchor | null;
  /** Total scrollable distance, so progress can be converted back to px of travel. */
  maxScroll: number;
};

/** DOM → 3D layout facts, updated on resize / ScrollTrigger refresh (never per frame). */
export const stageStore = createStore<StageState>()(() => ({ anchor: null, maxScroll: 1 }));

export function measureHeroAnchor() {
  const el = visibleHeroAnchor();
  if (!el) return;
  const r = el.getBoundingClientRect();
  const top = r.top + window.scrollY;
  stageStore.setState({
    anchor: {
      cx: r.left + r.width / 2,
      cy: top + r.height / 2,
      width: r.width,
      height: r.height,
      vw: window.innerWidth,
      vh: window.innerHeight,
    },
    maxScroll: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
  });
}

/** There is one anchor per layout (desktop / mobile); use whichever is displayed. */
export function visibleHeroAnchor() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-hero-anchor]")).find(
    (el) => el.getClientRects().length > 0,
  );
}

export type SculptureId = keyof typeof sculptureVariants;

/** `?sculpture=1|2|3` picks the study; defaults to 1. */
export function sculptureFromUrl(): SculptureId {
  const value = Number(new URLSearchParams(window.location.search).get("sculpture"));
  return value === 2 || value === 3 ? value : 1;
}

"use client";

import { useSyncExternalStore } from "react";

export type ConceptId = 1 | 2 | 3 | 4;
export type TypeStyle = "serif" | "sans";
export type PaletteId = "a" | "b";

const noopSubscribe = () => () => {};

/** `/concepts?concept=1|2|3|4&type=serif|sans&palette=a|b` — read once on the client. */
export function useLab(): { concept: ConceptId; type: TypeStyle; palette: PaletteId } | null {
  const raw = useSyncExternalStore(noopSubscribe, () => window.location.search, () => null);
  if (raw === null) return null;
  const params = new URLSearchParams(raw);
  const n = Number(params.get("concept"));
  return {
    concept: n === 2 || n === 3 || n === 4 ? n : 1,
    type: params.get("type") === "sans" ? "sans" : "serif",
    palette: params.get("palette") === "b" ? "b" : "a",
  };
}

export const labHref = (concept: ConceptId, type: TypeStyle, palette?: PaletteId) =>
  concept === 4 ? `?concept=4&palette=${palette ?? "a"}` : `?concept=${concept}&type=${type}`;

"use client";

import { useSyncExternalStore } from "react";

export type ConceptId = 1 | 2 | 3;
export type TypeStyle = "serif" | "sans";

const noopSubscribe = () => () => {};

/** `/concepts?concept=1|2|3&type=serif|sans` — read once on the client. */
export function useLab(): { concept: ConceptId; type: TypeStyle } | null {
  const raw = useSyncExternalStore(noopSubscribe, () => window.location.search, () => null);
  if (raw === null) return null;
  const params = new URLSearchParams(raw);
  const n = Number(params.get("concept"));
  return {
    concept: n === 2 || n === 3 ? n : 1,
    type: params.get("type") === "sans" ? "sans" : "serif",
  };
}

export const labHref = (concept: ConceptId, type: TypeStyle) => `?concept=${concept}&type=${type}`;

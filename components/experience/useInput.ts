"use client";

import { useEffect } from "react";
import { experienceConfig as X } from "@/lib/config";
import { jumpTo, nudge, useUi, type Runtime } from "./journey";
import { LAST } from "./route";

/**
 * Travel input: wheel and trackpad, a vertical swipe, and keys (arrows / Page keys / Home / End step between places;
 * L plays, K pauses, J steps back like an editor's shuttle). Ignored while the gate, the Index or a room is open, and
 * inside scrollable panels.
 */
export function useInput(rtRef: { current: Runtime }, reduced: boolean) {
  useEffect(() => {
    const blocked = (target: EventTarget | null) => {
      const ui = useUi.getState();
      if (ui.phase !== "live" || ui.indexOpen || ui.room) return true;
      return target instanceof Element && !!target.closest(".xp-panel");
    };
    const onWheel = (e: WheelEvent) => {
      if (blocked(e.target)) return;
      const px = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      nudge(rtRef.current, px / X.wheelPerPlace, performance.now());
      useUi.getState().set({ mode: "direct" });
    };
    let ty: number | null = null;
    const onTouchStart = (e: TouchEvent) => { ty = blocked(e.target) ? null : e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (ty == null || blocked(e.target)) return;
      const y = e.touches[0].clientY;
      nudge(rtRef.current, (ty - y) / X.touchPerPlace, performance.now());
      useUi.getState().set({ mode: "direct" });
      ty = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (blocked(e.target)) return;
      const rt = rtRef.current;
      const now = performance.now();
      const here = Math.round(rt.move ? rt.move.to : rt.s);
      const go = (p: number) => { e.preventDefault(); rt.mode = "direct"; useUi.getState().set({ mode: "direct" }); jumpTo(rt, p, now, reduced); };
      switch (e.key) {
        case "ArrowDown": case "ArrowRight": case "PageDown": return go(Math.min(LAST, here + 1));
        case "ArrowUp": case "ArrowLeft": case "PageUp": return go(Math.max(0, here - 1));
        case "Home": return go(0);
        case "End": return go(LAST);
        case "j": case "J": return go(Math.max(0, here - 1));
        case "k": case "K": rt.mode = "direct"; useUi.getState().set({ mode: "direct" }); return;
        case "l": case "L": rt.mode = "watch"; useUi.getState().set({ mode: "watch" }); return;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [rtRef, reduced]);
}

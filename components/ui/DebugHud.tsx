"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { scrollStore } from "@/lib/scroll/store";

const noopSubscribe = () => () => {};

/**
 * Add `?debug` to the URL: a live readout of the scroll pipeline (what the 3D scene will read).
 * Updates through a ref every frame — never re-renders React.
 */
export function DebugHud() {
  const enabled = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).has("debug"),
    () => false,
  );
  const outRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let frames = 0;
    let fps = 0;
    let last = performance.now();

    const loop = (now: number) => {
      frames++;
      if (now - last >= 500) {
        fps = Math.round((frames * 1000) / (now - last));
        frames = 0;
        last = now;
      }
      const s = scrollStore.getState();
      const range = s.sectionRanges.find((r) => r.id === s.activeSection);
      const local = range ? (s.progress - range.start) / Math.max(1e-6, range.end - range.start) : 0;
      if (outRef.current) {
        outRef.current.textContent = [
          `fps        ${fps}`,
          `progress   ${(s.progress * 100).toFixed(2)}%`,
          `scrollY    ${Math.round(s.scrollY)}px`,
          `velocity   ${Math.round(s.velocity)}px/s`,
          `section    ${s.activeSection}  (${(Math.min(1, Math.max(0, local)) * 100).toFixed(0)}%)`,
          `pin svc    ${(s.pins.services * 100).toFixed(1)}%`,
          `pin proc   ${(s.pins.process * 100).toFixed(1)}%`,
          `lenis      ${s.smooth ? "on" : "off"}${s.reducedMotion ? "  · reduced motion" : ""}`,
          "",
          ...s.sectionRanges.map(
            (r) => `${r.id === s.activeSection ? "▸" : " "} ${r.id.padEnd(11)}${r.start.toFixed(3)}–${r.end.toFixed(3)}`,
          ),
        ].join("\n");
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <pre
      ref={outRef}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-3 left-3 z-[80] min-w-[16rem] rounded border border-gold/30 bg-ink/85 p-3 font-mono text-[11px] leading-[1.45] text-gold-bright"
    />
  );
}

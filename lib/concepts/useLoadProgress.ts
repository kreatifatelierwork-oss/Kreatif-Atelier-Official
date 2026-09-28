"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Loader progress for the prototypes: climbs to 90% over `minMs` (a designed minimum so the loader
 * moment reads), then finishes only once `ready` is true (shaders compiled / first frames drawn).
 * Returns 0–1. Reduced motion: jumps straight to ready.
 */
export function useLoadProgress(ready: boolean, minMs: number, reducedMotion: boolean) {
  const [progress, setProgress] = useState(0);
  const readyRef = useRef(ready);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (reducedMotion ? 1 : minMs));
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress((p) => {
        const target = readyRef.current && t >= 1 ? 1 : eased * 0.9;
        return Math.max(p, p + (target - p) * 0.12);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [minMs, reducedMotion]);

  return progress > 0.995 ? 1 : progress;
}

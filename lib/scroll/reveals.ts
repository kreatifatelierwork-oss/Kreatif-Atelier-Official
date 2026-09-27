"use client";

import { config } from "@/lib/config";
import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Section text reveals.
 * - `[data-reveal]`: fades and rises in, batched so neighbours stagger.
 * - `[data-reveal-lines]`: headline lines slide up from behind a mask (SplitText keeps an aria-label).
 * Only elements still below the fold are hidden, so nothing already on screen ever flashes
 * away, and without JavaScript everything is simply visible.
 */
export function createReveals() {
  const { start, distance, duration, stagger, lineDuration, lineStagger } = config.reveal;
  const threshold = window.innerHeight * 0.88;
  const belowFold = (el: HTMLElement) => el.getBoundingClientRect().top > threshold;

  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(belowFold);
  gsap.set(blocks, { autoAlpha: 0, y: distance });
  const blockTriggers = ScrollTrigger.batch(blocks, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration, stagger, ease: "expo.out", overwrite: true }),
  });

  const splits = gsap.utils
    .toArray<HTMLElement>("[data-reveal-lines]")
    .filter(belowFold)
    .map((el) => {
      let done = false;
      return SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "reveal-line",
        aria: "auto",
        autoSplit: true,
        // Re-splits on resize / font load; only animate the first time.
        onSplit: (self) => {
          if (done) return;
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: lineDuration,
            stagger: lineStagger,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
            onComplete: () => {
              done = true;
            },
          });
        },
      });
    });

  return () => {
    blockTriggers.forEach((t) => t.kill());
    splits.forEach((s) => s.revert());
    gsap.set(blocks, { clearProps: "opacity,visibility,transform" });
  };
}

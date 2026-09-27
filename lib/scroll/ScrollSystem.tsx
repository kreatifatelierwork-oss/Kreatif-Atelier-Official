"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { config } from "@/lib/config";
import { gsap, ScrollTrigger } from "./gsap";
import { documentTop, flowElement, scrollToHash, setLenis } from "./lenis";
import { createReveals } from "./reveals";
import { scrollStore, type SectionRange } from "./store";

type PxRange = { id: string; top: number; bottom: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll pipeline, mounted once:
 *   Lenis (smooth wheel) → gsap.ticker drives lenis.raf → lenis 'scroll' → ScrollTrigger.update
 *   → master trigger onUpdate → zustand store { progress, velocity, activeSection, … } → consumers.
 * With reduced motion Lenis is skipped and native scrolling feeds the same store.
 */
export function ScrollSystem() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    scrollStore.setState({ reducedMotion, smooth: !reducedMotion });

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({
        autoRaf: false,
        lerp: config.scroll.lerp,
        wheelMultiplier: config.scroll.wheelMultiplier,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    // ── Section ranges: measured after every ScrollTrigger refresh (pins change the layout).
    let pxRanges: PxRange[] = [];
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      pxRanges = Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).map((el) => {
        const top = documentTop(el);
        return { id: el.id, top, bottom: top + flowElement(el).offsetHeight };
      });
      const sectionRanges: SectionRange[] = pxRanges.map((r) => ({
        id: r.id,
        start: clamp01(r.top / max),
        end: clamp01(r.bottom / max),
      }));
      scrollStore.setState({ sectionRanges });
    };

    const activeAt = (scrollY: number) => {
      const centre = scrollY + window.innerHeight / 2;
      let active = pxRanges[0]?.id ?? "home";
      for (const r of pxRanges) if (centre >= r.top) active = r.id;
      return active;
    };

    // ── Master trigger: the whole page, refreshed last so pin spacing is already in place.
    const master = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -100,
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const activeSection = activeAt(scrollY);
        const state = scrollStore.getState();
        scrollStore.setState({
          progress: self.progress,
          scrollY,
          velocity: self.getVelocity(),
          ...(activeSection !== state.activeSection && { activeSection }),
        });
      },
    });

    const onRefresh = () => {
      measure();
      const scrollY = window.scrollY;
      scrollStore.setState({ progress: master.progress, scrollY, activeSection: activeAt(scrollY) });
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // ── Deep links (/#founders): the browser jumps before pins add their scroll length, so jump
    // again once everything is measured — unless the visitor has already started scrolling.
    ScrollTrigger.clearScrollMemory("manual");
    const initialHash = window.location.hash;
    let userScrolled = false;
    const markUserScroll = () => {
      userScrolled = true;
    };
    const intentEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    intentEvents.forEach((type) => window.addEventListener(type, markUserScroll, { passive: true }));
    const jumpToInitialHash = () => {
      const target = initialHash.length > 1 ? document.querySelector<HTMLElement>(initialHash) : null;
      if (!target || userScrolled) return;
      const top = documentTop(target);
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo(0, top);
    };

    ScrollTrigger.refresh();
    jumpToInitialHash();
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      jumpToInitialHash();
    });

    // Reveals are set up after the jump so only content genuinely below the fold starts hidden.
    const destroyReveals = reducedMotion ? () => {} : createReveals();

    // ── In-page anchors: smooth scroll + focus management for every a[href^="#"].
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      scrollToHash(link.getAttribute("href") ?? "#");
    };
    window.addEventListener("click", onClick);

    return () => {
      intentEvents.forEach((type) => window.removeEventListener(type, markUserScroll));
      window.removeEventListener("click", onClick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      destroyReveals();
      master.kill();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return null;
}

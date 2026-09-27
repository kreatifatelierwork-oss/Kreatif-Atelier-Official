"use client";

import type Lenis from "lenis";
import { config } from "@/lib/config";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/** Pinned sections live inside a GSAP pin-spacer; measure that (it stays in flow) rather than the pinned node. */
export function flowElement(el: HTMLElement): HTMLElement {
  const parent = el.parentElement;
  return parent?.classList.contains("pin-spacer") ? parent : el;
}

/** Document-space top of an element, correct even while it is pinned. */
export function documentTop(el: HTMLElement) {
  return flowElement(el).getBoundingClientRect().top + window.scrollY;
}

/**
 * Scroll to an in-page anchor ("#services"), move focus there for keyboard and screen-reader
 * users, and update the URL. Uses Lenis when it is running, a native jump otherwise.
 */
export function scrollToHash(hash: string) {
  const target = hash === "#" ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const top = hash === "#home" || hash === "#" ? 0 : documentTop(target);
  const focusTarget = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  if (instance) {
    instance.scrollTo(top, {
      duration: config.scroll.anchorDuration,
      easing: config.scroll.anchorEase,
      onComplete: focusTarget,
    });
  } else {
    window.scrollTo({ top, behavior: "auto" });
    focusTarget();
  }
  history.pushState(null, "", hash);
}

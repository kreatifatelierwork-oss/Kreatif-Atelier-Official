/**
 * Every tunable visual value lives here so it can be tweaked without touching components.
 * Camera keyframes, particle counts and quality tiers are added in Phases 3–5.
 */
export const config = {
  /** Width (px) below which the mobile layout, native scrolling and reduced 3D apply. */
  mobileBreakpoint: 768,
  /** Founder card hover tilt, in degrees (Phase 1 uses CSS only; lerped tilt comes later). */
  founderTiltDeg: 6,

  scroll: {
    /** Lenis smoothing: lower = floatier, higher = snappier (0–1). */
    lerp: 0.085,
    wheelMultiplier: 1,
    /** Anchor jumps (nav links) — seconds, and the easing curve. */
    anchorDuration: 1.6,
    anchorEase: (t: number) => 1 - Math.pow(1 - t, 4),
    /** Past this many px the nav turns solid and the back-to-top button appears. */
    navSolidAfter: 40,
    backToTopAfter: 600,
  },

  reveal: {
    /** Where an element's top must reach (from the viewport top) before it reveals. */
    start: "top 88%",
    distance: 28,
    duration: 1.1,
    stagger: 0.08,
    /** Headline lines slide up from behind a mask. */
    lineDuration: 1.25,
    lineStagger: 0.1,
  },

  pin: {
    /**
     * When the Services / Process sections pin. Must match the `pin:` variant in globals.css.
     * Pins need room: wide and tall enough (a tighter layout applies from 620–759px tall),
     * and no reduced-motion preference.
     */
    query: "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
    /** Scroll distance per px of horizontal card travel in Services (1 = one-to-one). */
    servicesScrollRatio: 1.15,
    /** Scroll distance per Process step, in viewport heights. */
    processStepVh: 0.55,
  },
} as const;

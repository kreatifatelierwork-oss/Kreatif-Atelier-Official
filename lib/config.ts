/**
 * Every tunable visual value lives here so it can be tweaked without touching components.
 * Scroll, camera keyframes, particle counts and quality tiers are added in Phases 2–3.
 */
export const config = {
  /** Width (px) below which the mobile layout, native scrolling and reduced 3D apply. */
  mobileBreakpoint: 768,
  /** Founder card hover tilt, in degrees (Phase 1 uses CSS only; lerped tilt comes later). */
  founderTiltDeg: 6,
} as const;

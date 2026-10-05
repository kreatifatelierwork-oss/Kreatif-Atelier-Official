/**
 * Stage 5 — "The Making of a Legacy" (the film). Opening timings follow buttermax.net's measured rhythm
 * (docs/research/buttermax.md), fitted to our story; the cursor ink is our own GPU fluid tuned to the same feel.
 */
export const filmConfig = {
  palettes: {
    /** a = Luminous (default, neutral light, C1), b = Cinema. `dark` is the loader / dip colour. Tokens: DESIGN.md. */
    a: { page: "#F4F5F7", text: "#0B0F1A", muted: "#5A5E6A", gold: "#C9A45C", goldBright: "#DDB978", dark: "#0B0F1A" },
    b: { page: "#10142A", text: "#F3EBDD", muted: "#A9A6B4", gold: "#C9A45C", goldBright: "#EACB8C", dark: "#04050A" },
  },
  /** Gold tones the Idea's particles pass through as they materialise (outside the verticals' worlds gold is the
   *  only accent, C5/C8). */
  ghost: ["#C9A45C", "#DDB978", "#B38E45", "#E8C98A", "#A8812F"],
  opening: {
    /** ✦ glyph build: whirl → dot → split → bridge (ms from first paint); the gate appears after `gateAt`. */
    glyphMs: 1800,
    gateAt: 1900,
    /** After a choice: the glyph fades (dip), holds dark, then the flood starts (T0). */
    dipMs: 350,
    dipHoldMs: 150,
    /** Flood transition 0→1. Screen is fully the page colour at ~0.60 s, dots gone by ~0.72 s (as measured). */
    floodMs: 1000,
    /** The page's zoom-forward runs a little quicker than the flood. */
    zoomMs: 760,
    /** The page zooms forward and straightens during the flood. */
    pageFromScale: 0.6,
    pageFromRotateDeg: -6,
    /** Beats after T0 (ms). The Idea rises + materialises, then "Atelier" is written on. */
    ideaRiseAt: 720,
    ideaRiseMs: 400,
    writeAt: 1070,
    writeMs: 850,
    hudAt: 1900,
    /** Halftone lattice spacing as a fraction of the viewport height; flood rim width (0–1 of the field). */
    dotSpacing: 1 / 15,
    rimWidth: 0.16,
  },
  ink: {
    /**
     * Tuned against buttermax.net with identical scripted strokes (docs/research/buttermax.md, "Ink comparison 2").
     * Velocity grid cells on the short side; ink texture as a share of device pixels (capped); pressure iterations.
     */
    simRes: { desktop: 128, mobile: 80 },
    dyeScale: 0.5,
    dyeMax: { desktop: 1024, mobile: 640 },
    iterations: { desktop: 10, mobile: 6 },
    /** Fixed solver step (s) and per-step retention (velocity keeps flowing, ink fades over ~1 s). */
    step: 1 / 60,
    velocityKeep: 0.985,
    dyeKeep: 0.95,
    pressureKeep: 0.8,
    /** Brush smoothing time constant and extra delay (ms): the brush trails the pointer slightly. */
    tau: 28,
    lag: 30,
    /** Velocity splat radius as a share of the ink radius; brush speed (px/s) above which moves push no harder. */
    velocityRadius: 1.5,
    maxSpeed: 900,
    /** Brush speed (px/s) below which it lays proportionally less ink. */
    inkSpeed: 240,
    /** Brush radius = min(radiusH × viewport height, radiusW × viewport width). */
    radiusH: 0.1,
    radiusW: 0.14,
    /** Share of brush velocity added per step; ink added per step, its cap, and the display threshold. */
    force: 0.07,
    amount: 0.8,
    maxInk: 3,
    edge: 0.18,
    /** Gold rim outside the ink's edge (CSS px), C8. */
    rimPx: 1.25,
    /** Reduced motion: a smaller, slower, faint ink. */
    calm: { radius: 0.6, force: 0.01, strength: 0.28 },
  },
  idea: {
    count: { desktop: 36000, mobile: 12000 },
    /** Look-at range (degrees) and the two-stage follow: a fast share then a long, heavy tail. */
    yaw: 20,
    pitch: 10,
    fastTau: 0.09,
    slowTau: 0.65,
    fastShare: 0.55,
    /** Hovering onto the Idea changes its form with this dissolve (ms). */
    swapMs: 900,
    /** A new form needs the pointer to have been off the Idea for a moment, and a rest after the last change. */
    swapCooldownMs: 4000,
    swapReentryMs: 300,
    /** Reduced motion: barely moves. */
    calmYaw: 3,
    calmPitch: 1.5,
  },
} as const;

/**
 * /experience: "The Making of a Legacy: Shot on Location" (docs/concepts/THE-MAKING-OF-v3.md). The route runs through
 * eleven places; the position `s` (0 = the Atrium … 10 = post-credits) is the single source of truth.
 * Places sit on a path through one world; the camera holds at each place and travels the passage between.
 * World units are metres-ish. Colours: DESIGN.md (Luminous light default, Cinema dark alternate).
 */
export const experienceFeel = {
  travelSeconds: 6,
  /** Direct mode: wheel px / touch px per place; easing of s toward its target (s) and the top travel speed. */
  wheelPerPlace: 900,
  touchPerPlace: 520,
  follow: 0.42,
  maxPlacesPerSecond: 1.4,
  /** Jumps (act bar, Index, deep links) arrive in about this long whatever the distance (s). */
  jumpSeconds: 1.2,
  /** After input stops, settle onto the nearest place (ms). */
  snapAfterMs: 650,
  /** Room dolly: how far the camera moves toward a thing when you Enter it (share of the distance). */
  enterDolly: 0.55,
  /** Pointer parallax on the camera (world units). */
  parallax: 0.35,
} as const;

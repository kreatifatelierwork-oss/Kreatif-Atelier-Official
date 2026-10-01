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
export const experienceConfig = {
  /** Film-time per place (s): how long Watch holds there, then how long the passage to the next one takes. */
  holdSeconds: [14, 40, 48, 44, 40, 34, 34, 34, 40, 50, 30],
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
  /** Camera holds: position and look target per place (index = place). */
  camera: [
    { pos: [0, 1.7, 9], look: [0, 1.6, 0] }, // Atrium
    { pos: [0, 1.7, -22], look: [0, 1.4, -40] }, // Studio Floor
    { pos: [-6, 1.6, -70], look: [-12, 4, -88] }, // Drafting Hall (Aurelius)
    { pos: [-30, 1.7, -112], look: [-30, 2.5, -140] }, // Projection Hall (GGP)
    { pos: [-6, 2.2, -168], look: [18, 1.5, -190] }, // Concourse
    { pos: [30, 1.4, -206], look: [42, 1.2, -228] }, // Water Court (Valora)
    { pos: [58, 1.6, -246], look: [64, 1.0, -266] }, // Garden Court (Asraya)
    { pos: [64, 1.8, -296], look: [64, 8, -318] }, // Glass Lattice (Rudra Yugen)
    { pos: [24, 70, -60], look: [10, 0, -150] }, // Roof (above the whole Atelier)
    { pos: [0, 1.7, 6], look: [-9, 2.2, -2] }, // Gallery (the Atrium's curved wall)
    { pos: [0, 1.7, 10], look: [0, 1.2, 0] }, // Post-credits (the Atrium at dusk)
  ] as { pos: [number, number, number]; look: [number, number, number] }[],
  /** Where each place's room geometry is centred. */
  anchors: [
    [0, 0, 0], [0, 0, -40], [-12, 0, -86], [-30, 0, -140], [12, 0, -186], [42, 0, -228], [64, 0, -266], [64, 0, -318],
    [0, 0, 0], [0, 0, 0], [0, 0, 0],
  ] as [number, number, number][],
  /** A place's "vivid colour" (C5) or null for neutral places (gold is the accent there). */
  colour: [null, null, "#3D4BFF", "#E8307F", null, "#FF6A3D", "#23C27C", "#0FB5E4", null, null, null] as (string | null)[],
  /** Atmosphere (background + fog) per place, light and dark (DESIGN.md world atmospheres). */
  atmosphere: {
    light: ["#F4F5F7", "#F4F5F7", "#E7E9FF", "#FDE7F0", "#F4F5F7", "#FFEDE6", "#E2F7ED", "#E1F6FD", "#F1EEE6", "#F4F1EA", "#D9DEE7"],
    dark: ["#0B0F1A", "#0B0F1A", "#0A0E3A", "#2A0717", "#0B0F1A", "#2A0F07", "#042419", "#04202B", "#14110B", "#120F0A", "#070A12"],
  },
  /** Room dolly: how far the camera moves toward a thing when you Enter it (share of the distance). */
  enterDolly: 0.55,
  /** Pointer parallax on the camera (world units). */
  parallax: 0.35,
} as const;

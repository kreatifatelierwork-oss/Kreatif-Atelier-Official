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

  three: {
    /** Palette in sRGB hex; converted to linear by three. */
    background: "#0B0F1A",
    /** Polished gold F0 (≈ measured gold reflectance), not the flat brand gold — highlights do the rest. */
    gold: "#F4D08F",

    camera: { fov: 35, z: 6 },
    /** AgX tone mapping keeps hot highlights white-gold instead of clipping to yellow. */
    exposure: 1.05,

    /** Quality tiers (see lib/three/quality.ts). DPR range is scaled by PerformanceMonitor. */
    tiers: {
      high: { dpr: [1, 2], sculptureSegments: [640, 72], dust: 2600, postfx: "full", envResolution: 256 },
      medium: { dpr: [1, 1.5], sculptureSegments: [320, 36], dust: 780, postfx: "light", envResolution: 128 },
      low: { dpr: [1, 1], sculptureSegments: [200, 24], dust: 400, postfx: "none", envResolution: 64 },
    },

    /** Mount the canvas after the page is idle (or this many ms at most) so the HTML hero paints first. */
    mountDelayMs: 1800,

    lights: {
      key: { color: "#FFD9A6", intensity: 2.6, position: [4, 5, 4] },
      rim: { color: "#9DB6FF", intensity: 1.6, position: [-5, 1.5, -4] },
    },

    /** Studio environment built from light panels (no HDR download). Reflections are what make metal read as metal. */
    studio: {
      intensity: 1,
      panels: [
        // Overhead softbox: the broad bright sheen on upward faces.
        { form: "rect", color: "#FFF4E2", intensity: 3.2, position: [0, 5, -1], rotation: [Math.PI / 2, 0, 0], scale: [9, 3] },
        // Tall warm strip, camera-left: the long crisp highlight that runs along the ribbon.
        { form: "rect", color: "#FFE2B8", intensity: 5, position: [-4.5, 1, 2], rotation: [0, Math.PI / 2.4, 0], scale: [0.5, 7] },
        // Thin cool strip, camera-right: a cinematic blue-white edge.
        { form: "rect", color: "#D8E6FF", intensity: 2.4, position: [4.8, 0.5, 1], rotation: [0, -Math.PI / 2.4, 0], scale: [0.3, 6] },
        // Warm ring behind: separates the silhouette from the dark.
        { form: "ring", color: "#FFC980", intensity: 1.4, position: [0, 0, -6], rotation: [0, 0, 0], scale: [5, 5] },
        // Low bronze bounce from below.
        { form: "rect", color: "#8C6A3F", intensity: 0.5, position: [0, -5, 0], rotation: [-Math.PI / 2, 0, 0], scale: [10, 10] },
      ],
    },

    postfx: {
      bloom: { intensity: 0.55, threshold: 0.82, smoothing: 0.25, radius: 0.7 },
      vignette: { offset: 0.28, darkness: 0.72 },
    },

    hero: {
      /** Sculpture drifts with the page at this fraction of scroll speed while the hero scrolls away. */
      parallax: 0.75,
      /** Pointer lean, radians. */
      leanX: 0.16,
      leanY: 0.24,
      leanDamping: 3.5,
      /** Intro: the ribbon grows along its length over this many seconds. */
      revealSeconds: 2.4,
      /** Canvas fades out between these scroll distances (in viewport heights) — until Phase 4's director takes over. */
      fadeFromVh: 0.55,
      fadeToVh: 1.05,
    },

    dust: {
      color: "#E8C98A",
      size: 4.2,
      /** Share of particles clustered around the sculpture (the rest drift through the whole frame). */
      clustered: 0.9,
      innerRadius: 1.35,
      outerRadius: 3.4,
      opacity: 0.85,
    },
  },
} as const;

/** Stage 2 concept prototypes (/concepts?concept=1|2|3). Rough by design — feel and motion only. */
export const conceptConfig = {
  orrery: {
    loaderMinMs: 2600,
    /** Ring radii (inner → outer) and tilts give the armillary look. */
    rings: [
      { radius: 1.25, tilt: [0.42, 0, 0.12], speed: 0.16, bodies: 6 },
      { radius: 1.95, tilt: [-0.28, 0, -0.18], speed: -0.09, bodies: 4 },
      { radius: 2.65, tilt: [0.62, 0, 0.3], speed: 0.05, bodies: 5 },
    ],
    rimRadius: 3.2,
    camera: { fov: 32, position: [0, 1.4, 12] as [number, number, number] },
    /** Before entering, the instrument sits right of the title (world units); centred once in motion. */
    introOffsetX: 3.1,
    /** Wheel "winds" the mechanism: radians per wheel pixel, and how quickly the winding settles. */
    windPerPixel: 0.0035,
    windDamping: 2.6,
    focusDistance: 1.35,
  },
  production: {
    loaderMinMs: 3200,
    letterbox: 0.118, // share of viewport height per bar (≈ 2.39:1 at 16:9)
    beamColor: "#FFD9A6",
  },
  thread: {
    loaderMinMs: 2400,
    holdMs: 1400,
    /** Rope simulation: segments, rest length (world units), and pull stiffness. */
    segments: 64,
    segmentLength: 0.05,
    stiffness: 0.55,
  },
} as const;

/** The three hero sculpture studies — switch with ?sculpture=1|2|3. */
export type SculptureVariant = {
  name: string;
  /** Torus-knot windings: the path's shape. */
  p: number;
  q: number;
  knotRadius: number;
  tubeRadius: number;
  /** Slow breathing of the knot's minor radius. */
  breath: number;
  /** Cross-section: half-width, half-thickness, superellipse exponent (2 = ellipse, higher = squarer edges). */
  width: number;
  thickness: number;
  exponent: number;
  /** Cross-section turns along one full loop (half-turns allowed), and how fast the twist drifts. */
  twist: number;
  twistSpeed: number;
  /** Flowing surface noise. */
  noiseAmp: number;
  noiseFreq: number;
  noiseSpeed: number;
  /** Swells that travel along the length (molten ripple). */
  rippleAmp: number;
  rippleFreq: number;
  rippleSpeed: number;
  /** Material. */
  roughness: number;
  roughnessVariation: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envIntensity: number;
  /** Scene orientation (radians) and idle spin speed (rad/s). */
  tilt: [number, number, number];
  spin: number;
  /** Multiplies the key light and studio panels for this study. */
  lightBoost: number;
};

export const sculptureVariants: Record<1 | 2 | 3, SculptureVariant> = {
  /** 1 · Ribbon — an open trefoil of slim satin-gold ribbon with a single slow half-turn. */
  1: {
    name: "Ribbon",
    p: 2, q: 3, knotRadius: 1, tubeRadius: 0.36, breath: 0.05,
    width: 0.17, thickness: 0.028, exponent: 2.8,
    twist: 0.5, twistSpeed: 0.1,
    noiseAmp: 0.018, noiseFreq: 0.9, noiseSpeed: 0.1,
    rippleAmp: 0, rippleFreq: 0, rippleSpeed: 0,
    roughness: 0.14, roughnessVariation: 0.25, clearcoat: 0, clearcoatRoughness: 0,
    envIntensity: 1.15,
    tilt: [-0.75, 0.25, 0.1], spin: 0.05, lightBoost: 1,
  },
  /** 2 · Torsion — a sweeping (3,2) rosette in a thin, blade-edged band that twists hard; mirror polish. */
  2: {
    name: "Torsion",
    p: 3, q: 2, knotRadius: 1, tubeRadius: 0.55, breath: 0.03,
    width: 0.15, thickness: 0.012, exponent: 4,
    twist: 2.5, twistSpeed: 0.28,
    noiseAmp: 0.01, noiseFreq: 1.2, noiseSpeed: 0.16,
    rippleAmp: 0, rippleFreq: 0, rippleSpeed: 0,
    roughness: 0.05, roughnessVariation: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.03,
    envIntensity: 1.4,
    tilt: [-0.95, 0.3, -0.2], spin: 0.08, lightBoost: 1.3,
  },
  /** 3 · Molten — a slim round trefoil whose surface swells and ripples slowly, like poured metal. */
  3: {
    name: "Molten",
    p: 2, q: 3, knotRadius: 1, tubeRadius: 0.38, breath: 0.06,
    width: 0.12, thickness: 0.12, exponent: 2,
    twist: 1, twistSpeed: 0.05,
    noiseAmp: 0.035, noiseFreq: 0.85, noiseSpeed: 0.08,
    rippleAmp: 0.22, rippleFreq: 7, rippleSpeed: 0.55,
    roughness: 0.17, roughnessVariation: 0.4, clearcoat: 0, clearcoatRoughness: 0,
    envIntensity: 1.15,
    tilt: [-0.7, -0.15, 0.35], spin: 0.04, lightBoost: 1,
  },
};

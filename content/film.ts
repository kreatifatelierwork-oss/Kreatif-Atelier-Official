/**
 * Copy for "The Making of a Legacy" (the film). Brand lines are ported verbatim from the live site / company chart.
 * UI wording approved 2026-09-30 (act names, the gate, Watch / Direct, "A Kreatif Atelier film") is marked APPROVED;
 * anything else new is marked PROPOSED.
 */
export const film = {
  /** APPROVED */
  credit: "A Kreatif Atelier film",
  gate: {
    withSound: "Enter with sound", // APPROVED
    silent: "Enter in silence", // APPROVED
    /** Screen-reader description of the gate. PROPOSED */
    label: "Choose how to enter the film",
  },
  sound: { on: "Sound on", off: "Sound off", label: "Sound" }, // PROPOSED (toggle labels)
  modes: { watch: "Watch", direct: "Direct" }, // APPROVED
  acts: ["Title", "Idea", "Strategy", "Story", "Movement", "People", "Futures", "Legacy"], // APPROVED (0 = title card)
  /** Readout labels for the HUD. PROPOSED */
  hud: {
    act: "Act",
    form: "Form",
    cursor: "Cursor",
    fps: "FPS",
    particles: "Particles",
    city: "Hyderabad",
    timezone: "IST",
  },
  /** The Idea's forms (one per act it will pass through). Shown in the HUD as you hover the Idea. PROPOSED labels. */
  forms: ["Raw idea", "Blueprint", "Story", "Movement", "People", "Futures", "Monument"],
  loading: "Setting the scene", // PROPOSED (kept from the Long Take)
  skip: "Skip to content", // PROPOSED
} as const;

/** Title card (all verbatim from the live site / chart). */
export const titleCard = {
  lead: "Kreatif",
  signature: "Atelier",
  lineA: "Where Strategy Meets Story.",
  lineB: "Where Story Becomes Legacy.",
  values: ["Bold", "Radiant", "Timeless"],
  motto: ["Ideas", "People", "Impact"],
} as const;

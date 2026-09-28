/**
 * Copy for the Stage 2 concept prototypes (/concepts?concept=1|2|3).
 * Brand lines are ported verbatim; everything marked PROPOSED is new wording for review — nothing
 * here ships to the live site until approved.
 */
export const conceptLab = {
  title: "Concept prototypes",
  switcherLabel: "Concept",
  replay: "Replay intro",
  names: { 1: "The Orrery", 2: "The Production", 3: "The Golden Thread" },
  type: { label: "Headlines", serif: "Serif", sans: "Sans" },
} as const;

/** The TURA-style frame ("edge furniture") shared by all three prototypes. */
export const frame = {
  wordmark: ["Kreatif", "Atelier"],
  scroll: "Scroll",
  contact: "Contact", // PROPOSED (short label for the mailto link)
  sectionsLabel: "Sections",
  social: { instagram: "Instagram", linkedin: "LinkedIn", email: "Email" },
  prev: "Previous",
  next: "Next",
} as const;

export const brand = {
  wordmark: "Kreatif Atelier",
  lineA: "Where Strategy Meets Story.",
  lineB: "Where Story Becomes Legacy.",
  values: ["Bold", "Radiant", "Timeless"],
} as const;

/** Concept 1 — The Orrery. */
export const orrery = {
  loading: "Assembling", // PROPOSED
  enter: "Set it in motion", // PROPOSED
  hint: "Drag to turn · Scroll to wind · Choose a body", // PROPOSED
  back: "Back to the orrery", // PROPOSED
  sections: ["The Orrery", "The Houses"], // PROPOSED
  housesLink: "The Houses", // PROPOSED
  visitHouse: "Visit on the orrery", // PROPOSED
  rings: [
    { id: "craft", label: "The Craft", note: "Six services" }, // PROPOSED ring names
    { id: "houses", label: "The Houses", note: "Four divisions" },
    { id: "way", label: "The Way", note: "Five steps" },
  ],
} as const;

/** Concept 2 — The Production. */
export const production = {
  leader: "Loading reel", // PROPOSED
  roll: "Roll film", // PROPOSED
  presents: "A Kreatif Atelier Production", // PROPOSED
  reels: ["The Brief", "The Craft", "The Crew", "The Cut", "The Premiere"], // PROPOSED reel names
  scrollHint: "Scroll to play", // PROPOSED
  sections: ["The Brief", "The Crew"], // PROPOSED
  crewLink: "The Crew", // PROPOSED
  readBio: "Read the bio", // PROPOSED
} as const;

/** Concept 3 — The Golden Thread. */
export const thread = {
  loading: "Drawing the thread", // PROPOSED
  hold: "Hold to pick up the thread", // PROPOSED
  holdA11y: "Pick up the thread", // PROPOSED (button name for keyboard / screen readers)
  drawHint: "Move to guide the thread · Scroll to follow it", // PROPOSED
  knots: ["Spark", "Who we are", "Six pillars", "Partnerships", "Visionaries", "Ecosystem", "Why us", "Process", "Industries", "Legacy"], // PROPOSED knot names
  legacyHint: "Every visit leaves a different inlay. Yours is being drawn.", // PROPOSED
  sections: ["Spark", "Six pillars"], // PROPOSED
  pillarsLink: "Six pillars", // PROPOSED
} as const;

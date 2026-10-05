/**
 * Site wording for v5 "One Take Across the World" (docs/concepts/WORLD-PLAN.md). Chapter names come from the plan
 * the user wrote (approved with it). Everything else new is marked PROPOSED and listed for approval in
 * docs/PROGRESS.md. All company copy stays in the other content files and is used word for word.
 */

/** The twelve chapters of the home journey, in order (WORLD-PLAN.md "HOME PAGE route"). */
export const chapters = [
  "The Seed",
  "The Climb",
  "Above the Canopy",
  "The Five Peaks",
  "Aurelius",
  "Golden Guardian Productions",
  "Valora",
  "Asraya",
  "Rudra Yugen",
  "The Summit",
  "The Night Sky",
  "Return",
] as const;

/** Film title cards at chapter starts: "Chapter One" … (X09 sets the chapter number in words). PROPOSED */
export const chapterNumber = (n: number) =>
  `Chapter ${["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"][n]}`;

export const journey = {
  /** APPROVED earlier (v3) and kept. */
  index: "Index",
  close: "Close",
  back: "Back",
  /** PROPOSED: the field-guide pages open from a callout. */
  read: "Read",
  /** H09: "5 Verticals" (WORLD-PLAN.md) and the live site's "∞ Creative Vision". */
  numerals: [
    { value: "5", label: "Verticals" },
    { value: "∞", srValue: "Infinite", label: "Creative Vision" },
  ],
  /** H12 heading (prompt pack wording). PROPOSED */
  fivePillars: "Five pillars.",
  /** Portal buttons: "Enter Aurelius" (prompt pack wording). PROPOSED */
  enter: (name: string) => `Enter ${name}`,
  /** Company page closings (WORLD-PLAN.md): "Enquire", "Next: …", "Back to the Atlas". */
  enquire: "Enquire",
  next: (name: string) => `Next: ${name}`,
  backToAtlas: "Back to the Atlas",
  /** Accessible names only (never shown). PROPOSED */
  sr: {
    filmTime: "Film time",
    trail: "The route so far",
    chapters: "Chapters",
    map: "Map of the five lands",
  },
} as const;

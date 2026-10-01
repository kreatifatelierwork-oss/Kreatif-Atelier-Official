/**
 * Copy for /experience, "The Making of a Legacy: Shot on Location" (docs/concepts/THE-MAKING-OF-v3.md).
 * Place names, "Enter", "Index" and the action labels were APPROVED with v3 on 2026-10-01. Everything a place shows
 * is ported word for word from the other content files (see components/experience/route.ts).
 */

export type PlaceId =
  | "atrium"
  | "studio"
  | "aurelius"
  | "ggp"
  | "concourse"
  | "valora"
  | "asraya"
  | "rudra"
  | "roof"
  | "gallery"
  | "post";

/** Act per place: an index into `film.acts` (0 Title … 7 Legacy), or the credits / post-credits. */
export type Act = number | "credits" | "post";

export const places: readonly { id: PlaceId; name: string; act: Act }[] = [
  { id: "atrium", name: "The Atrium", act: 0 },
  { id: "studio", name: "The Studio Floor", act: 1 },
  { id: "aurelius", name: "The Drafting Hall", act: 2 },
  { id: "ggp", name: "The Projection Hall", act: 3 },
  { id: "concourse", name: "The Concourse", act: 4 },
  { id: "valora", name: "The Water Court", act: 5 },
  { id: "asraya", name: "The Garden Court", act: 5 },
  { id: "rudra", name: "The Glass Lattice", act: 6 },
  { id: "roof", name: "The Roof", act: 7 },
  { id: "gallery", name: "The Gallery", act: "credits" },
  { id: "post", name: "The Atrium", act: "post" },
];

export const xp = {
  /** APPROVED 2026-10-01 */
  index: "Index",
  close: "Close",
  enter: "Enter",
  back: "Back",
  act: "Act",
  credits: "Credits",
  postCredits: "Post-credits",
  formats: "Formats",
  founders: "Founders",
  contact: "Contact",
  actions: {
    findTheAngle: "Find the angle",
    roll: "Roll",
    launch: "Launch",
    layAStone: "Lay a stone",
    breathe: "Breathe",
    spark: "Spark",
  },
  /** Accessible names only (never shown). PROPOSED */
  sr: {
    filmTime: "Film time",
    route: "Places in the film",
    youAreHere: "You are here",
    plan: "Floor plan of the Atelier",
    actBar: "Act bar",
  },
} as const;

/** Roman numerals for the act bar ("Act II"); the title card is "Act 00". */
export const actNumeral = (n: number) => (n === 0 ? "00" : ["I", "II", "III", "IV", "V", "VI", "VII"][n - 1]);

/**
 * C3 (user decision 2026-09-30): punctuation-only changes to ported copy. A spaced long dash becomes a comma, a dash
 * in a price range becomes a hyphen. Words never change.
 */
const colonAfter = ["not decoration", "brand audit call", "don't just design logos"];

export const c3 = (text: string) =>
  text
    .replace(/(\S[^—]*?)\s+—\s+/g, (m, before: string) =>
      colonAfter.some((p) => before.endsWith(p)) ? `${before}: ` : `${before}, `,
    )
    .replace(/(₹\d+(?:\.\d+)?)–(\d)/g, "$1-$2");

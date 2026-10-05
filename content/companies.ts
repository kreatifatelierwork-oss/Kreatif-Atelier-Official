/**
 * Copy for the five company pages. Names, taglines, offerings and value lines come from content/verticals.ts (the
 * chart, word for word). The chart has one line per offering; the paragraphs below for Valora, Asraya and Rudra
 * Yugen are PROPOSED (drafted 2026-10-05, descriptive only: no facts, numbers, clients or claims) and wait for the
 * user's approval. Page wording ("Arrival", "Onward", "Enquire" …) follows the prompt pack's act bars and is PROPOSED
 * where marked.
 */
import type { Vertical } from "./verticals";

type Slug = Vertical["slug"];

/** PROPOSED: one short descriptive paragraph per offering (in the chart's order). */
export const offeringCopy: Partial<Record<Slug, readonly [string, string, string, string]>> = {
  valora: [
    "A connected set of programmes that helps students build practical skills alongside their studies. Learning is shaped around real work, so ability grows with confidence.",
    "A bridge between the classroom and the working world. Students meet the people, briefs and settings of industry while they are still learning.",
    "Guidance from people who have walked the path before. Mentors help students find their direction and take their first steps into work.",
    "A wider horizon for ambitious learners. Valora opens doors to experiences and pathways beyond the familiar.",
  ],
  asraya: [
    "Moments designed to help people slow down and restore. Each experience brings body and mind back into balance.",
    "Time set apart to rest, reflect and renew. Guided programmes give structure to a change of pace.",
    "Simple practices and tools for everyday calm. They help healthier habits take root in ordinary days.",
    "Places where people gather, share and support one another. Wellbeing grows stronger when it is shared.",
  ],
  "rudra-yugen": [
    "Exploring new technologies and artificial intelligence with a creative eye. Ideas are tested, shaped and turned into working experiments.",
    "Work that carries culture forward through new forms. Heritage and imagination meet in projects made for today's audiences.",
    "Spaces for research, prototyping and open questions. Labs give promising ideas room to grow before they meet the world.",
    "New ventures shaped where creativity and technology meet. Each one begins with a clear idea of the future it is building toward.",
  ],
};

/** Act-bar chapter names on the company pages (prompt pack act bars: "Aurelius · Arrival" …). PROPOSED */
export const pageChapters = {
  arrival: "Arrival",
  offerings: "Offerings",
  services: "Services",
  partnerships: "Partnerships",
  process: "Process",
  industries: "Industries",
  showreel: "Showreel",
  onward: "Onward",
} as const;

/** The order of the "Next" portals: the journey's order of the lands, round to the start. */
export const pageOrder: readonly Slug[] = ["aurelius", "golden-guardian-productions", "valora", "asraya", "rudra-yugen"];

/** Mail subject for "Enquire" on a company page. PROPOSED */
export const enquireSubject = (name: string) => `Enquiry: ${name}`;

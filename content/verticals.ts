/**
 * The new company structure — transcribed exactly from the organisation chart (2026-09-28).
 * This replaces the old "four divisions". Nothing here is paraphrased; new UI wording lives
 * elsewhere and is flagged PROPOSED.
 */

export type Vertical = {
  slug: "aurelius" | "valora" | "golden-guardian-productions" | "rudra-yugen" | "asraya";
  name: string;
  /** Three-word tagline, split so it can be set as microtype. */
  tagline: readonly [string, string, string];
  /** "What we do" — four items. */
  whatWeDo: readonly [string, string, string, string];
  /** "How we create value" — one line. */
  value: string;
};

export const holding = {
  name: "Kreatif Atelier",
  descriptor: "A creative holding company",
  motto: ["Ideas", "People", "Impact"] as const,
  lines: {
    ecosystem: "A creative holding ecosystem for a better tomorrow.",
    verticals: "Multiple verticals. One vision. Exponential impact.",
    tomorrow: "Disciplines today. A brighter tomorrow.",
  },
  vision:
    "To build an interdisciplinary ecosystem that creates meaningful opportunities, cultural value and long-term impact through creativity, education, production and innovation.",
  pillars: ["Creativity", "Education", "Production", "Wellbeing", "Technology"] as const,
  labels: {
    vision: "Vision",
    pillars: "Pillars",
    whatWeDo: "What we do",
    value: "How we create value",
    serves: "Our ecosystem serves",
    impact: "Impact",
  },
} as const;

export const verticals: readonly Vertical[] = [
  {
    slug: "aurelius",
    name: "Aurelius",
    tagline: ["Brands", "Strategy", "Growth"],
    whatWeDo: ["Brand Strategy & Identity", "Marketing & Communication", "Creative Consulting", "Business Advisory"],
    value: "Builds brands that lead and last.",
  },
  {
    slug: "valora",
    name: "Valora",
    tagline: ["People", "Skills", "Opportunities"],
    whatWeDo: ["Student Capability Ecosystem", "Industry Connect", "Mentorship & Placement", "Global Opportunities"],
    value: "Bridges education with real-world opportunities.",
  },
  {
    slug: "golden-guardian-productions",
    name: "Golden Guardian Productions",
    tagline: ["Stories", "Visuals", "Impact"],
    whatWeDo: ["Film & Video Production", "Branded Content", "Live Events", "Creative IP Development"],
    value: "Creates powerful stories that inspire and influence.",
  },
  {
    slug: "rudra-yugen",
    name: "Rudra Yugen",
    tagline: ["Innovation", "Culture", "Futures"],
    whatWeDo: ["Emerging Tech & AI", "Cultural Projects", "R&D and Innovation Labs", "Strategic Ventures"],
    value: "Builds what's next at the intersection of creativity and technology.",
  },
  {
    slug: "asraya",
    name: "Asraya",
    tagline: ["People", "Balance", "Wellbeing"],
    whatWeDo: ["Wellness Experiences", "Retreats & Programs", "Mindfulness & Lifestyle Tools", "Community Spaces"],
    value: "Enables people to live healthier, more meaningful lives.",
  },
];

export const serves = ["Students", "Professionals", "Businesses", "Creators", "Global Partners", "Communities"] as const;

export const impact = [
  "Skilled Talent",
  "Stronger Brands",
  "Meaningful Content",
  "Innovative Solutions",
  "Healthier Lives",
  "A Brighter Tomorrow",
] as const;

import type { SectionIntro } from "./types";

export const about: SectionIntro & {
  pillars: { title: string; body: string }[];
  quote: { text: string; attribution: string };
} = {
  id: "about",
  marker: "01 · Who We Are",
  kicker: "A Multidisciplinary Creative Enterprise",
  headline: { lead: "We build brands that", emphasis: "actually move people." },
  intro:
    "Kreatif Atelier is a full-spectrum creative agency operating at the intersection of strategy, storytelling, and execution — built for brands that want more than good-looking content.",
  pillars: [
    {
      title: "What We Are",
      body: "A multidisciplinary creative enterprise offering end-to-end brand communication — from positioning strategy and visual identity to digital campaigns, production, and media relations. We are not a vendor. We are a creative partner.",
    },
    {
      title: "Where We Operate",
      body: "Headquartered in Hyderabad, we serve clients across Secunderabad, Banjara Hills, Jubilee Hills, HITEC City, and Gachibowli — with ambitions to become one of South India's most influential creative ecosystems.",
    },
    {
      title: "Who We Work With",
      body: "D2C startups, funded companies, premium F&B brands, healthcare institutions, and established businesses looking to build meaningful, modern brand identities that win in competitive markets.",
    },
    {
      title: "Our Philosophy",
      body: "Great creative work is not decoration — it is a business tool. Every brief we take is approached with commercial intelligence, not just artistic sensibility. We measure success in your outcomes, not our output.",
    },
  ],
  quote: {
    text: "We believe the most powerful brands are built at the intersection of strategy and story. We bring both — and we bring them together without compromise.",
    attribution: "Kreatif Atelier · Creative Philosophy",
  },
};

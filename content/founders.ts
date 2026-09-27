import type { SectionIntro } from "./types";

export type Founder = {
  slug: string;
  name: string;
  /** Short title shown on the card. */
  role: string;
  /** Full title shown in the bio dialog. */
  roleFull: string;
  bio: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

export const foundersIntro: SectionIntro & { openBio: (name: string) => string } = {
  id: "founders",
  marker: "04 · The Visionaries",
  kicker: "Meet The Founders",
  headline: { lead: "Built by leaders who", emphasis: "dare to create." },
  intro:
    "Four exceptional minds united by a singular vision — to build South India's most influential creative enterprise. Tap a card to learn more about each founder.",
  openBio: (name) => `Read ${name}'s bio`,
};

export const founders: Founder[] = [
  {
    slug: "gourish",
    name: "Gourish Girish Pillai",
    role: "Founder & CEO",
    roleFull: "Founder & CEO",
    bio: "The architect of Kreatif Atelier's vision, Gourish brings a rare combination of entrepreneurial acuity and creative instinct. As CEO, he sets the strategic direction, builds client relationships, and ensures the agency operates at the highest standard of creative excellence.",
    image: "/images/founders/gourish.webp",
    imageWidth: 640,
    imageHeight: 640,
  },
  {
    slug: "rohan",
    name: "Rohan Yadav",
    role: "Co-Founder & COO",
    roleFull: "Co-Founder & COO",
    bio: "Rohan is the operational backbone of Kreatif Atelier — the force that translates creative vision into flawless execution. As COO, he oversees client delivery, team operations, and process architecture, ensuring every project is delivered with precision.",
    image: "/images/founders/rohan.webp",
    imageWidth: 640,
    imageHeight: 640,
  },
  {
    slug: "anwesha",
    name: "Anwesha Mulge",
    role: "CFO",
    roleFull: "Chief Financial Officer",
    bio: "Anwesha brings the financial intelligence that transforms creative ambition into sustainable enterprise. As CFO, she architects the resource framework and builds the financial foundations that allow Kreatif Atelier to grow with integrity.",
    image: "/images/founders/anwesha.webp",
    imageWidth: 640,
    imageHeight: 640,
  },
  {
    slug: "aritra",
    name: "Aritra Ghoshal",
    role: "CTO",
    roleFull: "Chief Technology Officer",
    bio: "Aritra powers Kreatif Atelier's digital infrastructure and technology strategy. As CTO, he builds the tools, platforms, and data systems that give the agency its analytical edge — sitting at the intersection of technology and creativity.",
    image: "/images/founders/aritra.webp",
    imageWidth: 640,
    imageHeight: 640,
  },
];

import type { SectionIntro } from "./types";

export type Tier = {
  name: string;
  price: string;
  period: string;
  features: string[];
  note: string;
  featured?: boolean;
};

export const engagementIntro: SectionIntro & { featuredBadge: string } = {
  id: "packages",
  marker: "03 · Engagement Models",
  kicker: "Built For Every Stage Of Growth",
  headline: { lead: "Choose your", emphasis: "creative partnership." },
  featuredBadge: "Most Popular",
};

/** Prices are shown exactly as on the live site (open decision — see CLAUDE.md). */
export const tiers: Tier[] = [
  {
    name: "Starter",
    price: "₹25–35K",
    period: "per month",
    features: [
      "Social media management",
      "12 posts / month",
      "Basic content creation",
      "Monthly analytics report",
      "1 platform focus",
    ],
    note: "Ideal for businesses just beginning to build a consistent digital presence.",
  },
  {
    name: "Growth",
    price: "₹55–75K",
    period: "per month",
    features: [
      "Social media (2 platforms)",
      "Performance ads management",
      "1 brand video / month",
      "Copywriting & design",
      "Bi-weekly strategy calls",
      "Detailed analytics",
    ],
    note: "Ideal for growing brands ready to invest in multi-channel presence.",
    featured: true,
  },
  {
    name: "Brand Partner",
    price: "₹1–1.5L",
    period: "per month",
    features: [
      "Full-stack creative direction",
      "Strategy + creative + production",
      "PR & media campaigns",
      "2–4 videos / month",
      "Dedicated account team",
      "Weekly reporting",
    ],
    note: "For brands that want Kreatif Atelier as a fully integrated creative extension.",
  },
];

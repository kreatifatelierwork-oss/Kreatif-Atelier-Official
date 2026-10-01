import type { SectionIntro } from "./types";

export const whyIntro: SectionIntro = {
  id: "why",
  marker: "06 · Why Kreatif Atelier",
  headline: { lead: "What makes us", emphasis: "different." },
  intro: "There are many agencies. Here is why the right clients choose us — and stay.",
};

export const reasons: { number: string; title: string; body: string }[] = [
  {
    number: "01",
    title: "Strategy Before Aesthetics",
    body: "We start every engagement with a commercial brief, not a mood board. Creative work that doesn't serve a business objective is expensive decoration.",
  },
  {
    number: "02",
    title: "Full-Stack Execution",
    body: "From strategy decks to production days to running your ad accounts — we do not outsource. One team. One voice. One standard.",
  },
  {
    number: "03",
    title: "Startup-Tested Proof",
    body: "We have built brand communications for funded companies from the ground up. We understand the pace, constraints, and growth pressures of ambitious businesses.",
  },
  {
    number: "04",
    title: "Deep Hyderabad Roots",
    body: "We understand this market's culture, language, business communities, and media ecosystem better than any remote agency. Proximity is an advantage we use every day.",
  },
  {
    number: "05",
    title: "Creative With Accountability",
    body: "We report on outcomes, not just deliverables. Every retainer includes measurable KPIs, monthly reviews, and transparent reporting.",
  },
  {
    number: "06",
    title: "An Ecosystem, Not a Vendor",
    // Rewritten by the user on 2026-10-01 so it matches the chart (five verticals).
    body: "With five specialized verticals, clients gain access to brand strategy, education, production, innovation and wellbeing capabilities, all under one creative intelligence.",
  },
];

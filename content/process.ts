import type { SectionIntro } from "./types";

export const processIntro: SectionIntro = {
  id: "process",
  marker: "07 · How We Work",
  headline: { lead: "Our process is", emphasis: "built for speed." },
  intro:
    "From brief to execution in days, not months. Every engagement follows a tested, transparent five-step framework.",
};

export const steps: { number: string; title: string; body: string }[] = [
  {
    number: "01",
    title: "Discovery & Audit",
    body: "We audit your current brand position, competitive landscape, and business objectives before making a single creative decision.",
  },
  {
    number: "02",
    title: "Strategy & Positioning",
    body: "We define your communication strategy, target audience, messaging hierarchy, and campaign architecture.",
  },
  {
    number: "03",
    title: "Creative Development",
    body: "Our team develops concepts, designs, scripts, and content — all aligned to the strategic brief approved in step two.",
  },
  {
    number: "04",
    title: "Execution & Publishing",
    body: "We execute — production, publishing, campaign launch, and community management — with precision and speed.",
  },
  {
    number: "05",
    title: "Review & Optimize",
    body: "Monthly performance reviews, data-driven adjustments, and strategic recalibration to keep outcomes improving.",
  },
];

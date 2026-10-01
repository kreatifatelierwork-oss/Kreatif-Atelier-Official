/**
 * SUPERSEDED (2026-09-28): the old "four divisions" (incl. Zenith Chapter). Kept only for the /concepts prototypes;
 * never used in v3. The company structure is `content/verticals.ts` (the chart wins, user decision 2026-10-01).
 */
import type { SectionIntro } from "./types";

export type Division = {
  slug: string;
  name: string;
  tagline: string;
  body: string;
  focus: string;
  serves: string;
  model: string;
};

export const ecosystemIntro: SectionIntro & {
  labels: { focus: string; serves: string; model: string };
} = {
  id: "ecosystem",
  marker: "05 · The Ecosystem",
  kicker: "One Agency. Four Distinct Forces.",
  headline: { lead: "An ecosystem of", emphasis: "creative intelligence." },
  intro:
    "Kreatif Atelier operates through four specialized divisions — each with its own mandate, united by a common standard of creative excellence.",
  labels: { focus: "Focus", serves: "Serves", model: "Model" },
};

export const divisions: Division[] = [
  {
    slug: "kreatif-atelier",
    name: "Kreatif Atelier",
    tagline: "The parent agency — strategy, digital, and brand communication",
    body: "The core agency delivering integrated brand strategy, social media, performance marketing, PR, and creative campaigns. The client-facing engine that owns the relationship and coordinates all creative output across the ecosystem.",
    focus: "Brand strategy, digital marketing, PR",
    serves: "Startups, D2C, enterprises",
    model: "Monthly retainer + project-based",
  },
  {
    slug: "golden-guardian-productions",
    name: "Golden Guardian Productions",
    tagline: "Premium production for brands that take storytelling seriously",
    body: "A dedicated production house delivering brand films, commercials, digital series, and cinematic content. Golden Guardian brings the quality of film production to brand storytelling — with a sharp commercial sensibility.",
    focus: "Brand films, commercials, production",
    serves: "Brands, agencies, media companies",
    model: "Project-based",
  },
  {
    slug: "zenith-chapter",
    name: "Zenith Chapter",
    tagline: "Building the next generation of creative professionals",
    body: "An educational vertical delivering workshops, industry exposure programs, and creative training to colleges and institutions. Zenith Chapter builds the talent pipeline of tomorrow while creating a community of future collaborators.",
    focus: "Colleges, workshops, skill training",
    serves: "Universities, institutions, students",
    model: "Institutional contracts",
  },
  {
    slug: "asraya",
    name: "Asraya",
    tagline: "Creative power in service of meaningful social impact",
    body: "Our social impact division — partnering with NGOs, foundations, and civic bodies to design and execute awareness campaigns, women's safety initiatives, and community programs with the same creative rigor as commercial work.",
    focus: "NGO campaigns, social awareness",
    serves: "NGOs, foundations, civic bodies",
    model: "Partnership-based",
  },
];

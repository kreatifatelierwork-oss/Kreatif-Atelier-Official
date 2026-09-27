import type { SplitHeadline } from "./types";

export const site = {
  name: "Kreatif Atelier",
  wordmark: "KREATIF ATELIER",
  url: "https://kreatifatelier.com",
  title: "Kreatif Atelier — Bold. Radiant. Timeless.",
  description:
    "Kreatif Atelier — A full-spectrum creative agency in Hyderabad. Brand strategy, social media, performance marketing, production & PR.",
  locale: "en_IN",
  email: "hello@kreatifatelier.com",
  handle: "@kreatifatelier",
  /** Fill these in and the handle / labels render as links automatically. */
  instagramUrl: "",
  linkedinUrl: "",
  city: "Hyderabad",
  region: "Telangana",
  country: "India",
} as const;

export const nav = {
  homeLabel: "Kreatif Atelier — back to top",
  skipLink: "Skip to content",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  primaryLabel: "Primary",
  items: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Founders", href: "#founders" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "Process", href: "#process" },
  ],
  cta: { label: "Work With Us", href: "#contact" },
} as const;

export const hero = {
  id: "home",
  /** Live site: "Hyderabad · Est. 2024 · Creative Enterprise" — "Est." withheld until the year is confirmed. */
  eyebrow: ["Hyderabad", "Creative Enterprise"],
  /** Set in uppercase via CSS so screen readers read words, not letters. */
  wordmark: ["Kreatif", "Atelier"],
  positioning: ["Where Strategy Meets Story.", "Where Story Becomes Legacy."],
  brandLine: ["Bold", "Radiant", "Timeless"],
  stats: [
    { value: "6+", label: "Core Services" },
    { value: "4", label: "Divisions" },
    /** Drawn as an inline SVG (neither font has ∞); `srValue` is what screen readers hear. */
    { value: "∞", srValue: "Infinite", label: "Creative Vision" },
  ],
  scrollCue: "Scroll",
} as const;

export const contact: {
  id: string;
  marker: string;
  headline: SplitHeadline;
  body: string;
  cta: { label: string; subject: string };
  details: {
    locationLabel: string;
    location: [string, string];
    emailLabel: string;
    socialLabel: string;
    socialNetworks: { label: string; key: "instagramUrl" | "linkedinUrl" }[];
  };
} = {
  id: "contact",
  marker: "09 · Let's Begin",
  headline: { lead: "Ready to build something", emphasis: "worth remembering?" },
  body: "Every great brand started with a single conversation. We offer a complimentary 30-minute brand audit call — no obligation, no pitch deck. Just honest strategy.",
  cta: { label: "Schedule Your Free Brand Audit", subject: "Free Brand Audit Request" },
  details: {
    locationLabel: "Studio Location",
    location: ["Hyderabad & Secunderabad", "Telangana, India"],
    emailLabel: "Email",
    socialLabel: "Social",
    socialNetworks: [
      { label: "instagram", key: "instagramUrl" },
      { label: "linkedin", key: "linkedinUrl" },
    ],
  },
};

export const footer = {
  socialNetworks: [
    { label: "Instagram", key: "instagramUrl" },
    { label: "LinkedIn", key: "linkedinUrl" },
  ] as const,
  /** Rendered as "© {year} · All Rights Reserved · Hyderabad" with the current year. */
  rights: "All Rights Reserved · Hyderabad",
  backToTop: "Back to top",
} as const;

export const ui = {
  close: "Close",
} as const;

export const mailtoHref = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

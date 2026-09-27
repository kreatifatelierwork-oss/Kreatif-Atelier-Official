import type { SectionIntro } from "./types";

export type Service = {
  slug: string;
  number: string;
  title: string;
  blurb: string;
  cardTags: string[];
  tagline: string;
  whatItIs: string;
  howItWorks: string;
  features: { title: string; body: string }[];
  detailTags: string[];
};

export const servicesIntro: SectionIntro & {
  cardCta: string;
  whatLabel: string;
  howLabel: string;
} = {
  id: "services",
  marker: "02 · Our Services",
  kicker: "Full-Spectrum Creative Capability",
  headline: { lead: "Six pillars of", emphasis: "creative power." },
  intro:
    "Each service is engineered to work independently or together as a unified growth engine. Tap any service to explore it in depth.",
  cardCta: "Explore Service",
  whatLabel: "What It Is",
  howLabel: "How It Works",
};

export const services: Service[] = [
  {
    slug: "brand",
    number: "01",
    title: "Brand Strategy & Identity",
    blurb:
      "We build brand architectures that position you distinctively in your market — from naming and positioning to visual identity systems, brand guidelines, and messaging frameworks.",
    cardTags: ["Brand Audit", "Visual Identity", "Positioning", "Guidelines"],
    tagline: "Building brands that matter, in markets that are crowded.",
    whatItIs:
      "Brand Strategy & Identity is the foundational layer of all great marketing. At Kreatif Atelier, we don't just design logos — we architect complete brand universes. We define your brand's personality, voice, positioning, and visual language so every single touchpoint communicates something intentional.",
    howItWorks:
      "We begin with a deep-dive brand audit — analyzing your current positioning, competitors, and audience perceptions. From there, we develop a positioning strategy and ultimately the visual identity system: logo, color palette, typography, imagery style, and usage guidelines.",
    features: [
      { title: "Brand Audit", body: "Comprehensive review of current brand equity, competitive landscape, and audience perception gaps." },
      { title: "Positioning Strategy", body: "Defining your unique market position, differentiation narrative, and core messaging pillars." },
      { title: "Visual Identity System", body: "Logo design, color systems, typography, iconography, and all visual brand language." },
      { title: "Brand Guidelines", body: "A comprehensive rulebook ensuring brand consistency across every medium and touchpoint." },
    ],
    detailTags: ["Brand Audit", "Visual Identity", "Messaging", "Positioning", "Guidelines", "Naming"],
  },
  {
    slug: "social",
    number: "02",
    title: "Social Media Management",
    blurb:
      "Full-service social media strategy, content creation, scheduling, and community management across Instagram, LinkedIn, YouTube, and emerging platforms.",
    cardTags: ["Content Strategy", "Copywriting", "Reels", "Analytics"],
    tagline: "Audiences that convert — not just follower counts that look good on paper.",
    whatItIs:
      "Social media management is the ongoing, strategic operation of your brand's digital presence. We handle everything: strategy, content calendars, copywriting, design, scheduling, community management, and analytics.",
    howItWorks:
      "We build a platform-specific content strategy aligned to your business objectives. Our creative team produces platform-native content: short-form videos, thought leadership, and campaign content. We manage your community and deliver monthly reports with actionable insights.",
    features: [
      { title: "Content Strategy", body: "Monthly content calendars built around audience behavior, trends, and business goals." },
      { title: "Creative Production", body: "Reels, carousels, static posts, stories — all produced in-house to brand standards." },
      { title: "Community Management", body: "Daily engagement, comment responses, DM management, and audience relationship building." },
      { title: "Analytics & Reporting", body: "Monthly performance reports with reach, engagement, follower growth, and conversion data." },
    ],
    detailTags: ["Content Strategy", "Copywriting", "Reels", "Analytics", "Growth", "Community"],
  },
  {
    slug: "performance",
    number: "03",
    title: "Performance Marketing",
    blurb:
      "Data-driven paid media campaigns across Meta, Google, and YouTube that generate measurable ROI — built on precision targeting, creative testing, and continuous optimization.",
    cardTags: ["Meta Ads", "Google Ads", "ROI", "Retargeting"],
    tagline: "Paid media that pays back — with precision, not guesswork.",
    whatItIs:
      "Performance marketing is the science of paid digital advertising — deploying budget across Meta, Google, and YouTube with surgical precision to generate measurable outcomes: leads, sales, and revenue. Every rupee is tracked. Every creative is tested. Every campaign is optimized against real business results.",
    howItWorks:
      "We begin with audience research and funnel mapping. We build campaign architectures across awareness, consideration, and conversion stages. Our creative team produces multiple ad variants for A/B testing. We launch, monitor daily, optimize weekly, and scale what works.",
    features: [
      { title: "Audience Research", body: "Deep-dive into customer personas, behavior patterns, and targeting parameters." },
      { title: "Campaign Architecture", body: "Full-funnel campaign structures across awareness, retargeting, and conversion." },
      { title: "Creative Testing", body: "Systematic A/B testing of headlines, visuals, CTAs, and landing pages." },
      { title: "Continuous Optimization", body: "Daily monitoring, weekly optimization, and monthly strategy recalibration." },
    ],
    detailTags: ["Meta Ads", "Google Ads", "ROI", "Retargeting", "A/B Testing", "Conversion"],
  },
  {
    slug: "production",
    number: "04",
    title: "Creative Production",
    blurb:
      "Cinematic-quality video production, photography, and content creation for brand films, commercial shoots, digital series, and social-first content at every scale.",
    cardTags: ["Brand Films", "Photography", "Reels", "Post Production"],
    tagline: "Cinematic quality. Commercial intelligence. Every frame works harder.",
    whatItIs:
      "Creative production is where strategy becomes reality — the full-service production of video content, photography, and visual assets, executed at cinematic quality. From concept to delivery, we handle every element of the production process under one roof through Golden Guardian Productions.",
    howItWorks:
      "Every project begins with a detailed creative brief and concept development. Our pre-production team handles scripting, storyboarding, and talent coordination. On production days, we deploy professional crew. Post-production includes color grading, sound design, motion graphics, and platform-specific formatting.",
    features: [
      { title: "Brand Films", body: "Long-form cinematic content that communicates your brand's vision, values, and story." },
      { title: "Commercial Shoots", body: "Product and service commercials designed for broadcast, digital, and social placement." },
      { title: "Social-First Content", body: "Short-form Reels, Shorts, and platform-native video optimized for engagement." },
      { title: "Photography", body: "Product, lifestyle, editorial, and event photography for all brand applications." },
    ],
    detailTags: ["Brand Films", "Photography", "Reels", "Music Videos", "Post Production"],
  },
  {
    slug: "pr",
    number: "05",
    title: "Public Relations & Media",
    blurb:
      "Strategic PR and media campaigns that build credibility and authority — press coverage, media relationships, influencer partnerships, event PR, and crisis communications.",
    cardTags: ["Press Coverage", "Influencer", "Events", "Crisis Comms"],
    tagline: "Earning attention money cannot buy — building credibility that lasts.",
    whatItIs:
      "Public Relations is the strategic management of your brand's reputation and public narrative. At Kreatif Atelier, PR is not press releases — it's a sophisticated media and influence strategy that builds long-term authority across editorial, digital, and community channels.",
    howItWorks:
      "We build a PR roadmap aligned to your business milestones — launches, funding rounds, expansions, or thought leadership campaigns. Our team pitches your stories to journalists and coordinates influencer partnerships, event PR, and crisis communications support.",
    features: [
      { title: "Media Relations", body: "Active relationships with journalists, editors, and publications across key verticals." },
      { title: "Influencer Strategy", body: "Curated influencer partnerships aligned to your brand values and target audience." },
      { title: "Event PR", body: "End-to-end PR support for launches, activations, and brand events." },
      { title: "Crisis Communications", body: "Rapid response and strategic communications when reputational challenges emerge." },
    ],
    detailTags: ["Press Coverage", "Influencer", "Events", "Crisis Comms", "Media Outreach"],
  },
  {
    slug: "campaigns",
    number: "06",
    title: "Creative Direction & Campaigns",
    blurb:
      "Integrated campaign ideation and execution across digital and physical touchpoints. We conceptualize, design, and deliver campaigns with a singular creative vision.",
    cardTags: ["Art Direction", "Activation", "Launch", "360° Creative"],
    tagline: "Integrated campaigns with a singular vision — from idea to execution.",
    whatItIs:
      "Creative direction is the art of unifying all brand communications under a single, coherent creative vision. An integrated campaign is a coordinated narrative that unfolds across channels, creates cumulative impact, and drives audiences from awareness to action.",
    howItWorks:
      "We begin with a campaign brief: objective, audience, timeline, and budget. Our creative directors develop the big idea that anchors every execution. The idea is then translated across touchpoints — social media, video, digital ads, PR, and activations. Every element connects.",
    features: [
      { title: "Big Idea Development", body: "The central concept that unifies all campaign executions and gives the campaign its identity." },
      { title: "360° Execution", body: "Campaign delivery across social, video, digital, PR, and physical touchpoints." },
      { title: "Launch Strategy", body: "Phased rollout plans for product launches, rebrands, and seasonal campaigns." },
      { title: "Measurement", body: "Defined KPIs, real-time tracking, and end-of-campaign performance analysis." },
    ],
    detailTags: ["Campaign Strategy", "Art Direction", "Activation", "Launch", "360° Creative"],
  },
];

/**
 * The five company pages (WORLD-PLAN.md "COMPANY PAGES"; reference frames A01–A06, G01–G05, V01–V04, S01–S04,
 * R01–R04). Each is a journey through that company's land on the same engine: arrival, one place per offering (each a
 * different text treatment), the company's extra content, and the onward closing (Enquire, Next, Back to the Atlas).
 */
import { about } from "@/content/about";
import { enquireSubject, offeringCopy, pageChapters as C, pageOrder } from "@/content/companies";
import { engagementIntro, tiers } from "@/content/engagement";
import { industries, industriesIntro } from "@/content/industries";
import { journey } from "@/content/journey";
import { processIntro, steps } from "@/content/process";
import { services } from "@/content/services";
import { mailtoHref } from "@/content/site";
import { verticals, type Vertical } from "@/content/verticals";
import type { RouteData } from "@/lib/route-data";
import { slugify, type Def, type Item, type Journey, type Thing } from "../route";

type V3 = [number, number, number];
const v = (slug: Vertical["slug"]) => verticals.find((x) => x.slug === slug)!;
const tagline = (x: Vertical) => x.tagline.map((w) => `${w}.`).join(" ");
const card = (name: string, chapter: string, tag: "h1" | "h2" = "h2"): Item => ({ k: "card", title: tag === "h1" ? name : chapter, sub: tag === "h1" ? chapter : name, tag });

/** Words shown at a place (for the read-twice Watch hold). */
const wordsIn = (items: Item[]) => {
  let n = 0;
  const walk = (o: unknown) => {
    if (typeof o === "string") n += o.split(/\s+/).filter(Boolean).length;
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === "object") for (const [k, val] of Object.entries(o)) if (!["k", "tag", "face", "align", "at", "ring", "side", "room", "href"].includes(k)) walk(val);
  };
  walk(items);
  return n;
};

/** Route data for a company land: a gently winding path forward, the holds long enough to read everything twice. */
function data(defs: Def[], colour: string, light: string, dark: string, origin: V3): RouteData {
  const camera = defs.map((_, i) => {
    const z = origin[2] - i * 34, x = origin[0] + Math.sin(i * 1.1) * 9, y = origin[1] + 2 + Math.sin(i * 0.7) * 1.5;
    return { pos: [x, y, z] as V3, look: [x + Math.sin(i * 1.1 + 0.8) * 6, y + 1.2, z - 40] as V3 };
  });
  return {
    holdSeconds: defs.map((d) => Math.max(6, Math.round(2 + (2 * wordsIn(d.items)) / 3.3))),
    camera,
    anchors: camera.map((c) => c.look),
    colour: defs.map(() => colour),
    atmosphere: { light: defs.map(() => light), dark: defs.map(() => dark) },
  };
}

const onward = (x: Vertical): Item => {
  const k = pageOrder.indexOf(x.slug), next = v(pageOrder[(k + 1) % pageOrder.length]);
  return {
    k: "onward", at: [0.83, 0.62], depth: 14,
    enquire: { label: journey.enquire, href: mailtoHref(enquireSubject(x.name)) },
    next: { label: journey.next(next.name), href: `/${next.slug}` },
    back: { label: journey.backToAtlas, href: "/#atlas" },
  };
};

/** The arrival: the title card, the name set into the land, the tagline and the value line. */
const arrival = (x: Vertical, chapter: number): Def[] => [
  { id: "arrival", chapter, items: [card(x.name, C.arrival, "h1")] },
  { id: "welcome", chapter, items: [
    { k: "head", text: x.name, sub: tagline(x), tag: "h2", face: "serif", at: [0.5, 0.26], size: 12, depth: 60, ornament: true, echo: true },
    { k: "voice", text: x.value, at: [0.5, 0.62], size: 4.6, depth: 24 },
  ] },
];

/** Valora, Asraya, Rudra Yugen: one place per offering, each set differently, with its PROPOSED paragraph. */
function offeringsJourney(x: Vertical): Def[] {
  const copy = offeringCopy[x.slug]!;
  const spots: { at: [number, number]; align: "left" | "right" }[] = [
    { at: [0.12, 0.4], align: "left" }, { at: [0.88, 0.36], align: "right" }, { at: [0.12, 0.62], align: "left" }, { at: [0.88, 0.58], align: "right" },
  ];
  return [
    ...arrival(x, 0),
    ...x.whatWeDo.map((w, i): Def => ({
      id: slugify(w), chapter: 1, items: [
        ...(i === 0 ? [card(x.name, C.offerings)] : []),
        { k: "callouts", items: [{ label: w, ring: [spots[i].align === "left" ? 0.52 : 0.48, 0.66], at: spots[i].at, depth: 18, side: spots[i].align === "left" ? "left" : "right" }] },
        { k: "voice", text: copy[i], at: [spots[i].at[0], spots[i].at[1] + 0.13], size: 2.9, align: spots[i].align, depth: 18 },
      ],
    })),
    { id: "onward", chapter: 2, items: [card(x.name, C.onward), { k: "voice", text: x.value, at: [0.32, 0.3], size: 4.4, depth: 30 }, onward(x)] },
  ];
}

// ---- Aurelius --------------------------------------------------------------------------------------------------------
const aur = v("aurelius");
const serviceThings: Thing[] = services.map((s) => ({ id: s.slug, label: s.title, room: { kind: "service", service: s } }));
const aureliusDefs: Def[] = [
  ...arrival(aur, 0),
  { id: "agency", chapter: 0, items: [{ k: "voice", text: about.intro!, at: [0.62, 0.42], size: 3.4, align: "left", depth: 20 }] },
  { id: "offerings", chapter: 1, items: [
    card(aur.name, C.offerings),
    { k: "pins", items: aur.whatWeDo.map((w, i) => ({ label: w, at: [[0.16, 0.39, 0.62, 0.85][i], 0.3] as [number, number], depth: 40 })) },
  ] },
  { id: "services", chapter: 2, things: serviceThings, items: [
    card(aur.name, C.services),
    { k: "callouts", items: services.map((s, i) => ({ label: s.title, ring: [0.12 + i * 0.152, 0.62] as [number, number], at: [0.12 + i * 0.152, 0.3 + (i % 2) * 0.12] as [number, number], depth: 26, room: s.slug, side: "up" as const })) },
  ] },
  { id: "partnerships", chapter: 3, items: [
    card(aur.name, C.partnerships),
    { k: "list", heading: `${engagementIntro.headline.lead} ${engagementIntro.headline.emphasis}`, items: tiers.map((t) => ({ title: `${t.name} · ${t.price} ${t.period}${t.featured ? ` · ${engagementIntro.featuredBadge}` : ""}`, body: [...t.features, t.note].join(" · ") })), at: [0.6, 0.5], depth: 16, style: "strata" },
  ] },
  { id: "process", chapter: 4, items: [
    card(aur.name, C.process),
    { k: "list", heading: `${processIntro.headline.lead} ${processIntro.headline.emphasis}`, items: steps.map((s) => ({ title: s.title, body: s.body })), at: [0.5, 0.46], depth: 30, style: "profile" },
  ] },
  { id: "industries", chapter: 5, items: [
    card(aur.name, C.industries),
    { k: "list", heading: `${industriesIntro.headline.lead} ${industriesIntro.headline.emphasis}`, items: industries.map((t) => ({ title: t })), at: [0.5, 0.48], depth: 60, style: "stars" },
  ] },
  { id: "onward", chapter: 6, items: [card(aur.name, C.onward), onward(aur)] },
];

// ---- Golden Guardian Productions ------------------------------------------------------------------------------------
const ggp = v("golden-guardian-productions");
const production = services.find((s) => s.slug === "production")!;
const ggpDefs: Def[] = [
  ...arrival(ggp, 0),
  // One chamber per offering, each a different moving picture made of light (zoetrope, shadow play, light painting,
  // camera obscura); the chart gives one line, so the chamber carries the name and the value line only.
  ...ggp.whatWeDo.map((w, i): Def => ({
    id: slugify(w), chapter: 1, items: [
      ...(i === 0 ? [card(ggp.name, C.offerings)] : []),
      { k: "head", text: w, tag: "h2", face: "serif", at: [i % 2 ? 0.7 : 0.3, 0.28], size: 7, depth: 30, ornament: true },
    ],
  })),
  { id: "showreel", chapter: 2, things: [{ id: production.slug, label: production.title, room: { kind: "service", service: production } }], items: [
    card(ggp.name, C.showreel),
    { k: "list", heading: production.title, items: production.features.map((f) => ({ title: f.title })), at: [0.5, 0.48], depth: 24, style: "reel" },
    { k: "callouts", items: [{ label: production.title, ring: [0.5, 0.8], at: [0.62, 0.86], depth: 20, room: production.slug, side: "right" }] },
  ] },
  { id: "onward", chapter: 3, items: [card(ggp.name, C.onward), { k: "voice", text: ggp.value, at: [0.32, 0.3], size: 4.4, depth: 30 }, onward(ggp)] },
];

const make = (x: Vertical, defs: Def[], chapters: string[], colour: string, light: string, dark: string, origin: V3): Journey => ({
  id: x.slug,
  path: `/${x.slug}`,
  chapters,
  chapterName: (c) => `${x.name} · ${chapters[c]}`,
  defs,
  data: data(defs, colour, light, dark, origin),
  aliases: { pricing: { place: "partnerships" }, services: { place: "services" } },
});

export const companies: Journey[] = [
  make(aur, aureliusDefs, [C.arrival, C.offerings, C.services, C.partnerships, C.process, C.industries, C.onward], "#3D4BFF", "#3A3D82", "#0A0B28", [0, 6, 0]),
  make(ggp, ggpDefs, [C.arrival, C.offerings, C.showreel, C.onward], "#E8307F", "#4A1036", "#1C0513", [0, 6, 0]),
  make(v("valora"), offeringsJourney(v("valora")), [C.arrival, C.offerings, C.onward], "#FF6A3D", "#F39A7A", "#200E0A", [0, 6, 0]),
  make(v("asraya"), offeringsJourney(v("asraya")), [C.arrival, C.offerings, C.onward], "#23C27C", "#D4E7DA", "#081C14", [0, 4, 0]),
  make(v("rudra-yugen"), offeringsJourney(v("rudra-yugen")), [C.arrival, C.offerings, C.onward], "#0FB5E4", "#9EDCEB", "#051720", [0, 6, 0]),
];

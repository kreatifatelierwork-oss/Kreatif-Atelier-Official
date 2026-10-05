/** The home journey (WORLD-PLAN.md "HOME PAGE route"): one place per reference frame H01–H36, twelve chapters. */
import { about } from "@/content/about";
import { chapterNumber, chapters, journey } from "@/content/journey";
import { founders, foundersIntro } from "@/content/founders";
import { industries, industriesIntro } from "@/content/industries";
import { processIntro, steps } from "@/content/process";
import { services } from "@/content/services";
import { contact, hero } from "@/content/site";
import { holding, impact, serves, verticals } from "@/content/verticals";
import { reasons, whyIntro } from "@/content/why";
import { routeData } from "@/lib/route-data";
import { slugify, type Def, type Item, type Journey, type Thing } from "../route";

const pillar = (i: number) => about.pillars[i];
const room = (i: number): Thing => ({ id: slugify(pillar(i).title), label: pillar(i).title, room: { kind: "text", title: pillar(i).title, body: pillar(i).body } });
const v = (slug: string) => verticals.find((x) => x.slug === slug)!;
const tagline = (slug: string) => v(slug).tagline.map((w) => `${w}.`).join(" ");
const card = (chapter: number, tag: "h1" | "h2" = "h2"): Item => ({ k: "card", title: chapters[chapter], sub: chapterNumber(chapter), tag });

const defs: Def[] = [
  // ---- 1 The Seed -------------------------------------------------------------------------------------------------
  { id: "seed", chapter: 0, items: [{ k: "card", title: holding.name, sub: `${chapters[0]} · ${chapterNumber(0)}`, tag: "h1" }] },
  { id: "drop", chapter: 0, items: [
    { k: "voice", text: contact.body.split(". ")[0] + ".", at: [0.595, 0.29], size: 4.6, align: "left", depth: 5 },
  ] },
  { id: "title", chapter: 0, items: [
    { k: "head", text: holding.name, sub: holding.lines.ecosystem, tag: "p", face: "light", at: [0.5, 0.335], size: 7.6, depth: 26, tilt: 3, echo: true },
  ] },
  { id: "legacy", chapter: 0, items: [
    { k: "head", text: hero.positioning[0], sub: hero.positioning[1], tag: "h2", face: "light", at: [0.47, 0.385], size: 6.2, depth: 13, drawn: true },
  ] },
  { id: "about", chapter: 0, things: [room(0), room(1), room(2), room(3)], items: [
    { k: "callouts", items: [
      { label: pillar(0).title, ring: [0.15, 0.14], at: [0.24, 0.21], depth: 7, room: slugify(pillar(0).title), side: "right" },
      { label: pillar(1).title, ring: [0.435, 0.31], at: [0.49, 0.335], depth: 16, room: slugify(pillar(1).title), side: "right" },
      { label: pillar(2).title, ring: [0.72, 0.32], at: [0.745, 0.28], depth: 20, room: slugify(pillar(2).title), side: "right" },
      { label: pillar(3).title, ring: [0.8, 0.53], at: [0.845, 0.462], depth: 11, room: slugify(pillar(3).title), side: "right" },
    ] },
  ] },
  { id: "operate", chapter: 0, things: [room(1)], items: [
    { k: "pins", heading: { text: pillar(1).title, at: [0.75, 0.37], size: 5.6 }, items: [
      // West to east as on a map of Hyderabad (X05).
      { label: "Gachibowli", at: [0.17, 0.52], depth: 5.5 },
      { label: "HITEC City", at: [0.25, 0.38], depth: 5.5 },
      { label: "Jubilee Hills", at: [0.36, 0.45], depth: 5.5 },
      { label: "Banjara Hills", at: [0.43, 0.56], depth: 5.5 },
      { label: "Secunderabad", at: [0.53, 0.29], depth: 5.5 },
    ] },
  ] },
  // ---- 2 The Climb ------------------------------------------------------------------------------------------------
  { id: "climb", chapter: 1, items: [
    card(1),
    { k: "voice", text: about.quote.text, at: [0.55, 0.45], size: 5, depth: 10, drawn: true },
  ] },
  { id: "motto", chapter: 1, items: [
    { k: "head", text: holding.motto.join(" | "), tag: "p", face: "light", at: [0.5, 0.45], size: 9, depth: 40, drawn: true },
  ] },
  { id: "numerals", chapter: 1, items: [{ k: "numerals", at: [0.5, 0.27], depth: 120 }] },
  // ---- 3 Above the Canopy -----------------------------------------------------------------------------------------
  { id: "holding", chapter: 2, items: [
    card(2),
    { k: "head", text: holding.name, sub: holding.descriptor, line: holding.lines.verticals, tag: "h2", face: "serif", at: [0.5, 0.23], size: 11.5, depth: 140, ornament: true },
  ] },
  { id: "vision", chapter: 2, items: [{ k: "arc", label: holding.labels.vision, text: holding.vision, depth: 120 }] },
  // ---- 4 The Five Peaks -------------------------------------------------------------------------------------------
  { id: "pillars", chapter: 3, items: [
    card(3),
    { k: "pins", heading: { text: journey.fivePillars, at: [0.5, 0.16], size: 8.5 }, items: [
      { label: holding.pillars[0], at: [0.13, 0.31], depth: 120 },
      { label: holding.pillars[1], at: [0.32, 0.345], depth: 112 },
      { label: holding.pillars[2], at: [0.5, 0.275], depth: 130 },
      { label: holding.pillars[3], at: [0.7, 0.345], depth: 112 },
      { label: holding.pillars[4], at: [0.89, 0.345], depth: 120 },
    ] },
  ] },
  { id: "atlas", chapter: 3, items: [
    { k: "pins", items: [
      { label: "Aurelius", at: [0.19, 0.25], depth: 230 },
      { label: "Golden Guardian Productions", at: [0.5, 0.17], depth: 270 },
      { label: "Valora", at: [0.84, 0.32], depth: 240 },
      { label: "Asraya", at: [0.268, 0.53], depth: 200 },
      { label: "Rudra Yugen", at: [0.78, 0.6], depth: 205 },
    ] },
  ] },
  // ---- 5 Aurelius -------------------------------------------------------------------------------------------------
  { id: "aurelius", chapter: 4, items: [
    card(4),
    { k: "head", text: v("aurelius").name, sub: tagline("aurelius"), tag: "h2", face: "serif", at: [0.745, 0.3], size: 12.5, depth: 60 },
  ] },
  { id: "aurelius-offerings", chapter: 4, items: [
    { k: "pins", items: v("aurelius").whatWeDo.map((w, i) => ({ label: w, at: [[0.33, 0.475, 0.67, 0.86][i], [0.28, 0.17, 0.17, 0.14][i]] as const, depth: 40 })) },
    { k: "voice", text: v("aurelius").value, at: [0.5, 0.8], size: 5, depth: 30 },
  ] },
  { id: "aurelius-portal", chapter: 4, items: [
    { k: "list", items: services.map((s) => ({ title: s.title })), at: [0.85, 0.36], depth: 18, style: "carved" },
    { k: "button", label: journey.enter("Aurelius"), at: [0.685, 0.535], depth: 14, href: "/aurelius" },
  ] },
  // ---- 6 Golden Guardian Productions ------------------------------------------------------------------------------
  { id: "ggp-mouth", chapter: 5, items: [card(5)] },
  { id: "ggp", chapter: 5, items: [
    { k: "head", text: v("golden-guardian-productions").name, sub: tagline("golden-guardian-productions"), tag: "h2", face: "serif", at: [0.5, 0.2], size: 6, depth: 50 },
  ] },
  { id: "ggp-projection", chapter: 5, items: [
    { k: "list", items: v("golden-guardian-productions").whatWeDo.map((w) => ({ title: w })), at: [0.64, 0.38], depth: 40, style: "credits" },
    { k: "voice", text: v("golden-guardian-productions").value, at: [0.59, 0.75], size: 3.2, depth: 30 },
    { k: "button", label: journey.enter("Golden Guardian Productions"), at: [0.59, 0.815], depth: 26, href: "/golden-guardian-productions" },
  ] },
  // ---- 7 Valora ---------------------------------------------------------------------------------------------------
  { id: "valora-coast", chapter: 6, items: [card(6)] },
  { id: "valora", chapter: 6, items: [
    { k: "head", text: v("valora").name, sub: tagline("valora"), tag: "h2", face: "serif", at: [0.54, 0.6], size: 13, depth: 90 },
  ] },
  { id: "valora-reef", chapter: 6, items: [
    { k: "pins", items: v("valora").whatWeDo.map((w, i) => ({ label: w, at: [[0.145, 0.43, 0.68, 0.875][i], [0.31, 0.44, 0.48, 0.55][i]] as const, depth: 14 })) },
    { k: "voice", text: v("valora").value, at: [0.5, 0.71], size: 3.2, depth: 12 },
    { k: "button", label: journey.enter("Valora"), at: [0.5, 0.795], depth: 10, href: "/valora" },
  ] },
  // ---- 8 Asraya ---------------------------------------------------------------------------------------------------
  { id: "asraya-surface", chapter: 7, items: [card(7)] },
  { id: "asraya", chapter: 7, items: [
    { k: "head", text: v("asraya").name, sub: tagline("asraya"), tag: "h2", face: "serif", at: [0.54, 0.43], size: 11, depth: 70, ornament: true },
  ] },
  { id: "asraya-lanterns", chapter: 7, items: [
    { k: "pins", items: v("asraya").whatWeDo.map((w, i) => ({ label: w, at: [[0.245, 0.43, 0.68, 0.865][i], [0.56, 0.535, 0.545, 0.56][i]] as const, depth: 20 })) },
    { k: "voice", text: v("asraya").value, at: [0.5, 0.73], size: 3.2, depth: 16 },
    { k: "button", label: journey.enter("Asraya"), at: [0.5, 0.8], depth: 14, href: "/asraya" },
  ] },
  // ---- 9 Rudra Yugen ----------------------------------------------------------------------------------------------
  { id: "rudra-glacier", chapter: 8, items: [card(8)] },
  { id: "rudra", chapter: 8, items: [
    { k: "head", text: v("rudra-yugen").name, sub: tagline("rudra-yugen"), tag: "h2", face: "serif", at: [0.52, 0.5], size: 9, depth: 45, ornament: true },
    { k: "callouts", items: v("rudra-yugen").whatWeDo.map((w, i) => ({ label: w, ring: [[0.38, 0.29, 0.66, 0.75][i], [0.3, 0.51, 0.32, 0.52][i]] as const, at: [[0.2, 0.14, 0.75, 0.85][i], [0.2, 0.42, 0.22, 0.43][i]] as const, depth: 40, side: (i % 2 ? "right" : "left") as "left" | "right" })) },
  ] },
  { id: "rudra-aurora", chapter: 8, items: [
    { k: "voice", text: v("rudra-yugen").value, at: [0.5, 0.71], size: 3.2, depth: 30 },
    { k: "button", label: journey.enter("Rudra Yugen"), at: [0.5, 0.8], depth: 26, href: "/rudra-yugen" },
  ] },
  // ---- 10 The Summit ----------------------------------------------------------------------------------------------
  { id: "summit", chapter: 9, items: [
    card(9),
    { k: "head", text: holding.lines.tomorrow, tag: "h2", face: "serif", at: [0.5, 0.22], size: 8, depth: 120, ornament: true },
  ] },
  { id: "serves", chapter: 9, items: [
    { k: "pins", heading: { text: holding.labels.serves, at: [0.5, 0.165], size: 7 }, items: serves.map((s, i) => ({ label: s, at: [[0.29, 0.21, 0.27, 0.74, 0.86, 0.78][i], [0.305, 0.485, 0.67, 0.325, 0.485, 0.685][i]] as const, depth: 120 })) },
  ] },
  { id: "impact", chapter: 9, items: [
    { k: "pins", heading: { text: holding.labels.impact, at: [0.5, 0.16], size: 9 }, items: impact.map((s, i) => ({ label: s, at: [[0.22, 0.15, 0.18, 0.78, 0.84, 0.82][i], [0.285, 0.475, 0.69, 0.265, 0.48, 0.695][i]] as const, depth: 110 })) },
  ] },
  { id: "why-us", chapter: 9, items: [
    { k: "list", heading: `${whyIntro.headline.lead} ${whyIntro.headline.emphasis}`, items: reasons.map((r) => ({ title: r.title, body: r.body })), at: [0.65, 0.48], depth: 10, style: "journal" },
  ] },
  // ---- 11 The Night Sky -------------------------------------------------------------------------------------------
  { id: "founders", chapter: 10, items: [
    card(10),
    { k: "list", heading: `${foundersIntro.headline.lead} ${foundersIntro.headline.emphasis}`, items: founders.map((f) => ({ title: f.name, body: f.role })), at: [0.5, 0.45], depth: 60, style: "credits" },
  ] },
  { id: "industries", chapter: 10, items: [
    { k: "list", heading: `${industriesIntro.headline.lead} ${industriesIntro.headline.emphasis}`, items: industries.map((t) => ({ title: t })), at: [0.5, 0.45], depth: 200, style: "stars" },
  ] },
  { id: "process", chapter: 10, items: [
    { k: "list", heading: `${processIntro.headline.lead} ${processIntro.headline.emphasis}`, items: steps.map((s) => ({ title: s.title, body: s.body })), at: [0.5, 0.42], depth: 80, style: "profile" },
  ] },
  // ---- 12 Return --------------------------------------------------------------------------------------------------
  { id: "contact", chapter: 11, items: [card(11), { k: "closing", at: [0.72, 0.4], depth: 20 }] },
];


/** Section links people will share (`/#founders`, `/#pricing` …) → a place and (optionally) a room. */
const aliases: Journey["aliases"] = {
  home: { place: "seed" },
  "who-we-are": { place: "about" },
  "what-we-are": { place: "about", thing: "what-we-are" },
  "our-philosophy": { place: "about", thing: "our-philosophy" },
  services: { place: "aurelius-portal" },
  pricing: { place: "aurelius" },
  "engagement-models": { place: "aurelius" },
  "golden-guardian-productions": { place: "ggp" },
  "rudra-yugen": { place: "rudra" },
  pillars: { place: "pillars" },
  ecosystem: { place: "atlas" },
  "why-us": { place: "why-us" },
  "how-we-work": { place: "process" },
};


export const home: Journey = {
  id: "home",
  path: "/",
  chapters: [...chapters],
  chapterName: (c) => chapters[c],
  defs,
  data: routeData,
  aliases,
};

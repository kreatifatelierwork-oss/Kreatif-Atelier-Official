/**
 * The route: every place in order, what it says (ported word for word from the content files; punctuation per C3 at
 * render) and the things in it. A thing can be hovered (it answers in the scene), and when it has a room it can be
 * Entered: a sub-space with the full text, its own link and Back. Places, captions and rooms are data; components
 * only render them.
 */
import { about } from "@/content/about";
import { engagementIntro, tiers, type Tier } from "@/content/engagement";
import { places, type Act, type PlaceId } from "@/content/experience";
import { film, titleCard } from "@/content/film";
import { founders, foundersIntro, type Founder } from "@/content/founders";
import { industries, industriesIntro } from "@/content/industries";
import { processIntro, steps } from "@/content/process";
import { services, servicesIntro, type Service } from "@/content/services";
import { contact } from "@/content/site";
import { holding, impact, serves, verticals, type Vertical } from "@/content/verticals";
import { reasons, whyIntro } from "@/content/why";
import { experienceConfig as X } from "@/lib/experience";

/** "07 · How We Work" → "How We Work" (the live site's section names, without their numbers). */
export const unnumbered = (marker: string) => marker.split(" · ").slice(1).join(" · ");
export const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export type Room =
  /** An About panel. */
  | { kind: "text"; title: string; body: string }
  /** One service, in full. */
  | { kind: "service"; service: Service }
  /** All six services: the overview that leads into each one. */
  | { kind: "services"; title: string; intro: string; ids: string[] }
  /** The engagement models as credit blocks, prices exactly as they are. */
  | { kind: "formats"; title: string; tiers: readonly Tier[]; badge: string }
  /** A composed moment over the scene: one statement or one list per screen (pillars, vision, serves, impact). */
  | { kind: "moment"; label: string; lines: readonly string[]; voice?: boolean }
  /** A sequence of named items with their text (the process, why us). */
  | { kind: "sequence"; title: string; intro?: string; items: readonly { title: string; body: string }[] };

export type Thing = {
  id: string;
  label: string;
  room?: Room;
  /** Reachable by link and from other rooms, but not listed in its place (e.g. each service inside "Our Services"). */
  hidden?: boolean;
  /** A founder print in the Gallery: selecting it shows the bio beside the arc (no room). */
  founder?: Founder;
};

export type Caption = {
  title: string;
  /** Title set as a split headline (lead + italic emphasis in the same family). */
  emphasis?: string;
  /** The hand-written word, set on its own line under the title (approved 2026-10-01). */
  signature?: string;
  /** A small utility line above the title (used once, on the title card). */
  kicker?: string;
  stacked?: readonly string[];
  voice?: readonly string[];
  body?: readonly string[];
  /** A named list (a vertical's four offerings, the six services). */
  list?: readonly string[];
};

export type ActionId = "findTheAngle" | "roll" | "launch" | "layAStone" | "breathe" | "spark";

export type Place = {
  id: PlaceId;
  index: number;
  name: string;
  act: Act;
  caption: Caption;
  things: Thing[];
  action?: ActionId;
  /** The place's vivid colour (C5), or null where gold is the only accent. */
  colour: string | null;
};

const v = (slug: Vertical["slug"]) => verticals.find((x) => x.slug === slug)!;

/** A vertical's place: its name, the tagline as three stacked words, its value line and its four offerings. */
const verticalCaption = (x: Vertical, extra: Partial<Caption> = {}): Caption => ({
  title: x.name,
  stacked: x.tagline,
  voice: [x.value],
  ...extra,
});
/** The four offerings stand in the scene (hover answers there); they have no room of their own. */
const offerings = (x: Vertical): Thing[] => x.whatWeDo.map((w) => ({ id: slugify(w), label: w }));

const serviceThings: Thing[] = services.map((s) => ({ id: slugify(s.title), label: s.title, room: { kind: "service", service: s }, hidden: true }));
const servicesRoom: Thing = {
  id: "services",
  label: unnumbered(servicesIntro.marker),
  room: { kind: "services", title: unnumbered(servicesIntro.marker), intro: servicesIntro.intro ?? "", ids: serviceThings.map((t) => t.id) },
};
const formatsRoom: Thing = {
  id: "engagement-models",
  label: unnumbered(engagementIntro.marker),
  room: { kind: "formats", title: unnumbered(engagementIntro.marker), tiers, badge: engagementIntro.featuredBadge },
};

const content: Record<PlaceId, { caption: Caption; things?: Thing[]; action?: ActionId }> = {
  atrium: {
    caption: {
      kicker: titleCard.motto.join(" | "),
      title: `${titleCard.lead} ${titleCard.signature}`,
      signature: titleCard.signature,
      voice: [holding.lines.ecosystem],
    },
  },
  studio: {
    caption: { title: about.headline.lead, emphasis: about.headline.emphasis, voice: [about.quote.text] },
    things: about.pillars.map((p) => ({ id: slugify(p.title), label: p.title, room: { kind: "text", title: p.title, body: p.body } })),
  },
  aurelius: {
    caption: verticalCaption(v("aurelius"), { body: about.intro ? [about.intro] : [], list: v("aurelius").whatWeDo }),
    things: [...offerings(v("aurelius")), servicesRoom, formatsRoom, ...serviceThings],
    action: "findTheAngle",
  },
  ggp: {
    caption: verticalCaption(v("golden-guardian-productions"), { list: v("golden-guardian-productions").whatWeDo }),
    things: [
      ...offerings(v("golden-guardian-productions")),
      { id: "creative-production", label: services.find((s) => s.slug === "production")!.title, room: { kind: "service", service: services.find((s) => s.slug === "production")! } },
    ],
    action: "roll",
  },
  concourse: {
    caption: {
      title: industriesIntro.headline.lead,
      emphasis: industriesIntro.headline.emphasis,
      list: services.map((s) => s.title),
    },
    things: [
      {
        id: slugify(unnumbered(processIntro.marker)),
        label: unnumbered(processIntro.marker),
        room: { kind: "sequence", title: unnumbered(processIntro.marker), intro: processIntro.intro, items: steps },
      },
    ],
    action: "launch",
  },
  valora: { caption: verticalCaption(v("valora"), { list: v("valora").whatWeDo }), things: offerings(v("valora")), action: "layAStone" },
  asraya: { caption: verticalCaption(v("asraya"), { list: v("asraya").whatWeDo }), things: offerings(v("asraya")), action: "breathe" },
  rudra: { caption: verticalCaption(v("rudra-yugen"), { list: v("rudra-yugen").whatWeDo }), things: offerings(v("rudra-yugen")), action: "spark" },
  roof: {
    caption: {
      title: holding.lines.verticals,
      body: [`${holding.name}: ${holding.descriptor.toLowerCase()}.`],
      voice: [holding.lines.tomorrow],
    },
    things: [
      { id: "vision", label: holding.labels.vision, room: { kind: "moment", label: holding.labels.vision, lines: [holding.vision], voice: true } },
      { id: "pillars", label: holding.labels.pillars, room: { kind: "moment", label: holding.labels.pillars, lines: holding.pillars } },
      { id: "our-ecosystem-serves", label: holding.labels.serves, room: { kind: "moment", label: holding.labels.serves, lines: serves } },
      { id: "impact", label: holding.labels.impact, room: { kind: "moment", label: holding.labels.impact, lines: impact } },
    ],
  },
  gallery: {
    caption: {
      kicker: film.credit,
      title: foundersIntro.headline.lead,
      emphasis: foundersIntro.headline.emphasis,
      voice: [titleCard.lineA, titleCard.lineB],
      stacked: titleCard.values,
    },
    things: [
      ...founders.map((f) => ({ id: f.slug, label: f.name, founder: f })),
      {
        id: slugify(unnumbered(whyIntro.marker)),
        label: unnumbered(whyIntro.marker),
        room: { kind: "sequence", title: unnumbered(whyIntro.marker), intro: whyIntro.intro, items: reasons },
      },
    ],
  },
  post: {
    caption: { title: contact.headline.lead, emphasis: contact.headline.emphasis, body: [contact.body] },
  },
};

export const route: Place[] = places.map((p, index) => ({
  ...p,
  index,
  colour: X.colour[index],
  caption: content[p.id].caption,
  things: content[p.id].things ?? [],
  action: content[p.id].action,
}));

export const LAST = route.length - 1;

/** Film-time (s) at which each place's hold begins, and the total running time. */
export const placeStart: number[] = [];
{
  let t = 0;
  for (let i = 0; i < route.length; i++) {
    placeStart.push(t);
    t += X.holdSeconds[i] + (i < LAST ? X.travelSeconds : 0);
  }
}
export const runningTime = placeStart[LAST] + X.holdSeconds[LAST];

/** Film-time at route position s (passage time is proportional to progress through the passage). */
export function filmTimeAt(s: number, holdElapsed = 0) {
  const i = Math.max(0, Math.min(LAST, Math.floor(s)));
  const f = s - i;
  if (f <= 0) return placeStart[i] + Math.min(holdElapsed, X.holdSeconds[i]);
  return placeStart[i] + X.holdSeconds[i] + f * X.travelSeconds;
}

const placeIndex = (id: PlaceId) => route.findIndex((p) => p.id === id);

/** Section links people will share: `/#founders`, `/#services`, `/#pricing` … → a place and (optionally) a room. */
export const aliases: Record<string, { place: PlaceId; thing?: string }> = {
  home: { place: "atrium" },
  about: { place: "studio" },
  "who-we-are": { place: "studio" },
  services: { place: "aurelius", thing: "services" },
  "engagement-models": { place: "aurelius", thing: "engagement-models" },
  pricing: { place: "aurelius", thing: "engagement-models" },
  "golden-guardian-productions": { place: "ggp" },
  "rudra-yugen": { place: "rudra" },
  industries: { place: "concourse" },
  process: { place: "concourse", thing: "how-we-work" },
  "how-we-work": { place: "concourse", thing: "how-we-work" },
  holding: { place: "roof" },
  vision: { place: "roof", thing: "vision" },
  pillars: { place: "roof", thing: "pillars" },
  serves: { place: "roof", thing: "our-ecosystem-serves" },
  impact: { place: "roof", thing: "impact" },
  founders: { place: "gallery" },
  "why-us": { place: "gallery", thing: "why-kreatif-atelier" },
  contact: { place: "post" },
};

/** Deep links: `#aurelius`, `#aurelius/brand-strategy-and-identity`, or an alias (`#founders`, `#gallery/rohan`). */
export function parseHash(hash: string): { place: number; thing?: string } | null {
  const [pid, tid] = decodeURIComponent(hash.replace(/^#/, "")).split("/");
  const alias = aliases[pid];
  const place = alias ? placeIndex(alias.place) : route.findIndex((p) => p.id === pid);
  if (place < 0) return null;
  const want = tid ?? alias?.thing;
  const thing = want && route[place].things.some((t) => t.id === want && t.room) ? want : undefined;
  return { place, thing };
}
export const hashFor = (place: number, thing?: string | null) => `#${route[place].id}${thing ? `/${thing}` : ""}`;

/**
 * The route of /experience: every place in order, what it says (all ported word for word from the content files) and
 * the things in it you can Enter. Places, captions and rooms are data; components only render them.
 */
import { about } from "@/content/about";
import { tiers, engagementIntro, type Tier } from "@/content/engagement";
import { places, type Act, type PlaceId } from "@/content/experience";
import { film, titleCard } from "@/content/film";
import { founders, type Founder } from "@/content/founders";
import { industries, industriesIntro } from "@/content/industries";
import { processIntro, steps } from "@/content/process";
import { services, servicesIntro, type Service } from "@/content/services";
import { contact, site } from "@/content/site";
import { holding, impact, serves, verticals, type Vertical } from "@/content/verticals";
import { reasons, whyIntro } from "@/content/why";
import { experienceConfig as X } from "@/lib/config";

export type Room =
  | { kind: "text"; title: string; body: string }
  | { kind: "service"; service: Service }
  | { kind: "founder"; founder: Founder }
  | { kind: "format"; tier: Tier; badge?: string };

/** Something in the scene: it reacts to hover / focus, and opens a room when it has one. */
export type Thing = { id: string; label: string; room?: Room };

export type Caption = {
  eyebrow?: string;
  title: string;
  /** The hand-written word, set on its own line under the title (approved 2026-10-01). */
  signature?: string;
  /** Title set as a split headline (lead + italic emphasis in the same family). */
  emphasis?: string;
  stacked?: readonly string[];
  voice?: readonly string[];
  body?: readonly string[];
  list?: readonly string[];
  steps?: readonly string[];
  /** Further labelled lists (the Roof, the credits). */
  groups?: readonly { label?: string; items: readonly string[] }[];
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

const svc = (slug: string) => services.find((s) => s.slug === slug)!;
const v = (slug: Vertical["slug"]) => verticals.find((x) => x.slug === slug)!;
const step = (n: string) => steps.find((s) => s.number === n)!.title;
/** "07 · How We Work" → "How We Work" (the live site's section names, without their numbers). */
const unnumbered = (marker: string) => marker.split(" · ").slice(1).join(" · ");
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** A vertical's place: its name, tagline (stacked), value line and its four "what we do" things. */
function verticalCaption(x: Vertical, extra: Partial<Caption> = {}): Caption {
  return { title: x.name, stacked: x.tagline, voice: [x.value], list: x.whatWeDo, ...extra };
}
const verticalThings = (x: Vertical, rooms: Record<string, Room> = {}): Thing[] =>
  x.whatWeDo.map((w) => ({ id: slugify(w), label: w, room: rooms[w] }));
const serviceThing = (slug: string): Thing => {
  const s = svc(slug);
  return { id: slugify(s.title), label: s.title, room: { kind: "service", service: s } };
};

const content: Record<PlaceId, { caption: Caption; things?: Thing[]; action?: ActionId }> = {
  atrium: {
    caption: {
      title: `${titleCard.lead} ${titleCard.signature}`,
      signature: titleCard.signature,
      voice: [titleCard.lineA, titleCard.lineB],
      steps: titleCard.values,
      groups: [{ items: [titleCard.motto.join(" | ")] }, { items: [holding.lines.ecosystem] }],
    },
  },
  studio: {
    caption: { eyebrow: film.acts[1], title: about.headline.lead, emphasis: about.headline.emphasis, voice: [about.quote.text] },
    things: about.pillars.map((p) => ({ id: slugify(p.title), label: p.title, room: { kind: "text", title: p.title, body: p.body } })),
  },
  aurelius: {
    caption: verticalCaption(v("aurelius"), { eyebrow: film.acts[2], body: about.intro ? [about.intro] : [], steps: [step("01"), step("02")] }),
    things: verticalThings(v("aurelius"), { "Brand Strategy & Identity": { kind: "service", service: svc("brand") } }),
    action: "findTheAngle",
  },
  ggp: {
    caption: verticalCaption(v("golden-guardian-productions"), { eyebrow: film.acts[3], steps: [step("03")] }),
    things: [...verticalThings(v("golden-guardian-productions")), serviceThing("production"), serviceThing("campaigns")],
    action: "roll",
  },
  concourse: {
    caption: {
      eyebrow: film.acts[4],
      title: industriesIntro.headline.lead,
      emphasis: industriesIntro.headline.emphasis,
      steps: [step("04"), step("05")],
      list: industries,
    },
    things: [serviceThing("social"), serviceThing("performance"), serviceThing("pr")],
    action: "launch",
  },
  valora: { caption: verticalCaption(v("valora"), { eyebrow: film.acts[5] }), things: verticalThings(v("valora")), action: "layAStone" },
  asraya: { caption: verticalCaption(v("asraya"), { eyebrow: film.acts[5] }), things: verticalThings(v("asraya")), action: "breathe" },
  rudra: { caption: verticalCaption(v("rudra-yugen"), { eyebrow: film.acts[6] }), things: verticalThings(v("rudra-yugen")), action: "spark" },
  roof: {
    caption: {
      eyebrow: film.acts[7],
      title: holding.lines.verticals,
      voice: [holding.lines.tomorrow],
      body: [`${holding.name}: ${holding.descriptor.toLowerCase()}.`],
      groups: [
        { label: holding.labels.vision, items: [holding.vision] },
        { label: holding.labels.pillars, items: holding.pillars },
        { label: holding.labels.serves, items: serves },
        { label: holding.labels.impact, items: impact },
      ],
    },
  },
  gallery: {
    caption: {
      title: film.credit,
      groups: [
        ...verticals.map((x) => ({ label: x.name, items: x.whatWeDo })),
        { label: unnumbered(servicesIntro.marker), items: services.map((s) => s.title) },
        { label: unnumbered(processIntro.marker), items: steps.map((s) => s.title) },
        { label: unnumbered(whyIntro.marker), items: reasons.map((r) => `${r.title}. ${r.body}`) },
        { items: [site.city] },
      ],
    },
    things: [
      ...founders.map((f) => ({ id: f.slug, label: f.name, room: { kind: "founder", founder: f } as Room })),
      ...tiers.map((t) => ({
        id: slugify(t.name),
        label: t.name,
        room: { kind: "format", tier: t, badge: t.featured ? engagementIntro.featuredBadge : undefined } as Room,
      })),
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

/** Deep links: `#aurelius` or `#aurelius/brand-strategy-and-identity`. */
export function parseHash(hash: string): { place: number; thing?: string } | null {
  const [pid, tid] = hash.replace(/^#/, "").split("/");
  const place = route.findIndex((p) => p.id === pid);
  if (place < 0) return null;
  const thing = tid && route[place].things.some((t) => t.id === tid && t.room) ? tid : undefined;
  return { place, thing };
}
export const hashFor = (place: number, thing?: string | null) => `#${route[place].id}${thing ? `/${thing}` : ""}`;

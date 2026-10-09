"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef, type ReactNode, type Ref } from "react";
import { onFrame } from "@/components/film/loop";
import { c3 } from "@/content/experience";
import { journey } from "@/content/journey";
import { contact, footer, mailtoHref, site } from "@/content/site";
import { useUi, type Runtime } from "../experience/journey";
import { route, type Item, type Place } from "../experience/route";
import { cross } from "../experience/threshold";

type Props = { rtRef: { current: Runtime }; reduced: boolean; onEnter: (thing: string) => void };

/** How long a block holds still at its place (share of a passage at each end). */
const PIN = 0.2;

/** A block's side, from where its reference frame sets the words (left third, right third, or centred). */
function sideOf(p: Place): "left" | "right" | "center" {
  for (const it of p.items) {
    const at = "at" in it ? it.at : it.k === "pins" && it.heading ? it.heading.at : null;
    if (at && it.k !== "button") return at[0] < 0.4 ? "left" : at[0] > 0.6 ? "right" : "center";
  }
  return "center";
}

/**
 * All the text of the journey as one page that moves over the film at scroll speed, like a scrolling page laid over a
 * picture: each place's block enters from below, pins while the film holds at its place, and leaves at the top.
 * Blocks are stacked, at least most of a viewport apart, so they never overlap and there is always text on screen.
 * Nothing blurs, fades or blinks. Real HTML throughout; only the block of the place you are at is interactive.
 */
export const TextLayer = forwardRef<HTMLHeadingElement, Props>(function TextLayer({ rtRef, reduced, onEnter }, h1Ref) {
  const place = useUi((s) => s.place);
  const column = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const col = column.current;
    if (!col) return;
    const blocks = Array.from(col.querySelectorAll<HTMLElement>(":scope > section"));
    let anchors: number[] = [], H = 0;
    const measure = () => {
      H = window.innerHeight;
      // Each block's anchor: its centre (blocks are laid out to fit the screen).
      anchors = blocks.map((b) => b.offsetTop + b.offsetHeight / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(col);
    window.addEventListener("resize", measure);
    let lastY = NaN;
    const off = onFrame(() => {
      const s = rtRef.current.s, n = anchors.length - 1;
      const i = Math.max(0, Math.min(n - 1, Math.floor(s))), f = Math.max(0, Math.min(1, s - i));
      // Reduced motion: no travel, the block of the place you are at, centred.
      const g = reduced ? (f < 0.5 ? 0 : 1) : Math.max(0, Math.min(1, (f - PIN) / (1 - 2 * PIN)));
      const y = Math.round((H / 2 - (anchors[i] + g * (anchors[i + 1] - anchors[i]))) * 2) / 2;
      if (y !== lastY) { col.style.transform = `translate3d(0, ${y}px, 0)`; lastY = y; }
    }, 2);
    return () => { off(); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [rtRef, reduced]);
  return (
    <div className="t-layer">
      <div ref={column} className="t-column">
        {route.map((p) => {
          const here = p.index === place;
          return (
            <section key={p.id} id={`xp-${p.id}`} data-place={p.index} className={`t-block is-${sideOf(p)} is-${p.id}`}
              aria-hidden={here ? undefined : true} inert={!here}>
              <div className="t-inner">
                <Block place={p} h1Ref={h1Ref} onEnter={onEnter} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
});

function Block({ place, h1Ref, onEnter }: { place: Place; h1Ref: Ref<HTMLHeadingElement>; onEnter: (t: string) => void }) {
  const items = place.items;
  const card = items.find((x) => x.k === "card");
  const rest = items.filter((x) => x.k !== "card");
  return (
    <>
      {card && card.k === "card" && (rest.length === 0
        ? <ChapterTitle card={card} h1Ref={card.tag === "h1" ? h1Ref : undefined} />
        : <p className="t-kicker">{card.sub.includes("·") ? card.sub : `${card.sub} · ${card.title}`}</p>)}
      {rest.map((it, j) => <ItemView key={j} it={it} onEnter={onEnter} />)}
    </>
  );
}

function ChapterTitle({ card, h1Ref }: { card: Extract<Item, { k: "card" }>; h1Ref?: Ref<HTMLHeadingElement> }) {
  const Tag = card.tag ?? "h2";
  return (
    <>
      <p className="t-kicker">{card.sub}</p>
      <Tag ref={h1Ref} tabIndex={h1Ref ? -1 : undefined} className="t-chapter">{c3(card.title)}</Tag>
    </>
  );
}

const Btn = ({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) =>
  href.startsWith("mailto:")
    ? <a className={`t-btn${primary ? " is-primary" : ""}`} href={href}>{children}</a>
    : <Link className={`t-btn${primary ? " is-primary" : ""}`} href={href} onClick={(e) => { if (cross(href)) e.preventDefault(); }}>{children}</Link>;

function ItemView({ it, onEnter }: { it: Item; onEnter: (t: string) => void }) {
  switch (it.k) {
    case "card": return null;
    case "head": {
      const Tag = it.tag === "p" ? "p" : it.tag;
      return (
        <div className="t-head">
          <Tag className="t-headline" aria-hidden={it.echo || undefined}>{c3(it.text)}</Tag>
          {it.sub && <p className="t-sub">{c3(it.sub)}</p>}
          {it.line && <p className="t-line">{c3(it.line)}</p>}
        </div>
      );
    }
    case "voice":
      return <p className="t-voice">{c3(it.text)}</p>;
    case "callouts":
      return (
        <ul className="t-names">
          {it.items.map((c) => (
            <li key={c.label}>
              {c.room
                ? <button type="button" className="t-name is-link" onClick={() => onEnter(c.room!)}>{c3(c.label)}<span className="t-read">{journey.read}</span></button>
                : <span className="t-name">{c3(c.label)}</span>}
            </li>
          ))}
        </ul>
      );
    case "pins":
      return (
        <>
          {it.heading && <h2 className="t-headline">{c3(it.heading.text)}</h2>}
          <ul className="t-names is-inline">{it.items.map((p) => <li key={p.label}><span className="t-name">{c3(p.label)}</span></li>)}</ul>
        </>
      );
    case "numerals":
      return (
        <ul className="t-numerals">
          {journey.numerals.map((n) => {
            const sr = "srValue" in n ? n.srValue : null;
            return (
            <li key={n.label}>
              <span className="t-numeral" aria-hidden={sr ? true : undefined}>{n.value}</span>
              {sr && <span className="sr-only">{sr}</span>}
              <span className="t-numeral-label">{n.label}</span>
            </li>
            );
          })}
        </ul>
      );
    case "arc":
      return (
        <>
          <p className="t-kicker">{it.label}</p>
          <p className="t-statement">{c3(it.text)}</p>
        </>
      );
    case "list":
      return <ListView it={it} />;
    case "button":
      return it.href ? <div className="t-actions"><Btn href={it.href} primary={it.primary}>{c3(it.label)}</Btn></div> : null;
    case "onward":
      return (
        <div className="t-actions is-stack">
          <Btn href={it.enquire.href} primary>{it.enquire.label}</Btn>
          <Btn href={it.next.href}>{c3(it.next.label)}</Btn>
          <Btn href={it.back.href}>{it.back.label}</Btn>
        </div>
      );
    case "closing":
      return <Closing />;
  }
}

function ListView({ it }: { it: Extract<Item, { k: "list" }> }) {
  const head = it.heading && <h2 className="t-headline">{c3(it.heading)}</h2>;
  switch (it.style) {
    case "credits":
      if (it.items.some((x) => x.body)) {
        // The founders as film credits, each over an empty portrait frame (a blank paper insert, ready for a photo).
        return (
          <>
            {head}
            <ul className="t-credits">
              {it.items.map((x) => (
                <li key={x.title}><span className="t-portrait" aria-hidden="true" /><span className="t-credit-name">{c3(x.title)}</span><span className="t-credit-role">{c3(x.body!)}</span></li>
              ))}
            </ul>
          </>
        );
      }
      return <>{head}<ul className="t-names">{it.items.map((x) => <li key={x.title}><span className="t-name">{c3(x.title)}</span></li>)}</ul></>;
    case "reel":
      return (
        <>
          {head}
          <ul className="t-reel">{it.items.map((x) => <li key={x.title}><span className="t-reel-frame" aria-hidden="true" /><span className="t-reel-title">{c3(x.title)}</span></li>)}</ul>
        </>
      );
    case "strata":
      return (
        <>
          {head}
          <ol className="t-tiers">
            {it.items.map((x) => {
              const [name, ...rest] = x.title.split(" · ");
              return (
                <li key={x.title}>
                  <p className="t-tier-name">{c3(name)}</p>
                  <p className="t-tier-price">{c3(rest.join(" · "))}</p>
                  {x.body && <p className="t-tier-body">{c3(x.body)}</p>}
                </li>
              );
            })}
          </ol>
        </>
      );
    case "stars":
      return <>{head}<p className="t-flow">{it.items.map((x, k) => <span key={x.title}>{c3(x.title)}{k < it.items.length - 1 && <span className="t-sep" aria-hidden="true"> ✦ </span>}</span>)}</p></>;
    case "profile":
    case "journal":
      return (
        <>
          {head}
          <ol className={`t-notes is-${it.style}`}>
            {it.items.map((x, k) => (
              <li key={x.title}>
                {it.style === "profile" && <span className="t-step" aria-hidden="true">{String(k + 1).padStart(2, "0")}</span>}
                <p className="t-note-title">{c3(x.title)}</p>
                {x.body && <p className="t-note-body">{c3(x.body)}</p>}
              </li>
            ))}
          </ol>
        </>
      );
    default:
      return <>{head}<ul className="t-names">{it.items.map((x) => <li key={x.title}><span className="t-name">{c3(x.title)}</span></li>)}</ul></>;
  }
}

function Closing() {
  const year = new Date().getFullYear();
  return (
    <>
      <h2 className="t-headline">{contact.headline.lead} {contact.headline.emphasis}</h2>
      <p className="t-body">{c3(contact.body)}</p>
      <div className="t-actions"><a className="t-btn is-primary" href={mailtoHref(contact.cta.subject)}>{contact.cta.label} <span aria-hidden="true">✦</span></a></div>
      <dl className="t-details">
        <div><dt>{contact.details.emailLabel}</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
        <div><dt>{contact.details.locationLabel}</dt><dd>{contact.details.location.join(", ")}</dd></div>
        <div><dt>{contact.details.socialLabel}</dt><dd>{site.handle}</dd></div>
      </dl>
      <p className="t-footer">© {year} · {footer.rights}</p>
    </>
  );
}

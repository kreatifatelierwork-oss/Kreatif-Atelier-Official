"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode, Ref } from "react";
import { c3 } from "@/content/experience";
import { journey } from "@/content/journey";
import { contact, footer, mailtoHref, site } from "@/content/site";
import { cross } from "./threshold";
import type { Item, Place } from "./route";

type Props = { item: Item; place: Place; j: number; h1Ref?: Ref<HTMLHeadingElement>; onEnter: (t: string) => void; onGo: (p: number) => void };

/** The vision across the sky in two arcs, broken after the first comma as in H11. */
const splitAt = (t: string) => { const i = t.indexOf(", ") + 1; return [t.slice(0, i), t.slice(i + 1)]; };

const at = (a: readonly [number, number]) => `${a[0]},${a[1]}`;

/** A block pinned to a world point (see Scenes): `align` says which edge of the block sits on the point. */
function A({ a, depth, align = "center", k, className, children, style }: {
  a: readonly [number, number]; depth: number; align?: "left" | "center" | "right"; k?: string; className?: string; children?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div className={`xp-a is-${align}${className ? ` ${className}` : ""}`} data-at={at(a)} data-depth={depth} data-key={k} style={style}>
      <div className="xp-a-in">{children}</div>
    </div>
  );
}

const Ornament = () => <span className="xp-ornament" aria-hidden="true"><i /><b>✦</b><i /></span>;

/** The ∞ drawn as a lemniscate of Bernoulli (neither font has the glyph at this size). */
const LEMNISCATE = (() => {
  const pts: string[] = [];
  for (let k = 0; k <= 96; k++) {
    const t = (k / 96) * Math.PI * 2, d = 1 + Math.sin(t) ** 2;
    pts.push(`${(60 + (52 * Math.cos(t)) / d).toFixed(2)} ${(28 + (52 * Math.sin(t) * Math.cos(t)) / d).toFixed(2)}`);
  }
  return `M${pts.join(" L")}Z`;
})();
const Infinity = () => (
  <svg className="xp-inf" viewBox="0 0 120 56" aria-hidden="true">
    <path d={LEMNISCATE} />
  </svg>
);

export function SceneItem({ item: it, place, j, h1Ref, onEnter }: Props) {
  const key = (k: number, s: string) => `${place.index}-${j}-${k}-${s}`;
  switch (it.k) {
    case "card": {
      const Tag = it.tag ?? "h2";
      return (
        <div className="xp-card">
          <Tag ref={it.tag === "h1" ? h1Ref : undefined} tabIndex={it.tag === "h1" ? -1 : undefined} className="xp-card-title">{c3(it.title)}</Tag>
          <Ornament />
          <p className="xp-card-sub">{it.sub}</p>
        </div>
      );
    }
    case "head": {
      const Tag = it.tag;
      return (
        <A a={it.at} depth={it.depth} align={it.align} className={`xp-head is-${it.face}${it.drawn ? " is-drawn" : ""}`}
          style={{ ["--size" as string]: it.size, ["--tilt" as string]: `${-(it.tilt ?? 0)}deg` }}>
          <Tag className="xp-head-text" aria-hidden={it.echo || undefined}>
            {c3(it.text)}
            {it.sub && <span className="xp-head-sub">{c3(it.sub)}</span>}
          </Tag>
          {it.ornament && <Ornament />}
          {it.line && <p className="xp-head-line">{c3(it.line)}</p>}
        </A>
      );
    }
    case "voice":
      return (
        <A a={it.at} depth={it.depth} align={it.align} className={`xp-voice${it.drawn ? " is-drawn" : ""}`} style={{ ["--size" as string]: it.size }}>
          <p>{c3(it.text)}</p>
        </A>
      );
    case "callouts":
      return (
        <>
          {it.items.map((c, k) => (
            <div key={k}>
              <A a={c.ring} depth={c.depth} k={key(k, "r")} className="xp-ring" />
              <A a={c.at} depth={c.depth} k={key(k, "l")} align={c.side === "left" ? "right" : c.side === "up" ? "center" : "left"} className="xp-callout">
                {c.room ? (
                  <button type="button" className="xp-callout-label" onClick={() => onEnter(c.room!)} aria-label={`${c3(c.label)}, ${journey.read}`}>
                    <span>{c3(c.label)}</span>
                    <span className="xp-callout-verb" aria-hidden="true">{journey.read}</span>
                  </button>
                ) : (
                  <p className="xp-callout-label"><span>{c3(c.label)}</span></p>
                )}
              </A>
            </div>
          ))}
        </>
      );
    case "pins":
      return (
        <>
          {it.heading && (
            <A a={it.heading.at} depth={it.items[0]?.depth ?? 40} className="xp-pins-head" style={{ ["--size" as string]: it.heading.size }}>
              <h2>{c3(it.heading.text)}</h2>
              <Ornament />
            </A>
          )}
          <ul className="xp-pins">
            {it.items.map((p, k) => (
              <li key={k}>
                <A a={p.at} depth={p.depth} className={`xp-pin${p.mono ? " is-mono" : ""}`}>
                  <span className="xp-pin-label">{c3(p.label)}</span>
                  <span className="xp-pin-tick" aria-hidden="true" />
                </A>
              </li>
            ))}
          </ul>
        </>
      );
    case "numerals":
      return (
        <A a={it.at} depth={it.depth} className="xp-numerals">
          <ul>
            {journey.numerals.map((n) => (
              <li key={n.label}>
                {n.value === "∞" ? <><span className="xp-numeral" aria-hidden="true"><Infinity /></span><span className="sr-only">{n.srValue}</span></> : <span className="xp-numeral">{n.value}</span>}
                <span className="xp-numeral-label">{n.label}</span>
                <Ornament />
              </li>
            ))}
          </ul>
        </A>
      );
    case "arc":
      return (
        <A a={[0.5, 0.3]} depth={it.depth} className="xp-arc">
          <p className="xp-arc-label">{it.label}</p>
          <Ornament />
          <p className="xp-arc-flat">{c3(it.text)}</p>
          <svg viewBox="0 0 1000 260" className="xp-arc-svg" role="img" aria-label={it.text}>
            <defs>
              <path id={`arc-${place.id}`} d="M10 78 C 250 8, 720 34, 1010 118" />
              <path id={`arc2-${place.id}`} d="M24 160 C 320 94, 720 106, 996 186" />
              <path id={`arc-loop-${place.id}`} d="M500 20 C 140 20, 0 120, 120 175 C 300 250, 820 245, 960 160 C 1040 110, 860 25, 520 24" />
            </defs>
            <use href={`#arc-loop-${place.id}`} className="xp-arc-loop" />
            <text aria-hidden="true"><textPath href={`#arc-${place.id}`}>{c3(splitAt(it.text)[0])}</textPath></text>
            <text aria-hidden="true"><textPath href={`#arc2-${place.id}`}>{c3(splitAt(it.text)[1])}</textPath></text>
          </svg>
        </A>
      );
    case "list":
      return <List it={it} />;
    case "button":
      return (
        <A a={it.at} depth={it.depth} className="xp-portal">
          {it.href ? (
            <Link className={`xp-btn${it.primary ? " is-primary" : ""}`} href={it.href} onClick={(e) => { if (cross(it.href!)) e.preventDefault(); }}>
              {c3(it.label)} <span aria-hidden="true">›</span>
            </Link>
          ) : null}
        </A>
      );
    case "onward":
      return (
        <A a={it.at} depth={it.depth} className="xp-onward">
          <div className="xp-onward-in">
            <Link className="xp-btn" href={it.next.href} onClick={(e) => { if (cross(it.next.href)) e.preventDefault(); }}>{c3(it.next.label)} <span aria-hidden="true">›</span></Link>
            <Link className="xp-btn" href={it.back.href} onClick={(e) => { if (cross(it.back.href)) e.preventDefault(); }}><span aria-hidden="true">‹</span> {it.back.label}</Link>
            <a className="xp-btn is-primary" href={it.enquire.href}>{it.enquire.label} <span aria-hidden="true">✦</span></a>
          </div>
        </A>
      );
    case "closing":
      return <Closing a={it.at} depth={it.depth} />;
  }
}

function List({ it }: { it: Extract<Item, { k: "list" }> }) {
  const head = it.heading && <h2 className="xp-list-head">{c3(it.heading)}</h2>;
  if (it.style === "credits" && it.items.some((x) => x.body)) {
    // Founders: film credits with empty portrait frames (blank paper inserts, ready for photos).
    return (
      <A a={it.at} depth={it.depth} className="xp-credits">
        {head}
        <Ornament />
        <ul>
          {it.items.map((x) => (
            <li key={x.title}>
              <span className="xp-frame" aria-hidden="true" />
              <span className="xp-credit-name">{c3(x.title)}</span>
              <span className="xp-credit-role">{c3(x.body!)}</span>
            </li>
          ))}
        </ul>
      </A>
    );
  }
  if (it.style === "reel") {
    // Showreel: empty 16:9 frames with blank paper inserts, ready for footage.
    return (
      <A a={it.at} depth={it.depth} className="xp-list is-reel">
        {head}
        <Ornament />
        <ul>
          {it.items.map((x) => (
            <li key={x.title}>
              <span className="xp-reel-frame" aria-hidden="true" />
              <span className="xp-list-title">{c3(x.title)}</span>
            </li>
          ))}
        </ul>
      </A>
    );
  }
  return (
    <A a={it.at} depth={it.depth} className={`xp-list is-${it.style}`}>
      {head}
      {it.heading && <Ornament />}
      <ul>
        {it.items.map((x) => (
          <li key={x.title}>
            <span className="xp-list-title">{c3(x.title)}</span>
            {x.body && <span className="xp-list-body">{c3(x.body)}</span>}
          </li>
        ))}
      </ul>
    </A>
  );
}

function Closing({ a, depth }: { a: readonly [number, number]; depth: number }) {
  const year = new Date().getFullYear();
  return (
    <A a={a} depth={depth} className="xp-closing">
      <h2 className="xp-closing-head">{contact.headline.lead} {contact.headline.emphasis}</h2>
      <Ornament />
      <p className="xp-closing-body">{c3(contact.body)}</p>
      <a className="xp-btn is-primary" href={mailtoHref(contact.cta.subject)}>
        {contact.cta.label} <span aria-hidden="true">✦</span>
      </a>
      <dl className="xp-details">
        <div><dt>{contact.details.emailLabel}</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
        <div><dt>{contact.details.locationLabel}</dt><dd>{contact.details.location.join(", ")}</dd></div>
        <div><dt>{contact.details.socialLabel}</dt><dd>{site.handle}</dd></div>
      </dl>
      <p className="xp-footer">© {year} · {footer.rights}</p>
    </A>
  );
}

"use client";

import { forwardRef } from "react";
import { c3, xp } from "@/content/experience";
import { film } from "@/content/film";
import { industries, industriesIntro } from "@/content/industries";
import { contact, footer, mailtoHref, site } from "@/content/site";
import { holding } from "@/content/verticals";
import { ActionButton } from "./ActionButton";
import { FounderArc } from "./FounderArc";
import { useUi } from "./journey";
import { route, slugify, type Caption, type Place } from "./route";

type Props = {
  reduced: boolean;
  onEnter: (thing: string) => void;
  onGo: (place: number, thing?: string) => void;
  onWatch: () => void;
  onDirect: () => void;
};

/**
 * Every place's words as real HTML (server-rendered, all of it, for reading, search and assistive tech). Only the
 * current place is shown; the others are inert. One caption block per place, set beside the subject (never a box).
 * During a passage the shown caption dissolves (opacity + blur from the `--xp-dissolve` variable the loop sets).
 */
export const Captions = forwardRef<HTMLHeadingElement, Props>(function Captions({ reduced, onEnter, onGo, onWatch, onDirect }, h1Ref) {
  const place = useUi((s) => s.place);
  const aurelius = route.findIndex((p) => p.id === "aurelius");
  return (
    <div className="xp-captions">
      {route.map((p) => {
        const here = p.index === place;
        return (
          <section
            key={p.id}
            id={`xp-${p.id}`}
            className={`xp-caption is-${p.id}`}
            data-active={here ? "" : undefined}
            aria-hidden={here ? undefined : true}
            inert={!here}
            aria-labelledby={`xp-${p.id}-title`}
          >
            <div className="xp-block">
              <CaptionBody p={p} c={p.caption} h1Ref={p.index === 0 ? h1Ref : undefined} onGo={onGo} aurelius={aurelius} />
              <Doors p={p} onEnter={onEnter} />
              {p.action && <div className="xp-actions"><ActionButton id={p.action} reduced={reduced} /></div>}
              {p.id === "atrium" && (
                <div className="xp-actions">
                  <button type="button" className="xp-btn is-primary" onClick={onWatch}>{film.modes.watch}</button>
                  <button type="button" className="xp-btn" onClick={onDirect}>{film.modes.direct}</button>
                </div>
              )}
              {p.id === "post" && <Closing />}
            </div>
            {p.id === "gallery" && <FounderArc things={p.things} />}
            {p.id === "concourse" && <Marquee />}
          </section>
        );
      })}
    </div>
  );
});

function CaptionBody({ p, c, h1Ref, onGo, aurelius }: { p: Place; c: Caption; h1Ref?: React.Ref<HTMLHeadingElement>; onGo: (place: number, thing?: string) => void; aurelius: number }) {
  const Title = p.index === 0 ? "h1" : "h2";
  const titleText = c.signature ? c.title.replace(new RegExp(`\\s*${c.signature}$`), "") : c.title;
  const set = useUi((s) => s.set);
  const offerings = new Set(p.things.filter((t) => !t.room && !t.founder).map((t) => t.id));
  return (
    <>
      {c.kicker && <p className="xp-kicker">{c.kicker}</p>}
      <Title id={`xp-${p.id}-title`} ref={h1Ref} tabIndex={h1Ref ? -1 : undefined} className={`xp-title${p.index === 0 ? " is-hero" : ""}`}>
        {c3(titleText)}
        {c.signature && <span className="sr-only"> {c.signature}</span>}
        {c.emphasis && <> <em>{c3(c.emphasis)}</em></>}
      </Title>
      {c.signature && <p className="xp-signature" aria-hidden="true">{c.signature}</p>}
      {c.stacked && <p className="xp-stacked">{c.stacked.map((w) => <span key={w}>{w}</span>)}</p>}
      {c.voice?.map((t) => <p key={t} className="xp-voice">{c3(t)}</p>)}
      {c.body?.map((t) => <p key={t} className="xp-body">{c3(t)}</p>)}
      {c.list && p.id === "concourse" && (
        <>
          <p className="xp-label">{route[aurelius].things.find((t) => t.id === "services")?.label}</p>
          <ul className="xp-links">
            {c.list.map((s) => (
              <li key={s}>
                <button type="button" className="xp-textlink" onClick={() => onGo(aurelius, slugify(s))}>{c3(s)}</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {c.list && p.id !== "concourse" && (
        <>
          <p className="xp-label">{holding.labels.whatWeDo}</p>
          <ul className="xp-offerings">
            {c.list.map((s) => {
              const id = slugify(s);
              const live = offerings.has(id);
              return (
                <li
                  key={s}
                  onMouseEnter={live ? () => set({ hover: id }) : undefined}
                  onMouseLeave={live ? () => set({ hover: null }) : undefined}
                >
                  {c3(s)}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

/** Things with a room: each is a door into its sub-space ("Enter"). */
function Doors({ p, onEnter }: { p: Place; onEnter: (t: string) => void }) {
  const set = useUi((s) => s.set);
  const doors = p.things.filter((t) => t.room && !t.hidden);
  if (!doors.length) return null;
  return (
    <ul className="xp-doors">
      {doors.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            className="xp-door"
            onMouseEnter={() => set({ hover: t.id })}
            onMouseLeave={() => set({ hover: null })}
            onFocus={() => set({ hover: t.id })}
            onBlur={() => set({ hover: null })}
            onClick={() => onEnter(t.id)}
          >
            <span>{c3(t.label)}</span>
            <span className="xp-door-verb" aria-hidden="true">{xp.enter}</span>
            <span className="sr-only">, {xp.enter}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** The industries drift across the lower third of the Concourse (a static wrapped list under reduced motion). */
function Marquee() {
  const row = industries.map((i) => (
    <li key={i}><span>{c3(i)}</span><span className="xp-star" aria-hidden="true">✦</span></li>
  ));
  return (
    <div className="xp-marquee">
      <ul className="xp-marquee-track" aria-label={industriesIntro.marker.split(" · ")[1]}>{row}</ul>
      <ul className="xp-marquee-track" aria-hidden="true">{row}</ul>
    </div>
  );
}

/** The closing scene: the one contact action, the details as plain text, and the footer. */
function Closing() {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="xp-actions">
        <a className="xp-btn is-primary" href={mailtoHref(contact.cta.subject)}>
          {contact.cta.label} <span aria-hidden="true">✦</span>
        </a>
      </div>
      <dl className="xp-details">
        <div><dt>{contact.details.emailLabel}</dt><dd><a className="xp-textlink" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
        <div><dt>{contact.details.locationLabel}</dt><dd>{contact.details.location.join(", ")}</dd></div>
        <div><dt>{contact.details.socialLabel}</dt><dd>{site.handle} <span className="xp-muted">({footer.socialNetworks.map((n) => n.label).join(", ")})</span></dd></div>
      </dl>
      <p className="xp-footer"><span>© {year}</span> <span>{footer.rights}</span></p>
    </>
  );
}

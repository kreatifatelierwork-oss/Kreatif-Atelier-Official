"use client";

import { forwardRef } from "react";
import { c3, xp } from "@/content/experience";
import { film } from "@/content/film";
import { contact, mailtoHref, site } from "@/content/site";
import { useUi } from "./journey";
import { route, type Caption, type Place } from "./route";

type Props = { onEnter: (thing: string) => void; onWatch: () => void; onDirect: () => void };

/**
 * Every place's words as real HTML (server-rendered, all of it, for reading, search and assistive tech). Only the
 * current place is shown; the others are inert. During a passage the shown caption dissolves (opacity + blur from
 * the `--xp-dissolve` variable the loop sets), so text never cuts.
 */
export const Captions = forwardRef<HTMLHeadingElement, Props>(function Captions({ onEnter, onWatch, onDirect }, h1Ref) {
  const place = useUi((s) => s.place);
  return (
    <div className="xp-captions">
      {route.map((p) => (
        <section
          key={p.id}
          id={`xp-${p.id}`}
          className={`xp-caption is-${p.id}`}
          data-active={p.index === place ? "" : undefined}
          aria-hidden={p.index === place ? undefined : true}
          inert={p.index !== place}
          aria-labelledby={`xp-${p.id}-title`}
        >
          <CaptionBody p={p} c={p.caption} h1Ref={p.index === 0 ? h1Ref : undefined} onEnter={onEnter} />
          {p.id === "atrium" && (
            <div className="xp-actions">
              <button type="button" className="xp-btn is-primary" onClick={onWatch}>{film.modes.watch}</button>
              <button type="button" className="xp-btn" onClick={onDirect}>{film.modes.direct}</button>
            </div>
          )}
          {p.id === "post" && (
            <div className="xp-contact">
              <a className="xp-btn is-primary" href={mailtoHref(contact.cta.subject)}>{contact.cta.label} <span aria-hidden="true">✦</span></a>
              <p className="xp-mono">{site.email} · {site.handle}</p>
              <p className="xp-mono">{contact.details.location.join(", ")}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
});

function CaptionBody({ p, c, h1Ref, onEnter }: { p: Place; c: Caption; h1Ref?: React.Ref<HTMLHeadingElement>; onEnter: (t: string) => void }) {
  const Title = p.index === 0 ? "h1" : "h2";
  const titleText = c.signature ? c.title.replace(new RegExp(`\\s*${c.signature}$`), "") : c.title;
  return (
    <>
      {c.eyebrow && <p className="xp-eyebrow">{c.eyebrow}</p>}
      <Title id={`xp-${p.id}-title`} ref={h1Ref} tabIndex={h1Ref ? -1 : undefined} className={p.index === 0 ? "xp-title is-hero" : "xp-title"}>
        {c3(titleText)}
        {c.signature && <span className="sr-only"> {c.signature}</span>}
        {c.emphasis && <> <em>{c3(c.emphasis)}</em></>}
      </Title>
      {c.signature && <p className="xp-signature" aria-hidden="true">{c.signature}</p>}
      {c.stacked && <p className="xp-stacked">{c.stacked.map((w) => <span key={w}>{w}</span>)}</p>}
      {c.voice?.map((t) => <p key={t} className="xp-voice">{c3(t)}</p>)}
      {c.body?.map((t) => <p key={t} className="xp-body">{c3(t)}</p>)}
      {c.steps && <ul className="xp-steps">{c.steps.map((s) => <li key={s}>{c3(s)}</li>)}</ul>}
      {p.things.length > 0 && <Things p={p} onEnter={onEnter} />}
      {!p.things.length && c.list && <ul className={`xp-list${p.id === "concourse" ? " is-marquee" : ""}`}>{c.list.map((s) => <li key={s}>{c3(s)}</li>)}</ul>}
      {p.things.length > 0 && c.list && p.id === "concourse" && <ul className="xp-list is-marquee">{c.list.map((s) => <li key={s}>{c3(s)}</li>)}</ul>}
      {c.groups?.map((g, k) => (
        <div key={g.label ?? k} className="xp-group">
          {g.label && <p className="xp-label">{g.label}</p>}
          <ul>{g.items.map((s) => <li key={s}>{c3(s)}</li>)}</ul>
        </div>
      ))}
    </>
  );
}

/** The things in this place: each one lights up its counterpart in the scene; those with a room can be Entered. */
function Things({ p, onEnter }: { p: Place; onEnter: (t: string) => void }) {
  const set = useUi((s) => s.set);
  return (
    <ul className="xp-things">
      {p.things.map((t) => (
        <li key={t.id} onMouseEnter={() => set({ hover: t.id })} onMouseLeave={() => set({ hover: null })}>
          <span>{c3(t.label)}</span>
          {t.room && (
            <button
              type="button"
              className="xp-enter"
              onFocus={() => set({ hover: t.id })}
              onBlur={() => set({ hover: null })}
              onClick={() => onEnter(t.id)}
              aria-label={`${xp.enter}: ${t.label}`}
            >
              {xp.enter}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

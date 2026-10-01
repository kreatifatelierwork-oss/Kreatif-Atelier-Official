"use client";

import { useEffect, useRef } from "react";
import { c3, xp } from "@/content/experience";
import { servicesIntro } from "@/content/services";
import { useUi } from "./journey";
import { route, type Room } from "./route";

type Props = { room: Room; onBack: () => void; onEnter: (thing: string) => void };

/**
 * An Enter room: the full text of the thing you stepped into. Reading rooms sit beside the scene on a solid surface
 * (scrollable, above the ink so text is never inverted); moments (Vision, Pillars, who we serve, Impact) are composed
 * over the scene itself as large type. Focus moves to the heading on open; Back, Esc or the browser's Back return to
 * the same spot. A service opened from "Our Services" goes back to that list.
 */
export function RoomPanel({ room, onBack, onEnter }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const place = useUi((s) => s.place);
  useEffect(() => { heading.current?.focus(); }, [room]);
  const fromList = room.kind === "service" && route[place].things.some((t) => t.id === "services");
  const back = fromList ? () => onEnter("services") : onBack;
  const variant = room.kind === "moment" ? "is-moment" : room.kind === "formats" ? "is-wide" : "is-side";
  return (
    <section
      className={`xp-room xp-panel ${variant}`}
      aria-labelledby="xp-room-title"
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onBack(); } }}
    >
      {room.kind === "text" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.title}</h3>
          <p className="xp-room-body">{c3(room.body)}</p>
        </>
      )}

      {room.kind === "service" && (
        <>
          <p className="xp-label">{room.service.title}</p>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{c3(room.service.tagline)}</h3>
          <p className="xp-label">{servicesIntro.whatLabel}</p>
          <p className="xp-room-body">{c3(room.service.whatItIs)}</p>
          <p className="xp-label">{servicesIntro.howLabel}</p>
          <p className="xp-room-body">{c3(room.service.howItWorks)}</p>
          <ul className="xp-features">
            {room.service.features.map((f) => (
              <li key={f.title}><span className="xp-feature-title">{f.title}</span> {c3(f.body)}</li>
            ))}
          </ul>
          <ul className="xp-tags" aria-label={room.service.title}>
            {room.service.detailTags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </>
      )}

      {room.kind === "services" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.title}</h3>
          <p className="xp-room-body">{c3(room.intro)}</p>
          <ul className="xp-service-list">
            {room.ids.map((id) => {
              const t = route[place].things.find((x) => x.id === id);
              const s = t?.room?.kind === "service" ? t.room.service : null;
              if (!s) return null;
              return (
                <li key={id}>
                  <button type="button" className="xp-service" onClick={() => onEnter(id)}>
                    <span className="xp-service-title">{s.title}</span>
                    <span className="xp-service-blurb">{c3(s.blurb)}</span>
                    <span className="xp-door-verb" aria-hidden="true">{xp.enter}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {room.kind === "formats" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.title}</h3>
          <div className="xp-credits">
            {room.tiers.map((t) => (
              <div key={t.name} className="xp-credit">
                <p className={`xp-label${t.featured ? " is-gold" : ""}`}>{t.featured ? room.badge : " "}</p>
                <p className="xp-credit-name">{t.name}</p>
                <p className="xp-credit-price">{c3(t.price)}</p>
                <p className="xp-label">{t.period}</p>
                <ul className="xp-credit-features">{t.features.map((f) => <li key={f}>{c3(f)}</li>)}</ul>
                <p className="xp-credit-note">{c3(t.note)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {room.kind === "moment" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-label">{room.label}</h3>
          {room.voice ? (
            <p className="xp-moment-voice">{c3(room.lines[0])}</p>
          ) : (
            <ol className="xp-moment-list">
              {room.lines.map((l, i) => <li key={l} style={{ ["--i" as string]: i }}>{l}</li>)}
            </ol>
          )}
        </>
      )}

      {room.kind === "sequence" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.title}</h3>
          {room.intro && <p className="xp-room-body">{c3(room.intro)}</p>}
          <ol className="xp-sequence">
            {room.items.map((it) => (
              <li key={it.title}>
                <p className="xp-sequence-title">{it.title}</p>
                <p className="xp-room-body">{c3(it.body)}</p>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="xp-room-actions">
        <button type="button" className="xp-btn" onClick={back}>{xp.back}</button>
      </div>
    </section>
  );
}

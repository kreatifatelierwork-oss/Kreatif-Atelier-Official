"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { c3, xp } from "@/content/experience";
import { servicesIntro } from "@/content/services";
import type { Room } from "./route";

type Props = { room: Room; onBack: () => void };

/**
 * An Enter room: the full text of the thing you stepped into, set beside it (never over the scene). Focus moves to
 * its heading on open; Back, Esc or the browser's Back return to the same spot in the place.
 */
export function RoomPanel({ room, onBack }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [room]);
  return (
    <section className="xp-room xp-panel" aria-labelledby="xp-room-title" onKeyDown={(e) => { if (e.key === "Escape") onBack(); }}>
      {room.kind === "text" && (
        <>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.title}</h3>
          <p className="xp-body">{c3(room.body)}</p>
        </>
      )}
      {room.kind === "service" && (
        <>
          <p className="xp-label">{room.service.title}</p>
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{c3(room.service.tagline)}</h3>
          <p className="xp-label">{servicesIntro.whatLabel}</p>
          <p className="xp-body">{c3(room.service.whatItIs)}</p>
          <p className="xp-label">{servicesIntro.howLabel}</p>
          <p className="xp-body">{c3(room.service.howItWorks)}</p>
          <ul className="xp-features">
            {room.service.features.map((f) => (
              <li key={f.title}><strong>{f.title}</strong> {c3(f.body)}</li>
            ))}
          </ul>
        </>
      )}
      {room.kind === "founder" && (
        <>
          <Image className="xp-founder" src={room.founder.cutout} alt="" width={room.founder.imageWidth} height={room.founder.imageHeight} sizes="200px" />
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.founder.name}</h3>
          <p className="xp-label">{room.founder.roleFull}</p>
          <p className="xp-body">{c3(room.founder.bio)}</p>
        </>
      )}
      {room.kind === "format" && (
        <>
          {room.badge && <p className="xp-label is-gold">{room.badge}</p>}
          <h3 id="xp-room-title" ref={heading} tabIndex={-1} className="xp-room-title">{room.tier.name}</h3>
          <p className="xp-price">{c3(room.tier.price)} <span className="xp-label">{room.tier.period}</span></p>
          <ul className="xp-features">{room.tier.features.map((f) => <li key={f}>{c3(f)}</li>)}</ul>
          <p className="xp-body">{c3(room.tier.note)}</p>
        </>
      )}
      <button type="button" className="xp-btn" onClick={onBack}>{xp.back}</button>
    </section>
  );
}

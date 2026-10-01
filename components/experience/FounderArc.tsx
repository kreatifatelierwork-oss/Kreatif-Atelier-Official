"use client";

import Image from "next/image";
import { useState } from "react";
import { c3 } from "@/content/experience";
import { useUi } from "./journey";
import type { Thing } from "./route";

const TILT = [-9, -3, 3, 9];

/**
 * The founders as a polaroid arc (DESIGN.md): four real cut-out portraits on mount-coloured prints, fanned on a gentle
 * arc. Selecting a print (hover, focus or tap) brings it upright and forward; its name, role and bio sit beside the
 * arc, not in a box.
 */
export function FounderArc({ things }: { things: Thing[] }) {
  const people = things.filter((t) => t.founder);
  const [pick, setPick] = useState(0);
  const set = useUi((s) => s.set);
  const f = people[pick].founder!;
  const choose = (i: number) => { setPick(i); set({ hover: people[i].id }); };
  return (
    <div className="xp-founders">
      <ul className="xp-arc" aria-label={people.map((p) => p.label).join(", ")}>
        {people.map((p, i) => (
          <li key={p.id} style={{ ["--tilt" as string]: `${TILT[i]}deg`, ["--drop" as string]: `${Math.abs(TILT[i]) * 1.4}px`, zIndex: i === pick ? 5 : i }}>
            <button
              type="button"
              className="xp-print"
              aria-pressed={i === pick}
              aria-controls="xp-founder-bio"
              onMouseEnter={() => choose(i)}
              onFocus={() => choose(i)}
              onClick={() => choose(i)}
            >
              <Image src={p.founder!.cutout} alt="" width={p.founder!.imageWidth} height={p.founder!.imageHeight} sizes="(max-width: 767px) 30vw, 180px" />
              <span className="sr-only">{p.founder!.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div id="xp-founder-bio" className="xp-bio" aria-live="polite">
        <p className="xp-bio-name">{f.name}</p>
        <p className="xp-label">{f.roleFull}</p>
        <p className="xp-bio-text">{c3(f.bio)}</p>
      </div>
    </div>
  );
}

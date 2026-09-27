"use client";

import { useState } from "react";
import { servicesIntro, type Service } from "@/content/services";
import { Dialog } from "@/components/ui/Dialog";
import { Star } from "@/components/ui/Star";
import { Tags } from "@/components/ui/Tags";

type Props = { service: Service | null; onClose: () => void };

export function ServiceOverlay({ service, onClose }: Props) {
  // Keep rendering the last service while the exit animation plays.
  const [shown, setShown] = useState(service);
  if (service && service !== shown) setShown(service);

  return (
    <Dialog open={service !== null} onClose={onClose} labelledBy="service-dialog-title">
      {shown && (
        <div className="p-7 pt-16 md:p-14">
          <p className="display text-[4rem] leading-none text-gold/70">{shown.number}</p>
          <h2 id="service-dialog-title" className="display mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] text-cream">
            {shown.title}
          </h2>
          <p className="emph mt-3 text-[clamp(1.2rem,2vw,1.6rem)] leading-snug">{shown.tagline}</p>

          <div className="hairline my-10" />

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="eyebrow flex items-center gap-2 text-gold">
                <Star /> {servicesIntro.whatLabel}
              </h3>
              <p className="mt-4 leading-relaxed text-cream-muted">{shown.whatItIs}</p>
            </div>
            <div>
              <h3 className="eyebrow flex items-center gap-2 text-gold">
                <Star /> {servicesIntro.howLabel}
              </h3>
              <p className="mt-4 leading-relaxed text-cream-muted">{shown.howItWorks}</p>
            </div>
          </div>

          <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {shown.features.map((feature) => (
              <li key={feature.title} className="bg-ink p-6">
                <h4 className="display text-[1.45rem] text-cream">{feature.title}</h4>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-cream-muted">{feature.body}</p>
              </li>
            ))}
          </ul>

          <Tags tags={shown.detailTags} className="mt-10" />
        </div>
      )}
    </Dialog>
  );
}

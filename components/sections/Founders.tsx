"use client";

import Image from "next/image";
import { useState } from "react";
import { founders, foundersIntro, type Founder } from "@/content/founders";
import { Dialog } from "@/components/ui/Dialog";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

/** Studio portraits on white — graded warm and faded into the ink so they sit on the dark page. */
function Portrait({ founder, sizes, priority = false }: { founder: Founder; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-navy">
      <Image
        src={founder.image}
        alt={founder.name}
        width={founder.imageWidth}
        height={founder.imageHeight}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover [filter:sepia(0.18)_saturate(0.9)_brightness(0.86)_contrast(1.06)] transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_33_61/0.35)_0%,transparent_30%,transparent_45%,rgb(11_15_26/0.92)_100%)] mix-blend-normal"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#c9a45c] opacity-[0.08] mix-blend-color" />
    </div>
  );
}

export function Founders() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = founders.find((f) => f.slug === openSlug) ?? null;
  const [shown, setShown] = useState(open);
  if (open && open !== shown) setShown(open);

  return (
    <Section id={foundersIntro.id}>
      <SectionHeading intro={foundersIntro} />

      <ul className="mt-20 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {founders.map((founder) => (
          <li key={founder.slug}>
            <article className="group relative h-full border border-line bg-ink/70 transition-colors duration-500 focus-within:border-gold/70 hover:border-gold/70">
              <Portrait founder={founder} sizes="(min-width: 1024px) 25vw, 50vw" />
              <div className="relative -mt-16 p-4 transition-opacity duration-500 sm:-mt-20 sm:p-6 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0">
                <h3 className="display text-[1.3rem] leading-tight text-cream sm:text-[1.75rem]">{founder.name}</h3>
                <p className="eyebrow mt-2 text-[0.64rem] text-gold">{founder.role}</p>
              </div>
              {/* Desktop: bio reveals over the portrait on hover / keyboard focus. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden flex-col justify-end bg-ink/95 p-6 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100 lg:flex"
              >
                <p className="text-[0.9rem] leading-relaxed text-cream-muted">{founder.bio}</p>
                <p className="eyebrow mt-5 flex items-center gap-2 text-[0.62rem] text-gold">
                  <Star /> {founder.name}
                </p>
              </div>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpenSlug(founder.slug)}
                className="absolute inset-0 focus-visible:outline-offset-[-3px]"
              >
                <span className="sr-only">{foundersIntro.openBio(founder.name)}</span>
              </button>
            </article>
          </li>
        ))}
      </ul>

      <Dialog open={open !== null} onClose={() => setOpenSlug(null)} labelledBy="founder-dialog-title">
        {shown && (
          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <Portrait founder={shown} sizes="(min-width: 768px) 40vw, 100vw" />
            <div className="flex flex-col justify-center p-7 md:p-12">
              <p className="eyebrow flex items-center gap-2 text-gold">
                <Star /> {foundersIntro.kicker}
              </p>
              <h2 id="founder-dialog-title" className="display mt-5 text-[clamp(2.2rem,4vw,3.2rem)] leading-tight text-cream">
                {shown.name}
              </h2>
              <p className="emph mt-2 text-[1.3rem]">{shown.roleFull}</p>
              <div className="hairline my-7" />
              <p className="leading-relaxed text-cream-muted">{shown.bio}</p>
            </div>
          </div>
        )}
      </Dialog>
    </Section>
  );
}

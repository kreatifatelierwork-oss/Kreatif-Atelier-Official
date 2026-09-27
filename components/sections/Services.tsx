"use client";

import { useState } from "react";
import { services, servicesIntro } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";
import { Tags } from "@/components/ui/Tags";
import { ServiceOverlay } from "./ServiceOverlay";

export function Services() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openService = services.find((s) => s.slug === openSlug) ?? null;

  return (
    <Section id={servicesIntro.id}>
      <SectionHeading intro={servicesIntro} />

      <ul className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <li key={service.slug}>
            <article className="panel group relative flex h-full flex-col p-8 transition-colors duration-500 focus-within:border-gold/70 hover:border-gold/70 md:p-9">
              <p className="display text-[3.2rem] leading-none text-gold/70 transition-colors group-hover:text-gold-bright">
                {service.number}
              </p>
              <h3 className="display mt-6 text-[1.9rem] leading-tight text-cream">{service.title}</h3>
              <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-cream-muted">{service.blurb}</p>
              <Tags tags={service.cardTags} className="mt-7" />
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpenSlug(service.slug)}
                className="eyebrow mt-8 flex items-center gap-2 self-start text-[0.68rem] text-gold transition-colors after:absolute after:inset-0 after:content-[''] hover:text-gold-bright"
              >
                {servicesIntro.cardCta}
                <span className="sr-only">: {service.title}</span>
                <Star />
              </button>
            </article>
          </li>
        ))}
      </ul>

      <ServiceOverlay service={openService} onClose={() => setOpenSlug(null)} />
    </Section>
  );
}

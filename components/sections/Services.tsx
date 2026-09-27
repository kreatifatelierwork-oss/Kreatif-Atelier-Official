"use client";

import { useRef, useState } from "react";
import { services, servicesIntro } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";
import { Tags } from "@/components/ui/Tags";
import { config } from "@/lib/config";
import { gsap, useGSAP } from "@/lib/scroll/gsap";
import { getLenis } from "@/lib/scroll/lenis";
import { setPinProgress } from "@/lib/scroll/store";
import { ServiceOverlay } from "./ServiceOverlay";

/**
 * Desktop (pin query): the section pins and the six cards travel horizontally as you scroll;
 * progress is published to the store so the 3D pillars can track it later.
 * Mobile / short screens / reduced motion: a plain grid.
 */
export function Services() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openService = services.find((s) => s.slug === openSlug) ?? null;

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(config.pin.query, () => {
        const section = sectionRef.current!;
        const viewport = viewportRef.current!;
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${distance() * config.pin.servicesScrollRatio}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPinProgress("services", self.progress);
              gsap.set(barRef.current, { scaleX: self.progress });
            },
          },
        });

        // Keyboard: tabbing to an off-screen card scrolls the page to where that card is in view.
        const onFocusIn = (event: FocusEvent) => {
          const card = (event.target as HTMLElement).closest("li");
          const st = tween.scrollTrigger;
          if (!card || !st || distance() === 0) return;
          const cardProgress = Math.min(1, card.offsetLeft / distance());
          const y = st.start + (st.end - st.start) * cardProgress;
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { duration: 0.8 });
          else window.scrollTo({ top: y });
        };
        track.addEventListener("focusin", onFocusIn);

        return () => {
          track.removeEventListener("focusin", onFocusIn);
          setPinProgress("services", 0);
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <Section
      ref={sectionRef}
      id={servicesIntro.id}
      className="pin:flex pin:h-svh pin:items-center pin:pt-[calc(var(--nav-h)+1.5rem)] pin:pb-10"
      innerClassName="pin:grid pin:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] pin:items-center pin:gap-12"
    >
      <SectionHeading intro={servicesIntro} compactWhenPinned>
        <div aria-hidden="true" className="mt-10 hidden h-px w-full max-w-xs bg-line pin:block">
          <span ref={barRef} className="block h-full origin-left scale-x-0 bg-gold" />
        </div>
      </SectionHeading>

      <div
        ref={viewportRef}
        className="mt-20 pin:mt-0 pin:overflow-clip pin:[mask-image:linear-gradient(90deg,transparent,#000_2.5%,#000_93%,transparent)]"
      >
        <ul
          ref={trackRef}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 pin:flex pin:w-max pin:gap-5 pin:px-[2.5%] pin:will-change-transform"
        >
          {services.map((service) => (
            <li key={service.slug} data-reveal className="pin:w-[clamp(19rem,25vw,23rem)]">
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
      </div>

      <ServiceOverlay service={openService} onClose={() => setOpenSlug(null)} />
    </Section>
  );
}

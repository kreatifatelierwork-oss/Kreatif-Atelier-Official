"use client";

import { useRef } from "react";
import { processIntro, steps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";
import { config } from "@/lib/config";
import { gsap, useGSAP } from "@/lib/scroll/gsap";
import { setPinProgress } from "@/lib/scroll/store";

/**
 * Desktop (pin query): the section pins while the gold rail fills and each step lights in turn
 * (the camera will travel the ribbon's five waypoints here in Phase 5).
 * Mobile / short screens / reduced motion: a plain vertical timeline, every step fully visible.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(config.pin.query, () => {
        const items = Array.from(listRef.current!.querySelectorAll<HTMLElement>(":scope > li"));
        const setActive = (progress: number) => {
          const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
          items.forEach((item, i) => {
            item.dataset.active = String(i <= active);
            item.dataset.current = String(i === active);
          });
        };
        setActive(0);

        gsap.to(railRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: "top top",
            end: () => `+=${steps.length * config.pin.processStepVh * window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPinProgress("process", self.progress);
              setActive(self.progress);
            },
          },
        });

        return () => {
          items.forEach((item) => {
            delete item.dataset.active;
            delete item.dataset.current;
          });
          setPinProgress("process", 0);
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <Section
      ref={sectionRef}
      id={processIntro.id}
      className="pin:flex pin:h-svh pin:items-center pin:pt-[calc(var(--nav-h)+1rem)] pin:pb-8 pin-short:pt-[calc(var(--nav-h)+0.5rem)] pin-short:pb-4"
    >
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20 pin:items-center">
        <SectionHeading
          intro={processIntro}
          compactWhenPinned
          className="lg:sticky lg:top-32 lg:self-start pin:static pin:self-center"
        />

        <ol ref={listRef} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[0.7rem] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent pin:bg-line pin:bg-none"
          />
          <span
            ref={railRef}
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[0.7rem] hidden w-px origin-top scale-y-0 bg-gold shadow-[0_0_12px_var(--gold)] pin:block"
          />
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative grid grid-cols-[1.4rem_1fr] gap-6 pb-14 transition-opacity duration-700 last:pb-0 pin:pb-7 pin:opacity-35 pin:data-[active=true]:opacity-100 pin-short:pb-4"
            >
              <span className="relative z-10 mt-2 grid pin-short:mt-1 h-[1.4rem] w-[1.4rem] place-items-center rounded-full border border-gold bg-ink text-[0.55rem] text-gold transition-colors duration-700 pin:group-data-[active=true]:bg-gold pin:group-data-[active=true]:text-ink">
                <Star />
              </span>
              {/* Reveal the text, not the <li>: the pinned layout drives the <li>'s opacity. */}
              <div data-reveal>
                <p className="eyebrow text-[0.65rem] text-gold">{step.number}</p>
                <h3 className="display mt-2 text-[clamp(1.8rem,3vw,2.4rem)] leading-tight text-cream pin:text-[clamp(1.6rem,2.3vw,2.1rem)] pin-short:mt-1 pin-short:text-[1.45rem]">
                  {step.title}
                </h3>
                {/* Short pinned screens: only the current step's description is open; the rest collapse
                    to their titles (still in the accessibility tree — only visually folded). */}
                <div className="grid transition-[grid-template-rows,opacity] duration-700 pin-short:grid-rows-[0fr] pin-short:opacity-0 pin-short:group-data-[current=true]:grid-rows-[1fr] pin-short:group-data-[current=true]:opacity-100">
                  <p className="mt-3 max-w-lg overflow-hidden leading-relaxed text-cream-muted pin:mt-2 pin:text-[0.95rem] pin-short:text-[0.88rem]">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

import { processIntro, steps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

export function Process() {
  return (
    <Section id={processIntro.id}>
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <SectionHeading intro={processIntro} className="lg:sticky lg:top-32 lg:self-start" />

        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[0.7rem] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent"
          />
          {steps.map((step) => (
            <li key={step.number} className="relative grid grid-cols-[1.4rem_1fr] gap-6 pb-14 last:pb-0">
              <span className="relative z-10 mt-2 grid h-[1.4rem] w-[1.4rem] place-items-center rounded-full border border-gold bg-ink text-[0.55rem] text-gold">
                <Star />
              </span>
              <div>
                <p className="eyebrow text-[0.65rem] text-gold">{step.number}</p>
                <h3 className="display mt-2 text-[clamp(1.8rem,3vw,2.4rem)] leading-tight text-cream">{step.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-cream-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

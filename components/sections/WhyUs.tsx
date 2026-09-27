import { reasons, whyIntro } from "@/content/why";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyUs() {
  return (
    <Section id={whyIntro.id}>
      <SectionHeading intro={whyIntro} align="center" />

      <ol className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <li key={reason.number} className="border-t border-line pt-7">
            <p className="display text-[2.6rem] leading-none text-gold/80">{reason.number}</p>
            <h3 className="display mt-5 text-[1.75rem] leading-tight text-cream">{reason.title}</h3>
            <p className="mt-3 leading-relaxed text-cream-muted">{reason.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

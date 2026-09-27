import { about } from "@/content/about";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

export function About() {
  return (
    <Section id={about.id}>
      <SectionHeading intro={about} />

      <div className="mt-20 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {about.pillars.map((pillar, i) => (
          <article key={pillar.title} className="bg-ink/85 p-8 md:p-11">
            {/* Reveal the contents: the cell background is what hides the gold grid lines. */}
            <div data-reveal>
              <p className="eyebrow text-[0.65rem] text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-4 text-[2rem] text-cream">{pillar.title}</h3>
              <p className="mt-4 leading-relaxed text-cream-muted">{pillar.body}</p>
            </div>
          </article>
        ))}
      </div>

      <figure data-reveal className="mx-auto mt-24 max-w-4xl text-center">
        <Star className="text-2xl text-gold" />
        <blockquote className="display mt-8 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-snug text-cream italic">
          “{about.quote.text}”
        </blockquote>
        <figcaption className="eyebrow mt-8 text-gold">— {about.quote.attribution}</figcaption>
      </figure>
    </Section>
  );
}

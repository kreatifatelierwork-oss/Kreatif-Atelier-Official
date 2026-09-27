import { divisions, ecosystemIntro } from "@/content/ecosystem";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

export function Ecosystem() {
  const { labels } = ecosystemIntro;

  return (
    <Section id={ecosystemIntro.id}>
      <SectionHeading intro={ecosystemIntro} />

      <ul className="mt-20 grid gap-5 md:grid-cols-2">
        {divisions.map((division, i) => (
          <li key={division.slug} data-reveal>
            <article className="panel flex h-full flex-col p-8 md:p-10">
              <p className="eyebrow flex items-center gap-2 text-[0.65rem] text-gold">
                <Star /> {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-5 text-[clamp(2rem,3.4vw,2.7rem)] leading-tight text-cream">
                {division.name}
              </h3>
              <p className="emph mt-2 text-[1.2rem] leading-snug">{division.tagline}</p>
              <p className="mt-5 flex-1 leading-relaxed text-cream-muted">{division.body}</p>
              <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
                {(["focus", "serves", "model"] as const).map((key) => (
                  <div key={key}>
                    <dt className="eyebrow text-[0.6rem] text-gold">{labels[key]}</dt>
                    <dd className="mt-1.5 text-[0.88rem] leading-snug text-cream">{division[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}

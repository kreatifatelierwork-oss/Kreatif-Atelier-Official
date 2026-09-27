import { engagementIntro, tiers } from "@/content/engagement";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

export function Engagement() {
  return (
    <Section id={engagementIntro.id}>
      <SectionHeading intro={engagementIntro} align="center" />

      <ul className="mt-20 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-5">
        {tiers.map((tier) => (
          <li
            key={tier.name}
            data-reveal
            className={`panel relative flex flex-col p-8 md:p-10 ${
              tier.featured
                ? "border-gold/70 bg-gradient-to-b from-navy/80 to-ink/80 shadow-[0_0_80px_-30px_var(--gold)] lg:-my-5 lg:py-14"
                : ""
            }`}
          >
            {tier.featured && (
              <p className="eyebrow absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-gold px-4 py-1.5 text-[0.62rem] whitespace-nowrap text-ink">
                <Star /> {engagementIntro.featuredBadge}
              </p>
            )}
            <h3 className="eyebrow text-gold">{tier.name}</h3>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-price)] text-[3.4rem] leading-none font-medium text-cream lining-nums">
                {tier.price}
              </span>
              <span className="text-sm text-cream-faint">{tier.period}</span>
            </p>
            <div className="hairline my-8" />
            <ul className="flex flex-1 flex-col gap-3.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-[0.95rem] text-cream-muted">
                  <Star className="mt-[0.45em] text-[0.7rem] text-gold" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="display mt-10 text-[1.25rem] leading-snug text-cream italic">{tier.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

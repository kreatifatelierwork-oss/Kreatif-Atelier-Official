import { industries, industriesIntro } from "@/content/industries";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/Star";

/** Static list; Phase 5 turns this into the CSS-3D ring (this layout stays as the reduced-motion fallback). */
export function Industries() {
  return (
    <Section id={industriesIntro.id}>
      <SectionHeading intro={industriesIntro} align="center" />

      <ul className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-3">
        {industries.map((industry) => (
          <li
            key={industry}
            data-reveal
            className="flex items-center gap-2.5 rounded-full border border-line bg-ink/60 px-5 py-2.5 text-[0.92rem] text-cream transition-colors hover:border-gold/70 hover:text-gold-bright"
          >
            <Star className="text-[0.65rem] text-gold" />
            {industry}
          </li>
        ))}
      </ul>
    </Section>
  );
}

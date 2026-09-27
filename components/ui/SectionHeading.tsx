import type { SectionIntro } from "@/content/types";
import { Star } from "./Star";

type Props = {
  intro: SectionIntro;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ intro, align = "left", className = "" }: Props) {
  const centered = align === "center";
  const headingId = `${intro.id}-heading`;

  return (
    <header className={`${centered ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <p className={`eyebrow flex items-center gap-3 text-gold ${centered ? "justify-center" : ""}`}>
        <Star className="text-[0.9em]" />
        <span>{intro.marker}</span>
        <Star className="text-[0.9em]" />
      </p>
      {intro.kicker && <p className="eyebrow mt-5 text-cream-faint">{intro.kicker}</p>}
      <h2
        id={headingId}
        className="display mt-6 text-[clamp(2.6rem,6.2vw,5.5rem)] text-cream"
      >
        {intro.headline.lead} <span className="emph block">{intro.headline.emphasis}</span>
      </h2>
      {intro.intro && (
        <p
          className={`mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-cream-muted ${centered ? "mx-auto" : ""}`}
        >
          {intro.intro}
        </p>
      )}
    </header>
  );
}

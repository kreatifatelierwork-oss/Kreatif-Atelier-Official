import type { SectionIntro } from "@/content/types";
import { Star } from "./Star";

type Props = {
  intro: SectionIntro;
  align?: "left" | "center";
  /** Smaller headline while the section is pinned (it shares the frame with a card track / step list). */
  compactWhenPinned?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function SectionHeading({ intro, align = "left", compactWhenPinned = false, className = "", children }: Props) {
  const centered = align === "center";
  const headingId = `${intro.id}-heading`;

  return (
    <header className={`${centered ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <p data-reveal className={`eyebrow flex items-center gap-3 text-gold ${centered ? "justify-center" : ""}`}>
        <Star className="text-[0.9em]" />
        <span>{intro.marker}</span>
        <Star className="text-[0.9em]" />
      </p>
      {intro.kicker && (
        <p data-reveal className={`eyebrow mt-5 text-cream-faint ${compactWhenPinned ? "pin-short:mt-3" : ""}`}>
          {intro.kicker}
        </p>
      )}
      <h2
        id={headingId}
        data-reveal-lines
        className={`display mt-6 text-[clamp(2.6rem,6.2vw,5.5rem)] text-cream ${
          compactWhenPinned
            ? "pin:text-[clamp(2.6rem,4.2vw,4.4rem)] pin-short:mt-4 pin-short:text-[clamp(2.1rem,3.3vw,3rem)]"
            : ""
        }`}
      >
        {intro.headline.lead} <span className="emph block">{intro.headline.emphasis}</span>
      </h2>
      {intro.intro && (
        <p
          data-reveal
          className={`mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-cream-muted ${centered ? "mx-auto" : ""} ${
            compactWhenPinned ? "pin-short:mt-4 pin-short:text-[0.92rem]" : ""
          }`}
        >
          {intro.intro}
        </p>
      )}
      {children}
    </header>
  );
}

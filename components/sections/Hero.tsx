import { hero } from "@/content/site";
import { Star } from "@/components/ui/Star";

/**
 * ∞ isn't in Cormorant or Manrope, so it's drawn to sit with the figures beside it:
 * about Cormorant's x-height tall, centred on the math axis, stroke matched to the 400 weight.
 */
function InfinityGlyph() {
  return (
    <svg
      viewBox="0 0 78 40"
      aria-hidden="true"
      focusable="false"
      className="inline-block h-[0.4em] w-[0.78em] overflow-visible align-[0.01em]"
    >
      <path
        d="M39 20C33 10 27 6 19 6 10 6 4 12 4 20s6 14 15 14c8 0 14-4 20-14s12-14 20-14c9 0 15 6 15 14s-6 14-15 14c-8 0-14-4-20-14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      id={hero.id}
      aria-labelledby="home-heading"
      className="relative flex min-h-svh flex-col px-[var(--gutter)] pt-[calc(var(--nav-h)+2rem)] pb-8"
    >
      {/* Where the 3D sculpture sits (read by the canvas; the loader appears here too).
          Desktop: the open top-right of the hero. Mobile: a flexible gap in the column below. */}
      <div
        data-hero-anchor
        aria-hidden="true"
        className="pointer-events-none absolute top-[7%] right-[1%] hidden h-[54%] w-[36%] md:block"
      />
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <p className="eyebrow flex items-center justify-center gap-3 text-cream-muted md:justify-start">
          {hero.eyebrow.map((part, i) => (
            <span key={part} className="flex items-center gap-3">
              {i > 0 && <Star className="text-gold" />}
              {part}
            </span>
          ))}
        </p>

        <div data-hero-anchor aria-hidden="true" className="pointer-events-none relative my-4 min-h-44 flex-1 md:hidden" />

        {/* Wordmark: line one hugs the left, line two the right, leaving the centre for the sculpture. */}
        <h1
          id="home-heading"
          className="display gold-text flex flex-col py-6 md:py-10 [filter:drop-shadow(0_6px_28px_rgb(11_15_26/0.9))] md:my-auto text-center text-[clamp(3.6rem,14.5vw,13.5rem)] leading-[0.86] font-medium tracking-[0.06em] uppercase md:text-left"
        >
          <span>{hero.wordmark[0]}</span>{" "}
          <span className="md:self-end md:pr-[0.02em]">{hero.wordmark[1]}</span>
        </h1>

        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="text-center md:text-left">
            <p className="display text-[clamp(1.35rem,2.4vw,2rem)] leading-snug text-cream">
              {hero.positioning[0]}
              <br />
              <span className="emph">{hero.positioning[1]}</span>
            </p>
            <p className="eyebrow mt-5 flex items-center justify-center gap-3 text-gold md:justify-start">
              {hero.brandLine.map((word, i) => (
                <span key={word} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  {word}
                </span>
              ))}
            </p>
          </div>

          <dl className="grid grid-cols-3 border-t border-line pt-5 md:min-w-[26rem]">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center gap-1 text-center md:items-start md:text-left">
                <dt className="eyebrow text-[0.62rem] leading-snug text-cream-faint">{stat.label}</dt>
                <dd className="display text-[2.4rem] leading-none text-gold-bright">
                  {"srValue" in stat ? (
                    <>
                      <InfinityGlyph />
                      <span className="sr-only">{stat.srValue}</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <a
          href="#about"
          className="eyebrow mx-auto mt-10 flex flex-col items-center gap-3 text-[0.62rem] text-cream-faint transition-colors hover:text-gold-bright"
        >
          {hero.scrollCue}
          <span aria-hidden="true" className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </a>
      </div>
    </section>
  );
}

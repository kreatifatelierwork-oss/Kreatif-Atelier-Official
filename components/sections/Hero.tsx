import { hero } from "@/content/site";
import { Star } from "@/components/ui/Star";

export function Hero() {
  return (
    <section
      id={hero.id}
      aria-labelledby="home-heading"
      className="relative flex min-h-svh flex-col px-[var(--gutter)] pt-[calc(var(--nav-h)+2rem)] pb-8"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <p className="eyebrow flex items-center justify-center gap-3 text-cream-muted md:justify-start">
          {hero.eyebrow.map((part, i) => (
            <span key={part} className="flex items-center gap-3">
              {i > 0 && <Star className="text-gold" />}
              {part}
            </span>
          ))}
        </p>

        {/* Wordmark: line one hugs the left, line two the right, leaving the centre for the sculpture. */}
        <h1
          id="home-heading"
          className="display gold-text my-auto flex flex-col py-10 text-center text-[clamp(3.6rem,14.5vw,13.5rem)] leading-[0.86] font-medium tracking-[0.06em] uppercase md:text-left"
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
                <dd className="display text-[2.4rem] leading-none text-gold-bright">{stat.value}</dd>
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

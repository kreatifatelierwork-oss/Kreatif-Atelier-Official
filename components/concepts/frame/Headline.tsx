"use client";

type Props = {
  eyebrow: string;
  /** One string, or two parts that stack on phones. */
  text: string | readonly [string, string];
  caption: readonly string[];
  as?: "h1" | "h2" | "p";
  size?: "hero" | "title";
  className?: string;
  /** Replaces the default cream text styling (e.g. a ghosted outline under an engraving). */
  textClassName?: string;
  /** Optional overlay rendered over the headline text (e.g. an engraving reveal). */
  children?: React.ReactNode;
};

/**
 * TURA macro/micro composition: a huge, heavy, centred headline with tiny wide-tracked microtype on an
 * asymmetric diagonal — eyebrow above, indented from the left; caption below, starting at the centre line.
 */
export function Headline({ eyebrow, text, caption, as: Tag = "h1", size = "hero", className = "", textClassName, children }: Props) {
  const parts = typeof text === "string" ? [text] : text;
  const sizeClass = size === "hero" ? "text-[clamp(2.9rem,7.4vw,8.4rem)]" : "text-[clamp(2.1rem,4.6vw,5rem)]";

  return (
    <div className={`relative inline-block text-center ${className}`}>
      <p className="micro absolute bottom-[calc(100%+1.9rem)] left-[18%] whitespace-nowrap text-cream-muted max-md:static max-md:mb-5 max-md:tracking-[0.22em]">{eyebrow}</p>
      <Tag className={`headline relative ${textClassName ?? "text-cream [text-shadow:0_22px_40px_rgb(0_0_0/0.55)]"} ${sizeClass}`}>
        {parts.map((p, i) => (
          <span key={p} className="max-md:block">
            {i > 0 && <span className="max-md:hidden"> </span>}
            {p}
          </span>
        ))}
        {children}
      </Tag>
      <p className="micro absolute top-[calc(100%+1.9rem)] left-1/2 text-left whitespace-nowrap text-cream-muted max-md:static max-md:mt-5 max-md:text-center max-md:text-[0.6rem] max-md:tracking-[0.2em]">
        {caption.map((c) => (
          <span key={c} className="block">{c}</span>
        ))}
      </p>
    </div>
  );
}

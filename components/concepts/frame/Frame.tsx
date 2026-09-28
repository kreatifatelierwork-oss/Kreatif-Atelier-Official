"use client";

import { frame } from "@/content/concepts";
import { mailtoHref, site } from "@/content/site";
import { conceptConfig } from "@/lib/config";

export type FrameSection = { label: string };

type Props = {
  sections: FrameSection[];
  current: number;
  onSection: (index: number) => void;
  /** First top-right link (opens a concept's second screen); the second is always Contact (mailto). */
  primaryLink: { label: string; onClick: () => void };
  /** Right-edge vertical SCROLL cue (a concept can hide it and draw its own). */
  scrollCue?: boolean;
  reducedMotion: boolean;
};

const icon = "h-[15px] w-[15px] stroke-current";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={icon} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={icon} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2c0-1.5 1-2.4 2.2-2.4s2 .9 2 2.4V16M11.5 10.5V16" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={icon} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

/**
 * TURA-style edge furniture around every prototype screen: the wordmark in type (never a mark),
 * two tiny links, a social stack, a vertical SCROLL cue, and the section index outside the content.
 * Desktop: the four edges. Phone: a top bar and a bottom bar.
 */
export function Frame({ sections, current, onSection, primaryLink, scrollCue = true, reducedMotion }: Props) {
  const socials = [
    { key: "instagramUrl" as const, label: frame.social.instagram, Icon: InstagramIcon },
    { key: "linkedinUrl" as const, label: frame.social.linkedin, Icon: LinkedInIcon },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 text-cream"
      style={{ ["--frame-inset" as string]: conceptConfig.frame.inset, ["--frame-inset-m" as string]: conceptConfig.frame.insetMobile }}
    >
      {/* Top-left: the name, set in type and stacked — never a monogram. */}
      <p aria-label={site.name} className="headline absolute top-[var(--frame-inset)] left-[var(--frame-inset)] text-[0.92rem] leading-[1] tracking-[0.18em] text-cream max-md:top-[var(--frame-inset-m)] max-md:left-[var(--frame-inset-m)] max-md:text-[0.8rem]">
        {frame.wordmark.map((w) => (
          <span key={w} aria-hidden="true" className="block">{w}</span>
        ))}
      </p>

      {/* Top-right: two tiny links. */}
      <nav aria-label="Primary" className="pointer-events-auto absolute top-[var(--frame-inset)] right-[var(--frame-inset)] flex gap-[clamp(1.25rem,4vw,4.5rem)] max-md:top-[var(--frame-inset-m)] max-md:right-[var(--frame-inset-m)]">
        <button type="button" onClick={primaryLink.onClick} className="micro text-cream-muted transition-colors hover:text-gold-bright">
          {primaryLink.label}
        </button>
        <a href={mailtoHref("Free Brand Audit Request")} className="micro text-cream-muted transition-colors hover:text-gold-bright">
          {frame.contact}
        </a>
      </nav>

      {/* Left edge (desktop) / bottom-right (phone): social stack. Links appear when URLs are set. */}
      <ul
        aria-label={site.handle}
        className="pointer-events-auto absolute bottom-[calc(var(--frame-inset)+2.4rem)] left-[calc(var(--frame-inset)+0.2rem)] flex flex-col items-center gap-5 text-cream-faint max-md:right-[var(--frame-inset-m)] max-md:bottom-[var(--frame-inset-m)] max-md:left-auto max-md:flex-row max-md:gap-4"
      >
        {socials.map(({ key, label, Icon }) => (
          <li key={key}>
            {site[key] ? (
              <a href={site[key]} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${site.handle}`} className="block transition-colors hover:text-gold-bright"><Icon /></a>
            ) : (
              <span role="img" aria-label={`${label} ${site.handle}`} title={`${label} · ${site.handle}`}><Icon /></span>
            )}
          </li>
        ))}
        <li>
          <a href={mailtoHref()} aria-label={`${frame.social.email} ${site.email}`} className="block transition-colors hover:text-gold-bright"><MailIcon /></a>
        </li>
      </ul>

      {/* Bottom-left, outside the content: the section index. */}
      <nav aria-label={frame.sectionsLabel} className="pointer-events-auto absolute bottom-[calc(var(--frame-inset)-1.6rem)] left-[var(--frame-inset)] max-md:bottom-[calc(var(--frame-inset-m)-0.3rem)] max-md:left-[var(--frame-inset-m)]">
        <ol className="flex items-baseline gap-4">
          {sections.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => onSection(i)}
                aria-current={i === current ? "step" : undefined}
                className={`group flex items-baseline gap-2 transition-colors ${i === current ? "text-cream" : "text-cream-faint hover:text-cream-muted"}`}
              >
                <span className={`headline tracking-[0.06em] ${i === current ? "text-[1.35rem]" : "text-[0.95rem]"} transition-[font-size] duration-500`}>
                  .{String(i + 1).padStart(2, "0")}
                </span>
                <span className={`micro text-[0.55rem] ${i === current ? "text-gold" : "hidden group-hover:inline"}`}>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Right edge: vertical SCROLL + a thin travelling line. */}
      {scrollCue && (
        <div className="absolute right-[calc(var(--frame-inset)+0.2rem)] bottom-[var(--frame-inset)] flex flex-col items-center gap-3 max-md:hidden" aria-hidden="true">
          <span className="micro text-[0.56rem] text-cream-faint [writing-mode:vertical-rl]">{frame.scroll}</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/10">
            <span className={`absolute inset-x-0 top-0 h-1/2 bg-gold ${reducedMotion ? "" : "animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]"}`} />
          </span>
        </div>
      )}
    </div>
  );
}

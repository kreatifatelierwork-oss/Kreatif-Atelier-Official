"use client";

import { useSyncExternalStore } from "react";
import { footer, site } from "@/content/site";
import { SocialLink } from "@/components/ui/SocialLink";
import { Star } from "@/components/ui/Star";

const BUILD_YEAR = new Date().getFullYear();
const noopSubscribe = () => () => {};

export function Footer() {
  // Static export: HTML carries the build year; the visitor's clock takes over after hydration.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  const linkedNetworks = footer.socialNetworks.filter((n) => site[n.key]);

  return (
    <footer className="border-t border-line px-[var(--gutter)] pt-16 pb-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 text-center">
        <p className="display gold-text text-[clamp(1.4rem,6vw,3.4rem)] font-medium tracking-[0.18em] whitespace-nowrap uppercase md:tracking-[0.3em]">
          {site.name}
        </p>
        <Star className="text-gold" />
        {linkedNetworks.length > 0 && (
          <ul className="eyebrow flex gap-8 text-[0.65rem] text-cream-muted">
            {linkedNetworks.map((n) => (
              <li key={n.key}>
                <SocialLink network={n.key}>{n.label}</SocialLink>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[0.8rem] text-cream-faint">
          © {year} · {footer.rights}
        </p>
        <a href="#home" className="eyebrow text-[0.62rem] text-cream-faint transition-colors hover:text-gold-bright">
          ↑ {footer.backToTop}
        </a>
      </div>
    </footer>
  );
}

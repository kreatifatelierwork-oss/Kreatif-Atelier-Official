"use client";

import { useState } from "react";
import { nav, site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { Star } from "./Star";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed top-3 left-3 z-[70] -translate-y-24 bg-gold px-4 py-3 text-ink focus:translate-y-0"
      >
        {nav.skipLink}
      </a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-gold/10 bg-ink/75 backdrop-blur-md">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between px-[var(--gutter)]">
          <a
            href="#home"
            aria-label={nav.homeLabel}
            className="display flex items-center gap-2.5 text-[1.05rem] font-medium tracking-[0.32em] text-cream uppercase transition-colors hover:text-gold-bright"
          >
            <Star className="text-gold" />
            <span aria-hidden="true">{site.name}</span>
          </a>

          <nav aria-label={nav.primaryLabel} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="eyebrow text-[0.68rem] text-cream-muted transition-colors hover:text-gold-bright"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={nav.cta.href}
                  className="eyebrow inline-flex items-center gap-2 border border-gold/60 px-5 py-2.5 text-[0.68rem] text-gold-bright transition-colors hover:bg-gold hover:text-ink"
                >
                  {nav.cta.label}
                </a>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label={nav.menuOpen}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
              <span className="h-px w-full bg-cream" />
              <span className="h-px w-2/3 self-end bg-gold" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

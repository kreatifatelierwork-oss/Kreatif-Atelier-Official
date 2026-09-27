"use client";

import { nav, site } from "@/content/site";
import { Dialog } from "./Dialog";
import { Star } from "./Star";

type Props = { open: boolean; onClose: () => void };

const links = [...nav.items, nav.cta];

export function MobileMenu({ open, onClose }: Props) {
  // Close first (restores scrolling), then jump to the section on the next frame.
  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView();
      history.replaceState(null, "", href);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="mobile-menu-title" variant="sheet">
      <div className="flex min-h-full flex-col px-[var(--gutter)] pt-24 pb-10">
        <p id="mobile-menu-title" className="eyebrow flex items-center gap-3 text-gold">
          <Star /> {site.name}
        </p>
        <nav aria-label={nav.primaryLabel} className="mt-10">
          <ul className="flex flex-col">
            {links.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={(event) => go(event, item.href)}
                  className="display flex items-baseline justify-between py-5 text-[2.4rem] text-cream transition-colors hover:text-gold-bright"
                >
                  {item.label}
                  <span className="eyebrow text-[0.65rem] text-gold">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-auto pt-12 text-sm text-cream-muted">
          <a href={`mailto:${site.email}`} className="hover:text-gold-bright">
            {site.email}
          </a>
          <br />
          {site.handle}
        </p>
      </div>
    </Dialog>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ui } from "@/content/site";

/** Id of the wrapper around all page content; it is made `inert` while a dialog is open. */
export const SITE_ROOT_ID = "site-root";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Id of the element that names the dialog (usually its heading). */
  labelledBy: string;
  children: React.ReactNode;
  /** "sheet" = full-screen menu, "panel" = centred scrollable detail panel. */
  variant?: "panel" | "sheet";
};

const noopSubscribe = () => () => {};

export function Dialog({ open, onClose, labelledBy, children, variant = "panel" }: Props) {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const root = document.getElementById(SITE_ROOT_ID);
    const returnFocusTo = document.activeElement as HTMLElement | null;

    root?.setAttribute("inert", "");
    document.documentElement.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      root?.removeAttribute("inert");
      document.documentElement.style.overflow = "";
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!isClient) return null;

  const isSheet = variant === "sheet";
  const offset = reduceMotion ? 0 : isSheet ? -12 : 24;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog"
          className={`fixed inset-0 z-[60] flex ${isSheet ? "" : "items-end justify-center md:items-center md:p-8"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            data-lenis-prevent
            className={
              isSheet
                ? "relative h-full w-full overflow-y-auto bg-ink"
                : "panel relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-ink shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] md:max-h-[88svh]"
            }
            initial={{ y: offset, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: offset, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label={ui.close}
              className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold-bright md:top-6 md:right-6"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.5">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

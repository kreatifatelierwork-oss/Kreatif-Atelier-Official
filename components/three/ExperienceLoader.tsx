"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Star } from "@/components/ui/Star";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { config } from "@/lib/config";
import { ScrollTrigger } from "@/lib/scroll/gsap";
import { scrollStore } from "@/lib/scroll/store";
import { detectQuality, type QualityDecision } from "@/lib/three/quality";
import { measureHeroAnchor, sculptureFromUrl, visibleHeroAnchor, type SculptureId } from "@/lib/three/stage";

// three.js and friends load only on the client, after the HTML hero has painted.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

const noopSubscribe = () => () => {};
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Boot = { quality: Exclude<QualityDecision, { tier: "fallback" }>; sculpture: SculptureId };

/**
 * Decides whether and how to run the 3D scene, mounts it lazily, shows the ✦ loader inside the
 * hero while shaders compile, and fades the canvas in. Software-GL / no-WebGL visitors keep
 * the static CSS hero.
 */
export function ExperienceLoader() {
  const reducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [boot, setBoot] = useState<Boot | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Boot once the page is idle: detect quality, pick the sculpture study, then mount.
  useEffect(() => {
    let retry: ReturnType<typeof setTimeout> | undefined;
    const start = (attempt = 0) => {
      const quality = detectQuality();
      document.documentElement.dataset.scene = quality.tier === "fallback" ? `fallback:${quality.reason}` : quality.tier;
      // A context can fail while the GPU process is still starting — try once more before giving up.
      if (quality.tier === "fallback" && quality.reason === "no-webgl" && attempt === 0) {
        retry = setTimeout(() => start(1), 700);
        return;
      }
      if (quality.tier === "fallback") return;
      measureHeroAnchor();
      setBoot({ quality, sculpture: sculptureFromUrl() });
      setProgress(0.35);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => start(), { timeout: config.three.mountDelayMs });
      return () => {
        window.cancelIdleCallback(id);
        clearTimeout(retry);
      };
    }
    const id = setTimeout(() => start(), 600);
    return () => {
      clearTimeout(id);
      clearTimeout(retry);
    };
  }, []);

  // Keep the DOM → 3D anchor in sync with layout.
  useEffect(() => {
    if (!boot) return;
    const onResize = () => measureHeroAnchor();
    window.addEventListener("resize", onResize);
    ScrollTrigger.addEventListener("refresh", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", onResize);
    };
  }, [boot]);

  // Fade the canvas out as the hero scrolls away (Phase 4's scene director replaces this).
  useEffect(() => {
    if (!boot) return;
    const { fadeFromVh, fadeToVh } = config.three.hero;
    const apply = () => {
      const vh = window.innerHeight;
      const fade = 1 - smoothstep(fadeFromVh * vh, fadeToVh * vh, scrollStore.getState().scrollY);
      if (fadeRef.current) fadeRef.current.style.opacity = String(fade);
      setHidden(fade <= 0.001);
    };
    apply();
    return scrollStore.subscribe(apply);
  }, [boot]);

  const onProgress = useCallback((value: number) => setProgress((p) => Math.max(p, value)), []);
  const onReady = useCallback(() => {
    setProgress(1);
    setReady(true);
  }, []);

  if (!isClient || !boot) return null;

  const anchor = visibleHeroAnchor();

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: ready ? 1 : 0 }}
      >
        <div ref={fadeRef} className="absolute inset-0">
          <Experience
            tier={boot.quality.tier}
            sculpture={boot.sculpture}
            reducedMotion={reducedMotion}
            hidden={hidden}
            onProgress={onProgress}
            onReady={onReady}
          />
        </div>
      </div>

      {anchor && createPortal(<Loader progress={progress} done={ready} spin={!reducedMotion} />, anchor)}
    </>
  );
}

/** ✦ with a thin gold ring that fills as the scene loads; sits exactly where the sculpture will appear. */
function Loader({ progress, done, spin }: { progress: number; done: boolean; spin: boolean }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  return (
    <div
      className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${done ? "opacity-0" : "opacity-100"}`}
    >
      <div className="relative grid h-16 w-16 place-items-center text-gold">
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <Star className={`text-[0.95rem] ${spin ? "animate-pulse" : ""}`} />
      </div>
    </div>
  );
}

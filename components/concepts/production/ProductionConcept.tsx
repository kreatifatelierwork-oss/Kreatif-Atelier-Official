"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Star } from "@/components/ui/Star";
import { about } from "@/content/about";
import { brand, production } from "@/content/concepts";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { config, conceptConfig } from "@/lib/config";
import { ProductionScene } from "./ProductionScene";

type Stage = "loading" | "ready" | "titles" | "playing";
const REEL_SECONDS = 48; // prototype: reel 01 runs 48 s of "film time" across the playhead
const FPS = 24;

const timecode = (p: number) => {
  const total = Math.floor(p * REEL_SECONDS * FPS);
  const f = total % FPS, s = Math.floor(total / FPS) % 60, m = Math.floor(total / FPS / 60);
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

/** Film leader: a sweeping wedge and a countdown that follows the real loading progress. */
function Leader({ progress, spin }: { progress: number; spin: boolean }) {
  const count = Math.max(1, 5 - Math.floor(progress * 5));
  return (
    <div className="relative grid h-[min(62vw,340px)] w-[min(62vw,340px)] place-items-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 text-gold" aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
        <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        <g className={spin ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}>
          <path d="M100 100 L100 4 A96 96 0 0 1 183 52 Z" fill="currentColor" fillOpacity="0.18" />
        </g>
      </svg>
      <span className="display relative text-[clamp(5rem,16vw,9rem)] leading-none text-gold-bright lining-nums">{count}</span>
    </div>
  );
}

/**
 * Concept 2 — The Production. The site is the agency's own film, in five reels.
 * Scroll plays the reel; a timeline in the letterbox shows where you are.
 */
export default function ProductionConcept() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, conceptConfig.production.loaderMinMs, reducedMotion);
  const [rolled, setRolled] = useState(false);
  const [titleStep, setTitleStep] = useState(0);
  const [intertitle, setIntertitle] = useState(false);
  const target = useRef(0);
  const playhead = useRef(0);
  const tcRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const touchY = useRef<number | null>(null);

  const stage: Stage = progress < 1 ? "loading" : !rolled ? "ready" : titleStep < 2 ? "titles" : "playing";

  // Opening title cards, then hand over to the reel.
  useEffect(() => {
    if (!rolled) return;
    const d = reducedMotion ? [0, 0] : [2600, 5600];
    const a = setTimeout(() => setTitleStep(1), d[0]);
    const b = setTimeout(() => setTitleStep(2), d[1]);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [rolled, reducedMotion]);

  // Playhead: input moves a target; a damped playhead follows; HUD updates without re-rendering.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      playhead.current += (target.current - playhead.current) * (reducedMotion ? 1 : 0.08);
      const p = playhead.current;
      if (tcRef.current) tcRef.current.textContent = timecode(p);
      if (headRef.current) headRef.current.style.left = `${p * 20}%`;
      setIntertitle(p > 0.66);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const nudge = (delta: number) => {
    if (stage !== "playing") return;
    target.current = THREE.MathUtils.clamp(target.current + delta, 0, 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) nudge(0.08);
      if (["ArrowUp", "PageUp"].includes(e.key)) nudge(-0.08);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const bars = stage === "titles" || stage === "playing" ? conceptConfig.production.letterbox * 100 : 0;

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#030305] text-cream select-none"
      onWheel={(e) => nudge(e.deltaY / 2600)}
      onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
      onTouchMove={(e) => { if (touchY.current === null) return; nudge((touchY.current - e.touches[0].clientY) / 1400); touchY.current = e.touches[0].clientY; }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 0.2, 9], near: 0.1, far: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
          gl.toneMappingExposure = config.three.exposure;
          requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        }}
      >
        <ProductionScene beam={rolled ? 1 : 0} showWall={stage === "playing"} playheadRef={playhead} headline={about.headline} reducedMotion={reducedMotion} />
      </Canvas>

      {/* Film-strip edges while loading. */}
      <AnimatePresence>
        {stage === "loading" || stage === "ready" ? (
          <motion.div key="leader" exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.7 }} className="absolute inset-0 grid place-items-center bg-[#030305]">
            {(["left-0", "right-0"] as const).map((side) => (
              <div key={side} aria-hidden="true"
                className={`absolute top-0 ${side} h-full w-10 border-x border-white/5 bg-[repeating-linear-gradient(180deg,transparent_0_14px,rgba(232,201,138,0.14)_14px_30px,transparent_30px_44px)] bg-[length:100%_44px] ${reducedMotion ? "" : "animate-[filmstrip_0.6s_linear_infinite]"}`} />
            ))}
            <div className="flex flex-col items-center">
              <Leader progress={progress} spin={!reducedMotion} />
              <p className="eyebrow mt-6 text-[0.62rem] text-cream-faint">
                {production.leader} · <span className="tabular-nums">{Math.round(progress * 100)}%</span>
              </p>
              {stage === "ready" && (
                <motion.button type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} autoFocus
                  onClick={() => setRolled(true)}
                  className="eyebrow mt-8 flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[0.72rem] font-semibold text-ink transition-[filter] hover:brightness-110">
                  <span aria-hidden="true">▶</span> {production.roll}
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Letterbox bars (2.39:1) — the HUD lives inside them. */}
      <div aria-hidden={stage !== "playing"} className="pointer-events-none absolute inset-x-0 top-0 bg-black transition-[height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ height: `${bars}vh` }}>
        {stage === "playing" && (
          <div className="flex h-full items-end justify-between px-[4vw] pb-3 text-[0.62rem] tracking-[0.22em] uppercase">
            <span className="text-gold">Reel 01 · {production.reels[0]}</span>
            <span ref={tcRef} className="font-mono text-cream-faint tabular-nums">00:00:00:00</span>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-black transition-[height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ height: `${bars}vh` }}>
        {stage === "playing" && (
          <nav aria-label="Reels" className="relative mx-[4vw] mt-4">
            <ol className="grid grid-cols-5 gap-1">
              {production.reels.map((reel, i) => (
                <li key={reel}>
                  <div className={`h-[3px] ${i === 0 ? "bg-gold/40" : "bg-white/12"}`} />
                  <p className={`mt-2 text-[0.6rem] tracking-[0.2em] uppercase ${i === 0 ? "text-gold" : "text-cream-faint"}`}>
                    {String(i + 1).padStart(2, "0")} · {reel}
                  </p>
                </li>
              ))}
            </ol>
            <div ref={headRef} aria-hidden="true" className="absolute -top-1 h-[11px] w-px bg-gold-bright shadow-[0_0_10px_var(--gold-bright)]" />
          </nav>
        )}
      </div>

      {/* Opening title cards. */}
      <AnimatePresence mode="wait">
        {stage === "titles" && titleStep === 0 && (
          <motion.p key="t0" className="eyebrow absolute inset-0 grid place-items-center text-[0.8rem] tracking-[0.5em] text-cream"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.6 }}>
            {production.presents}
          </motion.p>
        )}
        {stage === "titles" && titleStep === 1 && (
          <motion.div key="t1" className="absolute inset-0 grid place-items-center px-6 text-center"
            initial={{ opacity: 0, filter: "blur(12px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 1.1 }}>
            <div>
              <p className="display text-[clamp(2.2rem,5vw,4.4rem)] leading-tight">{brand.lineA}</p>
              <p className="emph text-[clamp(2.2rem,5vw,4.4rem)] leading-tight">{brand.lineB}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel 01 intertitle, after the camera passes through the type. */}
      <AnimatePresence>
        {stage === "playing" && intertitle && (
          <motion.section key="intertitle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
            className="absolute inset-x-[8vw] top-1/2 max-w-2xl -translate-y-1/2">
            <p className="eyebrow flex items-center gap-2 text-[0.65rem] text-gold"><Star /> {about.marker}</p>
            <h2 className="display mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-tight">
              {about.headline.lead} <span className="emph">{about.headline.emphasis}</span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-cream-muted">{about.intro}</p>
          </motion.section>
        )}
      </AnimatePresence>
      {stage === "playing" && !intertitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="eyebrow pointer-events-none absolute inset-x-0 bottom-[16vh] text-center text-[0.6rem] text-cream-faint">
          {production.scrollHint} ↓
        </motion.p>
      )}
      <h2 className="sr-only">{about.headline.lead} {about.headline.emphasis}</h2>
    </div>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Dialog } from "@/components/ui/Dialog";
import { about } from "@/content/about";
import { brand, production } from "@/content/concepts";
import { founders } from "@/content/founders";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { config, conceptConfig } from "@/lib/config";
import { FanCarousel } from "../frame/FanCarousel";
import { Frame } from "../frame/Frame";
import { Headline } from "../frame/Headline";
import { Spotlight } from "../frame/Spotlight";
import type { TypeStyle } from "../frame/useLab";
import { ProductionScene } from "./ProductionScene";

type Stage = "loading" | "ready" | "titles" | "playing";
const REEL_SECONDS = 48; // prototype: reel 01 runs 48 s of "film time" across the playhead
const FPS = 24;
const REEL_SCREENS: Record<number, number> = { 0: 0, 2: 1 }; // timeline reel → prototype screen

const timecode = (p: number) => {
  const total = Math.floor(p * REEL_SECONDS * FPS);
  const f = total % FPS, s = Math.floor(total / FPS) % 60, m = Math.floor(total / FPS / 60);
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

/** Film leader: a sweeping wedge and a countdown that follows the real loading progress. */
function Leader({ progress, spin }: { progress: number; spin: boolean }) {
  const count = Math.max(1, 5 - Math.floor(progress * 5));
  return (
    <div className="relative grid h-[min(56vw,300px)] w-[min(56vw,300px)] place-items-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 text-gold" aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
        <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        <g className={spin ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}>
          <path d="M100 100 L100 4 A96 96 0 0 1 183 52 Z" fill="currentColor" fillOpacity="0.18" />
        </g>
      </svg>
      <span className="headline relative text-[clamp(5rem,15vw,8.5rem)] text-gold-bright">{count}</span>
    </div>
  );
}

function CrewCard({ index }: { index: number }) {
  const f = founders[index];
  return (
    <div className="relative h-full w-full">
      <Image src={f.image} alt="" width={f.imageWidth} height={f.imageHeight} sizes="(max-width: 768px) 62vw, 27vw"
        className="h-full w-full object-cover object-top [filter:sepia(0.22)_saturate(0.85)_brightness(0.8)_contrast(1.08)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_3_5/0.25)_0%,transparent_30%,rgb(3_3_5/0.85)_100%)]" />
      <p className="micro absolute top-4 left-5 text-[0.55rem] text-gold">{f.role}</p>
      <p className="headline absolute top-3.5 right-5 text-[0.9rem] text-cream-muted">.{String(index + 1).padStart(2, "0")}</p>
    </div>
  );
}

/**
 * Concept 2 — The Production. The site is the agency's own film, in five reels.
 * TURA frame: the edge furniture lives in the letterbox bars; one focal point per screen.
 */
export default function ProductionConcept({ type }: { type: TypeStyle }) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, conceptConfig.production.loaderMinMs, reducedMotion);
  const [rolled, setRolled] = useState(false);
  const [titlesDone, setTitlesDone] = useState(false);
  const [intertitle, setIntertitle] = useState(false);
  const [screen, setScreen] = useState(0);
  const [crew, setCrew] = useState(0);
  const [bio, setBio] = useState(false);
  const target = useRef(0);
  const playhead = useRef(0);
  const tcRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const touchY = useRef<number | null>(null);

  const stage: Stage = progress < 1 ? "loading" : !rolled ? "ready" : !titlesDone ? "titles" : "playing";

  useEffect(() => {
    if (!rolled) return;
    const t = setTimeout(() => setTitlesDone(true), reducedMotion ? 0 : 4200);
    return () => clearTimeout(t);
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
    if (stage !== "playing" || screen !== 0) return;
    target.current = THREE.MathUtils.clamp(target.current + delta, 0, 1);
  };
  const showSection = (i: number) => {
    if (!rolled) setRolled(true);
    setTitlesDone(true);
    setScreen(i);
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
        <ProductionScene beam={rolled ? 1 : 0} showWall={stage === "playing" && screen === 0} playheadRef={playhead}
          headline={about.headline} typeStyle={type} reducedMotion={reducedMotion} />
      </Canvas>
      <Spotlight y="44%" strength={stage === "loading" || stage === "ready" ? 0.08 : 0.13} />

      {/* .01 loader — the film leader is the single focal point. */}
      <AnimatePresence>
        {(stage === "loading" || stage === "ready") && (
          <motion.div key="leader" exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.7 }} className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center">
              <Leader progress={progress} spin={!reducedMotion} />
              <p className="micro mt-6 text-cream-faint">
                {production.leader} · <span className="tabular-nums">{Math.round(progress * 100)}%</span>
              </p>
              {stage === "ready" && (
                <motion.button type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} autoFocus onClick={() => setRolled(true)}
                  className="micro float-shadow mt-8 flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[0.66rem] font-semibold text-ink transition-[filter] hover:brightness-110">
                  <span aria-hidden="true">▶</span> {production.roll}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letterbox bars (2.39:1). Top: reel + timecode between the frame's wordmark and links. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-black transition-[height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ height: `${bars}vh` }}>
        {stage === "playing" && (
          <p className="micro absolute inset-x-0 bottom-3 text-center text-[0.58rem] text-cream-faint max-md:hidden">
            <span className="text-gold">Reel {screen === 0 ? "01" : "03"} · {production.reels[screen === 0 ? 0 : 2]}</span>
            <span className="mx-3 text-white/20">|</span>
            <span ref={tcRef} className="tabular-nums">00:00:00:00</span>
          </p>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-black transition-[height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ height: `${bars}vh` }}>
        {stage === "playing" && (
          <nav aria-label="Reels" className="absolute top-4 right-[22%] left-[22%] max-md:right-[4vw] max-md:left-[26vw]">
            <ol className="grid grid-cols-5 gap-1">
              {production.reels.map((reel, i) => {
                const target = REEL_SCREENS[i];
                const current = target === screen;
                return (
                  <li key={reel}>
                    <button type="button" disabled={target === undefined} onClick={() => target !== undefined && setScreen(target)} className="block w-full text-left disabled:cursor-default">
                      <span className={`block h-[3px] ${current ? "bg-gold/45" : "bg-white/12"}`} />
                      <span className={`micro mt-2 block text-[0.52rem] ${current ? "text-gold" : target === undefined ? "text-white/25" : "text-cream-faint hover:text-cream"}`}>
                        {String(i + 1).padStart(2, "0")}<span className="max-md:hidden"> · {reel}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {screen === 0 && <div ref={headRef} aria-hidden="true" className="absolute -top-1 h-[11px] w-px bg-gold-bright shadow-[0_0_10px_var(--gold-bright)]" />}
          </nav>
        )}
      </div>

      {/* Opening title card in the TURA composition. */}
      <AnimatePresence>
        {stage === "titles" && (
          <motion.div key="titles" className="absolute inset-0 grid place-items-center px-6"
            initial={{ opacity: 0, filter: "blur(14px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : 0.6 }}>
            <Headline eyebrow={production.presents} text={["Kreatif", "Atelier"]} caption={[brand.lineA, brand.lineB]} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel 01 intertitle after the camera passes through the type. */}
      <AnimatePresence>
        {stage === "playing" && screen === 0 && intertitle && (
          <motion.section key="intertitle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-6 text-center">
            <p className="micro text-[0.6rem] text-gold">{about.marker}</p>
            <h2 className="headline mt-6 text-[clamp(2rem,4.2vw,4.4rem)] text-cream">
              {about.headline.lead} <span className="text-gold-bright">{about.headline.emphasis}</span>
            </h2>
            <p className="mt-6 max-w-[34rem] text-[0.86rem] leading-[1.9] text-cream-muted">{about.intro}</p>
          </motion.section>
        )}
      </AnimatePresence>
      {stage === "playing" && screen === 0 && !intertitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="micro pointer-events-none absolute inset-x-0 bottom-[16vh] text-center text-[0.56rem] text-cream-faint">
          {production.scrollHint} ↓
        </motion.p>
      )}

      {/* .02 — Reel 03, The Crew: founders in the fanned depth carousel. */}
      <AnimatePresence>
        {stage === "playing" && screen === 1 && (
          <motion.div key="crew" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.7 }}
            className="absolute inset-x-0 top-[12vh] bottom-[12vh] flex items-center justify-center bg-[#030305]/55">
            <FanCarousel
              ariaLabel={production.reels[2]}
              items={founders.map((f, i) => ({ id: f.slug, label: f.name, visual: <CrewCard index={i} /> }))}
              index={crew} onIndex={setCrew}
              title={founders[crew].name}
              body={founders[crew].roleFull}
              action={{ label: production.readBio, onClick: () => setBio(true) }}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog open={bio} onClose={() => setBio(false)} labelledBy="crew-bio-title">
        <div className="p-8 pt-16 md:p-12">
          <p className="micro text-[0.58rem] text-gold">{founders[crew].roleFull}</p>
          <h2 id="crew-bio-title" className="headline mt-4 text-[2.2rem] text-cream">{founders[crew].name}</h2>
          <p className="mt-5 leading-[1.85] text-cream-muted">{founders[crew].bio}</p>
        </div>
      </Dialog>

      <Frame
        sections={production.sections.map((label) => ({ label }))}
        current={screen}
        onSection={showSection}
        primaryLink={{ label: production.crewLink, onClick: () => showSection(1) }}
        reducedMotion={reducedMotion}
      />
      <h2 className="sr-only">{about.headline.lead} {about.headline.emphasis}</h2>
    </div>
  );
}

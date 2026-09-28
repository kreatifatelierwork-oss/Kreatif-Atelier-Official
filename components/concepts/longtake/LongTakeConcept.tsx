"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { longTake } from "@/content/concepts";
import { mailtoHref, site } from "@/content/site";
import { holding, impact, serves, verticals } from "@/content/verticals";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { longTakeConfig as L } from "@/lib/config";
import { activeReel, REELS, timecode } from "./journey";
import { LongTakeScene } from "./LongTakeScene";
import type { Palette } from "./Worlds";

type Phase = "loading" | "ready" | "opening" | "journey";

const MOBILE = "(max-width: 767px)";
const subscribeMobile = (cb: () => void) => {
  const m = window.matchMedia(MOBILE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const reelName = (k: number) => (k === 0 ? longTake.reelCore : k === REELS - 1 ? longTake.reelFinale : verticals[k - 1].name);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Concept 4 — The Long Take (Orrery × Production).
 * The holding company is the radiant core of an orrery; the five verticals are worlds on its ring, each in its own
 * signature colour. The site plays as one continuous camera take through them, reel by reel, with a timeline.
 */
export default function LongTakeConcept({ palette }: { palette: Palette }) {
  const reducedMotion = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE).matches, () => false);
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, L.loaderMinMs, reducedMotion);
  const [phase, setPhase] = useState<Phase>("loading");
  const [reel, setReel] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [raised, setRaised] = useState(false);

  const targetRef = useRef(0);
  const sRef = useRef(0);
  const openingRef = useRef(0);
  const presenceRef = useRef<number[]>([]);
  const raiseRef = useRef(0);
  const hazeRef = useRef(0);
  const anchorsRef = useRef<{ reel: number; presence: number; pts: { x: number; y: number }[] }>({ reel: 0, presence: 0, pts: [] });
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const holdingRef = useRef(false);
  const lastInput = useRef(0);
  const touchY = useRef<number | null>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const holdFillRef = useRef<HTMLSpanElement>(null);

  const ink = L.ink[palette];
  const accent = L.worlds[reel].accent;
  const journeyOn = phase === "journey";

  if (phase === "loading" && progress >= 1) setPhase("ready");

  const begin = () => {
    if (reducedMotion) { openingRef.current = 1; setPhase("journey"); return; }
    setPhase("opening");
  };

  const jump = useCallback((k: number) => {
    targetRef.current = THREE.MathUtils.clamp(k, 0, REELS - 1);
    lastInput.current = performance.now();
  }, []);

  const nudge = useCallback((delta: number) => {
    if (phase !== "journey" || menuOpen) return;
    targetRef.current = THREE.MathUtils.clamp(targetRef.current + delta, 0, REELS - 1);
    lastInput.current = performance.now();
  }, [phase, menuOpen]);

  // Opening sequence: pull back out of the core's light.
  useEffect(() => {
    if (phase !== "opening") return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      openingRef.current = Math.min(1, (now - start) / L.openingMs);
      if (openingRef.current >= 1) { setPhase("journey"); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  // HUD loop: playhead, timecode, active reel, text dissolving into haze, gentle snap to the nearest reel, hold-to-raise.
  useEffect(() => {
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const s = sRef.current;
      if (playheadRef.current) playheadRef.current.style.left = `${((s + 0.5) / REELS) * 100}%`;
      if (tcRef.current) tcRef.current.textContent = timecode(s);
      if (textRef.current) textRef.current.style.opacity = String(Math.max(0, 1 - hazeRef.current * 1.6));
      const r = activeReel(s);
      setReel((prev) => (prev === r ? prev : r));
      // Rest on a world when the visitor stops scrolling.
      const t = targetRef.current, near = Math.round(t);
      if (now - lastInput.current > 450 && Math.abs(near - t) > 0.001) targetRef.current = t + (near - t) * Math.min(1, dt * 5);
      // Hold to raise (Aurelius).
      if (holdingRef.current) raiseRef.current = Math.min(1, raiseRef.current + dt / 1.3);
      else if (raiseRef.current < 1) raiseRef.current = Math.max(0, raiseRef.current - dt * 0.6);
      if (holdFillRef.current) holdFillRef.current.style.width = `${raiseRef.current * 100}%`;
      // Annotations follow their 3D anchors.
      const an = anchorsRef.current;
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = an.pts[i];
        const o = p ? Math.min(1, Math.max(0, an.presence * 1.8 - i * 0.18)) : 0;
        el.style.opacity = String(o);
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        if (p) el.style.transform = `translate(${p.x}px, ${p.y + (1 - o) * 10}px) translate(${i % 2 ? "0%" : "-100%"}, -50%)`;
      });
      setRaised((prev) => (prev === raiseRef.current >= 1 ? prev : raiseRef.current >= 1));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Keyboard: arrows / PageUp/PageDown travel, 0–6 jump, Esc closes the menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); return; }
      if (menuOpen || phase !== "journey") return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); jump(Math.round(targetRef.current) + 1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); jump(Math.round(targetRef.current) - 1); }
      if (/^[0-6]$/.test(e.key)) jump(Number(e.key));
      if (e.key === "Home") jump(0);
      if (e.key === "End") jump(REELS - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, phase, jump]);

  const vars = {
    ["--lt-ink" as string]: ink,
    ["--lt-bg" as string]: L.worlds[reel][palette].bg,
    ["--lt-accent" as string]: accent,
  };

  return (
    <div
      data-palette={palette}
      className="lt-root fixed inset-0 touch-none overflow-hidden text-[var(--lt-ink)] select-none"
      style={{ ...vars, background: L.worlds[0][palette].bg }}
      onWheel={(e) => nudge(e.deltaY / L.wheelPerReel)}
      onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
      onTouchMove={(e) => {
        if (touchY.current === null) return;
        const y = e.touches[0].clientY;
        nudge((touchY.current - y) / L.touchPerReel);
        touchY.current = y;
      }}
      onTouchEnd={() => { touchY.current = null; }}
    >
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ fov: mobile ? 52 : 35, position: [0, 0.4, 3.4], near: 0.1, far: 220 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
          gl.toneMappingExposure = palette === "a" ? 1.0 : 1.0;
        }}
        className="!absolute inset-0"
        style={{ opacity: phase === "loading" || phase === "ready" ? 0 : 1, transition: "opacity 1.2s ease" }}
      >
        <LongTakeScene
          palette={palette} reducedMotion={reducedMotion} mobile={mobile}
          targetRef={targetRef} sRef={sRef} openingRef={openingRef} presenceRef={presenceRef}
          raiseRef={raiseRef} hazeRef={hazeRef} anchorsRef={anchorsRef} onReady={() => setReady(true)}
        />
      </Canvas>

      {/* Soft spotlight of the current world's colour behind the focal point. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms]"
        style={{ background: `radial-gradient(60vmax 50vmax at 50% 42%, ${accent}${palette === "a" ? "1f" : "33"} 0%, transparent 62%)`, mixBlendMode: palette === "a" ? "multiply" : "screen" }} />

      {/* ── Loader: a gold ring draws itself; the five worlds light up on it; then Begin. ── */}
      <AnimatePresence>
        {(phase === "loading" || phase === "ready") && (
          <motion.div key="loader" className="absolute inset-0 z-30 grid place-items-center"
            style={{ background: L.worlds[0][palette].bg }}
            exit={{ opacity: 0, scale: 1.6, filter: "blur(18px)" }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.4, 0, 0.2, 1] }}>
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 120 120" className="h-56 w-56 max-md:h-44 max-md:w-44" aria-hidden="true">
                <circle cx="60" cy="60" r="46" fill="none" stroke={ink} strokeOpacity="0.1" strokeWidth="0.8" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#C9A45C" strokeWidth="1.4" strokeLinecap="round"
                  pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress} transform="rotate(-90 60 60)" />
                {verticals.map((v, i) => {
                  const a = -Math.PI / 2 + ((i + 1) / 5) * Math.PI * 2;
                  const lit = progress >= (i + 1) / 6;
                  return (
                    <circle key={v.slug} cx={60 + Math.cos(a) * 46} cy={60 + Math.sin(a) * 46} r={lit ? 4 : 1.5}
                      fill={L.worlds[i + 1].accent} style={{ transition: "r 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
                  );
                })}
                <circle cx="60" cy="60" r={6 + progress * 6} fill="#F6D9A0" opacity={0.35 + progress * 0.5} />
              </svg>
              <p className="micro mt-6 opacity-60">{longTake.loading} · <span className="tabular-nums">{Math.round(progress * 100)}%</span></p>
              <div className="mt-6 h-12">
                {phase === "ready" && (
                  <motion.button type="button" autoFocus onClick={begin}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="micro lt-pill rounded-full px-8 py-3.5">
                    ▶&nbsp;&nbsp;{longTake.begin}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reel text: TURA composition over the world's lower edge; dissolves into the haze while travelling. ── */}
      {(phase === "opening" || journeyOn) && (
        <div ref={textRef} className="pointer-events-none absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            <motion.div key={phase === "opening" ? "open" : reel}
              initial={{ opacity: 0, filter: "blur(10px)", y: 14 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, delay: phase === "opening" ? 2.4 : 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-x-0 flex flex-col items-center px-5 text-center ${
                phase !== "opening" && reel === REELS - 1 ? "top-[53%] max-md:top-[40%]" : "top-[60%] max-md:top-[56%]"
              }`}>
              <ReelText reel={phase === "opening" ? 0 : reel} raised={raised} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* The four "what we do" items, attached to the world (desktop; phones list them under the name). */}
      {journeyOn && reel >= 1 && reel <= 5 && !mobile && (
        <ul className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {verticals[reel - 1].whatWeDo.map((item, i) => (
            <li key={`${reel}-${item}`}>
              <div ref={(el) => { labelRefs.current[i] = el; }} data-palette={palette} className="lt-annotation absolute top-0 left-0" style={{ opacity: 0 }}>
                <span className="lt-annotation-dot" aria-hidden="true" />
                <span className="lt-annotation-num">{pad(i + 1)}</span>
                <span>{item}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Aurelius: hold to raise the ascent (keyboard: hold Space/Enter; reduced motion: click). */}
      {journeyOn && reel === 1 && !menuOpen && (
        <button type="button"
          className="micro lt-pill absolute bottom-[calc(var(--lt-inset)+4.6rem)] left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-full px-7 py-3 max-md:bottom-[7.2rem]"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); holdingRef.current = true; }}
          onPointerUp={() => { holdingRef.current = false; }}
          onPointerCancel={() => { holdingRef.current = false; }}
          onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); holdingRef.current = true; } }}
          onKeyUp={() => { holdingRef.current = false; }}
          onClick={() => { if (reducedMotion) raiseRef.current = 1; }}
          aria-pressed={raised}
        >
          <span ref={holdFillRef} aria-hidden="true" className="absolute inset-y-0 left-0 bg-[var(--lt-accent)] opacity-25" />
          <span className="relative">{raised ? `✓ ${longTake.raised}` : longTake.holdToRaise}</span>
        </button>
      )}

      {/* ── Frame (TURA edge furniture, adapted to the light palette) ── */}
      <div inert={menuOpen} className="pointer-events-none absolute inset-0 z-20 [--lt-inset:clamp(1.1rem,3.4vw,3rem)]">
        <p className="headline absolute top-[var(--lt-inset)] left-[var(--lt-inset)] text-[0.9rem] leading-none tracking-[0.18em]" aria-label={site.name}>
          <span aria-hidden="true" className="block">Kreatif</span>
          <span aria-hidden="true" className="block">Atelier</span>
        </p>
        <nav aria-label="Primary" className="pointer-events-auto absolute top-[var(--lt-inset)] right-[var(--lt-inset)] flex gap-[clamp(1.2rem,4vw,4rem)]">
          <button type="button" onClick={() => setMenuOpen(true)} className="micro opacity-70 transition-opacity hover:opacity-100" aria-haspopup="dialog">
            {longTake.jumpLabel}
          </button>
          <a href={mailtoHref("Free Brand Audit Request")} className="micro opacity-70 transition-opacity hover:opacity-100">{longTake.contact}</a>
        </nav>
        <p aria-hidden="true" className="micro absolute top-1/2 left-[calc(var(--lt-inset)-0.3rem)] -translate-y-1/2 -rotate-180 text-[0.56rem] opacity-45 [writing-mode:vertical-rl] max-md:hidden">
          {holding.motto.join("  |  ")}
        </p>
        <div aria-hidden="true" className="absolute top-1/2 right-[var(--lt-inset)] flex -translate-y-1/2 flex-col items-center gap-3 opacity-50 max-md:hidden">
          <span className="micro text-[0.54rem] [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-[var(--lt-ink)]/15">
            <span className={`absolute inset-x-0 top-0 h-1/2 bg-[var(--lt-accent)] ${reducedMotion ? "" : "animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]"}`} />
          </span>
        </div>

        {/* Reel timeline — the section index and the navigation. */}
        {journeyOn && (
          <nav aria-label={`${longTake.reel}s`} className="pointer-events-auto absolute right-[var(--lt-inset)] bottom-[var(--lt-inset)] left-[var(--lt-inset)]">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <p className="micro text-[0.58rem]">
                <span className="opacity-50">{longTake.reel} {pad(reel)} / {pad(REELS - 1)}</span>
                <span className="mx-2 opacity-25">—</span>
                <span style={{ color: palette === "a" && reel > 0 && reel < 6 ? accent : undefined }}>{reelName(reel)}</span>
              </p>
              <p className="micro text-[0.58rem] opacity-50"><span className="max-md:hidden">TC </span><span ref={tcRef} className="tabular-nums">00:00:00:00</span></p>
            </div>
            <ol className="relative grid grid-cols-7 gap-1.5">
              {Array.from({ length: REELS }, (_, k) => (
                <li key={k}>
                  <button type="button" onClick={() => jump(k)} aria-current={k === reel ? "step" : undefined}
                    aria-label={`${longTake.reel} ${pad(k)}: ${reelName(k)}`} className="group block w-full py-2 text-left">
                    <span className="block h-[3px] rounded-full transition-opacity duration-500"
                      style={{ background: L.worlds[k].accent, opacity: k === reel ? 1 : 0.28 }} />
                    <span className={`micro mt-2 block truncate text-[0.52rem] transition-opacity max-md:hidden ${k === reel ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`}>
                      {pad(k)} · {reelName(k)}
                    </span>
                  </button>
                </li>
              ))}
              <div ref={playheadRef} aria-hidden="true" className="pointer-events-none absolute top-[3px] h-3 w-px -translate-x-1/2 bg-[var(--lt-ink)]" />
            </ol>
          </nav>
        )}
        {journeyOn && reel === 0 && (
          <p aria-hidden="true" className="micro absolute inset-x-0 bottom-[calc(var(--lt-inset)+4.4rem)] text-center text-[0.56rem] opacity-50 max-md:bottom-[6.6rem]">
            {mobile ? longTake.swipeHint : longTake.scrollHint} ↓
          </p>
        )}
      </div>

      {/* ── Jump menu: every reel, one tap away. ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div key="menu" role="dialog" aria-modal="true" aria-label={longTake.jumpLabel}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}
            className="lt-glass absolute inset-0 z-40 flex flex-col justify-center px-[clamp(1.25rem,8vw,9rem)]">
            <button type="button" onClick={() => setMenuOpen(false)} className="micro absolute top-[clamp(1.1rem,3.4vw,3rem)] right-[clamp(1.1rem,3.4vw,3rem)] opacity-70 hover:opacity-100">
              {longTake.close} ✕
            </button>
            <p className="micro opacity-50">{longTake.jumpLabel}</p>
            <ol className="mt-6 divide-y divide-[var(--lt-ink)]/10 border-y border-[var(--lt-ink)]/10">
              {Array.from({ length: REELS }, (_, k) => (
                <li key={k}>
                  <button type="button" autoFocus={k === reel} onClick={() => { setMenuOpen(false); if (phase !== "journey") begin(); jump(k); }}
                    className="group flex w-full items-center gap-5 py-3.5 text-left max-md:gap-3 max-md:py-2.5">
                    <span className="micro w-8 text-[0.6rem] opacity-50">{pad(k)}</span>
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: L.worlds[k].accent }} />
                    <span className="headline flex-1 text-[clamp(1.4rem,3.4vw,2.8rem)] transition-transform duration-300 group-hover:translate-x-2">{reelName(k)}</span>
                    {k > 0 && k < 6 && <span className="micro text-right text-[0.56rem] opacity-55 max-md:hidden">{verticals[k - 1].tagline.join(" · ")}</span>}
                  </button>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The whole structure as plain HTML for screen readers and search (the visible text above shows one reel at a time). */}
      <section className="sr-only">
        <h1>{holding.name}</h1>
        <p>{holding.motto.join(" | ")}</p>
        <p>{holding.lines.ecosystem} {holding.lines.verticals} {holding.lines.tomorrow}</p>
        <h2>{holding.labels.vision}</h2><p>{holding.vision}</p>
        <h2>{holding.labels.pillars}</h2><ul>{holding.pillars.map((p) => <li key={p}>{p}</li>)}</ul>
        {verticals.map((v) => (
          <article key={v.slug}>
            <h2>{v.name}</h2><p>{v.tagline.join(". ")}.</p>
            <h3>{holding.labels.whatWeDo}</h3><ul>{v.whatWeDo.map((w) => <li key={w}>{w}</li>)}</ul>
            <h3>{holding.labels.value}</h3><p>{v.value}</p>
          </article>
        ))}
        <h2>{holding.labels.serves}</h2><ul>{serves.map((x) => <li key={x}>{x}</li>)}</ul>
        <h2>{holding.labels.impact}</h2><ul>{impact.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
    </div>
  );
}

/** One reel's text: huge name, microtype eyebrow (tagline) and caption (value line) — TURA macro/micro. */
function ReelText({ reel, raised }: { reel: number; raised: boolean }) {
  if (reel === 0) {
    return (
      <div aria-hidden="true">
        <p className="micro opacity-60">{holding.motto.join("  |  ")}</p>
        <p className="headline mt-5 text-[clamp(3rem,8.4vw,9rem)]">{holding.name}</p>
        <p className="micro mx-auto mt-6 max-w-[34rem] leading-[2] opacity-70">{holding.lines.ecosystem}<br />{holding.lines.verticals}</p>
      </div>
    );
  }
  if (reel === REELS - 1) {
    return (
      <div aria-hidden="true">
        <p className="micro opacity-60 max-md:text-[0.56rem]">{holding.lines.verticals}</p>
        <p className="headline mt-3 text-[clamp(1.9rem,4.2vw,4.6rem)]">{holding.lines.tomorrow}</p>
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-10 text-left max-md:mt-4 max-md:gap-5">
          {[[holding.labels.serves, serves], [holding.labels.impact, impact]].map(([label, list]) => (
            <div key={label as string}>
              <p className="micro text-[0.58rem] opacity-50">{label as string}</p>
              <ul className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.86rem] max-md:grid-cols-1 max-md:gap-y-0.5 max-md:text-[0.72rem]">
                {(list as readonly string[]).map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <a href={mailtoHref("Free Brand Audit Request")} className="micro lt-pill pointer-events-auto mt-6 inline-block rounded-full px-7 py-3.5 max-md:mt-4 max-md:px-5 max-md:py-2.5">
          {site.email}
        </a>
      </div>
    );
  }
  const v = verticals[reel - 1];
  const long = v.name.length > 14;
  return (
    <div aria-hidden="true">
      <p className="micro opacity-70">
        <span className="opacity-60">{pad(reel)} / 05 — </span>
        <span style={{ color: "var(--lt-accent)" }}>{v.tagline.join("  ·  ")}</span>
      </p>
      <p className={`headline mt-4 ${long ? "text-[clamp(2.2rem,5.8vw,6.4rem)]" : "text-[clamp(3rem,8.6vw,9.4rem)]"}`}>{v.name}</p>
      <p className="micro mx-auto mt-5 max-w-[30rem] leading-[2]" style={{ color: raised && reel === 1 ? "var(--lt-accent)" : undefined, opacity: raised && reel === 1 ? 1 : 0.7 }}>
        {v.value}
      </p>
      {/* Phones: the four "what we do" items as a list (desktop shows them attached to the sculpture). */}
      <ul className="mx-auto mt-5 hidden max-w-[20rem] grid-cols-2 gap-x-4 gap-y-1.5 text-left text-[0.72rem] leading-snug max-md:grid">
        {v.whatWeDo.map((w, i) => <li key={w}><span className="opacity-40">{pad(i + 1)} </span>{w}</li>)}
      </ul>
    </div>
  );
}

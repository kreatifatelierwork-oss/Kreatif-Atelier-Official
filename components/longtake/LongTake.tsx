"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { longTake } from "@/content/concepts";
import { founders, foundersIntro } from "@/content/founders";
import { mailtoHref, site } from "@/content/site";
import { holding, impact, serves, verticals } from "@/content/verticals";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { longTakeConfig as L } from "@/lib/config";
import { detectQuality } from "@/lib/three/quality";
import { FoundersPanel } from "./FoundersPanel";
import { Interaction } from "./Interaction";
import { activeReel, CONTACT, ECOSYSTEM, followTimeline, isVertical, REELS, timecode } from "./journey";
import { JumpMenu } from "./JumpMenu";
import { pad, reelName } from "./labels";
import { completion, createPlay, stepPlay } from "./play";
import type { Anchors } from "./Scene";
import { Timeline } from "./Timeline";
import type { Palette } from "./Worlds";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

type Phase = "loading" | "ready" | "opening" | "journey";
type Mode = "pending" | "webgl" | "fallback";

const MOBILE = "(max-width: 767px)";
const subscribeMobile = (cb: () => void) => {
  const m = window.matchMedia(MOBILE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const noopSubscribe = () => () => {};


/**
 * The Long Take — Kreatif Atelier's home page. One continuous camera take through the core and five
 * vertical worlds, eight reels on a timeline. This shell (text, navigation, overlays) is server-rendered;
 * the 3D stage loads after first paint. Weak devices get a CSS fallback with the same reels and navigation.
 */
export function LongTake({ paletteOverride }: { paletteOverride?: Palette } = {}) {
  const reducedMotion = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE).matches, () => false);
  const urlPalette = useSyncExternalStore(noopSubscribe, () => (new URLSearchParams(window.location.search).get("palette") === "b" ? "b" : "a"), () => "a") as Palette;
  const palette = paletteOverride ?? urlPalette;

  const [mode, setMode] = useState<Mode>("pending");
  const [stageReady, setStageReady] = useState(false);
  const progress = useLoadProgress(mode === "fallback" || stageReady, L.loaderMinMs, reducedMotion);
  const [phase, setPhase] = useState<Phase>("loading");
  const [reel, setReel] = useState(0);
  const [overlay, setOverlay] = useState<"none" | "menu" | "founders">("none");
  const [done, setDone] = useState<boolean[]>(() => Array(REELS).fill(false));

  const targetRef = useRef(0);
  const sRef = useRef(0);
  const openingRef = useRef(0);
  const presenceRef = useRef<number[]>([]);
  const playRef = useRef(createPlay());
  const hazeRef = useRef(0);
  const anchorsRef = useRef<Anchors>({ reel: 0, presence: 0, pts: [] });
  const lastInput = useRef(0);
  const touch = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);

  const ink = L.ink[palette];
  const accent = L.worlds[reel].accent;
  const journeyOn = phase === "journey";
  const overlayOpen = overlay !== "none";

  if (phase === "loading" && progress >= 1) setPhase("ready");

  // Decide how to render once the page is idle (after first paint).
  useEffect(() => {
    // `?fallback` forces the CSS version (for testing what weak devices get).
    const forced = new URLSearchParams(window.location.search).has("fallback");
    const decide = () => setMode(forced || detectQuality().tier === "fallback" ? "fallback" : "webgl");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(decide, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(decide, 300);
    return () => clearTimeout(id);
  }, []);

  const begin = () => {
    if (reducedMotion || mode === "fallback") { openingRef.current = 1; setPhase("journey"); return; }
    setPhase("opening");
  };

  const jump = useCallback((k: number) => {
    targetRef.current = Math.min(REELS - 1, Math.max(0, k));
    lastInput.current = performance.now();
  }, []);

  const nudge = useCallback((delta: number) => {
    if (phase !== "journey" || overlayOpen) return;
    targetRef.current = Math.min(REELS - 1, Math.max(0, targetRef.current + delta));
    lastInput.current = performance.now();
  }, [phase, overlayOpen]);

  // Opening: pull back out of the core's light.
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

  // HUD loop: timeline, text haze, settle, interactions, labels (fallback mode also drives the timeline here).
  useEffect(() => {
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (mode === "fallback") {
        sRef.current = reducedMotion ? targetRef.current : followTimeline(sRef.current, targetRef.current, dt);
        const f = sRef.current - Math.floor(sRef.current);
        hazeRef.current = reducedMotion ? 0 : Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, (f - 0.18) / 0.64))), 1.4);
        if (skyRef.current) {
          const r = Math.round(sRef.current);
          skyRef.current.style.setProperty("--sky", L.worlds[r][palette].bg);
          skyRef.current.style.setProperty("--glow", L.worlds[r].accent);
        }
      }
      const s = sRef.current;
      if (playheadRef.current) playheadRef.current.style.left = `${((s + 0.5) / REELS) * 100}%`;
      if (tcRef.current) tcRef.current.textContent = timecode(s);
      if (textRef.current) textRef.current.style.opacity = String(Math.max(0, 1 - hazeRef.current * 1.6));
      const r = activeReel(s);
      setReel((prev) => (prev === r ? prev : r));

      // Rest on a reel when the visitor stops travelling.
      const t = targetRef.current, near = Math.round(t);
      if (now - lastInput.current > 450 && Math.abs(near - t) > 0.001) targetRef.current = t + (near - t) * Math.min(1, dt * 5);

      // Interactions for the world in view.
      const play = playRef.current;
      if (isVertical(r)) stepPlay(play, r, dt);
      if (fillRef.current) fillRef.current.style.width = `${completion(play, r) * 100}%`;
      setDone((prev) => {
        const c = isVertical(r) && completion(play, r) >= 0.999;
        if (prev[r] === c) return prev;
        const next = [...prev];
        next[r] = c;
        return next;
      });

      // Labels follow their 3D anchors.
      const an = anchorsRef.current;
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = an.pts[i];
        const o = p ? Math.min(1, Math.max(0, an.presence * 1.8 - i * 0.18)) : 0;
        el.style.opacity = String(o);
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        if (p) el.style.transform = `translate(${p.x}px, ${p.y + (1 - o) * 10}px) translate(${i % 2 ? "0%" : "-100%"}, -50%)`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, palette, reducedMotion]);

  // Keyboard: arrows / PageUp·Down travel, 0–7 jump, Home/End.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOverlay("none"); return; }
      if (overlayOpen || phase !== "journey") return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea")) return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); jump(Math.round(targetRef.current) + 1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); jump(Math.round(targetRef.current) - 1); }
      if (/^[0-7]$/.test(e.key)) jump(Number(e.key));
      if (e.key === "Home") jump(0);
      if (e.key === "End") jump(REELS - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, phase, jump]);

  const textTop =
    reel === CONTACT ? "top-[44%] max-md:top-[42%]" : reel === ECOSYSTEM ? "top-[66%] max-md:top-[58%]" : "top-[60%] max-md:top-[56%]";

  return (
    <div
      data-palette={palette}
      data-type="sans"
      className="lt-root fixed inset-0 touch-none overflow-hidden text-[var(--lt-ink)] select-none"
      style={{ ["--lt-ink" as string]: ink, ["--lt-accent" as string]: accent, background: L.worlds[reel][palette].bg, transition: "background-color 1.2s ease" }}
      onWheel={(e) => nudge(e.deltaY / L.wheelPerReel)}
      onPointerDown={(e) => { touch.current = { x: e.clientX, y: e.clientY, axis: null }; }}
      onPointerMove={(e) => {
        const t = touch.current;
        if (!t || phase !== "journey" || overlayOpen) return;
        const dx = e.clientX - t.x, dy = e.clientY - t.y;
        if (!t.axis && Math.hypot(dx, dy) > 8) t.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (t.axis === "x" && reel === 0) playRef.current.yawTarget += dx * 0.006;
        if (t.axis === "y" && e.pointerType === "touch") nudge(-dy / L.touchPerReel);
        t.x = e.clientX; t.y = e.clientY;
      }}
      onPointerUp={() => { touch.current = null; }}
      onPointerCancel={() => { touch.current = null; }}
    >
      {/* ── The 3D stage (or the CSS fallback for weak devices) ── */}
      {mode === "webgl" && (
        <Stage
          palette={palette} reducedMotion={reducedMotion} mobile={mobile} visible={phase === "opening" || journeyOn}
          targetRef={targetRef} sRef={sRef} openingRef={openingRef} presenceRef={presenceRef}
          playRef={playRef} hazeRef={hazeRef} anchorsRef={anchorsRef} onReady={() => setStageReady(true)}
        />
      )}
      {mode === "fallback" && (
        <div ref={skyRef} aria-hidden="true" className="lt-fallback absolute inset-0" style={{ ["--sky" as string]: L.worlds[0][palette].bg, ["--glow" as string]: L.worlds[0].accent }}>
          <div className="lt-fallback-orb" />
          <div className="lt-fallback-ring" />
        </div>
      )}

      {/* Soft spotlight of the current world's colour behind the focal point. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms]"
        style={{ background: `radial-gradient(60vmax 50vmax at 50% 42%, ${accent}${palette === "a" ? "1c" : "30"} 0%, transparent 62%)`, mixBlendMode: palette === "a" ? "multiply" : "screen" }} />

      {/* ── Loader ── */}
      <AnimatePresence>
        {(phase === "loading" || phase === "ready") && (
          <motion.div key="loader" className="absolute inset-0 z-30 grid place-items-center" style={{ background: L.worlds[0][palette].bg }}
            exit={{ opacity: 0, scale: 1.6, filter: "blur(18px)" }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.4, 0, 0.2, 1] }}>
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 120 120" className="h-56 w-56 max-md:h-44 max-md:w-44" aria-hidden="true">
                <circle cx="60" cy="60" r="46" fill="none" stroke={ink} strokeOpacity="0.1" strokeWidth="0.8" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#C9A45C" strokeWidth="1.4" strokeLinecap="round"
                  pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress} transform="rotate(-90 60 60)" />
                {verticals.map((v, i) => {
                  const a = -Math.PI / 2 + ((i + 1) / 5) * Math.PI * 2;
                  const lit = progress >= (i + 1) / 6;
                  return <circle key={v.slug} cx={60 + Math.cos(a) * 46} cy={60 + Math.sin(a) * 46} r={lit ? 4 : 1.5} fill={L.worlds[i + 1].accent} style={{ transition: "r 0.6s cubic-bezier(0.22,1,0.36,1)" }} />;
                })}
                <circle cx="60" cy="60" r={6 + progress * 6} fill="#F6D9A0" opacity={0.35 + progress * 0.5} />
              </svg>
              <p className="micro mt-6 opacity-60" aria-live="polite">{longTake.loading} · <span className="tabular-nums">{Math.round(progress * 100)}%</span></p>
              <div className="mt-6 h-12">
                {phase === "ready" && (
                  <motion.button type="button" autoFocus onClick={begin} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="micro lt-pill rounded-full px-8 py-3.5">
                    <span aria-hidden="true">▶&nbsp;&nbsp;</span>{longTake.begin}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div inert={overlayOpen} className="absolute inset-0">
        {/* ── Reel text (visual; the same text is in the HTML outline below for assistive tech) ── */}
        {(phase === "opening" || journeyOn) && (
          <div ref={textRef} className="pointer-events-none absolute inset-0 z-10">
            <AnimatePresence mode="wait">
              <motion.div key={phase === "opening" ? "open" : reel}
                initial={{ opacity: 0, filter: "blur(10px)", y: 14 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)", y: -8 }}
                transition={{ duration: reducedMotion ? 0 : 0.7, delay: phase === "opening" ? 2.4 : 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-x-0 flex flex-col items-center px-5 text-center ${phase === "opening" ? "top-[60%] max-md:top-[56%]" : textTop}`}>
                <ReelText reel={phase === "opening" ? 0 : reel} done={done} showList={mode === "fallback"} onFounders={() => setOverlay("founders")} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* The four "what we do" items, attached to the sculpture (desktop). */}
        {journeyOn && isVertical(reel) && !mobile && mode === "webgl" && (
          <ul className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
            {verticals[reel - 1].whatWeDo.map((item, i) => (
              <li key={`${reel}-${item}`}>
                <div ref={(el) => { labelRefs.current[i] = el; }} data-palette={palette} className="lt-annotation absolute top-0 left-0" style={{ opacity: 0 }}>
                  <span className="lt-annotation-dot" />
                  <span className="lt-annotation-num">{pad(i + 1)}</span>
                  <span>{item}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* One playful interaction per world. */}
        {journeyOn && isVertical(reel) && mode === "webgl" && (
          <Interaction world={reel} playRef={playRef} fillRef={fillRef} done={done[reel]} reducedMotion={reducedMotion} key={reel} />
        )}
        {journeyOn && reel === 0 && mode === "webgl" && (
          <p aria-hidden="true" className="micro pointer-events-none absolute inset-x-0 bottom-[calc(var(--lt-inset)+4.4rem)] text-center text-[0.56rem] opacity-50 max-md:bottom-[6.4rem]">
            {mobile ? longTake.swipeHint : longTake.scrollHint} ↓ <span className="mx-2 opacity-40">·</span> {longTake.dragToTurn} ↔
          </p>
        )}

        {/* ── Frame (TURA edge furniture) ── */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <p className="headline absolute top-[var(--lt-inset)] left-[var(--lt-inset)] text-[0.9rem] leading-none tracking-[0.18em]" aria-hidden="true">
            <span className="block">Kreatif</span>
            <span className="block">Atelier</span>
          </p>
          <nav aria-label="Primary" className="pointer-events-auto absolute top-[var(--lt-inset)] right-[var(--lt-inset)] flex gap-[clamp(1.2rem,4vw,4rem)]">
            <button type="button" onClick={() => setOverlay("menu")} className="micro opacity-75 transition-opacity hover:opacity-100" aria-haspopup="dialog">{longTake.jumpLabel}</button>
            <a href={mailtoHref("Free Brand Audit Request")} className="micro opacity-75 transition-opacity hover:opacity-100">{longTake.contact}</a>
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
          {journeyOn && <Timeline reel={reel} palette={palette} onJump={jump} playheadRef={playheadRef} tcRef={tcRef} />}
        </div>
      </div>

      <JumpMenu open={overlay === "menu"} reel={reel} reducedMotion={reducedMotion}
        onClose={() => setOverlay("none")}
        onJump={(k) => { setOverlay("none"); if (phase !== "journey") begin(); jump(k); }} />
      <FoundersPanel open={overlay === "founders"} reducedMotion={reducedMotion} onClose={() => setOverlay("none")} />

      <p className="sr-only" aria-live="polite">{journeyOn ? `${longTake.reel} ${pad(reel)}: ${reelName(reel)}` : ""}</p>

      {/* The whole structure as HTML — server-rendered, for screen readers and search. */}
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
        <h2>{foundersIntro.kicker}</h2>
        <ul>{founders.map((f) => <li key={f.slug}><h3>{f.name}</h3><p>{f.roleFull}</p><p>{f.bio}</p></li>)}</ul>
        <h2>{longTake.contact}</h2><p><a href={mailtoHref("Free Brand Audit Request")}>{site.email}</a> · {site.handle}</p>
      </section>
    </div>
  );
}

/** One reel's text: TURA macro/micro — huge headline, microtype eyebrow and caption. */
function ReelText({ reel, done, showList, onFounders }: { reel: number; done: boolean[]; showList: boolean; onFounders: () => void }) {
  if (reel === 0) {
    return (
      <div aria-hidden="true">
        <p className="micro opacity-60">{holding.motto.join("  |  ")}</p>
        <p className="headline mt-5 text-[clamp(3rem,8.4vw,9rem)]">{holding.name}</p>
        <p className="micro mx-auto mt-6 max-w-[34rem] leading-[2] opacity-70">{holding.lines.ecosystem}</p>
        <p className="micro mt-4 text-[0.56rem] opacity-45 max-md:hidden">{holding.pillars.join("  ·  ")}</p>
      </div>
    );
  }
  if (reel === ECOSYSTEM) {
    return (
      <div aria-hidden="true" className="max-w-5xl">
        <p className="micro text-[0.58rem] leading-[2.1] opacity-65">
          <span className="opacity-60">{holding.labels.serves} — </span>{serves.join("  ·  ")}
        </p>
        <p className="headline mt-4 text-[clamp(1.7rem,3.3vw,3.7rem)]">{holding.lines.verticals}</p>
        <p className="micro mt-4 text-[0.58rem] leading-[2.1] opacity-65">
          <span className="opacity-60">{holding.labels.impact} — </span>{impact.join("  ·  ")}
        </p>
      </div>
    );
  }
  if (reel === CONTACT) {
    return (
      <div className="max-w-4xl">
        <p aria-hidden="true" className="micro opacity-60">{holding.labels.vision}</p>
        <p aria-hidden="true" className="headline mt-4 text-[clamp(2rem,5vw,5.4rem)]">{holding.lines.tomorrow}</p>
        <p aria-hidden="true" className="lt-statement mx-auto mt-5 max-w-[40rem] text-[clamp(1rem,1.5vw,1.3rem)] leading-snug opacity-80">{holding.vision}</p>
        <div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href={mailtoHref("Free Brand Audit Request")} className="micro lt-pill rounded-full px-7 py-3.5 max-md:px-5 max-md:py-2.5">{site.email}</a>
          <button type="button" onClick={onFounders} className="micro lt-pill rounded-full px-7 py-3.5 max-md:px-5 max-md:py-2.5" aria-haspopup="dialog">{longTake.founders}</button>
        </div>
        <p aria-hidden="true" className="micro mt-5 text-[0.56rem] opacity-45">{site.handle}</p>
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
      <p className={`headline mt-4 ${long ? "text-[clamp(2.1rem,5.4vw,6rem)]" : "text-[clamp(3rem,8.6vw,9.4rem)]"}`}>{v.name}</p>
      <p className="micro mx-auto mt-5 max-w-[30rem] leading-[2] transition-[color,opacity] duration-700"
        style={{ color: done[reel] ? "var(--lt-accent)" : undefined, opacity: done[reel] ? 1 : 0.7 }}>
        {v.value}
      </p>
      <ul className={`mx-auto mt-5 max-w-[24rem] grid-cols-2 gap-x-4 gap-y-1.5 text-left text-[0.74rem] leading-snug max-md:grid max-md:max-w-[20rem] max-md:text-[0.72rem] ${showList ? "grid" : "hidden"}`}>
        {v.whatWeDo.map((w, i) => <li key={w}><span className="opacity-40">{pad(i + 1)} </span>{w}</li>)}
      </ul>
    </div>
  );
}

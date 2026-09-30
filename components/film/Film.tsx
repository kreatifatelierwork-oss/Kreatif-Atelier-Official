"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { titleCard } from "@/content/film";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { filmConfig as F } from "@/lib/config";
import { Gate } from "./Gate";
import { Hud, type HudHandle } from "./Hud";
import { InkEngine, type InkSettings, type Stroke } from "./ink/engine";
import { Score } from "./sound/score";
import { createFilmState, notePointer } from "./state";
import { prewarmForms } from "./stage/forms";

const FilmStage = dynamic(() => import(/* webpackPrefetch: true */ "./stage/FilmStage"), { ssr: false });

type Phase = "gate" | "dip" | "flood" | "live";
type Palette = "a" | "b";

const MOBILE = "(max-width: 767px)";
const subscribeMobile = (cb: () => void) => {
  const m = window.matchMedia(MOBILE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const noop = () => () => {};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const istClock = typeof Intl !== "undefined"
  ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  : null;

function inkSettings(mobile: boolean, calm: boolean): InkSettings {
  const I = F.ink;
  return {
    simRes: mobile ? I.simRes.mobile : I.simRes.desktop,
    dyeRes: mobile ? I.dyeRes.mobile : I.dyeRes.desktop,
    iterations: mobile ? I.iterations.mobile : I.iterations.desktop,
    velocityKeep: I.velocityKeep,
    dyeKeep: I.dyeKeep,
    radius: calm ? I.calm.radius : I.radius,
    force: calm ? I.calm.force : I.force,
    amount: calm ? I.calm.amount : I.amount,
    edge: I.edge,
    rim: calm ? 0 : I.rim,
    strength: calm ? I.calm.strength : 1,
  };
}

/**
 * "The Making of a Legacy" — checkpoint build: the opening sequence and the base cursor behaviour.
 * Opening (after buttermax.net's measured rhythm, with our own glyph, colours, words and sound):
 *   ✦ builds from liquid dots → the gate (sound choice) → dark dip → halftone flood into the page while the page
 *   zooms forward and straightens → the Idea rises and materialises → "Atelier" is written on → settle.
 * Then the cursor paints ink (a GPU fluid) that inverts whatever it covers, and the Idea looks at it with weight.
 */
export function Film() {
  const reduced = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE).matches, () => false);
  const palette = useSyncExternalStore(noop, () => (new URLSearchParams(window.location.search).get("palette") === "b" ? "b" : "a"), () => "a") as Palette;
  const pal = F.palettes[palette];

  const [state] = useState(createFilmState);
  const stateRef = useRef(state);
  const [phase, setPhase] = useState<Phase>("gate");
  const [sound, setSound] = useState<boolean | null>(null);
  const [stageOn, setStageOn] = useState(false);
  const [hudOn, setHudOn] = useState(false);
  const [inkReady, setInkReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hudRef = useRef<HudHandle>(null);
  const engineRef = useRef<InkEngine | null>(null);
  const scoreRef = useRef<Score | null>(null);
  const t0Ref = useRef<number | null>(null);
  const riseAtRef = useRef<number | null>(null);
  const stageReadyRef = useRef(false);
  const flags = useRef({ live: false, written: false, hud: false });
  /** When the dip may end (performance.now); the flood waits for this AND the stage's first frames. */
  const dipEndRef = useRef<number | null>(null);
  const hoverRef = useRef({ leftAt: -1e9, swappedAt: -1e9 });

  const onStageReady = useCallback(() => { stageReadyRef.current = true; }, []);
  const onSwap = useCallback((step: number) => scoreRef.current?.chime(step), []);

  // Pointer input (mouse, pen and touch) → shared state.
  useEffect(() => {
    const move = (e: PointerEvent) => notePointer(state, e.clientX, e.clientY, performance.now(), e.pointerType === "touch");
    const down = (e: PointerEvent) => {
      notePointer(state, e.clientX, e.clientY, performance.now(), e.pointerType === "touch", e.pointerType === "touch");
      // A tap paints a small blob where the finger lands.
      if (e.pointerType === "touch") { state.pointer.px = e.clientX - 1; state.pointer.dirty = true; }
      const i = state.idea;
      const inside = i.visible && Math.hypot(e.clientX - i.cx, e.clientY - i.cy) < i.r * 0.78;
      if (!inside) return;
      if (e.pointerType === "touch") state.requests.swap++;
      else state.requests.pulse++;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", down); };
  }, [state]);

  // Build the Idea's point clouds while the visitor reads the gate (idle time), so the stage starts instantly.
  useEffect(() => {
    const count = mobile ? F.idea.count.mobile : F.idea.count.desktop;
    const run = () => { prewarmForms(count); };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 1200);
    return () => clearTimeout(id);
  }, [mobile]);

  // Keep the ink canvas sized to the viewport.
  useEffect(() => {
    const resize = () => engineRef.current?.resize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 1.5));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Fade the score when the tab is hidden.
  useEffect(() => {
    const vis = () => scoreRef.current?.setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  const choose = (withSound: boolean) => {
    if (phase !== "gate") return;
    setSound(withSound);
    if (withSound) {
      try { scoreRef.current = new Score(reduced); scoreRef.current.start(); } catch { scoreRef.current = null; }
    }
    const canvas = canvasRef.current;
    if (canvas && !reduced) {
      const eng = InkEngine.create(canvas, inkSettings(mobile, reduced), F.houses);
      if (eng) {
        eng.resize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 1.5));
        eng.flood(0, pal.dark, false, F.opening.dotSpacing, F.opening.rimWidth, 0);
        engineRef.current = eng;
        setInkReady(true);
      }
    } else if (canvas && reduced) {
      // Calm ink only (no flood).
      const eng = InkEngine.create(canvas, inkSettings(mobile, true), F.houses);
      if (eng) { eng.resize(window.innerWidth, window.innerHeight, 1); eng.clear(); engineRef.current = eng; }
    }
    setStageOn(true);
    setPhase("dip");
    dipEndRef.current = performance.now() + (reduced ? 200 : F.opening.dipMs + F.opening.dipHoldMs);
    headingRef.current?.focus({ preventScroll: true });
  };

  const toggleSound = () => {
    if (!scoreRef.current) {
      try { scoreRef.current = new Score(reduced); scoreRef.current.start(); setSound(true); } catch { /* no audio */ }
      return;
    }
    const next = !sound;
    scoreRef.current.setMuted(!next);
    setSound(next);
  };

  // The one loop: opening choreography, ink, hover, sound and readouts.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let hudAt = 0;
    const strokes: Stroke[] = [];
    const O = F.opening;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const eng = engineRef.current;
      const t0 = t0Ref.current;
      const fl = flags.current;
      const w = window.innerWidth, h = window.innerHeight;

      // The dip ends once its beat has passed and the stage has drawn (like a loader waiting for assets); capped.
      const dipEnd = dipEndRef.current;
      if (t0 == null && dipEnd != null && now >= dipEnd && (stageReadyRef.current || now > dipEnd + 3500)) {
        t0Ref.current = now;
        dipEndRef.current = null;
        setPhase("flood");
        scoreRef.current?.flood();
      }
      if (t0 != null) {
        const e = now - t0;
        // Flood + page zoom.
        if (!fl.live) {
          const k = reduced ? 1 : Math.min(1, e / O.floodMs);
          if (eng && !reduced) eng.flood(k, pal.dark, !mobile, O.dotSpacing, O.rimWidth, dt, palette === "b" ? 0.85 : 0, pal.goldBright);
          const z = easeOutCubic(Math.min(1, e / O.zoomMs));
          const page = pageRef.current;
          if (page && !reduced) page.style.transform = z < 1 ? `scale(${O.pageFromScale + (1 - O.pageFromScale) * z}) rotate(${O.pageFromRotateDeg * (1 - z)}deg)` : "";
          if (k >= 1) {
            fl.live = true;
            if (page) page.style.transform = "";
            if (eng) { eng.clear(); canvasRef.current?.classList.add("is-ink"); }
            setPhase("live");
          }
        }
        // The Idea rises once the stage is ready (never before its beat).
        if (riseAtRef.current == null && stageReadyRef.current && e >= (reduced ? 0 : O.ideaRiseAt)) {
          riseAtRef.current = reduced ? now - O.ideaRiseMs : now;
        }
        // The signature writes on after the rise has begun.
        const rise = riseAtRef.current;
        if (!fl.written && rise != null && now >= Math.max(t0 + (reduced ? 0 : O.writeAt), rise + (reduced ? 0 : 350))) {
          fl.written = true;
          const el = signRef.current;
          if (el) {
            if (reduced) el.style.clipPath = "none";
            else el.animate(
              [{ clipPath: "inset(-10% 100% -20% 0)", filter: "blur(3px)" }, { clipPath: "inset(-10% -8% -20% 0)", filter: "blur(0px)" }],
              { duration: O.writeMs, easing: "cubic-bezier(0.3, 0.1, 0.45, 1)", fill: "forwards" },
            );
          }
          scoreRef.current?.write(O.writeMs);
        }
        if (!fl.hud && e >= (reduced ? 400 : O.hudAt)) { fl.hud = true; setHudOn(true); }
      }

      // Ink (after the flood) — capsule strokes from the pointer's last to current position.
      const p = state.pointer;
      if (fl.live && eng) {
        if (p.dirty && p.active) {
          strokes.push({ ax: p.px, ay: p.py, bx: p.x, by: p.y, vx: p.vx, vy: p.vy });
          p.px = p.x; p.py = p.y; p.dirty = false;
        }
        if (strokes.length || eng.busy) {
          const i = state.idea;
          eng.step(dt, strokes, pal.page, i.visible ? i : null);
          strokes.length = 0;
          if (!eng.busy) eng.clear();
        }
      } else if (p.dirty) {
        p.px = p.x; p.py = p.y; p.dirty = false;
      }

      // Hover onto the Idea (mouse only) changes its form.
      const i = state.idea;
      const inside = fl.live && p.active && !p.touch && i.visible && Math.hypot(p.x - i.cx, p.y - i.cy) < i.r * 0.78;
      const hv = hoverRef.current;
      if (!inside && i.hovered) hv.leftAt = now;
      if (inside && !i.hovered && now - hv.leftAt > F.idea.swapReentryMs && now - hv.swappedAt > F.idea.swapCooldownMs) {
        state.requests.swap++;
        hv.swappedAt = now;
      }
      i.hovered = inside;

      // Sound follows the cursor; speed eases off when the pointer rests.
      const speed = p.speed * Math.exp(-(now - p.lastMove) / 120);
      scoreRef.current?.update(p.x / w, p.y / h, speed);

      // Readouts (10 per second).
      if (fl.hud && now - hudAt > 100 && hudRef.current) {
        hudAt = now;
        const e = t0 != null ? (now - t0) / 1000 : 0;
        const frames = Math.floor(e * 24);
        const tc = `00:${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.floor(e) % 60).padStart(2, "0")}:${String(frames % 24).padStart(2, "0")}`;
        let levels = [0, 0, 0, 0, 0];
        const an = scoreRef.current?.analyser;
        if (an && sound) {
          const d = new Uint8Array(an.frequencyBinCount);
          an.getByteFrequencyData(d);
          levels = [1, 3, 6, 10, 16].map((b) => d[b] / 255);
        }
        hudRef.current.set({
          tc, act: 0, form: state.stats.form, x: p.x, y: p.y, v: speed, fps: state.stats.fps,
          particles: state.stats.particles, clock: istClock ? istClock.format(new Date()) : "", levels,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state, pal.dark, pal.page, pal.goldBright, palette, mobile, reduced, sound]);

  useEffect(() => () => { engineRef.current?.dispose(); scoreRef.current?.dispose(); }, []);

  const style = {
    ["--film-page" as string]: pal.page,
    ["--film-text" as string]: pal.text,
    ["--film-muted" as string]: pal.muted,
    ["--film-gold" as string]: pal.gold,
    ["--film-dark" as string]: pal.dark,
  };

  return (
    <div className={`film-root palette-${palette}`} style={style}>
      <noscript>
        <style>{`.film-gate{display:none}.film-signature{clip-path:none!important}`}</style>
      </noscript>
      <div ref={pageRef} className="film-page">
        {stageOn && (
          <FilmStage stateRef={stateRef} palette={palette} mobile={mobile} calm={reduced} riseAtRef={riseAtRef} onReady={onStageReady} onSwap={onSwap} />
        )}
        <section className="film-title" aria-labelledby="film-h1">
          <h1 id="film-h1" ref={headingRef} tabIndex={-1} className="film-h1">
            <span className="film-lead">{titleCard.lead}</span>{" "}
            <span ref={signRef} className="film-signature">{titleCard.signature}</span>
          </h1>
          <p className="film-lines">
            <span>{titleCard.lineA}</span> <span>{titleCard.lineB}</span>
          </p>
          <p className="film-values">{titleCard.values.join(" · ")}</p>
        </section>
      </div>
      <Hud ref={hudRef} visible={hudOn} sound={sound} onToggleSound={toggleSound} />
      <canvas ref={canvasRef} className="film-ink" aria-hidden="true" />
      {phase !== "live" && (
        <Gate mode={phase === "gate" ? "gate" : phase === "dip" ? "leaving" : inkReady ? "clear" : "fading"} onChoose={choose} />
      )}
    </div>
  );
}

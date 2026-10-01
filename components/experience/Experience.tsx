"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Gate } from "@/components/film/Gate";
import { Brush } from "@/components/film/ink/brush";
import { InkEngine, type InkSettings } from "@/components/film/ink/engine";
import { loopStats, onFrame } from "@/components/film/loop";
import { Score } from "@/components/film/sound/score";
import { createFilmState, notePointer } from "@/components/film/state";
import { prewarmForms } from "@/components/film/stage/forms";
import { xp } from "@/content/experience";
import { film } from "@/content/film";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { filmConfig as F } from "@/lib/config";
import { ActBar, type ActBarHandle } from "./ActBar";
import { Captions } from "./Captions";
import { IndexPlan } from "./IndexPlan";
import { advance, createRuntime, jumpTo, useUi } from "./journey";
import { RoomPanel } from "./RoomPanel";
import { filmTimeAt, hashFor, parseHash, route } from "./route";
import { useInput } from "./useInput";

const Stage = dynamic(() => import(/* webpackPrefetch: true */ "./stage/Stage"), { ssr: false });

const MOBILE = "(max-width: 767px)";
const subscribeMobile = (cb: () => void) => {
  const m = window.matchMedia(MOBILE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const noop = () => () => {};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inkRatio = () => Math.min(window.devicePixelRatio || 1, 1.5);

function inkSettings(mobile: boolean, calm: boolean): InkSettings {
  const I = F.ink;
  return {
    simRes: mobile ? I.simRes.mobile : I.simRes.desktop, dyeScale: I.dyeScale, dyeMax: mobile ? I.dyeMax.mobile : I.dyeMax.desktop,
    iterations: mobile ? I.iterations.mobile : I.iterations.desktop, step: I.step, velocityKeep: I.velocityKeep, dyeKeep: I.dyeKeep,
    pressureKeep: I.pressureKeep, radiusH: I.radiusH * (calm ? I.calm.radius : 1), radiusW: I.radiusW * (calm ? I.calm.radius : 1),
    lag: I.lag, velocityRadius: I.velocityRadius, maxSpeed: I.maxSpeed, inkSpeed: I.inkSpeed, force: calm ? I.calm.force : I.force,
    amount: I.amount, maxInk: I.maxInk, edge: I.edge, rimPx: calm ? 0 : I.rimPx, strength: calm ? I.calm.strength : 1,
  };
}

/**
 * /experience: "The Making of a Legacy: Shot on Location". The opening (the buttermax rhythm, built at /film) floods
 * into the Atrium; from there one camera travels the route. Scroll, swipe, keys, the act bar, the Index and Watch all
 * move the same position; things in a place can be Entered and left again; every place and room has its own link.
 */
export function Experience() {
  const reduced = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE).matches, () => false);
  const theme = useSyncExternalStore(noop, () => {
    const q = new URLSearchParams(window.location.search);
    return q.get("theme") === "dark" || q.get("palette") === "b" ? "dark" : "light";
  }, () => "light") as "light" | "dark";
  const pal = F.palettes[theme === "dark" ? "b" : "a"];

  const ui = useUi();
  const rtRef = useRef(createRuntime());
  const filmRef = useRef(createFilmState());
  const [brush] = useState(() => new Brush(F.ink.tau));
  const [sound, setSound] = useState<boolean | null>(null);
  const [stageOn, setStageOn] = useState(false);
  const [inkReady, setInkReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const actRef = useRef<ActBarHandle>(null);
  const indexBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const engineRef = useRef<InkEngine | null>(null);
  const scoreRef = useRef<Score | null>(null);
  const riseAtRef = useRef<number | null>(null);
  const t0Ref = useRef<number | null>(null);
  const dipEndRef = useRef<number | null>(null);
  const stageReadyRef = useRef(false);
  const flags = useRef({ live: false, written: false });

  const onStageReady = useCallback(() => { stageReadyRef.current = true; }, []);

  // Deep link: start at the linked place (and room) once the film is live.
  const pending = useRef<{ place: number; thing?: string } | null>(null);
  useEffect(() => { pending.current = parseHash(window.location.hash); }, []);

  // ---- Navigation actions -------------------------------------------------------------------------------------------
  const go = useCallback((place: number, thing?: string, push = true) => {
    const rt = rtRef.current;
    rt.mode = "direct";
    rt.room = null;
    jumpTo(rt, place, performance.now(), reduced);
    useUi.getState().set({ mode: "direct", room: null, indexOpen: false, hover: null });
    if (push) history.pushState(null, "", hashFor(place, thing));
    if (thing) {
      // Open the room once we've arrived.
      const open = () => {
        if (rtRef.current.move) { requestAnimationFrame(open); return; }
        rtRef.current.room = thing;
        useUi.getState().set({ room: thing });
      };
      requestAnimationFrame(open);
    }
  }, [reduced]);

  const enter = useCallback((thing: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    rtRef.current.room = thing;
    useUi.getState().set({ room: thing, hover: thing });
    history.pushState(null, "", hashFor(useUi.getState().place, thing));
  }, []);

  const leave = useCallback(() => {
    rtRef.current.room = null;
    useUi.getState().set({ room: null });
    history.replaceState(null, "", hashFor(useUi.getState().place));
    returnFocus.current?.focus?.();
  }, []);

  const openIndex = () => { returnFocus.current = indexBtn.current; useUi.getState().set({ indexOpen: true }); };
  const closeIndex = () => { useUi.getState().set({ indexOpen: false }); indexBtn.current?.focus(); };
  const watch = () => { rtRef.current.mode = "watch"; useUi.getState().set({ mode: "watch" }); };
  const direct = () => { rtRef.current.mode = "direct"; useUi.getState().set({ mode: "direct" }); };

  // Browser Back / Forward: travel to the place (and room) in the link.
  useEffect(() => {
    const pop = () => {
      const h = parseHash(window.location.hash);
      if (h) go(h.place, h.thing, false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [go]);

  useInput(rtRef, reduced);

  // ---- Pointer → ink brush, the Idea, parallax ------------------------------------------------------------------------
  useEffect(() => {
    const state = filmRef.current;
    const move = (e: PointerEvent) => {
      const list = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : null;
      if (list && list.length) for (const c of list) brush.push(c.clientX, c.clientY, c.timeStamp);
      else brush.push(e.clientX, e.clientY, e.timeStamp);
      notePointer(state, e.clientX, e.clientY, performance.now(), e.pointerType === "touch");
      rtRef.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      rtRef.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const down = (e: PointerEvent) => {
      const touch = e.pointerType === "touch";
      if (touch) brush.push(e.clientX, e.clientY, e.timeStamp, true);
      notePointer(state, e.clientX, e.clientY, performance.now(), touch, touch);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", down); };
  }, [brush]);

  // Build the Idea's forms while the visitor reads the gate.
  useEffect(() => {
    const count = mobile ? F.idea.count.mobile : F.idea.count.desktop;
    const id = setTimeout(() => prewarmForms(count), 1200);
    return () => clearTimeout(id);
  }, [mobile]);

  useEffect(() => {
    const resize = () => engineRef.current?.resize(window.innerWidth, window.innerHeight, inkRatio());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("tune")) Object.assign(window, { __filmLoop: loopStats, __xp: rtRef.current });
  }, []);

  useEffect(() => () => { engineRef.current?.dispose(); scoreRef.current?.dispose(); }, []);

  // ---- The gate ------------------------------------------------------------------------------------------------------
  const choose = (withSound: boolean) => {
    if (useUi.getState().phase !== "gate") return;
    setSound(withSound);
    if (withSound) { try { scoreRef.current = new Score(reduced); scoreRef.current.start(); } catch { scoreRef.current = null; } }
    const canvas = canvasRef.current;
    if (canvas) {
      const eng = InkEngine.create(canvas, inkSettings(mobile, reduced), pal.gold, pal.goldBright);
      if (eng) {
        eng.resize(window.innerWidth, window.innerHeight, reduced ? 1 : inkRatio());
        if (reduced) eng.clear(); else eng.flood(0, pal.dark, false, F.opening.dotSpacing, F.opening.rimWidth, 0);
        engineRef.current = eng;
        if (new URLSearchParams(window.location.search).has("tune")) Object.assign(window, { __filmInk: eng, __filmBrush: brush });
        setInkReady(!reduced);
      }
    }
    setStageOn(true);
    useUi.getState().set({ phase: "dip" });
    dipEndRef.current = performance.now() + (reduced ? 200 : F.opening.dipMs + F.opening.dipHoldMs);
    h1Ref.current?.focus({ preventScroll: true });
  };

  const toggleSound = () => {
    if (!scoreRef.current) {
      try { scoreRef.current = new Score(reduced); scoreRef.current.start(); setSound(true); } catch { /* no audio */ }
      return;
    }
    scoreRef.current.setMuted(!!sound);
    setSound(!sound);
  };

  // ---- The frame (shared loop, after the stage) ----------------------------------------------------------------------
  useEffect(() => {
    let shownSecond = -1;
    let lastPlace = -1;
    const O = F.opening;
    return onFrame((now, dt) => {
      const rt = rtRef.current;
      const eng = engineRef.current;
      const fl = flags.current;
      const u = useUi.getState();

      // Opening: the dip ends once its beat has passed and the stage has drawn; then the flood, the rise, the word.
      const dipEnd = dipEndRef.current;
      if (t0Ref.current == null && dipEnd != null && now >= dipEnd && (stageReadyRef.current || now > dipEnd + 3500)) {
        t0Ref.current = now;
        dipEndRef.current = null;
        u.set({ phase: "flood" });
        scoreRef.current?.flood();
      }
      const t0 = t0Ref.current;
      if (t0 != null && !fl.live) {
        const e = now - t0;
        const k = reduced ? 1 : Math.min(1, e / O.floodMs);
        if (eng && !reduced) eng.flood(k, pal.dark, !mobile, O.dotSpacing, O.rimWidth, dt, theme === "dark" ? 0.85 : 0, pal.goldBright);
        const z = easeOutCubic(Math.min(1, e / O.zoomMs));
        const w = worldRef.current;
        if (w && !reduced) w.style.transform = z < 1 ? `scale(${O.pageFromScale + (1 - O.pageFromScale) * z}) rotate(${O.pageFromRotateDeg * (1 - z)}deg)` : "";
        if (k >= 1) {
          fl.live = true;
          if (w) { w.style.transform = ""; w.style.willChange = "auto"; }
          if (eng) { eng.clear(); canvasRef.current?.classList.add("is-ink"); }
          u.set({ phase: "live" });
          const p = pending.current;
          pending.current = null;
          if (p && (p.place > 0 || p.thing)) go(p.place, p.thing, false);
        }
      }
      if (t0 != null && riseAtRef.current == null && stageReadyRef.current && now - t0 >= (reduced ? 0 : O.ideaRiseAt)) {
        riseAtRef.current = reduced ? now - O.ideaRiseMs : now;
      }
      const rise = riseAtRef.current;
      if (!fl.written && rise != null && t0 != null && now >= Math.max(t0 + (reduced ? 0 : O.writeAt), rise + (reduced ? 0 : 350))) {
        fl.written = true;
        const el = rootRef.current?.querySelector<HTMLElement>(".is-atrium .xp-signature");
        if (el) {
          if (reduced) el.style.clipPath = "none";
          else el.animate(
            [{ clipPath: "inset(-10% 100% -20% 0)", filter: "blur(3px)" }, { clipPath: "inset(-10% -8% -20% 0)", filter: "blur(0px)" }],
            { duration: O.writeMs, easing: "cubic-bezier(0.3, 0.1, 0.45, 1)", fill: "forwards" },
          );
        }
        scoreRef.current?.write(O.writeMs);
      }
      if (!fl.live) return;

      // Travel.
      advance(rt, now, dt, reduced, u.indexOpen || !!u.room);
      rt.dolly += ((rt.room ? 1 : 0) - rt.dolly) * Math.min(1, dt / 0.35);
      if (reduced) rt.dolly = rt.room ? 1 : 0;
      const place = Math.round(rt.s);
      if (place !== lastPlace) {
        lastPlace = place;
        u.set({ place });
        if (!rt.move && !rt.room) history.replaceState(null, "", hashFor(place));
      }
      if (u.mode !== rt.mode) u.set({ mode: rt.mode });
      const off = Math.abs(rt.s - place);
      rootRef.current?.style.setProperty("--xp-dissolve", reduced ? "0" : Math.min(1, off / 0.32).toFixed(3));

      // The ink (on its own fixed timestep) and the score.
      if (eng) eng.update(now, brush, pal.page);
      const p = filmRef.current.pointer;
      scoreRef.current?.update(p.x / window.innerWidth, p.y / window.innerHeight, p.speed * Math.exp(-(now - p.lastMove) / 120));

      // The act bar's film time.
      const sec = Math.floor(filmTimeAt(rt.s, rt.holdElapsed));
      if (sec !== shownSecond) { shownSecond = sec; actRef.current?.setTime(sec); }
    }, 1);
  }, [brush, go, mobile, pal.dark, pal.goldBright, pal.page, reduced, theme]);

  const room = ui.room ? route[ui.place].things.find((t) => t.id === ui.room)?.room : undefined;
  const live = ui.phase === "live";

  return (
    <div ref={rootRef} className={`xp-root theme-${theme}${live ? " is-live" : ""}`} style={{ ["--xp-gold" as string]: pal.gold }}>
      <noscript><style>{`.xp-gate{display:none}.xp-signature{clip-path:none!important}`}</style></noscript>
      <div ref={worldRef} className="xp-world">
        {stageOn && (
          <Stage rtRef={rtRef} filmRef={filmRef} theme={theme} mobile={mobile} calm={reduced} riseAtRef={riseAtRef} onReady={onStageReady} onEnter={enter} />
        )}
        <Captions ref={h1Ref} onEnter={enter} onWatch={watch} onDirect={direct} />
      </div>

      <header className="xp-topbar">
        <button type="button" className="xp-wordmark" onClick={() => go(0)}>{site.name}</button>
        <div className="xp-topbar-right">
          {sound !== null && (
            <button type="button" className="xp-link" aria-pressed={sound} onClick={toggleSound}>{sound ? film.sound.on : film.sound.off}</button>
          )}
          <button ref={indexBtn} type="button" className="xp-link" aria-expanded={ui.indexOpen} onClick={openIndex}>{xp.index}</button>
        </div>
      </header>
      <ActBar ref={actRef} onJump={(p) => go(p)} onToggleMode={() => (rtRef.current.mode === "watch" ? direct() : watch())} />

      <canvas ref={canvasRef} className="xp-ink" aria-hidden="true" />

      {room && <RoomPanel room={room} onBack={leave} />}
      {ui.indexOpen && <IndexPlan onJump={(p, t) => go(p, t)} onClose={closeIndex} />}
      {ui.phase !== "live" && (
        <Gate mode={ui.phase === "gate" ? "gate" : ui.phase === "dip" ? "leaving" : inkReady ? "clear" : "fading"} onChoose={choose} />
      )}
    </div>
  );
}

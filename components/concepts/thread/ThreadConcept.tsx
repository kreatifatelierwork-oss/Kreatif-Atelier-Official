"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ServiceOverlay } from "@/components/sections/ServiceOverlay";
import { Star } from "@/components/ui/Star";
import { about } from "@/content/about";
import { brand, frame, thread } from "@/content/concepts";
import { services, servicesIntro } from "@/content/services";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { conceptConfig } from "@/lib/config";
import { FanCarousel } from "../frame/FanCarousel";
import { Frame } from "../frame/Frame";
import { Headline } from "../frame/Headline";
import { Spotlight } from "../frame/Spotlight";
import { StoneScene } from "./StoneScene";

type Phase = "loading" | "hold" | "drawing";
type Pt = { x: number; y: number; px: number; py: number };

const C = conceptConfig.thread;
const TRAIL_SCALE = 0.5; // the inlay canvas is half the viewport resolution
// The loader's thread: meanders in from the left and ends at the centre spark (viewBox 1440×900, slice).
const LOADER_PATH = "M -40 610 C 160 560, 260 700, 470 620 S 640 360, 800 470 S 760 520, 720 450";

/** A line glyph per service, "inlaid" in gold on a stone card (placeholders for the full build's medallions). */
const GLYPHS = [
  "M32 8a24 24 0 1 0 0 48a24 24 0 1 0 0-48M32 14l4 14 14 4-14 4-4 14-4-14-14-4 14-4z",
  "M22 32a10 10 0 1 0 20 0a10 10 0 1 0-20 0M10 32a10 10 0 1 0 20 0a10 10 0 1 0-20 0M34 32a10 10 0 1 0 20 0a10 10 0 1 0-20 0",
  "M10 50L24 36l9 9 21-25M44 20h10v10",
  "M32 8a24 24 0 1 0 0 48a24 24 0 1 0 0-48M32 8l10 20M56 32l-20 8M40 54l-12-18M12 42l18-8M18 14l12 18",
  "M26 38a4 4 0 1 0 0.1 0M34 30a12 12 0 0 1 0 16M40 24a20 20 0 0 1 0 28M46 18a28 28 0 0 1 0 40",
  "M32 6v14M32 44v14M6 32h14M44 32h14M14 14l10 10M40 40l10 10M50 14L40 24M24 40L14 50M32 26l3 6-3 6-3-6z",
];

function PillarCard({ index }: { index: number }) {
  const s = services[index];
  return (
    <div className="relative h-full w-full bg-[#101116] bg-[radial-gradient(90%_80%_at_40%_25%,#2a2d36_0%,#121318_55%,#08090c_100%)]">
      <div aria-hidden="true" className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
      <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute top-1/2 left-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-[56%] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.12))_drop-shadow(0_0_10px_rgba(232,201,138,0.35))]">
        <defs>
          <linearGradient id={`g${index}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE9B8" /><stop offset="0.55" stopColor="#C9A45C" /><stop offset="1" stopColor="#8C6A3F" /></linearGradient>
        </defs>
        <path d={GLYPHS[index]} fill="none" stroke={`url(#g${index})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="micro absolute top-4 left-5 text-[0.55rem] text-gold">{s.cardTags[0]}</p>
      <p className="headline absolute top-3.5 right-5 text-[0.9rem] text-cream-faint">.{s.number}</p>
    </div>
  );
}

/**
 * Concept 3 — The Golden Thread. One continuous gold thread runs through the whole site; the visitor
 * draws it across black stone, and everything they draw stays inlaid. At the end, their inlay is theirs.
 */
export default function ThreadConcept() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, C.loaderMinMs, reducedMotion);
  const [phase, setPhase] = useState<Phase>("loading");
  const [charge, setCharge] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [screen, setScreen] = useState(0);
  const [pillar, setPillar] = useState(0);
  const [openService, setOpenService] = useState<string | null>(null);

  const lightRef = useRef({ x: 0.28, y: 0.42 });
  const revealRef = useRef(0);
  const liveRef = useRef<HTMLCanvasElement>(null);
  const thumbRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointer = useRef({ x: 0, y: 0, seen: false });
  const rope = useRef<Pt[]>([]);
  const chapterTarget = useRef(0);
  const holding = useRef(false);
  const touchY = useRef<number | null>(null);
  /** Text that the thread must not engrave over (it glides across, but leaves no inlay there). */
  const keepClear = useRef<HTMLDivElement>(null);

  // The visitor's inlay: white strokes on black, sampled by the stone shader as a groove + gold fill.
  const trailCanvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = Math.round(window.innerWidth * TRAIL_SCALE);
    c.height = Math.round(window.innerHeight * TRAIL_SCALE);
    const g = c.getContext("2d")!;
    g.fillStyle = "#000";
    g.fillRect(0, 0, c.width, c.height);
    return c;
  }, []);
  const trailTexture = useMemo(() => new THREE.CanvasTexture(trailCanvas), [trailCanvas]);

  if (phase === "loading" && progress >= 1) setPhase("hold");
  useEffect(() => {
    revealRef.current = Math.min(1, progress * 1.2);
  }, [progress]);

  const inlaySegment = useCallback((ax: number, ay: number, bx: number, by: number, width = 3.2) => {
    const g = trailCanvas.getContext("2d")!;
    g.strokeStyle = "#fff";
    g.lineWidth = width;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(ax * TRAIL_SCALE, ay * TRAIL_SCALE);
    g.lineTo(bx * TRAIL_SCALE, by * TRAIL_SCALE);
    g.stroke();
  }, [trailCanvas]);

  /** Pick up the thread: the loader's line is pressed into the stone, and the rope starts at the spark. */
  const pickUp = useCallback(() => {
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      const ctm = path.getScreenCTM();
      let prev: DOMPoint | null = null;
      for (let d = 0; d <= len; d += 6) {
        const p = path.getPointAtLength(d).matrixTransform(ctm ?? undefined);
        if (prev) inlaySegment(prev.x, prev.y, p.x, p.y, 3.6);
        prev = p;
      }
    }
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    rope.current = Array.from({ length: C.segments }, () => ({ x: cx, y: cy, px: cx, py: cy }));
    pointer.current = { x: cx, y: cy, seen: false };
    setPhase("drawing");
  }, [inlaySegment]);

  // Hold-to-start: charge fills while held; released early it drains.
  useEffect(() => {
    if (phase !== "hold") return;
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = now - last; last = now;
      setCharge((c) => {
        const next = holding.current ? c + dt / C.holdMs : Math.max(0, c - dt / 500);
        if (next >= 1) { queueMicrotask(pickUp); return 1; }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, pickUp]);

  // Drawing: rope physics, live thread render, inlay, light, chapter progress.
  useEffect(() => {
    if (phase !== "drawing") return;
    const canvas = liveRef.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fit = () => { canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; };
    fit();
    window.addEventListener("resize", fit);
    const g = canvas.getContext("2d")!;
    let frame = 0, n = 0;
    const seg = C.segmentLength * 180;

    const tick = () => {
      const pts = rope.current;
      const head = pts[0];
      const target = pointer.current;
      const prevX = head.x, prevY = head.y;
      // The head chases the pointer; the rest is verlet rope with a little gravity.
      head.x += (target.x - head.x) * (reducedMotion ? 1 : C.stiffness);
      head.y += (target.y - head.y) * (reducedMotion ? 1 : C.stiffness);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.96, vy = (p.y - p.py) * 0.96;
        p.px = p.x; p.py = p.y;
        p.x += reducedMotion ? 0 : vx;
        p.y += reducedMotion ? 0 : vy + 0.22;
      }
      for (let k = 0; k < 6; k++) {
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
          const diff = (d - seg) / d;
          b.x -= dx * diff; b.y -= dy * diff;
        }
      }
      const clear = keepClear.current?.getBoundingClientRect();
      const overText = clear && head.x > clear.left - 16 && head.x < clear.right + 16 && head.y > clear.top - 16 && head.y < clear.bottom + 16;
      if (target.seen && !overText && Math.hypot(head.x - prevX, head.y - prevY) > 0.4) inlaySegment(prevX, prevY, head.x, head.y);

      // Live thread: a glowing gold line with the spark at its head.
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      g.lineCap = "round"; g.lineJoin = "round";
      g.shadowColor = "rgba(232,201,138,0.9)"; g.shadowBlur = 14;
      const grad = g.createLinearGradient(head.x, head.y, pts[pts.length - 1].x, pts[pts.length - 1].y);
      grad.addColorStop(0, "#FFE9B8"); grad.addColorStop(0.5, "#E8C98A"); grad.addColorStop(1, "rgba(201,164,92,0.1)");
      g.strokeStyle = grad; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
        g.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      g.stroke();
      g.shadowBlur = 22; g.fillStyle = "#FFF1D0";
      g.beginPath(); g.arc(head.x, head.y, 2.6, 0, Math.PI * 2); g.fill();

      lightRef.current = { x: head.x / window.innerWidth, y: 1 - head.y / window.innerHeight };

      // Chapter progress (the thread engraves the brand lines as you scroll).
      setChapter((c) => { const next = c + (chapterTarget.current - c) * (reducedMotion ? 1 : 0.07); return Math.abs(next - c) < 0.0005 ? chapterTarget.current : next; });

      if (++n % 20 === 0 && thumbRef.current) {
        const t = thumbRef.current.getContext("2d")!;
        t.drawImage(trailCanvas, 0, 0, thumbRef.current.width, thumbRef.current.height);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", fit); };
  }, [phase, reducedMotion, inlaySegment, trailCanvas]);

  const engrave = Math.min(1, Math.max(0, chapter / 0.8));
  const knotLit = screen === 1 ? 3 : chapter >= 0.98 ? 2 : 1;

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#050608] text-cream select-none"
      onPointerMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY, seen: true }; if (phase !== "drawing") lightRef.current = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight }; }}
      onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
      onTouchMove={(e) => {
        // Phones: the same swipe guides the thread and follows it forward.
        if (touchY.current === null || phase !== "drawing" || screen !== 0) return;
        const y = e.touches[0].clientY;
        chapterTarget.current = THREE.MathUtils.clamp(chapterTarget.current + (touchY.current - y) / 1300, 0, 1);
        touchY.current = y;
      }}
      onWheel={(e) => { if (phase === "drawing" && screen === 0) chapterTarget.current = THREE.MathUtils.clamp(chapterTarget.current + e.deltaY / 2200, 0, 1); }}
    >
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false }} onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))}>
        <StoneScene trail={trailTexture} lightRef={lightRef} revealRef={revealRef} />
      </Canvas>
      <canvas ref={liveRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* One warm spotlight on the focal point. */}
      <Spotlight y={phase === "drawing" && screen === 0 ? "46%" : "50%"} strength={0.1} />

      {/* Loader: the thread draws itself toward the spark. */}
      {phase !== "drawing" && (
        <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path ref={pathRef} d={LOADER_PATH} pathLength={1} fill="none" stroke="#E8C98A" strokeWidth={2 + charge * 1.5} strokeLinecap="round"
            strokeDasharray="1" strokeDashoffset={1 - progress} filter="url(#glow)" style={{ opacity: 0.75 + charge * 0.25 }} />
        </svg>
      )}
      {phase !== "drawing" && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-bright" style={{ transform: `translate(-50%,-50%) scale(${1 + charge * 1.2})` }}>
          <Star className={`text-[1.4rem] drop-shadow-[0_0_14px_rgba(232,201,138,0.9)] ${progress < 1 ? "opacity-40" : ""}`} />
        </div>
      )}

      <AnimatePresence>
        {phase === "loading" && (
          <motion.p exit={{ opacity: 0 }} className="micro pointer-events-none absolute inset-x-0 top-[calc(50%+3.2rem)] text-center text-cream-faint">
            {thread.loading} · <span className="tabular-nums">{Math.round(progress * 100)}%</span>
          </motion.p>
        )}
        {phase === "hold" && (
          <motion.button
            type="button" aria-label={thread.holdA11y}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); holding.current = true; }}
            onPointerUp={() => { holding.current = false; }}
            onPointerCancel={() => { holding.current = false; }}
            onClick={(e) => { if (e.detail === 0 || reducedMotion) pickUp(); }}
            className="micro float-shadow absolute top-[calc(50%+3.4rem)] left-1/2 -translate-x-1/2 overflow-hidden rounded-full border border-gold/50 bg-[#0d0e12]/80 px-7 py-3.5 text-[0.62rem] text-gold-bright"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-gold/30" style={{ width: `${charge * 100}%` }} />
            <span className="relative">{thread.hold}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* .01 — the name, engraved in gold as the thread passes (TURA composition). */}
      {phase === "drawing" && screen === 0 && (
        <div ref={keepClear} className="pointer-events-none absolute inset-x-0 top-[46%] mx-auto flex w-fit max-w-full -translate-y-1/2 flex-col items-center px-4 pt-12 pb-4 max-md:pt-0">
          <Headline
            eyebrow={brand.values.join("  ·  ")}
            text={["Kreatif", "Atelier"]}
            caption={[brand.lineA, brand.lineB]}
            textClassName="text-transparent [-webkit-text-stroke:1px_rgba(232,201,138,0.22)]"
          >
            <span aria-hidden="true" className="gold-text absolute inset-0 [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.08))]" style={{ clipPath: `inset(0 ${100 - engrave * 100}% 0 0)` }}>
              <span className="max-md:block">Kreatif</span><span className="max-md:hidden"> </span><span className="max-md:block">Atelier</span>
            </span>
          </Headline>
          <motion.p animate={{ opacity: chapter > 0.9 ? 1 : 0, y: chapter > 0.9 ? 0 : 10 }} transition={{ duration: 0.8 }}
            className="mt-[7.5rem] max-w-[34rem] text-center text-[0.84rem] leading-[1.9] text-cream-muted max-md:mt-6">
            {about.intro}
          </motion.p>
        </div>
      )}

      {/* .02 — Six pillars: services as inlaid stone cards in the fanned depth carousel. */}
      <AnimatePresence>
        {phase === "drawing" && screen === 1 && (
          <motion.div key="pillars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.7 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#050608]/55 backdrop-blur-[3px]">
            <FanCarousel
              ariaLabel={thread.knots[2]}
              items={services.map((s, i) => ({ id: s.slug, label: s.title, visual: <PillarCard index={i} /> }))}
              index={pillar} onIndex={setPillar}
              title={services[pillar].title}
              body={services[pillar].tagline}
              action={{ label: servicesIntro.cardCta, onClick: () => setOpenService(services[pillar].slug) }}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ServiceOverlay service={services.find((s) => s.slug === openService) ?? null} onClose={() => setOpenService(null)} />

      {phase === "drawing" && (
        <>
          {/* The thread's route: ten knots on the right edge (it replaces the SCROLL cue). */}
          <nav aria-label="Chapters" className="absolute top-1/2 right-[calc(var(--fi)+0.25rem)] -translate-y-1/2 [--fi:clamp(1.25rem,3.6vw,3.25rem)] max-md:hidden">
            <ol className="relative flex flex-col items-end gap-3.5">
              <span aria-hidden="true" className="absolute top-1 right-[5px] bottom-1 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-white/5" />
              {thread.knots.map((k, i) => (
                <li key={k} className="group relative flex flex-row-reverse items-center gap-3">
                  <span className={`relative z-10 h-[11px] w-[11px] rotate-45 border ${i < knotLit ? "border-gold bg-gold shadow-[0_0_10px_var(--gold)]" : "border-white/25 bg-[#050608]"}`} />
                  <span className={`micro text-[0.52rem] whitespace-nowrap transition-opacity ${i === knotLit - 1 ? "text-gold opacity-100" : "text-cream-faint opacity-0 group-hover:opacity-100"}`}>{k}</span>
                </li>
              ))}
            </ol>
            <p aria-hidden="true" className="micro mt-5 text-right text-[0.5rem] text-cream-faint">{frame.scroll}</p>
          </nav>

          {/* The keepsake in progress, bottom-right. */}
          <div className="absolute right-[clamp(1.25rem,3.6vw,3.25rem)] bottom-[clamp(1.25rem,3.6vw,3.25rem)] flex items-end gap-3 max-md:right-auto max-md:bottom-[4.6rem] max-md:left-1/2 max-md:-translate-x-1/2">
            <p className="max-w-[12rem] text-right text-[0.66rem] leading-snug text-cream-faint max-md:hidden">{thread.legacyHint}</p>
            <canvas ref={thumbRef} width={160} height={100} aria-hidden="true" className="float-shadow h-[62px] w-[100px] rounded-[2px] border border-gold/25 opacity-85 md:h-[80px] md:w-[128px]" />
          </div>
          {screen === 0 && <p className="micro pointer-events-none absolute inset-x-0 bottom-[clamp(1.25rem,3.6vw,3.25rem)] text-center text-[0.52rem] text-cream-faint max-md:hidden">{thread.drawHint}</p>}
        </>
      )}

      <Frame
        sections={thread.sections.map((label) => ({ label }))}
        current={screen}
        onSection={(i) => { if (phase !== "drawing") pickUp(); setScreen(i); }}
        primaryLink={{ label: thread.pillarsLink, onClick: () => { if (phase !== "drawing") pickUp(); setScreen(1); } }}
        scrollCue={false}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

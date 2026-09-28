"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Star } from "@/components/ui/Star";
import { about } from "@/content/about";
import { brand, thread } from "@/content/concepts";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { conceptConfig } from "@/lib/config";
import { StoneScene } from "./StoneScene";

type Phase = "loading" | "hold" | "drawing";
type Pt = { x: number; y: number; px: number; py: number };

const C = conceptConfig.thread;
const TRAIL_SCALE = 0.5; // the inlay canvas is half the viewport resolution
// The loader's thread: meanders in from the left and ends at the centre spark (viewBox 1440×900, slice).
const LOADER_PATH = "M -40 610 C 160 560, 260 700, 470 620 S 640 360, 800 470 S 760 520, 720 450";

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

  const lightRef = useRef({ x: 0.28, y: 0.42 });
  const revealRef = useRef(0);
  const liveRef = useRef<HTMLCanvasElement>(null);
  const thumbRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointer = useRef({ x: 0, y: 0, seen: false });
  const rope = useRef<Pt[]>([]);
  const chapterTarget = useRef(0);
  const holding = useRef(false);

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
      if (target.seen && Math.hypot(head.x - prevX, head.y - prevY) > 0.4) inlaySegment(prevX, prevY, head.x, head.y);

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

  const line1 = Math.min(1, Math.max(0, chapter / 0.45));
  const line2 = Math.min(1, Math.max(0, (chapter - 0.4) / 0.45));
  const knotLit = chapter >= 0.98 ? 2 : 1;

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#050608] text-cream select-none"
      onPointerMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY, seen: true }; if (phase !== "drawing") lightRef.current = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight }; }}
      onWheel={(e) => { if (phase === "drawing") chapterTarget.current = THREE.MathUtils.clamp(chapterTarget.current + e.deltaY / 2200, 0, 1); }}
    >
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false }} onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))}>
        <StoneScene trail={trailTexture} lightRef={lightRef} revealRef={revealRef} />
      </Canvas>
      <canvas ref={liveRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

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
          <motion.p exit={{ opacity: 0 }} className="eyebrow pointer-events-none absolute inset-x-0 top-[calc(50%+3.2rem)] text-center text-[0.6rem] text-cream-faint">
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
            className="eyebrow absolute top-[calc(50%+3.4rem)] left-1/2 -translate-x-1/2 overflow-hidden rounded-full border border-gold/60 px-7 py-3.5 text-[0.66rem] text-gold-bright"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-gold/30" style={{ width: `${charge * 100}%` }} />
            <span className="relative">{thread.hold}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* First chapter: the brand lines, engraved as the thread passes. */}
      {phase === "drawing" && (
        <>
          <div className="pointer-events-none absolute inset-x-[8vw] top-[30vh]">
            <p className="eyebrow text-[0.62rem] text-gold/80">{brand.values.join("  ·  ")}</p>
            <h1 className="sr-only">{brand.wordmark}</h1>
            {[brand.lineA, brand.lineB].map((line, i) => {
              const r = i === 0 ? line1 : line2;
              return (
                <p key={line} aria-hidden="true" className={`display relative mt-4 text-[clamp(2.4rem,6vw,5.6rem)] leading-[1.05] ${i ? "italic" : ""}`}>
                  <span className="text-transparent [-webkit-text-stroke:1px_rgba(232,201,138,0.18)]">{line}</span>
                  <span className="gold-text absolute inset-0 [text-shadow:0_1px_0_rgba(255,255,255,0.06)]" style={{ clipPath: `inset(0 ${100 - r * 100}% 0 0)` }}>{line}</span>
                </p>
              );
            })}
            <p className="sr-only">{brand.lineA} {brand.lineB}</p>
            <motion.div animate={{ opacity: chapter > 0.9 ? 1 : 0, y: chapter > 0.9 ? 0 : 12 }} transition={{ duration: 0.8 }} className="mt-10 max-w-xl">
              <p className="eyebrow flex items-center gap-2 text-[0.6rem] text-gold"><Star /> {thread.knots[1]}</p>
              <p className="mt-3 leading-relaxed text-cream-muted">{about.intro}</p>
            </motion.div>
          </div>

          {/* The thread's route: ten knots, one per chapter. */}
          <nav aria-label="Chapters" className="absolute top-1/2 right-5 -translate-y-1/2">
            <ol className="relative flex flex-col gap-3.5">
              <span aria-hidden="true" className="absolute top-1 bottom-1 left-[5px] w-px bg-gradient-to-b from-gold/60 via-gold/20 to-white/5" />
              {thread.knots.map((k, i) => (
                <li key={k} className="group relative flex items-center gap-3">
                  <span className={`relative z-10 h-[11px] w-[11px] rotate-45 border ${i < knotLit ? "border-gold bg-gold shadow-[0_0_10px_var(--gold)]" : "border-white/25 bg-[#050608]"}`} />
                  <span className={`eyebrow text-[0.56rem] whitespace-nowrap transition-opacity ${i === knotLit - 1 ? "text-gold opacity-100" : "text-cream-faint opacity-0 group-hover:opacity-100"}`}>{k}</span>
                </li>
              ))}
            </ol>
          </nav>

          {/* The keepsake in progress. */}
          <div className="absolute bottom-5 left-5 flex items-end gap-3">
            <canvas ref={thumbRef} width={160} height={100} aria-hidden="true" className="rounded-sm border border-gold/25 opacity-80" />
            <p className="max-w-[13rem] text-[0.7rem] leading-snug text-cream-faint">{thread.legacyHint}</p>
          </div>
          <p className="eyebrow pointer-events-none absolute inset-x-0 bottom-6 text-center text-[0.58rem] text-cream-faint max-md:hidden">{thread.drawHint}</p>
        </>
      )}
    </div>
  );
}

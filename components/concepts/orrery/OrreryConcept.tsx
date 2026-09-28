"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Star } from "@/components/ui/Star";
import { brand, orrery } from "@/content/concepts";
import { divisions } from "@/content/ecosystem";
import { steps } from "@/content/process";
import { services } from "@/content/services";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";
import { useLoadProgress } from "@/lib/concepts/useLoadProgress";
import { config, conceptConfig } from "@/lib/config";
import { OrreryScene, type OrreryBody } from "./OrreryScene";

type Detail = { eyebrow: string; title: string; lede?: string; body: string };

/**
 * Concept 1 — The Orrery. A golden clockwork instrument that assembles while the site loads.
 * Everything Kreatif Atelier does sits on its rings; the visitor turns it, winds it and flies to a body.
 */
export default function OrreryConcept() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, conceptConfig.orrery.loaderMinMs, reducedMotion);
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState<OrreryBody | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const drag = useRef({ yaw: 0, pitch: 0 });
  const wind = useRef(0);
  const pointer = useRef<{ x: number; y: number; moved: number } | null>(null);

  const bodies = useMemo<OrreryBody[][]>(
    () => [
      services.map((s, i) => ({ id: `s-${i}`, ring: 0, index: i, label: s.title })),
      divisions.map((d, i) => ({ id: `d-${i}`, ring: 1, index: i, label: d.name })),
      steps.map((s, i) => ({ id: `p-${i}`, ring: 2, index: i, label: s.title })),
    ],
    [],
  );

  const detail = (b: OrreryBody): Detail => {
    if (b.ring === 0) { const s = services[b.index]; return { eyebrow: `${orrery.rings[0].label} · ${s.number}`, title: s.title, lede: s.tagline, body: s.blurb }; }
    if (b.ring === 1) { const d = divisions[b.index]; return { eyebrow: orrery.rings[1].label, title: d.name, lede: d.tagline, body: d.body }; }
    const s = steps[b.index];
    return { eyebrow: `${orrery.rings[2].label} · ${s.number}`, title: s.title, body: s.body };
  };

  const select = useCallback((b: OrreryBody) => {
    if (pointer.current && pointer.current.moved > 6) return; // it was a drag
    setFocused(b);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFocused(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loaded = progress >= 1;
  const pct = Math.round(progress * 100);

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#05070c] text-cream select-none"
      onPointerDown={(e) => { pointer.current = { x: e.clientX, y: e.clientY, moved: 0 }; }}
      onPointerMove={(e) => {
        const p = pointer.current;
        if (!p || !entered || focused) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        p.moved += Math.abs(dx) + Math.abs(dy);
        drag.current.yaw += dx * 0.005;
        drag.current.pitch = THREE.MathUtils.clamp(drag.current.pitch + dy * 0.004, -0.6, 0.6);
        p.x = e.clientX; p.y = e.clientY;
      }}
      onPointerUp={() => { setTimeout(() => { pointer.current = null; }, 0); }}
      onWheel={(e) => { if (entered && !focused) wind.current = THREE.MathUtils.clamp((wind.current ?? 0) + e.deltaY * conceptConfig.orrery.windPerPixel, -3, 3); }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: conceptConfig.orrery.camera.fov, position: conceptConfig.orrery.camera.position, near: 0.1, far: 80 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
          gl.toneMappingExposure = config.three.exposure;
          requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        }}
      >
        <OrreryScene
          bodies={bodies} progress={progress} entered={entered} focused={focused} hovered={hovered}
          reducedMotion={reducedMotion} dragRef={drag} windRef={wind} onHover={setHovered} onSelect={select}
        />
      </Canvas>

      {/* Loader: the instrument assembles behind a quiet engraved counter. */}
      <AnimatePresence>
        {!loaded && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="pointer-events-none absolute inset-x-0 bottom-[9vh] text-center">
            <p className="eyebrow text-[0.62rem] text-gold/80">{orrery.loading}</p>
            <p className="display mt-2 text-[3.4rem] leading-none text-cream lining-nums tabular-nums">
              {String(pct).padStart(2, "0")}<span className="text-gold">%</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title → collapses to the corner once the instrument is set in motion. */}
      <motion.header
        initial={false}
        animate={entered ? { top: "1.6rem", left: "1.6rem", scale: 0.42, opacity: 1 } : { top: "34vh", left: "7vw", scale: 1, opacity: loaded ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute origin-top-left"
      >
        <p className="eyebrow text-[0.7rem] text-gold">{brand.values.join("  ·  ")}</p>
        <h1 className="display gold-text mt-4 text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] font-medium tracking-[0.04em] uppercase">
          {brand.wordmark}
        </h1>
        <p className="display mt-5 text-[clamp(1.2rem,2vw,1.8rem)] text-cream">
          {brand.lineA} <span className="emph">{brand.lineB}</span>
        </p>
      </motion.header>

      <AnimatePresence>
        {loaded && !entered && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setEntered(true)}
            className="eyebrow absolute bottom-[10vh] left-[7vw] flex items-center gap-3 rounded-full border border-gold/60 bg-black/30 px-7 py-4 text-[0.72rem] text-gold-bright backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
          >
            <Star /> {orrery.enter}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Explore: ring index (keyboard route to every body) + hint. */}
      {entered && !focused && (
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          aria-label="Orrery index" className="absolute bottom-6 left-6 max-w-[16rem] text-[0.78rem]">
          {orrery.rings.map((ring, r) => (
            <div key={ring.id} className="mb-3">
              <p className="eyebrow text-[0.6rem] text-gold">{ring.label} <span className="text-cream-faint">· {ring.note}</span></p>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                {bodies[r].map((b) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => setFocused(b)} onMouseEnter={() => setHovered(b.id)} onMouseLeave={() => setHovered(null)}
                      className="text-cream-muted transition-colors hover:text-gold-bright">{b.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.nav>
      )}
      {entered && !focused && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="eyebrow pointer-events-none absolute right-6 bottom-6 text-[0.6rem] text-cream-faint">{orrery.hint}</motion.p>
      )}

      {/* Focus: glass panel beside the chosen body. */}
      <AnimatePresence>
        {focused && (() => {
          const d = detail(focused);
          return (
            <motion.aside key={focused.id} role="dialog" aria-label={d.title}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 right-[4vw] w-[min(26rem,88vw)] -translate-y-1/2 rounded-sm border border-white/10 bg-[#05070c]/70 p-8 backdrop-blur-xl max-md:top-auto max-md:right-3 max-md:bottom-3 max-md:translate-y-0"
            >
              <p className="eyebrow flex items-center gap-2 text-[0.62rem] text-gold"><Star /> {d.eyebrow}</p>
              <h2 className="display mt-4 text-[2.2rem] leading-tight text-cream">{d.title}</h2>
              {d.lede && <p className="emph mt-2 text-[1.15rem] leading-snug">{d.lede}</p>}
              <p className="mt-4 text-[0.92rem] leading-relaxed text-cream-muted">{d.body}</p>
              <button type="button" autoFocus onClick={() => setFocused(null)}
                className="eyebrow mt-7 flex items-center gap-2 text-[0.62rem] text-gold hover:text-gold-bright">← {orrery.back}</button>
            </motion.aside>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

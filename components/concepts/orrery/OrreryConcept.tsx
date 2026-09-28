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
import { FanCarousel } from "../frame/FanCarousel";
import { Frame } from "../frame/Frame";
import { Headline } from "../frame/Headline";
import { Spotlight } from "../frame/Spotlight";
import { OrreryScene, type OrreryBody } from "./OrreryScene";

type Detail = { eyebrow: string; title: string; lede?: string; body: string };

/** The four division worlds as painted spheres for the carousel cards (same materials as on the orrery). */
const sphereLook = [
  "radial-gradient(circle at 34% 30%, #fff5d6 0%, #eccd8e 16%, #a87b3a 44%, #3a2a14 74%, #0b0e16 100%)",
  "radial-gradient(circle at 34% 30%, #d7e2ff 0%, #33405f 11%, #10162a 44%, #05070c 82%)",
  "radial-gradient(circle at 34% 30%, #fffaf0 0%, #efe4cf 26%, #a99b82 66%, #3b352c 100%)",
  "radial-gradient(circle at 34% 30%, #ffd6dc 0%, #b73d50 13%, #7a1e2b 44%, #2a070d 86%)",
];

function HouseCard({ index, name }: { index: number; name: string }) {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(120%_90%_at_50%_30%,#171c2c_0%,#0b0e16_70%)]">
      <span aria-hidden="true" className="absolute top-1/2 left-1/2 h-[64%] w-[92%] -translate-x-1/2 -translate-y-[46%] rotate-[-12deg] rounded-[50%] border border-gold/35" />
      <span aria-hidden="true" className="absolute top-1/2 left-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_30px_60px_-10px_rgb(0_0_0/0.9)]" style={{ background: sphereLook[index] }} />
      <p className="micro absolute top-4 left-5 text-[0.55rem] text-gold">{name}</p>
      <p className="headline absolute top-3.5 right-5 text-[0.9rem] text-cream-faint">.{String(index + 1).padStart(2, "0")}</p>
    </div>
  );
}

/**
 * Concept 1 — The Orrery. A golden clockwork instrument that assembles while the site loads.
 * Everything Kreatif Atelier does sits on its rings; the visitor turns it, winds it and flies to a body.
 * Composition follows the TURA frame: edge furniture, one focal point, macro/micro type, spotlight.
 */
export default function OrreryConcept() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useLoadProgress(ready, conceptConfig.orrery.loaderMinMs, reducedMotion);
  const [entered, setEntered] = useState(false);
  const [screen, setScreen] = useState(0);
  const [house, setHouse] = useState(0);
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setFocused(null); setScreen(0); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loaded = progress >= 1;
  const pct = Math.round(progress * 100);
  const showSection = (i: number) => { setFocused(null); setScreen(i); if (i === 0 && loaded) setEntered(true); };

  return (
    <div
      className="fixed inset-0 touch-none overflow-hidden bg-[#05070c] text-cream select-none"
      onPointerDown={(e) => { pointer.current = { x: e.clientX, y: e.clientY, moved: 0 }; }}
      onPointerMove={(e) => {
        const p = pointer.current;
        if (!p || !entered || focused || screen) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        p.moved += Math.abs(dx) + Math.abs(dy);
        drag.current.yaw += dx * 0.005;
        drag.current.pitch = THREE.MathUtils.clamp(drag.current.pitch + dy * 0.004, -0.6, 0.6);
        p.x = e.clientX; p.y = e.clientY;
      }}
      onPointerUp={() => { setTimeout(() => { pointer.current = null; }, 0); }}
      onWheel={(e) => { if (entered && !focused && !screen) wind.current = THREE.MathUtils.clamp((wind.current ?? 0) + e.deltaY * conceptConfig.orrery.windPerPixel, -3, 3); }}
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
      <Spotlight y={entered ? "46%" : "36%"} strength={0.12} />

      {/* .01 — loader counter, then the headline composition over the instrument's lower edge. */}
      <AnimatePresence>
        {!loaded && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="pointer-events-none absolute inset-x-0 bottom-[16vh] text-center">
            <p className="micro text-gold/80">{orrery.loading}</p>
            <p className="headline mt-2 text-[3.2rem] text-cream tabular-nums">
              {String(pct).padStart(2, "0")}<span className="text-gold">%</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {loaded && !entered && screen === 0 && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: reducedMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-[57%] flex flex-col items-center max-md:top-[50%]"
          >
            <Headline eyebrow={brand.values.join("  ·  ")} text={["Kreatif", "Atelier"]} caption={[brand.lineA, brand.lineB]} />
            <button type="button" onClick={() => setEntered(true)}
              className="micro float-shadow mt-[7.5rem] flex items-center gap-3 rounded-full border border-gold/50 bg-[#0d1019]/80 px-7 py-3.5 text-[0.62rem] text-gold-bright transition-colors hover:bg-gold hover:text-ink max-md:mt-7">
              <Star /> {orrery.enter}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explore: body index on the right edge, hint in microtype at the bottom centre. */}
      {entered && !focused && screen === 0 && (
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          aria-label="Orrery index" className="absolute top-1/2 right-[calc(var(--frame-inset,3rem)+2.2rem)] w-[13rem] -translate-y-1/2 text-right max-md:hidden"
          style={{ ["--frame-inset" as string]: conceptConfig.frame.inset }}>
          {orrery.rings.map((ring, r) => (
            <div key={ring.id} className="mb-5">
              <p className="micro text-[0.56rem] text-gold">{ring.label}</p>
              <ul className="mt-1.5 space-y-1">
                {bodies[r].map((b) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => setFocused(b)} onMouseEnter={() => setHovered(b.id)} onMouseLeave={() => setHovered(null)}
                      className="text-[0.74rem] text-cream-faint transition-colors hover:text-gold-bright">{b.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.nav>
      )}
      {entered && !focused && screen === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="micro pointer-events-none absolute inset-x-0 bottom-[9vh] text-center text-[0.56rem] text-cream-faint">{orrery.hint}</motion.p>
      )}

      {/* Focus: floating glass panel beside the chosen body. */}
      <AnimatePresence>
        {focused && screen === 0 && (() => {
          const d = detail(focused);
          return (
            <motion.aside key={focused.id} role="dialog" aria-label={d.title}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="float-shadow absolute top-1/2 right-[8vw] w-[min(25rem,86vw)] -translate-y-1/2 rounded-[3px] border border-white/10 bg-[#05070c]/75 p-9 backdrop-blur-xl max-md:top-auto max-md:right-3 max-md:bottom-16 max-md:translate-y-0"
            >
              <p className="micro text-[0.58rem] text-gold">{d.eyebrow}</p>
              <h2 className="headline mt-4 text-[2rem] text-cream">{d.title}</h2>
              {d.lede && <p className="emph mt-3 text-[1.1rem] leading-snug">{d.lede}</p>}
              <p className="mt-4 text-[0.86rem] leading-[1.85] text-cream-muted">{d.body}</p>
              <button type="button" autoFocus onClick={() => setFocused(null)} className="micro mt-7 text-[0.58rem] text-gold hover:text-gold-bright">← {orrery.back}</button>
            </motion.aside>
          );
        })()}
      </AnimatePresence>

      {/* .02 — The Houses: the four divisions in the fanned depth carousel. */}
      <AnimatePresence>
        {screen === 1 && (
          <motion.div key="houses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.7 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#05070c]/72 backdrop-blur-[6px]">
            <Spotlight y="32%" strength={0.14} />
            <div className="relative w-full pt-4">
              <FanCarousel
                ariaLabel={orrery.rings[1].label}
                items={divisions.map((d, i) => ({ id: d.slug, label: d.name, visual: <HouseCard index={i} name={d.name} /> }))}
                index={house} onIndex={setHouse}
                eyebrow={`${orrery.rings[1].label} · ${String(house + 1).padStart(2, "0")} / 04`}
                title={divisions[house].name}
                body={divisions[house].tagline}
                action={{ label: orrery.visitHouse, onClick: () => { setScreen(0); setEntered(true); setFocused(bodies[1][house]); } }}
                reducedMotion={reducedMotion}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Frame
        sections={orrery.sections.map((label) => ({ label }))}
        current={screen}
        onSection={showSection}
        primaryLink={{ label: orrery.housesLink, onClick: () => showSection(1) }}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

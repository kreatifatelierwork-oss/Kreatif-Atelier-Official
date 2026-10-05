"use client";

import { Bloom, DepthOfField, EffectComposer, HueSaturation, BrightnessContrast, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { DepthOfFieldEffect } from "postprocessing";
import type { Runtime } from "../journey";
import { LAST } from "../route";
import { splatState } from "./Splats";

/**
 * Focus distance per place (metres): the sharp subject of each reference frame. Everything nearer (the foreground
 * leaves, rock, mist) and much farther falls into soft bokeh, which is what sells the depth (REFS-ANALYSIS "Frame").
 * Default for places not listed: 30 m.
 */
const FOCUS: Record<number, number> = {
  0: 18, 1: 2.3, 2: 24, 3: 13, 4: 9, 5: 5.8, 6: 12, 7: 16, 8: 120, 9: 140, 10: 120, 11: 120, 12: 220,
};
const focusAt = (s: number) => {
  const i = Math.max(0, Math.min(LAST - 1, Math.floor(s))), f = s - i;
  const a = FOCUS[i] ?? 30, b = FOCUS[i + 1] ?? 30;
  // Interpolate in log space: focus pulls feel natural across near and far subjects.
  return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * f);
};

/**
 * The film look, rendered after the scene: bloom on the gold and the sun, a focus pull that follows the route,
 * a soft vignette and a warm grade. Phones and reduced motion get bloom and the grade only (no depth of field).
 */
export function Effects({ rtRef, mobile, calm }: { rtRef: { current: Runtime }; mobile: boolean; calm: boolean }) {
  const lite = mobile || calm;
  const dof = useRef<DepthOfFieldEffect>(null);
  useFrame(() => {
    const d = focusAt(rtRef.current.s);
    // Splat worlds take Spark's own depth of field; the post-process one steps aside while they are on screen.
    const sp = splatState.renderer, k = splatState.amount;
    splatState.amount = 0; // re-raised by each visible splat world this frame (they update before the effects)
    if (sp) { sp.focalDistance = d; sp.apertureAngle = lite ? 0 : 0.012 * k; }
    const e = dof.current;
    if (!e) return;
    e.bokehScale = 3.2 * (1 - k);
    const m = e.cocMaterial as unknown as { worldFocusDistance: number; worldFocusRange: number };
    m.worldFocusDistance = d;
    m.worldFocusRange = Math.max(1.6, d * 1.1);
  });
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {lite ? <></> : <DepthOfField ref={dof} bokehScale={3.2} resolutionScale={0.5} />}
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.72} luminanceSmoothing={0.25} radius={0.72} />
      <BrightnessContrast brightness={0.02} contrast={0.08} />
      <HueSaturation saturation={0.06} />
      <Vignette offset={0.28} darkness={0.55} />
    </EffectComposer>
  );
}

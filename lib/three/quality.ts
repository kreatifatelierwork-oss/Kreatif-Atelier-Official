"use client";

import { config } from "@/lib/config";

export type Tier = "high" | "medium" | "low";
export type QualityDecision = { tier: Tier } | { tier: "fallback"; reason: string };

/** Software rasterisers make WebGL a slideshow — those visitors get the static CSS hero instead. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;

function webglRenderer(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return renderer;
  } catch {
    return null;
  }
}

/** Decided once per visit, before the canvas mounts. */
export function detectQuality(): QualityDecision {
  const renderer = webglRenderer();
  if (!renderer) return { tier: "fallback", reason: "no-webgl" };
  if (SOFTWARE_RENDERER.test(renderer)) return { tier: "fallback", reason: `software:${renderer}` };

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < config.mobileBreakpoint;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (coarse || narrow) return { tier: cores <= 4 || memory <= 3 ? "low" : "medium" };
  if (cores <= 4 || memory <= 4) return { tier: "medium" };
  return { tier: "high" };
}

export const stepDown = (tier: Tier): Tier => (tier === "high" ? "medium" : "low");

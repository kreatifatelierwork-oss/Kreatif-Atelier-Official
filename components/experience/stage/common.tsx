"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { useUi, type Runtime } from "../journey";

/** True while this thing is hovered or focused (in the scene or in its caption). */
export function useHovered(id: string) {
  return useUi((s) => s.hover === id || s.room === id);
}

/**
 * Pointer handlers for a thing in the scene: hovering answers (and lights its caption line), clicking enters its
 * room when it has one. Only active while you are at its place.
 */
export function thingEvents(place: number, id: string, rtRef: { current: Runtime }, onEnter?: (id: string) => void) {
  const here = () => Math.abs(rtRef.current.s - place) < 0.3;
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      if (!here()) return;
      e.stopPropagation();
      useUi.getState().set({ hover: id });
      if (onEnter) document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      if (useUi.getState().hover === id) useUi.getState().set({ hover: null });
      document.body.style.cursor = "";
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      if (!here() || !onEnter) return;
      e.stopPropagation();
      onEnter(id);
    },
  };
}

/** Uniforms shared by everything in a place that is "still being made". */
export type BuildUniforms = {
  uBuilt: { value: number };
  /** The Lens: centre (device px, y up) and radius (device px); radius 0 = no lens. */
  uLens: { value: THREE.Vector3 };
  uBase: { value: number };
  uHeight: { value: number };
};

export const makeBuildUniforms = (base: number, height: number): BuildUniforms => ({
  uBuilt: { value: 0 },
  uLens: { value: new THREE.Vector3(0, 0, 0) },
  uBase: { value: base },
  uHeight: { value: height },
});

/**
 * A material that is drawn until it is built: surfaces exist only below the rising "built" line (the place builds
 * itself from the floor up) or inside the Lens, where the finished place shows through the drawing.
 */
export function makeBuildMaterial(params: THREE.MeshStandardMaterialParameters, u: BuildUniforms) {
  const m = new THREE.MeshStandardMaterial(params);
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBuildPos;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvBuildPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vBuildPos;\nuniform float uBuilt;\nuniform vec3 uLens;\nuniform float uBase;\nuniform float uHeight;",
      )
      .replace(
        "void main() {",
        `void main() {
  float rise = uBase + uBuilt * uHeight * 1.05;
  float inLens = uLens.z > 0.0 ? step(length(gl_FragCoord.xy - uLens.xy), uLens.z) : 0.0;
  if (vBuildPos.y > rise && inLens < 0.5) discard;`,
      );
  };
  m.customProgramCacheKey = () => "build";
  return m;
}

/** The drawing: fine construction lines along a geometry's edges, in the place's colour. */
export function useEdges(geometry: THREE.BufferGeometry, threshold = 24) {
  return useMemo(() => new THREE.EdgesGeometry(geometry, threshold), [geometry, threshold]);
}

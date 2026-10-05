"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { worldFile, type World } from "@/lib/worlds";
import type { Runtime } from "../journey";
import { colliders } from "./layout";

/** Spark (World Labs' three.js splat renderer), loaded only when a splat world is in use. */
type SparkModule = typeof import("@sparkjsdev/spark");
let sparkPromise: Promise<SparkModule> | null = null;
const loadSpark = () => (sparkPromise ??= import(/* webpackChunkName: "spark" */ "@sparkjsdev/spark"));

/** Shared with the effects: how much of the frame is splat world now (0..1), and the focus to give Spark's own
 *  depth of field (splats don't write depth, so the post-process depth of field can't see them). */
export const splatState = { amount: 0, renderer: null as null | { focalDistance: number; apertureAngle: number } };

/** One SparkRenderer for the scene (shared by every splat world); lighter splat budget on phones. */
export function SparkLayer({ mobile }: { mobile: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    let spark: InstanceType<SparkModule["SparkRenderer"]> | null = null, gone = false;
    loadSpark().then(({ SparkRenderer }) => {
      if (gone) return;
      spark = new SparkRenderer({ renderer: gl, lodSplatScale: mobile ? 0.5 : 1 });
      scene.add(spark);
      splatState.renderer = spark;
    });
    return () => { gone = true; splatState.renderer = null; if (spark) { scene.remove(spark); spark.dispose(); } };
  }, [gl, scene, mobile]);
  return null;
}

/**
 * A splat world on the route. It streams in as the camera approaches its stretch (two places ahead), fades with the
 * passage at both ends (the threshold's fog, light and 3D foreground cover the handover), and is disposed once the
 * stretch is two places behind. `.rad` files stream their LoD pages; `.spz` builds its LoD in a worker on load.
 */
export function SplatWorld({ rtRef, world, mobile, night, anchor }: {
  rtRef: { current: Runtime }; world: World; mobile: boolean; night: boolean;
  /** Overrides the manifest transform (the pipeline test world sits on its depth-plate anchor). */
  anchor?: { position: THREE.Vector3; quaternion: THREE.Quaternion };
}) {
  const group = useRef<THREE.Group>(null);
  const [mesh, setMesh] = useState<THREE.Object3D | null>(null);
  const meshRef = useRef<(THREE.Object3D & { opacity?: number; dispose?: () => void }) | null>(null);
  useEffect(() => {
    const f = worldFile(world.id, mobile);
    if (!f) return;
    let gone = false;
    loadSpark().then(({ SplatMesh }) => {
      if (gone) return;
      // ?splatlod=0 (debug): load without in-browser LoD.
      const noLod = new URLSearchParams(window.location.search).get("splatlod") === "0";
      const m = new SplatMesh({ url: f.url, ...(f.paged ? { paged: true } : noLod ? {} : { lod: true }) });
      meshRef.current = m as unknown as typeof meshRef.current;
      setMesh(m);
    }).catch((e) => console.error("[splat]", world.id, e));
    // The collider (when the world has one): invisible, used to set text onto real surfaces.
    let collider: THREE.Object3D | null = null;
    if (f.collider) {
      import("three/examples/jsm/loaders/GLTFLoader.js").then(({ GLTFLoader }) => new GLTFLoader().loadAsync(f.collider!)).then((g) => {
        if (gone || !group.current) return;
        collider = g.scene;
        collider.visible = false;
        group.current.add(collider);
        group.current.updateMatrixWorld(true);
        colliders.meshes.push(collider);
        colliders.version++;
      }).catch((e) => console.error("[collider]", world.id, e));
    }
    return () => {
      gone = true; meshRef.current?.dispose?.(); meshRef.current = null; setMesh(null);
      if (collider) { colliders.meshes = colliders.meshes.filter((c) => c !== collider); colliders.version++; }
    };
  }, [world.id, mobile]);
  useFrame(() => {
    const s = rtRef.current.s, m = meshRef.current;
    const o = Math.min(THREE.MathUtils.smoothstep(s, world.from - 0.9, world.from - 0.3), 1 - THREE.MathUtils.smoothstep(s, world.to + 0.3, world.to + 0.9));
    if (group.current) group.current.visible = o > 0.003;
    if (m) splatState.amount = Math.max(splatState.amount, o);
    if (m && "opacity" in m) m.opacity = o * (night ? 0.45 : 1);
  });
  const t = world.transform;
  const rot = new THREE.Euler(...t.rotation.map((d) => THREE.MathUtils.degToRad(d)) as [number, number, number], "YXZ");
  return (
    <group ref={group} position={anchor?.position ?? t.position} quaternion={anchor?.quaternion ?? new THREE.Quaternion().setFromEuler(rot)} scale={anchor ? 1 : t.scale}>
      {mesh && <primitive object={mesh} />}
    </group>
  );
}

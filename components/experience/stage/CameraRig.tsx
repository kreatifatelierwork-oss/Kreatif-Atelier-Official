"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { experienceConfig as X } from "@/lib/config";
import type { Runtime } from "../journey";
import { LAST, route } from "../route";
import { thingAnchor } from "./layout";

const smooth = (t: number) => t * t * (3 - 2 * t);

const makeTmp = () => ({
  curve: new THREE.CatmullRomCurve3(X.camera.map((c) => new THREE.Vector3(...c.pos)), false, "centripetal"),
  looks: X.camera.map((c) => new THREE.Vector3(...c.look)),
  look: new THREE.Vector3(),
  pos: new THREE.Vector3(),
  room: new THREE.Vector3(),
  a: new THREE.Color(),
  b: new THREE.Color(),
  fog: new THREE.Fog("#F4F5F7", 30, 160),
  bg: new THREE.Color(),
});

/**
 * The one continuous camera. Between places it travels a smooth curve through the holds; the atmosphere (background
 * and fog) shifts to the next place's colour and thickens mid-passage, so you walk *into* the next world's haze.
 * Entering a room dollies toward the thing; the pointer adds a little parallax.
 */
export function CameraRig({ rtRef, theme }: { rtRef: { current: Runtime }; theme: "light" | "dark" }) {
  const tmpRef = useRef<ReturnType<typeof makeTmp> | null>(null);
  useFrame(({ camera, scene }) => {
    const tmp = (tmpRef.current ??= makeTmp());
    const rt = rtRef.current;
    const atm = X.atmosphere[theme];
    const i = Math.min(LAST - 1, Math.floor(rt.s));
    const f = Math.min(1, Math.max(0, rt.s - i));
    const e = smooth(f);
    // Camera on the curve through every hold (the curve's parameter is uniform per segment).
    tmp.curve.getPoint((i + e) / LAST, tmp.pos);
    tmp.look.copy(tmp.looks[i]).lerp(tmp.looks[i + 1], e);
    // Room dolly toward the thing being entered.
    const place = route[Math.round(rt.s)];
    if (rt.dolly > 0.001 && rt.room) {
      const a = thingAnchor(place.index, place.things.findIndex((t) => t.id === rt.room));
      if (a) {
        tmp.room.set(a[0], a[1] + 0.4, a[2]);
        tmp.pos.lerp(tmp.room, rt.dolly * X.enterDolly);
        tmp.look.lerp(tmp.room, rt.dolly * 0.8);
      }
    }
    tmp.pos.x += rt.px * X.parallax;
    tmp.pos.y += -rt.py * X.parallax * 0.5;
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.look);
    // Atmosphere: blend toward the next place's colour; haze peaks mid-passage.
    tmp.a.set(atm[i]);
    tmp.b.set(atm[i + 1]);
    tmp.bg.copy(tmp.a).lerp(tmp.b, e);
    scene.background = tmp.bg;
    const haze = Math.sin(Math.PI * f);
    tmp.fog.color.copy(tmp.bg);
    tmp.fog.near = 30 - haze * 28;
    tmp.fog.far = (i === 8 || i + 1 === 8 ? 420 : 160) - haze * 120;
    scene.fog = tmp.fog;
  });
  return null;
}

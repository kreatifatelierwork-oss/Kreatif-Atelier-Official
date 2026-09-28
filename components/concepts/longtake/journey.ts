import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";

/** Number of reels on the timeline: 00 core · 01–05 verticals · 06 finale. */
export const REELS = 7;

/** World centres: the core at the origin, the five verticals evenly round the ring (first one facing the camera). */
export const worldCentre = (i: number) => {
  if (i === 0 || i === 6) return new THREE.Vector3(0, 0, 0);
  // Offset by half a step so no world sits dead-centre in front of the core in the overview.
  const a = Math.PI / 2 + Math.PI / 5 + ((i - 1) / 5) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * L.ringRadius, 0, Math.sin(a) * L.ringRadius);
};

/** Stop k's camera position and look target. */
function stop(k: number): { pos: THREE.Vector3; target: THREE.Vector3 } {
  // The orrery seen low, like a horizon: worlds strung along it above the headline.
  if (k === 0) return { pos: new THREE.Vector3(0, 8.5, 44), target: new THREE.Vector3(0, -2.6, 0) };
  // Finale: high above, the ring in the upper half with the connected worlds; text sits below.
  if (k === 6) return { pos: new THREE.Vector3(0, 52, 30), target: new THREE.Vector3(0, -24, 0) };
  const c = worldCentre(k);
  const out = c.clone().setY(0).normalize();
  return {
    pos: c.clone().add(out.multiplyScalar(L.worldCamDistance)).add(new THREE.Vector3(0, L.worldCamHeight, 0)),
    // Look below the sculpture so it sits in the upper half, above the headline.
    target: c.clone().add(new THREE.Vector3(0, -1.35, 0)),
  };
}

/** A wide, high arc outside the ring between two stops — the camera "breathes out" between worlds. */
function via(a: number, b: number) {
  const pa = stop(a).pos, pb = stop(b).pos;
  const mid = pa.clone().add(pb).multiplyScalar(0.5);
  const flat = mid.clone().setY(0);
  if (flat.length() < 1) flat.set(0, 0, 1);
  flat.normalize().multiplyScalar(L.ringRadius + 13);
  return flat.setY(Math.max(pa.y, pb.y) + 5);
}

// Control points: stop0, via, stop1, via, stop2 … stop6. Stops sit at even indices.
const camPoints: THREE.Vector3[] = [];
const lookPoints: THREE.Vector3[] = [];
for (let k = 0; k < REELS; k++) {
  const s = stop(k);
  camPoints.push(s.pos);
  lookPoints.push(s.target);
  if (k < REELS - 1) {
    camPoints.push(via(k, k + 1));
    const t = stop(k).target.clone().lerp(stop(k + 1).target, 0.5).multiplyScalar(0.35);
    lookPoints.push(t);
  }
}
const camCurve = new THREE.CatmullRomCurve3(camPoints, false, "centripetal", 0.5);
const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, "centripetal", 0.5);

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export type JourneySample = {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  /** Reel the camera is closest to, and 0–1 blend toward the next reel. */
  reel: number;
  blend: number;
  /** 0 while holding at a world, rising to 1 mid-flight between worlds. */
  haze: number;
};

const P = camPoints.length - 1;

/**
 * Timeline position s ∈ [0, REELS-1] → camera. Each reel holds its framing for the middle part
 * of its span (so text can be read) and travels only near the boundaries.
 */
export function sampleJourney(s: number, out?: JourneySample): JourneySample {
  const clamped = Math.min(REELS - 1, Math.max(0, s));
  const k = Math.min(REELS - 2, Math.floor(clamped));
  const f = clamped - k;
  const travel = smooth(0.18, 0.82, f);
  const u = (k * 2 + travel * 2) / P;
  const res = out ?? { pos: new THREE.Vector3(), target: new THREE.Vector3(), reel: 0, blend: 0, haze: 0 };
  camCurve.getPoint(u, res.pos);
  lookCurve.getPoint(u, res.target);
  res.reel = k;
  res.blend = travel;
  res.haze = Math.pow(Math.sin(Math.PI * travel), 1.4);
  return res;
}

/** The reel nearest to s (what the timeline and text show). */
export const activeReel = (s: number) => Math.min(REELS - 1, Math.max(0, Math.round(s)));

/** Film timecode for s. */
export function timecode(s: number) {
  const total = Math.max(0, Math.floor(s * L.reelSeconds * 24));
  const fr = total % 24, sec = Math.floor(total / 24) % 60, min = Math.floor(total / 24 / 60);
  return `00:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
}

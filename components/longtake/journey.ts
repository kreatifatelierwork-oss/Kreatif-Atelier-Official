import * as THREE from "three";
import { longTakeConfig as L } from "@/lib/config";

/** Reels on the timeline: 00 core · 01–05 verticals · 06 ecosystem · 07 contact. */
export const REELS = 8;
export const FIRST_VERTICAL = 1;
export const LAST_VERTICAL = 5;
export const ECOSYSTEM = 6;
export const CONTACT = 7;
export const isVertical = (k: number) => k >= FIRST_VERTICAL && k <= LAST_VERTICAL;

/** World centres: core at the origin; verticals round the ring, offset so none sits dead-centre in the overview. */
export const worldCentre = (i: number) => {
  if (!isVertical(i)) return new THREE.Vector3(0, 0, 0);
  const a = Math.PI / 2 + Math.PI / 5 + ((i - 1) / 5) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * L.ringRadius, 0, Math.sin(a) * L.ringRadius);
};

/** Stop k's camera position and look target (`mobile` pulls world framings back for portrait screens). */
function stop(k: number, mobile: boolean): { pos: THREE.Vector3; target: THREE.Vector3 } {
  // 00 — the orrery seen low, like a horizon: worlds strung along it above the headline.
  if (k === 0) return { pos: new THREE.Vector3(0, 8.5, mobile ? 52 : 44), target: new THREE.Vector3(0, -2.6, 0) };
  // 06 — high above: the ring in the upper half with every world joined by light.
  if (k === ECOSYSTEM) {
    // A near top-down map of the ecosystem: the ring in the upper part of the frame, text below.
    const h = mobile ? 92 : 100, zo = mobile ? 17 : 10;
    return { pos: new THREE.Vector3(0, h, zo + 10), target: new THREE.Vector3(0, 0, zo) };
  }
  // 07 — back down into the warm core: the take ends where it began.
  if (k === CONTACT) return { pos: new THREE.Vector3(0, 2.2, mobile ? 19 : 14), target: new THREE.Vector3(0, mobile ? -4.2 : -3.2, 0) };
  const c = worldCentre(k);
  const out = c.clone().setY(0).normalize();
  const d = L.worldCamDistance * (mobile ? L.mobileCamScale : 1);
  return {
    pos: c.clone().add(out.multiplyScalar(d)).add(new THREE.Vector3(0, L.worldCamHeight, 0)),
    // Look below the sculpture so it sits in the upper half, above the headline.
    target: c.clone().add(new THREE.Vector3(0, -1.35, 0)),
  };
}

/** A wide, high arc outside the ring between two stops — the camera "breathes out" between worlds. */
function via(a: number, b: number, mobile: boolean) {
  const pa = stop(a, mobile).pos, pb = stop(b, mobile).pos;
  const mid = pa.clone().add(pb).multiplyScalar(0.5);
  const flat = mid.clone().setY(0);
  if (flat.length() < 1) flat.set(0, 0, 1);
  flat.normalize().multiplyScalar(L.ringRadius + 13);
  return flat.setY(Math.max(pa.y, pb.y) + 5);
}

function buildCurves(mobile: boolean) {
  const cam: THREE.Vector3[] = [];
  const look: THREE.Vector3[] = [];
  for (let k = 0; k < REELS; k++) {
    const s = stop(k, mobile);
    cam.push(s.pos);
    look.push(s.target);
    if (k < REELS - 1) {
      cam.push(via(k, k + 1, mobile));
      look.push(stop(k, mobile).target.clone().lerp(stop(k + 1, mobile).target, 0.5).multiplyScalar(0.35));
    }
  }
  return {
    cam: new THREE.CatmullRomCurve3(cam, false, "centripetal", 0.5),
    look: new THREE.CatmullRomCurve3(look, false, "centripetal", 0.5),
    last: cam.length - 1,
  };
}

const curves = { desktop: buildCurves(false), mobile: buildCurves(true) };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export type JourneySample = {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  /** Reel the camera is leaving, and 0–1 progress toward the next. */
  reel: number;
  blend: number;
  /** 0 while holding at a stop, rising to 1 mid-flight. */
  haze: number;
};

/**
 * Timeline position s ∈ [0, REELS-1] → camera. Each reel holds its framing for the middle of its span
 * (so the text can be read) and travels only near the boundaries.
 */
export function sampleJourney(s: number, mobile: boolean, out?: JourneySample): JourneySample {
  const c = mobile ? curves.mobile : curves.desktop;
  const clamped = Math.min(REELS - 1, Math.max(0, s));
  const k = Math.min(REELS - 2, Math.floor(clamped));
  const travel = smooth(0.18, 0.82, clamped - k);
  const u = (k * 2 + travel * 2) / c.last;
  const res = out ?? { pos: new THREE.Vector3(), target: new THREE.Vector3(), reel: 0, blend: 0, haze: 0 };
  c.cam.getPoint(u, res.pos);
  c.look.getPoint(u, res.target);
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

/** Follow the target along the timeline: exponential ease with a speed cap (long jumps fly through). */
export function followTimeline(s: number, target: number, dt: number) {
  const k = 1 - Math.exp(-dt / (L.follow * 0.5));
  const step = (target - s) * k;
  return s + Math.sign(step) * Math.min(Math.abs(step), dt * L.maxReelsPerSecond);
}

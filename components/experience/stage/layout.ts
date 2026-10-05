/**
 * Where things stand in the world. Scene text and callouts are placed from their reference frames: a point `at`
 * (fractions of the frame) at `depth` metres from a place's hold camera becomes a fixed world point, so at the hold it
 * sits exactly where the reference shows it and in between it moves with real parallax.
 */
import * as THREE from "three";
import { experienceConfig as X } from "@/lib/experience";
import { route } from "../route";

/** The camera the stage is drawing with (set by the stage, read by the DOM text layer each frame). */
export const stageView: { camera: THREE.PerspectiveCamera | null } = { camera: null };

/** On phones the reference frames' x positions are drawn in toward the centre so text fits the tall screen. */
export const phoneAt = (at: readonly [number, number]): [number, number] => [0.5 + (at[0] - 0.5) * 0.58, at[1]];

/** Lens per device (the stage's camera uses the same values). */
export const FOV = { desktop: 42, mobile: 55 } as const;

const tmpCam = new THREE.PerspectiveCamera();
const v = new THREE.Vector3();

/** A camera at place `i`'s hold (no pointer parallax), with the given lens and aspect. */
export function holdCamera(i: number, fov: number, aspect: number) {
  const c = X.camera[i];
  tmpCam.fov = fov;
  tmpCam.aspect = aspect;
  tmpCam.near = 0.1;
  tmpCam.far = 400;
  tmpCam.position.set(...c.pos);
  tmpCam.lookAt(...c.look);
  tmpCam.updateProjectionMatrix();
  tmpCam.updateMatrixWorld();
  return tmpCam;
}

/** The world point seen at frame point `at` from place `i`'s hold, `depth` metres away. */
export function anchorFor(i: number, at: readonly [number, number], depth: number, fov: number, aspect: number, out = new THREE.Vector3()) {
  const cam = holdCamera(i, fov, aspect);
  v.set(at[0] * 2 - 1, 1 - at[1] * 2, 0.5).unproject(cam).sub(cam.position).normalize();
  // Depth along the line of sight (not along the ray), so a row of labels at one depth stays level.
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
  return out.copy(cam.position).addScaledVector(v, depth / Math.max(0.2, v.dot(fwd)));
}

/** Used by the (locked) camera rig: entering a thing dollies toward its callout. */
export function thingAnchor(place: number, thing: number): [number, number, number] | null {
  const p = route[place];
  const t = p?.things[thing];
  if (!t) return null;
  for (const it of p.items) {
    if (it.k !== "callouts") continue;
    const c = it.items.find((x) => x.room === t.id);
    if (c) {
      const a = anchorFor(place, c.ring, c.depth, FOV.desktop, 16 / 9);
      return [a.x, a.y - 0.4, a.z];
    }
  }
  return null;
}

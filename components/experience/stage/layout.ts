/**
 * Where the things you can Enter stand in each place (world units). Blocked out for the route; the slice's places
 * (Studio Floor, Drafting Hall) are refined against the reference images.
 */
import { experienceConfig as X } from "@/lib/config";
import { route } from "../route";

type V3 = [number, number, number];

/** A row of n slots from `a` to `b` (inclusive). */
const row = (n: number, a: V3, b: V3): V3[] =>
  Array.from({ length: n }, (_, k) => {
    const t = n === 1 ? 0.5 : k / (n - 1);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  });

/** Slots relative to each place's anchor, by place index. */
const slots: Record<number, (n: number) => V3[]> = {
  1: (n) => row(n, [-9, 0, 6], [9, 0, 6]), // Studio Floor: four tall panels across the floor
  2: (n) => row(n, [-2.4, 1.05, 9.5], [2.4, 1.05, 9.5]), // Drafting Hall: models along the drafting table
  3: (n) => row(n, [6, 2.4, 22], [6, 2.4, 4]), // Projection Hall: frames down the right wall
  4: (n) => row(n, [-4, 0.2, 6], [10, 0.2, -2]), // Concourse
  5: (n) => row(n, [-6, 0.1, 10], [4, 0.1, -2]), // Water Court: stones toward the arch
  6: (n) => Array.from({ length: n }, (_, k) => [Math.cos((k / n) * Math.PI * 2) * 7, 0.2, Math.sin((k / n) * Math.PI * 2) * 7 + 2] as V3),
  7: (n) => row(n, [-6, 4, 6], [6, 4, 6]), // Glass Lattice: pane clusters
  9: (n) => row(n, [-11, 2.2, 3], [-6, 2.2, -8]), // Gallery: prints on the curved wall
};

export function thingAnchor(place: number, k: number): V3 | null {
  const p = route[place];
  if (!p || k < 0 || !slots[place]) return null;
  const s = slots[place](p.things.length)[k];
  const a = X.anchors[place];
  return [a[0] + s[0], a[1] + s[1], a[2] + s[2]];
}

"use client";

import type { Runtime } from "../../journey";
import { Mist } from "../Atmos";
import { Backdrop, FrameCard } from "../Backdrop";
import { hold } from "../kit";

type P = { rtRef: { current: Runtime }; mobile: boolean; calm: boolean; night: boolean };

/** The plate behind each stretch of chapters 5–12, and the foreground cut-out that frames a hold. */
export const LAND_PLATES: { name: string; from: number; to: number; aspect: number; fg?: { name: string; places: number[]; aspect: number } }[] = [
  { name: "p05-desert-canyon", from: 13, to: 15, aspect: 1.775, fg: { name: "p06-desert-fg", places: [13, 14], aspect: 1.769 } },
  { name: "p07-cave", from: 16, to: 18, aspect: 1.776 },
  { name: "p08-coast", from: 19, to: 20, aspect: 1.775 },
  { name: "p09-reef", from: 21, to: 21, aspect: 1.775 },
  { name: "p10-jade-lake", from: 22, to: 24, aspect: 1.773, fg: { name: "p11-bamboo-fg", places: [23, 24], aspect: 1.773 } },
  { name: "p12-ice-cave", from: 25, to: 26, aspect: 1.775 },
  { name: "p13-aurora", from: 27, to: 27, aspect: 1.773 },
  { name: "p14-summit", from: 28, to: 31, aspect: 1.773 },
  { name: "p15-night-sky", from: 32, to: 34, aspect: 1.772 },
  { name: "p16-dawn-clearing", from: 35, to: 35, aspect: 1.772, fg: { name: "p02-jungle-fg", places: [35], aspect: 1.773 } },
];

/** Chapters 5–12 (one stretch at a time, mounted as the camera nears it). */
export function Land({ rtRef, mobile, calm, night, k }: P & { k: number }) {
  const L = LAND_PLATES[k];
  const h = hold(L.from).pos;
  return (
    <group>
      <Backdrop rtRef={rtRef} name={L.name} mobile={mobile} from={L.from} to={L.to} radius={200} span={118} aspect={L.aspect} night={night} />
      {L.fg?.places.map((p) => (
        <FrameCard rtRef={rtRef} key={p} name={L.fg!.name} mobile={mobile} place={p} ahead={2.6} aspect={L.fg!.aspect} night={night} drop={0.05} />
      ))}
      <Mist box={{ min: [h.x - 30, h.y - 4, h.z - 90], max: [h.x + 30, h.y + 8, h.z + 10] }} count={mobile ? 8 : 18} size={[6, 16]} opacity={0.35} seed={k + 100} calm={calm} night={night} />
    </group>
  );
}

"use client";

import type { Runtime } from "../../journey";
import { LAST } from "../../route";
import { Mist } from "../Atmos";
import { Backdrop, FrameCard } from "../Backdrop";
import { hold } from "../kit";

type P = { rtRef: { current: Runtime }; mobile: boolean; calm: boolean; night: boolean; id: string };

/** Each company land's plates (interim, until its splat world w13–w17 arrives) and its ground. */
const LAND: Record<string, { plates: { name: string; aspect: number; share: number }[]; fg?: string; ground: string; mist: string }> = {
  aurelius: { plates: [{ name: "p05-desert-canyon", aspect: 1.775, share: 1 }], fg: "p06-desert-fg", ground: "#3A2A22", mist: "#C9B3D8" },
  "golden-guardian-productions": { plates: [{ name: "p07-cave", aspect: 1.776, share: 1 }], ground: "#1A0812", mist: "#E28AB6" },
  valora: { plates: [{ name: "p08-coast", aspect: 1.775, share: 0.6 }, { name: "p09-reef", aspect: 1.775, share: 0.4 }], ground: "#1E4A50", mist: "#FFD2B8" },
  asraya: { plates: [{ name: "p10-jade-lake", aspect: 1.773, share: 1 }], fg: "p11-bamboo-fg", ground: "#24402E", mist: "#EAF4EA" },
  "rudra-yugen": { plates: [{ name: "p12-ice-cave", aspect: 1.775, share: 0.6 }, { name: "p13-aurora", aspect: 1.773, share: 0.4 }], ground: "#BFE6F0", mist: "#CFF4FF" },
};

/** A company page's land: its plates as panoramas along the route, mist banks, the ground, and framing foreground. */
export function Company({ rtRef, mobile, calm, night, id }: P) {
  const L = LAND[id];
  if (!L) return null;
  let from = 0;
  const first = hold(0).pos, last = hold(LAST).pos;
  return (
    <group>
      {L.plates.map((p) => {
        const to = Math.min(LAST, Math.round(from + p.share * LAST));
        const el = <Backdrop key={p.name} rtRef={rtRef} name={p.name} mobile={mobile} from={from} to={to} radius={220} span={120} aspect={p.aspect} night={night} />;
        from = to;
        return el;
      })}
      {L.fg && Array.from({ length: LAST + 1 }, (_, i) => i).filter((i) => i % 2 === 1).map((i) => (
        <FrameCard key={i} rtRef={rtRef} name={L.fg!} mobile={mobile} place={i} ahead={2.6} aspect={1.77} night={night} drop={0.05} />
      ))}
      <Mist box={{ min: [first.x - 40, first.y - 2, last.z - 40], max: [first.x + 40, first.y + 10, first.z + 10] }} count={mobile ? 10 : 24} size={[6, 16]} color={L.mist} opacity={0.3} seed={7} calm={calm} night={night} />
    </group>
  );
}

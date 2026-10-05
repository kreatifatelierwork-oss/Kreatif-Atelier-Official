// Route-independent proof of the locked navigation feel. Loads the real engine (components/experience/journey.ts) and
// feeds it the same scripted inputs at fixed 60 Hz steps: wheel-like nudges, swipes, a pause and settle, jumps of
// 1/3/6 places, a Watch passage. Writes the s trace relative to the start place, so it stays comparable when the
// route's length, holds or camera change.  node scripts/research/engine-trace.mjs <out.json>  |  --compare a b
import { createJiti } from "../../node_modules/.pnpm/jiti@2.7.0/node_modules/jiti/lib/jiti.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../..", import.meta.url));
const a = process.argv.slice(2);
if (a[0] === "--compare") {
  const [p, q] = [JSON.parse(readFileSync(a[1])), JSON.parse(readFileSync(a[2]))];
  let worst = 0;
  for (const k of Object.keys(p.traces)) {
    const x = p.traces[k], y = q.traces[k];
    const n = Math.min(x.length, y.length);
    let m = x.length === y.length ? 0 : Infinity;
    for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(x[i] - y[i]));
    worst = Math.max(worst, m);
    console.log(`${k.padEnd(14)} frames ${x.length}/${y.length}  max |Δs| ${m.toExponential(2)}`);
  }
  console.log(worst < 1e-9 ? "IDENTICAL" : `DIFFERENT (max ${worst})`);
  process.exit(worst < 1e-9 ? 0 : 1);
}
const jiti = createJiti(import.meta.url, { alias: { "@": root } });
const J = await jiti.import(root + "components/experience/journey.ts");
const { experienceConfig: X } = await jiti.import(root + "lib/experience.ts");
const dt = 1 / 60, ms = 1000 / 60, START = 2;
const run = (script, frames, { watch = false } = {}) => {
  const rt = J.createRuntime(START);
  if (watch) { rt.mode = "watch"; rt.holdElapsed = 1e6; }
  const out = [];
  for (let f = 0; f < frames; f++) {
    const now = 10000 + f * ms;
    script(rt, f, now);
    J.advance(rt, now, dt, false, false);
    out.push(Math.round((rt.s - START) * 1e9) / 1e9);
  }
  return out;
};
const wheel = (dy) => dy / X.wheelPerPlace, touch = (dy) => dy / X.touchPerPlace;
const traces = {
  wheelPush: run((rt, f, now) => { if (f < 30 && f % 3 === 0) J.nudge(rt, wheel(100), now); }, 240),
  wheelBurst: run((rt, f, now) => { if (f < 40) J.nudge(rt, wheel(120), now); }, 360),
  wheelBack: run((rt, f, now) => { if (f < 20) J.nudge(rt, wheel(-80), now); }, 200),
  swipe: run((rt, f, now) => { if (f < 12) J.nudge(rt, touch(40), now); }, 220),
  jitter: run((rt, f, now) => { if (f < 60) J.nudge(rt, wheel(f % 2 ? 60 : -40), now); }, 220),
  jump1: run((rt, f, now) => { if (f === 0) J.jumpTo(rt, START + 1, now, false); }, 100),
  jump3: run((rt, f, now) => { if (f === 0) J.jumpTo(rt, START + 3, now, false); }, 100),
  jumpBack: run((rt, f, now) => { if (f === 0) J.jumpTo(rt, START - 2, now, false); }, 100),
  interrupt: run((rt, f, now) => { if (f === 0) J.jumpTo(rt, START + 3, now, false); if (f === 30) J.nudge(rt, wheel(-200), now); }, 200),
  watchTravel: run(() => {}, 420, { watch: true }),
  reducedCut: (() => { const rt = J.createRuntime(START); const o = []; for (let f = 0; f < 60; f++) { const now = 1e4 + f * ms; if (f < 10) J.nudge(rt, wheel(150), now); J.advance(rt, now, dt, true, false); o.push(rt.s - START); } return o; })(),
};
const feel = Object.fromEntries(["travelSeconds", "wheelPerPlace", "touchPerPlace", "follow", "maxPlacesPerSecond", "jumpSeconds", "snapAfterMs", "enterDolly", "parallax"].map((k) => [k, X[k]]));
writeFileSync(a[0], JSON.stringify({ feel, traces }));
console.log("feel", JSON.stringify(feel), "traces", Object.keys(traces).length);

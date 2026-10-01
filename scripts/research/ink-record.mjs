// Records a site doing the scripted ink strokes (scripts/research/ink-paths.mjs) as a continuous CDP screencast with
// per-frame timestamps, for frame-by-frame analysis. Uses the persistent GPU research Chrome (port 9555).
//   node scripts/research/ink-record.mjs <site: buttermax|ours> <outDir> [--url U] [--dpr 1] [--quality 85]
//     [--mobile] [--raf-hz 120] [--port 9555 (CDP port; 9556 = the uncapped-frame-rate Chrome for high-refresh checks)] [--only stroke,stroke] [--eval "js run in the page before recording, e.g. __filmInk.s.force = 0.06"]
// For ours, the page is opened with ?tune, which exposes the ink engine and the shared loop's frame timings.
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
import { schedule } from "./ink-paths.mjs";

const [site, out, ...rest] = process.argv.slice(2);
const opt = (n, d) => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : d; };
const url = opt("--url", site === "buttermax" ? "https://buttermax.net/" : "http://localhost:4174/film/?tune");
const only = opt("--only", null)?.split(",") ?? null;
const evalJs = opt("--eval", null);
// --shots 757,1100,1400: instead of a screencast (which stalls without vsync), take screenshots at these ms offsets
// from each stroke's start. Used for the uncapped-frame-rate check. --no-capture: timings only, no images.
// --ink-only: on /experience (or the home page), hide the world and the chrome so only the ink over the plain page
// colour is recorded (the background changes as the site is built; the ink must not).
const inkOnly = rest.includes("--ink-only");
const shots = rest.includes("--no-capture") ? [] : opt("--shots", null)?.split(",").map(Number) ?? null;
const dpr = Number(opt("--dpr", 1));
const quality = Number(opt("--quality", 85));
await mkdir(out, { recursive: true });

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${opt("--port", "9555")}`);
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
// --mobile: a 390 × 844 phone (DPR 3, touch), the strokes scaled into it and drawn with a finger (touch events),
// CPU throttled 4× as a rough stand-in for a phone. Paths are scaled from the 1440 × 900 suite.
const mobile = rest.includes("--mobile");
const VW = mobile ? 390 : 1440, VH = mobile ? 844 : 900;
const sx = VW / 1440, sy = VH / 900;
await cdp.send("Emulation.setDeviceMetricsOverride", { width: VW, height: VH, deviceScaleFactor: mobile ? 3 : dpr, mobile });
if (mobile) {
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// --raf-hz 120: on the uncapped Chrome (--port 9556), gate the page's requestAnimationFrame to this rate, which
// behaves like a 120 Hz display (the uncapped browser alone saturates the GPU at ~400 fps, which no display does).
const rafHz = Number(opt("--raf-hz", 0));
if (rafHz) {
  await page.addInitScript((hz) => {
    // Like a display: time is cut into 1/hz slots; a callback requested in one slot runs in the next one.
    const raf = window.requestAnimationFrame.bind(window);
    const slot = (t) => Math.floor(t / (1000 / hz));
    window.requestAnimationFrame = (cb) => {
      const s0 = slot(performance.now());
      const tick = (t) => (slot(t) > s0 ? cb(t) : raf(tick));
      return raf(tick);
    };
  }, rafHz);
}

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
if (site === "buttermax") await sleep(11000);
else {
  await sleep(2600);
  await page.getByRole("button", { name: /enter in silence/i }).click();
  await sleep(5500);
}
// Log what the page actually receives (pointer events and how many coalesced samples each carried).
await page.evaluate(() => {
  window.__pm = [];
  addEventListener("pointermove", (e) => window.__pm.push([performance.now() + performance.timeOrigin, e.clientX, e.clientY, e.getCoalescedEvents ? e.getCoalescedEvents().length : 1]), { capture: true, passive: true });
});
// Park the pointer at the first start point before recording.
if (inkOnly) await page.addStyleTag({ content: ".xp-world,.xp-topbar,.xp-actbar,.xp-captions{display:none!important}.xp-root{background:#F4F5F7!important}" });
const { events, marks, total } = schedule(1500, only);
if (evalJs) await page.evaluate(evalJs);
if (!mobile) await page.mouse.move(events[0].x, events[0].y);
await sleep(1500);

const frames = [];
let n = 0;
let t0 = 0;
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const i = n++;
  frames.push({ i, ts: metadata.timestamp * 1000 });
  cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  await writeFile(`${out}/f${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
});
if (!shots) await cdp.send("Page.startScreencast", { format: "jpeg", quality, everyNthFrame: 1, maxWidth: VW, maxHeight: VH });
await sleep(300);
const loopN0 = site === "ours" ? await page.evaluate(() => window.__filmLoop?.n ?? 0) : 0;
t0 = Date.now();
const lag = [];
const shotTimes = shots ? marks.flatMap((m) => shots.map((o) => m.start + o)).sort((a, b) => a - b) : [];
const shotJobs = [];
let si = 0;
for (const e of events) {
  const wait = e.t - (Date.now() - t0);
  if (wait > 1) await sleep(wait);
  lag.push(Date.now() - t0 - e.t);
  while (si < shotTimes.length && shotTimes[si] <= Date.now() - t0) {
    const at = Date.now() - t0, k = n++;
    si++;
    shotJobs.push(cdp.send("Page.captureScreenshot", { format: "jpeg", quality }).then(({ data }) => {
      frames.push({ i: k, ts: at + t0 });
      return writeFile(`${out}/f${String(k).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
    }));
  }
  // Fire-and-forget, like a real mouse: the browser queues and coalesces them per frame. Awaiting each one would
  // throttle the path to the renderer's ack rate and stretch the timing.
  if (mobile) {
    const k = events.indexOf(e), nx = events[k + 1];
    const pt = [{ x: e.x * sx, y: e.y * sy, id: 1 }];
    cdp.send("Input.dispatchTouchEvent", { type: e.jump ? "touchStart" : "touchMove", touchPoints: pt }).catch(() => {});
    if (!nx || nx.jump) cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }).catch(() => {});
  } else cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: e.x, y: e.y, button: "none", pointerType: "mouse" }).catch(() => {});
}
while (si < shotTimes.length) {
  const wait = shotTimes[si] - (Date.now() - t0);
  if (wait > 1) await sleep(wait);
  const at = Date.now() - t0, k = n++;
  si++;
  shotJobs.push(cdp.send("Page.captureScreenshot", { format: "jpeg", quality }).then(({ data }) => {
    frames.push({ i: k, ts: at + t0 });
    return writeFile(`${out}/f${String(k).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
  }));
}
await Promise.all(shotJobs);
await sleep(Math.max(0, total - (Date.now() - t0)) + 500);
if (!shots) await cdp.send("Page.stopScreencast");
frames.sort((a, b) => a.i - b.i);
await sleep(500);
for (const f of frames) f.t = Math.round(f.ts - t0);
const received = await page.evaluate(() => window.__pm.splice(0));
for (const r of received) r[0] = Math.round((r[0] - t0) * 10) / 10;
// Frame timing on our side (the shared loop's rings), over the recording window.
const loop = site === "ours" ? await page.evaluate((n0) => {
  const L = window.__filmLoop; if (!L) return null;
  const k = Math.min(L.n - n0, L.interval.length);
  const iv = [], wk = [];
  for (let j = L.n - k; j < L.n; j++) { iv.push(L.interval[j % L.interval.length]); wk.push(L.work[j % L.work.length]); }
  const q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return Math.round(b[Math.floor((b.length - 1) * p)] * 10) / 10; };
  return { frames: k, interval: { p50: q(iv, 0.5), p99: q(iv, 0.99), max: q(iv, 1), over20: iv.filter((v) => v > 20).length }, work: { p50: q(wk, 0.5), p99: q(wk, 0.99), max: q(wk, 1) } };
}, loopN0) : null;
if (loop) console.log("loop", JSON.stringify(loop));
const afterJs = opt("--after", null);
if (afterJs) console.log("after", JSON.stringify(await page.evaluate(afterJs)));
const lagSorted = lag.slice().sort((a, b) => a - b);
await writeFile(`${out}/index.json`, JSON.stringify({ site, url, frames, marks, total, received, loop, dispatchLag: { p50: lagSorted[lag.length >> 1], p95: lagSorted[Math.floor(lag.length * 0.95)], max: lagSorted[lag.length - 1] } }, null, 1));
const span = frames.length ? frames.at(-1).t - frames[0].t : 0;
console.log(site, frames.length, "frames over", span, "ms", (frames.length / span * 1000).toFixed(1), "fps; dispatch lag p95", lagSorted[Math.floor(lag.length * 0.95)], "ms");
await page.close();
process.exit(0);

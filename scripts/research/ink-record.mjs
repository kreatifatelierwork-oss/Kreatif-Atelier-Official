// Records a site doing the scripted ink strokes (scripts/research/ink-paths.mjs) as a continuous CDP screencast with
// per-frame timestamps, for frame-by-frame analysis. Uses the persistent GPU research Chrome (port 9555).
//   node scripts/research/ink-record.mjs <site: buttermax|ours> <outDir> [--url U] [--dpr 1] [--quality 85]
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
import { schedule } from "./ink-paths.mjs";

const [site, out, ...rest] = process.argv.slice(2);
const opt = (n, d) => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : d; };
const url = opt("--url", site === "buttermax" ? "https://buttermax.net/" : "http://localhost:4174/film/");
const dpr = Number(opt("--dpr", 1));
const quality = Number(opt("--quality", 85));
await mkdir(out, { recursive: true });

const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: dpr, mobile: false });
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
const { events, marks, total } = schedule();
await page.mouse.move(events[0].x, events[0].y);
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
await cdp.send("Page.startScreencast", { format: "jpeg", quality, everyNthFrame: 1, maxWidth: 1440, maxHeight: 900 });
await sleep(300);
t0 = Date.now();
const lag = [];
for (const e of events) {
  const wait = e.t - (Date.now() - t0);
  if (wait > 1) await sleep(wait);
  lag.push(Date.now() - t0 - e.t);
  // Fire-and-forget, like a real mouse: the browser queues and coalesces them per frame. Awaiting each one would
  // throttle the path to the renderer's ack rate and stretch the timing.
  cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: e.x, y: e.y, button: "none", pointerType: "mouse" }).catch(() => {});
}
await sleep(Math.max(0, total - (Date.now() - t0)) + 500);
await cdp.send("Page.stopScreencast");
await sleep(500);
for (const f of frames) f.t = Math.round(f.ts - t0);
const received = await page.evaluate(() => window.__pm.splice(0));
for (const r of received) r[0] = Math.round((r[0] - t0) * 10) / 10;
const lagSorted = lag.slice().sort((a, b) => a - b);
await writeFile(`${out}/index.json`, JSON.stringify({ site, url, frames, marks, total, received, dispatchLag: { p50: lagSorted[lag.length >> 1], p95: lagSorted[Math.floor(lag.length * 0.95)], max: lagSorted[lag.length - 1] } }, null, 1));
const span = frames.at(-1).t - frames[0].t;
console.log(site, frames.length, "frames over", span, "ms", (frames.length / span * 1000).toFixed(1), "fps; dispatch lag p95", lagSorted[Math.floor(lag.length * 0.95)], "ms");
await page.close();
process.exit(0);

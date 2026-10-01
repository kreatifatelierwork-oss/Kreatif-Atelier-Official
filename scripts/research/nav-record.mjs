// Scripted full-route navigation recording, for proving the travel feel is unchanged between builds. Enters through
// the gate, then: arrow keys, a wheel push and pull, act-bar jumps, Watch, End and Home. Logs the route position s and
// the mode on every frame (via the ?tune hooks) plus the shared loop's frame times; optionally a screencast.
//   node scripts/research/nav-record.mjs <out.json> [--url http://localhost:4174/experience/] [--frames dir] [--w 1440 --h 900]
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const out = args[0];
const base = opt("--url", "http://localhost:4174/experience/");
const framesDir = opt("--frames", null);
const W = Number(opt("--w", 1440)), H = Number(opt("--h", 900));
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(`${base}?tune`, { waitUntil: "domcontentloaded" });
await sleep(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await sleep(5500);
await page.mouse.move(W / 2, H / 2);

if (framesDir) {
  await mkdir(framesDir, { recursive: true });
  let n = 0;
  cdp.on("Page.screencastFrame", async ({ data, sessionId }) => {
    const i = n++;
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
    await writeFile(`${framesDir}/f${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 60, everyNthFrame: 2, maxWidth: 960, maxHeight: 600 });
}

// Per-frame log of s and the mode, plus the loop's counter at the start.
const n0 = await page.evaluate(() => {
  window.__navLog = [];
  const tick = () => {
    const x = window.__xp;
    if (x) window.__navLog.push([performance.now(), Math.round(x.s * 10000) / 10000, x.mode === "watch" ? 1 : 0]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.__navT0 = performance.now();
  return window.__filmLoop?.n ?? 0;
});

const steps = [];
const mark = async (name) => steps.push([name, await page.evaluate(() => performance.now() - window.__navT0)]);
const key = async (k, wait) => { await mark(`key ${k}`); await page.keyboard.press(k); await sleep(wait); };
const wheel = async (dy, count, every) => {
  await mark(`wheel ${dy}×${count}`);
  for (let i = 0; i < count; i++) {
    cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: W / 2, y: H / 2, deltaX: 0, deltaY: dy }).catch(() => {});
    await sleep(every);
  }
};
const tick = async (i, wait) => {
  await mark(`tick ${i}`);
  await page.evaluate((i) => document.querySelectorAll(".xp-tick")[i]?.click(), i);
  await sleep(wait);
};

await key("ArrowDown", 2600);
await key("ArrowDown", 2600);
await key("ArrowDown", 2600);
await wheel(60, 40, 16);
await sleep(3000);
await wheel(-60, 20, 16);
await sleep(3000);
await tick(8, 2600);
await tick(0, 2600);
await key("l", 22000);
await key("k", 400);
await key("End", 2600);
await key("Home", 2600);
await mark("end");

if (framesDir) await cdp.send("Page.stopScreencast");
const log = await page.evaluate((t0) => window.__navLog.map(([t, s, w]) => [Math.round((t - t0) * 10) / 10, s, w]), await page.evaluate(() => window.__navT0));
const loop = await page.evaluate((n0) => {
  const L = window.__filmLoop; if (!L) return null;
  const k = Math.min(L.n - n0, L.interval.length), iv = [], wk = [];
  for (let j = L.n - k; j < L.n; j++) { iv.push(L.interval[j % L.interval.length]); wk.push(L.work[j % L.work.length]); }
  const q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return Math.round(b[Math.floor((b.length - 1) * p)] * 10) / 10; };
  return { frames: k, interval: { p50: q(iv, 0.5), p99: q(iv, 0.99), max: q(iv, 1), over20: iv.filter((v) => v > 20).length }, work: { p50: q(wk, 0.5), p99: q(wk, 0.99), max: q(wk, 1) } };
}, n0);
await writeFile(out, JSON.stringify({ base, steps, log, loop }));
console.log(JSON.stringify({ frames: log.length, steps: steps.length, loop, end: log.at(-1) }));
await page.close();
process.exit(0);

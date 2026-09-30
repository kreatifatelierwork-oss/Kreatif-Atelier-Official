// Continuous screencast of a page via CDP (every compositor frame, with timestamps), optionally while a scripted
// sequence of pointer / touch / key actions runs. Frames + a JSON index land in <outDir>; stays local (gitignored).
//
//   node scripts/research/screencast.mjs <url> <outDir> [--mobile] [--seconds N] [--hard] [--actions file.json]
//                                        [--quality 70] [--width 1440 --height 900] [--reuse]
//
// --hard     : clear cache + cookies + storage for the origin first and disable the cache (a true cold load)
// --actions  : JSON array of steps, each [atMs, cmd, ...args] relative to navigation start:
//              ["move", x, y, durMs?, steps?]  ["path", [[x,y],...], durMs]  ["down"] ["up"] ["click", x, y]
//              ["wheel", dy]  ["leave"] ["enter", x, y]  ["tap", x, y]  ["swipe", x1,y1,x2,y2, durMs]
//              ["touchpath", [[x,y],...], durMs]  ["key", key]  ["mark", label]
// --reuse    : don't navigate; record the page already open at <url> (match by prefix)
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const url = args[0], out = args[1];
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const mobile = flag("--mobile");
const seconds = Number(opt("--seconds", 14));
const quality = Number(opt("--quality", 70));
const W = Number(opt("--width", mobile ? 390 : 1440)), H = Number(opt("--height", mobile ? 844 : 900));
const actions = opt("--actions") ? JSON.parse(readFileSync(opt("--actions"), "utf8")) : [];

await mkdir(out, { recursive: true });
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
let page = flag("--reuse") ? ctx.pages().find((p) => p.url().startsWith(url)) : null;
if (!page) page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: mobile ? 2 : 1, mobile });
await cdp.send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
if (mobile) {
  await cdp.send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    platform: "iPhone",
  });
}
await cdp.send("Network.enable");
if (flag("--hard")) {
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.clearBrowserCache");
  try { await cdp.send("Storage.clearDataForOrigin", { origin: new URL(url).origin, storageTypes: "all" }); } catch { /* ignore */ }
}

const frames = [];
const marks = [];
let t0 = 0;
let n = 0;
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const i = n++;
  const t = Math.round((metadata.timestamp * 1000) - t0);
  frames.push({ i, t });
  cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  await writeFile(`${out}/f${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const touch = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts.map(([x, y]) => ({ x, y })) });
let mx = W / 2, my = H / 2;
async function run(step) {
  const [, cmd, ...a] = step;
  switch (cmd) {
    case "move": {
      const [x, y, dur = 0, steps = Math.max(1, Math.round((a[2] ?? 0) / 16))] = a;
      for (let k = 1; k <= steps; k++) {
        const u = k / steps;
        await page.mouse.move(mx + (x - mx) * u, my + (y - my) * u);
        if (dur) await sleep(dur / steps);
      }
      mx = x; my = y; break;
    }
    case "path": {
      const [pts, dur] = a;
      const per = dur / pts.length;
      for (const [x, y] of pts) { await page.mouse.move(x, y); mx = x; my = y; await sleep(per); }
      break;
    }
    case "down": await page.mouse.down(); break;
    case "up": await page.mouse.up(); break;
    case "click": await page.mouse.click(a[0], a[1]); mx = a[0]; my = a[1]; break;
    case "wheel": await page.mouse.wheel(0, a[0]); break;
    case "leave": await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: -10, y: my }); break;
    case "enter": await page.mouse.move(a[0], a[1]); mx = a[0]; my = a[1]; break;
    case "tap": await touch("touchStart", [[a[0], a[1]]]); await sleep(60); await touch("touchEnd", []); break;
    case "swipe": {
      const [x1, y1, x2, y2, dur = 400] = a;
      const steps = Math.max(4, Math.round(dur / 16));
      await touch("touchStart", [[x1, y1]]);
      for (let k = 1; k <= steps; k++) { const u = k / steps; await touch("touchMove", [[x1 + (x2 - x1) * u, y1 + (y2 - y1) * u]]); await sleep(dur / steps); }
      await touch("touchEnd", []); break;
    }
    case "touchpath": {
      const [pts, dur] = a;
      await touch("touchStart", [pts[0]]);
      for (const p of pts.slice(1)) { await touch("touchMove", [p]); await sleep(dur / pts.length); }
      await touch("touchEnd", []); break;
    }
    case "key": await page.keyboard.press(a[0]); break;
    case "mark": break;
  }
}

await cdp.send("Page.startScreencast", { format: "jpeg", quality, everyNthFrame: 1, maxWidth: W, maxHeight: H });
const start = Date.now();
// Timestamps from the screencast are in seconds since epoch; anchor t0 to navigation start.
t0 = start;
if (!flag("--reuse")) page.goto(url, { waitUntil: "commit", timeout: 60000 }).catch(() => {});
for (const step of actions) {
  const wait = step[0] - (Date.now() - start);
  if (wait > 0) await sleep(wait);
  marks.push({ t: Date.now() - start, step: step.slice(1).map((v) => (Array.isArray(v) ? `[${v.length} pts]` : v)).join(" ") });
  try { await run(step); } catch (e) { marks.push({ t: Date.now() - start, error: String(e).slice(0, 120) }); }
}
const rest = seconds * 1000 - (Date.now() - start);
if (rest > 0) await sleep(rest);
await cdp.send("Page.stopScreencast");
await sleep(400);
await writeFile(`${out}/index.json`, JSON.stringify({ url, mobile, W, H, seconds, frames, marks }, null, 1));
const span = frames.length ? frames[frames.length - 1].t - frames[0].t : 0;
console.log(`${out}: ${frames.length} frames over ${span} ms (~${(frames.length / Math.max(1, span) * 1000).toFixed(1)} fps), first frame at ${frames[0]?.t} ms`);
if (!flag("--keep")) await page.close().catch(() => {});
process.exit(0);

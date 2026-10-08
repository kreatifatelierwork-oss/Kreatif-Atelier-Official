// Record a full scroll through a page as video (CDP screencast → MP4 via ffmpeg-static), plus a still every N frames.
//   node scripts/research/scroll-record.mjs <url> <out.mp4> [--mobile] [--back] [--wheel 120] [--every 60] [--max 120]
// --back scrolls to the end and records the way back too. Wheel on desktop, touch swipes on phones.
import { mkdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const a = process.argv.slice(2);
const opt = (n, d) => (a.includes(n) ? a[a.indexOf(n) + 1] : d);
const [url, out] = a;
const mobile = a.includes("--mobile");
const W = mobile ? 390 : 1440, H = mobile ? 844 : 810;
const WHEEL = Number(opt("--wheel", 120)), EVERY = Number(opt("--every", 60)), MAX = Number(opt("--max", 120)) * 1000;
const tmp = out.replace(/\.mp4$/, "-frames");
await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });
const b = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = b.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile });
if (mobile) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await page.goto(url + (url.includes("?") ? "&" : "?") + "tune", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await page.waitForTimeout(6000);
await page.mouse.move(W / 2, H / 2);
const frames = [];
let t0 = 0;
cdp.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
  cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  if (!t0) t0 = metadata.timestamp;
  const i = frames.length;
  frames.push(metadata.timestamp - t0);
  await writeFile(`${tmp}/f${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
const atEnd = () => page.evaluate(() => { const x = window.__xp; return !x || x.s >= (window.__last ?? 1e9) - 0.01; });
const last = await page.evaluate(() => document.querySelectorAll("section[data-place]").length - 1);
await page.evaluate((l) => { window.__last = l; }, last);
const start = Date.now();
const push = async (dir) => {
  if (mobile) {
    const y0 = dir > 0 ? H * 0.75 : H * 0.25, y1 = dir > 0 ? H * 0.35 : H * 0.65;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: W / 2, y: y0 }] });
    for (let k = 1; k <= 6; k++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: W / 2, y: y0 + ((y1 - y0) * k) / 6 }] }); await page.waitForTimeout(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else await page.mouse.wheel(0, dir * WHEEL);
  await page.waitForTimeout(EVERY);
};
while (Date.now() - start < MAX) {
  await push(1);
  if (await page.evaluate(() => window.__xp?.s ?? 0) >= last - 0.01) break;
}
await page.waitForTimeout(1500);
if (a.includes("--back")) {
  const s2 = Date.now();
  while (Date.now() - s2 < MAX) { await push(-1); if (await page.evaluate(() => window.__xp?.s ?? 0) <= 0.01) break; }
  await page.waitForTimeout(1500);
}
await cdp.send("Page.stopScreencast");
await page.waitForTimeout(500);
// Rebuild real timing from the frame timestamps (screencast frames arrive irregularly).
const list = frames.map((t, i) => `file 'f${String(i).padStart(5, "0")}.jpg'\nduration ${((frames[i + 1] ?? t + 0.033) - t).toFixed(4)}`).join("\n");
await writeFile(`${tmp}/list.txt`, list);
execFileSync("node_modules/ffmpeg-static/ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", `${tmp}/list.txt`, "-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", out]);
console.log(JSON.stringify({ out, frames: frames.length, seconds: +(frames.at(-1) ?? 0).toFixed(1), reached: await page.evaluate(() => window.__xp?.s) }));
await page.close();
process.exit(0);

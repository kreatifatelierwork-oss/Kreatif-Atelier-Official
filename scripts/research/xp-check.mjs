// Checks /experience: enters through the gate, travels the route with the keyboard, opens the Index and a room, and
// screenshots each step. Also collects console errors and the shared loop's frame timings.
//   node scripts/research/xp-check.mjs [outDir] [--w 1440 --h 900] [--dark] [--touch] [--reduced] [--places 0,1,2]
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const out = args[0] && !args[0].startsWith("--") ? args[0] : "docs/research/xp-check";
const W = Number(opt("--w", 1440)), H = Number(opt("--h", 900));
const dark = args.includes("--dark"), touch = args.includes("--touch"), reduced = args.includes("--reduced");
const places = opt("--places", "0,1,2").split(",").map(Number);
await mkdir(out, { recursive: true });
const tag = `${W}${dark ? "-dark" : ""}${reduced ? "-reduced" : ""}`;
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: touch ? 3 : 1, mobile: touch });
if (touch) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(`http://localhost:4174/experience/?tune${dark ? "&theme=dark" : ""}`, { waitUntil: "domcontentloaded" });
await sleep(2600);
await page.screenshot({ path: `${out}/${tag}-gate.png` });
await page.getByRole("button", { name: /enter in silence/i }).click();
await sleep(5200);
const n0 = await page.evaluate(() => window.__filmLoop?.n ?? 0);
for (const p of places) {
  await page.evaluate((p) => { const b = document.querySelectorAll(".xp-tick")[p]; b?.click(); }, p);
  await sleep(2200);
  await page.mouse.move(W * 0.3, H * 0.5);
  await page.screenshot({ path: `${out}/${tag}-place${p}.png` });
}
// Enter the first room in the current place, then come back.
const entered = await page.evaluate(() => { const b = document.querySelector(".xp-caption[data-active] .xp-enter"); b?.click(); return !!b; });
if (entered) { await sleep(1200); await page.screenshot({ path: `${out}/${tag}-room.png` }); await page.keyboard.press("Escape"); await sleep(600); }
await page.getByRole("button", { name: /^index$/i }).click();
await sleep(500);
await page.screenshot({ path: `${out}/${tag}-index.png` });
await page.keyboard.press("Escape");
const loop = await page.evaluate((n0) => {
  const L = window.__filmLoop; if (!L) return null;
  const k = Math.min(L.n - n0, L.interval.length), iv = [], wk = [];
  for (let j = L.n - k; j < L.n; j++) { iv.push(L.interval[j % L.interval.length]); wk.push(L.work[j % L.work.length]); }
  const q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return Math.round(b[Math.floor((b.length - 1) * p)] * 10) / 10; };
  return { frames: k, interval: { p50: q(iv, 0.5), p99: q(iv, 0.99), max: q(iv, 1), over20: iv.filter((v) => v > 20).length }, work: { p50: q(wk, 0.5), p99: q(wk, 0.99), max: q(wk, 1) } };
}, n0);
console.log(JSON.stringify({ tag, entered, hash: await page.evaluate(() => location.hash), loop, errors: errors.slice(0, 8) }));
await page.close();
process.exit(0);

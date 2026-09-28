// Captures every concept prototype's opening screen and carousel screen, in both headline styles,
// at 1440 and 390 (+ a reduced-motion pass). Uses the persistent research Chrome on port 9555.
//   node scripts/research/capture-concepts.mjs <baseUrl> <outDir>
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const [base = "http://localhost:4174", out = "docs/concepts/shots/v2"] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = ctx.pages().find((p) => p.url().includes("/concepts")) ?? (await ctx.newPage());
const cdp = await ctx.newCDPSession(page);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (name) => {
  const s = await cdp.send("Page.captureScreenshot", { format: "png" });
  await writeFile(`${out}/${name}.png`, Buffer.from(s.data, "base64"));
};
const center = (re, attr) => page.evaluate(([src, attr]) => {
  const re = new RegExp(src, "i");
  const el = [...document.querySelectorAll("button")].find((e) => re.test(attr ? e.getAttribute(attr) ?? "" : e.innerText) && e.getBoundingClientRect().width > 0);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, [re.source, attr]);
const touch = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
async function press(p, mobile, holdMs = 80) {
  if (!p) return;
  if (mobile) { await touch("touchStart", [p]); await sleep(holdMs); await touch("touchEnd", []); }
  else { await page.mouse.move(p.x, p.y); await page.mouse.down(); await sleep(holdMs); await page.mouse.up(); }
}
async function wheel(dy, times, mobile) {
  for (let i = 0; i < times; i++) {
    if (mobile) { await touch("touchStart", [{ x: 195, y: 620 }]); for (let k = 1; k <= 8; k++) { await touch("touchMove", [{ x: 195, y: 620 - (dy / 2) * (k / 8) }]); await sleep(12); } await touch("touchEnd", []); }
    else { await page.mouse.move(720, 450); await page.mouse.wheel(0, dy); }
    await sleep(80);
  }
}

async function run({ width, height, mobile, reduced, tag }) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 3 : 1, mobile });
  await cdp.send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  for (const type of reduced ? ["serif"] : ["serif", "sans"]) {
    // 1 · Orrery: hero, then The Houses.
    await page.goto(`${base}/concepts/?concept=1&type=${type}`); await sleep(5200);
    await shot(`${tag}-c1-${type}-01-hero`);
    await press(await center(/^the houses$/), mobile); await sleep(1500);
    await shot(`${tag}-c1-${type}-02-houses`);
    // 2 · Production: title card, then The Crew.
    await page.goto(`${base}/concepts/?concept=2&type=${type}`); await sleep(4600);
    await press(await center(/roll film/), mobile); await sleep(reduced ? 600 : 2600);
    await shot(`${tag}-c2-${type}-01-titles`);
    await sleep(3200);
    await press(await center(/^the crew$/), mobile); await sleep(1500);
    await shot(`${tag}-c2-${type}-02-crew`);
    // 3 · Golden Thread: hold, draw a little, engrave; then Six pillars.
    await page.goto(`${base}/concepts/?concept=3&type=${type}`); await sleep(3800);
    await press(await center(/thread/, "aria-label"), mobile, reduced ? 80 : 1800); await sleep(500);
    if (!mobile) { for (const [x, y] of [[520, 300], [900, 250], [1150, 520], [860, 700], [420, 640]]) await page.mouse.move(x, y, { steps: 16 }); }
    await wheel(260, 9, mobile); await sleep(1800);
    await shot(`${tag}-c3-${type}-01-engraved`);
    await press(await center(/^six pillars$/), mobile); await sleep(1500);
    await shot(`${tag}-c3-${type}-02-pillars`);
  }
}

await run({ width: 1440, height: 900, mobile: false, reduced: false, tag: "d" });
await run({ width: 390, height: 844, mobile: true, reduced: false, tag: "m" });
await run({ width: 1440, height: 900, mobile: false, reduced: true, tag: "rm" });
console.log("captured to", out);
process.exit(0);

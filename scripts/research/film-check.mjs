// Visual check of /film after the ink rebuild: both palettes at 1440 with a stroke over the page and the Idea,
// 390 touch, and reduced motion. Screenshots to docs/research/buttermax/film-check/ (gitignored).
//   node scripts/research/film-check.mjs
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const out = "docs/research/buttermax/film-check";
await mkdir(out, { recursive: true });
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function shot(name, { w, h, palette = "a", reduced = false, touch = false }) {
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: touch ? 3 : 1, mobile: touch });
  if (touch) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  await page.goto(`http://localhost:4174/film/?palette=${palette}`, { waitUntil: "domcontentloaded" });
  await sleep(2600);
  await page.getByRole("button", { name: /enter in silence/i }).click();
  await sleep(5200);
  // A stroke from the empty left side, through the headline and across the Idea.
  const pts = Array.from({ length: 60 }, (_, i) => ({ x: w * (0.08 + 0.6 * (i / 59)), y: h * (0.62 - 0.35 * Math.sin((i / 59) * Math.PI)) }));
  if (touch) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...pts[0], id: 1 }] });
    for (const p of pts) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...p, id: 1 }] }); await sleep(8); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.mouse.move(pts[0].x, pts[0].y);
    for (const p of pts) { await page.mouse.move(p.x, p.y); await sleep(8); }
  }
  await sleep(120);
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.close();
}
await shot("1440-a", { w: 1440, h: 900 });
await shot("1440-b", { w: 1440, h: 900, palette: "b" });
await shot("390-a-touch", { w: 390, h: 844, touch: true });
await shot("1440-a-reduced", { w: 1440, h: 900, reduced: true });
console.log("ok");
process.exit(0);

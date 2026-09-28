// Captures Concept 4 (The Long Take): both palettes × 1440/390, plus reduced motion.
//   node scripts/research/capture-longtake.mjs <baseUrl> <outDir>
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const [base = "http://localhost:4174", out = "docs/concepts/shots/v4"] = process.argv.slice(2);
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
const click = (re, scope = "") => page.evaluate(([src, scope]) => {
  const re = new RegExp(src, "i");
  const el = [...document.querySelectorAll(`${scope} button`)].find((e) => re.test(e.innerText) || re.test(e.getAttribute("aria-label") ?? ""));
  if (!el) return false;
  el.click();
  return true;
}, [re.source, scope]);
const touch = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
async function travel(mobile, reels = 1) {
  if (mobile) {
    for (let r = 0; r < reels; r++) {
      await touch("touchStart", [{ x: 195, y: 640 }]);
      for (let k = 1; k <= 14; k++) { await touch("touchMove", [{ x: 195, y: 640 - 700 * (k / 14) }]); await sleep(12); }
      await touch("touchEnd", []);
    }
  } else {
    await page.mouse.move(720, 450);
    for (let i = 0; i < 4 * reels; i++) { await page.mouse.wheel(0, 275); await sleep(50); }
  }
}

async function run({ palette, width, height, mobile, reduced, tag }) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 3 : 1, mobile });
  await cdp.send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  await page.goto(`${base}/concepts/?concept=4&palette=${palette}`);
  await sleep(3800); await shot(`${tag}-01-loader`);
  await click(/^▶\s*begin$/);
  if (!reduced) { await sleep(2200); await shot(`${tag}-02-opening`); await sleep(4200); } else await sleep(1200);
  await shot(`${tag}-03-core`);
  await travel(mobile); await sleep(reduced ? 900 : 480); await shot(`${tag}-04-travel`);
  await sleep(reduced ? 300 : 3000); await shot(`${tag}-05-aurelius`);
  if (!reduced && !mobile) { await page.mouse.move(720, 755); await page.mouse.down(); await sleep(1900); await page.mouse.up(); await sleep(500); await shot(`${tag}-06-raised`); }
  await travel(mobile); await sleep(reduced ? 900 : 520); await shot(`${tag}-07-travel`);
  await sleep(reduced ? 300 : 3000); await shot(`${tag}-08-valora`);
  await click(/^verticals$/); await sleep(800); await shot(`${tag}-09-menu`);
  await click(/golden guardian/, "[role=dialog]"); await sleep(reduced ? 900 : 700); await shot(`${tag}-10-jump`);
  await sleep(reduced ? 300 : 3200); await shot(`${tag}-11-ggp`);
  await click(/reel 06/); await sleep(reduced ? 1000 : 7500); await shot(`${tag}-12-finale`);
}

for (const palette of ["a", "b"]) {
  await run({ palette, width: 1440, height: 900, mobile: false, reduced: false, tag: `${palette}-d` });
  await run({ palette, width: 390, height: 844, mobile: true, reduced: false, tag: `${palette}-m` });
}
await run({ palette: "a", width: 1440, height: 900, mobile: false, reduced: true, tag: "a-rm" });
console.log("captured to", out);
process.exit(0);

// Finds what costs GPU time on the home page: holds at a place and measures the shared loop's frame interval with
// features switched off one at a time (?tune hooks).   node scripts/research/gpu-probe.mjs [place] [--w 1440 --h 900]
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const place = Number(args[0] ?? 2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const W = Number(opt("--w", 1440)), H = Number(opt("--h", 900));
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
await page.setViewportSize({ width: W, height: H });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto("http://localhost:4174/?tune", { waitUntil: "domcontentloaded" });
await sleep(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await sleep(6000);
await page.evaluate((p) => document.querySelectorAll(".xp-tick")[p]?.click(), place);
await sleep(3000);
const measure = async () => {
  const n0 = await page.evaluate(() => window.__filmLoop.n);
  await sleep(1500);
  return page.evaluate((n0) => {
    const L = window.__filmLoop, k = L.n - n0, iv = [];
    for (let j = L.n - k; j < L.n; j++) iv.push(L.interval[j % L.interval.length]);
    iv.sort((a, b) => a - b);
    return { frames: k, p50: iv[iv.length >> 1], max: iv.at(-1) };
  }, n0);
};
const info = await page.evaluate(() => { const s = window.__r3f(); return { dpr: s.gl.getPixelRatio(), size: [s.size.width, s.size.height], calls: s.gl.info.render.calls, tris: s.gl.info.render.triangles }; });
console.log("info", JSON.stringify(info));
console.log("baseline", JSON.stringify(await measure()));
const steps = args.includes("--scene") ? [
  ["scene hidden", "{const s=window.__r3f(); s.scene.visible=false}"],
  ["canvas 1x1", "{const s=window.__r3f(); s.setSize(1,1)}"],
] : args.includes("--dom") ? [
  ["no captions", "document.querySelector('.xp-captions').style.display='none'"],
  ["no grain", "document.querySelector('.grain').style.display='none'"],
  ["no chrome", "document.querySelector('.xp-actbar').style.display='none';document.querySelector('.xp-topbar').style.display='none'"],
  ["no stage canvas", "document.querySelector('.xp-stage').style.display='none'"],
] : [
  ["no ink canvas", "document.querySelector('.xp-ink').style.display='none'"],
  ["no shadows", "{const s=window.__r3f(); s.gl.shadowMap.enabled=false; s.scene.traverse(o=>{if(o.material){o.material.needsUpdate=true}})}"],
  ["dpr 1", "{const s=window.__r3f(); s.setDpr(1)}"],
  ["no environment", "{const s=window.__r3f(); s.scene.environment=null}"],
  ["no fog", "{const s=window.__r3f(); s.scene.fog=null}"],
];
for (const [name, js] of steps) {
  await page.evaluate(js);
  await sleep(400);
  console.log(name, JSON.stringify(await measure()));
}
await page.close();
process.exit(0);

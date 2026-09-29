// Captures the home page (The Long Take): every reel + each world's interaction, both palettes × 1440/390,
// plus reduced motion and the CSS fallback. Uses the persistent research Chrome on port 9555.
//   node scripts/research/capture-home.mjs <baseUrl> <outDir> [quick]
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const [base = "http://localhost:4174", out = "docs/concepts/shots/home", quick] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = ctx.pages().find((p) => p.url().startsWith(base)) ?? (await ctx.newPage());
const cdp = await ctx.newCDPSession(page);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
const shot = async (name) => {
  const s = await cdp.send("Page.captureScreenshot", { format: "png" });
  await writeFile(`${out}/${name}.png`, Buffer.from(s.data, "base64"));
};
const btn = (re) => page.evaluate((src) => {
  const re = new RegExp(src, "i");
  const el = [...document.querySelectorAll("button, a")].find((e) => re.test(e.textContent ?? "") && e.getBoundingClientRect().width > 0);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, re.source);
async function press(re, ms, mobile) {
  const p = await btn(re);
  if (!p) return false;
  if (mobile) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [p] });
    await sleep(ms);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else { await page.mouse.move(p.x, p.y); await page.mouse.down(); await sleep(ms); await page.mouse.up(); }
  return true;
}
const key = (k) => page.keyboard.press(k);

async function run({ palette, width, height, mobile, reduced = false, fallback = false, tag }) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 3 : 1, mobile });
  await cdp.send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  await page.goto(`${base}/?palette=${palette}${fallback ? "&fallback" : ""}`);
  await sleep(4200); await shot(`${tag}-00a-loader`);
  await press(/begin/, 60, mobile);
  // The stage mounts on Begin and compiles behind the white-out; wait until it has drawn.
  if (!fallback) {
    const t0 = Date.now();
    await sleep(500); if (!quick && !reduced) await shot(`${tag}-00w-whiteout`);
    await page.waitForFunction(() => !!document.querySelector("canvas") && !document.querySelector("[data-whiteout]"), null, { timeout: 30000 });
    console.log(tag, "stage ready after", Date.now() - t0, "ms");
  }
  if (!reduced && !fallback) { await sleep(2300); await shot(`${tag}-00b-opening`); await sleep(4300); } else await sleep(1400);
  await shot(`${tag}-00c-core`);
  const settle = reduced ? 900 : 3600;
  for (const k of [1, 2, 3, 4, 5]) {
    await key(String(k));
    if (k === 2 && !reduced) { await sleep(650); await shot(`${tag}-0${k}a-travel`); await sleep(settle - 650); } else await sleep(settle);
    await shot(`${tag}-0${k}b-world`);
    if (quick) continue;
    if (k === 1) await press(/hold to raise/, 1700, mobile);
    if (k === 2) for (let i = 0; i < 6; i++) { await press(/tap to bridge|bridged/, 60, mobile); await sleep(250); }
    if (k === 3) await press(/hold to roll/, 3600, mobile);
    if (k === 4) for (let i = 0; i < 6; i++) { await press(/tap to spark|lit/, 60, mobile); await sleep(250); }
    if (k === 5) {
      for (let i = 0; i < 3; i++) { await press(/hold to breathe|breathe/, 3500, mobile); await sleep(3300); }
    }
    await sleep(1400); await shot(`${tag}-0${k}c-played`);
  }
  await key("6"); await sleep(reduced ? 900 : 5200); await shot(`${tag}-06-ecosystem`);
  await key("7"); await sleep(reduced ? 900 : 4800); await shot(`${tag}-07-contact`);
  if (!quick) {
    await press(/meet the founders/, 60, mobile); await sleep(1200); await shot(`${tag}-08-founders`);
    await key("Escape"); await sleep(500);
    await press(/^verticals$/, 60, mobile); await sleep(1000); await shot(`${tag}-09-menu`);
    await key("Escape"); await sleep(400);
  }
}

const sets = [
  { palette: "a", width: 1440, height: 900, mobile: false, tag: "a-d" },
  { palette: "b", width: 1440, height: 900, mobile: false, tag: "b-d" },
  { palette: "a", width: 390, height: 844, mobile: true, tag: "a-m" },
  { palette: "b", width: 390, height: 844, mobile: true, tag: "b-m" },
  { palette: "a", width: 1440, height: 900, mobile: false, reduced: true, tag: "a-rm" },
  { palette: "a", width: 1440, height: 900, mobile: false, fallback: true, tag: "a-fb" },
];
const only = process.env.ONLY?.split(",");
for (const s of sets) if (!only || only.includes(s.tag)) await run(s);
console.log("captured to", out, "| page errors:", errors.length ? errors.slice(0, 8) : "none");
process.exit(0);

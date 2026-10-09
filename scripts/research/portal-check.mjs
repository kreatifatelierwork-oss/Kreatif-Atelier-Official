// Cross a portal on the home page and check the crossing: the portal canvas plays, the page changes on the same film
// canvas, the new film takes over. Saves a few frames.   node scripts/research/portal-check.mjs <outDir> [place=15] [label=Aurelius]
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const [out, place = "15", label = "Aurelius"] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const b = await chromium.connectOverCDP("http://127.0.0.1:9555"); const ctx = b.contexts()[0]; const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 810, deviceScaleFactor: 1, mobile: false });
const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:4174/?tune"); await p.waitForTimeout(2600);
await p.getByRole("button", { name: /enter in silence/i }).click();
await p.waitForFunction(() => document.querySelector(".xp-root.is-live"));
await p.evaluate((pl) => { const x = window.__xp; x.s = x.target = Number(pl); x.lastInput = -1e9; }, place);
await p.waitForTimeout(2500);
const film0 = await p.evaluate(() => { window.__c = document.querySelector(".xp-film-canvas"); return !!window.__c; });
await p.getByRole("link", { name: new RegExp(`enter ${label}`, "i") }).click();
const samples = [];
for (let k = 0; k < 10; k++) {
  await p.waitForTimeout(500);
  samples.push(await p.evaluate(() => ({ path: location.pathname, portal: document.querySelector(".xp-portal")?.hasAttribute("data-on"), s: +window.__xp.s.toFixed(2) })));
  await p.screenshot({ path: `${out}/x${k}.png` });
}
const end = await p.evaluate(() => ({ sameRoot: !!document.querySelector(".xp-root"), filmCanvas: !!document.querySelector(".xp-film-canvas"), h1: document.querySelector("h1")?.textContent, title: document.title }));
console.log(JSON.stringify({ film0, samples, end, errs: errs.slice(0, 5) }));
await p.close(); process.exit(0);

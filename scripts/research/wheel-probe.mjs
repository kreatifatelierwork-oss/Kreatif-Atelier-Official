// Time synthetic wheel input against the page's frame counter (debug: is input or rendering stalling?).
import { chromium } from "playwright-core";
const b = await chromium.connectOverCDP("http://127.0.0.1:9555"); const ctx = b.contexts()[0]; const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 810, deviceScaleFactor: 1, mobile: false });
await p.goto("http://localhost:4174/?tune"); await p.waitForTimeout(2600);
await p.getByRole("button", { name: /enter in silence/i }).click();
await p.waitForFunction(() => document.querySelector(".xp-root.is-live")); await p.waitForTimeout(1500);
await p.mouse.move(720, 405);
const rows = [];
for (const dir of [1, -1]) for (let k = 0; k < 60; k++) {
  const t0 = Date.now(), n0 = await p.evaluate(() => window.__filmLoop.n);
  const t1 = Date.now(); await p.mouse.wheel(0, dir * 120); const t2 = Date.now();
  await p.waitForTimeout(60);
  const [n1, s] = await p.evaluate(() => [window.__filmLoop.n, window.__xp.s]);
  rows.push({ dir, eval: t1 - t0, wheel: t2 - t1, total: Date.now() - t0, frames: n1 - n0, s: +s.toFixed(2) });
}
const q = (k, d) => rows.filter((r) => r.dir === d).map((r) => r[k]).sort((a, b) => a - b);
for (const d of [1, -1]) { const w = q("wheel", d), tot = q("total", d), f = q("frames", d); console.log(d > 0 ? "forward" : "back   ", "wheel ms p50/max", w[30], w.at(-1), "| step ms p50/max", tot[30], tot.at(-1), "| frames per step p50/min", f[30], f[0], "| s", rows.filter((r) => r.dir === d).at(-1).s); }
await p.close(); process.exit(0);

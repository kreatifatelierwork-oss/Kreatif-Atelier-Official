// Text dwell: scroll a site at a fixed pace and record, step by step, which text is on screen and readable (in the
// viewport, opacity > 0.6 along its ancestors, not clipped away). Gives each text's lifetime in wheel pixels, and
// sampled screenshots for the layering study.   node scripts/research/text-dwell.mjs <url> <outDir> [--steps 400]
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
const [url, out] = process.argv.slice(2);
const opt = (n, d) => (process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : d);
const STEPS = Number(opt("--steps", 400)), DY = 100, EVERY = 160;
await mkdir(out, { recursive: true });
const b = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = b.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(12000);
// Privacy: decline consent banners if any (never accept).
for (const t of [/reject all/i, /decline/i, /only necessary/i, /necessary only/i]) {
  const btn = page.getByRole("button", { name: t }).first();
  if (await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); break; }
}
await page.mouse.move(720, 450);
const seen = new Map(), log = [];
for (let i = 0; i < STEPS; i++) {
  const texts = await page.evaluate(() => {
    const W = innerWidth, H = innerHeight, out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.replace(/\s+/g, " ").trim();
      if (t.length < 3) continue;
      const el = n.parentElement;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
      let o = 1, e = el, hidden = false;
      while (e && e !== document.body) {
        const cs = getComputedStyle(e);
        if (cs.visibility === "hidden" || cs.display === "none") { hidden = true; break; }
        o *= Number(cs.opacity);
        e = e.parentElement;
      }
      if (hidden || o < 0.6) continue;
      out.push([t.slice(0, 80), Math.round(r.height), Math.round(r.top)]);
    }
    return out;
  });
  log.push(texts.map((t) => t[0]));
  for (const [t, h] of texts) {
    const s = seen.get(t) ?? { first: i, last: i, steps: 0, size: h };
    s.last = i; s.steps++; s.size = Math.max(s.size, h);
    seen.set(t, s);
  }
  if (i % 10 === 0) await page.screenshot({ path: `${out}/s-${String(i).padStart(3, "0")}.jpg`, quality: 60, type: "jpeg" });
  await page.mouse.wheel(0, DY);
  await page.waitForTimeout(EVERY);
}
const rows = [...seen.entries()].map(([t, s]) => ({ text: t, firstPx: s.first * DY, visiblePx: s.steps * DY, spanPx: (s.last - s.first + 1) * DY, maxLineHeight: s.size }));
const shown = log.map((l) => l.length);
await writeFile(`${out}/dwell.json`, JSON.stringify({ url, dy: DY, every: EVERY, steps: STEPS, rows, shown }, null, 1));
const big = rows.filter((r) => r.maxLineHeight >= 22);
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)] ?? 0; };
console.log(JSON.stringify({ texts: rows.length, headlines: big.length, medianVisiblePx: med(rows.map((r) => r.visiblePx)), medianHeadlineVisiblePx: med(big.map((r) => r.visiblePx)), stepsWithNoText: shown.filter((n) => n === 0).length }));
await page.close();
process.exit(0);

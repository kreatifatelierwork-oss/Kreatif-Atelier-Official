// Exercises every world's interaction and every room on the home page, screenshotting each result.
//   node scripts/research/xp-interact.mjs [outDir] [--w 1440 --h 900] [--dark] [--touch]
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const out = args[0] && !args[0].startsWith("--") ? args[0] : "docs/research/xp-interact";
const W = Number(opt("--w", 1440)), H = Number(opt("--h", 900));
const dark = args.includes("--dark"), touch = args.includes("--touch");
await mkdir(out, { recursive: true });
const tag = `${W}${dark ? "-dark" : ""}`;
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: touch ? 3 : 1, mobile: touch });
if (touch) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(`http://localhost:4174/?tune${dark ? "&theme=dark" : ""}`, { waitUntil: "domcontentloaded" });
await sleep(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await sleep(6000);
const shot = (name) => page.screenshot({ path: `${out}/${tag}-${name}.png` });
const go = async (hash) => { await page.evaluate((h) => { location.hash = h; }, hash); await sleep(2600); };
const btn = (sel) => page.locator(`.xp-caption[data-active] ${sel}`).first();
const hold = async (sel, ms) => {
  const b = btn(sel); const box = await b.boundingBox(); if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await sleep(ms); await page.mouse.up();
};
const press = async (sel, n = 1) => { for (let i = 0; i < n; i++) { await btn(sel).click(); await sleep(260); } };
const room = async (label, name) => { await page.locator(".xp-caption[data-active] .xp-door", { hasText: label }).first().click(); await sleep(1500); await shot(name); await page.keyboard.press("Escape"); await sleep(900); };

await go("#aurelius"); await page.mouse.move(W * 0.55, H * 0.5); await sleep(500); await shot("aurelius-lens");
await hold('[data-action="findTheAngle"]', 3200); await sleep(3500); await shot("aurelius-built");
await room("Our Services", "room-services");
await page.locator(".xp-caption[data-active] .xp-door", { hasText: "Our Services" }).first().click(); await sleep(1200);
await page.locator(".xp-service").first().click(); await sleep(1200); await shot("room-service"); await page.keyboard.press("Escape"); await sleep(900);
await room("Engagement Models", "room-formats");
await go("#ggp"); await hold('[data-action="roll"]', 2600); await shot("ggp-roll");
await go("#concourse"); await press('[data-action="launch"]', 2); await sleep(400); await shot("concourse-launch");
await room("How We Work", "room-process");
await go("#valora"); await press('[data-action="layAStone"]', 8); await sleep(1800); await shot("valora-stones");
await go("#asraya");
for (let i = 0; i < 3; i++) { await hold('[data-action="breathe"]', 2600); await sleep(2400); }
await shot("asraya-still");
await go("#rudra"); await press('[data-action="spark"]', 9); await sleep(2200); await shot("rudra-spark");
await go("#roof");
for (const [label, name] of [["Vision", "moment-vision"], ["Pillars", "moment-pillars"], ["Our ecosystem serves", "moment-serves"], ["Impact", "moment-impact"]]) await room(label, name);
await go("#gallery"); await page.locator(".xp-print").nth(2).hover(); await sleep(900); await shot("gallery-founder");
await room("Why Kreatif Atelier", "room-why");
await go("#founders"); await shot("link-founders");
await go("#pricing"); await sleep(1200); await shot("link-pricing");
console.log(JSON.stringify({ tag, errors: errors.slice(0, 10) }));
await page.close();
process.exit(0);

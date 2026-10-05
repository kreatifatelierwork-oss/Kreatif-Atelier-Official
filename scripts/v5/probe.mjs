// Evaluate JS in the live home page after entering (debug aid).  node scripts/v5/probe.mjs '<js>' [--place n]
import { chromium } from "playwright-core";
const a = process.argv.slice(2);
const place = a.includes("--place") ? Number(a[a.indexOf("--place") + 1]) : 0;
const b = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = b.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
page.on("console", (m) => ["error", "warning"].includes(m.type()) && console.log("[" + m.type() + "]", m.text().slice(0, 300)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 300)));
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 810, deviceScaleFactor: 1, mobile: false });
await page.goto("http://localhost:4174/?tune&" + (process.env.Q ?? ""), { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await page.waitForFunction(() => document.querySelector(".xp-root.is-live"), null, { timeout: 20000 });
await page.evaluate((p) => { const x = window.__xp; x.s = p; x.target = p; x.lastInput = -1e9; }, place);
await page.waitForTimeout(2500);
console.log(JSON.stringify(await page.evaluate(a[0]), null, 1));
if (a.includes("--shot")) { await page.waitForTimeout(400); await page.screenshot({ path: a[a.indexOf("--shot") + 1] }); }
await page.close();
process.exit(0);

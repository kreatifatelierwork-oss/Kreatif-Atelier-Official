// Screenshot places of the home journey at their holds (research Chrome on 9555, site on 4174).
//   node scripts/v5/shots.mjs <outDir> [--places 0,1,2] [--w 1440 --h 810] [--mobile] [--dark] [--reduced] [--still] [--wait 2500]
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const a = process.argv.slice(2);
const opt = (n, d) => (a.includes(n) ? a[a.indexOf(n) + 1] : d);
const out = a[0];
const mobile = a.includes("--mobile");
const W = Number(opt("--w", mobile ? 390 : 1440)), H = Number(opt("--h", mobile ? 844 : 810));
const places = opt("--places", "0,1,2,3,4,5,6,7,8,9,10,11,12").split(",").map(Number);
const wait = Number(opt("--wait", 2500));
await mkdir(out, { recursive: true });
const b = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = b.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: mobile ? 2 : 1, mobile });
if (mobile) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: a.includes("--reduced") ? "reduce" : "no-preference" }] });
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
const q = ["tune", a.includes("--dark") ? "theme=dark" : "", a.includes("--still") ? "still" : "", opt("--q", "")].filter(Boolean).join("&");
await page.goto(`http://localhost:4174${opt("--path", "/")}?${q}`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await page.waitForFunction(() => document.querySelector(".xp-root.is-live"), null, { timeout: 20000 });
await page.mouse.move(W / 2, H / 2);
for (const p of places) {
  await page.evaluate((p) => { const x = window.__xp; if (x) { x.move = null; x.s = p; x.target = p; x.mode = "direct"; x.lastInput = -1e9; } else location.hash = String(p); }, p);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/p${String(p).padStart(2, "0")}.png` });
}
console.log(JSON.stringify({ shots: places.length, errors: errs.slice(0, 8) }));
await page.close();
process.exit(0);

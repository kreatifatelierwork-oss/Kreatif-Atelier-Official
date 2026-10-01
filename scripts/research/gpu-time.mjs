// GPU time per frame of the 3D stage (EXT_disjoint_timer_query_webgl2), at each place, plus the shared loop's script
// work. Independent of the display's refresh rate (useful when the machine caps frames, e.g. on battery).
//   node scripts/research/gpu-time.mjs [--w 1440 --h 900] [--mobile] [--dark]
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const mobile = args.includes("--mobile");
const W = Number(opt("--w", mobile ? 390 : 1440)), H = Number(opt("--h", mobile ? 844 : 900));
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: mobile ? 3 : 1, mobile });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(`http://localhost:4174/?tune${args.includes("--dark") ? "&theme=dark" : ""}`, { waitUntil: "domcontentloaded" });
await sleep(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await sleep(6500);
const ok = await page.evaluate(() => {
  const s = window.__r3f(); const gl = s.gl.getContext();
  const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");
  if (!ext) return false;
  // Wrap the renderer's render call in a timer query.
  const r = s.gl, orig = r.render.bind(r), q = [];
  window.__gpu = [];
  r.render = (scene, cam) => {
    const t = gl.createQuery(); gl.beginQuery(ext.TIME_ELAPSED_EXT, t); orig(scene, cam); gl.endQuery(ext.TIME_ELAPSED_EXT); q.push(t);
    for (let i = q.length - 1; i >= 0; i--) {
      if (gl.getQueryParameter(q[i], gl.QUERY_RESULT_AVAILABLE)) {
        if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) window.__gpu.push(gl.getQueryParameter(q[i], gl.QUERY_RESULT) / 1e6);
        gl.deleteQuery(q[i]); q.splice(i, 1);
      }
    }
  };
  return true;
});
console.log("timer query", ok ? "available" : "NOT available");
for (const p of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  await page.evaluate((p) => document.querySelectorAll(".xp-tick")[p]?.click(), p);
  await sleep(1800);
  await page.evaluate(() => { window.__gpu.length = 0; window.__w0 = window.__filmLoop.n; });
  await page.mouse.move(W * 0.4, H * 0.5);
  await sleep(1500);
  const r = await page.evaluate(() => {
    const g = window.__gpu.slice().sort((a, b) => a - b), L = window.__filmLoop, k = L.n - window.__w0, w = [];
    for (let j = L.n - k; j < L.n; j++) w.push(L.work[j % L.work.length]);
    w.sort((a, b) => a - b);
    const q = (a, p) => (a.length ? Math.round(a[Math.floor((a.length - 1) * p)] * 10) / 10 : null);
    return { gpu50: q(g, 0.5), gpu95: q(g, 0.95), work50: q(w, 0.5), work95: q(w, 0.95), calls: window.__r3f().gl.info.render.calls };
  });
  console.log("place", p, JSON.stringify(r));
}
await page.close();
process.exit(0);

// Frame-rate independence check for the film's ink. In the page (opened with ?tune), the same scripted pointer path
// is fed to a fresh brush and the real engine is stepped with synthetic frame clocks: 30, 60, 120, 144 Hz and a
// jittery clock (5–25 ms frames). The ink mask is read back at the same moments and compared with the 60 Hz run
// (intersection over union). Runs synchronously inside one task, so the page's own loop can't interleave.
//   node scripts/research/ink-hz.mjs [--port 9555]
import { chromium } from "playwright-core";
const port = process.argv.includes("--port") ? process.argv[process.argv.indexOf("--port") + 1] : "9555";
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://localhost:4174/film/?tune", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2600);
await page.getByRole("button", { name: /enter in silence/i }).click();
await page.waitForTimeout(5000);
const result = await page.evaluate(() => {
  const e = window.__filmInk, Brush = window.__filmBrush.constructor;
  const gl = e.gl, W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
  const buf = new Uint8Array(W * H * 4);
  const paths = {
    slow: (t) => [400 - 240 * Math.min(t / 757, 1), 700],
    flick: (t) => [400 - 240 * Math.min(t / 70, 1), 700],
    circle: (t) => { const a = Math.PI + Math.min(t / 900, 1) * Math.PI * 2; return [230 + Math.cos(a) * 100, 690 + Math.sin(a) * 100]; },
  };
  const at = [300, 757, 1100, 1400];
  function run(path, clock) {
    const T0 = performance.now() + 1e5;
    const b = new Brush(e.s.tau ?? 28);
    for (const t of e.targets) e.wipe(t);
    e.running = false; e.seen = -Infinity; e.life = 0;
    // Samples arrive as they would from a 240 Hz pointer: only those up to the current frame are pushed.
    let st = 0;
    const feed = (now) => { for (; st <= 1500 && T0 + st <= now; st += 1000 / 240) { const [x, y] = path(st); b.push(x, y, T0 + st); } };
    const masks = [];
    let now = T0 - 20, k = 0, ai = 0;
    while (ai < at.length) {
      const next = now + clock(k++);
      // land exactly on the sample moments so every clock is compared at the same instants
      now = next >= T0 + at[ai] ? T0 + at[ai] : next;
      feed(now);
      e.update(now, b, "#F4F5F7", null);
      if (now === T0 + at[ai]) {
        gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        const m = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) m[i] = buf[i * 4] > 127 ? 1 : 0;
        masks.push(m);
        ai++;
      }
    }
    return masks;
  }
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const clocks = { "30": () => 1000 / 30, "60": () => 1000 / 60, "120": () => 1000 / 120, "144": () => 1000 / 144, jitter: () => 5 + rnd() * 20 };
  const out = {};
  for (const [name, path] of Object.entries(paths)) {
    const ref = run(path, clocks["60"]);
    out[name] = { area60: ref.map((m) => m.reduce((a, v) => a + v, 0)) };
    for (const [c, clock] of Object.entries(clocks)) {
      if (c === "60") continue;
      const m = run(path, clock);
      out[name][c] = m.map((mm, i) => {
        let inter = 0, uni = 0;
        for (let j = 0; j < mm.length; j++) { const a = ref[i][j], bb = mm[j]; inter += a & bb; uni += a | bb; }
        return uni ? Math.round((inter / uni) * 1000) / 1000 : 1;
      });
    }
  }
  for (const t of e.targets) e.wipe(t);
  e.running = false; e.clear();
  return { at, iou: out };
});
console.log(JSON.stringify(result, null, 1));
await page.close();
process.exit(0);

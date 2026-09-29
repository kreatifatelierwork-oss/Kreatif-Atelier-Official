// Survey many 3D sites quickly: for each URL, load it with WebGL on, try its "enter" gate, wiggle the cursor,
// scroll through it in steps and record screenshots plus facts (assets by type, audio use, custom cursor, canvases).
//   node scripts/research/survey.mjs <outDir> <slug=url> [slug=url ...]
// Uses the persistent research Chrome on port 9555. Screenshots stay local (gitignored).
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const [out, ...targets] = process.argv.slice(2);
const steps = Number(process.env.STEPS ?? 12);
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const probe = () => {
  // Installed before any page script: count audio use and pointer listeners.
  const w = window;
  w.__probe = { audioCtx: 0, mediaPlay: 0, pointerListeners: 0 };
  const AC = w.AudioContext || w.webkitAudioContext;
  if (AC) {
    const Wrapped = function (...a) { w.__probe.audioCtx++; return new AC(...a); };
    Wrapped.prototype = AC.prototype;
    w.AudioContext = Wrapped;
  }
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (...a) { w.__probe.mediaPlay++; return play.apply(this, a); };
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, ...rest) {
    if (/^(pointermove|mousemove)$/.test(type)) w.__probe.pointerListeners++;
    return add.call(this, type, ...rest);
  };
};

for (const t of targets) {
  const i = t.indexOf("=");
  const slug = t.slice(0, i), url = t.slice(i + 1);
  const dir = `${out}/${slug}`;
  await mkdir(dir, { recursive: true });
  const page = await ctx.newPage();
  await page.addInitScript(probe);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const shot = async (name) => {
    try {
      const s = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 70 });
      await writeFile(`${dir}/${name}.jpg`, Buffer.from(s.data, "base64"));
    } catch { /* page busy */ }
  };
  const info = { slug, url, errors: [] };
  page.on("pageerror", (e) => info.errors.push(String(e).slice(0, 160)));
  const t0 = Date.now();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) { info.errors.push("goto: " + String(e).slice(0, 120)); }
  await sleep(3000); await shot("00-3s");
  await sleep(6000); await shot("01-9s");
  // Try an entry gate (enter / start / explore / sound on / accept cookies-free "continue").
  const gate = await page.evaluate(() => {
    const re = /^(enter|start|begin|explore|discover|play|continue|let'?s go|sound on|with sound|enter with sound|experience|launch)\b/i;
    const el = [...document.querySelectorAll("button, a, [role=button], div, span")]
      .filter((e) => e.children.length < 3 && (e.textContent ?? "").trim().length < 32 && re.test((e.textContent ?? "").trim()) && e.getBoundingClientRect().width > 0)
      .sort((a, b) => a.textContent.length - b.textContent.length)[0];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { text: el.textContent.trim().slice(0, 40), x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }).catch(() => null);
  info.gate = gate?.text ?? null;
  if (gate) { await page.mouse.click(gate.x, gate.y).catch(() => {}); await sleep(4500); await shot("02-after-gate"); }
  // Cursor: sweep across the screen and look for a custom cursor.
  for (let k = 0; k <= 24; k++) await page.mouse.move(720 + Math.cos(k / 4) * 420, 450 + Math.sin(k / 4) * 260, { steps: 3 }).catch(() => {});
  await page.mouse.move(1000, 300, { steps: 8 }).catch(() => {});
  await sleep(600); await shot("03-cursor");
  // Scroll through in steps.
  for (let s = 0; s < steps; s++) {
    await page.mouse.move(720, 450).catch(() => {});
    for (let k = 0; k < 4; k++) { await page.mouse.wheel(0, 240).catch(() => {}); await sleep(90); }
    await sleep(1700);
    await shot(`1${String(s).padStart(2, "0")}-scroll`);
  }
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
  Object.assign(info, await withTimeout(page.evaluate(() => {
    const res = performance.getEntriesByType("resource");
    const kinds = {};
    let bytes = 0;
    for (const r of res) {
      const ext = (r.name.split("?")[0].match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? "other").toLowerCase();
      const k = /^(glb|gltf|drc|bin)$/.test(ext) ? "3d-model" : /^(ktx2|basis|hdr|exr)$/.test(ext) ? "3d-texture"
        : /^(mp3|ogg|wav|m4a|aac|opus|webm)$/.test(ext) && /audio|sound|sfx|music|\.mp3|\.ogg|\.wav|\.m4a/.test(r.name) ? "audio"
        : /^(mp4|webm|m3u8|mov)$/.test(ext) ? "video" : /^(png|jpe?g|webp|avif|gif|svg)$/.test(ext) ? "image"
        : /^(js|mjs)$/.test(ext) ? "js" : /^(woff2?|ttf|otf)$/.test(ext) ? "font" : ext;
      kinds[k] = (kinds[k] ?? 0) + 1;
      bytes += r.transferSize || r.encodedBodySize || 0;
    }
    const canvases = [...document.querySelectorAll("canvas")].filter((c) => c.width > 200);
    let renderer = null;
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null;
    } catch { /* ignore */ }
    const cursorNone = [document.documentElement, document.body, document.elementFromPoint(720, 450)]
      .some((e) => e && getComputedStyle(e).cursor === "none");
    return {
      title: document.title,
      docHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
      canvases: canvases.length,
      webgpu: "gpu" in navigator,
      renderer,
      cursorNone,
      probe: window.__probe,
      resources: kinds,
      transferMB: +(bytes / 1048576).toFixed(1),
      audioFiles: res.map((r) => r.name).filter((n) => /\.(mp3|ogg|wav|m4a|aac|opus)(\?|$)/i.test(n)).slice(0, 12),
      models: res.map((r) => r.name).filter((n) => /\.(glb|gltf|drc|ktx2|hdr|exr)(\?|$)/i.test(n)).slice(0, 12),
      libs: [
        window.THREE && "THREE global", window.gsap && "gsap", window.Lenis && "Lenis", window.PIXI && "PIXI",
        window.__NEXT_DATA__ && "Next.js", window.__NUXT__ && "Nuxt", document.querySelector("[data-scroll-container]") && "locomotive",
      ].filter(Boolean),
      text: document.body.innerText.replace(/\s+/g, " ").slice(0, 1800),
    };
  }), 20000).catch((e) => ({ evalError: String(e).slice(0, 160) })));
  info.seconds = Math.round((Date.now() - t0) / 1000);
  await writeFile(`${dir}/info.json`, JSON.stringify(info, null, 2));
  console.log(slug, "|", info.title, "| gate:", info.gate, "| canvases:", info.canvases, "| audio:", JSON.stringify(info.probe), "| cursor none:", info.cursorNone, "|", info.transferMB, "MB");
  await withTimeout(page.close(), 10000).catch(() => {});
}
process.exit(0);

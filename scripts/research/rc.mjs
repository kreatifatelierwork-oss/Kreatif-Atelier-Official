// Research control: drive a persistent headless Chrome (started with --remote-debugging-port)
// step by step across commands, so a site can be explored interactively.
//
//   node scripts/research/rc.mjs <tabMatch> '<json steps>'
//
// Steps (array of arrays):
//   ["open", url]                       navigate (creates the tab if none matches)
//   ["mobile"] | ["desktop", w, h]      emulate a 390×844 touch phone (this invocation only) / set viewport
//   ["reduced"]                         emulate prefers-reduced-motion: reduce (this invocation only)
//   ["wait", ms]
//   ["shot", file, fullPage?]           PNG screenshot
//   ["wheel", dy, times?, gapMs?]       mouse-wheel scrolling at the viewport centre
//   ["scrollTo", y]                     window.scrollTo
//   ["move", x, y, steps?]              pointer move
//   ["click", x, y]
//   ["hold", x, y, ms]                  press, hold, release
//   ["drag", x1, y1, x2, y2, ms?]
//   ["tap", x, y] | ["swipe", x1, y1, x2, y2, ms?]   touch (use with "mobile")
//   ["key", key] | ["type", text]
//   ["eval", js]                        prints the JSON result
//   ["text", maxChars?]                 prints visible text
//   ["resources", file]                 writes performance resource entries (url, type, size, duration) as JSON
//   ["info"]                            prints url, title, scroll position, doc height, viewport, WebGL renderer
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const [match = "", stepsJson = "[]"] = process.argv.slice(2);
const steps = JSON.parse(stepsJson);
const port = process.env.RC_PORT ?? "9555";

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
const context = browser.contexts()[0];
let page = context.pages().find((p) => match && p.url().includes(match));
if (!page) page = context.pages().find((p) => p.url() === "about:blank") ?? (await context.newPage());

const cdp = await context.newCDPSession(page);
let vw = page.viewportSize()?.width ?? 1440;
let vh = page.viewportSize()?.height ?? 900;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const touch = (type, points) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: points });

for (const [cmd, ...a] of steps) {
  try {
    switch (cmd) {
      case "mobile":
        vw = 390; vh = 844;
        await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
        await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
        await cdp.send("Emulation.setUserAgentOverride", {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
          platform: "iPhone",
        });
        break;
      case "reduced":
        await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
        break;
      case "desktop":
        vw = a[0] ?? 1440; vh = a[1] ?? 900;
        await cdp.send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: 1, mobile: false });
        break;
      case "open":
        await page.goto(a[0], { waitUntil: "domcontentloaded", timeout: 60000 });
        break;
      case "wait": await sleep(a[0]); break;
      case "shot": {
        const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !!a[1] });
        await writeFile(a[0], Buffer.from(shot.data, "base64"));
        console.log("shot", a[0]);
        break;
      }
      case "wheel": {
        const [dy, times = 1, gap = 60] = a;
        await page.mouse.move(vw / 2, vh / 2);
        for (let i = 0; i < times; i++) { await page.mouse.wheel(0, dy); await sleep(gap); }
        break;
      }
      case "scrollTo": await page.evaluate((y) => window.scrollTo(0, y), a[0]); break;
      case "move": await page.mouse.move(a[0], a[1], { steps: a[2] ?? 12 }); break;
      case "click": await page.mouse.click(a[0], a[1]); break;
      case "hold":
        await page.mouse.move(a[0], a[1]); await page.mouse.down(); await sleep(a[2]); await page.mouse.up();
        break;
      case "drag": {
        const [x1, y1, x2, y2, ms = 600] = a;
        await page.mouse.move(x1, y1); await page.mouse.down();
        const n = Math.max(8, Math.round(ms / 16));
        for (let i = 1; i <= n; i++) { await page.mouse.move(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n); await sleep(ms / n); }
        await page.mouse.up();
        break;
      }
      case "tap":
        await touch("touchStart", [{ x: a[0], y: a[1] }]); await sleep(60); await touch("touchEnd", []);
        break;
      case "swipe": {
        const [x1, y1, x2, y2, ms = 350] = a;
        await touch("touchStart", [{ x: x1, y: y1 }]);
        const n = Math.max(6, Math.round(ms / 16));
        for (let i = 1; i <= n; i++) { await touch("touchMove", [{ x: x1 + ((x2 - x1) * i) / n, y: y1 + ((y2 - y1) * i) / n }]); await sleep(ms / n); }
        await touch("touchEnd", []);
        break;
      }
      case "key": await page.keyboard.press(a[0]); break;
      case "type": await page.keyboard.type(a[0], { delay: 40 }); break;
      case "eval": console.log(JSON.stringify(await page.evaluate(a[0]), null, 1)?.slice(0, 6000)); break;
      case "text": console.log((await page.evaluate(() => document.body.innerText)).slice(0, a[0] ?? 4000)); break;
      case "resources": {
        const entries = await page.evaluate(() =>
          performance.getEntriesByType("resource").map((e) => ({
            url: e.name, type: e.initiatorType, kb: Math.round((e.transferSize || e.encodedBodySize || 0) / 1024), ms: Math.round(e.duration),
          })),
        );
        await writeFile(a[0], JSON.stringify(entries, null, 1));
        console.log("resources", entries.length, "->", a[0]);
        break;
      }
      case "info":
        console.log(JSON.stringify(await page.evaluate(() => {
          const gl = document.createElement("canvas").getContext("webgl2");
          const ext = gl?.getExtension("WEBGL_debug_renderer_info");
          return {
            url: location.href, title: document.title, scrollY: Math.round(scrollY),
            docH: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight,
            canvases: [...document.querySelectorAll("canvas")].map((c) => `${c.width}x${c.height}`),
            renderer: gl ? gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) : "none",
          };
        })));
        break;
      default: console.log("unknown step", cmd);
    }
  } catch (err) {
    console.log(`step ${cmd} failed:`, String(err).slice(0, 300));
  }
}
await cdp.detach().catch(() => {});
process.exit(0);

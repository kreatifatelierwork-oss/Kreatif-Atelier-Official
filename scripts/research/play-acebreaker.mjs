// Research only: plays Lacoste Ace Breaker in the persistent research Chrome.
// Watches a low-res screencast for the yellow ball and slides the racket (click & hold, real mouse
// input) under it, correcting for the court's perspective. Plays several rounds, pressing Retry.
//
//   node scripts/research/play-acebreaker.mjs <outDir> <seconds>
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
import sharp from "sharp";

const [outDir, seconds = "120"] = process.argv.slice(2);
const URL = "https://members-play.lacoste.com/ace-breaker-rg/gb/en/";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const context = browser.contexts()[0];
const page = context.pages().find((p) => p.url().includes("lacoste")) ?? (await context.newPage());
const cdp = await context.newCDPSession(page);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const { W, H } = await page.evaluate(() => ({ W: innerWidth, H: innerHeight }));

const shot = async (name) => {
  const s = await cdp.send("Page.captureScreenshot", { format: "png" });
  await writeFile(`${outDir}/${name}.png`, Buffer.from(s.data, "base64"));
};
const clickText = async (re) => {
  const box = await page.evaluate((src) => {
    const re = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button,a,[role=button]")].find((e) => re.test(e.innerText) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x < innerWidth);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, re.source);
  if (box) await page.mouse.click(box.x, box.y);
  return !!box;
};

// Racket row and perspective (measured from the in-game screenshots at 1440×813).
const RACKET_Y = H * 0.815;
const FAR_Y = H * 0.12;
const courtWidthAt = (y) => 0.36 * W + ((Math.min(y, RACKET_Y) - FAR_Y) / (RACKET_Y - FAR_Y)) * (0.26 * W);

let latest = null;
cdp.on("Page.screencastFrame", async ({ data, sessionId }) => {
  cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  const { data: px, info } = await sharp(Buffer.from(data, "base64")).raw().toBuffer({ resolveWithObject: true });
  let sx = 0, sy = 0, n = 0;
  for (let y = Math.floor(info.height * 0.14); y < info.height * 0.93; y++) {
    for (let x = Math.floor(info.width * 0.18); x < info.width * 0.82; x++) {
      const i = (y * info.width + x) * info.channels;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      if (r > 210 && g > 190 && b < 120 && r - b > 110) { sx += x; sy += y; n++; }
    }
  }
  latest = n >= 1 && n < 400 ? { x: (sx / n / info.width) * W, y: (sy / n / info.height) * H, t: Date.now() } : null;
});

await page.goto(URL, { waitUntil: "domcontentloaded" });
await sleep(9000);
await shot("d-010-title-again");
await clickText(/^play$/); await sleep(2500);
await clickText(/start game/); await sleep(800);
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 45, maxWidth: 480, maxHeight: 272, everyNthFrame: 1 });

const t0 = Date.now();
let x = W / 2, held = false, rounds = 0, lastShot = -99999, lastCheck = 0;
while (Date.now() - t0 < +seconds * 1000) {
  if (!held) { await page.mouse.move(x, RACKET_Y); await page.mouse.down(); held = true; }
  if (latest && Date.now() - latest.t < 200) {
    const scale = courtWidthAt(RACKET_Y) / courtWidthAt(latest.y);
    const target = W / 2 + (latest.x - W / 2) * scale;
    x += (target - x) * 0.9;
    await page.mouse.move(x, RACKET_Y);
  }
  await sleep(8);

  const elapsed = Date.now() - t0;
  if (elapsed - lastShot > 6000) { lastShot = elapsed; await shot(`play-${String(Math.round(elapsed / 1000)).padStart(3, "0")}s`); }
  if (elapsed - lastCheck > 1500) {
    lastCheck = elapsed;
    const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
    if (/YOUR SCORE/i.test(text)) {
      rounds++;
      if (held) { await page.mouse.up(); held = false; }
      await shot(`round-${rounds}-result`);
      console.log(`${Math.round(elapsed / 1000)}s round ${rounds}: ${text.match(/YOUR SCORE\s*([\d\s,.]+PTS)/i)?.[1]}`);
      await clickText(/retry/); await sleep(2500);
      await clickText(/start game/); await sleep(800);
    }
  }
}
if (held) await page.mouse.up();
await cdp.send("Page.stopScreencast").catch(() => {});
console.log(`done — rounds completed: ${rounds}`);
process.exit(0);

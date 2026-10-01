// Keyboard and screen-reader pass: enters with the keyboard, tabs through the Atrium, travels with the arrow keys,
// opens the Index and a room with the keyboard, and reports focus order, visible focus and the accessibility tree.
import { chromium } from "playwright-core";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9555");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];
const focused = () => page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const name = el.getAttribute("aria-label") || el.textContent?.trim().replace(/\s+/g, " ").slice(0, 60);
  return { tag: el.tagName, name, outline: cs.outlineStyle !== "none" && cs.outlineWidth !== "0px" };
});
await page.goto("http://localhost:4174/", { waitUntil: "domcontentloaded" });
await sleep(2600);
// The gate is reachable by keyboard.
await page.keyboard.press("Tab");
report.push(["gate first tab", await focused()]);
await page.keyboard.press("Tab");
report.push(["gate second tab", await focused()]);
await page.keyboard.press("Enter");
await sleep(6500);
report.push(["after entering, focus", await focused()]);
const order = [];
for (let i = 0; i < 9; i++) { await page.keyboard.press("Tab"); order.push(await focused()); }
report.push(["tab order from the title", order]);
// Travel with the keyboard.
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.press("ArrowDown"); await sleep(1800);
await page.keyboard.press("ArrowDown"); await sleep(1800);
report.push(["after two arrow-downs", await page.evaluate(() => location.hash)]);
for (const r of report) console.log(JSON.stringify(r));
report.length = 0;
// Open a room with the keyboard and leave it with Esc (at the Studio Floor).
await page.evaluate(() => { location.hash = "#studio"; }); await sleep(2600);
await page.locator(".xp-caption[data-active] .xp-door").first().focus();
await page.keyboard.press("Enter"); await sleep(1200);
report.push(["room open, focus", await focused(), await page.evaluate(() => location.hash)]);
await page.keyboard.press("Escape"); await sleep(800);
report.push(["after Esc, focus", await focused(), await page.evaluate(() => location.hash)]);
// The Index: open, focus inside, trap, Esc returns focus.
await page.locator(".xp-topbar button", { hasText: "Index" }).focus();
await page.keyboard.press("Enter"); await sleep(500);
report.push(["index open, focus", await focused()]);
for (let i = 0; i < 40; i++) await page.keyboard.press("Tab");
report.push(["index after 40 tabs (trapped)", await page.evaluate(() => !!document.activeElement?.closest(".xp-index"))]);
await page.keyboard.press("Escape"); await sleep(400);
report.push(["after Esc, focus", await focused()]);
// What a screen reader gets for the current place.
const snap = await page.locator(".xp-caption[data-active]").ariaSnapshot();
report.push(["accessibility tree of the current place", snap]);
const hidden = await page.evaluate(() => [...document.querySelectorAll(".xp-caption")].filter((c) => !c.hasAttribute("data-active")).every((c) => c.inert && c.getAttribute("aria-hidden") === "true"));
report.push(["other places inert and hidden", hidden]);
for (const r of report) console.log(JSON.stringify(r));
await page.close();
process.exit(0);

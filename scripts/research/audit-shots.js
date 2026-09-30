// Playwright CLI run-code script: captures the audit screenshot set for the current build.
//   playwright-cli -s=audit run-code --filename=scripts/research/audit-shots.js
// Home (Long Take): loader, core, a world, ecosystem, contact at 1440 and 390; /film: gate, title, ink at 1440 and 390;
// /concepts: each prototype at 1440. Output: docs/design/audit-shots/ (gitignored).
async page => {
  const out = 'docs/design/audit-shots';
  const base = 'http://localhost:4174';
  const wait = (ms) => page.waitForTimeout(ms);
  const shot = (name) => page.screenshot({ path: `${out}/${name}.png` });
  const click = async (re) => { const b = page.getByRole('button', { name: re }).first(); if (await b.count()) await b.click(); };

  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    await page.setViewportSize({ width: w, height: h });
    // Home: The Long Take.
    await page.goto(`${base}/`);
    await wait(3500); await shot(`home-${tag}-loader`);
    await click(/begin/i); await wait(7500); await shot(`home-${tag}-core`);
    await page.keyboard.press('1'); await wait(4000); await shot(`home-${tag}-aurelius`);
    await page.keyboard.press('3'); await wait(4500); await shot(`home-${tag}-ggp`);
    await page.keyboard.press('6'); await wait(5000); await shot(`home-${tag}-ecosystem`);
    await page.keyboard.press('7'); await wait(5000); await shot(`home-${tag}-contact`);
    await click(/meet the founders/i); await wait(1500); await shot(`home-${tag}-founders`);
    // The film checkpoint.
    await page.goto(`${base}/film/`);
    await wait(2600); await shot(`film-${tag}-gate`);
    await click(/enter in silence/i); await wait(4500); await shot(`film-${tag}-title`);
    await page.mouse.move(w * 0.15, h * 0.75);
    for (let i = 0; i <= 20; i++) await page.mouse.move(w * (0.15 + i * 0.03), h * (0.75 - i * 0.02));
    await wait(200); await shot(`film-${tag}-ink`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const c of [1, 2, 3, 4]) {
    await page.goto(`${base}/concepts/?concept=${c}`);
    await wait(6000); await shot(`concept-${c}-d`);
  }
  return 'ok';
}

// Optimised copies of the v5 environment plates for the site: WebP at native width and a phone width.
//   node scripts/v5/plates.mjs
import sharp from "sharp"; import fs from "fs";
const src = "design-refs/plates", out = "public/v5/plates";
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(src).filter((f) => f.endsWith(".png") && !/^p1[78]-/.test(f))) {
  const base = f.replace(".png", "");
  const img = sharp(`${src}/${f}`);
  const { hasAlpha } = await img.metadata();
  await img.clone().webp({ quality: hasAlpha ? 82 : 78, alphaQuality: 90, effort: 5 }).toFile(`${out}/${base}.webp`);
  await img.clone().resize({ width: 900 }).webp({ quality: 74, alphaQuality: 85, effort: 5 }).toFile(`${out}/${base}-m.webp`);
}
for (const f of fs.readdirSync(out)) console.log(f, Math.round(fs.statSync(`${out}/${f}`).size / 1024) + "K");

// Cut-outs and tiles cropped from the plates: foliage pieces from P02 (left and right clusters, the ferns), and the
// four 2 × 2 material tiles of P17 as separate textures.
const crop = async (name, src2, box, width, q = 80, feather = null) => {
  const m = await sharp(`${src}/${src2}`).metadata();
  const r = { left: Math.round(box[0] * m.width), top: Math.round(box[1] * m.height), width: Math.round(box[2] * m.width), height: Math.round(box[3] * m.height) };
  let img = sharp(`${src}/${src2}`).extract(r).resize({ width });
  if (feather) {
    // Fade the cut edges ([left, right, top, bottom] as fractions) to transparent so no straight edge shows.
    const meta = await img.clone().toBuffer({ resolveWithObject: true });
    const W = meta.info.width, H = meta.info.height, [fl, fr, ft, fb] = feather;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
      <linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="${fl ? 0 : 1}"/><stop offset="${fl || 0.0001}" stop-color="#fff"/><stop offset="${1 - (fr || 0.0001)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${fr ? 0 : 1}"/></linearGradient>
      <linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${ft ? 0 : 1}"/><stop offset="${ft || 0.0001}" stop-color="#fff"/><stop offset="${1 - (fb || 0.0001)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${fb ? 0 : 1}"/></linearGradient>
      <mask id="m"><rect width="100%" height="100%" fill="url(#y)"/></mask></defs>
      <rect width="100%" height="100%" fill="url(#x)" mask="url(#m)"/></svg>`;
    img = sharp(meta.data).composite([{ input: Buffer.from(svg), blend: "dest-in" }]);
  }
  await img.webp({ quality: q, alphaQuality: 88, effort: 5 }).toFile(`${out}/${name}.webp`);
};
await crop("p02-left", "p02-jungle-fg.png", [0, 0, 0.36, 1], 600, 82, [0.18, 0, 0.12, 0.3]);
await crop("p02-right", "p02-jungle-fg.png", [0.64, 0, 0.36, 1], 600, 82, [0, 0.18, 0.12, 0.3]);
await crop("p02-ferns", "p02-jungle-fg.png", [0.17, 0.58, 0.4, 0.42], 640, 82, [0.22, 0.05, 0, 0.42]);
await crop("p02-monstera", "p02-jungle-fg.png", [0.05, 0, 0.2, 0.36], 400, 82, [0, 0, 0.1, 0]);
await crop("tex-sandstone", "p17-textures.png", [0, 0, 0.5, 0.5], 512, 78);
await crop("tex-ice", "p17-textures.png", [0.5, 0, 0.5, 0.5], 512, 78);
await crop("tex-bark", "p17-textures.png", [0, 0.5, 0.5, 0.5], 512, 78);
await crop("tex-sand", "p17-textures.png", [0.5, 0.5, 0.5, 0.5], 512, 78);

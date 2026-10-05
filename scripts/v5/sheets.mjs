// Side-by-side sheets: each built frame (left) next to its reference image (right).
//   node scripts/v5/sheets.mjs <shotsDir> <outDir> [--mobile]
import sharp from "sharp"; import fs from "fs";
const [dir, out] = process.argv.slice(2);
const mobile = process.argv.includes("--mobile");
const refs = fs.readdirSync("design-refs/home").filter((f) => f.endsWith(".png")).sort();
fs.mkdirSync(out, { recursive: true });
const H = mobile ? 700 : 540;
for (const f of fs.readdirSync(dir).filter((f) => /^p\d+\.png$/.test(f))) {
  const i = Number(f.slice(1, 3));
  const ref = `design-refs/home/${refs[i]}`;
  const a = await sharp(`${dir}/${f}`).resize({ height: H }).toBuffer();
  // Phones: the 3:2 / 16:9 reference is shown whole beside the tall frame (there are no M images for these frames).
  const b = await sharp(ref).resize({ height: mobile ? Math.round(H * 0.6) : H }).toBuffer();
  const [ma, mb] = [await sharp(a).metadata(), await sharp(b).metadata()];
  await sharp({ create: { width: ma.width + mb.width + 12, height: H, channels: 3, background: "#111" } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: ma.width + 12, top: 0 }])
    .jpeg({ quality: 82 }).toFile(`${out}/${f.replace(".png", "")}-${refs[i].replace(".png", "")}.jpg`);
}
console.log(fs.readdirSync(out).length);

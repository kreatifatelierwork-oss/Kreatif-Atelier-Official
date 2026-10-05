import sharp from "sharp";
import fs from "fs";
const [dir, out, from = 0, to = 999] = process.argv.slice(2);
const f = fs.readdirSync(dir).filter((x) => /^s-\d+\.jpg$/.test(x)).sort().filter((x) => { const n = +x.slice(2, 5); return n >= +from && n <= +to; });
const W = 360, H = 225, cols = 5, rows = Math.ceil(f.length / cols);
const imgs = await Promise.all(f.map((x) => sharp(`${dir}/${x}`).resize(W, H).toBuffer()));
await sharp({ create: { width: cols * (W + 4), height: rows * (H + 4), channels: 3, background: "#111" } })
  .composite(imgs.map((b, i) => ({ input: b, left: (i % cols) * (W + 4), top: Math.floor(i / cols) * (H + 4) }))).jpeg({ quality: 70 }).toFile(out);
console.log(f.length);

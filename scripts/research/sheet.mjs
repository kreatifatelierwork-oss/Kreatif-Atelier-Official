// Tile screenshots into one review sheet: node scripts/research/sheet.mjs <out.png> <cols> <tileWidth> <files...>
import sharp from "sharp";

const [out, cols, tileWidth, ...files] = process.argv.slice(2);
const c = +cols, w = +tileWidth, gap = 8;
const tiles = await Promise.all(files.map(async (f) => {
  const buf = await sharp(f).resize({ width: w }).toBuffer();
  return { buf, h: (await sharp(buf).metadata()).height };
}));
const rows = Math.ceil(tiles.length / c);
const rowH = Array.from({ length: rows }, (_, r) => Math.max(...tiles.slice(r * c, r * c + c).map((t) => t.h)));
const composite = tiles.map((t, i) => ({
  input: t.buf,
  left: (i % c) * (w + gap),
  top: rowH.slice(0, Math.floor(i / c)).reduce((a, b) => a + b + gap, 0),
}));
await sharp({ create: { width: c * (w + gap) - gap, height: rowH.reduce((a, b) => a + b + gap, 0) - gap, channels: 3, background: "#777" } })
  .composite(composite).png().toFile(out);
console.log(out);

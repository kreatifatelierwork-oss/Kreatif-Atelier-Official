// One-off: download the founder portraits from the live site and write web-sized WebP files.
// Usage: pnpm images            (downloads from the live site)
//        pnpm images <dir>      (reads already-downloaded PNGs from <dir>)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "https://kreatifatelier.com/images/";
const LOCAL_DIR = process.argv[2];
const OUT_DIR = path.resolve("public/images/founders");
// Sources are near-square studio portraits (495–1075 px); every card uses the same square crop.
const SIZE = 640;

const founders = {
  gourish: "Gourish_Formal1.png",
  rohan: "Rohan_Formal1.png",
  anwesha: "Anwesha_Formal.png",
  aritra: "Aritra_Formal1.png",
};

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, file] of Object.entries(founders)) {
  const input = LOCAL_DIR ? await readFile(path.join(LOCAL_DIR, file)) : await download(file);
  const meta = await sharp(input).metadata();

  const output = await sharp(input)
    .resize({ width: SIZE, height: SIZE, fit: "cover", position: "top" })
    .webp({ quality: 78, alphaQuality: 80, effort: 6 })
    .toBuffer();

  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  await writeFile(outPath, output);
  console.log(
    `${slug}: ${meta.width}×${meta.height} ${meta.hasAlpha ? "(alpha)" : ""} ${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB`,
  );
}

async function download(file) {
  const res = await fetch(SOURCE + file);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

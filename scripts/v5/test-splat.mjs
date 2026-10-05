// A test splat world for the Spark pipeline (until the World Labs worlds arrive): a plate + its depth map turned into
// Gaussian splats on their viewing rays, written as SPZ v2 (gzip; positions 24-bit fixed point, alpha, colour as SH
// DC, log scales, quaternion xyz).  node scripts/v5/test-splat.mjs p01-jungle-bg public/v5/worlds/test-jungle.spz
import sharp from "sharp"; import fs from "fs"; import zlib from "zlib";
const [name, out] = process.argv.slice(2);
const step = 1;
const { data: dep, info: di } = await sharp(`public/v5/depth/${name}.png`).raw().toBuffer({ resolveWithObject: true });
const { data: rgb } = await sharp(`design-refs/plates/${name}.png`).removeAlpha().resize(di.width, di.height).raw().toBuffer({ resolveWithObject: true });
const W = di.width, H = di.height, near = 14, far = 420, tanX = Math.tan((112 * Math.PI) / 360), tanY = tanX * H / W;
const pts = [];
for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
  const d = dep[y * W + x] / 255, z = 1 / ((1 / far) + ((1 / near) - (1 / far)) * Math.pow(d, 1.35));
  const u = (x + 0.5) / W, v = 1 - (y + 0.5) / H;
  const px = (u * 2 - 1) * tanX * z, py = (v * 2 - 1) * tanY * z, pz = -z;
  const size = (2 * tanX * z / W) * step * 0.75; // pixel footprint at that distance
  const i = (y * W + x) * 3;
  pts.push([px, py, pz, rgb[i] / 255, rgb[i + 1] / 255, rgb[i + 2] / 255, size]);
}
const N = pts.length, fb = 12;
const buf = Buffer.alloc(16 + N * (9 + 1 + 3 + 3 + 3));
buf.writeUInt32LE(0x5053474e, 0); buf.writeUInt32LE(2, 4); buf.writeUInt32LE(N, 8);
buf.writeUInt8(0, 12); buf.writeUInt8(fb, 13); buf.writeUInt8(0, 14); buf.writeUInt8(0, 15);
let o = 16;
const clamp8 = (v) => Math.max(0, Math.min(255, Math.round(v)));
for (const p of pts) for (let k = 0; k < 3; k++) { let q = Math.round(p[k] * (1 << fb)); q = Math.max(-(1 << 23), Math.min((1 << 23) - 1, q)); buf.writeIntLE(q, o, 3); o += 3; }
for (const p of pts) buf[o++] = 240; // alpha
for (const p of pts) for (let k = 3; k < 6; k++) buf[o++] = clamp8((((p[k] - 0.5) / 0.28209479) * 0.15 + 0.5) * 255);
for (const p of pts) { const s = clamp8((Math.log(p[6]) + 10) * 16); buf[o++] = s; buf[o++] = s; buf[o++] = clamp8((Math.log(p[6] * 0.25) + 10) * 16); }
for (const p of pts) { buf[o++] = 128; buf[o++] = 128; buf[o++] = 128; } // identity rotation (x=y=z=0)
fs.mkdirSync(out.replace(/\/[^/]+$/, ""), { recursive: true });
fs.writeFileSync(out, zlib.gzipSync(buf, { level: 9 }));
console.log(N, "splats", Math.round(fs.statSync(out).size / 1024), "KB");

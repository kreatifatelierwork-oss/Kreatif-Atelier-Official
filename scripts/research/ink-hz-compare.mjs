// Compares two ink-hz.mjs outputs (--out files) pixel for pixel: intersection over union of the 60 Hz ink masks for
// each path and moment. 1.000 everywhere = the ink renders identically.
//   node scripts/research/ink-hz-compare.mjs <baseline.json> <final.json>
import { readFile } from "node:fs/promises";
const [a, b] = await Promise.all(process.argv.slice(2, 4).map(async (f) => JSON.parse(await readFile(f, "utf8"))));
const bits = (s) => Buffer.from(s, "base64");
for (const name of Object.keys(a.packed)) {
  const r = a.packed[name].map((m, i) => {
    const x = bits(m), y = bits(b.packed[name][i]);
    let inter = 0, uni = 0;
    for (let j = 0; j < x.length; j++) {
      const p = x[j], q = y[j];
      for (let k = 0; k < 8; k++) { const u = (p >> k) & 1, v = (q >> k) & 1; inter += u & v; uni += u | v; }
    }
    return uni ? (inter / uni).toFixed(4) : "1.0000";
  });
  console.log(name, "at", a.at.join("/"), "ms →", r.join(" "));
}

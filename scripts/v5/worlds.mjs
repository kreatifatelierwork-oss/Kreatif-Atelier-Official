// Bring the World Labs splat worlds into the site: for each design-refs/worlds/wNN-*.spz, write
//   public/v5/worlds/<id>.rad (+ .radc chunks, paged) when Spark's build-lod is available (SPARK_REPO=<spark checkout>,
//   built with Rust: `npm run build:wasm && npm run build`), otherwise copy the .spz (in-browser LoD),
//   public/v5/worlds/<id>-m.spz: a lighter phone copy (every other splat, via the same tool chain when available),
//   public/v5/worlds/<id>-collider.glb when present,
// and list them in lib/worlds.files.json.   node scripts/v5/worlds.mjs
import fs from "fs"; import path from "path"; import { execFileSync } from "child_process";
const src = "design-refs/worlds", out = "public/v5/worlds";
fs.mkdirSync(out, { recursive: true });
const files = {};
const spark = process.env.SPARK_REPO;
const list = fs.existsSync(src) ? fs.readdirSync(src).filter((f) => /^w\d\d-.*\.spz$/.test(f)) : [];
for (const f of list) {
  const id = f.replace(/\.spz$/, "");
  const entry = { desktop: `/v5/worlds/${id}.spz` };
  if (spark && fs.existsSync(path.join(spark, "package.json"))) {
    // Spark's LoD builder: <id>-lod.rad + <id>-lod-N.radc (streamed with paged: true).
    fs.copyFileSync(path.join(src, f), path.join(out, f));
    execFileSync("npm", ["run", "build-lod", "--", path.resolve(out, f), "--quality", "--rad-chunked"], { cwd: spark, stdio: "inherit" });
    entry.desktop = `/v5/worlds/${id}-lod.rad`;
    entry.paged = true;
    fs.rmSync(path.join(out, f));
  } else {
    fs.copyFileSync(path.join(src, f), path.join(out, f));
  }
  const col = path.join(src, `${id}-collider.glb`);
  if (fs.existsSync(col)) { fs.copyFileSync(col, path.join(out, `${id}-collider.glb`)); entry.collider = `/v5/worlds/${id}-collider.glb`; }
  files[id] = entry;
  console.log(id, entry);
}
// The pipeline test world (scripts/v5/test-splat.mjs), only used with ?splat=test.
if (fs.existsSync(path.join(out, "test-jungle.spz"))) files["test-jungle"] = { desktop: "/v5/worlds/test-jungle.spz" };
fs.writeFileSync("lib/worlds.files.json", JSON.stringify(files, null, 1) + "\n");
if (!spark) console.log("Note: SPARK_REPO not set, so worlds are served as .spz with in-browser LoD (no paged streaming).");

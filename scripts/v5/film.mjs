// Build the scroll-driven film from the AI clips (docs/design/FILM-SHOTLIST.md).
//   node scripts/v5/film.mjs [--temp] [--only home,aurelius,…]
// For each journey: the clips in order (home c01…c35 from design-refs/film/home; company pages from
// design-refs/film/pages/<page>-cNN.mp4 after the portal design-refs/film/portals/p-<page>.mp4), contiguous from the
// first (a gap stops the film there; the rest of the page shows poster stills until its clips arrive). Writes:
//   public/v5/film/<journey>/<clip>.d.h264 + .d.json  desktop: 1440×810, short-GOP raw H.264 (keyint 12, no B-frames)
//   public/v5/film/<journey>/<clip>.m.h264 + .m.json  phone: centre-cropped 9:16, 608×1080
//   public/v5/film/<journey>/k-<key>.d.webp / .m.webp  poster stills of every keyframe
//   lib/film.files.json                               what exists (the player reads it)
// and reports every seam: the last frame of one clip against the first of the next (mean difference, 0–255).
// --temp uses the temporary test clips (design-refs/film-temp, scripts/v5/temp-clips.mjs). The `.json` index of a
// clip is [[byteOffset, size, isKey], …] per frame.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const FF = "node_modules/ffmpeg-static/ffmpeg", FP = "node_modules/ffmpeg-static/ffprobe";
const args = process.argv.slice(2);
const temp = args.includes("--temp");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const base = temp ? "design-refs/film-temp" : "design-refs/film";

/** The films, per the shot list: clip ids in order and the keyframes they join (keys.length = clips.length + 1). */
const pad = (n) => String(n).padStart(2, "0");
const FILMS = {
  home: { dir: "home", clips: Array.from({ length: 35 }, (_, i) => `c${pad(i + 1)}`), keys: Array.from({ length: 36 }, (_, i) => `h${pad(i + 1)}`) },
  aurelius: { portal: { clip: "p-aurelius", from: "h16" }, clips: ["aurelius-c01", "aurelius-c02", "aurelius-c03", "aurelius-c04", "aurelius-c05"], keys: ["a01", "a02", "a05", "a03", "a04", "a06"] },
  "golden-guardian-productions": { portal: { clip: "p-ggp", from: "h19" }, clips: ["ggp-c01", "ggp-c02", "ggp-c03", "ggp-c04"], keys: ["g01", "g02", "g03", "g04", "g05"] },
  valora: { portal: { clip: "p-valora", from: "h22" }, clips: ["valora-c01", "valora-c02", "valora-c03"], keys: ["v01", "v02", "v03", "v04"] },
  asraya: { portal: { clip: "p-asraya", from: "h25" }, clips: ["asraya-c01", "asraya-c02", "asraya-c03"], keys: ["s01", "s02", "s03", "s04"] },
  "rudra-yugen": { portal: { clip: "p-rudra", from: "h28" }, clips: ["rudra-c01", "rudra-c02", "rudra-c03"], keys: ["r01", "r02", "r03", "r04"] },
};
const clipPath = (journey, id) => journey === "home" ? `${base}/home/${id}.mp4` : id.startsWith("p-") ? `${base}/portals/${id}.mp4` : `${base}/pages/${id}.mp4`;
const keyframePath = (key) => ["png", "jpg", "webp"].map((x) => `design-refs/keyframes/${key}.${x}`).find((p) => fs.existsSync(p));
/** TEMPORARY last resort for a poster: the reference frame (its baked top bar and act bar cropped away). */
const REF_PREFIX = { h: "home/h", a: "pages/aurelius-", g: "pages/ggp-", v: "pages/valora-", s: "pages/asraya-", r: "pages/rudra-" };
function referencePath(key) {
  const [dir, pre] = REF_PREFIX[key[0]].split("/");
  const f = fs.readdirSync(`design-refs/${dir}`).find((x) => x.startsWith(pre + key.slice(1) + "-"));
  return f ? `design-refs/${dir}/${f}` : null;
}
async function cropReference(src, file) {
  const m = await sharp(src).metadata();
  await sharp(src).extract({ left: 0, top: Math.round(m.height * 0.06), width: m.width, height: Math.round(m.height * 0.86) }).toFile(file);
  return file;
}

const D = { w: 1440, h: 810, crf: 23 }, M = { w: 608, h: 1080, crf: 25 };
const vf = (v) => v === D ? `scale=${D.w}:${D.h}:force_original_aspect_ratio=increase,crop=${D.w}:${D.h},setsar=1`
  : `scale=-2:${M.h},crop=${M.w}:${M.h},setsar=1`;

function encode(src, out, v) {
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", src, "-an", "-vf", vf(v), "-r", "24", "-c:v", "libx264", "-profile:v", "main", "-level", "4.0",
    "-g", "12", "-keyint_min", "12", "-sc_threshold", "0", "-bf", "0", "-crf", String(v.crf), "-pix_fmt", "yuv420p", "-bsf:v", "h264_mp4toannexb", "-f", "h264", out]);
  const j = JSON.parse(execFileSync(FP, ["-v", "error", "-show_packets", "-show_entries", "packet=size,pos,flags", "-of", "json", "-f", "h264", out]).toString());
  const index = j.packets.map((x) => [+x.pos, +x.size, x.flags[0] === "K" ? 1 : 0]);
  fs.writeFileSync(out.replace(/\.h264$/, ".json"), JSON.stringify(index));
  return index.length;
}
/** A frame of a clip as raw pixels (small, for seam checks): `which` = "first" | "last". */
function grab(src, which, file) {
  const a = which === "first" ? ["-i", src, "-frames:v", "1"] : ["-sseof", "-0.2", "-i", src, "-update", "1"];
  execFileSync(FF, ["-y", "-loglevel", "error", ...a, "-vf", "scale=320:180", file]);
  return file;
}
async function diff(a, b) {
  const [x, y] = await Promise.all([sharp(a).removeAlpha().resize(320, 180).raw().toBuffer(), sharp(b).removeAlpha().resize(320, 180).raw().toBuffer()]);
  let s = 0; for (let i = 0; i < x.length; i++) s += Math.abs(x[i] - y[i]);
  return +(s / x.length).toFixed(2);
}
async function poster(src, outBase) {
  await sharp(src).resize(D.w, D.h, { fit: "cover" }).webp({ quality: 80 }).toFile(`${outBase}.d.webp`);
  await sharp(src).resize(M.w, M.h, { fit: "cover" }).webp({ quality: 78 }).toFile(`${outBase}.m.webp`);
}

const manifestFile = "lib/film.files.json";
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "film-"));
for (const [journey, film] of Object.entries(FILMS)) {
  if (only && !only.includes(journey)) continue;
  const out = `public/v5/film/${journey}`;
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const entry = { fps: 24, temp, clips: [], keys: film.keys, posters: {}, portal: null, seams: [] };
  // The clips, contiguous from the first.
  for (const id of film.clips) {
    const src = clipPath(journey, id);
    if (!fs.existsSync(src)) break;
    const frames = encode(src, `${out}/${id}.d.h264`, D);
    const framesM = encode(src, `${out}/${id}.m.h264`, M);
    if (frames !== framesM) throw new Error(`${id}: desktop ${frames} vs phone ${framesM} frames`);
    entry.clips.push({ id, frames });
    console.log(journey, id, frames, "frames");
  }
  // Seams: clip k's last frame against clip k+1's first; and each clip's first frame against its keyframe image.
  for (let k = 0; k + 1 < entry.clips.length; k++) {
    const a = grab(clipPath(journey, entry.clips[k].id), "last", `${tmp}/a.png`), b = grab(clipPath(journey, entry.clips[k + 1].id), "first", `${tmp}/b.png`);
    entry.seams.push({ between: [entry.clips[k].id, entry.clips[k + 1].id], meanDiff: await diff(a, b) });
  }
  // Posters: the keyframe image when it exists, else the film's own frame at that key.
  for (let k = 0; k < film.keys.length; k++) {
    const key = film.keys[k], kf = keyframePath(key);
    let src = kf;
    if (!src && k < entry.clips.length) src = grab(clipPath(journey, entry.clips[k].id), "first", `${tmp}/k.png`);
    else if (!src && k === entry.clips.length && k > 0) src = grab(clipPath(journey, entry.clips[k - 1].id), "last", `${tmp}/k.png`);
    if (!src && referencePath(key)) { src = await cropReference(referencePath(key), `${tmp}/r.png`); entry.tempPosters = [...(entry.tempPosters ?? []), key]; }
    if (!src) continue;
    await poster(src, `${out}/k-${key}`);
    entry.posters[key] = true;
  }
  // The portal into a company page (played in time as the page changes).
  if (film.portal && fs.existsSync(clipPath(journey, film.portal.clip))) {
    const frames = encode(clipPath(journey, film.portal.clip), `${out}/${film.portal.clip}.d.h264`, D);
    encode(clipPath(journey, film.portal.clip), `${out}/${film.portal.clip}.m.h264`, M);
    entry.portal = { id: film.portal.clip, frames, from: film.portal.from };
  }
  manifest[journey] = entry;
  const worst = entry.seams.reduce((m, s) => Math.max(m, s.meanDiff), 0);
  console.log(journey, `${entry.clips.length} clips, posters ${Object.keys(entry.posters).length}/${film.keys.length}, worst seam ${worst}`);
}
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + "\n");
fs.rmSync(tmp, { recursive: true, force: true });

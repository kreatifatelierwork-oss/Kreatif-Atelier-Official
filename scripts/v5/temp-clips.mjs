// TEMPORARY test clips (until the user's AI clips arrive): cNN goes from reference frame hNN to hNN+1 with a slow push
// and a long dissolve, starting exactly on hNN and ending exactly on hNN+1 (so seams can be tested). 1920×1080, 24 fps.
// The references still carry their baked-in UI and text; these are for testing the player only, never shipped.
//   node scripts/v5/temp-clips.mjs [first=1] [last=12] [seconds=8]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
const F = "node_modules/ffmpeg-static/ffmpeg";
const [first = 1, last = 12, secs = 8] = process.argv.slice(2).map(Number);
const refs = fs.readdirSync("design-refs/home").filter((f) => /^h\d\d-.*\.png$/.test(f)).sort();
const out = "design-refs/film-temp/home";
fs.mkdirSync(out, { recursive: true });
const fps = 24, n = secs * fps;
// Each reference: drop the baked top bar and act bar, centre-crop to 16:9, 1920×1080.
const frame = (i) => `[${i}:v]crop=iw:ih*0.86:0:ih*0.06,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1`;
for (let k = first; k <= last; k++) {
  const a = `design-refs/home/${refs[k - 1]}`, b = `design-refs/home/${refs[k]}`;
  const name = `c${String(k).padStart(2, "0")}.mp4`;
  const filter = [
    `${frame(0)},zoompan=z='1+0.12*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1920x1080:fps=${fps}[a]`,
    // The incoming frame starts playing at the dissolve's offset, so its zoom must settle to exactly 1 by the clip's
    // last frame: (n - offset) frames of travel.
    `${frame(1)},zoompan=z='max(1,1.12-0.12*on/${Math.round(n * 0.75) - 1})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1920x1080:fps=${fps}[b]`,
    `[a][b]xfade=transition=fade:duration=${secs * 0.5}:offset=${secs * 0.25},trim=0:${secs},format=yuv420p[v]`,
  ].join(";");
  execFileSync(F, ["-y", "-loglevel", "error", "-loop", "1", "-t", String(secs), "-i", a, "-loop", "1", "-t", String(secs), "-i", b,
    "-filter_complex", filter, "-map", "[v]", "-r", String(fps), "-c:v", "libx264", "-crf", "16", "-preset", "medium", `${out}/${name}`]);
  console.log(name, refs[k - 1], "→", refs[k]);
}

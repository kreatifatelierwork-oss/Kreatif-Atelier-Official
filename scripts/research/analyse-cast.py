"""Analyse a screencast folder from screencast.mjs: per-frame mean colour, brightness, motion energy (mean abs
difference to the previous frame) and the bounding box of what changed. Prints a compact timeline and writes
analysis.json. Optional: contact sheet of frames at given times.

  python3 scripts/research/analyse-cast.py <dir> [--sheet t1,t2,...] [--cols 4] [--tile 480]
"""
import json, sys, os
import numpy as np
from PIL import Image

d = sys.argv[1]
args = sys.argv[2:]
idx = json.load(open(os.path.join(d, "index.json")))
frames = idx["frames"]

def load(i, size=(192, 120)):
    im = Image.open(os.path.join(d, f"f{i:05d}.jpg")).convert("RGB")
    return np.asarray(im.resize(size, Image.BILINEAR), dtype=np.float32)

rows = []
prev = None
for f in frames:
    try:
        a = load(f["i"])
    except Exception:
        continue
    mean = a.reshape(-1, 3).mean(0)
    lum = float((0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]).mean())
    motion, box = 0.0, None
    if prev is not None:
        diff = np.abs(a - prev).mean(2)
        motion = float(diff.mean())
        ys, xs = np.where(diff > 12)
        if len(xs):
            box = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
    prev = a
    rows.append({"i": f["i"], "t": f["t"], "rgb": [round(float(v)) for v in mean], "lum": round(lum, 1),
                 "motion": round(motion, 2), "box": box})

json.dump(rows, open(os.path.join(d, "analysis.json"), "w"))

# Compact timeline: one line per 100 ms bucket.
bucket = {}
for r in rows:
    b = r["t"] // 100
    s = bucket.setdefault(b, {"n": 0, "motion": 0, "lum": 0, "rgb": [0, 0, 0]})
    s["n"] += 1; s["motion"] = max(s["motion"], r["motion"]); s["lum"] += r["lum"]
    s["rgb"] = [s["rgb"][k] + r["rgb"][k] for k in range(3)]
print(" t(ms)  fr  lum   motion  mean rgb")
for b in sorted(bucket):
    s = bucket[b]
    rgb = [round(v / s["n"]) for v in s["rgb"]]
    bar = "#" * min(40, int(s["motion"] * 2))
    print(f"{b*100:6d} {s['n']:3d} {s['lum']/s['n']:5.1f} {s['motion']:7.2f}  {rgb}  {bar}")

if "--sheet" in args:
    times = [int(x) for x in args[args.index("--sheet") + 1].split(",")]
    cols = int(args[args.index("--cols") + 1]) if "--cols" in args else 4
    tile = int(args[args.index("--tile") + 1]) if "--tile" in args else 480
    picks = []
    for t in times:
        best = min(frames, key=lambda f: abs(f["t"] - t))
        picks.append((t, best))
    ims = []
    for t, f in picks:
        im = Image.open(os.path.join(d, f"f{f['i']:05d}.jpg")).convert("RGB")
        h = round(im.height * tile / im.width)
        im = im.resize((tile, h))
        from PIL import ImageDraw
        dr = ImageDraw.Draw(im)
        dr.rectangle([0, 0, 92, 16], fill=(0, 0, 0))
        dr.text((4, 2), f"{f['t']} ms", fill=(255, 255, 0))
        ims.append(im)
    rows_n = (len(ims) + cols - 1) // cols
    th = max(i.height for i in ims)
    sheet = Image.new("RGB", (cols * (tile + 6) - 6, rows_n * (th + 6) - 6), (110, 110, 110))
    for k, im in enumerate(ims):
        sheet.paste(im, ((k % cols) * (tile + 6), (k // cols) * (th + 6)))
    out = os.path.join(d, "sheet.png")
    sheet.save(out)
    print("sheet:", out)

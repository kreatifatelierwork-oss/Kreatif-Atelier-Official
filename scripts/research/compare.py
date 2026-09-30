"""Side-by-side comparison sheet from two screencasts: rows of [reference | ours] at matching times.

  python3 scripts/research/compare.py <out.png> <refDir> <refT0> <oursDir> <oursT0> "<label>@<ms>,..." [--tile 520] [--names A,B]

Times are relative to each run's T0 (so the same beat lines up even when loaders differ).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

out, rd, rt0, od, ot0, spec = sys.argv[1:7]
args = sys.argv[7:]
tile = int(args[args.index("--tile") + 1]) if "--tile" in args else 520
names = args[args.index("--names") + 1].split(",") if "--names" in args else ["buttermax.net", "Kreatif Atelier (ours)"]
rt0, ot0 = int(rt0), int(ot0)
beats = [(s.rsplit("@", 1)[0], int(s.rsplit("@", 1)[1])) for s in spec.split(",")]

def frame(d, t):
    fr = json.load(open(os.path.join(d, "index.json")))["frames"]
    f = min(fr, key=lambda x: abs(x["t"] - t))
    im = Image.open(os.path.join(d, f"f{f['i']:05d}.jpg")).convert("RGB")
    return im.resize((tile, round(im.height * tile / im.width))), f["t"]

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)
except Exception:
    font = small = ImageFont.load_default()

rows = []
for label, dt in beats:
    a, ta = frame(rd, rt0 + dt)
    b, tb = frame(od, ot0 + dt)
    h = max(a.height, b.height)
    row = Image.new("RGB", (tile * 2 + 190, h), (28, 28, 30))
    dr = ImageDraw.Draw(row)
    dr.text((12, 10), label, fill=(240, 220, 170), font=font)
    sign = "+" if dt >= 0 else "−"
    dr.text((12, 32), f"T0 {sign}{abs(dt)} ms", fill=(170, 170, 170), font=small)
    row.paste(a, (180, 0))
    row.paste(b, (190 + tile, 0))
    rows.append(row)

head = Image.new("RGB", (tile * 2 + 190, 30), (28, 28, 30))
dr = ImageDraw.Draw(head)
dr.text((180, 8), names[0], fill=(255, 255, 255), font=font)
dr.text((190 + tile, 8), names[1], fill=(255, 255, 255), font=font)
H = head.height + sum(r.height + 6 for r in rows)
sheet = Image.new("RGB", (head.width, H), (60, 60, 64))
sheet.paste(head, (0, 0))
y = head.height
for r in rows:
    sheet.paste(r, (0, y))
    y += r.height + 6
sheet.save(out, optimize=True)
print(out, sheet.size)

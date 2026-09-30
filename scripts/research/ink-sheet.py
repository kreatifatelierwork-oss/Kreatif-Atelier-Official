"""Contact sheets for the ink comparison: one row per site, columns at fixed times relative to a stroke's start.
   python3 scripts/research/ink-sheet.py <dirA> <dirB> <stroke> <out.png> [--crop x0,y0,x1,y1] [--times ms,ms,...] [--scale 0.5]
"""
import json, sys
from PIL import Image, ImageDraw
a, b, stroke, out = sys.argv[1:5]
args = sys.argv[5:]
def opt(n, d):
    return args[args.index(n) + 1] if n in args else d
crop = tuple(int(v) for v in opt('--crop', '0,540,620,860').split(','))
times = [int(v) for v in opt('--times', '0,200,400,800,1200,1600,2000,2600').split(',')]
scale = float(opt('--scale', '0.5'))
rows = []
for site in (a, b):
    d = json.load(open(f'{site}/index.json'))
    m = next(m for m in d['marks'] if m['name'] == stroke)
    fr = d['frames']
    row = []
    for t in times:
        f = min(fr, key=lambda f: abs(f['t'] - (m['start'] + t)))
        im = Image.open(f"{site}/f{f['i']:05d}.jpg").crop(crop)
        im = im.resize((int(im.width * scale), int(im.height * scale)))
        ImageDraw.Draw(im).text((4, 4), f'+{t}', fill=(255, 0, 0))
        row.append(im)
    rows.append(row)
w, h = rows[0][0].size
W = Image.new('RGB', (w * len(times) + 2 * (len(times) - 1), h * 2 + 4), 'white')
for r, row in enumerate(rows):
    for c, im in enumerate(row):
        W.paste(im, (c * (w + 2), r * (h + 4)))
W.save(out)

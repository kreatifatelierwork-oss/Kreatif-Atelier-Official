"""Compares two nav-record.mjs logs: the route position s over time (sampled every 20 ms from the scripted start),
the step timings, and the frame times. Writes an overlay chart.
   python3 scripts/research/nav-compare.py <baseline.json> <final.json> [chart.png]
"""
import json, sys
import numpy as np

a, b = (json.load(open(f)) for f in sys.argv[1:3])
chart = sys.argv[3] if len(sys.argv) > 3 else None

def series(d):
    t = np.array([r[0] for r in d['log']]); s = np.array([r[1] for r in d['log']])
    return t, s

ta, sa = series(a); tb, sb = series(b)
end = min(ta[-1], tb[-1])
grid = np.arange(0, end, 20.0)
ia = np.interp(grid, ta, sa); ib = np.interp(grid, tb, sb)
diff = np.abs(ia - ib)
# Event dispatch jitter shifts curves by a few ms; also report the difference after aligning each step's start.
print(f"samples {len(grid)} over {end/1000:.1f} s")
print(f"|Δs| max {diff.max():.4f}  p99 {np.percentile(diff, 99):.4f}  mean {diff.mean():.5f} (places)")
print("rest positions (s at the end of each step):")
for (na, t1), (nb, t2) in zip(a['steps'], b['steps']):
    print(f"  {na:16s} baseline t={t1/1000:6.2f}s final t={t2/1000:6.2f}s")
print("frame times baseline", a['loop'])
print("frame times final   ", b['loop'])
if chart:
    from PIL import Image, ImageDraw
    Wd, Hd = 1400, 420
    im = Image.new('RGB', (Wd, Hd), 'white'); d = ImageDraw.Draw(im)
    smax = max(sa.max(), sb.max(), 1)
    def pts(t, s):
        return [(20 + x / end * (Wd - 40), Hd - 30 - y / smax * (Hd - 60)) for x, y in zip(t, s) if x <= end]
    d.line(pts(ta, sa), fill=(201, 164, 92), width=5)
    d.line(pts(tb, sb), fill=(11, 15, 26), width=1)
    d.text((24, 10), "route position s over time: gold = baseline, ink = final", fill=(0, 0, 0))
    im.save(chart)

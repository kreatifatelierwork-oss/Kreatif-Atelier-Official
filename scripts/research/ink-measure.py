"""Measures the cursor ink frame by frame in an ink-record.mjs capture (per stroke: width, continuity, edges, drift,
fade). Ink = pixels that turned dark and neutral compared with the frame just before the stroke (the page there was
empty background), so the moving product/object and the page text are not counted.
   python3 scripts/research/ink-measure.py <captureDir> [--json out.json]
"""
import json, sys, math
import numpy as np
from PIL import Image
from scipy import ndimage

cap = sys.argv[1]
d = json.load(open(f'{cap}/index.json'))
frames = d['frames']
BANNER_Y = 808  # buttermax's cookie banner starts at 810; exclude the same band on both sites

sys.path.insert(0, 'scripts/research')
# stroke geometry is re-derived from the recorded marks + the path module via a tiny node call
import subprocess
paths = json.loads(subprocess.check_output(['node', '-e', '''
import("./scripts/research/ink-paths.mjs").then(m => {
  const o = {};
  for (const s of m.STROKES) o[s.name] = { start: s.start, end: [s.path.at(-1).x, s.path.at(-1).y], pts: s.path.map(p => [p.x, p.y]) };
  console.log(JSON.stringify(o));
});''']))

def load(i):
    return np.asarray(Image.open(f'{cap}/f{i:05d}.jpg').convert('RGB')).astype(np.int16)

def frame_at(t):
    return min(frames, key=lambda f: abs(f['t'] - t))

ROI = {  # x0, y0, x1, y1 — the empty part of the page each stroke is judged in (the moving product is excluded)
    'slow-line': (0, 470, 420, 808), 'medium-line': (0, 430, 420, 808), 'fast-flick': (0, 520, 420, 808),
    'very-fast-flick': (0, 470, 420, 808), 'circle': (0, 470, 420, 808), 'zigzag': (0, 460, 420, 808),
    'stop-dead': (0, 470, 420, 808), 'jitter': (0, 470, 420, 808), 'edge-left': (0, 470, 420, 808),
    'long-sweep': (0, 0, 1440, 808), 'over-text': (0, 0, 1440, 808), 'over-object': (0, 0, 1440, 808),
    'edge-right-top': (0, 0, 1440, 808),
}
def ink_mask(img, ref, roi):
    lum = img.mean(axis=2)
    spread = img.max(axis=2) - img.min(axis=2)
    ref_lum = ref.mean(axis=2)
    m = (lum < 70) & (spread < 40) & (ref_lum > 150)
    r = np.zeros_like(m); x0, y0, x1, y1 = roi; r[y0:y1, x0:x1] = True
    m &= r
    m[BANNER_Y:, :] = False
    return m

def rim(img, m, ref):
    """Rim: pixels in a 4 px band outside the ink that match neither the page nor the ink (a coloured edge), per unit
    of perimeter; and the soft-edge width (intermediate luminance across the boundary)."""
    ring = ndimage.binary_dilation(m, iterations=4) & ~m
    if ring.sum() == 0:
        return 0, 0
    far = np.abs(img - ref).sum(axis=2) > 90
    sat = (far & ring).sum() / max((ndimage.binary_dilation(m) & ~m).sum(), 1)
    lum = img.mean(axis=2)
    # soft edge width: pixels with intermediate luminance near the boundary, per unit of perimeter
    band = ndimage.binary_dilation(m, iterations=8) & ~ndimage.binary_erosion(m, iterations=8)
    per = (ndimage.binary_dilation(m) & ~m).sum()
    mid = band & (lum > 70) & (lum < 150)
    return float(sat), float(mid.sum() / max(per, 1))

rows = {}
for mk in d['marks']:
    name = mk['name']
    g = paths[name]
    ref_f = frame_at(mk['start'] - 120)
    ref = load(ref_f['i'])
    series = []
    for f in frames:
        if f['t'] < mk['start'] - 100 or f['t'] > mk['end'] + 2600:
            continue
        img = load(f['i'])
        m = ink_mask(img, ref, ROI[name])
        lab, n = ndimage.label(m)
        sizes = ndimage.sum(m, lab, range(1, n + 1)) if n else []
        comps = int(sum(1 for s in sizes if s >= 40))
        area = int(m.sum())
        if area:
            ys, xs = np.nonzero(m)
            cx, cy = float(xs.mean()), float(ys.mean())
            box = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
        else:
            cx = cy = None; box = None
        series.append({'t': f['t'] - mk['start'], 'i': f['i'], 'area': area, 'comps': comps, 'c': [cx, cy], 'box': box, 'm': m, 'img': img})
    dur = mk['end'] - mk['start']
    peak = max(series, key=lambda s: s['area'])
    end_s = min(series, key=lambda s: abs(s['t'] - dur))
    after = [s for s in series if s['t'] > dur]
    gone = next((s for s in after if s['t'] > peak['t'] and s['area'] < 0.02 * peak['area']), None)
    first = next((s for s in series if s['area'] > 200), None)
    # continuity at the end of the stroke: fraction of path samples with ink within 12 px
    em = end_s['m']
    dist = ndimage.distance_transform_edt(~em)
    pts = g['pts']
    cover = np.mean([dist[min(max(int(y), 0), em.shape[0] - 1), min(max(int(x), 0), em.shape[1] - 1)] <= 12 for x, y in pts if y < BANNER_Y])
    # thickness perpendicular to a horizontal path at its middle and the thickest point (end of stroke)
    thick_mid = thick_max = None
    if abs(g['end'][1] - g['start'][1]) < 1:
        xm = int((g['start'][0] + g['end'][0]) / 2)
        col = em[:, xm]
        thick_mid = int(col.sum())
        thick_max = int(em.sum(axis=0).max())
    sat, soft = rim(end_s['img'], end_s['m'], ref) if end_s['area'] else (0, 0)
    # drift after the pointer stops: the ink's leading edge past the pointer's end point, and centroid travel
    lead = None; ctravel = None
    if after and end_s['box']:
        dx = g['end'][0] - g['start'][0]; dy = g['end'][1] - g['start'][1]
        L = math.hypot(dx, dy) or 1
        ux, uy = dx / L, dy / L
        def front(s):
            if not s['area']:
                return None
            ys, xs = np.nonzero(s['m'])
            return float(((xs - g['end'][0]) * ux + (ys - g['end'][1]) * uy).max())
        fr = [front(s) for s in after if s['t'] < dur + 1500]
        fr = [v for v in fr if v is not None]
        lead = [round(front(end_s) or 0), round(max(fr)) if fr else None]
        cs = [s for s in after if s['area'] > 0.1 * peak['area'] and s['t'] < dur + 1500]
        if cs:
            ctravel = round(math.hypot(cs[-1]['c'][0] - end_s['c'][0], cs[-1]['c'][1] - end_s['c'][1])) if end_s['c'][0] is not None else None
    # fade curve relative to the stroke end, area normalised to the peak
    curve = []
    for ms in (0, 100, 200, 300, 400, 600, 800, 1000, 1200, 1500, 2000):
        s = min(series, key=lambda s: abs(s['t'] - (dur + ms)))
        curve.append(round(s['area'] / max(peak['area'], 1), 2))
    rows[name] = {
        'duration': round(dur), 'first_ink_ms': first['t'] if first else None,
        'peak_area': peak['area'], 'peak_after_end_ms': round(peak['t'] - dur),
        'life_after_end_ms': round(gone['t'] - dur) if gone else None,
        'pieces_at_end': end_s['comps'], 'pieces_max_after': max((s['comps'] for s in after), default=0),
        'path_covered_at_end': round(float(cover), 2), 'thick_mid': thick_mid, 'thick_max': thick_max,
        'box_at_end': end_s['box'], 'box_at_peak': peak['box'],
        'rim_px': round(float(sat), 2), 'soft_edge_px': round(soft, 1),
        'lead_past_end_px': lead, 'centroid_drift_px': ctravel, 'fade_curve': curve,
    }
out = {'site': d['site'], 'strokes': rows}
if '--json' in sys.argv:
    json.dump(out, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
for k, v in rows.items():
    print(k, json.dumps(v))

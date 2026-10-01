"""Compare two ink-measure.py JSON outputs stroke by stroke (key metrics side by side).
   python3 scripts/research/ink-compare.py <ref.json> <ours.json>
"""
import json, sys
a = json.load(open(sys.argv[1]))['strokes']; b = json.load(open(sys.argv[2]))['strokes']
keys = ['first_ink_ms', 'peak_area', 'life_after_end_ms', 'pieces_at_end', 'pieces_max_after', 'path_covered_at_end',
        'thick_mid', 'thick_max', 'rim_px', 'soft_edge_px', 'lead_past_end_px', 'centroid_drift_px', 'fade_curve']
def r(v):
    return round(v) if isinstance(v, float) and abs(v) > 2 else v
for s in b:
    if s not in a: continue
    print('==', s)
    for k in keys:
        print(f'  {k:20s} REF {str(r(a[s][k])):44s} OURS {r(b[s][k])}')

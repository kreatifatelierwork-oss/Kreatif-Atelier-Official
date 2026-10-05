"""Depth maps for the interim (pre-splat) worlds, with Depth Anything V2 Small (Apache-2.0) run locally on ONNX.

    <venv>/bin/python scripts/v5/depth.py <model.onnx> [names...]

Reads design-refs/plates/<name>.png, writes public/v5/depth/<name>.png: 8-bit relative disparity (white = near),
at 1022 px wide, used by the stage to displace each plate into real geometry.
"""
import sys, os
import numpy as np
import onnxruntime as ort
from PIL import Image

model, names = sys.argv[1], sys.argv[2:]
src, out = "design-refs/plates", "public/v5/depth"
os.makedirs(out, exist_ok=True)
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
if not names:
    names = [f[:-4] for f in sorted(os.listdir(src)) if f.endswith(".png") and not f.startswith(("p02", "p06", "p11", "p17", "p18"))]
mean, std = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])
for n in names:
    img = Image.open(f"{src}/{n}.png").convert("RGB")
    W, H = 1022, round(1022 * img.height / img.width / 14) * 14
    x = (np.asarray(img.resize((W, H), Image.BICUBIC), dtype=np.float32) / 255 - mean) / std
    d = sess.run(None, {"pixel_values": x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    lo, hi = np.percentile(d, 1), np.percentile(d, 99.5)
    d = np.clip((d - lo) / (hi - lo), 0, 1)
    Image.fromarray((d * 255).astype(np.uint8)).save(f"{out}/{n}.png", optimize=True)
    print(n, d.shape)

"""Cut the founder portraits out of their plain studio backgrounds (no ML model — a careful matte).

1. Background = smooth, bright, low-gradient pixels connected to the top/left/right borders (never the bottom edge,
   where white shirts meet the frame). Growing through low-gradient pixels follows soft shadows and gradients.
2. A local background colour is estimated from those pixels (normalised Gaussian convolution) so shadows don't halo.
3. In a narrow band around the subject, alpha = colour distance from the local background (keeps hair wisps soft).
4. Edge colours are decontaminated (the background's contribution is removed) so nothing glows white on dark.

Usage: python3 scripts/cutout-founders.py <srcDir> <outDir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

FILES = {"gourish": "Gourish_Formal1.png", "rohan": "Rohan_Formal1.png", "anwesha": "Anwesha_Formal.png", "aritra": "Aritra_Formal1.png"}


def matte(rgb):
    img = rgb.astype(np.float64)
    lum = img @ np.array([0.299, 0.587, 0.114])
    smooth = ndi.gaussian_filter(lum, 1.2)
    grad = np.hypot(ndi.sobel(smooth, 0), ndi.sobel(smooth, 1))
    h, w = lum.shape

    candidate = (lum > 150) & (grad < 14)
    labels, _ = ndi.label(candidate)
    border = np.concatenate([labels[0, :], labels[:, 0], labels[:, -1]])
    keep = np.unique(border[border > 0])
    bg = np.isin(labels, keep)
    bg = ndi.binary_opening(bg, iterations=1)

    # Local background colour everywhere (from confident background pixels only).
    core = ndi.binary_erosion(bg, iterations=3)
    sig = max(h, w) / 30
    wsum = ndi.gaussian_filter(core.astype(float), sig) + 1e-6
    bmap = np.stack([ndi.gaussian_filter(img[..., c] * core, sig) / wsum for c in range(3)], -1)
    # Far from any background sample the estimate is unreliable; fall back to the global background.
    glob = np.median(img[core], axis=0)
    conf = np.clip(wsum / 0.15, 0, 1)[..., None]
    bmap = bmap * conf + glob * (1 - conf)

    dist = np.linalg.norm(img - bmap, axis=-1)
    soft = np.clip((dist - 10) / 55, 0, 1)

    fg_dist = ndi.distance_transform_edt(~bg)   # distance into the subject
    bg_dist = ndi.distance_transform_edt(bg)    # distance into the background
    alpha = np.where(bg, 0.0, 1.0)
    band = (fg_dist <= 4) & ~bg
    alpha[band] = np.maximum(soft[band], np.clip(fg_dist[band] / 4, 0, 1) ** 2)
    outer = bg & (bg_dist <= 2)
    alpha[outer] = soft[outer] * 0.9            # wisps just outside the hard edge
    # Drop stray fragments (e.g. a shadow edge) that aren't attached to the person.
    solid, n = ndi.label(alpha > 0.5)
    if n > 1:
        sizes = ndi.sum(np.ones_like(alpha), solid, index=range(1, n + 1))
        main = solid == (int(np.argmax(sizes)) + 1)
        near = ndi.binary_dilation(main, iterations=6)
        alpha = np.where(near, alpha, 0.0)
    alpha = ndi.gaussian_filter(alpha, 0.6)
    # Choke: pull the edge in so the faint outer ring (mixed with the white background) disappears.
    alpha = np.clip((alpha - 0.3) / 0.62, 0, 1)
    alpha = ndi.gaussian_filter(alpha, 0.45)

    # Colour extension: edge pixels take their colour from the subject's interior (spread outward),
    # falling back to decontamination — so no white spill survives on dark or coloured backgrounds.
    interior = ndi.binary_erosion(alpha > 0.98, iterations=2)
    wgt = ndi.gaussian_filter(interior.astype(float), 2.2)
    ext = np.stack([ndi.gaussian_filter(img[..., c] * interior, 2.2) for c in range(3)], -1) / np.maximum(wgt, 1e-6)[..., None]
    a = np.maximum(alpha, 1e-3)[..., None]
    decon = np.clip((img - (1 - a) * bmap) / a, 0, 255)
    use_ext = (wgt > 0.02)[..., None]
    edge_rgb = np.where(use_ext, ext, decon)
    # Keep real detail where the pixel is mostly subject; replace where it's mostly background.
    mix = np.clip((alpha - 0.55) / 0.4, 0, 1)[..., None]
    edge_rgb = edge_rgb * (1 - mix) + decon * mix
    fg = np.where(alpha[..., None] > 0.97, img, edge_rgb)

    # Despill: fine hair picks up light from the white backdrop inside the subject too. Within ~3.5 px of the
    # edge, pull pixels that are *lighter* than the subject just inside them toward that deeper colour.
    depth = ndi.distance_transform_edt(alpha > 0.5)
    deep = ndi.binary_erosion(alpha > 0.98, iterations=5)
    dw = ndi.gaussian_filter(deep.astype(float), 3.0)
    deep_rgb = np.stack([ndi.gaussian_filter(img[..., c] * deep, 3.0) for c in range(3)], -1) / np.maximum(dw, 1e-6)[..., None]
    lum_w = np.array([0.299, 0.587, 0.114])
    spill = np.clip(((fg @ lum_w) - (deep_rgb @ lum_w) - 12) / 70, 0, 1)
    near_edge = np.clip(1 - depth / 3.5, 0, 1) * (dw > 0.02)
    w = (spill * near_edge)[..., None]
    fg = fg * (1 - w) + deep_rgb * w
    return np.dstack([np.clip(fg, 0, 255), alpha * 255]).astype(np.uint8)


if __name__ == "__main__":
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for slug, name in FILES.items():
        rgba = matte(np.array(Image.open(src / name).convert("RGB")))
        Image.fromarray(rgba, "RGBA").save(out / f"{slug}-cutout.png")
        print(slug, rgba.shape, f"{(rgba[..., 3] < 8).mean() * 100:.1f}% transparent")

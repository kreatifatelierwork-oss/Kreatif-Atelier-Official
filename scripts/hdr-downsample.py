"""Halve a Radiance .hdr (RGBE, new-style RLE) by 2x2 box filtering in linear light.
Usage: python3 scripts/hdr-downsample.py in.hdr out.hdr"""
import sys
import numpy as np


def read_hdr(path):
    data = open(path, "rb").read()
    pos = 0
    while True:  # header lines until a blank line
        end = data.index(b"\n", pos)
        line = data[pos:end]
        pos = end + 1
        if line == b"":
            break
    end = data.index(b"\n", pos)
    dims = data[pos:end].split()
    pos = end + 1
    h, w = int(dims[1]), int(dims[3])
    img = np.zeros((h, w, 4), dtype=np.uint8)
    buf = np.frombuffer(data, dtype=np.uint8)
    for y in range(h):
        if buf[pos] != 2 or buf[pos + 1] != 2:
            raise ValueError("only new-style RLE is supported")
        pos += 4
        for c in range(4):
            x = 0
            while x < w:
                count = int(buf[pos]); pos += 1
                if count > 128:
                    count -= 128
                    img[y, x:x + count, c] = buf[pos]; pos += 1
                else:
                    img[y, x:x + count, c] = buf[pos:pos + count]; pos += count
                x += count
    return img


def rgbe_to_float(img):
    e = img[..., 3].astype(np.int32)
    f = np.where(e > 0, np.ldexp(1.0, e - 136), 0.0)
    return img[..., :3].astype(np.float64) * f[..., None]


def float_to_rgbe(rgb):
    m = rgb.max(axis=-1)
    out = np.zeros(rgb.shape[:2] + (4,), dtype=np.uint8)
    nz = m > 1e-32
    mant, exp = np.frexp(m[nz])
    scale = mant * 256.0 / m[nz]
    out[nz, :3] = np.clip(rgb[nz] * scale[:, None], 0, 255).astype(np.uint8)
    out[nz, 3] = (exp + 128).astype(np.uint8)
    return out


def rle_channel(row):
    out = bytearray()
    i, n = 0, len(row)
    while i < n:
        run = 1
        while i + run < n and run < 127 and row[i + run] == row[i]:
            run += 1
        if run >= 3:
            out += bytes([128 + run, row[i]]); i += run
        else:
            j = i
            while j < n and j - i < 128:
                if j + 2 < n and row[j] == row[j + 1] == row[j + 2]:
                    break
                j += 1
            out += bytes([j - i]) + bytes(row[i:j]); i = j
    return out


def write_hdr(path, img):
    h, w = img.shape[:2]
    out = bytearray(b"#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n" + f"-Y {h} +X {w}\n".encode())
    for y in range(h):
        out += bytes([2, 2, (w >> 8) & 255, w & 255])
        for c in range(4):
            out += rle_channel(img[y, :, c].tobytes())
    open(path, "wb").write(out)


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    rgb = rgbe_to_float(read_hdr(src))
    h, w = rgb.shape[:2]
    small = rgb[: h - h % 2, : w - w % 2].reshape(h // 2, 2, w // 2, 2, 3).mean(axis=(1, 3))
    write_hdr(dst, float_to_rgbe(small))
    print(f"{w}x{h} -> {w // 2}x{h // 2}")

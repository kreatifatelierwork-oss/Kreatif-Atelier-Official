"""Side-by-side video of two ink-record.mjs captures (same scripted strokes), aligned frame by frame on the
recording clock, with the stroke name burned in. Encodes VP8 WebM with Playwright's bundled ffmpeg.
   python3 scripts/research/ink-sidebyside.py <capA> <capB> <out.webm> [--labels "buttermax.net,ours"] [--fps 60]
"""
import json, os, subprocess, sys, glob, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont
a, b, out = sys.argv[1:4]
args = sys.argv[4:]
opt = lambda n, d: args[args.index(n) + 1] if n in args else d
labels = opt('--labels', 'buttermax.net,ours').split(',')
fps = int(opt('--fps', '60'))
ffmpeg = sorted(glob.glob(os.path.expanduser('~/Library/Caches/ms-playwright/ffmpeg-*/ffmpeg-mac')))[-1]
da, db = json.load(open(f'{a}/index.json')), json.load(open(f'{b}/index.json'))
fa, fb = da['frames'], db['frames']
marks = da['marks']
W, H = 720, 450
try:
    font = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 15)
except OSError:
    font = ImageFont.load_default()
# This ffmpeg build only has the image2pipe demuxer: frames are written to a folder, then streamed in on stdin.
tmp = tempfile.mkdtemp(prefix='sbs-', dir=os.environ.get('TMPDIR'))
n = 0
j = 0
end = min(fa[-1]['t'], fb[-1]['t'])
t = max(fa[0]['t'], fb[0]['t'])
i = 0
while t <= end:
    while i + 1 < len(fa) and fa[i + 1]['t'] <= t: i += 1
    while j + 1 < len(fb) and fb[j + 1]['t'] <= t: j += 1
    ia = Image.open(f"{a}/f{fa[i]['i']:05d}.jpg").resize((W, H))
    ib = Image.open(f"{b}/f{fb[j]['i']:05d}.jpg").resize((W, H))
    frame = Image.new('RGB', (W * 2 + 8, H + 34), (20, 20, 24))
    frame.paste(ia, (0, 34)); frame.paste(ib, (W + 8, 34))
    d = ImageDraw.Draw(frame)
    stroke = next((m for m in reversed(marks) if m['start'] - 1500 <= t), None)
    name = f"{stroke['name']}  ({stroke.get('note', '')})" if stroke else ''
    d.text((10, 9), f"{labels[0]}", fill=(240, 240, 240), font=font)
    d.text((W + 18, 9), f"{labels[1]}", fill=(240, 240, 240), font=font)
    d.text((2 * W - 330, 9), f"{name}   t={t/1000:6.2f}s", fill=(230, 190, 110), font=font)
    frame.save(f'{tmp}/s{n:05d}.jpg', 'JPEG', quality=88); n += 1
    t += 1000 / fps
p = subprocess.Popen([ffmpeg, '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', str(fps),
                      '-i', 'pipe:0', '-c:v', 'libvpx', '-b:v', '6M', '-auto-alt-ref', '0', out], stdin=subprocess.PIPE)
for k in range(n):
    with open(f'{tmp}/s{k:05d}.jpg', 'rb') as fh:
        p.stdin.write(fh.read())
p.stdin.close()
if p.wait():
    sys.exit('ffmpeg failed')
shutil.rmtree(tmp)
print(out, os.path.getsize(out) // 1024, 'KB')

/**
 * Playing a portal clip (docs/design/FILM-SHOTLIST.md "Portals") in real time over the page change: the clip runs from
 * the home keyframe at the portal (e.g. h16) to the company page's first keyframe (a01), so when the new page's film
 * takes over underneath, its first frame is the portal's last and the handover is invisible. Decoded with the same
 * short-GOP H.264 + WebCodecs path as the film, drawn at the clip's frame rate; the last frame stays on the canvas.
 */
export async function playPortal(canvas: HTMLCanvasElement, base: string, id: string, variant: "d" | "m", fps = 24): Promise<void> {
  const [bytes, index] = await Promise.all([
    fetch(`${base}/${id}.${variant}.h264`).then((r) => r.arrayBuffer()),
    fetch(`${base}/${id}.${variant}.json`).then((r) => r.json() as Promise<[number, number, number][]>),
  ]);
  const data = new Uint8Array(bytes);
  const g = canvas.getContext("2d", { alpha: false })!;
  const frames: ImageBitmap[] = [];
  let done = false;
  const dec = new VideoDecoder({
    output: (f) => { createImageBitmap(f).then((b) => frames.push(b)).finally(() => f.close()); },
    error: () => { done = true; },
  });
  dec.configure({ codec: "avc1.4d0028", optimizeForLatency: true });
  index.forEach(([pos, size, key], i) => dec.decode(new EncodedVideoChunk({ type: key ? "key" : "delta", timestamp: i * (1e6 / fps), data: data.subarray(pos, pos + size) })));
  dec.flush().then(() => { done = true; }, () => { done = true; });
  const draw = (img: ImageBitmap) => {
    const W = canvas.width, H = canvas.height, s = Math.max(W / img.width, H / img.height), w = img.width * s, h = img.height * s;
    g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  };
  // Play at the clip's own rate as frames become ready (decoding runs well ahead of 24 fps).
  await new Promise<void>((resolve) => {
    const t0 = performance.now();
    let shown = -1;
    const tick = (now: number) => {
      const want = Math.min(index.length - 1, Math.floor(((now - t0) / 1000) * fps));
      const have = Math.min(want, frames.length - 1);
      if (have > shown && have >= 0) { draw(frames[have]); shown = have; }
      if (shown >= index.length - 1 || (done && shown >= frames.length - 1 && frames.length > 0 && want >= index.length - 1)) { resolve(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  try { dec.close(); } catch { /* closed */ }
  for (const f of frames.slice(0, -1)) f.close();
}

/**
 * The film player: one continuous long take per page, scrubbed exactly (docs/research/film-scrub.md).
 *
 * Each clip is short-GOP raw H.264 (keyint 12, no B-frames) with a frame index. A single WebCodecs VideoDecoder keeps
 * a window of decoded frames around the playhead, filled first in the direction of travel; what is drawn is always the
 * nearest decoded frame, so nothing ever blanks or jumps back. Clips stream on demand (the one under the playhead,
 * then its neighbours). Where a stretch has no clip yet, or WebCodecs is missing, or motion is reduced, the poster
 * still of the nearest keyframe is drawn instead.
 *
 * Global frames: clip k covers keys k → k+1; consecutive clips share their seam frame (the end frame of one equals the
 * start frame of the next), so key k sits at K[k] = Σ (frames − 1) of the clips before it.
 */
export type FilmClip = { id: string; frames: number };
export type FilmEntry = { fps: number; clips: FilmClip[]; keys: string[]; posters: Record<string, boolean>; portal: null | { id: string; frames: number; from: string } };

type Loaded = { data: Uint8Array; index: [number, number, number][] };

const CODEC = "avc1.4d0028";

export class FilmEngine {
  readonly K: number[] = [];
  private loaded = new Map<string, Loaded | Promise<Loaded>>();
  private posters = new Map<string, ImageBitmap | Promise<ImageBitmap | null> | null>();
  private cache = new Map<number, ImageBitmap>();
  private decoder: VideoDecoder | null = null;
  private outQueue: number[] = [];
  private busy = false;
  private shown = -1;
  private shownPoster: string | null = null;
  private dir = 1;
  private lastTarget = 0;
  private g: CanvasRenderingContext2D;
  readonly webcodecs: boolean;
  /** Frames drawn, and display frames where the drawn frame was not the one asked for (for the stats). */
  stats = { draws: 0, behind: 0, maxBehind: 0, posterDraws: 0 };

  constructor(private canvas: HTMLCanvasElement, private entry: FilmEntry, private base: string, private variant: "d" | "m", private stillOnly: boolean, private limit = variant === "d" ? 96 : 64) {
    this.g = canvas.getContext("2d", { alpha: false })!;
    let k = 0;
    this.K.push(0);
    for (const c of entry.clips) { k += c.frames - 1; this.K.push(k); }
    this.webcodecs = typeof window !== "undefined" && "VideoDecoder" in window && !stillOnly;
  }

  /** The last frame that has film (keys after it are posters only). */
  get filmEnd() { return this.K[this.K.length - 1]; }
  get hasFilm() { return this.entry.clips.length > 0 && this.webcodecs; }

  private url = (id: string, ext: string) => `${this.base}/${id}.${this.variant}.${ext}`;

  private load(i: number): Loaded | null {
    const c = this.entry.clips[i];
    if (!c) return null;
    const got = this.loaded.get(c.id);
    if (got && !(got instanceof Promise)) return got;
    if (!got) {
      const p = Promise.all([fetch(this.url(c.id, "h264")).then((r) => r.arrayBuffer()), fetch(this.url(c.id, "json")).then((r) => r.json())])
        .then(([b, index]) => { const l = { data: new Uint8Array(b), index }; this.loaded.set(c.id, l); return l; });
      p.catch(() => this.loaded.delete(c.id));
      this.loaded.set(c.id, p);
    }
    return null;
  }

  poster(key: string): ImageBitmap | null {
    const got = this.posters.get(key);
    if (got instanceof ImageBitmap) return got;
    if (got === undefined && this.entry.posters[key]) {
      const p = fetch(`${this.base}/k-${key}.${this.variant}.webp`).then((r) => r.blob()).then((b) => createImageBitmap(b))
        .then((bmp) => { this.posters.set(key, bmp); return bmp; }).catch(() => { this.posters.set(key, null); return null; });
      this.posters.set(key, p);
    }
    return null;
  }
  /** Start fetching the posters (small) so stills are ready before the film. */
  preloadPosters() { for (const k of this.entry.keys) this.poster(k); }

  private ensureDecoder() {
    if (this.decoder && this.decoder.state !== "closed") return this.decoder;
    this.outQueue = [];
    this.decoder = new VideoDecoder({
      output: (f) => {
        const n = this.outQueue.shift()!;
        createImageBitmap(f).then((b) => { this.cache.set(n, b); this.evict(); }).finally(() => f.close());
      },
      error: () => { this.decoder = null; this.busy = false; },
    });
    this.decoder.configure({ codec: CODEC, optimizeForLatency: true });
    return this.decoder;
  }

  private evict() {
    while (this.cache.size > this.limit) {
      let far = -1, fd = -1;
      for (const k of this.cache.keys()) { const d = Math.abs(k - this.lastTarget); if (d > fd) { fd = d; far = k; } }
      this.cache.get(far)?.close();
      this.cache.delete(far);
    }
  }

  /** Clip and local frame of a global frame (the seam frame belongs to the later clip). */
  private locate(gf: number) {
    for (let i = 0; i < this.entry.clips.length; i++) if (gf < this.K[i + 1] || i === this.entry.clips.length - 1) return { i, local: Math.min(gf - this.K[i], this.entry.clips[i].frames - 1) };
    return { i: 0, local: 0 };
  }

  /** Decode the group of frames holding global frame `gf` (one job at a time); `keyOnly` decodes just its keyframe
   *  (a single frame: the quickest way to put something near the playhead on screen during a fast move). */
  private decodeAround(gf: number, keyOnly = false) {
    const { i, local } = this.locate(gf);
    const l = this.load(i);
    if (!l) return;
    let k = local; while (k > 0 && !l.index[k][2]) k--;
    let e = k; while (!keyOnly && e + 1 < l.index.length && !l.index[e + 1][2]) e++;
    const dec = this.ensureDecoder();
    this.busy = true;
    for (let j = k; j <= e; j++) {
      this.outQueue.push(this.K[i] + j);
      const [pos, size, key] = l.index[j];
      dec.decode(new EncodedVideoChunk({ type: key ? "key" : "delta", timestamp: (this.K[i] + j) * 41667, data: l.data.subarray(pos, pos + size) }));
    }
    dec.flush().then(() => { this.busy = false; }, () => { this.busy = false; });
  }

  /** Keep the window filled: the frame asked for, then ahead in the direction of travel, then behind. */
  private pump(target: number) {
    // Stream the clips under and around the playhead.
    const { i } = this.locate(target);
    this.load(i); this.load(i + this.dir); this.load(i - this.dir);
    if (this.busy || !this.hasFilm) return;
    // Far from anything decoded (a fast move): first the keyframe at the target, alone, then fill in around it.
    let near = false;
    for (let d = 0; d <= 6 && !near; d++) near = this.cache.has(target + d) || this.cache.has(target - d);
    if (!near) {
      const { i, local } = this.locate(target);
      const l = this.load(i);
      if (l) { let k = local; while (k > 0 && !l.index[k][2]) k--; if (!this.cache.has(this.K[i] + k)) { this.decodeAround(target, true); return; } }
    }
    const order = [target];
    for (let k = 1; k <= 36; k++) order.push(target + this.dir * k);
    for (let k = 1; k <= 18; k++) order.push(target - this.dir * k);
    const miss = order.find((j) => j >= 0 && j <= this.filmEnd && !this.cache.has(j));
    if (miss != null) this.decodeAround(miss);
  }

  /**
   * Show the film at global frame `gf` (fractional allowed); `poster` names the key to show where there is no film.
   * Called once per display frame from the shared loop.
   */
  show(gf: number, posterKey: string | null) {
    const target = Math.max(0, Math.round(gf));
    if (target !== this.lastTarget) this.dir = Math.sign(target - this.lastTarget) || this.dir;
    this.lastTarget = target;
    if (posterKey || !this.hasFilm || target > this.filmEnd) {
      const key = posterKey ?? this.entry.keys[Math.min(this.entry.keys.length - 1, this.K.findIndex((k) => k >= target))];
      const bmp = key ? this.poster(key) : null;
      if (bmp && key !== this.shownPoster) { this.draw(bmp); this.shownPoster = key; this.shown = -1; this.stats.posterDraws++; }
      return;
    }
    this.pump(target);
    let best = -1, bd = Infinity;
    for (const k of this.cache.keys()) { const d = Math.abs(k - target); if (d < bd) { bd = d; best = k; } }
    if (best < 0) {
      // Nothing decoded yet: hold the poster of the nearest key so the frame is never blank.
      const key = this.entry.keys[this.K.reduce((b, k, j) => (Math.abs(k - target) < Math.abs(this.K[b] - target) ? j : b), 0)];
      const bmp = this.poster(key);
      if (bmp && key !== this.shownPoster) { this.draw(bmp); this.shownPoster = key; }
      return;
    }
    if (bd > 0) { this.stats.behind++; this.stats.maxBehind = Math.max(this.stats.maxBehind, bd); }
    if (best !== this.shown) { this.draw(this.cache.get(best)!); this.shown = best; this.shownPoster = null; this.stats.draws++; }
  }

  /** Cover-fit draw into the canvas (its backing size follows its CSS size × DPR, capped). */
  private draw(img: ImageBitmap) {
    const c = this.canvas, W = c.width, H = c.height;
    const s = Math.max(W / img.width, H / img.height), w = img.width * s, h = img.height * s;
    this.g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }
  /** Force a redraw of what is shown (after a resize). */
  redraw() { this.shown = -1; this.shownPoster = null; }

  dispose() {
    try { this.decoder?.close(); } catch { /* closed */ }
    for (const b of this.cache.values()) b.close();
    this.cache.clear();
    for (const p of this.posters.values()) if (p instanceof ImageBitmap) p.close();
  }
}

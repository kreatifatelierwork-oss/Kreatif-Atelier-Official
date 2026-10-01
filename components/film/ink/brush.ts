/**
 * The ink's brush: every pointer sample (coalesced events included, with their own timestamps) goes into a ring;
 * the solver asks for the brush's path over each fixed step. The brush follows the pointer's interpolated path with
 * exponential smoothing (τ ≈ 28 ms), so it trails slightly behind the pointer, as the reference does, and draws
 * the same curve at any frame rate or event rate. No allocations after construction.
 */

const N = 256;
/** Sub-steps per solver step: the polyline handed to the splat has SUB + 1 points. */
export const SUB = 8;

export class Brush {
  private xs = new Float64Array(N);
  private ys = new Float64Array(N);
  private ts = new Float64Array(N);
  /** Stroke id per sample: a new finger (touch) starts a new stroke, so no line is drawn between strokes. */
  private sid = new Int32Array(N);
  private head = -1;
  private count = 0;
  private stroke = 0;
  private placed = false;
  private brushSid = -1;
  private rx = 0;
  private ry = 0;
  private rsid = 0;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  tau: number;

  constructor(tau: number) {
    this.tau = tau;
  }

  /** Record a pointer sample (CSS px, ms on the performance.now clock). */
  push(x: number, y: number, t: number, newStroke = false) {
    if (newStroke && this.count) this.stroke++;
    if (this.count && t < this.ts[this.head]) t = this.ts[this.head];
    this.head = (this.head + 1) % N;
    this.xs[this.head] = x;
    this.ys[this.head] = y;
    this.ts[this.head] = t;
    this.sid[this.head] = this.stroke;
    this.count = Math.min(this.count + 1, N);
  }

  /** Time of the newest sample (or -Infinity). */
  get latest() {
    return this.count ? this.ts[this.head] : -Infinity;
  }

  /** The raw pointer position at time t: linear between the samples around it, held after the newest. */
  private raw(t: number) {
    if (!this.count) return false;
    let i = this.head;
    let k = 0;
    while (k < this.count - 1 && this.ts[i] > t) {
      i = (i - 1 + N) % N;
      k++;
    }
    if (this.ts[i] > t) return false; // before the first sample we still hold
    const j = (i + 1) % N;
    if (i !== this.head && this.sid[j] === this.sid[i]) {
      const span = this.ts[j] - this.ts[i];
      const u = span > 0 ? (t - this.ts[i]) / span : 1;
      this.rx = this.xs[i] + (this.xs[j] - this.xs[i]) * u;
      this.ry = this.ys[i] + (this.ys[j] - this.ys[i]) * u;
    } else {
      this.rx = this.xs[i];
      this.ry = this.ys[i];
    }
    this.rsid = this.sid[i];
    return true;
  }

  /** Put the brush where the pointer was at time t, without drawing (used when the ink wakes up). */
  place(t: number) {
    if (this.raw(t)) {
      this.x = this.rx;
      this.y = this.ry;
      this.brushSid = this.rsid;
      this.placed = true;
    }
  }

  /**
   * Advance the brush from t0 to t1 (ms). Writes the polyline it travelled into `out` (CSS px, x/y pairs) and
   * returns the number of points, or 0 when it hasn't moved. Sets vx/vy (px/s) over the step.
   */
  step(t0: number, t1: number, out: Float32Array) {
    const h = (t1 - t0) / SUB;
    const a = 1 - Math.exp(-h / this.tau);
    let n = 0;
    let len = 0;
    if (this.placed) {
      out[0] = this.x;
      out[1] = this.y;
      n = 1;
    }
    const sx = this.x, sy = this.y;
    let startX = sx, startY = sy;
    for (let s = 1; s <= SUB; s++) {
      if (!this.raw(t0 + h * s)) continue;
      if (!this.placed || this.rsid !== this.brushSid) {
        // First sample, or a new finger: jump there and start a fresh line.
        this.x = this.rx;
        this.y = this.ry;
        this.brushSid = this.rsid;
        this.placed = true;
        out[0] = this.x;
        out[1] = this.y;
        n = 1;
        len = 0;
        startX = this.x;
        startY = this.y;
        continue;
      }
      const px = this.x, py = this.y;
      this.x += (this.rx - this.x) * a;
      this.y += (this.ry - this.y) * a;
      len += Math.hypot(this.x - px, this.y - py);
      out[n * 2] = this.x;
      out[n * 2 + 1] = this.y;
      n++;
    }
    const secs = (t1 - t0) / 1000;
    this.vx = (this.x - startX) / secs;
    this.vy = (this.y - startY) / secs;
    return len > 0.02 ? n : 0;
  }
}

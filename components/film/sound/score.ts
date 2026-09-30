/**
 * The film's generated score (Web Audio, no audio files). Silent until the visitor chooses "Enter with sound".
 * - a warm pad in D (Lydian colour) whose filter follows the cursor's height and whose stereo image follows x;
 * - a "wet" shimmer (filtered noise) that rises with cursor speed, like the ink moving;
 * - cues: the flood's swell, soft plucks as the signature writes on, a glass chime when the Idea changes form.
 * Everything runs through one master gain so the mute toggle is instant and click-free.
 */
const PAD = [146.83, 220.0, 329.63, 369.99, 554.37]; // D3 A3 E4 F#4 C#5
const PLUCKS = [587.33, 739.99, 880.0, 1108.73]; // D5 F#5 A5 C#6

export class Score {
  private ctx: AudioContext;
  private master: GainNode;
  private padFilter: BiquadFilterNode;
  private padPan: StereoPannerNode;
  private shimmerGain: GainNode;
  private shimmerFilter: BiquadFilterNode;
  private shimmerPan: StereoPannerNode;
  private verb: ConvolverNode;
  private noise: AudioBuffer;
  readonly analyser: AnalyserNode;
  private muted = false;
  private level = 0.55;
  private calm: boolean;

  constructor(calm: boolean) {
    this.calm = calm;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // Reverb from a generated impulse (decaying stereo noise).
    this.verb = ctx.createConvolver();
    const len = Math.round(ctx.sampleRate * 2.8);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    this.verb.buffer = ir;
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.55;
    this.verb.connect(verbGain).connect(this.master);

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = this.noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // Pad.
    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.value = 900;
    this.padFilter.Q.value = 0.6;
    this.padPan = ctx.createStereoPanner();
    const padGain = ctx.createGain();
    padGain.gain.value = 0.16;
    this.padFilter.connect(this.padPan).connect(padGain);
    padGain.connect(this.master);
    padGain.connect(this.verb);
    PAD.forEach((f, i) => {
      for (const [type, detune, g] of [["sine", 0, 0.5], ["triangle", 7, 0.18]] as const) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = detune * (i % 2 ? 1 : -1);
        const og = ctx.createGain();
        og.gain.value = g / (1 + i * 0.35);
        // Slow, independent breathing per voice.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.023;
        const lg = ctx.createGain();
        lg.gain.value = og.gain.value * 0.45;
        lfo.connect(lg).connect(og.gain);
        o.connect(og).connect(this.padFilter);
        o.start(); lfo.start();
      }
    });

    // Shimmer: looping noise through a band-pass, gain driven by cursor speed.
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    this.shimmerFilter = ctx.createBiquadFilter();
    this.shimmerFilter.type = "bandpass";
    this.shimmerFilter.frequency.value = 2400;
    this.shimmerFilter.Q.value = 1.4;
    this.shimmerGain = ctx.createGain();
    this.shimmerGain.gain.value = 0;
    this.shimmerPan = ctx.createStereoPanner();
    src.connect(this.shimmerFilter).connect(this.shimmerGain).connect(this.shimmerPan);
    this.shimmerPan.connect(this.master);
    this.shimmerPan.connect(this.verb);
    src.start();
  }

  get running() { return this.ctx.state === "running"; }

  async start() {
    await this.ctx.resume();
    this.fadeTo(this.muted ? 0 : this.level, 1.6);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (!m && this.ctx.state !== "running") this.ctx.resume();
    this.fadeTo(m ? 0 : this.level, 0.25);
  }

  /** Fade out when the tab is hidden, back in when visible. */
  setVisible(v: boolean) {
    if (this.muted) return;
    this.fadeTo(v ? this.level : 0, v ? 0.8 : 0.3);
  }

  private fadeTo(v: number, s: number) {
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(v, t + s);
  }

  /** Called every frame: pointer in 0..1 (x, y from top), speed in px/s. */
  update(x: number, y: number, speed: number) {
    const t = this.ctx.currentTime;
    this.padFilter.frequency.setTargetAtTime(520 + (1 - y) * 2200, t, 0.25);
    this.padPan.pan.setTargetAtTime((x - 0.5) * 0.6, t, 0.3);
    const wet = this.calm ? 0 : Math.min(1, speed / 2600);
    this.shimmerGain.gain.setTargetAtTime(wet * 0.09, t, wet > 0.02 ? 0.05 : 0.35);
    this.shimmerFilter.frequency.setTargetAtTime(1600 + wet * 4200, t, 0.1);
    this.shimmerPan.pan.setTargetAtTime((x - 0.5) * 1.4, t, 0.05);
  }

  /** The flood: an airy swell and a low bloom under it. */
  flood() {
    if (this.calm) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = ctx.createBufferSource();
    n.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.Q.value = 0.9;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(5200, t + 0.55);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 1.3);
    n.connect(f).connect(g).connect(this.verb);
    g.connect(this.master);
    n.start(t); n.stop(t + 1.4);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(110, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(73.4, t + 1.4);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, t + 0.3);
    og.gain.linearRampToValueAtTime(0.28, t + 0.45);
    og.gain.exponentialRampToValueAtTime(0.0008, t + 2.2);
    o.connect(og).connect(this.master);
    o.start(t + 0.3); o.stop(t + 2.3);
  }

  /** Soft plucks spread over the signature's write-on. */
  write(ms: number) {
    const t0 = this.ctx.currentTime;
    PLUCKS.forEach((f, i) => this.tone(f, t0 + (ms / 1000) * (i / PLUCKS.length), 0.07, 1.6));
  }

  /** A glassy chime when the Idea changes form. */
  chime(step: number) {
    const f = PLUCKS[step % PLUCKS.length] * 2;
    const t = this.ctx.currentTime;
    this.tone(f, t, 0.05, 2.2);
    this.tone(f * 1.5, t + 0.04, 0.025, 1.8);
  }

  private tone(freq: number, at: number, gain: number, decay: number) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0005, at + decay);
    o.connect(g);
    g.connect(this.master);
    g.connect(this.verb);
    o.start(at); o.stop(at + decay + 0.1);
  }

  dispose() { this.ctx.close(); }
}

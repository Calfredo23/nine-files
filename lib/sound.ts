export type SoundName =
  | "pin"
  | "paper"
  | "stamp"
  | "pluck"
  | "type"
  | "win"
  | "draw"
  | "click"
  | "voice";

type AudioContextConstructor = typeof AudioContext;

const MUSIC_BEAT = 60 / 72;
const CHORDS: readonly (readonly number[])[] = [
  [110, 130.81, 164.81, 196],
  [146.83, 174.61, 220, 261.63],
  [164.81, 207.65, 246.94, 293.66],
  [110, 130.81, 164.81, 196],
];
const ROOTS = [110, 146.83, 164.81, 110];
const MELODY = [440, 523.25, 659.25, 783.99];

class SoundEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private noise: AudioBuffer | null = null;

  private musicOn = false;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicNext = 0;
  private musicStep = 0;

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.35,
        this.context.currentTime,
        0.02,
      );
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMusicOn(on: boolean): void {
    this.musicOn = on;
    if (!this.context || !this.musicGain) {
      return;
    }
    if (on) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  isMusicOn(): boolean {
    return this.musicOn;
  }

  unlock(): void {
    const context = this.ensure();
    if (!context) {
      return;
    }
    if (context.state === "suspended") {
      void context.resume();
    }
    if (this.musicOn) {
      this.startMusic();
    }
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }
    if (this.context) {
      if (this.context.state === "suspended") {
        void this.context.resume();
      }
      return this.context;
    }
    const ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextConstructor })
        .webkitAudioContext;
    if (!ctor) {
      return null;
    }
    try {
      const context = new ctor();
      const master = context.createGain();
      master.gain.value = this.muted ? 0 : 0.35;
      master.connect(context.destination);
      const musicGain = context.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(context.destination);
      this.context = context;
      this.master = master;
      this.musicGain = musicGain;
      if (this.musicOn) {
        this.startMusic();
      }
      return context;
    } catch {
      return null;
    }
  }

  private noiseBuffer(context: AudioContext): AudioBuffer {
    if (this.noise) {
      return this.noise;
    }
    const length = Math.floor(context.sampleRate * 0.6);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noise = buffer;
    return buffer;
  }

  private startMusic(): void {
    const context = this.context;
    if (!context || !this.musicGain || !this.musicOn) {
      return;
    }
    if (this.musicTimer !== null) {
      return;
    }
    this.musicGain.gain.setTargetAtTime(0.3, context.currentTime, 0.5);
    this.musicNext = context.currentTime + 0.15;
    this.musicStep = 0;
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 220);
    this.scheduleMusic();
  }

  private stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.context && this.musicGain) {
      this.musicGain.gain.setTargetAtTime(0, this.context.currentTime, 0.25);
    }
  }

  private scheduleMusic(): void {
    const context = this.context;
    if (!context || !this.musicGain || !this.musicOn) {
      return;
    }
    const horizon = context.currentTime + 0.45;
    while (this.musicNext < horizon) {
      this.scheduleBeat(this.musicNext, this.musicStep);
      this.musicNext += MUSIC_BEAT;
      this.musicStep += 1;
    }
  }

  private scheduleBeat(time: number, step: number): void {
    const bar = Math.floor(step / 4) % CHORDS.length;
    const beat = step % 4;

    if (beat === 0) {
      CHORDS[bar].forEach((note, index) => {
        this.musicTone(note, time + index * 0.015, 3.1, 0.032, "triangle", 900);
      });
    }

    if (beat === 0 || beat === 2) {
      this.musicTone(ROOTS[bar], time, 0.8, 0.07, "sine", 420);
    }

    this.musicNoise(time, 0.06, 0.018, "highpass", 3600);

    if (beat === 3 && (bar === 1 || bar === 3)) {
      const note = MELODY[(bar + Math.floor(step / 16)) % MELODY.length];
      this.musicTone(note, time + 0.05, 1.1, 0.04, "sine", 2000);
    }

    if (Math.random() < 0.18) {
      this.musicNoise(
        time + 0.1 + Math.random() * 0.4,
        0.02,
        0.007,
        "highpass",
        1800,
      );
    }
  }

  private musicTone(
    frequency: number,
    start: number,
    duration: number,
    gain: number,
    type: OscillatorType,
    filterFrequency: number,
  ): void {
    const context = this.context;
    const out = this.musicGain;
    if (!context || !out) {
      return;
    }
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    filter.type = "lowpass";
    filter.frequency.value = filterFrequency;
    filter.Q.value = 0.6;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(
      gain,
      start + Math.min(0.8, duration * 0.35),
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(out);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  private musicNoise(
    start: number,
    duration: number,
    gain: number,
    filterType: BiquadFilterType,
    frequency: number,
  ): void {
    const context = this.context;
    const out = this.musicGain;
    if (!context || !out) {
      return;
    }
    const source = context.createBufferSource();
    source.buffer = this.noiseBuffer(context);
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(out);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  private tone(
    frequency: number,
    duration: number,
    gain: number,
    type: OscillatorType,
    endFrequency?: number,
    delay = 0,
  ): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master) {
      return;
    }
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency !== undefined) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(endFrequency, 1),
        start + duration,
      );
    }
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.006);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private burst(
    duration: number,
    gain: number,
    filterType: BiquadFilterType,
    frequency: number,
    delay = 0,
  ): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master) {
      return;
    }
    const start = context.currentTime + delay;
    const source = context.createBufferSource();
    source.buffer = this.noiseBuffer(context);
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(master);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  play(name: SoundName): void {
    if (this.muted) {
      return;
    }
    const context = this.ensure();
    if (!context || !this.master) {
      return;
    }

    switch (name) {
      case "pin":
        this.burst(0.04, 0.16, "highpass", 1800);
        this.tone(1180, 0.05, 0.06, "triangle", 720);
        break;
      case "paper":
        this.burst(0.1, 0.07, "lowpass", 900);
        this.tone(170, 0.09, 0.035, "sine", 110);
        break;
      case "stamp":
        this.tone(72, 0.2, 0.18, "sine", 42);
        this.burst(0.13, 0.14, "lowpass", 520);
        break;
      case "pluck":
        this.tone(196, 0.2, 0.07, "sawtooth", 172);
        this.burst(0.025, 0.05, "highpass", 3200);
        break;
      case "type":
        this.burst(0.018, 0.06, "highpass", 2600);
        this.tone(1380, 0.018, 0.025, "square", 920);
        break;
      case "click":
        this.tone(320, 0.045, 0.045, "square", 240);
        break;
      case "voice": {
        const base = 175 + Math.random() * 95;
        this.tone(base, 0.055, 0.032, "triangle", base * 0.76);
        this.burst(0.018, 0.014, "bandpass", 1100 + Math.random() * 500);
        break;
      }
      case "win": {
        const notes = [220, 261.63, 329.63, 392, 523.25];
        notes.forEach((note, index) => {
          this.tone(note, 0.42, 0.08, "triangle", note, index * 0.07);
        });
        this.tone(110, 0.7, 0.05, "sine", 108, 0.02);
        break;
      }
      case "draw":
        this.tone(164.81, 0.55, 0.07, "sine", 158);
        this.tone(123.47, 0.75, 0.05, "sine", 118, 0.12);
        break;
      default:
        break;
    }
  }
}

export const sound = new SoundEngine();

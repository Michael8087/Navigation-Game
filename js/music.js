/* Background music, generated as it plays — no audio files to ship.
   A slow four-chord loop with a pad, a bass note and a sparse melody on top,
   which suits balloons better than anything with a beat. */

const BEAT = 0.62;
const BEATS_PER_BAR = 4;
const MUSIC_LEVEL = 0.16;

/* I – V – vi – IV in D, as MIDI numbers: [bass, then the chord voicing] */
const PROGRESSION = [
  [38, 62, 66, 69], // D
  [33, 61, 64, 69], // A
  [35, 59, 62, 66], // Bm
  [31, 55, 59, 62]  // G
];

/* D major pentatonic, an octave up — anything from here fits any of the four */
const MELODY = [74, 76, 78, 81, 83, 86];

const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);

const Music = {
  ctx: null,
  bus: null,
  timer: null,
  playing: false,
  step: 0,
  nextTime: 0,

  note(midi, time, dur, type, peak, attack) {
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.linearRampToValueAtTime(peak, time + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(amp).connect(this.bus);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  },

  scheduleStep(step, time) {
    const chord = PROGRESSION[Math.floor(step / BEATS_PER_BAR) % PROGRESSION.length];
    const beat = step % BEATS_PER_BAR;
    const barLen = BEAT * BEATS_PER_BAR;

    if (beat === 0) {
      /* the pad swells across the whole bar */
      for (const midi of chord.slice(1)) {
        this.note(midi, time, barLen * 1.05, 'sine', 0.13, 0.55);
      }
      this.note(chord[0], time, barLen * 0.75, 'triangle', 0.16, 0.04);
    }

    if (beat === 2) this.note(chord[0] + 12, time, BEAT * 1.1, 'triangle', 0.08, 0.04);

    /* one chord tone plucked every beat keeps it moving */
    this.note(chord[1 + (step % 3)] + 12, time, BEAT * 0.85, 'sine', 0.05, 0.03);

    /* and a melody note now and then, never on the downbeat */
    if (beat !== 0 && Math.random() < 0.45) {
      const midi = MELODY[(Math.random() * MELODY.length) | 0];
      this.note(midi, time + BEAT * 0.25, BEAT * 0.9, 'triangle', 0.07, 0.02);
    }
  },

  tick() {
    /* schedule a little ahead of the clock so timing never depends on the timer */
    while (this.nextTime < this.ctx.currentTime + 0.5) {
      this.scheduleStep(this.step, this.nextTime);
      this.step++;
      this.nextTime += BEAT;
    }
  },

  start(ctx) {
    if (this.playing) return;
    this.ctx = ctx;

    if (!this.bus) {
      this.bus = ctx.createGain();
      const warm = ctx.createBiquadFilter();
      warm.type = 'lowpass';
      warm.frequency.value = 1800;
      this.bus.connect(warm).connect(ctx.destination);
    }

    this.playing = true;
    this.nextTime = ctx.currentTime + 0.15;
    this.bus.gain.cancelScheduledValues(ctx.currentTime);
    this.bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.bus.gain.linearRampToValueAtTime(MUSIC_LEVEL, ctx.currentTime + 1.4);

    this.tick();
    this.timer = setInterval(() => this.tick(), 60);
  },

  stop() {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    this.timer = null;
    const now = this.ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setValueAtTime(this.bus.gain.value, now);
    this.bus.gain.linearRampToValueAtTime(0.0001, now + 0.7);
  }
};

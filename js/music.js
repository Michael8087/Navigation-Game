/* Background music, generated as it plays — no audio files to ship.

   Three tracks share one engine. A track is a chord loop, a written melody and
   a handful of tone settings; the player schedules pad, bass, an arpeggio
   figure and the tune, with an echo on everything. */

const BEATS_PER_BAR = 4;
/* Peaks around -18dBFS. It was a third of this, which is fine on a laptop and
   inaudible on a phone speaker. */
const MUSIC_LEVEL = 0.42;

const TRACKS = [
  {
    id: 'drift',
    name: 'Drift',
    bpm: 78,
    /* Fmaj7 – Am7 – B♭maj7 – C6/9 – Dm7 – B♭maj7 – Gm7 – C */
    progression: [
      { bass: 41, notes: [65, 69, 72, 76] },
      { bass: 45, notes: [64, 67, 69, 72] },
      { bass: 46, notes: [65, 69, 70, 74] },
      { bass: 48, notes: [64, 67, 69, 74] },
      { bass: 50, notes: [65, 69, 72, 74] },
      { bass: 46, notes: [65, 69, 70, 74] },
      { bass: 43, notes: [62, 65, 70, 74] },
      { bass: 48, notes: [64, 67, 72, 76] }
    ],
    melody: [
      { t: 2.0, midi: 69, dur: 1.2 }, { t: 3.5, midi: 72, dur: 0.8 },
      { t: 4.0, midi: 74, dur: 1.4 }, { t: 5.5, midi: 72, dur: 0.8 }, { t: 6.5, midi: 69, dur: 1.2 },
      { t: 8.0, midi: 70, dur: 1.4 }, { t: 9.5, midi: 74, dur: 0.8 }, { t: 10.5, midi: 77, dur: 1.4 },
      { t: 12.0, midi: 76, dur: 2.6 },
      { t: 16.0, midi: 74, dur: 1.4 }, { t: 17.5, midi: 69, dur: 0.8 }, { t: 18.5, midi: 72, dur: 1.2 },
      { t: 20.0, midi: 70, dur: 1.4 }, { t: 21.5, midi: 65, dur: 0.8 }, { t: 22.5, midi: 69, dur: 1.2 },
      { t: 24.0, midi: 67, dur: 1.4 }, { t: 25.5, midi: 70, dur: 0.8 }, { t: 26.5, midi: 74, dur: 1.2 },
      { t: 28.0, midi: 72, dur: 3.0 }
    ],
    arpPerBeat: 2, arpOctave: 12, arpPeak: 0.032,
    padPeak: 0.042, bassBeats: [0, 2], bassPeak: 0.085,
    melodyPeak: 0.075, echoFeedback: 0.32, echoWet: 0.4, tone: 2400
  },

  {
    id: 'sunny',
    name: 'Sunny',
    bpm: 104,
    /* C – Em7 – F – G – Am7 – F – G – C */
    progression: [
      { bass: 48, notes: [64, 67, 72, 76] },
      { bass: 52, notes: [64, 67, 71, 74] },
      { bass: 41, notes: [65, 69, 72, 77] },
      { bass: 43, notes: [62, 67, 71, 74] },
      { bass: 45, notes: [64, 69, 72, 76] },
      { bass: 41, notes: [65, 69, 72, 77] },
      { bass: 43, notes: [62, 67, 71, 74] },
      { bass: 48, notes: [64, 67, 72, 76] }
    ],
    melody: [
      { t: 0.0, midi: 72, dur: 0.9 }, { t: 1.0, midi: 76, dur: 0.9 }, { t: 2.0, midi: 79, dur: 1.4 }, { t: 3.5, midi: 76, dur: 0.5 },
      { t: 4.0, midi: 74, dur: 0.9 }, { t: 5.0, midi: 71, dur: 0.9 }, { t: 6.0, midi: 74, dur: 1.8 },
      { t: 8.0, midi: 77, dur: 0.9 }, { t: 9.0, midi: 72, dur: 0.9 }, { t: 10.0, midi: 69, dur: 1.6 },
      { t: 12.0, midi: 71, dur: 0.9 }, { t: 13.0, midi: 74, dur: 0.9 }, { t: 14.0, midi: 79, dur: 1.8 },
      { t: 16.0, midi: 76, dur: 0.9 }, { t: 17.0, midi: 72, dur: 0.9 }, { t: 18.0, midi: 69, dur: 1.6 },
      { t: 20.0, midi: 65, dur: 0.9 }, { t: 21.0, midi: 69, dur: 0.9 }, { t: 22.0, midi: 72, dur: 1.8 },
      { t: 24.0, midi: 74, dur: 0.9 }, { t: 25.0, midi: 71, dur: 0.9 }, { t: 26.0, midi: 67, dur: 1.6 },
      { t: 28.0, midi: 72, dur: 2.8 }
    ],
    arpPerBeat: 3, arpOctave: 12, arpPeak: 0.03,
    padPeak: 0.03, bassBeats: [0, 1.5, 2, 3.5], bassPeak: 0.075,
    melodyPeak: 0.07, echoFeedback: 0.22, echoWet: 0.26, tone: 3000
  },

  {
    id: 'nocturne',
    name: 'Nocturne',
    bpm: 62,
    /* Am7 – Dm7 – Fmaj7 – Cmaj7 – Am7 – Em7 – Fmaj7 – G */
    progression: [
      { bass: 45, notes: [64, 67, 69, 72] },
      { bass: 50, notes: [65, 69, 72, 74] },
      { bass: 41, notes: [65, 69, 72, 76] },
      { bass: 48, notes: [64, 67, 71, 76] },
      { bass: 45, notes: [64, 67, 69, 72] },
      { bass: 52, notes: [62, 67, 71, 74] },
      { bass: 41, notes: [65, 69, 72, 76] },
      { bass: 43, notes: [62, 67, 71, 74] }
    ],
    melody: [
      { t: 2.0, midi: 76, dur: 2.0 },
      { t: 6.0, midi: 72, dur: 2.0 },
      { t: 8.0, midi: 69, dur: 2.5 },
      { t: 12.0, midi: 71, dur: 3.0 },
      { t: 18.0, midi: 76, dur: 2.0 },
      { t: 22.0, midi: 74, dur: 2.0 },
      { t: 26.0, midi: 72, dur: 2.5 },
      { t: 29.0, midi: 69, dur: 3.0 }
    ],
    arpPerBeat: 1, arpOctave: 12, arpPeak: 0.034,
    padPeak: 0.05, bassBeats: [0], bassPeak: 0.09,
    melodyPeak: 0.07, echoFeedback: 0.4, echoWet: 0.5, tone: 1900
  }
];

const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);

const Music = {
  ctx: null,
  master: null,
  echo: null,
  echoFeedback: null,
  echoWet: null,
  filter: null,
  timer: null,
  swap: null,
  playing: false,
  track: TRACKS[0],
  step: 0,
  nextTime: 0,

  get beat() {
    return 60 / this.track.bpm;
  },

  get loopBeats() {
    return this.track.progression.length * BEATS_PER_BAR;
  },

  /* One voice. `send` is how much of it goes to the echo, `spread` its pan.

     `sustain` is what keeps a chord audible: an exponential ramp straight from
     the peak to silence loses 90% of its level in the first third of the note,
     so a pad written to last a bar is effectively gone by the halfway point
     and the track pumps once per bar. Anything meant to be held gets a
     sustain level and a release; plucks pass 0 and decay as before. */
  voice(midi, time, dur, opts) {
    const {
      type = 'sine', peak = 0.1, attack = 0.02, sustain = 0, release = 0.3,
      detune = 0, send = 0, spread = 0
    } = opts;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    osc.detune.value = detune;

    const g = amp.gain;
    g.setValueAtTime(0.0001, time);
    g.linearRampToValueAtTime(peak, time + attack);
    if (sustain > 0) {
      const rel = Math.min(dur * release, dur - attack - 0.02);
      g.linearRampToValueAtTime(peak * sustain, time + dur - rel);
    }
    g.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(amp);

    let out = amp;
    if (spread) {
      const pan = this.ctx.createStereoPanner();
      pan.pan.value = spread;
      amp.connect(pan);
      out = pan;
    }
    out.connect(this.master);

    if (send) {
      const tap = this.ctx.createGain();
      tap.gain.value = send;
      out.connect(tap).connect(this.echo);
    }

    osc.start(time);
    osc.stop(time + dur + 0.05);
  },

  scheduleStep(step, time) {
    const t = this.track;
    const beatLen = this.beat;
    const pos = step % this.loopBeats;
    const bar = Math.floor(pos / BEATS_PER_BAR);
    const beat = pos % BEATS_PER_BAR;
    const chord = t.progression[bar];
    const barLen = beatLen * BEATS_PER_BAR;

    if (beat === 0) {
      /* the pad, each note doubled and pulled slightly apart for warmth. It
         holds across the bar and overlaps the next one, so the chords join up
         instead of leaving a hole in the second half of every bar. */
      for (const midi of chord.notes) {
        for (const detune of [-6, 6]) {
          /* holds at level right up to the bar line, then releases into the
             next chord's attack — the release must not start early or the bar
             ends on a hole */
          this.voice(midi, time, barLen * 1.18, {
            peak: t.padPeak, attack: barLen * 0.16, sustain: 0.85, release: 0.15, detune
          });
        }
      }
    }

    for (const b of t.bassBeats) {
      if (Math.floor(b) === beat && b % 1 === 0) {
        this.voice(chord.bass, time, beatLen * 1.9, {
          type: 'triangle', peak: t.bassPeak, attack: 0.04, sustain: 0.4, release: 0.5
        });
      } else if (Math.floor(b) === beat) {
        this.voice(chord.bass + 12, time + (b % 1) * beatLen, beatLen * 0.8,
          { type: 'triangle', peak: t.bassPeak * 0.6, attack: 0.03, sustain: 0.3, release: 0.5 });
      }
    }

    /* a music-box figure, alternating across the stereo field */
    for (let i = 0; i < t.arpPerBeat; i++) {
      const idx = (step * t.arpPerBeat + i) % chord.notes.length;
      this.voice(chord.notes[idx] + t.arpOctave, time + (i / t.arpPerBeat) * beatLen, beatLen * 0.9, {
        peak: t.arpPeak, attack: 0.01, send: 0.5, spread: i % 2 ? 0.45 : -0.45
      });
    }

    /* the tune holds off for two bars, so each track opens by settling in */
    if (step >= BEATS_PER_BAR * 2) {
      for (const n of t.melody) {
        if (n.t >= pos && n.t < pos + 1) {
          this.voice(n.midi, time + (n.t - pos) * beatLen, n.dur * beatLen, {
            type: 'triangle', peak: t.melodyPeak, attack: 0.05,
            sustain: 0.62, release: 0.38, send: 0.4
          });
        }
      }
    }
  },

  tick() {
    const now = this.ctx.currentTime;

    /* Phone browsers stall timers while the tab is in the background, so the
       scheduler can come back seconds behind. Catching up beat by beat would
       dump every missed note into the output at once, so skip to the present
       instead. */
    if (this.nextTime < now) {
      const missed = Math.ceil((now - this.nextTime) / this.beat);
      this.step += missed;
      this.nextTime += missed * this.beat;
    }

    /* schedule ahead of the clock, so timing never depends on the timer */
    while (this.nextTime < now + 0.5) {
      this.scheduleStep(this.step, this.nextTime);
      this.step++;
      this.nextTime += this.beat;
    }
  },

  build(ctx) {
    this.master = ctx.createGain();
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';

    this.echo = ctx.createDelay(1);
    this.echoFeedback = ctx.createGain();
    this.echoWet = ctx.createGain();

    this.echo.connect(this.echoFeedback).connect(this.echo);
    this.echo.connect(this.echoWet).connect(this.master);
    this.master.connect(this.filter).connect(ctx.destination);
  },

  /* the echo and the tone colour belong to the track, not the engine */
  applyTrack() {
    this.echo.delayTime.value = this.beat * 0.75;
    this.echoFeedback.gain.value = this.track.echoFeedback;
    this.echoWet.gain.value = this.track.echoWet;
    this.filter.frequency.value = this.track.tone;
  },

  fadeIn(seconds) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0.0001, now);
    this.master.gain.linearRampToValueAtTime(MUSIC_LEVEL, now + seconds);
  },

  fadeOut(seconds) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.0001, now + seconds);
  },

  run(fadeSeconds) {
    this.applyTrack();
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.15;
    this.fadeIn(fadeSeconds);
    this.tick();
    this.timer = setInterval(() => this.tick(), 60);
  },

  /* Pick a track. If one is already playing, duck out of it and into the new
     one rather than cutting, and never leave two schedulers running. */
  select(id) {
    const next = TRACKS.find(t => t.id === id);
    if (!next || next === this.track) return;
    this.track = next;
    if (!this.playing) return;

    clearInterval(this.timer);
    clearTimeout(this.swap);
    this.fadeOut(0.35);
    this.swap = setTimeout(() => this.run(1), 420);
  },

  start(ctx) {
    if (this.playing) return;
    this.ctx = ctx;
    if (!this.master) this.build(ctx);
    this.playing = true;
    this.run(2);
  },

  stop() {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    clearTimeout(this.swap);
    this.timer = null;
    this.swap = null;
    this.fadeOut(0.9);
  }
};

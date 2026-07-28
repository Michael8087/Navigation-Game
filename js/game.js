/* Navigation Game — pop the balloons, keep the cars. */

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const MAX_BALLOONS = 7;
const MAX_PARKED = 5;
const GROUND_H = 130;
const ROAD_H = 54;
const CAR_SCALE = 1;

const state = {
  w: 0, h: 0, ground: 0, road: 0,
  t: 0,
  balloons: [],
  particles: [],
  drivers: [],
  parked: [],
  clouds: [],
  spawnIn: 0.6,
  pointer: { x: -999, y: -999, thrust: 0 },
  speed: 1,
  sfx: true,
  music: true,
  paused: false
};

const SPEED_KEY = 'navigation-game.speed';
const SFX_KEY = 'navigation-game.sfx';
const MUSIC_KEY = 'navigation-game.music';
const TRACK_KEY = 'navigation-game.track';

Garage.load();

/* ---------- canvas ---------- */

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.w = window.innerWidth;
  state.h = window.innerHeight;
  state.ground = state.h - GROUND_H;
  state.road = state.ground + ROAD_H * 0.78;
  canvas.width = state.w * dpr;
  canvas.height = state.h * dpr;
  canvas.style.width = state.w + 'px';
  canvas.style.height = state.h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!state.clouds.length) seedClouds();
}

function seedClouds() {
  state.clouds = Array.from({ length: 7 }, () => ({
    x: Math.random() * state.w,
    y: 40 + Math.random() * (state.h * 0.45),
    s: 0.6 + Math.random() * 0.9,
    v: 4 + Math.random() * 9
  }));
}

window.addEventListener('resize', resize);

/* ---------- sound ---------- */

let audio = null;

/* Browsers won't let a page make a sound before the user has interacted, so
   the context is built on demand and resumed on the first gesture. iOS wants
   something actually played from inside that gesture before it counts the
   context as unlocked, hence the one-sample buffer. */
function ensureAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    const nudge = audio.createBufferSource();
    nudge.buffer = audio.createBuffer(1, 1, 22050);
    nudge.connect(audio.destination);
    nudge.start(0);
  }
  if (audio.state !== 'running') audio.resume();
  return audio;
}

function tone(type, freq, dur, gain = 0.14, slideTo = null) {
  if (!state.sfx) return;
  ensureAudio();
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, audio.currentTime + dur);
  amp.gain.setValueAtTime(gain, audio.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  osc.connect(amp).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur + 0.02);
}

const sfx = {
  pop:     () => { tone('square', 520, 0.13, 0.2, 90); tone('triangle', 1200, 0.06, 0.1); },
  miss:    () => tone('sine', 320, 0.05, 0.05),
  thud:    () => tone('sine', 120, 0.16, 0.16, 60),
  collect: () => { tone('triangle', 660, 0.1, 0.12); setTimeout(() => tone('triangle', 990, 0.16, 0.12), 90); }
};

/* ---------- particles ---------- */

function burst(x, y, colors, n, spread = 220) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = spread * (0.3 + Math.random() * 0.7);
    state.particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 60,
      life: 0.7 + Math.random() * 0.6,
      age: 0,
      size: 2 + Math.random() * 4,
      spin: (Math.random() - 0.5) * 12,
      rot: Math.random() * 6,
      color: colors[(Math.random() * colors.length) | 0],
      gravity: 520
    });
  }
}

function dust(x, y) {
  for (let i = 0; i < 12; i++) {
    state.particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      vx: (Math.random() - 0.5) * 90,
      vy: -30 - Math.random() * 60,
      life: 0.5 + Math.random() * 0.3,
      age: 0,
      size: 3 + Math.random() * 5,
      spin: 0, rot: 0,
      color: 'rgba(196, 184, 160, .9)',
      gravity: 90
    });
  }
}

/* ---------- toasts ---------- */

function toast(spec, isNew) {
  const el = document.createElement('div');
  el.className = 'toast';
  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.background = RARITY[spec.rarity].color;
  const text = document.createElement('span');
  text.textContent = (isNew ? 'New model — ' : '') + spec.name;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = RARITY[spec.rarity].label;
  el.append(dot, text, tag);
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ---------- scene furniture ---------- */

function garageDoorX() {
  return state.w - 118;
}

function slotX(i) {
  return garageDoorX() - 170 - i * 108;
}

/* however many slots fit to the left of the garage without running off-screen */
function slotCount() {
  return Math.max(1, Math.min(MAX_PARKED, Math.floor((garageDoorX() - 116) / 108)));
}

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, state.ground);
  g.addColorStop(0, '#8ec9ec');
  g.addColorStop(0.62, '#c2e4f4');
  g.addColorStop(1, '#eef4e6');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, state.w, state.ground);

  ctx.fillStyle = '#fff';
  for (const c of state.clouds) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.translate(c.x, c.y);
    ctx.scale(c.s, c.s);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(24, 4, 15, 0, Math.PI * 2);
    ctx.arc(-22, 5, 14, 0, Math.PI * 2);
    ctx.arc(6, -12, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* rolling hills behind the road */
  ctx.fillStyle = '#a8cf9a';
  ctx.beginPath();
  ctx.moveTo(0, state.ground);
  for (let x = 0; x <= state.w; x += 40) {
    ctx.lineTo(x, state.ground - 26 - Math.sin(x / 190) * 22 - Math.sin(x / 71) * 6);
  }
  ctx.lineTo(state.w, state.ground);
  ctx.closePath();
  ctx.fill();
}

function drawGround() {
  ctx.fillStyle = '#7fb872';
  ctx.fillRect(0, state.ground, state.w, GROUND_H);
  ctx.fillStyle = '#5f5c58';
  ctx.fillRect(0, state.ground, state.w, ROAD_H);
  ctx.fillStyle = '#4d4a47';
  ctx.fillRect(0, state.ground + ROAD_H, state.w, 3);

  ctx.strokeStyle = 'rgba(255, 250, 235, .7)';
  ctx.lineWidth = 3;
  ctx.setLineDash([30, 26]);
  ctx.beginPath();
  ctx.moveTo(0, state.ground + ROAD_H * 0.28);
  ctx.lineTo(state.w, state.ground + ROAD_H * 0.28);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawGarage() {
  const doorX = garageDoorX();
  const w = 186, h = 104;
  const left = doorX - w / 2;
  const base = state.ground + 12;

  ctx.fillStyle = '#d8cfc0';
  ctx.fillRect(left, base - h, w, h);

  ctx.fillStyle = '#b3524a';
  ctx.beginPath();
  ctx.moveTo(left - 14, base - h);
  ctx.lineTo(doorX, base - h - 40);
  ctx.lineTo(left + w + 14, base - h);
  ctx.closePath();
  ctx.fill();

  const dw = 104, dh = 72;
  ctx.fillStyle = '#3d4652';
  ctx.fillRect(doorX - dw / 2, base - dh, dw, dh);
  ctx.strokeStyle = 'rgba(255,255,255,.16)';
  ctx.lineWidth = 1.5;
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(doorX - dw / 2, base - dh + (dh * i) / 6);
    ctx.lineTo(doorX + dw / 2, base - dh + (dh * i) / 6);
    ctx.stroke();
  }

  ctx.fillStyle = '#16283d';
  ctx.font = '700 13px ui-rounded, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GARAGE', doorX, base - dh - 10);
  ctx.textAlign = 'left';
}

/* ---------- pin ---------- */

/* The needle points up with its tip exactly on the cursor and the bead hanging
   below, so the thing you aim with is the thing that does the popping. */
function drawPin(ctx, x, y, thrust) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.16);
  ctx.translate(0, thrust * -10);

  ctx.strokeStyle = 'rgba(22, 40, 61, .16)';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(1.5, 3);
  ctx.lineTo(4, 62);
  ctx.stroke();

  const g = ctx.createLinearGradient(0, 0, 4, 62);
  g.addColorStop(0, '#f4f7fa');
  g.addColorStop(0.5, '#b9c4cf');
  g.addColorStop(1, '#7f8b98');
  ctx.strokeStyle = g;
  ctx.lineWidth = 3;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(3, 60);
  ctx.stroke();

  ctx.fillStyle = '#e2493f';
  ctx.beginPath();
  ctx.arc(4, 66, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.beginPath();
  ctx.arc(1.5, 63, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------- gameplay ---------- */

function spawn() {
  if (state.balloons.length >= MAX_BALLOONS) return;
  state.balloons.push(new Balloon({ w: state.w, ground: state.road }));
}

function prick(x, y) {
  state.pointer.thrust = 1;
  for (let i = state.balloons.length - 1; i >= 0; i--) {
    const b = state.balloons[i];
    if (!b.hit(x, y)) continue;
    b.pop();
    const e = b.envelope;
    burst(x, y, [b.rarity.envelope[0], b.rarity.envelope[1], '#fff'], 22);
    burst(e.cx, e.cy, [b.rarity.envelope[0], '#fff'], 10, 120);
    sfx.pop();
    document.getElementById('hint').classList.add('gone');
    return true;
  }
  sfx.miss();
  return false;
}

function land(b) {
  dust(b.x, state.road);
  sfx.thud();
  const targetSlot = state.parked.length < slotCount() ? state.parked.length : null;
  state.drivers.push({
    spec: b.car,
    x: b.x,
    target: targetSlot === null ? garageDoorX() : slotX(targetSlot),
    slot: targetSlot,
    alpha: 1,
    arrived: false
  });
  setTimeout(() => { b.dead = true; }, 900);
}

function updateDrivers(dt) {
  for (const d of state.drivers) {
    if (!d.arrived) {
      const dx = d.target - d.x;
      const step = 210 * dt;
      d.facing = dx < 0 ? -1 : 1;
      if (Math.abs(dx) <= step) {
        d.x = d.target;
        d.arrived = true;
        const isNew = Garage.add(d.spec.id);
        toast(d.spec, isNew);
        sfx.collect();
        burst(d.x, state.road - 22, ['#ffe9a8', '#fff', RARITY[d.spec.rarity].color], 10, 90);
        updateHud();
        if (d.slot !== null) state.parked.push({ spec: d.spec, facing: d.facing });
      } else {
        d.x += Math.sign(dx) * step;
      }
    } else if (d.slot === null) {
      d.alpha -= dt * 1.6;
    }
  }
  state.drivers = state.drivers.filter(d => !(d.arrived && (d.slot !== null || d.alpha <= 0)));
}

function updateHud() {
  document.getElementById('s-caught').textContent = Garage.stats.caught;
  document.getElementById('s-escaped').textContent = Garage.stats.escaped;
  document.getElementById('s-unique').textContent = `${Garage.uniqueCount}/${CARS.length}`;
}

/* ---------- main loop ---------- */

let last = performance.now();

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  if (!state.paused) {
    state.t += dt;

    /* faster balloons clear the screen sooner, so send them up proportionally
       more often — the sky stays as full at Crazy as it does at Standard */
    state.spawnIn -= dt * state.speed;
    if (state.spawnIn <= 0) {
      spawn();
      state.spawnIn = Math.max(1.9, 4.4 - Garage.stats.caught * 0.04) * (0.75 + Math.random() * 0.6);
    }

    for (const c of state.clouds) {
      c.x += c.v * dt;
      if (c.x > state.w + 60) { c.x = -60; c.y = 40 + Math.random() * (state.h * 0.45); }
    }

    for (const b of state.balloons) {
      const event = b.update(dt, { w: state.w, ground: state.road }, state.speed);
      if (event === 'escaped') { Garage.miss(); updateHud(); }
      if (event === 'landed') land(b);
    }
    state.balloons = state.balloons.filter(b => !b.dead);

    updateDrivers(dt);

    for (const p of state.particles) {
      p.age += dt;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
    }
    state.particles = state.particles.filter(p => p.age < p.life);

    state.pointer.thrust = Math.max(0, state.pointer.thrust - dt * 6);
  }

  render();
  requestAnimationFrame(frame);
}

function render() {
  drawSky();
  drawGround();
  drawGarage();

  /* the lineup in front of the garage, each car left facing the way it drove in */
  state.parked.forEach((car, i) => {
    ctx.save();
    ctx.translate(slotX(i), state.road);
    ctx.scale(CAR_SCALE * (car.facing === -1 ? -1 : 1), CAR_SCALE);
    drawCar(ctx, car.spec);
    ctx.restore();
  });

  for (const d of state.drivers) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, d.alpha);
    ctx.translate(d.x, state.road);
    ctx.scale(CAR_SCALE * (d.facing === -1 ? -1 : 1), CAR_SCALE);
    drawCar(ctx, d.spec);
    ctx.restore();
  }

  for (const b of state.balloons) b.draw(ctx);

  for (const p of state.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.8);
    ctx.restore();
  }

  drawPin(ctx, state.pointer.x, state.pointer.y, state.pointer.thrust);
}

/* ---------- input ---------- */

canvas.addEventListener('pointermove', e => {
  state.pointer.x = e.clientX;
  state.pointer.y = e.clientY;
});

canvas.addEventListener('pointerdown', e => {
  state.pointer.x = e.clientX;
  state.pointer.y = e.clientY;
  wakeAudio();
  prick(e.clientX, e.clientY);
});

canvas.addEventListener('pointerleave', () => {
  state.pointer.x = -999;
  state.pointer.y = -999;
});

/* ---------- garage overlay ---------- */

const overlay = document.getElementById('garage');

function openGarage() {
  renderGarage();
  overlay.hidden = false;
  state.paused = true;
}

function closeGarage() {
  overlay.hidden = true;
  state.paused = false;
}

document.getElementById('btn-garage').addEventListener('click', openGarage);
document.getElementById('btn-close').addEventListener('click', closeGarage);
overlay.addEventListener('click', e => { if (e.target === overlay) closeGarage(); });

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('Sell every car and empty the garage?')) return;
  Garage.reset();
  state.parked = [];
  renderGarage();
  updateHud();
});

function remember(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* private mode — the setting just won't survive a reload */
  }
}

const speedButtons = [...document.querySelectorAll('[data-speed]')];

function setSpeed(mul) {
  state.speed = mul;
  for (const b of speedButtons) {
    b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === mul));
  }
  remember(SPEED_KEY, mul);
}

for (const b of speedButtons) {
  b.addEventListener('click', () => setSpeed(Number(b.dataset.speed)));
}

const sfxButton = document.getElementById('btn-sfx');
const musicButton = document.getElementById('btn-music');
const trackPicker = document.getElementById('music-track');

for (const track of TRACKS) {
  trackPicker.add(new Option(track.name, track.id));
}

function setSfx(on) {
  state.sfx = on;
  sfxButton.setAttribute('aria-pressed', String(on));
  remember(SFX_KEY, on);
}

function setMusic(on) {
  state.music = on;
  musicButton.setAttribute('aria-pressed', String(on));
  trackPicker.dataset.muted = String(!on);
  remember(MUSIC_KEY, on);
  if (on) Music.start(ensureAudio());
  else Music.stop();
}

function setTrack(id) {
  trackPicker.value = id;
  Music.select(id);
  remember(TRACK_KEY, id);
}

sfxButton.addEventListener('click', () => {
  ensureAudio();
  setSfx(!state.sfx);
});

musicButton.addEventListener('click', () => setMusic(!state.music));

trackPicker.addEventListener('change', e => {
  setTrack(e.target.value);
  /* picking a track is a clear request to hear it */
  if (!state.music) setMusic(true);
});

/* Music is on by default but cannot sound until the page has been interacted
   with, so any gesture starts it.

   Deliberately not a one-shot listener: a phone browser can leave the context
   suspended even after a gesture, and suspends it again whenever the tab goes
   to the background or a call comes in. Every gesture therefore gets a go, and
   so does coming back to the tab. Both calls are cheap and idempotent. */
function wakeAudio() {
  ensureAudio();
  if (state.music && !Music.playing && audio.state === 'running') Music.start(audio);
}

for (const event of ['pointerdown', 'touchend', 'keydown']) {
  window.addEventListener(event, wakeAudio);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) wakeAudio();
});

window.addEventListener('keydown', e => {
  if (e.key === 'g' || e.key === 'G') overlay.hidden ? openGarage() : closeGarage();
  if (e.key === 'Escape' && !overlay.hidden) closeGarage();
});

/* ---------- go ---------- */

function saved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

resize();
updateHud();
setSpeed([1, 2, 5].includes(+saved(SPEED_KEY, 1)) ? +saved(SPEED_KEY, 1) : 1);
setSfx(saved(SFX_KEY, 'true') !== 'false');
setTrack(TRACKS.some(t => t.id === saved(TRACK_KEY, '')) ? saved(TRACK_KEY, '') : TRACKS[0].id);
/* deliberately not setMusic(): it would try to start before any interaction */
state.music = saved(MUSIC_KEY, 'true') !== 'false';
musicButton.setAttribute('aria-pressed', String(state.music));
trackPicker.dataset.muted = String(!state.music);
spawn();
requestAnimationFrame(frame);

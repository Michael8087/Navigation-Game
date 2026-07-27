/* The collection: what's been recovered so far, kept in localStorage so the
   garage is still there tomorrow. */

const STORE_KEY = 'navigation-game.garage.v1';

const Garage = {
  owned: {},
  stats: { caught: 0, escaped: 0 },

  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (raw && typeof raw === 'object') {
        this.owned = raw.owned && typeof raw.owned === 'object' ? raw.owned : {};
        this.stats = Object.assign({ caught: 0, escaped: 0 }, raw.stats);
      }
    } catch {
      /* corrupt or unavailable storage — start fresh rather than break the game */
    }
    return this;
  },

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ owned: this.owned, stats: this.stats }));
    } catch {
      /* private mode, quota — the run just won't persist */
    }
  },

  add(carId) {
    this.owned[carId] = (this.owned[carId] || 0) + 1;
    this.stats.caught++;
    this.save();
    return this.owned[carId] === 1;
  },

  miss() {
    this.stats.escaped++;
    this.save();
  },

  reset() {
    this.owned = {};
    this.stats = { caught: 0, escaped: 0 };
    this.save();
  },

  get uniqueCount() {
    return Object.keys(this.owned).filter(id => CARS_BY_ID[id]).length;
  },

  get total() {
    return Object.values(this.owned).reduce((a, b) => a + b, 0);
  }
};

/* ---- the overlay ---- */

function carThumb(spec, owned) {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 190, h = 92;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const scale = Math.min((w - 22) / spec.L, 1.25);
  ctx.translate(w / 2, h - 16);
  ctx.scale(scale, scale);
  drawCar(ctx, spec, { silhouette: !owned });
  return canvas;
}

function renderGarage() {
  const grid = document.getElementById('garage-grid');
  const sub = document.getElementById('garage-sub');
  grid.textContent = '';

  for (const spec of CARS) {
    const count = Garage.owned[spec.id] || 0;
    const rarity = RARITY[spec.rarity];

    const card = document.createElement('div');
    card.className = 'card' + (count ? '' : ' locked');
    card.appendChild(carThumb(spec, count > 0));

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = count ? spec.name : '???';
    card.appendChild(name);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const tag = document.createElement('span');
    tag.textContent = rarity.label;
    tag.style.color = rarity.color;
    const num = document.createElement('span');
    num.className = 'count';
    num.textContent = count ? `×${count}` : 'not found';
    meta.append(tag, num);
    card.appendChild(meta);

    grid.appendChild(card);
  }

  const { caught, escaped } = Garage.stats;
  const shots = caught + escaped;
  const rate = shots ? Math.round((caught / shots) * 100) : 0;
  sub.textContent = `${Garage.uniqueCount} of ${CARS.length} models · ${Garage.total} cars parked · ${rate}% of balloons brought down`;
}

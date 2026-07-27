/* The car catalogue: every model is drawn from a handful of numbers, so a
   balloon can carry one and the garage can render the same shape in a card. */

const RARITY = {
  common:    { label: 'Common',    color: '#7d93a8', weight: 52, envelope: ['#e5695f', '#f4e3cf'] },
  rare:      { label: 'Rare',      color: '#3f8fd0', weight: 28, envelope: ['#3f8fd0', '#bfe6f5'] },
  epic:      { label: 'Epic',      color: '#9a5cd0', weight: 15, envelope: ['#8a4fc4', '#f0d9f7'] },
  legendary: { label: 'Legendary', color: '#d9a127', weight: 5,  envelope: ['#d9a127', '#fff3cf'] }
};

/* L          overall length in car units (the wheels sit on y = 0)
   bodyH      height of the body panel, roofH the cabin on top of it
   roofStart  cabin extents as a fraction of the half-length, roofEnd likewise
   deckDrop   moves the rear deck: positive digs a pickup bed, negative
              raises a van's box above the cab
   hoodDrop   slopes the bonnet down towards the nose
   topless    no roof — draw a windscreen and a headrest instead
   lower      a second colour along the sills, roofColor one on the cabin  */
const CARS = [
  { id: 'bean', name: 'Bean', rarity: 'common', color: '#8fc7c0', accent: '#6ba59e',
    L: 48, bodyH: 15, roofH: 16, roofStart: -0.44, roofEnd: 0.36, wheelR: 7, hoodDrop: 3,
    doors: 1, bumper: '#c9d2d8' },

  { id: 'pebble', name: 'Pebble', rarity: 'common', color: '#e8b53f', accent: '#c9922a',
    L: 64, bodyH: 16, roofH: 15, roofStart: -0.60, roofEnd: 0.30, wheelR: 8, hoodDrop: 2,
    doors: 2 },

  { id: 'comet', name: 'Comet', rarity: 'common', color: '#7fb2e0', accent: '#5a8cbc',
    L: 80, bodyH: 15, roofH: 14, roofStart: -0.50, roofEnd: 0.24, wheelR: 8, hoodDrop: 2,
    doors: 3, exhaust: true },

  { id: 'loaf', name: 'Loaf', rarity: 'common', color: '#eae2d2', accent: '#c3b9a5',
    L: 80, bodyH: 19, roofH: 20, roofStart: -0.80, roofEnd: 0.46, wheelR: 8, hoodDrop: 5,
    doors: 2, lower: '#9fb7c4', roofRack: true },

  { id: 'mule', name: 'Mule', rarity: 'common', color: '#5c8f6b', accent: '#456e52',
    L: 86, bodyH: 19, roofH: 16, roofStart: -0.08, roofEnd: 0.50, wheelR: 10, hoodDrop: 2,
    deckDrop: 7, doors: 1, knobby: true, exhaust: true, bumper: '#6c757d' },

  { id: 'hauler', name: 'Hauler', rarity: 'common', color: '#d5d9dd', accent: '#adb4bb',
    L: 94, bodyH: 17, roofH: 14, roofStart: -0.10, roofEnd: 0.56, wheelR: 9, hoodDrop: 4,
    deckDrop: -17, doors: 1, boxPanel: true, bumper: '#6c757d' },

  { id: 'voyager', name: 'Voyager', rarity: 'rare', color: '#c96a4a', accent: '#a45036',
    L: 88, bodyH: 16, roofH: 16, roofStart: -0.76, roofEnd: 0.26, wheelR: 8, hoodDrop: 3,
    doors: 3, roofRack: true, lower: '#7d5c47' },

  { id: 'dart', name: 'Dart', rarity: 'rare', color: '#2f4b7c', accent: '#1e3357',
    L: 76, bodyH: 15, roofH: 11, roofStart: -0.34, roofEnd: 0.26, wheelR: 9, hoodDrop: 3,
    doors: 1, exhaust: true },

  { id: 'ranger', name: 'Ranger', rarity: 'rare', color: '#3f6e70', accent: '#2c5254',
    L: 84, bodyH: 20, roofH: 18, roofStart: -0.64, roofEnd: 0.38, wheelR: 11, hoodDrop: 2,
    doors: 2, knobby: true, roofRack: true, spare: true, bumper: '#3a3f45' },

  { id: 'checker', name: 'Checker', rarity: 'rare', color: '#f2c313', accent: '#cc9f07',
    L: 84, bodyH: 16, roofH: 15, roofStart: -0.54, roofEnd: 0.24, wheelR: 8, hoodDrop: 2,
    doors: 3, checker: true, roofSign: true },

  { id: 'camper', name: 'Camper', rarity: 'rare', color: '#f0ece1', accent: '#cdc6b6',
    L: 98, bodyH: 20, roofH: 23, roofStart: -0.84, roofEnd: 0.30, wheelR: 9, hoodDrop: 6,
    doors: 2, lower: '#d9784f', roofColor: '#f7f5ef', roofRack: true, awning: true },

  { id: 'vipera', name: 'Vipera', rarity: 'epic', color: '#d8352f', accent: '#a8221e',
    L: 88, bodyH: 14, roofH: 11, roofStart: -0.22, roofEnd: 0.30, wheelR: 9, hoodDrop: 4,
    doors: 1, spoiler: true, exhaust: true, vent: true },

  { id: 'zephyr', name: 'Zephyr', rarity: 'epic', color: '#f4f6f8', accent: '#9aa8b6',
    L: 82, bodyH: 18, roofH: 0, roofStart: -0.36, roofEnd: 0.26, wheelR: 8, hoodDrop: 3,
    topless: true, doors: 1, bumper: '#c6ced6', exhaust: true },

  { id: 'thunder', name: 'Thunder', rarity: 'epic', color: '#2b2f38', accent: '#14171d',
    L: 90, bodyH: 16, roofH: 12, roofStart: -0.42, roofEnd: 0.20, wheelR: 10, hoodDrop: 1,
    doors: 1, stripe: '#e8b53f', scoop: true, exhaust: true },

  { id: 'buggy', name: 'Buggy', rarity: 'epic', color: '#f07d2b', accent: '#c85f14',
    L: 76, bodyH: 15, roofH: 0, roofStart: -0.36, roofEnd: 0.18, wheelR: 13, hoodDrop: 2,
    topless: true, rollbar: true, knobby: true, spare: true },

  { id: 'aurora', name: 'Aurora', rarity: 'legendary', color: '#f0a91c', accent: '#c07f08',
    L: 96, bodyH: 13, roofH: 10, roofStart: -0.20, roofEnd: 0.34, wheelR: 9, hoodDrop: 5,
    doors: 1, spoiler: true, stripe: '#2b2f38', vent: true, exhaust: true },

  { id: 'duchess', name: 'Duchess', rarity: 'legendary', color: '#5b3f74', accent: '#402a55',
    L: 82, bodyH: 18, roofH: 18, roofStart: -0.46, roofEnd: 0.10, wheelR: 11, hoodDrop: 4,
    doors: 2, classic: true, bumper: '#d8c98c', roofColor: '#2b2530' },

  { id: 'rocket', name: 'Rocket', rarity: 'legendary', color: '#b8232b', accent: '#8a141b',
    L: 86, bodyH: 16, roofH: 13, roofStart: -0.50, roofEnd: 0.04, wheelR: 11, hoodDrop: 3,
    doors: 1, engine: true, flames: true, exhaust: true, bumper: '#d8c98c' }
];

const CARS_BY_ID = Object.fromEntries(CARS.map(c => [c.id, c]));

function randomCar() {
  const total = CARS.reduce((sum, c) => sum + RARITY[c.rarity].weight, 0);
  let roll = Math.random() * total;
  for (const car of CARS) {
    roll -= RARITY[car.rarity].weight;
    if (roll <= 0) return car;
  }
  return CARS[0];
}

/* Every measurement the drawing needs, derived once from the spec. */
function carGeom(s) {
  const hw = s.L / 2;
  /* the sills stop just above the axles, so the wheels show below the body */
  const bottom = -s.wheelR * 0.98;
  const belt = bottom - s.bodyH;
  return {
    hw, bottom, belt,
    deck: belt + (s.deckDrop || 0),
    roof: belt - s.roofH,
    rs: s.roofStart * hw,
    re: s.roofEnd * hw,
    rearAxle: -hw + s.L * 0.19,
    frontAxle: hw - s.L * 0.19
  };
}

/* Traces the silhouette; used to fill the body and to clip everything on it. */
function carBodyPath(ctx, s) {
  const { hw, bottom, belt, deck, roof, rs, re } = carGeom(s);
  const L = s.L;

  ctx.beginPath();
  ctx.moveTo(-hw, bottom);
  ctx.quadraticCurveTo(-hw - L * 0.02, deck, -hw + L * 0.05, deck);
  ctx.lineTo(rs, deck);
  if (s.deckDrop) ctx.lineTo(rs, belt);
  if (!s.topless) {
    ctx.quadraticCurveTo(rs + L * 0.04, roof, rs + L * 0.10, roof);
    ctx.lineTo(re - L * 0.09, roof);
    ctx.quadraticCurveTo(re + L * 0.02, roof, re + L * 0.05, belt);
  }
  ctx.lineTo(hw - L * 0.12, belt + (s.hoodDrop || 0));
  ctx.quadraticCurveTo(hw, belt + (s.hoodDrop || 0), hw, bottom - L * 0.02);
  ctx.lineTo(hw, bottom);
  ctx.closePath();
}

function drawWheel(ctx, x, r, s, sil) {
  const tyre = sil ? '#5b6675' : '#22262d';

  if (s.knobby) {
    ctx.fillStyle = tyre;
    const teeth = 12;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      ctx.save();
      ctx.translate(x + Math.cos(a) * r, -r + Math.sin(a) * r);
      ctx.rotate(a);
      ctx.fillRect(-r * 0.12, -r * 0.14, r * 0.26, r * 0.28);
      ctx.restore();
    }
  }

  ctx.fillStyle = tyre;
  ctx.beginPath();
  ctx.arc(x, -r, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = sil ? '#79838f' : '#c7ccd3';
  ctx.beginPath();
  ctx.arc(x, -r, r * 0.44, 0, Math.PI * 2);
  ctx.fill();

  if (!sil) {
    /* five spokes, so the wheels still read as wheels up in the sky */
    ctx.strokeStyle = '#9aa2ab';
    ctx.lineWidth = Math.max(1, r * 0.11);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, -r);
      ctx.lineTo(x + Math.cos(a) * r * 0.4, -r + Math.sin(a) * r * 0.4);
      ctx.stroke();
    }
  }

  ctx.fillStyle = sil ? '#5b6675' : '#8b929b';
  ctx.beginPath();
  ctx.arc(x, -r, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

/* Origin sits on the road, under the middle of the car. Faces right. */
function drawCar(ctx, s, opts = {}) {
  const sil = !!opts.silhouette;
  const L = s.L;
  const g = carGeom(s);
  const { hw, bottom, belt, roof, rs, re, rearAxle, frontAxle } = g;
  const bodyColor = sil ? '#cdc6ba' : s.color;
  const trim = sil ? '#b8b1a5' : s.accent;

  ctx.save();
  ctx.lineJoin = 'round';

  if (opts.shadow !== false) {
    ctx.fillStyle = 'rgba(22, 40, 61, .14)';
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 1.02, s.wheelR * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (s.spare) {
    ctx.fillStyle = sil ? '#9a9488' : '#25292f';
    ctx.beginPath();
    ctx.arc(-hw - 2, belt + s.bodyH * 0.5, s.wheelR * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = sil ? '#b8b1a5' : '#8b929b';
    ctx.beginPath();
    ctx.arc(-hw - 2, belt + s.bodyH * 0.5, s.wheelR * 0.26, 0, Math.PI * 2);
    ctx.fill();
  }

  if (s.exhaust) {
    ctx.fillStyle = sil ? '#9a9488' : '#9aa2ab';
    ctx.beginPath();
    ctx.ellipse(-hw - 2, bottom - 2, 3, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* wheels go on before the body, so the arches are simply the sills */
  drawWheel(ctx, rearAxle, s.wheelR, s, sil);
  drawWheel(ctx, frontAxle, s.wheelR, s, sil);

  /* ---- body ---- */
  carBodyPath(ctx, s);
  if (sil) {
    ctx.fillStyle = bodyColor;
  } else {
    const grad = ctx.createLinearGradient(0, roof, 0, bottom);
    grad.addColorStop(0, s.color);
    grad.addColorStop(0.72, s.color);
    grad.addColorStop(1, s.accent);
    ctx.fillStyle = grad;
  }
  ctx.fill();

  /* ---- everything painted on the body ---- */
  ctx.save();
  carBodyPath(ctx, s);
  ctx.clip();

  if (!sil) {
    if (s.roofColor && !s.topless) {
      ctx.fillStyle = s.roofColor;
      ctx.fillRect(rs - 2, roof - 2, re - rs + 6, belt - roof + 2);
    }

    if (s.lower) {
      ctx.fillStyle = s.lower;
      ctx.fillRect(-hw, bottom - s.bodyH * 0.34, L, s.bodyH * 0.34 + 4);
    }

    if (s.stripe) {
      ctx.fillStyle = s.stripe;
      ctx.fillRect(-hw, belt + s.bodyH * 0.34, L, s.bodyH * 0.22);
    }

    if (s.flames) {
      /* licks of flame running back from the nose, tapering as they go */
      const fire = ctx.createLinearGradient(hw, 0, -hw * 0.2, 0);
      fire.addColorStop(0, '#ffd24a');
      fire.addColorStop(0.6, '#f0891c');
      fire.addColorStop(1, '#e2493f');
      ctx.fillStyle = fire;
      ctx.beginPath();
      ctx.moveTo(hw, belt + 3);
      for (let i = 0; i < 3; i++) {
        const x = hw - i * L * 0.17;
        ctx.quadraticCurveTo(x - L * 0.09, belt + 3 + i * 3, x - L * 0.17, belt + 11 + i * 2);
      }
      ctx.lineTo(-hw * 0.1, bottom);
      ctx.lineTo(hw, bottom);
      ctx.closePath();
      ctx.fill();
    }

    if (s.checker) {
      ctx.fillStyle = '#1b1f26';
      const cw = L * 0.055, y0 = belt + s.bodyH * 0.28;
      for (let i = 0; i < 22; i++) {
        ctx.fillRect(-hw + i * cw, y0 + (i % 2 ? cw : 0), cw, cw);
      }
    }

    /* glazing */
    if (!s.topless && s.roofH > 0) {
      ctx.fillStyle = 'rgba(206, 234, 250, .95)';
      ctx.beginPath();
      ctx.moveTo(rs + L * 0.045, belt - 1.5);
      ctx.lineTo(rs + L * 0.10, roof + 2.5);
      ctx.lineTo(re - L * 0.10, roof + 2.5);
      ctx.lineTo(re - L * 0.005, belt - 1.5);
      ctx.closePath();
      ctx.fill();

      /* a soft diagonal reflection across the glass */
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(rs + L * 0.07, belt);
      ctx.lineTo(rs + L * 0.20, roof + 3);
      ctx.lineTo(rs + L * 0.30, roof + 3);
      ctx.lineTo(rs + L * 0.17, belt);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = trim;
      ctx.lineWidth = Math.max(1.4, L * 0.022);
      const pillars = Math.max(1, (s.doors || 2) - 1);
      for (let i = 1; i <= pillars; i++) {
        const px = rs + ((re - rs) * i) / (pillars + 1) + L * 0.02;
        ctx.beginPath();
        ctx.moveTo(px, roof + 2);
        ctx.lineTo(px - L * 0.012, belt - 1);
        ctx.stroke();
      }
    }

    if (s.boxPanel) {
      ctx.strokeStyle = 'rgba(22, 40, 61, .18)';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(-hw + 4, belt + (s.deckDrop || 0) + 5, hw + rs - 8, -(s.deckDrop || 0) + s.bodyH - 9);
    }

    /* door seams and handles */
    ctx.strokeStyle = 'rgba(22, 40, 61, .22)';
    ctx.lineWidth = 1.2;
    const doors = s.doors || 0;
    for (let i = 0; i < doors; i++) {
      const dx = rs + ((re - rs) * (i + 1)) / (doors + 1);
      ctx.beginPath();
      ctx.moveTo(dx, belt);
      ctx.lineTo(dx, bottom - 2);
      ctx.stroke();
      ctx.fillStyle = trim;
      ctx.fillRect(dx + L * 0.02, belt + s.bodyH * 0.28, L * 0.05, 2);
    }

    if (s.vent) {
      ctx.fillStyle = trim;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(rs - L * 0.13 + i * 4, belt + 4, 2.4, s.bodyH * 0.4);
      }
    }

    if (s.topless) {
      /* an open cockpit: dark interior sunk into the body */
      ctx.fillStyle = 'rgba(22, 40, 61, .55)';
      ctx.beginPath();
      ctx.moveTo(rs, belt + 1);
      ctx.lineTo(re - L * 0.02, belt + 1);
      ctx.lineTo(re - L * 0.05, belt + s.bodyH * 0.5);
      ctx.lineTo(rs + L * 0.03, belt + s.bodyH * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    if (s.classic) {
      /* sweeping fenders over each wheel, plus a running board between them */
      ctx.fillStyle = 'rgba(22, 40, 61, .26)';
      for (const ax of [rearAxle, frontAxle]) {
        ctx.beginPath();
        ctx.arc(ax, bottom, s.wheelR * 1.15, Math.PI, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(22, 40, 61, .34)';
      ctx.fillRect(rearAxle, bottom - 3, frontAxle - rearAxle, 3);
    }

    /* wheel openings: a soft shadow tucked under the sills */
    ctx.fillStyle = 'rgba(22, 40, 61, .16)';
    for (const ax of [rearAxle, frontAxle]) {
      ctx.beginPath();
      ctx.ellipse(ax, bottom, s.wheelR * 1.06, s.wheelR * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    /* bumpers, sunk into the silhouette so they never float free */
    if (s.bumper) {
      ctx.fillStyle = s.bumper;
      ctx.fillRect(-hw, bottom - 4.5, L, 4.5);
    }

    /* lamps and grille */
    ctx.fillStyle = 'rgba(22, 40, 61, .3)';
    ctx.fillRect(hw - L * 0.06, belt + (s.hoodDrop || 0) + 7, L * 0.05, 4);
    ctx.fillStyle = '#fff4cf';
    ctx.beginPath();
    ctx.ellipse(hw - L * 0.045, belt + (s.hoodDrop || 0) + 3.5, L * 0.028, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e05a4a';
    ctx.beginPath();
    ctx.ellipse(-hw + L * 0.035, belt + 5, L * 0.022, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    /* shoulder highlight */
    ctx.fillStyle = 'rgba(255, 255, 255, .2)';
    ctx.fillRect(-hw, belt + 1.5, L, 2);
  }
  ctx.restore();

  /* ---- parts that stand off the body ---- */

  if (s.topless) {
    /* a raked windscreen and the seat behind it */
    ctx.fillStyle = sil ? '#b8b1a5' : 'rgba(206, 234, 250, .9)';
    ctx.beginPath();
    ctx.moveTo(re - L * 0.02, belt);
    ctx.lineTo(re - L * 0.11, belt - 12);
    ctx.lineTo(re - L * 0.15, belt - 12);
    ctx.lineTo(re - L * 0.07, belt);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = sil ? '#b8b1a5' : '#3a3f45';
    ctx.beginPath();
    ctx.roundRect(rs + L * 0.03, belt - 9, L * 0.09, 9, 2.5);
    ctx.fill();
  }

  if (s.rollbar) {
    ctx.strokeStyle = sil ? '#b8b1a5' : '#3a3f45';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rs - L * 0.01, belt);
    ctx.lineTo(rs + L * 0.04, belt - 19);
    ctx.lineTo(rs + L * 0.19, belt - 19);
    ctx.lineTo(rs + L * 0.23, belt);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }

  if (s.roofRack) {
    ctx.fillStyle = sil ? '#b8b1a5' : '#5f676f';
    ctx.fillRect(rs + L * 0.06, roof - 4, (re - rs) * 0.8, 2.4);
    ctx.fillRect(rs + L * 0.09, roof - 4, 2, 4);
    ctx.fillRect(rs + (re - rs) * 0.78, roof - 4, 2, 4);
  }

  if (s.roofSign) {
    ctx.fillStyle = sil ? '#b8b1a5' : '#f7f3e6';
    ctx.fillRect((rs + re) / 2 - L * 0.06, roof - 7, L * 0.14, 6);
    if (!sil) {
      ctx.fillStyle = '#1b1f26';
      ctx.fillRect((rs + re) / 2 - L * 0.04, roof - 5, L * 0.10, 2);
    }
  }

  if (s.awning) {
    ctx.fillStyle = sil ? '#b8b1a5' : '#d9784f';
    ctx.fillRect(-hw - 1, belt - 2, L * 0.3, 2.6);
  }

  if (s.scoop || s.engine) {
    /* sits down on the bonnet, which slopes away towards the nose */
    const hx = (re + hw) / 2;
    const hood = belt + (s.hoodDrop || 0) * 0.45;
    const boxH = s.engine ? 11 : 5;
    ctx.fillStyle = sil ? '#b8b1a5' : (s.engine ? '#3a3f45' : s.accent);
    ctx.fillRect(hx - L * 0.06, hood - boxH, L * 0.14, boxH);
    if (s.engine) {
      ctx.fillStyle = sil ? '#cdc6ba' : '#c7ccd3';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(hx - L * 0.05 + i * L * 0.045, hood - boxH - 5, 3, 6);
      }
    }
  }

  if (s.spoiler) {
    ctx.fillStyle = trim;
    ctx.fillRect(-hw - L * 0.01, belt - 8, L * 0.20, 3);
    ctx.fillRect(-hw + L * 0.06, belt - 8, 2.6, 8);
  }

  if (!sil) {
    /* wing mirror on the leading edge of the cabin */
    ctx.fillStyle = trim;
    ctx.fillRect(re - L * 0.02, belt - 1, L * 0.05, 2.6);
  }

  ctx.restore();
}

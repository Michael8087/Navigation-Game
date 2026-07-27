/* A balloon drifts across the sky with one car slung under it on a timber
   deck. Prick the envelope and the whole rig sinks to the road. */

/* A pierced envelope still catches air, so a downed balloon sinks rather than
   drops: gentle pull, a low terminal speed, and a sway on the way down. */
const FALL_PULL = 190;
const FALL_TERMINAL = 62;

class Balloon {
  constructor(bounds) {
    this.car = randomCar();
    this.rarity = RARITY[this.car.rarity];

    const size = 0.88 + Math.random() * 0.34;
    this.carScale = 0.92 * size;
    this.w = Math.max(112, this.car.L * 1.35) * size;
    this.h = this.w * 1.26;
    this.palletW = this.car.L * this.carScale + 16 * size;
    this.palletH = 9 * size;
    this.ropeLen = 40 * size;

    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.speed = 16 + Math.random() * 22;
    this.x = this.dir === 1 ? -this.w : bounds.w + this.w;

    const ceiling = this.h * 0.6 + 24;
    const floor = Math.max(ceiling + 40, bounds.ground - 260);
    this.baseY = ceiling + Math.random() * (floor - ceiling);
    this.y = this.baseY;

    this.bobAmp = 7 + Math.random() * 9;
    this.bobSpeed = 0.5 + Math.random() * 0.4;
    this.phase = Math.random() * Math.PI * 2;
    this.rise = (Math.random() - 0.5) * 5;
    this.tilt = 0;

    this.state = 'flying';
    this.vy = 0;
    this.vx = 0;
    this.deflate = 0;
    this.fallT = 0;
    this.swayAmp = 0;
    this.dead = false;
  }

  /* Nose-to-tail bounds of the envelope, used for hit testing. */
  get envelope() {
    return { cx: this.x, cy: this.y - this.h * 0.5, rx: this.w * 0.5, ry: this.h * 0.5 };
  }

  hit(px, py) {
    if (this.state !== 'flying') return false;
    const e = this.envelope;
    const dx = (px - e.cx) / e.rx;
    const dy = (py - e.cy) / e.ry;
    return dx * dx + dy * dy <= 1;
  }

  pop() {
    this.state = 'falling';
    this.vy = -14;
    this.vx = this.dir * this.speed * 0.5;
    this.fallT = 0;
    this.swayAmp = 22 + Math.random() * 18;
  }

  update(dt, t, bounds) {
    if (this.state === 'flying') {
      this.x += this.dir * this.speed * dt;
      this.baseY += this.rise * dt;
      this.y = this.baseY + Math.sin(t * this.bobSpeed + this.phase) * this.bobAmp;
      this.tilt = Math.sin(t * this.bobSpeed * 0.7 + this.phase) * 0.05;

      const margin = this.w * 1.4;
      if (this.x < -margin || this.x > bounds.w + margin) {
        this.dead = true;
        return 'escaped';
      }
      return null;
    }

    if (this.state === 'falling') {
      this.fallT += dt;
      /* the envelope crumples only part way — what's left of it is the canopy */
      this.deflate = Math.min(0.62, this.deflate + dt * 0.5);
      this.vy = Math.min(FALL_TERMINAL, this.vy + FALL_PULL * dt);

      const sway = Math.sin(this.fallT * 1.5 + this.phase);
      this.vx *= 1 - 1.2 * dt;
      this.x += (this.vx + sway * this.swayAmp) * dt;
      this.y += this.vy * dt;
      this.tilt = sway * 0.14;

      const palletBottom = this.y + this.ropeLen + this.palletH;
      if (palletBottom >= bounds.ground) {
        this.y = bounds.ground - this.ropeLen - this.palletH;
        this.state = 'landed';
        return 'landed';
      }
    }
    return null;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.tilt);

    const deck = this.ropeLen;
    const pw = this.palletW, ph = this.palletH;

    if (this.state !== 'landed') {
      /* four lines from the envelope's throat out to the corners of the deck */
      ctx.strokeStyle = 'rgba(86, 66, 46, .75)';
      ctx.lineWidth = 1.5;
      for (const sx of [-1, 1]) {
        for (const inner of [0.5, 1]) {
          ctx.beginPath();
          ctx.moveTo(sx * this.w * 0.15 * inner, -2);
          ctx.lineTo(sx * (pw / 2) * inner, deck);
          ctx.stroke();
        }
      }
      this.drawEnvelope(ctx);
    }

    /* the car rides on top of a plain timber deck, in full view */
    if (this.state !== 'landed') {
      ctx.save();
      ctx.translate(0, deck);
      ctx.scale(this.carScale, this.carScale);
      drawCar(ctx, this.car, { shadow: false });
      ctx.restore();
    }

    ctx.fillStyle = '#a97b4a';
    ctx.beginPath();
    ctx.moveTo(-pw / 2, deck);
    ctx.lineTo(pw / 2, deck);
    ctx.lineTo(pw / 2 - 2, deck + ph);
    ctx.lineTo(-pw / 2 + 2, deck + ph);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#c08d55';
    ctx.fillRect(-pw / 2 - 2, deck - 3, pw + 4, 4);

    ctx.strokeStyle = 'rgba(80, 55, 30, .45)';
    ctx.lineWidth = 1.1;
    for (let i = 1; i < 5; i++) {
      const lx = -pw / 2 + (pw * i) / 5;
      ctx.beginPath();
      ctx.moveTo(lx, deck + 1);
      ctx.lineTo(lx, deck + ph - 1);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawEnvelope(ctx) {
    const squash = 1 - this.deflate * 0.7;
    const w = this.w * (1 + this.deflate * 0.25);
    const h = this.h * squash;
    const [dark, light] = this.rarity.envelope;

    ctx.save();
    ctx.globalAlpha = 1 - this.deflate * 0.15;

    if (this.car.rarity === 'legendary' && this.state === 'flying') {
      ctx.shadowColor = 'rgba(217, 161, 39, .75)';
      ctx.shadowBlur = 26;
    }

    const path = () => {
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.bezierCurveTo(w * 0.62, -h * 0.94, w * 0.56, -h * 0.28, w * 0.16, 0);
      ctx.lineTo(-w * 0.16, 0);
      ctx.bezierCurveTo(-w * 0.56, -h * 0.28, -w * 0.62, -h * 0.94, 0, -h);
      ctx.closePath();
    };

    path();
    ctx.fillStyle = light;
    ctx.fill();
    ctx.shadowBlur = 0;

    /* vertical gores in the rarity's colour */
    ctx.save();
    path();
    ctx.clip();
    ctx.fillStyle = dark;
    const gores = 6;
    for (let i = 0; i < gores; i++) {
      if (i % 2) continue;
      const gx = -w * 0.5 + (w * i) / gores;
      ctx.fillRect(gx, -h - 4, w / gores, h + 8);
    }
    ctx.fillStyle = 'rgba(22, 40, 61, .16)';
    ctx.fillRect(-w * 0.5, -h * 0.60, w, h * 0.055);

    const shade = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
    shade.addColorStop(0, 'rgba(255, 255, 255, .28)');
    shade.addColorStop(0.45, 'rgba(255, 255, 255, 0)');
    shade.addColorStop(1, 'rgba(22, 40, 61, .22)');
    ctx.fillStyle = shade;
    ctx.fillRect(-w * 0.5, -h - 4, w, h + 8);
    ctx.restore();

    ctx.strokeStyle = 'rgba(22, 40, 61, .22)';
    ctx.lineWidth = 1.2;
    path();
    ctx.stroke();

    ctx.restore();
  }
}

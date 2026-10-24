// Pushpa varsha — the ambient flower shower on one canvas.
// Petals are pre-rendered sprites (shaded, shadowed so they read on white paper), drawn at
// three depths: far = small & sharp, mid = crisp, near = large & softly blurred. Each petal
// tumbles in fake 3D (scaleX = cos(flip)), gold leaf glints as it turns, a slow wind gusts,
// and scroll velocity pushes the field with depth parallax. The petal mix follows the
// current scene (body[data-theme]): marigolds for haldi, magenta rose for sangeet, jasmine
// under the moon. Off for reduced motion; paused when the tab is hidden.
import { reduced } from './lib/motion.js';

const S = 96; // sprite canvas size (css px, rendered at dpr)

// kind → [light, dark] tints
const TINTS = {
  blush: ['#FBE0DB', '#E7A29C'],
  rose: ['#F1A7AE', '#B9475A'],
  magenta: ['#E79BC2', '#93306A'],
  marigold: ['#FFD27A', '#E07A10'],
  saffron: ['#FFE3A1', '#EFA21C'],
  jasmine: ['#FFFFFF', '#E9DFCF'],
};
const MIX = {
  dusk: { blush: 4, rose: 2, marigold: 1, gold: 3 },
  dawn: { blush: 3, jasmine: 2, saffron: 1, gold: 3 },
  moon: { jasmine: 5, blush: 1, gold: 3 },
  haldi: { marigold: 5, saffron: 3, gold: 2 },
  sangeet: { magenta: 4, rose: 3, gold: 3 },
  wedding: { rose: 3, marigold: 3, blush: 1, gold: 3 },
};

function petalPath(c, kind) {
  c.beginPath();
  if (kind === 'marigold' || kind === 'saffron') {
    // Ruffled marigold petal: narrow base, scalloped crown.
    c.moveTo(0, 38);
    c.bezierCurveTo(-12, 26, -26, 0, -24, -20);
    c.quadraticCurveTo(-20, -32, -12, -26);
    c.quadraticCurveTo(-8, -38, 0, -30);
    c.quadraticCurveTo(8, -38, 12, -26);
    c.quadraticCurveTo(20, -32, 24, -20);
    c.bezierCurveTo(26, 0, 12, 26, 0, 38);
  } else if (kind === 'jasmine') {
    // Slender jasmine petal.
    c.moveTo(0, 40);
    c.bezierCurveTo(-14, 20, -14, -24, 0, -40);
    c.bezierCurveTo(14, -24, 14, 20, 0, 40);
  } else {
    // Rose petal: broad, slightly heart-shaped crown, cupped base.
    c.moveTo(0, 38);
    c.bezierCurveTo(-30, 26, -36, -14, -22, -32);
    c.bezierCurveTo(-12, -42, -4, -36, 0, -30);
    c.bezierCurveTo(4, -36, 12, -42, 22, -32);
    c.bezierCurveTo(36, -14, 30, 26, 0, 38);
  }
  c.closePath();
}

function makeCanvas(dpr) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = S * dpr;
  const c = cv.getContext('2d');
  c.scale(dpr, dpr);
  c.translate(S / 2, S / 2);
  return [cv, c];
}

function petalSprite(kind, dpr) {
  const [cv, c] = makeCanvas(dpr);
  const [lt, dk] = TINTS[kind];
  // Soft contact shadow so pale petals still read on white.
  c.save();
  c.shadowColor = 'rgba(90, 45, 30, .22)';
  c.shadowBlur = 7;
  c.shadowOffsetY = 3;
  petalPath(c, kind);
  const g = c.createRadialGradient(-6, -12, 2, 0, 4, 46);
  g.addColorStop(0, lt);
  g.addColorStop(0.55, kind === 'jasmine' ? lt : mix(lt, dk, 0.45));
  g.addColorStop(1, dk);
  c.fillStyle = g;
  c.fill();
  c.restore();
  // Base blush where the petal met the flower.
  petalPath(c, kind);
  c.save();
  c.clip();
  const b = c.createRadialGradient(0, 40, 0, 0, 40, 30);
  b.addColorStop(0, kind === 'jasmine' ? 'rgba(214, 190, 120, .45)' : 'rgba(255, 255, 255, .35)');
  b.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = b;
  c.fillRect(-S / 2, -S / 2, S, S);
  // Veins.
  c.strokeStyle = kind === 'jasmine' ? 'rgba(170, 150, 110, .25)' : 'rgba(255, 255, 255, .28)';
  c.lineWidth = 0.7;
  for (const dx of [-12, -5, 0, 5, 12]) {
    c.beginPath();
    c.moveTo(0, 36);
    c.quadraticCurveTo(dx * 0.6, 4, dx, -26 + Math.abs(dx) * 0.6);
    c.stroke();
  }
  c.restore();
  // Fine edge.
  petalPath(c, kind);
  c.strokeStyle = 'rgba(80, 30, 20, .12)';
  c.lineWidth = 0.6;
  c.stroke();
  return cv;
}

// Crinkled gold leaf; `bright` renders the glint frame shown while the flake faces the light.
function goldSprite(dpr, seed, bright) {
  const [cv, c] = makeCanvas(dpr);
  const rnd = mulberry(seed);
  const pts = [];
  const n = 7 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r = 16 + rnd() * 14;
    pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.8]);
  }
  c.save();
  c.shadowColor = 'rgba(110, 80, 20, .25)';
  c.shadowBlur = 5;
  c.shadowOffsetY = 2;
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  const g = c.createLinearGradient(-28, -24, 28, 24);
  const stops = bright
    ? ['#B8913F', '#F7E7B4', '#FFFBEA', '#E9CC80', '#B8913F']
    : ['#7E5E26', '#C9A45C', '#E9D08F', '#A9853F', '#6E5020'];
  stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
  c.fillStyle = g;
  c.fill();
  c.restore();
  // Crinkle lines.
  c.strokeStyle = bright ? 'rgba(255,255,255,.55)' : 'rgba(255, 240, 200, .35)';
  c.lineWidth = 0.6;
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = pts[Math.floor(rnd() * n)], [x2, y2] = pts[Math.floor(rnd() * n)];
    c.beginPath();
    c.moveTo(x1 * 0.7, y1 * 0.7);
    c.lineTo(x2 * 0.5, y2 * 0.5);
    c.stroke();
  }
  return cv;
}

function blurred(src, dpr) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = src.width;
  const c = cv.getContext('2d');
  if (!('filter' in c)) return null; // Safari: near petals fall back to the sharp sprite
  c.filter = `blur(${3 * dpr}px)`;
  c.drawImage(src, 0, 0);
  return cv;
}

export function startFX() {
  if (reduced) return;
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const small = innerWidth < 700;
  const AMBIENT = small ? 12 : 20;

  // Sprite atlas.
  const sprites = {};
  for (const k of Object.keys(TINTS)) {
    const sharp = petalSprite(k, dpr);
    sprites[k] = { sharp, soft: blurred(sharp, dpr) || sharp };
  }
  const gold = [11, 29, 47].map((seed) => {
    const sharp = goldSprite(dpr, seed, false);
    return { sharp, bright: goldSprite(dpr, seed, true), soft: blurred(sharp, dpr) || sharp };
  });

  let w = 0, h = 0, running = true, t = 0, last = performance.now();
  const resize = () => {
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
  };
  resize();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(loop); }
  });

  const pick = () => {
    const m = MIX[document.body.dataset.theme] || MIX.dusk;
    let r = Math.random() * Object.values(m).reduce((a, b) => a + b, 0);
    for (const [k, v] of Object.entries(m)) if ((r -= v) <= 0) return k;
    return 'gold';
  };

  const spawn = (p = {}, opts = {}) => {
    const kind = opts.kind || pick();
    const z = opts.z ?? (Math.random() < 0.15 ? 1.3 + Math.random() * 0.35 : 0.55 + Math.random() * 0.6);
    const isGold = kind === 'gold';
    return Object.assign(p, {
      kind, z, temp: !!opts.temp,
      g: isGold ? gold[(Math.random() * gold.length) | 0] : null,
      x: Math.random() * w,
      y: opts.y ?? (Math.random() * h),
      size: (isGold ? 0.2 + Math.random() * 0.12 : 0.26 + Math.random() * 0.14) * z, // sprite is S*dpr px, so ~19–30 css px at z=1
      vy: (isGold ? 0.28 : 0.42 + Math.random() * 0.3) * z * dpr,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      vflip: (isGold ? 0.035 : 0.02) + Math.random() * 0.03,
      sway: Math.random() * Math.PI * 2,
      swayAmp: (0.4 + Math.random() * 0.8) * dpr,
      alpha: 0,
    });
  };

  const parts = [];
  for (let i = 0; i < AMBIENT; i++) parts.push(spawn());

  // Grand shower when the envelope opens; other modules may dispatch 'fx:shower' too.
  const shower = (n) => {
    for (let i = 0; i < n; i++) {
      const p = spawn({}, { temp: true, y: -Math.random() * h * 0.9 - 40 * dpr });
      p.vy *= 1.5;
      parts.push(p);
    }
  };
  document.addEventListener('intro:open', () => shower(small ? 40 : 70));
  document.addEventListener('fx:shower', (e) => shower(e.detail?.count || (small ? 24 : 40)));

  function draw(p) {
    const near = p.z > 1.25;
    const c = Math.cos(p.flip);
    let img;
    if (p.kind === 'gold') img = near ? p.g.soft : (c > 0.55 ? p.g.bright : p.g.sharp); // glint while facing light
    else img = near ? sprites[p.kind].soft : sprites[p.kind].sharp;
    const a = p.alpha * (near ? 0.55 : p.z < 0.7 ? 0.7 : 0.95) * (0.7 + 0.3 * Math.abs(c));
    ctx.globalAlpha = a;
    ctx.setTransform(1, 0, 0, 1, p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(p.size * (0.15 + 0.85 * Math.abs(c)), p.size); // tumble
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    t += dt;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Wind: two slow sines make soft gusts; scroll velocity adds depth parallax.
    const wind = (Math.sin(t * 0.004) * 0.35 + Math.sin(t * 0.0137) * 0.2) * dpr;
    const sv = Math.max(-40, Math.min(40, window.__lenis?.velocity || 0));

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.sway += 0.018 * dt;
      p.flip += p.vflip * dt * (1 + Math.abs(sv) * 0.02);
      p.rot += p.vrot * dt;
      p.x += (p.vx + wind * p.z + Math.sin(p.sway) * p.swayAmp * 0.5) * dt;
      p.y += (p.vy - sv * 0.35 * p.z * dpr) * dt;
      p.alpha = Math.min(1, p.alpha + 0.02 * dt);
      draw(p);

      const m = 60 * dpr;
      if (p.y > h + m || p.y < -h - m || p.x < -m || p.x > w + m) {
        if (p.temp || parts.length > AMBIENT + 4) { parts.splice(i, 1); continue; }
        spawn(p, { y: sv < -2 ? h + m * 0.5 : -m * 0.5 }); // re-enter from where scroll is pulling
        p.alpha = 1;
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// Helpers
function mix(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

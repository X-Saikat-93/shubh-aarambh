// ═══════════════════════════════════════════════════════════
// Everdezign Framer Exact Replica Engine
// ═══════════════════════════════════════════════════════════
import { CONFIG, photo } from './config.js?v=52';
import { initCoverLife } from './cover-life.js?v=52';

// ───────── Falling Red Rose Petals Canvas (Subtle & Organic) ─────────
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height;
  function size() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  // A handful of petals for a serene, graceful drift in front of the content
  const COUNT = 8;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Dark red velvet rose shades: [deep base, body, light crown, edge highlight]
  const ROSE_SHADES = [
    ['#3d0209', '#7a0a18', '#a3162a', 'rgba(214, 74, 92, 0.55)'],
    ['#33020a', '#6c0815', '#951224', 'rgba(205, 64, 84, 0.5)'],
    ['#45040e', '#850d1d', '#b01d33', 'rgba(224, 88, 104, 0.5)'],
    ['#2c0106', '#5e0711', '#86101f', 'rgba(196, 58, 76, 0.5)']
  ];

  // Real rose petal silhouettes, traced from reference petals. Each is a set of points around
  // the outline (100 x 110 box) drawn as a smooth closed curve, plus where the petal was
  // attached to the flower (the darker base) and, for folded petals, the crease line.
  const PETAL_SHAPES = [
    { // broad, slightly squared petal with one soft corner
      pts: [[44, 104], [24, 96], [9, 74], [6, 46], [12, 20], [32, 8], [58, 5], [84, 9], [96, 28], [95, 56], [84, 84], [64, 100]],
      base: [44, 102]
    },
    { // rounded oval
      pts: [[48, 105], [28, 97], [13, 78], [9, 52], [15, 26], [33, 9], [56, 5], [78, 12], [91, 32], [92, 60], [83, 84], [66, 100]],
      base: [48, 103]
    },
    { // longer leaning oval
      pts: [[42, 106], [27, 96], [18, 76], [16, 50], [22, 25], [37, 8], [57, 3], [74, 12], [84, 32], [85, 58], [76, 84], [58, 101]],
      base: [44, 104]
    },
    { // rounded triangle, attached at one corner
      pts: [[24, 104], [12, 86], [6, 60], [12, 34], [30, 15], [56, 6], [82, 7], [96, 20], [94, 46], [80, 72], [56, 94], [36, 104]],
      base: [26, 100]
    },
    { // folded petal: rolled lip along one side
      pts: [[52, 106], [36, 98], [25, 80], [22, 56], [28, 32], [42, 12], [62, 4], [80, 9], [88, 28], [84, 54], [73, 80], [62, 99]],
      base: [52, 104],
      crease: [[63, 6], [52, 34], [47, 66], [51, 103]]
    },
    { // wide petal with a soft diagonal crease
      pts: [[46, 104], [26, 96], [10, 76], [6, 50], [14, 26], [34, 10], [60, 6], [84, 12], [96, 32], [94, 60], [82, 86], [64, 100]],
      base: [46, 102],
      crease: [[20, 18], [42, 46], [58, 74], [62, 100]]
    }
  ];

  function smoothClosed(c, pts) {
    const n = pts.length;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      c.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      );
    }
    c.closePath();
  }

  // Pre-render each shape x shade once as a shaded sprite (front face + duller back face).
  function makeSprite(shape, shade, back) {
    const S = 100, H = 110, pad = 10;
    const cv = document.createElement('canvas');
    cv.width = (S + pad * 2) * DPR;
    cv.height = (H + pad * 2) * DPR;
    const c = cv.getContext('2d');
    c.scale(DPR, DPR);
    c.translate(pad, pad);
    const [bx, by] = shape.base;

    // Soft shadow so the petal reads as a real object over the page
    c.save();
    c.shadowColor = 'rgba(40, 0, 6, 0.35)';
    c.shadowBlur = 7;
    c.shadowOffsetX = 2;
    c.shadowOffsetY = 4;
    smoothClosed(c, shape.pts);
    c.fillStyle = shade[1];
    c.fill();
    c.restore();

    c.save();
    smoothClosed(c, shape.pts);
    c.clip();

    // Body: lighter velvety crown fading into a deep base where it met the flower
    const g = c.createRadialGradient(bx, by, 2, bx, by, 115);
    g.addColorStop(0, shade[0]);
    g.addColorStop(0.42, shade[1]);
    g.addColorStop(1, back ? shade[1] : shade[2]);
    c.fillStyle = g;
    c.fillRect(0, 0, S, H);

    // Cupped curvature: darker towards the edges, lit across the middle
    const cup = c.createRadialGradient(54, 44, 10, 50, 52, 66);
    cup.addColorStop(0, 'rgba(255, 190, 200, 0.05)');
    cup.addColorStop(0.7, 'rgba(20, 0, 4, 0)');
    cup.addColorStop(1, 'rgba(20, 0, 4, 0.4)');
    c.fillStyle = cup;
    c.fillRect(0, 0, S, H);

    // Satin sheen on the upper body
    const sheen = c.createRadialGradient(60, 30, 2, 60, 30, 42);
    sheen.addColorStop(0, back ? 'rgba(255, 170, 185, 0.1)' : 'rgba(255, 175, 190, 0.26)');
    sheen.addColorStop(1, 'rgba(255, 175, 190, 0)');
    c.fillStyle = sheen;
    c.fillRect(0, 0, S, H);

    // Faint, softly curving veins fanning out from the base (real petals barely show them)
    c.lineWidth = 0.6;
    for (let i = -4; i <= 4; i++) {
      const ang = -Math.PI / 2 + i * 0.2 + (50 - bx) * 0.006;
      const ex = bx + Math.cos(ang) * 100, ey = by + Math.sin(ang) * 100;
      c.strokeStyle = `rgba(30, 0, 6, ${0.06 + (4 - Math.abs(i)) * 0.01})`;
      c.beginPath();
      c.moveTo(bx + i * 1.2, by);
      c.quadraticCurveTo(bx + (ex - bx) * 0.45 + i * 2, by + (ey - by) * 0.55, ex, ey);
      c.stroke();
    }

    // Fold: a lit rolled lip on one side of the crease, shadow on the other
    if (shape.crease) {
      const [a0, a1, a2, a3] = shape.crease;
      const creasePath = (dx) => {
        c.beginPath();
        c.moveTo(a0[0] + dx, a0[1]);
        c.bezierCurveTo(a1[0] + dx, a1[1], a2[0] + dx, a2[1], a3[0] + dx, a3[1]);
      };
      c.lineCap = 'round';
      // Layered wide, faint strokes = a soft fold without canvas filters (works on iOS Safari too)
      const lit = back ? '255, 160, 175' : '255, 168, 182';
      [16, 11, 6].forEach((w, i) => {
        creasePath(-5);
        c.strokeStyle = `rgba(${lit}, ${back ? 0.03 : 0.05 + i * 0.015})`;
        c.lineWidth = w;
        c.stroke();
        creasePath(6);
        c.strokeStyle = `rgba(25, 0, 5, ${0.05 + i * 0.03})`;
        c.lineWidth = w;
        c.stroke();
      });
    }
    c.restore();

    // Thin lit rim along the edge, strongest away from the base
    c.save();
    smoothClosed(c, shape.pts);
    const rim = c.createRadialGradient(bx, by, 30, bx, by, 110);
    rim.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rim.addColorStop(1, shade[3]);
    c.strokeStyle = rim;
    c.lineWidth = 1.1;
    c.stroke();
    c.restore();

    return { cv, w: S + pad * 2, h: H + pad * 2 };
  }

  // Every shape in every shade, so each falling petal looks different
  const SPRITES = [];
  PETAL_SHAPES.forEach((shape) => {
    ROSE_SHADES.forEach((shade) => {
      SPRITES.push({ front: makeSprite(shape, shade, false), back: makeSprite(shape, shade, true) });
    });
  });

  const petals = [];

  function resetPetal(p, initial, idx = 0) {
    p.sprite = SPRITES[Math.floor(Math.random() * SPRITES.length)];
    p.r = 11 + Math.random() * 7; // natural petal size (half-height in px)
    p.x = Math.random() * width;
    p.y = initial ? (Math.random() * height) : -25;
    
    // Gentle slow descent
    p.dy = 0.65 + Math.random() * 0.45;
    p.wind = -0.20 + Math.random() * 0.40;
    
    // Natural horizontal air sway
    p.swayPhase = Math.random() * Math.PI * 2;
    p.swaySpeed = 0.015 + Math.random() * 0.015;
    p.swayAmp = 0.75 + Math.random() * 0.6;
    
    // 3D air tumble
    p.rot = Math.random() * Math.PI * 2;
    p.rotSpeed = -0.015 + Math.random() * 0.030;
    p.tilt = Math.random() * Math.PI * 2;
    p.tiltSpeed = 0.022 + Math.random() * 0.028;
    
    p.wait = initial ? idx * 30 : Math.floor(Math.random() * 60);
  }

  for (let i = 0; i < COUNT; i++) {
    const p = {};
    resetPetal(p, true, i);
    petals.push(p);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    
    // 3D perspective foreshortening as the petal gently flips in the breeze
    const flip = Math.cos(p.tilt);
    const squish = Math.sin(p.tilt * 0.7) * 0.22 + 0.78;
    // Never collapse to a hairline: real petals are cupped, so some width always shows
    const sx = Math.sign(flip || 1) * Math.max(Math.abs(flip), 0.18);
    ctx.scale(sx, squish);

    const spr = flip >= 0 ? p.sprite.front : p.sprite.back;
    const k = (p.r * 2) / 110; // sprite petal body is 110 units tall
    const dw = spr.w * k, dh = spr.h * k;
    ctx.drawImage(spr.cv, -dw / 2, -dh / 2, dw, dh);

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      if (p.wait > 0) {
        p.wait--;
        continue;
      }

      drawPetal(p);

      // Smooth subtle floating physics
      p.y += p.dy;
      p.swayPhase += p.swaySpeed;
      p.x += Math.sin(p.swayPhase) * p.swayAmp + p.wind;
      p.rot += p.rotSpeed;
      p.tilt += p.tiltSpeed;

      // Wrap around seamlessly when drifting off the bottom or sides
      if (p.y > height + 30) {
        resetPetal(p, false);
      }
      if (p.x < -30) p.x = width + 20;
      if (p.x > width + 30) p.x = -20;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// ───────── Real-time Countdown ─────────
function initCountdown() {
  const target = new Date(CONFIG.weddingISO).getTime();
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function update() {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ───────── Special Moments Slow Sliding Marquee (Reference Match) ─────────
function initMomentsMarquee() {
  const track = document.getElementById('moments-marquee');
  if (!track) return;

  const photoList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // Duplicate list for seamless infinite marquee loop
  const doubleList = [...photoList, ...photoList];

  track.innerHTML = doubleList.map((num) => `
    <div class="moments-marquee-item">
      <img src="${photo(num, 'lg')}" alt="Special Moments of Garv and Kaavya" loading="lazy" />
    </div>
  `).join('');
}

// ───────── Scroll Zoom-In & Appearing Animations ─────────
function initScrollObserver() {
  const targets = document.querySelectorAll('.scroll-reveal, .zoom-reveal, .framer-card, .event-scene-wrap, .wardrobe-scene-wrap');

  // Ensure all images inside a wardrobe scene are decoded before triggering slide-in animations on live mobile networks
  function revealWardrobeSceneWhenReady(sceneEl) {
    sceneEl.dataset.inViewport = '1';
    const imgs = Array.from(sceneEl.querySelectorAll('img'));
    const pending = imgs.filter((img) => !img.complete || img.naturalWidth === 0);
    if (pending.length === 0) {
      sceneEl.classList.add('is-in-view');
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (sceneEl.dataset.inViewport === '1') {
        sceneEl.classList.add('is-in-view');
      }
    };
    Promise.all(
      pending.map((img) => new Promise((res) => {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      }))
    ).then(finish);
    setTimeout(finish, 900);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('wardrobe-scene-wrap')) {
          revealWardrobeSceneWhenReady(entry.target);
        } else {
          entry.target.classList.add('is-in-view');
        }
      } else if (entry.target.classList.contains('wardrobe-scene-wrap')) {
        // Re-trigger wardrobe clothes animation smoothly whenever user scrolls back into view
        entry.target.dataset.inViewport = '0';
        entry.target.classList.remove('is-in-view');
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach((el) => observer.observe(el));
}





// ───────── RSVP Form Logic ─────────
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const msgEl = document.getElementById('rsvp-msg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-rsvp-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const attendance = form.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
    const name = form.querySelector('#rsvp-name')?.value.trim();
    const phone = form.querySelector('#rsvp-phone')?.value.trim();
    const guests = form.querySelector('#rsvp-guests')?.value || '1';
    const message = form.querySelector('#rsvp-message')?.value.trim() || '';

    const payload = { attendance, name, phone, guests, message, date: new Date().toISOString() };

    let success = false;
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) success = true;
    } catch (err) {}

    if (success) {
      msgEl.className = 'rsvp-status-msg success';
      msgEl.textContent = 'Thank you! Your RSVP has been confirmed with love.';
      form.reset();
    } else {
      const waText = encodeURIComponent(
        `*Wedding RSVP: Garv & Kaavya*\n` +
        `• Status: ${attendance}\n` +
        `• Name: ${name}\n` +
        `• Contact: ${phone}\n` +
        `• Guests: ${guests}\n` +
        (message ? `• Note: ${message}\n` : '') +
        `#kaarvinlove`
      );
      msgEl.className = 'rsvp-status-msg success';
      msgEl.innerHTML = `RSVP Recorded! <a href="https://wa.me/?text=${waText}" target="_blank" style="color:var(--framer-burgundy);text-decoration:underline;font-weight:600;">Confirm via WhatsApp &rarr;</a>`;
    }

    btn.disabled = false;
    btn.textContent = originalText;
  });
}

// ───────── Interactive Scratch to Reveal Widget (Exact Framer Match) ─────────
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const widget = document.getElementById('scratch-widget');
  const hint = document.getElementById('scratch-hint');
  if (!canvas || !widget) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  let isRevealed = false;
  let isDrawing = false;
  let lastPos = null;
  const dpr = Math.max(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    if (isRevealed) return;
    const rect = widget.getBoundingClientRect();
    const w = rect.width > 50 ? rect.width : 340;
    const h = rect.height > 50 ? rect.height : 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'source-over';

    // Rich burgundy background #6B1D22
    ctx.fillStyle = '#6B1D22';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 20);
      ctx.fill();

      // Subtle gold inner frame
      ctx.strokeStyle = '#E4B86A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 14);
      ctx.stroke();
    } else {
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#E4B86A';
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, w - 16, h - 16);
    }

    // Text: 'Scratch to reveal'
    ctx.font = 'italic 400 24px "Playfair Display", "Dancing Script", Georgia, serif';
    ctx.fillStyle = '#E4B86A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to reveal', w / 2, h / 2);
    ctx.restore();
  }

  // Export resize to be callable when revealed
  window.__refreshScratchCanvas = resizeCanvas;

  if (document.fonts) {
    document.fonts.ready.then(resizeCanvas);
  } else {
    resizeCanvas();
  }
  window.addEventListener('resize', resizeCanvas);

  function getPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  }

  function checkProgress() {
    if (isRevealed) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    const totalSampled = imgData.length / 32;
    for (let i = 3; i < imgData.length; i += 32) {
      if (imgData[i] === 0) cleared++;
    }
    const percent = (cleared / totalSampled) * 100;
    if (percent >= 35) {
      isRevealed = true;
      canvas.style.transition = 'opacity 0.6s ease-out';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      if (hint) {
        hint.textContent = '✨ Auspicious Date Revealed! ✨';
        hint.style.color = '#6B1D22';
        hint.style.fontWeight = '600';
      }
      widget.classList.add('is-revealed-glow');
      triggerScratchFireworks();
    }
  }

  let scratchSparks = null;
  function getSparksEngine() {
    if (!scratchSparks) {
      const fwCanvas = document.getElementById('scratch-fireworks-canvas');
      if (!fwCanvas) return null;
      const fctx = fwCanvas.getContext('2d');
      if (!fctx) return null;

      let sparks = [];
      let sparkAnimId = null;

      function ensureFwSize() {
        const rect = fwCanvas.getBoundingClientRect();
        const curDpr = Math.max(window.devicePixelRatio || 1, 2);
        const w = rect.width > 50 ? rect.width : 540;
        const h = rect.height > 50 ? rect.height : 420;
        if (fwCanvas.width !== Math.round(w * curDpr) || fwCanvas.height !== Math.round(h * curDpr)) {
          fwCanvas.width = Math.round(w * curDpr);
          fwCanvas.height = Math.round(h * curDpr);
        }
        return { curDpr, rect };
      }

      function emit(clientX, clientY, count = 4) {
        if (window.__fireworksRunning) return;
        const { curDpr, rect } = ensureFwSize();
        const sx = (clientX - rect.left) * curDpr;
        const sy = (clientY - rect.top) * curDpr;
        const goldColors = ['#FFFFFF', '#FFF9C4', '#FFE082', '#FFD54F', '#FFCA28', '#FF9800', '#FF8F00'];

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (1.8 + Math.random() * 4.2) * curDpr;
          sparks.push({
            x: sx + (Math.random() - 0.5) * 6 * curDpr,
            y: sy + (Math.random() - 0.5) * 6 * curDpr,
            prevX: sx,
            prevY: sy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.4 * curDpr,
            color: goldColors[Math.floor(Math.random() * goldColors.length)],
            alpha: 1.0,
            decay: 0.038 + Math.random() * 0.040,
            gravity: 0.14 * curDpr,
            size: (1.2 + Math.random() * 1.8) * curDpr
          });
        }

        if (!sparkAnimId) sparkAnimId = requestAnimationFrame(renderSparks);
      }

      function renderSparks() {
        if (window.__fireworksRunning) {
          sparks = [];
          sparkAnimId = null;
          return;
        }

        fctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        fctx.save();
        fctx.globalCompositeOperation = 'lighter';

        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.prevX = p.x;
          p.prevY = p.y;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.93;
          p.vy = p.vy * 0.93 + p.gravity;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          fctx.beginPath();
          fctx.moveTo(p.prevX, p.prevY);
          fctx.lineTo(p.x, p.y);
          fctx.strokeStyle = p.color;
          fctx.lineWidth = p.size;
          fctx.lineCap = 'round';
          fctx.globalAlpha = p.alpha;
          fctx.stroke();

          fctx.fillStyle = '#FFFFFF';
          fctx.globalAlpha = Math.min(1, p.alpha * 1.4);
          fctx.beginPath();
          fctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          fctx.fill();
        }

        fctx.restore();

        if (sparks.length > 0) {
          sparkAnimId = requestAnimationFrame(renderSparks);
        } else {
          fctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
          sparkAnimId = null;
        }
      }

      scratchSparks = { emit };
    }
    return scratchSparks;
  }

  function scratch(x, y, clientX, clientY) {
    const brushRadius = 22 * dpr;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;

    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    lastPos = { x, y };

    if (clientX !== undefined && clientY !== undefined) {
      const se = getSparksEngine();
      if (se) se.emit(clientX, clientY, 4);
    }

    checkProgress();
  }

  function handleStart(e) {
    if (isRevealed) return;
    isDrawing = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = getPos(clientX, clientY);
    scratch(pos.x, pos.y, clientX, clientY);
  }

  function handleMove(e) {
    if (!isDrawing || isRevealed) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = getPos(clientX, clientY);
    scratch(pos.x, pos.y, clientX, clientY);
  }

  function handleEnd() {
    isDrawing = false;
    lastPos = null;
  }

  canvas.addEventListener('pointerdown', handleStart);
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', handleEnd);
  window.addEventListener('pointercancel', handleEnd);

  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  canvas.addEventListener('touchend', handleEnd);
}

// ───────── Scratch Reveal Celebration Fireworks Animation (Realistic & Rich) ─────────
function triggerScratchFireworks() {
  const fwCanvas = document.getElementById('scratch-fireworks-canvas');
  if (!fwCanvas) return;
  const ctx = fwCanvas.getContext('2d');
  if (!ctx) return;

  window.__fireworksRunning = true;

  const rect = fwCanvas.getBoundingClientRect();
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  const w = rect.width > 50 ? rect.width : 540;
  const h = rect.height > 50 ? rect.height : 420;
  fwCanvas.width = Math.round(w * dpr);
  fwCanvas.height = Math.round(h * dpr);

  // Imperial 24K Royal Wedding Palette: Champagne Diamond, Brilliant Gold, Rose Ember
  const goldPalette = [
    '#FFFFFF', // Incandescent diamond white core
    '#FFFDE7', // Radiant starlight diamond
    '#FFF59D', // Shimmering champagne
    '#FFD700', // Pure 24K imperial gold
    '#FFCA28', // Radiant royal amber
    '#FFC107', // Rich warm gold
    '#FFA000', // Deep golden spark
    '#FF8F00', // Saffron golden ember
    '#FFB74D', // Rose champagne
    '#FFE082'  // Pale gold shimmer
  ];

  let particles = [];
  let flashes = [];
  let crackles = [];
  let animId = null;
  let activeBursts = 0;

  function createFlash(cx, cy, maxRadius, color) {
    flashes.push({
      x: cx * dpr,
      y: cy * dpr,
      radius: 8 * dpr,
      maxRadius: maxRadius * dpr,
      color: color || '#FFD700',
      alpha: 1.0,
      decay: 0.048
    });
  }

  function createBurst(cx, cy, count, baseColor, type) {
    createFlash(cx, cy, type === 'grand' ? 68 : 48, baseColor);

    const isWillow = type === 'willow';
    const isRing = type === 'ring';
    const isGrand = type === 'grand';

    for (let i = 0; i < count; i++) {
      let angle, speed;
      if (isRing) {
        angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
        speed = (3.5 + Math.random() * 1.6) * dpr;
      } else {
        angle = Math.random() * Math.PI * 2;
        speed = (1.8 + Math.random() * (isWillow ? 4.8 : 6.6)) * dpr;
      }

      const color = Math.random() < 0.65
        ? (baseColor || goldPalette[Math.floor(Math.random() * goldPalette.length)])
        : goldPalette[Math.floor(Math.random() * goldPalette.length)];
      const startX = cx * dpr;
      const startY = cy * dpr;

      particles.push({
        x: startX,
        y: startY,
        prevX: startX,
        prevY: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1.0,
        decay: isWillow ? (0.007 + Math.random() * 0.006) : (0.010 + Math.random() * 0.012),
        drag: isWillow ? 0.952 : 0.942,
        gravity: (isWillow ? 0.095 : 0.070) * dpr,
        size: (1.8 + Math.random() * (isWillow ? 2.8 : 2.4)) * dpr,
        isGlint: Math.random() < 0.55,
        twinkleRate: 0.15 + Math.random() * 0.25,
        age: 0,
        canCrackle: isGrand && Math.random() < 0.35,
        trail: isWillow ? [] : null,
        maxTrail: 7
      });
    }
  }

  // Staggered regal fireworks show centered over the revealed date card
  const burstConfigs = [
    { delay: 0,    cx: w * 0.35, cy: h * 0.44, count: 75, color: '#FFD700', type: 'willow' },
    { delay: 180,  cx: w * 0.65, cy: h * 0.38, count: 68, color: '#FFF59D', type: 'ring' },
    { delay: 380,  cx: w * 0.50, cy: h * 0.32, count: 96, color: '#FFCA28', type: 'grand' },
    { delay: 620,  cx: w * 0.30, cy: h * 0.50, count: 65, color: '#FFFFFF', type: 'willow' },
    { delay: 820,  cx: w * 0.70, cy: h * 0.46, count: 70, color: '#FFC107', type: 'willow' },
    { delay: 1080, cx: w * 0.40, cy: h * 0.35, count: 85, color: '#FFD700', type: 'grand' },
    { delay: 1140, cx: w * 0.60, cy: h * 0.35, count: 85, color: '#FFFDE7', type: 'grand' },
    { delay: 1420, cx: w * 0.50, cy: h * 0.40, count: 110, color: '#FFE082', type: 'grand' }
  ];

  activeBursts = burstConfigs.length;

  burstConfigs.forEach(b => {
    setTimeout(() => {
      createBurst(b.cx, b.cy, b.count, b.color, b.type);
      activeBursts--;
    }, b.delay);
  });

  function render() {
    ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    // 1. Explosive Flashes & Shockwave Rings
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      f.radius += (f.maxRadius - f.radius) * 0.26;
      f.alpha -= f.decay;

      if (f.alpha <= 0) {
        flashes.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha * 0.90})`);
      grad.addColorStop(0.35, `rgba(255, 225, 120, ${f.alpha * 0.50})`);
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 240, 180, ${f.alpha * 0.70})`;
      ctx.lineWidth = 1.8 * dpr;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius * 0.82, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // 2. Secondary Crackles
    for (let i = crackles.length - 1; i >= 0; i--) {
      const c = crackles[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.08 * dpr;
      c.alpha -= c.decay;

      if (c.alpha <= 0) {
        crackles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Pyrotechnic Spark Particles with Realistic Motion Streaks & Twinkle
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.prevX = p.x;
      p.prevY = p.y;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.alpha -= p.decay;
      p.age++;

      // Trigger secondary crackle burst as particle slows down
      if (p.canCrackle && p.alpha < 0.45 && Math.hypot(p.vx, p.vy) < 1.2 * dpr) {
        p.canCrackle = false;
        for (let k = 0; k < 5; k++) {
          const cAngle = Math.random() * Math.PI * 2;
          const cSpeed = (0.8 + Math.random() * 2.2) * dpr;
          crackles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(cAngle) * cSpeed,
            vy: Math.sin(cAngle) * cSpeed,
            color: '#FFFFFF',
            alpha: 1.0,
            decay: 0.045 + Math.random() * 0.035,
            size: (0.9 + Math.random() * 1.3) * dpr
          });
        }
      }

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      if (p.trail) {
        p.trail.unshift({ x: p.prevX, y: p.prevY, alpha: p.alpha });
        if (p.trail.length > p.maxTrail) p.trail.pop();
      }

      // Shimmering pyrotechnic twinkle factor
      const twinkle = p.isGlint ? (0.75 + 0.25 * Math.sin(p.age * p.twinkleRate)) : 1.0;
      const currentAlpha = Math.max(0, Math.min(1, p.alpha * twinkle));

      // Brocade Willow Trail
      if (p.trail && p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.85;
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentAlpha * 0.48;
        ctx.stroke();
      }

      // Main High-Speed Firework Motion Streak (Velocity Tail)
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.globalAlpha = currentAlpha;
      ctx.stroke();

      // Incandescent Diamond Spark Head
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = Math.min(1, currentAlpha * 1.4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.68, 0, Math.PI * 2);
      ctx.fill();

      // Four-Point Diamond Glint
      if (p.isGlint && currentAlpha > 0.40 && Math.sin(p.age * p.twinkleRate) > 0.6) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2 * dpr;
        const glintLen = p.size * 2.8;
        ctx.beginPath();
        ctx.moveTo(p.x - glintLen, p.y);
        ctx.lineTo(p.x + glintLen, p.y);
        ctx.moveTo(p.x, p.y - glintLen);
        ctx.lineTo(p.x, p.y + glintLen);
        ctx.stroke();
      }
    }

    ctx.restore();

    if (particles.length > 0 || flashes.length > 0 || crackles.length > 0 || activeBursts > 0) {
      animId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
      window.__fireworksRunning = false;
      if (animId) cancelAnimationFrame(animId);
    }
  }

  animId = requestAnimationFrame(render);
}
window.__triggerScratchFireworks = triggerScratchFireworks;

// ───────── Page 1 Monogram Star Flare Alignment ─────────
function initGkGlow() {
  const coverImg = document.querySelector('#cover-card .page-fullwidth-img');
  const flare = document.querySelector('.gk-ring-star-flare');
  const shine = document.querySelector('.gk-gold-shine');
  const sharpLogo = document.querySelector('.cover-logo-sharp');
  if (!coverImg) return;

  function update() {
    const rect = coverImg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Cover natural dimensions: 1152 x 2048
    const naturalRatio = 1152 / 2048;
    const currentRatio = rect.width / rect.height;

    let renderedW, renderedH;
    if (currentRatio > naturalRatio) {
      renderedW = rect.width;
      renderedH = rect.width / naturalRatio;
    } else {
      renderedH = rect.height;
      renderedW = rect.height * naturalRatio;
    }

    const offsetX = (rect.width - renderedW) / 2;
    const offsetY = 0;

    if (flare) {
      flare.style.left = `${offsetX + renderedW * 0.6091}px`;
      flare.style.top = `${offsetY + renderedH * 0.3427}px`;
    }
    // Sharp logo overlay: the cover has the logo painted at centre (576, 828), 434px wide
    if (sharpLogo && !(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {   // fallback only
      sharpLogo.style.left = `${offsetX + renderedW * (576 / 1152)}px`;
      sharpLogo.style.top = `${offsetY + renderedH * (828 / 2048)}px`;
      sharpLogo.style.width = `${renderedW * (434 / 1152)}px`;
    }
  }

  update();
  if (coverImg.complete) {
    update();
  } else {
    coverImg.addEventListener('load', update);
  }
  window.addEventListener('resize', update, { passive: true });
}

// ───────── Horizontal Layered Wardrobe Carousel ─────────
function initWardrobeCarousel() {
  const container = document.getElementById('wardrobe-carousel-container');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.wardrobe-card-slide'));
  if (!slides.length) return;

  const headingEl = document.getElementById('wardrobe-event-heading');
  const prevBtn = document.getElementById('wardrobe-prev-btn');
  const nextBtn = document.getElementById('wardrobe-next-btn');
  const dots = Array.from(document.querySelectorAll('.wardrobe-dot'));

  let activeIndex = 0;
  const total = slides.length;
  let isThrottled = false;
  let lastNavActionTime = 0;

  function updateCarousel(targetIdx) {
    if (isThrottled) return;
    isThrottled = true;
    lastNavActionTime = Date.now();
    setTimeout(() => { isThrottled = false; }, 260);

    activeIndex = ((targetIdx % total) + total) % total;

    slides.forEach((slide, i) => {
      let diff = i - activeIndex;
      // Handle cyclical wrapping for 4 items
      if (diff === 3) diff = -1;
      if (diff === -3) diff = 1;
      if (diff > 1) diff = 2;
      if (diff < -1) diff = -2;

      slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
      const innerScene = slide.querySelector('.wardrobe-scene-wrap');

      if (diff === 0) {
        slide.classList.add('is-active');
        if (innerScene) {
          innerScene.classList.add('is-in-view');
        }
      } else if (diff === -1) {
        slide.classList.add('is-prev');
      } else if (diff === 1) {
        slide.classList.add('is-next');
      } else {
        slide.classList.add('is-hidden');
      }
    });

    // Dynamic Heading crossfade (Event name only)
    const activeSlide = slides[activeIndex];
    if (activeSlide && headingEl) {
      const eventName = activeSlide.getAttribute('data-event-name') || '';

      headingEl.style.opacity = '0';
      headingEl.style.transform = 'translateY(-4px)';

      setTimeout(() => {
        headingEl.innerHTML = eventName;
        headingEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        headingEl.style.opacity = '1';
        headingEl.style.transform = 'translateY(0)';
      }, 140);
    }

    // Carousel Dots
    dots.forEach((dot, idx) => {
      const isSel = idx === activeIndex;
      dot.classList.toggle('is-active', isSel);
      dot.setAttribute('aria-selected', isSel ? 'true' : 'false');
    });
  }

  function goNext(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateCarousel(activeIndex + 1);
  }

  function goPrev(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateCarousel(activeIndex - 1);
  }

  // Previous & Next navigation arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', goPrev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', goNext);
  }

  // Click on peek cards to select them (with debounce and active-card protection)
  slides.forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (Date.now() - lastNavActionTime < 380) return;
      if (e.target.closest('.wardrobe-swatches-wrap, .wardrobe-nav-btn')) return;
      if (slide.classList.contains('is-active')) return;

      if (slide.classList.contains('is-prev')) {
        goPrev(e);
      } else if (slide.classList.contains('is-next')) {
        goNext(e);
      }
    });
  });

  // Dots navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateCarousel(i);
    });
  });

  // Swatch interaction (Hover + Click)
  slides.forEach((slide) => {
    const swatches = Array.from(slide.querySelectorAll('.wardrobe-swatch'));
    const nameEl = slide.querySelector('.wardrobe-swatch-name');
    swatches.forEach((swatch) => {
      function selectSwatch() {
        swatches.forEach((s) => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
        const colorName = swatch.getAttribute('data-color');
        if (nameEl && colorName) {
          nameEl.textContent = colorName;
        }
      }
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSwatch();
      });
      swatch.addEventListener('mouseenter', () => {
        const colorName = swatch.getAttribute('data-color');
        if (nameEl && colorName) {
          nameEl.textContent = colorName;
        }
      });
      swatch.addEventListener('mouseleave', () => {
        const activeSwatch = slide.querySelector('.wardrobe-swatch.is-active');
        if (nameEl && activeSwatch) {
          nameEl.textContent = activeSwatch.getAttribute('data-color') || '';
        }
      });
    });
  });

  // Mobile Touch Gestures (Swipe left / right)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  container.addEventListener('touchstart', (e) => {
    // Ignore touch starting on nav buttons, swatches, or dots to prevent accidental swipes
    if (e.target.closest('.wardrobe-nav-btn, .wardrobe-swatches-wrap, .wardrobe-dot')) {
      touchStartX = 0;
      return;
    }
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const duration = Date.now() - touchStartTime;

    // Detect horizontal swipe
    if (Math.abs(diffX) > 42 && Math.abs(diffX) > Math.abs(diffY) * 1.4 && duration < 550) {
      if (diffX < 0) {
        goNext(); // Swipe left -> Next
      } else {
        goPrev(); // Swipe right -> Prev
      }
    }
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });

  // Keyboard navigation support
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    }
  });

  // Initial state setup
  updateCarousel(0);
}

// ───────── Master Boot & Video Opening Flow ─────────
// Phones otherwise restore the old scroll position on reload, then get yanked back to the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initCountdown();
  initMomentsMarquee();
  initRSVP();
  initScrollObserver();
  initScratchCard();
  initGkGlow();
  initCoverLife();
  initWardrobeCarousel();

  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelopeVideo = document.getElementById('envelope-video');
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const mainCard = document.getElementById('main-card-layout');
  const coverVideo = document.getElementById('cover-video');
  const weddingAudio = document.getElementById('wedding-audio');
  const musicBtn = document.getElementById('music-btn');
  const iconPlay = document.getElementById('music-icon-play');
  const iconPause = document.getElementById('music-icon-pause');
  let hasOpened = false;

  function updateMusicState() {
    if (!weddingAudio) return;
    if (weddingAudio.paused) {
      if (iconPlay) iconPlay.classList.remove('is-hidden');
      if (iconPause) iconPause.classList.add('is-hidden');
    } else {
      if (iconPlay) iconPlay.classList.add('is-hidden');
      if (iconPause) iconPause.classList.remove('is-hidden');
    }
  }

  function triggerOpen() {
    if (hasOpened) return;
    hasOpened = true;

    // 1. Start wedding music immediately on user tap gesture
    if (weddingAudio) {
      weddingAudio.play().then(updateMusicState).catch(() => {});
    }

    let revealed = false;
    function revealLandingPage() {
      if (revealed) return;
      revealed = true;
      // Pin the scroll at the top *instantly* before unlocking. The page has
      // scroll-behavior: smooth, so a plain scrollTo animated a visible slide on phones.
      const root = document.documentElement;
      root.style.scrollBehavior = 'auto';
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.classList.remove('is-envelope-closed');
      if (mainCard) mainCard.classList.add('is-revealed');
      if (envelopeWrapper) envelopeWrapper.classList.add('is-hidden');
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => { root.style.scrollBehavior = ''; });

      window.dispatchEvent(new Event('resize'));

      if (window.__refreshScratchCanvas) {
        window.__refreshScratchCanvas();
      }

      // Complete cleanup after the CSS fade (up to 2.2s) completes
      setTimeout(() => {
        if (envelopeWrapper) envelopeWrapper.style.display = 'none';
        if (envelopeVideo) envelopeVideo.pause();
        window.dispatchEvent(new Event('resize'));
        if (window.__refreshScratchCanvas) {
          window.__refreshScratchCanvas();
        }
      }, 2300);
    }

    // 2. Play authentic glowing video and sync reveal to actual video progress (buffer-safe on live mobile networks)
    if (envelopeVideo) {
      envelopeVideo.muted = true;
      envelopeVideo.defaultMuted = true;
      envelopeVideo.currentTime = 0;
      // A touch slower than recorded so the flaps open with some weight (not rushed);
      // 0.8x keeps the 30fps footage smooth.
      try { envelopeVideo.defaultPlaybackRate = 0.8; envelopeVideo.playbackRate = 0.8; } catch (e) {}

      // The video is used only for the flaps opening (0 – ~1s). After that it would show a
      // strong glow and then an old version of the cover art, so we take over with our own
      // finale: calm interior + red floral -> G&K logo grows from the centre -> slow fade to
      // the landing page.
      // The video's gold floral starts to show through the parting flaps at ~0.43s
      const STAGE_AT = 0.42;
      const FLAPS_OPEN_AT = 1.0;   // video time when the flaps are fully open
      let staged = false;

      // Place the floral exactly where the interior art (720x1280, object-fit: cover) has it,
      // and size the logo to just under the screen.
      const placeStage = () => {
        if (!envelopeContainer) return;
        const W = envelopeContainer.clientWidth, H = envelopeContainer.clientHeight;
        const s = Math.max(W / 720, H / 1280);
        const ox = (W - 720 * s) / 2, oy = (H - 1280 * s) / 2;
        const st = envelopeContainer.style;
        st.setProperty('--env-s', s.toFixed(4));
        st.setProperty('--env-x', (ox + 361 * s).toFixed(1) + 'px');
        st.setProperty('--env-y', (oy + 611 * s).toFixed(1) + 'px');
        st.setProperty('--env-logo-w', Math.round(Math.min(W * 0.84, H * 0.62)) + 'px');
      };

      // As the crisp logo spreads away (CSS), gold sparkles fly off it. Each sparkle is born on a
      // point of the logo, fades in while already moving outward (faster than the logo expands),
      // then twinkles out. Nothing ever sits still, and there's no dotted copy of the logo.
      const burstLogoIntoGlitter = () => {
        const logo = envelopeWrapper.querySelector('.env-logo');
        if (!logo || !logo.naturalWidth) return;
        const r = logo.getBoundingClientRect();
        const lw = Math.max(1, Math.round(r.width)), lh = Math.max(1, Math.round(r.height));
        let data;
        try {
          const off = document.createElement('canvas');
          off.width = lw; off.height = lh;
          const oc = off.getContext('2d', { willReadFrequently: true });
          oc.drawImage(logo, 0, 0, lw, lh);
          data = oc.getImageData(0, 0, lw, lh).data;
        } catch (e) { return; }

        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const parts = [];
        const step = Math.max(3, Math.round(lw / 85));
        for (let y = 0; y < lh; y += step) {
          for (let x = 0; x < lw; x += step) {
            const i = (y * lw + x) * 4;
            if (data[i + 3] < 120 || Math.random() > 0.6) continue;
            const px = r.left + x + (Math.random() - 0.5) * step, py = r.top + y + (Math.random() - 0.5) * step;
            const dx = px - cx, dy = py - cy;
            const k = 0.7 + Math.random() * 1.3;               // outward speed relative to distance
            const mix = 0.45 + Math.random() * 0.4;           // brighten towards shimmering gold
            parts.push({
              x: px, y: py,
              vx: dx * k + (Math.random() - 0.5) * 80,
              vy: dy * k + (Math.random() - 0.5) * 80 - 50,
              size: 1.2 + Math.random() * 1.6,
              col: `${Math.round(data[i] * (1 - mix) + 255 * mix)}, ${Math.round(data[i + 1] * (1 - mix) + 224 * mix)}, ${Math.round(data[i + 2] * (1 - mix) + 150 * mix)}`,
              life: 0.9 + Math.random() * 0.7,
              tw: Math.random() * Math.PI * 2,
              star: Math.random() < 0.14
            });
          }
        }

        const cv = document.createElement('canvas');
        cv.className = 'env-glitter';
        cv.setAttribute('aria-hidden', 'true');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(window.innerWidth * dpr);
        cv.height = Math.round(window.innerHeight * dpr);
        document.body.appendChild(cv);
        const g = cv.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);

        const t0 = performance.now();
        let last = t0;
        const tick = (now) => {
          const t = (now - t0) / 1000, dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
          last = now;
          g.clearRect(0, 0, window.innerWidth, window.innerHeight);
          let alive = 0;
          for (const p of parts) {
            if (t > p.life) continue;
            alive++;
            p.x += p.vx * dt; p.y += p.vy * dt;
            p.vx *= 0.992; p.vy = p.vy * 0.992 - 25 * dt;       // keeps flying, drifting upward
            const k = t / p.life;
            const fadeIn = Math.min(1, t / 0.12);
            const twinkle = 0.7 + 0.3 * Math.sin(p.tw + t * 16);
            const a = fadeIn * (1 - k * k) * twinkle;
            const sz = p.size * (1 - k * 0.4);
            g.fillStyle = `rgba(${p.col}, ${a * 0.22})`;         // soft glow
            g.beginPath(); g.arc(p.x, p.y, sz * 2.6, 0, Math.PI * 2); g.fill();
            g.fillStyle = `rgba(${p.col}, ${a})`;                // bright core
            g.beginPath(); g.arc(p.x, p.y, sz, 0, Math.PI * 2); g.fill();
            if (p.star) {
              const L = sz * 4;
              g.strokeStyle = `rgba(255, 240, 200, ${a * 0.9})`;
              g.lineWidth = 0.8;
              g.beginPath();
              g.moveTo(p.x - L, p.y); g.lineTo(p.x + L, p.y);
              g.moveTo(p.x, p.y - L); g.lineTo(p.x, p.y + L);
              g.stroke();
            }
          }
          if (alive) requestAnimationFrame(tick);
          else cv.remove();
        };
        requestAnimationFrame(tick);
      };

      const runFinale = () => {
        if (staged || revealed) return;
        staged = true;
        placeStage();
        envelopeWrapper.classList.add('is-playing-video');      // hide the pre-tap seal overlay
        // Red floral appears over the gold one and immediately starts spreading; the logo
        // grows out of it (CSS keyframes, continuous motion from the first frame)
        envelopeWrapper.classList.add('env-floral-on');
        // Let the flaps finish opening (video ~1.0s) before the glow settles into the calm
        // interior, so the opening is never cut short; the red floral sits over it meanwhile.
        let settled = false;
        const settleInterior = () => {
          if (settled) return;
          settled = true;
          envelopeWrapper.classList.add('env-stage-on');                    // glow -> calm interior
          setTimeout(() => envelopeVideo.pause(), 750);                     // interior now covers it
        };
        const waitFlaps = () => {
          if (settled) return;
          if (envelopeVideo.currentTime >= FLAPS_OPEN_AT || envelopeVideo.paused || envelopeVideo.ended) { settleInterior(); return; }
          requestAnimationFrame(waitFlaps);
        };
        requestAnimationFrame(waitFlaps);
        setTimeout(settleInterior, 1400);                                    // safety net
        // Just before the logo finishes growing (so it never sits still), burst it into glitter
        // and start revealing the landing page underneath.
        setTimeout(() => {
          burstLogoIntoGlitter();
          envelopeWrapper.classList.add('env-logo-burst');
          setTimeout(() => {
            envelopeWrapper.classList.add('env-slow-fade');
            revealLandingPage();
          }, 250);
        }, 1550 + Math.round(1700 * 0.93));   // floral gone (1.55s) -> logo grows -> burst before it rests
      };

      // Checked every animation frame (timeupdate alone fires only ~4x a second on phones)
      const watchStage = () => {
        if (staged || revealed) return;
        if (envelopeVideo.currentTime > 0.02 && envelopeWrapper) {
          envelopeWrapper.classList.add('is-playing-video');
        }
        if (envelopeVideo.currentTime >= STAGE_AT) { runFinale(); return; }
        requestAnimationFrame(watchStage);
      };
      requestAnimationFrame(watchStage);
      // Backup trigger in case animation frames are throttled (e.g. Low Power Mode)
      envelopeVideo.addEventListener('timeupdate', () => {
        if (envelopeVideo.currentTime > 0.02 && envelopeWrapper) envelopeWrapper.classList.add('is-playing-video');
        if (envelopeVideo.currentTime >= STAGE_AT) runFinale();
      });
      envelopeVideo.addEventListener('ended', runFinale, { once: true });

      const playPromise = envelopeVideo.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          if (envelopeWrapper) envelopeWrapper.classList.add('is-playing-video');
        }).catch(() => {
          runFinale();   // video blocked: still play the finale over the calm interior
        });
      } else if (envelopeWrapper) {
        envelopeWrapper.classList.add('is-playing-video');
      }

      // Safety fallbacks in case a mobile network stalls or Low Power Mode pauses the video
      setTimeout(runFinale, 3500);
      setTimeout(revealLandingPage, 10000);
    } else {
      revealLandingPage();
    }
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerOpen();
    });
  }

  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', triggerOpen);
  } else {
    document.body.classList.remove('is-envelope-closed');
    if (mainCard) mainCard.classList.add('is-revealed');
  }

  if (window.location.search.includes('open')) {
    document.body.classList.remove('is-envelope-closed');
    if (mainCard) mainCard.classList.add('is-revealed');
    if (envelopeWrapper) envelopeWrapper.style.display = 'none';
  }

  // Music Play/Pause Toggle button
  if (musicBtn && weddingAudio) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (weddingAudio.paused) {
        weddingAudio.play().then(updateMusicState).catch(() => {});
      } else {
        weddingAudio.pause();
        updateMusicState();
      }
    });

    weddingAudio.addEventListener('play', updateMusicState);
    weddingAudio.addEventListener('pause', updateMusicState);
  }

  // Back to Top button
  const btnTop = document.getElementById('btn-back-to-top');
  if (btnTop) {
    btnTop.addEventListener('click', (e) => {
      e.preventDefault();
      const cardWidth = Math.min(window.innerWidth || 400, 480);
      const brownOffset = Math.round(cardWidth * 0.058);
      window.scrollTo({ top: brownOffset, behavior: 'smooth' });
    });
  }

  // Scroll to Page 2 Invitation transition button
  const btnInvite = document.getElementById('btn-scroll-invite');
  if (btnInvite) {
    btnInvite.addEventListener('click', (e) => {
      e.preventDefault();
      const p2 = document.getElementById('page-2-invitation');
      if (p2) {
        p2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Floating scroll cue: visible on all pages, hidden at footer
  const royalScrollPrompt = document.getElementById('royalScrollPrompt');
  if (royalScrollPrompt) {
    royalScrollPrompt.addEventListener('click', () => {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: 'smooth' });
    });
    const footerEl = document.querySelector('footer');
    if (footerEl && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => document.body.classList.toggle('at-footer', en.isIntersecting));
      }, { threshold: 0.05 }).observe(footerEl);
    }
  }
});

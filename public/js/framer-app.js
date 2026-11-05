// ═══════════════════════════════════════════════════════════
// Everdezign Framer Exact Replica Engine
// ═══════════════════════════════════════════════════════════
import { CONFIG, photo } from './config.js';



// ───────── Falling Red Rose Petals Canvas ─────────
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  // Reduced quantity: gentle, elegant royal shower
  const COUNT = 14;

  const ROSE_SHADES = [
    { fill: 'rgba(182, 24, 39, 0.82)', dark: 'rgba(120, 12, 22, 0.45)' },
    { fill: 'rgba(158, 16, 28, 0.86)', dark: 'rgba(98, 8, 16, 0.50)' },
    { fill: 'rgba(196, 32, 48, 0.78)', dark: 'rgba(132, 16, 26, 0.42)' },
    { fill: 'rgba(142, 14, 24, 0.84)', dark: 'rgba(85, 6, 14, 0.52)' }
  ];

  for (let i = 0; i < COUNT; i++) {
    const shade = ROSE_SHADES[Math.floor(Math.random() * ROSE_SHADES.length)];
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: 8 + Math.random() * 7,
      dx: -0.3 + Math.random() * 0.6,
      dy: 0.85 + Math.random() * 0.95,
      rot: Math.random() * 360,
      rotSpeed: -0.8 + Math.random() * 1.6,
      tilt: Math.random() * 360,
      tiltSpeed: 1.2 + Math.random() * 1.8,
      color: shade.fill,
      darkColor: shade.dark
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      // Realistic 3D flutter tumbling in wind:
      ctx.scale(Math.cos((p.tilt * Math.PI) / 180), 1);

      // Authentic botanical curved rose petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.r * 1.15);
      ctx.bezierCurveTo(p.r * 0.95, -p.r * 1.1, p.r * 1.05, p.r * 0.45, 0, p.r * 1.15);
      ctx.bezierCurveTo(-p.r * 1.05, p.r * 0.45, -p.r * 0.95, -p.r * 1.1, 0, -p.r * 1.15);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();

      // Subtle inner depth vein
      ctx.beginPath();
      ctx.moveTo(0, -p.r * 0.85);
      ctx.quadraticCurveTo(p.r * 0.28, 0, 0, p.r * 0.85);
      ctx.strokeStyle = p.darkColor;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.restore();

      p.y += p.dy;
      p.x += Math.sin((p.y * Math.PI) / 180) * 0.65 + p.dx;
      p.rot += p.rotSpeed;
      p.tilt += p.tiltSpeed;

      if (p.y > height + 25) {
        p.y = -25;
        p.x = Math.random() * width;
      }
    });
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
  const targets = document.querySelectorAll('.scroll-reveal, .zoom-reveal, .framer-card, .event-scene-wrap');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
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
    }
  }

  function scratch(x, y) {
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
    checkProgress();
  }

  function handleStart(e) {
    if (isRevealed) return;
    isDrawing = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = getPos(clientX, clientY);
    scratch(pos.x, pos.y);
  }

  function handleMove(e) {
    if (!isDrawing || isRevealed) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = getPos(clientX, clientY);
    scratch(pos.x, pos.y);
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

// ───────── Page 1 Monogram Star Flare Alignment ─────────
function initGkGlow() {
  const coverImg = document.querySelector('#cover-card .page-fullwidth-img');
  const flare = document.querySelector('.gk-ring-star-flare');
  if (!coverImg || !flare) return;

  function update() {
    const rect = coverImg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Canva Page 1 natural: 2025 x 3600
    // Flare position on golden ring: X = 67.5%, Y = 20.5%
    const naturalRatio = 2025 / 3600;
    const currentRatio = rect.width / rect.height;

    let renderedW, renderedH;
    if (currentRatio > naturalRatio) {
      renderedW = rect.width;
      renderedH = rect.width / naturalRatio;
    } else {
      renderedH = rect.height;
      renderedW = rect.height * naturalRatio;
    }

    const flareX = (rect.width / 2) + (renderedW * (0.675 - 0.5));
    const flareY = renderedH * 0.205;

    flare.style.left = `${flareX}px`;
    flare.style.top = `${flareY}px`;

    const shine = document.querySelector('.gk-gold-shine');
    if (shine) {
      shine.style.left = `${(rect.width / 2) + renderedW * (0.24691 - 0.5)}px`;
      shine.style.top = `${renderedH * 0.19528}px`;
      shine.style.width = `${renderedW * 0.50420}px`;
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

// ───────── Master Boot & Video Opening Flow ─────────
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initCountdown();
  initMomentsMarquee();
  initRSVP();
  initScrollObserver();
  initScratchCard();
  initGkGlow();

  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelopeVideo = document.getElementById('envelope-video');
  const envelopeContainer = document.getElementById('envelope-container');
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

    // 2. Hide the wax seal button and play the envelope opening + radiant light burst video
    if (envelopeWrapper) {
      envelopeWrapper.classList.add('is-playing-video');
    }
    if (envelopeVideo) {
      envelopeVideo.currentTime = 0;
      envelopeVideo.play().catch(() => {});
    }

    // 3. At t = 3.1s (peak of the radiant golden light burst), crossfade to the landing page
    setTimeout(() => {
      document.body.classList.remove('is-envelope-closed');
      if (mainCard) mainCard.classList.add('is-revealed');
      if (envelopeWrapper) envelopeWrapper.classList.add('is-hidden');

      // Start the page slightly scrolled down to begin directly at the brown arch beam
      const cardWidth = Math.min(window.innerWidth || 400, 480);
      const brownOffset = Math.round(cardWidth * 0.058);
      window.scrollTo(0, brownOffset);
      document.documentElement.scrollTop = brownOffset;
      document.body.scrollTop = brownOffset;

      if (window.__refreshScratchCanvas) {
        window.__refreshScratchCanvas();
      }

      if (coverVideo) {
        coverVideo.currentTime = 3.6;
        coverVideo.play().catch(() => {});
        coverVideo.addEventListener('timeupdate', () => {
          if (coverVideo.currentTime >= 14.8) {
            coverVideo.currentTime = 3.8;
          }
        });
      }

      // Clean up envelope video after fade completes
      setTimeout(() => {
        if (envelopeWrapper) envelopeWrapper.style.display = 'none';
        if (envelopeVideo) envelopeVideo.pause();
        if (window.__refreshScratchCanvas) {
          window.__refreshScratchCanvas();
        }
      }, 800);
    }, 3100);
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

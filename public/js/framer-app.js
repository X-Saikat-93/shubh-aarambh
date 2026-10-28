// ═══════════════════════════════════════════════════════════
// Everdezign Framer Exact Replica Engine
// ═══════════════════════════════════════════════════════════
import { CONFIG, photo } from './config.js';



// ───────── Falling Rose Petals Canvas ─────────
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
  const COUNT = 25;

  for (let i = 0; i < COUNT; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: 8 + Math.random() * 10,
      dx: -0.5 + Math.random() * 1,
      dy: 1 + Math.random() * 1.4,
      tilt: Math.random() * 360,
      tiltSpeed: 0.8 + Math.random() * 1.5,
      color: Math.random() > 0.4 ? 'rgba(235, 180, 185, 0.72)' : 'rgba(248, 205, 210, 0.65)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.tilt * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.r / 2, -p.r, -p.r, p.r / 3, 0, p.r);
      ctx.bezierCurveTo(p.r, p.r / 3, p.r / 2, -p.r, 0, 0);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();

      p.y += p.dy;
      p.x += Math.sin((p.y * Math.PI) / 180) * 0.8 + p.dx;
      p.tilt += p.tiltSpeed;

      if (p.y > height + 20) {
        p.y = -20;
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

// ───────── Events Cards with Exact Artwork ─────────
function populateEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  const eventData = [
    {
      id: 'mayra',
      name: 'Mayra',
      dateUpper: '11TH DECEMBER 2026',
      timeUpper: 'FRIDAY · TIMINGS TO BE ANNOUNCED',
      venue: `${CONFIG.venue.name}, ${CONFIG.venue.place}`,
      blurb: 'The maternal family arrives with gifts and heartfelt blessings — a cherished tradition that opens the celebrations.',
      image: '/media/event_mayra.jpg',
      floralFrame: '/media/parchment_roses.png'
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      dateUpper: '11TH DECEMBER 2026',
      timeUpper: 'FRIDAY · TIMINGS TO BE ANNOUNCED',
      venue: `${CONFIG.venue.name}, ${CONFIG.venue.place}`,
      blurb: 'An evening of music, dance, cocktails and celebration as both families come together.',
      image: '/media/sangeet_couple.png',
      floralFrame: '/media/sangeet_blue_frame.png'
    },
    {
      id: 'haldi',
      name: 'Haldi Carnival',
      dateUpper: '12TH DECEMBER 2026',
      timeUpper: 'SATURDAY · TIMINGS TO BE ANNOUNCED',
      venue: `${CONFIG.venue.name}, ${CONFIG.venue.place}`,
      blurb: 'A vibrant morning of haldi, laughter, and blessings to brighten the celebrations.',
      image: '/media/haldi_couple.png',
      floralFrame: '/media/haldi_sunflower_frame.png'
    },
    {
      id: 'wedding',
      name: 'The Wedding',
      dateUpper: '12TH DECEMBER 2026',
      timeUpper: 'SATURDAY · TIMINGS TO BE ANNOUNCED',
      venue: `${CONFIG.venue.name}, ${CONFIG.venue.place}`,
      blurb: 'Under the canopy of blessings, two souls become one — join us as we take our sacred pheras.',
      image: '/media/wedding_couple.png',
      floralFrame: '/media/wedding_roses_frame.png'
    }
  ];

  container.innerHTML = eventData.map((ev) => `
    <div class="event-scene-wrap">
      <img class="event-floral-bg" src="${ev.floralFrame}" alt="${ev.name} floral frame" loading="lazy" />
      <article class="event-framer-card">
        <div class="event-illustration-wrap">
          <img class="event-illustration" src="${ev.image}" alt="${ev.name}" loading="lazy" />
          <div class="event-illustration-overlay">
            <h3 class="event-overlay-title">${ev.name}</h3>
            <p class="event-overlay-blurb">${ev.blurb}</p>
          </div>
        </div>
        <div class="event-card-body">
          <div class="event-card-date">${ev.dateUpper}</div>
          <div class="event-card-timing-row">
            <span class="timing-divider-line"></span>
            <span class="event-card-time">${ev.timeUpper}</span>
            <span class="timing-divider-line"></span>
          </div>
          <div class="event-card-venue">
            <span class="venue-label">VENUE:</span>
            <span class="venue-val">${ev.venue}</span>
          </div>
          <a class="event-card-btn-directions" href="${CONFIG.venue.map}" target="_blank" rel="noopener">
            TAP FOR DIRECTIONS
          </a>
        </div>
      </article>
    </div>
  `).join('');
}

function getCalendarUrl(ev) {
  const title = encodeURIComponent(`${ev.name} — Garv & Kaavya Wedding`);
  const details = encodeURIComponent(`${ev.blurb}\nVenue: ${CONFIG.venue.name}, ${CONFIG.venue.city}\n#kaarvinlove`);
  const location = encodeURIComponent(`${CONFIG.venue.name}, ${CONFIG.venue.address}`);
  const dates = '20261211T063000Z/20261212T183000Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
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

// ───────── Master Boot & Video Opening Flow ─────────
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initCountdown();
  populateEvents();
  initMomentsMarquee();
  initRSVP();
  initScrollObserver();
  initScratchCard();

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

    // Start playing 'Until I Found You'
    if (weddingAudio) {
      weddingAudio.play().then(updateMusicState).catch(() => {});
    }

    // Trigger video playback for glowing light burst
    envelopeWrapper.classList.add('is-playing-video');
    if (envelopeVideo) {
      envelopeVideo.currentTime = 0;
      envelopeVideo.play().catch(() => {});
    }

    // At the radiant golden burst peak (~3.1s), seamlessly transition in place
    setTimeout(() => {
      document.body.classList.remove('is-envelope-closed');
      mainCard.classList.add('is-revealed');
      envelopeWrapper.classList.add('is-hidden');

      if (window.__refreshScratchCanvas) {
        window.__refreshScratchCanvas();
      }

      // Start the animated terrace loop on the cover card
      if (coverVideo) {
        coverVideo.currentTime = 3.6;
        coverVideo.play().catch(() => {});
        coverVideo.addEventListener('timeupdate', () => {
          if (coverVideo.currentTime >= 14.8) {
            coverVideo.currentTime = 3.8;
          }
        });
      }

      setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        if (envelopeVideo) envelopeVideo.pause();
        if (window.__refreshScratchCanvas) {
          window.__refreshScratchCanvas();
        }
      }, 800);
    }, 3100);
  }

  // Tapping wax seal or container starts the glowing opening
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', triggerOpen);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Shubh Muhurat — a gold-line astrolabe whose rings (days, hours, minutes, seconds) turn with the real clock.
import { gsap, ScrollTrigger, reduced, EASE, sectionHead, fadeUp, drawSVG } from '../lib/motion.js';

const pad = (n) => String(n).padStart(2, '0');
const icsDate = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
const ics = (s) => String(s).replace(/([,;])/g, '\\$1');

// Rings: [key, radius, period in units used for the arc fraction]
const RINGS = [['days', 168], ['hours', 146], ['minutes', 124], ['seconds', 102]];
const TICKS = { days: 36, hours: 24, minutes: 60, seconds: 60 };

// Outer ring of alternating lotus petals and paisley drops — turns slowly.
function motifRing() {
  let g = '';
  for (let i = 0; i < 24; i++) {
    const a = i * 15;
    g += i % 2
      ? `<path class="draw" transform="rotate(${a} 200 200) translate(200 14)" d="M0 0 C-5 6 -5 14 0 20 C5 14 5 6 0 0 Z" />`
      : `<path class="draw" transform="rotate(${a} 200 200) translate(200 10)" d="M0 24 C-9 16 -9 6 0 0 C9 6 9 16 0 24 Z M0 24 V30" />`;
  }
  return `<g class="cd__spin">${g}</g>`;
}

function dial() {
  let s = '';
  RINGS.forEach(([k, r]) => {
    const circ = 2 * Math.PI * r;
    s += `<g data-ring="${k}">
      <circle class="draw cd__track" cx="200" cy="200" r="${r}" />
      <circle class="cd__ticks" cx="200" cy="200" r="${r - 6}" stroke-dasharray="1 ${(2 * Math.PI * (r - 6) / TICKS[k] - 1).toFixed(2)}" />
      <circle class="cd__arc" cx="200" cy="200" r="${r}" pathLength="1" transform="rotate(-90 200 200)" />
      <g class="cd__hand"><circle class="cd__dot" cx="200" cy="${200 - r}" r="${k === 'seconds' ? 4.5 : 3.5}" /></g>
    </g>`;
  });
  return `<svg class="orn cd__dial" viewBox="0 0 400 400" aria-hidden="true">${motifRing()}${s}
    <circle class="draw cd__edge" cx="200" cy="200" r="184" /></svg>`;
}

function digits(k, n) {
  return `<span class="cd__n cd__n--${k}" data-n="${k}" data-len="${n}">${'<span class="cd__d"></span>'.repeat(n)}</span>`;
}

// Roll a digit slot only when its character changes.
function setDigit(el, ch, animate) {
  const cur = el.lastElementChild;
  if (cur && cur.textContent === ch) return;
  const n = document.createElement('span');
  n.textContent = ch;
  el.append(n);
  if (!cur) return;
  if (!animate || reduced) return cur.remove();
  gsap.fromTo(n, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE.out });
  gsap.to(cur, { yPercent: -100, opacity: 0, duration: 0.6, ease: EASE.out, onComplete: () => cur.remove() });
}

export default function init({ root, config }) {
  const { venue } = config;
  const start = new Date(config.weddingISO);
  const end = new Date(+start + 5 * 36e5);
  const evTitle = `${config.couple.groom} & ${config.couple.bride} · Wedding`;
  const where = `${venue.name}, ${venue.address}`;
  const day = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const wedEvent = config.events.find((e) => e.id === 'wedding');

  root.innerHTML = `
    <div class="wrap cd">
      <div class="sec-head">
        <p class="label">Shubh Muhurat</p>
        <h2 class="h2">Until <em>forever</em></h2>
        <p class="lede">${day} · ${wedEvent ? wedEvent.time : '4 PM onwards'}</p>
      </div>
      <div class="cd__stage" role="timer" aria-label="Time until the wedding">
        ${dial()}
        <div class="cd__core">
          <div class="cd__days">${digits('days', 3)}<span class="cd__u">days</span></div>
          <div class="cd__hms">${digits('hours', 2)}<i>:</i>${digits('minutes', 2)}<i>:</i>${digits('seconds', 2)}</div>
        </div>
        <div class="cd__done" hidden><span class="script">Just married</span><span class="label">with all your blessings</span></div>
      </div>
      <p class="cd__at">${venue.name} · ${venue.city}</p>
      <div class="cd__actions">
        <button class="btn" type="button" data-ics>Add to calendar</button>
        <a class="link" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evTitle)}&dates=${icsDate(start)}/${icsDate(end)}&location=${encodeURIComponent(where)}" target="_blank" rel="noopener">Google Calendar</a>
      </div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const stage = $('.cd__stage');
  const nums = {};
  root.querySelectorAll('[data-n]').forEach((e) => (nums[e.dataset.n] = e));
  const rings = {};
  RINGS.forEach(([k]) => {
    const g = $(`[data-ring="${k}"]`);
    rings[k] = { arc: g.querySelector('.cd__arc'), hand: g.querySelector('.cd__hand') };
  });
  gsap.set(root.querySelectorAll('.cd__hand'), { svgOrigin: '200 200' });

  // .ics download
  $('[data-ics]').addEventListener('click', () => {
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Shubh Vivah//EN', 'BEGIN:VEVENT',
      `UID:${icsDate(start)}@shubh-vivah`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
      `SUMMARY:${ics(evTitle)}`, `LOCATION:${ics(where)}`, `DESCRIPTION:${ics('With the blessings of our families. ' + venue.map)}`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([body], { type: 'text/calendar' })), download: 'krish-anika-wedding.ics' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  let shown = {};
  let first = true;
  function frame() {
    const ms = start - Date.now();
    if (ms <= 0) return finish();
    const t = ms / 1000;
    const v = { days: Math.floor(t / 86400), hours: Math.floor(t / 3600) % 24, minutes: Math.floor(t / 60) % 60, seconds: Math.floor(t) % 60 };
    // Continuous fractions: the seconds hand sweeps rather than ticks.
    const f = { days: Math.min(t / 86400 / 365, 1), hours: (t / 3600 % 24) / 24, minutes: (t / 60 % 60) / 60, seconds: (t % 60) / 60 };
    for (const k in f) {
      rings[k].arc.style.strokeDashoffset = 1 - f[k];
      gsap.set(rings[k].hand, { rotation: f[k] * 360 });
    }
    for (const k in v) {
      if (shown[k] === v[k]) continue;
      shown[k] = v[k];
      const len = Number(nums[k].dataset.len);
      const str = k === 'days' ? String(v[k]).padStart(len, '0') : pad(v[k]);
      [...nums[k].children].forEach((d, i) => setDigit(d, str[i] ?? '0', !first));
      if (k === 'days') nums.days.children[0].style.display = str.length > 2 && str[0] === '0' ? 'none' : ''; // 34, not 034
    }
    first = false;
  }

  function finish() {
    gsap.ticker.remove(frame);
    stage.classList.add('is-done');
    $('.cd__core').hidden = true;
    const d = $('.cd__done');
    d.hidden = false;
    fadeUp(d.children, { trigger: stage, start: 'top 95%', y: 20 });
  }

  // Draw-in once; ticks and arcs fade up after the lines.
  drawSVG(stage, { trigger: stage, start: 'top 80%', duration: 2.4, stagger: 0.05 });
  if (!reduced) {
    gsap.from(stage.querySelectorAll('.cd__ticks, .cd__arc, .cd__hand'), { opacity: 0, duration: 1.6, delay: 0.8, ease: EASE.soft, stagger: 0.15,
      scrollTrigger: { trigger: stage, start: 'top 80%', once: true } });
    gsap.from('.cd__core > *', { y: 24, opacity: 0, duration: 1.4, ease: EASE.out, stagger: 0.15, delay: 0.5, scrollTrigger: { trigger: stage, start: 'top 80%', once: true } });
  }
  sectionHead($('.sec-head'));
  fadeUp(root.querySelectorAll('.cd__at, .cd__actions'), { trigger: '.cd__actions', y: 20 });

  // Spin, tick and rotate only while on screen.
  const spin = reduced ? null : gsap.to($('.cd__spin'), { rotation: 360, svgOrigin: '200 200', duration: 240, ease: 'none', repeat: -1, paused: true });
  frame();
  ScrollTrigger.create({
    trigger: root, start: 'top bottom+=100', end: 'bottom top-=100',
    onToggle: (st) => {
      gsap.ticker.remove(frame);
      if (st.isActive) { gsap.ticker.add(frame); spin?.play(); } else spin?.pause();
    },
  });
}

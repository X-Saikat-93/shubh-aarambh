// The Venue — an illustrated destination card: temple-arch map window, compass, dotted journey.
import { gsap, reduced, EASE, splitReveal, fadeUp, drawSVG, sectionHead, magnetic } from '../lib/motion.js';
import { arch } from '../lib/ornaments.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const compass = `<svg class="orn compass" viewBox="0 0 120 120" aria-hidden="true">
  <circle class="draw" cx="60" cy="60" r="54" /><circle class="draw" cx="60" cy="60" r="46" stroke-dasharray="1 5" />
  <path class="draw" d="M60 6 V16 M60 104 V114 M6 60 H16 M104 60 H114" />
  <path class="draw" d="M60 22 L66 54 L98 60 L66 66 L60 98 L54 66 L22 60 L54 54 Z" />
  <g class="compass__needle"><path class="draw" d="M60 14 L65 60 L60 52 L55 60 Z" /><circle class="fill" cx="60" cy="60" r="2.4" /></g>
  <text x="60" y="4.5" text-anchor="middle" font-size="7" fill="currentColor" stroke="none" font-family="Tenor Sans, sans-serif">N</text>
</svg>`;

const pin = `<svg class="orn pin" viewBox="0 0 40 56" aria-hidden="true">
  <path class="draw" d="M20 54 C20 54 4 34 4 20 a16 16 0 0 1 32 0 C36 34 20 54 20 54 Z" /><circle class="draw" cx="20" cy="20" r="5.5" /><circle class="fill" cx="20" cy="20" r="1.8" />
</svg>`;

// Hand-drawn map of the riverbank, in place of a Google embed: a stylised sketch, not to scale.
// The window links to the real Google Maps place.
const map = (name) => {
  const river = 'M60 410 C80 330 40 280 66 220 S116 120 90 40 S80 0 86 -10';
  const road = 'M-10 318 C50 312 100 300 150 282 S250 230 310 196';
  const trees = [[200, 300], [214, 308], [232, 332], [252, 292], [182, 352], [206, 372], [240, 382], [262, 344], [20, 360], [30, 378], [22, 262], [190, 150], [270, 262]];
  const words = name.split(' ');
  const half = Math.ceil(words.length / 2);
  return `<svg class="orn vm" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="draw vm__bank" d="${river}" /><path class="draw vm__water" d="${river}" />
    ${[[52, 300], [70, 250], [92, 130], [84, 360], [96, 190]].map(([x, y]) => `<path class="draw vm__ripple" d="M${x} ${y} q4 -3 8 0 t8 0" />`).join('')}
    <text class="vm__river" transform="translate(64 352) rotate(-74)">Rupnarayan</text>
    ${[0, 8, 16, 24, 32].map((d) => `<path class="draw vm__field" d="M${200 + d / 3} ${168 + d} l52 -14" />`).join('')}
    ${trees.map(([x, y], i) => `<circle class="draw vm__tree" cx="${x}" cy="${y}" r="${4 + (i % 3)}" />`).join('')}
    <path class="draw vm__road" d="${road}" /><path class="draw vm__road-in" d="${road}" /><path class="vm__road-mid" d="${road}" />
    <text class="vm__lbl" transform="translate(196 270) rotate(-21)">NH 16 · Kolkata →</text>
    <path class="vm__lane" d="M174 274 C170 240 140 214 124 192" />
    <circle class="vm__pulse" cx="124" cy="186" r="9" />
    <g class="vm__pin"><g transform="translate(112 152) scale(.6)"><path class="draw" d="M20 54 C20 54 4 34 4 20 a16 16 0 0 1 32 0 C36 34 20 54 20 54 Z" /><circle class="fill" cx="20" cy="20" r="5" /></g></g>
    <text class="vm__lbl vm__name" x="140" y="168"><tspan>${esc(words.slice(0, half).join(' '))}</tspan><tspan x="140" dy="10">${esc(words.slice(half).join(' '))}</tspan></text>
  </svg>`;
};

export default function init({ root, config }) {
  const v = config.venue;
  const words = v.name.trim().split(' ');
  const last = words.pop();
  const title = `${esc(words.join(' '))} <em>${esc(last)}</em>`.trim();

  root.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <clipPath id="venue-arch" clipPathUnits="objectBoundingBox"><path d="M.02 1 V.367 C.02 .233 .2 .147 .35 .113 C.42 .093 .47 .06 .5 .013 C.53 .06 .58 .093 .65 .113 C.8 .147 .98 .233 .98 .367 V1 Z"/></clipPath>
    </defs></svg>
    <div class="wrap venue__grid">
      <div class="venue__text">
        <span class="label venue__label">The Venue</span>
        <h2 class="display venue__title">${title}</h2>
        <p class="venue__city script">${esc(v.city)}</p>
        <p class="venue__addr">${esc(v.address)}</p>
        <div class="venue__actions">
          <a class="btn btn--solid" href="${esc(v.map)}" target="_blank" rel="noopener" data-hover>Open in Google Maps</a>
          <button class="link venue__copy" type="button" data-hover>Copy address</button>
          <span class="venue__ok" role="status" aria-live="polite"></span>
        </div>
        <svg class="venue__route orn" viewBox="0 0 360 80" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
          <defs><mask id="venue-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="80"><path id="venue-mpath" d="M8 60 C70 70 90 8 160 28 S250 70 300 34" stroke="#fff" stroke-width="6" fill="none"/></mask></defs>
          <circle class="draw" cx="8" cy="60" r="4" />
          <path class="venue__dots" d="M8 60 C70 70 90 8 160 28 S250 70 300 34" mask="url(#venue-mask)" />
          <g transform="translate(300 8) scale(.6)" class="venue__pin">${pin.replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
        </svg>
      </div>
      <div class="venue__map">
        <div class="venue__iris">
          <a class="venue__win" href="${esc(v.map)}" target="_blank" rel="noopener" aria-label="Open ${esc(v.name)} in Google Maps" data-hover>${map(v.name)}</a>
        </div>
        ${arch('venue__frame')}
        ${compass}
      </div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const mm = gsap.matchMedia();

  // Copy address with a tiny confirmation (clipboard API, textarea fallback)
  const ok = $('.venue__ok');
  $('.venue__copy').addEventListener('click', async () => {
    const text = `${v.name}, ${v.address}`;
    try { await navigator.clipboard.writeText(text); } catch {
      const t = Object.assign(document.createElement('textarea'), { value: text });
      t.style.cssText = 'position:fixed;opacity:0'; document.body.append(t); t.select();
      try { document.execCommand('copy'); } catch {} t.remove();
    }
    ok.textContent = 'Copied';
    gsap.fromTo(ok, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out });
    gsap.to(ok, { autoAlpha: 0, delay: 2, duration: 0.6, onComplete: () => { ok.textContent = ''; } });
  });
  magnetic($('.btn'));

  // Dotted route draws through its mask toward the pin
  const mpath = $('#venue-mpath');
  const len = mpath.getTotalLength();
  const pinG = $('.venue__pin');
  const needle = $('.compass__needle');
  gsap.set(needle, { transformOrigin: '60px 60px' });

  if (reduced) { gsap.set(needle, { rotation: 38 }); return; }

  gsap.set(mpath, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(pinG, { transformOrigin: '20px 54px', autoAlpha: 0, y: -14 });

  mm.add('(min-width: 0px)', () => {
    const trig = { trigger: root, start: 'top 70%', once: true };
    const tl = gsap.timeline({ scrollTrigger: trig });
    splitReveal($('.venue__title'), { trigger: root, type: 'lines', start: 'top 70%' });
    fadeUp([$('.venue__label'), $('.venue__city'), $('.venue__addr'), $('.venue__actions')], { trigger: root, start: 'top 70%', y: 24, stagger: 0.12 });
    // iris: circle opens from the arch's heart, then the window settles
    tl.fromTo('.venue__iris', { clipPath: 'circle(0% at 50% 62%)' }, { clipPath: 'circle(80% at 50% 62%)', duration: 1.8, ease: 'expo.inOut' }, 0.1)
      .fromTo('.venue__win', { scale: 1.25 }, { scale: 1, duration: 2.2, ease: EASE.out }, 0.1)
      .add(drawSVG($('.vm'), { trigger: null, duration: 1.6, stagger: 0.05 }), 0.4)
      .from('.vm text, .vm__lane', { autoAlpha: 0, duration: 1.2, stagger: 0.15 }, 1.6)
      .from('.vm__pin', { y: -40, autoAlpha: 0, duration: 1, ease: 'bounce.out', clearProps: 'transform' }, 2.2)
      .add(drawSVG($('.venue__frame'), { trigger: null, duration: 2.2 }), 0.3)
      .add(drawSVG($('.compass'), { trigger: null, duration: 1.6, stagger: 0.08 }), 0.8)
      // needle swings wildly then settles on north-east (elastic)
      .fromTo(needle, { rotation: -200 }, { rotation: 38, duration: 2.6, ease: 'elastic.out(1, .35)' }, 1.5)
      .to(mpath, { strokeDashoffset: 0, duration: 2.2, ease: EASE.silk }, 1.2)
      .to(pinG, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'bounce.out' }, 3.0);
    // the map relaxes toward colour on pointer/focus via CSS; keep parallax on the compass
    gsap.to('.compass', { y: -30, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

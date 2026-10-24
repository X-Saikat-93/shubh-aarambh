// Celebrations — one full-viewport "scenes" (morning → evening → dusk). Each carries its own data-theme so
// the page re-tints as it arrives. Desktop: each scene pins while its motif draws and type settles.
// Mobile: no pins; the same timeline is scrubbed as the scene scrolls into place.
import { gsap, ScrollTrigger, SplitText, sectionHead, reduced, EASE } from '../lib/motion.js';
import { rule, sun, marigold, moon, agni, kalash, rosette, diya } from '../lib/ornaments.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const star = (c = '') => `<svg class="orn star ${c}" viewBox="0 0 24 24" aria-hidden="true"><path class="draw" d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>`;
// Dholak-beat bars: static heights are the reduced-motion state; CSS animates scaleY.
const wave = () => `<div class="wave" aria-hidden="true">${Array.from({ length: 31 }, (_, i) => {
  const h = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.35));
  return `<i style="--h:${h.toFixed(2)};--d:${((i * 0.37) % 1.2).toFixed(2)}s;--t:${(0.9 + (i % 5) * 0.14).toFixed(2)}s"></i>`;
}).join('')}</div>`;

const MOTIF = {
  mayra: () => `<div class="glow"></div>${rosette('m-main')}${diya('m-side m-side--l')}${diya('m-side m-side--r')}`,
  haldi: () => `<div class="glow"></div>${sun('m-main')}
    <div class="spin spin--a">${marigold('m-bloom')}</div><div class="spin spin--b">${marigold('m-bloom')}</div><div class="spin spin--c">${marigold('m-bloom')}</div>`,
  sangeet: () => `<div class="glow"></div>${moon('m-main')}${star('s1')}${star('s2')}${star('s3')}${star('s4')}${wave()}`,
  wedding: () => `<div class="glow"></div>${agni('m-main')}${kalash('m-side m-side--l')}${kalash('m-side m-side--r')}`,
};

const splitName = (n) => { const [a, ...r] = n.split(' '); return r.length ? `<span>${a}</span> <em>${r.join(' ')}</em>` : n; };

export default function init({ root, config }) {
  const { venue } = config;
  root.innerHTML = `
  <header class="cel__intro section" data-theme="dawn">
    <div class="sec-head">
      <span class="label">${WORDS[config.events.length - 1]} moments · ${WORDS[new Set(config.events.map((e) => e.date)).size - 1]} days</span>
      <h2 class="h2">The <em>celebrations</em></h2>
      ${rule()}
    </div>
  </header>
  ${config.events.map((e, i) => `
  <article class="scene scene--${e.id}" data-theme="${e.theme}" aria-labelledby="scene-${e.id}">
    <div class="scene__stage">
      <div class="scene__hour" aria-hidden="true">${e.hour}</div>
      <div class="scene__motif" aria-hidden="true">${MOTIF[e.id] ? MOTIF[e.id]() : ''}</div>
      <div class="scene__main">
        <p class="label scene__tag">${ROMAN[i]} · ${e.hour}</p>
        <h3 class="scene__title display" id="scene-${e.id}">${splitName(e.name)}</h3>
        <div class="scene__details">
          <p class="d-date display"><em>${e.date}</em></p>
          <p class="label d-time">${e.day} · ${e.time}</p>
          <p class="d-blurb">${e.blurb}</p>
          <p class="d-venue"><strong>${venue.name}</strong><span>${venue.address}</span></p>
          <a class="link d-link" href="${venue.map}" target="_blank" rel="noopener">Get directions →</a>
        </div>
      </div>
    </div>
  </article>`).join('')}`;

  sectionHead(root.querySelector('.cel__intro .sec-head'));
  const scenes = [...root.querySelectorAll('.scene')];
  // Waves only beat while their scene is on screen.
  scenes.forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top bottom', end: 'bottom top', onToggle: (t) => s.classList.toggle('is-live', t.isActive) }));
  if (reduced) return;

  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (ctx) => {
    const desk = ctx.conditions.desk;
    scenes.forEach((scene, i) => {
      const stage = scene.querySelector('.scene__stage'), motif = scene.querySelector('.scene__motif');
      const paths = gsap.utils.toArray(motif.querySelectorAll('.draw'));
      paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
      const split = SplitText.create(scene.querySelector('.scene__title'), { type: 'chars', aria: 'auto' });
      // Splitting drops kerning pairs; pull overhanging capitals back in ("W edding").
      split.chars.forEach((c) => /^[WVTY]$/.test(c.textContent) && (c.style.marginRight = '-0.08em'));
      const spread = desk ? 46 : 14;
      const last = i === scenes.length - 1;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: desk
          ? { trigger: scene, start: 'top top', end: '+=120%', pin: stage, scrub: 0.7, anticipatePin: 1 }
          : { trigger: scene, start: 'top 70%', end: 'top 12%', scrub: 0.6 },
      });
      // Enter: motif draws, title letters spread → settle, hour word drifts.
      if (i > 0 && desk) tl.from(motif, { y: '34vh', autoAlpha: 0, duration: 3, ease: EASE.out }, 0); // moon / flame rises
      tl.to(paths, { strokeDashoffset: 0, duration: 2.6, stagger: { amount: 2.2 }, ease: EASE.silk }, 0)
        .from(motif.querySelector('.glow'), { scale: 0.2, autoAlpha: 0, duration: 4 }, 0.5)
        .from(split.chars, { x: (k, t, a) => (k - a.length / 2) * spread, autoAlpha: 0, rotate: (k) => (k % 2 ? 6 : -6), duration: 3, stagger: { amount: 1 }, ease: EASE.out }, 0)
        .fromTo(scene.querySelector('.scene__hour'), { xPercent: desk ? 12 : 6 }, { xPercent: desk ? -14 : -6, duration: 10 }, 0)
        .from(scene.querySelector('.scene__tag'), { autoAlpha: 0, y: 12, duration: 1.4 }, 1)
        .fromTo(scene.querySelector('.scene__details').children, { clipPath: 'inset(0 0 100% 0)', y: 28 }, { clipPath: 'inset(-10% -5% -30% -5%)', y: 0, duration: 2.2, stagger: 0.35, ease: EASE.out }, 3.2);
      tl.to({}, { duration: 1 }); // hold the finished composition
      // Exit (desktop): the time of day passes — sun sets, moon drifts away to make room for the flame.
      if (desk && !last) tl.to(motif, { y: i === 0 ? '36vh' : '-8vh', x: i === 0 ? '4vw' : '6vw', autoAlpha: 0, scale: 0.86, duration: 1.8, ease: 'power2.in' }, '>');
      if (desk && !last) tl.to(scene.querySelector('.scene__main'), { autoAlpha: 0, y: -30, duration: 1.2, ease: 'power2.in' }, '<+0.4');
    });
  });
}

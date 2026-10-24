// Saat Phere — pinned scroll around the sacred fire. A glowing dot walks the circle; at each of seven
// stations a numbered marker lights and its vow crossfades in. Works pinned on desktop and mobile.
// Reduced motion: no pin, everything lit, the seven vows listed statically.
import { gsap, ScrollTrigger, EASE, reduced, sectionHead, drawSVG } from '../lib/motion.js';
import { rule, agni } from '../lib/ornaments.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const R = 160, C = 2 * Math.PI * R; // ring radius in a 400-unit viewBox, circumference
const pos = (deg) => { const a = ((deg - 90) * Math.PI) / 180; return { x: 200 + R * Math.cos(a), y: 200 + R * Math.sin(a) }; };

export default function init({ root, config, lenis }) {
  const vows = config.vows, N = vows.length;
  root.innerHTML = `
  <header class="pheras__head sec-head section">
    <span class="label">Saat Phere</span>
    <h2 class="h2">Seven <em>vows</em></h2>
    ${rule()}
    <p class="lede">Around the sacred fire, seven steps — seven promises for a lifetime.</p>
  </header>
  <div class="pheras__stage">
    <div class="ring">
      <svg class="ring__svg" viewBox="0 0 400 400" aria-hidden="true">
        <circle class="ring__track" cx="200" cy="200" r="${R}" />
        <circle class="ring__trail" cx="200" cy="200" r="${R}" transform="rotate(-90 200 200)" stroke-dasharray="${C}" stroke-dashoffset="${C}" />
        <circle class="ring__halo" r="16" /><circle class="ring__dot" r="5.5" />
      </svg>
      <div class="fire" aria-hidden="true"><div class="fire__glow"></div>${agni('fire__orn')}${'<i></i>'.repeat(6)}</div>
      ${vows.map((v, i) => { const p = pos((360 / N) * i); return `<button class="stn" type="button" style="left:${p.x / 4}%;top:${p.y / 4}%" aria-label="${v.n} Phera — ${v.title}"><span>${ROMAN[i]}</span></button>`; }).join('')}
    </div>
    <div class="vows">
      <p class="vows__count label" aria-hidden="true">Phera <b>1</b> / ${N}</p>
      <div class="vows__stack" aria-live="polite">
        ${vows.map((v, i) => `<div class="vow" data-i="${i}">
          <span class="vow__num" aria-hidden="true">${ROMAN[i]}</span>
          <p class="label vow__n">${v.n} Phera</p>
          <h3 class="vow__title display"><em>${v.title}</em></h3>
          <p class="vow__text">${v.text}</p></div>`).join('')}
      </div>
      <p class="vows__end display">And so, <em>two become one.</em></p>
    </div>
    <ol class="pheras__list">${vows.map((v, i) => `<li><span class="label">${ROMAN[i]} · ${v.n} Phera</span><b class="display"><em>${v.title}</em></b><p>${v.text}</p></li>`).join('')}</ol>
  </div>`;

  const $ = (s) => root.querySelector(s);
  const stage = $('.pheras__stage'), trail = $('.ring__trail'), dot = $('.ring__dot'), halo = $('.ring__halo');
  const stns = [...root.querySelectorAll('.stn')], blocks = [...root.querySelectorAll('.vow')], count = $('.vows__count b'), end = $('.vows__end');

  let cur = -1, ended = false;
  const place = (deg) => { const p = pos(deg); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); halo.setAttribute('cx', p.x); halo.setAttribute('cy', p.y); };

  // Crossfade to vow k: the old one lifts away, the new one's lines rise in.
  function show(k) {
    if (k === cur) return;
    const prev = blocks[cur], next = blocks[k];
    cur = k; count.textContent = k + 1;
    blocks.forEach((b, i) => b.setAttribute('aria-hidden', i !== k));
    if (prev) gsap.to(prev, { autoAlpha: 0, y: -18, duration: 0.45, ease: 'power2.in', overwrite: true });
    gsap.fromTo(next, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.out, overwrite: true });
    gsap.from(next.querySelectorAll('.vow__n, .vow__title, .vow__text'), { y: 20, autoAlpha: 0, duration: 1, ease: EASE.out, stagger: 0.1, overwrite: 'auto' });
  }
  const showEnd = (on) => {
    if (on === ended) return;
    ended = on;
    root.classList.toggle('is-done', on);
    gsap.to(end, { autoAlpha: on ? 1 : 0, y: on ? 0 : 20, duration: 1.1, ease: EASE.out, overwrite: true });
    if (on) gsap.to(blocks[N - 1], { autoAlpha: 0.0, duration: 0.5, overwrite: true }); else if (cur >= 0) gsap.to(blocks[cur], { autoAlpha: 1, duration: 0.5, overwrite: true });
  };

  // p: 0..1 across the pin. Seven stations, each dwells a little, then the dot travels on; the final leg closes the circle.
  function update(p) {
    const s = Math.min(p * (N + 1), N), k = Math.min(Math.floor(s), N - 1), f = s - k;
    const t = Math.min(1, Math.max(0, (f - 0.3) / 0.7)), sp = s >= N ? N : k + t * t * (3 - 2 * t);
    const deg = (360 / N) * sp;
    place(deg);
    trail.style.strokeDashoffset = C * (1 - sp / N);
    stage.style.setProperty('--heat', (0.35 + 0.65 * (sp / N)).toFixed(3));
    stns.forEach((b, i) => b.classList.toggle('is-lit', sp >= i - 0.001));
    show(Math.min(N - 1, Math.floor(sp + 0.001)));
    showEnd(s >= N);
  }

  // Station buttons jump along the scroll (keyboard + tap).
  let st;
  stns.forEach((b, i) => b.addEventListener('click', () => {
    if (!st) return;
    const y = st.start + ((i + 0.05) / (N + 1)) * (st.end - st.start);
    lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y });
  }));

  drawSVG($('.fire'), { trigger: stage, start: 'top 70%', duration: 2.4 });
  sectionHead($('.pheras__head'));

  if (reduced) {
    root.classList.add('is-static');
    place(0); trail.style.strokeDashoffset = 0; stage.style.setProperty('--heat', 1);
    stns.forEach((b) => b.classList.add('is-lit'));
    gsap.set(end, { autoAlpha: 1 });
    return;
  }

  gsap.set(blocks, { autoAlpha: 0 }); gsap.set(end, { autoAlpha: 0, y: 20 });
  update(0);
  const proxy = { p: 0 };
  const tween = gsap.to(proxy, {
    p: 1, ease: 'none', onUpdate: () => update(proxy.p),
    scrollTrigger: { trigger: stage, start: 'top top', end: () => `+=${innerHeight * 0.6 * (N + 1)}`, pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true },
  });
  st = tween.scrollTrigger;
}

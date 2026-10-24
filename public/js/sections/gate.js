// The gate: carved temple doors under a swaying toran. Scroll swings them open and the couple appear in the light.
import { gsap, ScrollTrigger, SplitText, reduced, EASE, drawSVG } from '../lib/motion.js';
import { arch, toran, rosette, marigold, kalash } from '../lib/ornaments.js';

// Brass knocker: lotus back-plate, boss, pin and a heavy hanging ring (gradient ids per side).
const knocker = (s) => {
  let plate = '';
  for (let i = 0; i < 8; i++) plate += `<path transform="rotate(${i * 45} 30 18)" d="M30 18 C26 13 26 6 30 3 C34 6 34 13 30 18 Z" fill="url(#kb${s})" stroke="#7E5E26" stroke-width=".5" />`;
  return `<svg class="door__knock" viewBox="0 0 60 84" aria-hidden="true">
    <defs>
      <radialGradient id="kb${s}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FBEFC8"/><stop offset=".5" stop-color="#D2AE62"/><stop offset="1" stop-color="#8A6A2E"/></radialGradient>
      <linearGradient id="kr${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E3A8"/><stop offset=".45" stop-color="#C9A45C"/><stop offset="1" stop-color="#7E5E26"/></linearGradient>
    </defs>
    <g class="door__plate">${plate}<circle cx="30" cy="18" r="6.5" fill="url(#kb${s})" stroke="#7E5E26" stroke-width=".6"/><circle cx="28" cy="16" r="2" fill="#FFF8E0" opacity=".7"/></g>
    <g class="door__ring"><rect x="28.4" y="23" width="3.2" height="9" rx="1.6" fill="url(#kr${s})"/>
      <circle cx="30" cy="52" r="19" fill="none" stroke="url(#kr${s})" stroke-width="4.2"/>
      <circle cx="30" cy="52" r="19" fill="none" stroke="#FFF6D8" stroke-width=".8" stroke-dasharray="14 90" stroke-dashoffset="-8" opacity=".8"/></g>
  </svg>`;
};

// One carved door leaf: three recessed panels (kalash · rosette · marigold), brass studs on the stiles.
const door = (side) => `
  <div class="door door--${side}">
    <i class="door__studs"></i>
    <div class="door__in">
      <div class="door__pane door__pane--top">${kalash('door__art')}</div>
      <div class="door__pane door__pane--mid">${rosette('door__art')}</div>
      <div class="door__pane door__pane--low">${marigold('door__art')}</div>
    </div>
    ${knocker(side)}
    <i class="door__shade"></i>
  </div>`;

export default function init({ root, config }) {
  const { invocation, couple } = config;
  root.innerHTML = `
    <div class="gate__pin">
      <div class="gate__glow" aria-hidden="true"></div>
      <div class="gate__toran" aria-hidden="true">${toran('', 9)}</div>
      <div class="gate__frame">
        <div class="gate__clip">
          <div class="gate__paint" aria-hidden="true">${rosette('gate__halo')}</div>
          <div class="gate__light" aria-hidden="true"></div>
          <div class="gate__reveal">
            <p class="gate__invoc"><span lang="hi">${invocation.deva}</span><span class="label">${invocation.latin}</span></p>
            <h1 class="gate__names script" aria-label="${couple.groom} and ${couple.bride}">
              <span class="gate__n gate__n1" aria-hidden="true">${couple.groom}</span>
              <span class="gate__amp display" aria-hidden="true"><em>&amp;</em></span>
              <span class="gate__n gate__n2" aria-hidden="true">${couple.bride}</span>
            </h1>
            <p class="gate__wed label">are getting married</p>
            <p class="gate__date display">${config.dateLine.replace('&', '<em>&amp;</em>')}</p>
            <p class="gate__venue">${config.venue.name} · ${config.venue.place}</p>
          </div>
          <div class="gate__doors">${door('l')}${door('r')}</div>
        </div>
        ${arch('gate__arch')}
      </div>
      <p class="gate__hint label"><span>Scroll to enter</span><i></i></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const pin = $('.gate__pin'), toranBox = $('.gate__toran'), archSvg = $('.gate__arch');
  const doors = root.querySelectorAll('.door'), carved = root.querySelectorAll('.door__in');
  const hint = $('.gate__hint');

  // Clip the doorway to the arch's own outline (sampled from its outer path) so the doors fit it exactly.
  const outer = archSvg.querySelector('path'), L = outer.getTotalLength(), pts = [];
  for (let i = 0; i <= 48; i++) { const q = outer.getPointAtLength((i / 48) * L); pts.push(`${(q.x / 2).toFixed(2)}% ${(q.y / 3).toFixed(2)}%`); }
  $('.gate__clip').style.clipPath = `polygon(${pts.join(',')})`;

  // Strokes stay invisible until the intro hands over.
  const hide = (el) => el.querySelectorAll('.draw').forEach((p) => {
    const l = p.getTotalLength ? p.getTotalLength() : 300;
    gsap.set(p, { strokeDasharray: l, strokeDashoffset: reduced ? 0 : l });
  });
  [toranBox, archSvg, ...carved].forEach(hide);

  if (reduced) { root.classList.add('is-static'); return; }
  gsap.set(toranBox, { yPercent: -120, autoAlpha: 0 });
  gsap.set(hint, { autoAlpha: 0 });

  // intro:done -> toran drops in, arch and carvings draw, drops begin to sway.
  let landed = false;
  const land = () => {
    if (landed) return;
    landed = true;
    gsap.timeline()
      .to(toranBox, { yPercent: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out' })
      .add(() => drawSVG(toranBox, { trigger: null, duration: 2.2, stagger: 0.004 }), 0.1)
      .add(() => drawSVG(archSvg, { trigger: null, duration: 2.6, stagger: 0.3 }), 0.3)
      .add(() => carved.forEach((c) => drawSVG(c, { trigger: null, duration: 2.4, stagger: 0.18 })), 0.6)
      .to(hint, { autoAlpha: 1, duration: 1.2 }, 2.2)
      .add(() => {
        gsap.fromTo(root.querySelectorAll('.drop'), { rotation: -3 }, { rotation: 3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 0%', stagger: { each: 0.25, from: 'center' } });
        gsap.fromTo(root.querySelectorAll('.door__ring'), { rotation: -5 }, { rotation: 5, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 0%' });
      }, 1.8);
  };
  document.addEventListener('intro:done', land, { once: true });
  if (!document.getElementById('intro')) land(); // intro already gone (e.g. skipped)

  // Scroll-driven opening.
  const mm = gsap.matchMedia();
  mm.add({ m: '(max-width: 899px)', d: '(min-width: 900px)' }, (ctx) => {
    const split = SplitText.create(root.querySelectorAll('.gate__n'), { type: 'chars', aria: 'none' });
    const len = ctx.conditions.m ? '+=170%' : '+=190%';
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top top', end: len, pin: pin, scrub: 0.8, anticipatePin: 1 },
    });
    tl.to(hint.children, { autoAlpha: 0, duration: 0.5 }, 0)
      // Doors swing from their outer hinges; the leaf darkens as it turns away from the light.
      .fromTo('.door--l', { rotationY: 0 }, { rotationY: -112, duration: 5, ease: 'power2.inOut' }, 0.3)
      .fromTo('.door--r', { rotationY: 0 }, { rotationY: 112, duration: 5, ease: 'power2.inOut' }, 0.3)
      .to('.door__shade', { opacity: 0.55, duration: 5, ease: 'power1.in' }, 0.3)
      .fromTo('.gate__light', { scale: 0.5, opacity: 0.9 }, { scale: 1.4, opacity: 0.35, duration: 7 }, 0.3)
      .fromTo('.gate__paint', { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 6 }, 1.5)
      .from('.gate__invoc > *', { autoAlpha: 0, y: 18, filter: 'blur(6px)', stagger: 0.3, duration: 1.2, ease: EASE.out }, 3.4)
      .from(split.chars, { autoAlpha: 0, yPercent: 40, rotation: 9, filter: 'blur(14px)', duration: 1.6, stagger: 0.22, ease: 'power3.out' }, 4)
      .from('.gate__amp', { autoAlpha: 0, scale: 2.6, duration: 1.4, ease: 'power3.out' }, 4.9)
      .from('.gate__wed', { autoAlpha: 0, letterSpacing: '.7em', duration: 1.4 }, 6.6)
      .from('.gate__date', { autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: 1.4, ease: EASE.out }, 7.2)
      .from('.gate__venue', { autoAlpha: 0, y: 18, duration: 1.2, ease: EASE.out }, 7.8)
      .to(toranBox, { yPercent: -8, duration: 10 }, 0)
      .to({}, { duration: 1 }); // dwell on the finished scene
    return () => split.revert();
  });
}

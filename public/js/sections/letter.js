// The letter: a letterpress card on cotton paper rises from an envelope pocket, then the lines ink in.
import { gsap, ScrollTrigger, reduced, EASE, drawSVG } from '../lib/motion.js';
import { kalash, paisley, corner, rule } from '../lib/ornaments.js';

// Deterministic deckled edge: a polygon with small jitter along every side.
function deckle(n = 36, j = 0.35) {
  let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647 - 0.5) * 2 * j;
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([(i / n) * 100, r() + j]);
  for (let i = 1; i <= n * 1.6; i++) pts.push([100 - j - r() / 2, (i / (n * 1.6)) * 100]);
  for (let i = n - 1; i >= 0; i--) pts.push([(i / n) * 100, 100 - j + r()]);
  for (let i = Math.floor(n * 1.6) - 1; i > 0; i--) pts.push([j + r() / 2, (i / (n * 1.6)) * 100]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(',')})`;
}

export default function init({ root, config }) {
  const { couple, letter, venue, families } = config;
  const elders = (label, list) => (list.length ? `<p class="ink letter__blabel label">${label}</p>${list.map((n) => `<p class="ink letter__elder">${n}</p>`).join('')}` : '');
  root.innerHTML = `
    <div class="letter__bg" aria-hidden="true">
      <span class="letter__pa letter__pa--1">${paisley()}</span>
      <span class="letter__pa letter__pa--2">${paisley()}</span>
      <span class="letter__pa letter__pa--3">${paisley()}</span>
    </div>
    <div class="wrap letter__wrap">
      <div class="letter__stage">
        <div class="letter__flap" aria-hidden="true"></div>
        <div class="letter__sheet">
          <article class="letter__card" style="clip-path:${deckle()}">
            <div class="letter__crest">${kalash()}</div>
            ${elders(letter.blessingLabel, letter.blessings)}
            <div class="letter__lines">
              <p class="ink letter__hosts">${letter.hosts}</p>
              <p class="ink">${letter.request}</p>
            </div>
            <h2 class="letter__names script" aria-label="${couple.brideFull} with ${couple.groomFull}">
              <span class="ink-name" aria-hidden="true">${couple.bride}<em class="display">${letter.joiner}</em>${couple.groom}</span>
            </h2>
            <p class="ink letter__occ">${letter.groomParents}</p>
            ${elders('Grandson of', letter.groomBlessings)}
            ${rule('letter__rule')}
            <p class="ink letter__date display">${config.dateLine.replace('&', '<em>&amp;</em>')}</p>
            <p class="ink letter__venue label">${venue.name} · ${venue.place}</p>
            <p class="ink letter__bless"><span class="label">With best compliments from</span><span class="letter__fam display"><em>${families}</em> families</span></p>
          </article>
        </div>
        <div class="letter__pocket" aria-hidden="true"></div>
      </div>
    </div>`;

  if (reduced) { root.classList.add('is-static'); return; }

  const $ = (s) => root.querySelector(s);
  const card = $('.letter__card'), crest = $('.letter__crest'), stage = $('.letter__stage');
  const inks = root.querySelectorAll('.ink'), name = $('.ink-name');

  // Starting state: card tucked into the pocket, ink unwritten.
  const wipe = { clipPath: 'inset(-10% 100% -10% 0)' };
  const peek = () => card.offsetHeight - Math.min(150, card.offsetHeight * 0.3);
  gsap.set(card, { y: peek });
  gsap.set(inks, { ...wipe, autoAlpha: 0 });
  gsap.set(name, { ...wipe, autoAlpha: 0 });
  crest.querySelectorAll('.draw').forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
  root.querySelectorAll('.letter__rule .draw').forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });

  const tl = gsap.timeline({ paused: true, onComplete: () => { stage.style.clipPath = 'none'; } });
  tl.from('.letter__flap', { rotationX: -160, transformOrigin: '50% 100%', duration: 1.1, ease: 'power3.inOut' }, 0)
    .to(card, { y: 0, duration: 2.2, ease: 'expo.inOut' }, 0.7)
    .to('.letter__pocket, .letter__flap', { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: 'power2.in' }, 2.5)
    .to(crest.querySelectorAll('.draw'), { strokeDashoffset: 0, duration: 2, ease: EASE.silk, stagger: 0.08 }, 2.6);
  // Ink in, one line at a time, then the names as a slow pen wipe.
  // Lines above the names ink in first, then the names, then everything below — by DOM order.
  const text = [...inks];
  const above = text.filter((el) => el.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING);
  const nameAt = 3.1 + above.length * 0.32;
  text.forEach((el, i) => {
    const k = i - above.length;
    const at = k < 0 ? 3.1 + i * 0.32 : nameAt + 1.6 + k * 0.3;
    tl.to(el, { clipPath: 'inset(-10% 0% -10% 0)', autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, at);
  });
  tl.to(name, { clipPath: 'inset(-30% -5% -30% 0)', autoAlpha: 1, duration: 2.2, ease: 'power2.inOut' }, nameAt)
    .to('.letter__rule .draw', { strokeDashoffset: 0, duration: 1.6, ease: EASE.silk }, nameAt + 1.8);
  // ~3s total: fast enough that a scrolling guest never meets an empty card.
  tl.timeScale(tl.duration() / 3);
  ScrollTrigger.create({ trigger: stage, start: 'top 85%', once: true, onEnter: () => tl.play() });

  // Card drifts a touch slower than the paisley corners.
  gsap.fromTo('.letter__sheet', { yPercent: 2 }, { yPercent: -2, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
  root.querySelectorAll('.letter__pa').forEach((el, i) => {
    gsap.fromTo(el, { yPercent: 14 * (i % 2 ? -1 : 1) }, { yPercent: -14 * (i % 2 ? -1 : 1) * 1.6, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  drawSVG(root.querySelector('.letter__bg'), { trigger: root, duration: 3, stagger: 0.2 });
}

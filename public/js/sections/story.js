// Our Story — a hand-sketched journey. A gold thread is drawn as you scroll and knots at each chapter.
// Desktop: pinned horizontal journey (track translates on X). Mobile / reduced motion: vertical, thread down the side.
import { photo } from '../config.js';
import { gsap, ScrollTrigger, SplitText, EASE, reduced, sectionHead, parallax } from '../lib/motion.js';
import { arch, paisley, feather, lotus, rule } from '../lib/ornaments.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
const SKETCH = [paisley('sketch__orn'), feather('sketch__orn'), lotus('sketch__orn')];

export default function init({ root, config }) {
  root.innerHTML = `
  <div class="story__pin"><div class="story__track">
    <svg class="thread" aria-hidden="true"><path class="thread__ghost"/><path class="thread__line"/><g class="thread__deco"></g><circle class="thread__tip" r="5"/></svg>
    <header class="story__head sec-head">
      <span class="label">Our story</span>
      <h2 class="h2">A thread <em>of fate</em></h2>
      ${rule('story__rule')}
      <p class="lede">Some stories are written long before they are told.</p>
    </header>
    ${config.story.map((c, i) => `
    <article class="chapter chapter--${i + 1}">
      <figure class="chapter__photo">
        <div class="chapter__frame"><div class="chapter__clip"><img class="chapter__img" src="${photo(c.photo)}" alt="Krish and Anika, chapter ${c.numeral}" loading="lazy" decoding="async" /></div></div>
        ${arch('chapter__arch')}
      </figure>
      <div class="chapter__text">
        <span class="numeral">${c.numeral}</span>
        <h3 class="chapter__title display"><em>${c.title}</em></h3>
        <p class="chapter__p">${c.text}</p>
      </div>
      <div class="sketch sketch--${i + 1}" aria-hidden="true">${SKETCH[i % 3]}</div>
    </article>`).join('')}
  </div></div>`;

  const pin = root.querySelector('.story__pin'), track = root.querySelector('.story__track');
  const svg = root.querySelector('.thread'), line = svg.querySelector('.thread__line'), ghost = svg.querySelector('.thread__ghost');
  const deco = svg.querySelector('.thread__deco'), tip = svg.querySelector('.thread__tip');
  const chapters = [...root.querySelectorAll('.chapter')];
  let L = 1, marks = []; // marks: {el, frac} — knots and leaves that light up as the thread passes

  // Measure the layout and redraw the thread path in pixels (horizontal in track mode, vertical otherwise).
  function build() {
    const vert = !root.classList.contains('is-track');
    const tr = track.getBoundingClientRect();
    const W = vert ? 48 : Math.round(tr.width), H = vert ? Math.round(tr.height) : Math.round(pin.clientHeight);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
    const hr = root.querySelector('.story__head').getBoundingClientRect();
    const pts = [vert ? { x: 24, y: hr.bottom - tr.top - 4 } : { x: hr.left - tr.left + hr.width * 0.5, y: H * 0.9 }];
    chapters.forEach((c, i) => {
      const r = (vert ? c.querySelector('.numeral') : c).getBoundingClientRect();
      pts.push(vert ? { x: 24, y: r.top - tr.top + r.height / 2 } : { x: r.left - tr.left + r.width / 2, y: i % 2 ? H * 0.11 : H * 0.9 });
    });
    const last = chapters.at(-1).getBoundingClientRect();
    pts.push(vert ? { x: 24, y: last.bottom - tr.top + 24 } : { x: W - 60, y: H * 0.5 });
    let d = `M${pts[0].x} ${pts[0].y}`;
    pts.slice(1).forEach((p, i) => {
      const a = pts[i], s = i % 2 ? -1 : 1;
      d += vert ? ` C${a.x + 18 * s} ${a.y + (p.y - a.y) * 0.4} ${p.x - 18 * s} ${p.y - (p.y - a.y) * 0.4} ${p.x} ${p.y}`
                : ` C${a.x + (p.x - a.x) * 0.5} ${a.y} ${p.x - (p.x - a.x) * 0.5} ${p.y} ${p.x} ${p.y}`;
    });
    line.setAttribute('d', d); ghost.setAttribute('d', d);
    L = line.getTotalLength();
    gsap.set(line, { strokeDasharray: L, strokeDashoffset: L });

    // Knots at chapters + small leaves along the thread. Fractions found by sampling the path.
    deco.innerHTML = ''; marks = [];
    const N = 500, samples = Array.from({ length: N + 1 }, (_, i) => line.getPointAtLength((L * i) / N));
    const fracOf = (p) => samples.reduce((b, s, i) => (Math.hypot(s.x - p.x, s.y - p.y) < b.d ? { d: Math.hypot(s.x - p.x, s.y - p.y), i } : b), { d: 1e9, i: 0 }).i / N;
    pts.slice(1, -1).forEach((p) => {
      const c = el('circle', { class: 'thread__knot', cx: p.x, cy: p.y, r: 7 });
      deco.append(c); marks.push({ el: c, frac: fracOf(p) });
    });
    const gap = vert ? 150 : 230;
    for (let k = 1, s = gap; s < L - 40; k++, s += gap) {
      const a = line.getPointAtLength(s), b = line.getPointAtLength(s + 2);
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + (k % 2 ? -38 : 38);
      const g = el('g', { transform: `translate(${a.x} ${a.y}) rotate(${ang}) scale(${vert ? 0.8 : 1})` });
      g.append(el('path', { class: 'thread__leaf', d: 'M0 0 C8 -10 22 -10 30 0 C22 10 8 10 0 0 Z M4 0 H26' }));
      deco.append(g); marks.push({ el: g.firstChild, frac: s / L });
    }
    update(update.p || 0);
  }

  // Reveal the thread up to progress p (0..1): dash offset, tip position, and which knots/leaves are lit.
  function update(p) {
    update.p = p;
    line.style.strokeDashoffset = L * (1 - p);
    const t = line.getPointAtLength(L * p);
    tip.setAttribute('cx', t.x); tip.setAttribute('cy', t.y);
    tip.style.opacity = p > 0.005 && p < 0.995 ? 1 : 0;
    marks.forEach((m) => m.el.classList.toggle('on', p >= m.frac));
  }

  // Per-chapter entrance: arch outline draws, photo opens like an iris, text rises through masks.
  function reveal(c) {
    const paths = gsap.utils.toArray(c.querySelectorAll('.chapter__arch .draw'));
    paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    const split = SplitText.create(c.querySelector('.chapter__title'), { type: 'lines', mask: 'lines', aria: 'auto' });
    return gsap.timeline({ paused: true })
      .to(paths, { strokeDashoffset: 0, duration: 2.2, ease: EASE.silk, stagger: 0.2 }, 0)
      .fromTo(c.querySelector('.chapter__clip'), { clipPath: 'circle(0% at 50% 62%)' }, { clipPath: 'circle(80% at 50% 62%)', duration: 1.9, ease: 'expo.inOut' }, 0.1)
      .from(c.querySelector('.chapter__img'), { scale: 1.3, duration: 2.2, ease: EASE.out }, 0.1)
      .from(c.querySelector('.numeral'), { autoAlpha: 0, y: 14, duration: 1, ease: EASE.out }, 0.5)
      .from(split.lines, { yPercent: 110, rotate: 3, duration: 1.4, ease: EASE.out, stagger: 0.1 }, 0.6)
      .from(c.querySelector('.chapter__p'), { autoAlpha: 0, y: 26, duration: 1.2, ease: EASE.out }, 0.95);
  }

  sectionHead(root.querySelector('.story__head'));
  const mm = gsap.matchMedia();

  // Desktop: pinned horizontal journey.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    root.classList.add('is-track');
    const dist = () => Math.max(0, track.offsetWidth - innerWidth);
    ScrollTrigger.addEventListener('refreshInit', build);
    build();
    const move = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      onUpdate() { update(Math.min(1, this.progress() / 0.94)); }, // `this` = tween (move isn't assigned yet on first render)
      scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist() * 1.1}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
    });
    chapters.forEach((c, i) => {
      const ca = { trigger: c, containerAnimation: move, start: 'left right', end: 'right left', scrub: true };
      gsap.set(c.querySelector('.chapter__frame'), { transformPerspective: 1100 });
      gsap.fromTo(c.querySelector('.chapter__frame'), { rotationY: 18 }, { rotationY: -18, ease: 'none', scrollTrigger: ca });
      gsap.fromTo(c.querySelector('.chapter__img'), { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: ca });
      gsap.fromTo(c.querySelector('.sketch'), { x: 160 }, { x: -220, ease: 'none', scrollTrigger: ca });
      const tl = reveal(c);
      ScrollTrigger.create(i === 0
        ? { trigger: pin, start: 'top 55%', once: true, onEnter: () => tl.play() }
        : { trigger: c, containerAnimation: move, start: 'left 80%', once: true, onEnter: () => tl.play() });
    });
    return () => { ScrollTrigger.removeEventListener('refreshInit', build); root.classList.remove('is-track'); };
  });

  // Mobile (and reduced motion): vertical, thread runs down the left edge and draws with scroll.
  mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
    ScrollTrigger.addEventListener('refreshInit', build);
    build();
    if (reduced) { update(1); return () => ScrollTrigger.removeEventListener('refreshInit', build); }
    ScrollTrigger.create({ trigger: track, start: 'top 60%', end: 'bottom 70%', scrub: 0.5, onUpdate: (s) => update(s.progress) });
    chapters.forEach((c) => {
      const tl = reveal(c);
      ScrollTrigger.create({ trigger: c, start: 'top 72%', once: true, onEnter: () => tl.play() });
      parallax(c.querySelector('.sketch'), { amount: 30, trigger: c });
    });
    return () => ScrollTrigger.removeEventListener('refreshInit', build);
  });
}

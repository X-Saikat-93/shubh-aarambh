// Bootstrap: smooth scroll, plugins, preloader, theme engine, chapter rail, then each section.
//
// Module contract — every file in /js/sections exports:
//   export default function init({ root, config, lenis }) { ... }
// `root` is the section's mount element (already in index.html). Modules render their own
// markup from CONFIG, then wire animations with helpers from /js/lib/motion.js.
// Events on `document`: 'preloader:done', 'intro:open' (tap), 'intro:done' (guest is inside).
import { CONFIG } from './config.js';
import { gsap, ScrollTrigger, fontsReady, reduced, isTouch } from './lib/motion.js';
import { seal } from './lib/ornaments.js';
import { startFX } from './fx.js';

gsap.registerPlugin(ScrollTrigger, window.SplitText, window.CustomEase);
window.CustomEase.create('silk', '0.65,0.05,0.36,1');
history.scrollRestoration = 'manual';

// Time-of-day palettes — all light. Sections (or scenes inside them) set data-theme.
export const THEMES = {
  dusk:    { bg: '#FFF6F1', bg2: '#F7E4DC', fg: '#3A1A1C', soft: 'rgba(58,26,28,.66)',  accent: '#A0703F', line: 'rgba(160,112,63,.38)' },
  dawn:    { bg: '#FFFCF6', bg2: '#F5EDDD', fg: '#2E2418', soft: 'rgba(46,36,24,.64)',  accent: '#A07C3A', line: 'rgba(160,124,58,.38)' },
  moon:    { bg: '#F7F6FB', bg2: '#E9E6F3', fg: '#252238', soft: 'rgba(37,34,56,.64)',  accent: '#7D74A8', line: 'rgba(125,116,168,.38)' },
  haldi:   { bg: '#FFF8E6', bg2: '#FBEBC0', fg: '#4A2A06', soft: 'rgba(74,42,6,.66)',   accent: '#C9850E', line: 'rgba(201,133,14,.4)' },
  sangeet: { bg: '#FCF1F5', bg2: '#F4DCE7', fg: '#3F1230', soft: 'rgba(63,18,48,.66)',  accent: '#A23C72', line: 'rgba(162,60,114,.36)' },
  mayra:   { bg: '#F5FAF3', bg2: '#E1EEDC', fg: '#1F3324', soft: 'rgba(31,51,36,.66)',  accent: '#4E7D4F', line: 'rgba(78,125,79,.36)' },
  wedding: { bg: '#FDF1EC', bg2: '#F6DCD2', fg: '#4A1013', soft: 'rgba(74,16,19,.66)',  accent: '#B3362C', line: 'rgba(179,54,44,.36)' },
};
const applyTheme = (name, instant = false) => {
  const t = THEMES[name];
  if (!t) return;
  document.body.dataset.theme = name; // fx.js reads this to pick the petal mix
  gsap.to(document.body, {
    '--bg': t.bg, '--bg-2': t.bg2, '--fg': t.fg, '--fg-soft': t.soft, '--accent': t.accent, '--line': t.line,
    duration: instant || reduced ? 0 : 1.4, ease: 'power2.inOut', overwrite: 'auto',
  });
  document.querySelector('meta[name="theme-color"]').content = t.bg;
};
applyTheme('dusk', true);

// Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in lock-step.
const lenis = new window.Lenis({ lerp: 0.085, smoothWheel: !reduced, syncTouch: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();
window.__lenis = lenis;

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href').length < 2) return;
  e.preventDefault();
  lenis.scrollTo(a.getAttribute('href'), { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
});

const SECTIONS = ['intro', 'gate', 'letter', 'story', 'celebrations', 'pheras', 'venue', 'gallery', 'countdown', 'rsvp', 'finale'];

async function boot() {
  const preloader = document.getElementById('preloader');
  const pct = document.getElementById('preloader-pct');
  const sealBox = document.getElementById('preloader-seal');
  sealBox.innerHTML = seal(CONFIG.couple.monogram);
  // Wax seal stamps down: drops from above, squashes, settles.
  if (!reduced) gsap.timeline()
    .from(sealBox, { y: -80, scale: 1.6, autoAlpha: 0, rotation: -18, duration: 0.9, ease: 'power3.in' })
    .to(sealBox, { scaleX: 1.08, scaleY: 0.92, duration: 0.12, ease: 'power1.out' })
    .to(sealBox, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, .5)' });

  const counter = { v: 0 };
  const counting = gsap.to(counter, { v: 90, duration: 1.6, ease: 'power2.out', onUpdate: () => (pct.textContent = String(Math.round(counter.v)).padStart(2, '0')) });
  const poster = new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = CONFIG.couple.monogram; });

  const modules = await Promise.all(SECTIONS.map((s) => import(`./sections/${s}.js`).catch((err) => {
    console.error(`[${s}]`, err);
    return null;
  })));
  await Promise.all([fontsReady, poster, new Promise((r) => setTimeout(r, 1500))]);
  counting.kill();
  pct.textContent = '100';

  modules.forEach((m, i) => {
    const root = document.getElementById(SECTIONS[i]);
    try { m?.default?.({ root, config: CONFIG, lenis }); } catch (err) { console.error(`[${SECTIONS[i]}]`, err); }
  });

  wireThemes();
  buildRail();

  gsap.timeline()
    .to(preloader, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.15 })
    .add(() => { preloader.remove(); document.dispatchEvent(new Event('preloader:done')); });

  startFX();
  ScrollTrigger.refresh();
}

// Theme engine: whichever [data-theme] element crosses the middle of the viewport owns the palette.
function wireThemes() {
  document.querySelectorAll('#site [data-theme]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => self.isActive && applyTheme(el.dataset.theme),
    });
  });
}

// Chapter rail (desktop): one dot per [data-chapter] section.
function buildRail() {
  const rail = document.querySelector('.rail');
  const items = [...document.querySelectorAll('#site [data-chapter]')];
  rail.innerHTML = items.map((s) => `<a href="#${s.id}" data-hover><span>${s.dataset.chapter}</span><i></i></a>`).join('');
  const links = [...rail.children];
  items.forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 50%', end: 'bottom 50%',
    onToggle: (self) => self.isActive && links.forEach((l, j) => l.classList.toggle('is-active', i === j)),
  }));
}

document.addEventListener('intro:done', () => {
  document.body.classList.remove('is-locked');
  document.querySelector('.rail').classList.add('is-on');
  lenis.start();
  ScrollTrigger.refresh();
});

gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#site', start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

if (!isTouch && !reduced) {
  const ring = document.querySelector('.cursor'), dot = document.querySelector('.cursor-dot');
  const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  addEventListener('pointermove', (e) => {
    if (!ring.classList.contains('is-live')) { // first move: jump into place, then fade in
      gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
      ring.classList.add('is-live'); dot.classList.add('is-live');
    }
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
  });
  document.documentElement.addEventListener('pointerleave', () => { ring.classList.remove('is-live'); dot.classList.remove('is-live'); });
  document.addEventListener('pointerover', (e) => ring.classList.toggle('is-hover', !!e.target.closest('a, button, [data-hover], input, textarea, label')));
}

// Optional music: drop /media/music.mp3 into public/media and the toggle appears after opening.
const soundBtn = document.querySelector('.sound');
fetch('/media/music.mp3', { method: 'HEAD' }).then((r) => {
  if (!r.ok || !(r.headers.get('content-type') || '').includes('audio')) return;
  const audio = new Audio('/media/music.mp3');
  audio.loop = true; audio.volume = 0;
  document.addEventListener('intro:open', () => {
    audio.play().then(() => { gsap.to(audio, { volume: 0.55, duration: 3 }); soundBtn.classList.add('is-on'); }).catch(() => {});
  });
  soundBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    soundBtn.classList.toggle('is-muted', audio.muted);
  });
}).catch(() => {});

boot();

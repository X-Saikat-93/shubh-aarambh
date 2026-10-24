// Shared motion vocabulary. Every section module uses these so the whole
// invite moves with one rhythm. gsap / ScrollTrigger / SplitText are globals (CDN).
const { gsap, ScrollTrigger, SplitText } = window;

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

export const EASE = { out: 'expo.out', silk: 'power3.inOut', soft: 'sine.inOut', back: 'back.out(1.6)' };

// Wait for webfonts before splitting text so line breaks are measured correctly.
export const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

/** Masked line-by-line rise. Returns the timeline (paused when trigger given). */
export function splitReveal(el, { trigger = el, type = 'lines', delay = 0, stagger = 0.09, start = 'top 82%' } = {}) {
  if (!el) return;
  if (reduced) return gsap.set(el, { autoAlpha: 1 });
  const split = SplitText.create(el, { type, mask: type.includes('lines') ? 'lines' : undefined, aria: 'auto' });
  const targets = type.includes('chars') ? split.chars : type.includes('words') ? split.words : split.lines;
  return gsap.from(targets, {
    yPercent: 110, rotate: type.includes('chars') ? 8 : 2, opacity: 0, duration: 1.3, ease: EASE.out, stagger, delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Soft rise + fade for a set of elements. */
export function fadeUp(els, { trigger, y = 40, stagger = 0.12, start = 'top 85%', delay = 0 } = {}) {
  const list = gsap.utils.toArray(els);
  if (!list.length) return;
  if (reduced) return gsap.set(list, { autoAlpha: 1 });
  return gsap.from(list, {
    y, autoAlpha: 0, filter: 'blur(8px)', duration: 1.2, ease: EASE.out, stagger, delay,
    clearProps: 'filter',
    scrollTrigger: { trigger: trigger || list[0], start, once: true },
  });
}

/** Stroke-draw every .draw path inside root. */
export function drawSVG(root, { trigger = root, duration = 2, stagger = 0.12, start = 'top 85%', delay = 0 } = {}) {
  const paths = gsap.utils.toArray(root?.querySelectorAll?.('.draw') || []);
  if (!paths.length) return;
  paths.forEach((p) => {
    const len = p.getTotalLength ? p.getTotalLength() : 300;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
  });
  if (reduced) return;
  return gsap.to(paths, {
    strokeDashoffset: 0, duration, ease: EASE.silk, stagger, delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Scrubbed parallax on y (percent of element height). */
export function parallax(el, { amount = 15, trigger } = {}) {
  if (!el || reduced) return;
  return gsap.fromTo(el, { yPercent: -amount }, {
    yPercent: amount, ease: 'none',
    scrollTrigger: { trigger: trigger || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/** Clip-path curtain reveal for images/cards. dir: 'up' | 'down' | 'left' | 'right' | 'center' */
export function clipReveal(el, { dir = 'up', trigger = el, start = 'top 80%', duration = 1.6, delay = 0 } = {}) {
  if (!el || reduced) return;
  const from = {
    up: 'inset(100% 0% 0% 0%)', down: 'inset(0% 0% 100% 0%)', left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)', center: 'inset(50% 50% 50% 50% round 24px)',
  }[dir];
  return gsap.fromTo(el, { clipPath: from }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', duration, ease: 'expo.inOut', delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Magnetic hover for buttons (desktop only). */
export function magnetic(el, strength = 0.35) {
  if (!el || isTouch || reduced) return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * strength);
    yTo((e.clientY - r.top - r.height / 2) * strength);
  });
  el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
}

/** 3D tilt following the pointer (desktop only). */
export function tilt(el, max = 8) {
  if (!el || isTouch || reduced) return;
  gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
  const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' });
  const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' });
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  });
  el.addEventListener('pointerleave', () => { rx(0); ry(0); });
}

/** Standard section heading: .label rises → .h2 chars rise in masks → .orn draws → .lede lines. */
export function sectionHead(head) {
  if (!head) return;
  const label = head.querySelector('.label, .numeral');
  const title = head.querySelector('.h2');
  const lede = head.querySelector('.lede');
  fadeUp(label, { trigger: head, y: 16 });
  splitReveal(title, { trigger: head, type: 'words,chars', stagger: 0.028 });
  head.querySelectorAll('.orn').forEach((o) => drawSVG(o, { trigger: head, delay: 0.3 }));
  if (lede) splitReveal(lede, { trigger: head, delay: 0.45 });
}

/** Scrub a CSS variable / property between two values across an element's pass through the viewport. */
export function scrubTo(target, vars, { trigger, start = 'top bottom', end = 'bottom top', scrub = true } = {}) {
  if (reduced) return;
  return gsap.to(target, { ...vars, ease: 'none', scrollTrigger: { trigger: trigger || target, start, end, scrub } });
}

export { gsap, ScrollTrigger, SplitText };

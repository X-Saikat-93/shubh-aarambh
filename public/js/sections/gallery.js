// Moments — desktop: pinned 3D depth gallery (camera flies through floating prints);
// mobile/reduced: staggered collage with arch-iris reveals. One shared lightbox (FLIP, swipe, keys, focus trap).
import { gsap, ScrollTrigger, reduced, isTouch, EASE, sectionHead } from '../lib/motion.js';
import { rule } from '../lib/ornaments.js';
import { photo, LANDSCAPE } from '../config.js';

const pad = (n) => String(n).padStart(2, '0');
// Staggered placement in the 3D space: [x vw, y vh]
const SPOTS = [[0, 0], [-24, -5], [24, 6], [-12, 8], [20, -7], [-26, 4], [6, -4], [26, 3]];
const DEPTH = 850; // px between prints

export default function init({ root, config, lenis }) {
  const ids = config.gallery, total = ids.length;
  const alt = (n) => `${config.couple.groom} & ${config.couple.bride} — moment ${n + 1}`;
  const dims = (i) => (LANDSCAPE.has(i) ? [720, 480] : [540, 720]);

  root.innerHTML = `
    <div class="wrap sec-head">
      <span class="label">Captured with love</span>
      <h2 class="h2">Little <em>moments</em></h2>
      ${rule()}
      <p class="lede">${config.gallerySubtitle}</p>
    </div>
    <div class="gal">
      <span class="gal__word script" aria-hidden="true">yaadein</span>
      <div class="gal__world">
        ${ids.map((id, n) => {
          const [w, h] = dims(id);
          return `<figure class="tile ${LANDSCAPE.has(id) ? 'tile--wide' : `tile--p${n % 3}`}">
            <button class="tile__btn" type="button" data-hover data-i="${n}" aria-label="Open moment ${n + 1} of ${total}">
              <span class="tile__img"><img src="${photo(id, 'sm')}" width="${w}" height="${h}" alt="${alt(n)}" loading="lazy" decoding="async" draggable="false"></span>
              <svg class="tile__frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="100" height="100" pathLength="1"/></svg>
            </button>
          </figure>`;
        }).join('')}
      </div>
      <div class="gal__count" aria-hidden="true"><b>01</b> / ${pad(total)}</div>
    </div>
    <div class="lb" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
      <div class="lb__bg"></div>
      <div class="lb__stage"><img class="lb__img" alt="" draggable="false"></div>
      <button class="lb__btn lb__close" type="button" aria-label="Close photo viewer"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
      <button class="lb__btn lb__prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="lb__btn lb__next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
      <div class="lb__count" aria-live="polite"></div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const gal = $('.gal'), word = $('.gal__word'), counter = $('.gal__count b');
  const tiles = gsap.utils.toArray('.tile', root);
  sectionHead($('.sec-head'));

  // ───────── Desktop: pinned depth gallery ─────────
  let in3d = false, pinST = null;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    in3d = true; root.classList.add('is-3d');
    gsap.set(tiles, { xPercent: -50, yPercent: -50, x: (i) => `${SPOTS[i % SPOTS.length][0]}vw`, y: (i) => `${SPOTS[i % SPOTS.length][1]}vh` });
    const cam = { z: 0 }, span = (total - 1) * DEPTH;
    const clamp = gsap.utils.clamp(0, 1);
    const render = () => {
      tiles.forEach((t, i) => {
        const dz = cam.z - i * DEPTH;
        const o = clamp((dz + 2100) / 800) * clamp((420 - dz) / 300);
        gsap.set(t, { z: dz, opacity: o, pointerEvents: o > 0.45 ? 'auto' : 'none' });
      });
      gsap.set(word, { xPercent: -cam.z / span * 14 });
      counter.textContent = pad(Math.round(cam.z / DEPTH) + 1);
    };
    render();
    const tw = gsap.to(cam, { z: span, ease: 'none', onUpdate: render, paused: true });
    pinST = ScrollTrigger.create({ trigger: gal, start: 'top top', end: () => `+=${total * 620}`, pin: true, scrub: 0.8, anticipatePin: 1, animation: tw });
    return () => {
      in3d = false; root.classList.remove('is-3d'); pinST = null;
      gsap.set([...tiles, word], { clearProps: 'all' }); counter.textContent = '01';
    };
  });

  // Keyboard focus on a tile that is off in depth: scrub the page to bring it forward
  root.addEventListener('focusin', (e) => {
    const b = e.target.closest?.('.tile__btn');
    if (!b || !in3d || !pinST || open) return;
    const i = +b.dataset.i;
    const y = pinST.start + (i / (total - 1)) * (pinST.end - pinST.start);
    if (Math.abs(scrollY - y) > 60) lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  });

  // ───────── Mobile / reduced-desktop: collage with arch-iris reveals ─────────
  mm.add('(max-width: 899.98px), (prefers-reduced-motion: reduce)', () => {
    if (reduced) return;
    tiles.forEach((t, i) => {
      const box = t.querySelector('.tile__img'), img = t.querySelector('img');
      const st = { trigger: t, start: 'top 90%', once: true };
      gsap.fromTo(box, { clipPath: 'inset(32% 18% 12% 18% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 2px 2px 2px 2px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: st });
      gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: EASE.out, scrollTrigger: st });
      gsap.from(t, { y: 40, opacity: 0, duration: 1.4, ease: EASE.out, scrollTrigger: st });
      if (!t.classList.contains('tile--wide')) {
        gsap.fromTo(t, { yPercent: i % 2 ? 3 : -2 }, { yPercent: i % 2 ? -3 : 2, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    });
  });

  // ───────── Lightbox ─────────
  const lb = $('.lb'), lbImg = $('.lb__img'), lbBg = $('.lb__bg'), lbCount = $('.lb__count'), stage = $('.lb__stage');
  const btns = [...lb.querySelectorAll('.lb__btn')];
  let cur = 0, opener = null, open = false, busy = false;

  const thumb = (n) => tiles[n].querySelector('.tile__img');
  const fit = (n) => {
    const [w, h] = LANDSCAPE.has(ids[n]) ? [1500, 1000] : [900, 1200];
    const s = Math.min((innerWidth - (innerWidth < 600 ? 24 : 180)) / w, (innerHeight - 160) / h);
    return { w: w * s, h: h * s };
  };
  const setSrc = (n) => {
    lbImg.alt = alt(n);
    lbImg.src = photo(ids[n], 'sm');
    const big = new Image(); big.src = photo(ids[n], 'lg');
    big.decode?.().then(() => { if (open && cur === n) lbImg.src = big.src; }).catch(() => {});
    [n - 1, n + 1].forEach((k) => { new Image().src = photo(ids[(k + total) % total], 'lg'); });
    lbCount.innerHTML = `<b>${pad(n + 1)}</b> / ${pad(total)}`;
  };
  const place = (n) => { const f = fit(n); gsap.set(lbImg, { width: f.w, height: f.h, xPercent: -50, yPercent: -50, left: '50%', top: '50%' }); };
  // transform mapping the fitted image onto its thumb (null when the thumb isn't visibly on screen)
  const flipFrom = (n) => {
    const r = thumb(n).getBoundingClientRect(), f = fit(n);
    const vis = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && gsap.getProperty(tiles[n], 'opacity') > 0.45;
    return vis ? { x: r.left + r.width / 2 - innerWidth / 2, y: r.top + r.height / 2 - innerHeight / 2, scale: r.width / f.w } : null;
  };
  const unhide = () => tiles.forEach((t) => { t.querySelector('.tile__img').style.visibility = ''; });

  function openLB(n, from) {
    if (open) return;
    open = true; cur = n; opener = from;
    lb.hidden = false; lenis?.stop();
    setSrc(n); place(n);
    gsap.set(lb, { autoAlpha: 1 });
    gsap.fromTo(lbBg, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: EASE.out });
    gsap.fromTo([...btns, lbCount], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.out, delay: 0.35, stagger: 0.05 });
    const f = flipFrom(n);
    if (f && !reduced) {
      thumb(n).style.visibility = 'hidden';
      gsap.fromTo(lbImg, { ...f, opacity: 1 }, { x: 0, y: 0, scale: 1, duration: 1.1, ease: EASE.out });
    } else gsap.fromTo(lbImg, { opacity: 0, scale: 0.94, x: 0, y: 0 }, { opacity: 1, scale: 1, duration: 0.8, ease: EASE.out });
    btns[0].focus({ preventScroll: true });
  }

  function closeLB() {
    if (!open || busy) return;
    open = false;
    const f = flipFrom(cur);
    gsap.to([...btns, lbCount], { autoAlpha: 0, duration: 0.3 });
    gsap.to(lbBg, { opacity: 0, duration: 0.8, ease: EASE.silk });
    const done = () => {
      unhide(); lb.hidden = true; lbImg.removeAttribute('src');
      lenis?.start();
      // return focus to the opener, or to the tile we ended on
      (tiles[cur].querySelector('button')).focus({ preventScroll: true });
    };
    if (f && !reduced) {
      gsap.to(lbImg, { ...f, duration: 0.9, ease: EASE.silk, onComplete: () => { gsap.set(lbImg, { opacity: 0 }); done(); } });
      gsap.delayedCall(0.75, unhide);
    } else gsap.to(lbImg, { opacity: 0, duration: 0.4, onComplete: done });
  }

  function go(dir) {
    if (busy || !open) return;
    busy = true;
    unhide();
    const n = (cur + dir + total) % total;
    const off = Math.min(80, innerWidth * 0.15) * dir;
    gsap.to(lbImg, {
      x: -off, opacity: 0, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        cur = n; setSrc(n); place(n);
        gsap.fromTo(lbImg, { x: off, opacity: 0, scale: 1, y: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: EASE.out, onComplete: () => { busy = false; } });
      },
    });
  }

  root.addEventListener('click', (e) => { const b = e.target.closest('.tile__btn'); if (b) openLB(+b.dataset.i, b); });
  $('.lb__close').addEventListener('click', closeLB);
  $('.lb__prev').addEventListener('click', () => go(-1));
  $('.lb__next').addEventListener('click', () => go(1));
  lbBg.addEventListener('click', closeLB);
  stage.addEventListener('click', (e) => { if (e.target !== lbImg) closeLB(); });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'Tab') {
      e.preventDefault();
      const i = btns.indexOf(document.activeElement);
      btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
    }
  });

  let sx = null;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  stage.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) go(e.clientX < sx ? 1 : -1); sx = null; });
  stage.addEventListener('pointercancel', () => { sx = null; });
  addEventListener('resize', () => { if (open && !busy) place(cur); });

  // Lazy images change collage height once decoded
  root.querySelectorAll('img').forEach((im) => { if (!im.complete) im.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }); });
}

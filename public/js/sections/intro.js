// Envelope intro: tap the seal -> video plays (names painted in) -> the card swells, its gold frame
// expands outward and the stage dissolves to white, handing over to #gate.
import { gsap, reduced, EASE } from '../lib/motion.js';
import { diya } from '../lib/ornaments.js';

const VW = 478, VH = 850, SEAL = { x: 0.5, y: 0.615 }, NAMES_AT = 8;

export default function init({ root, config }) {
  const src = '/media/intro.mp4';
  root.innerHTML = `
    <div class="intro__stage">
      <div class="intro__ambient" aria-hidden="true"><img src="/media/env-poster.jpg" alt="" /></div>
      <div class="intro__card">
        <div class="intro__clip">
          <div class="intro__zoom">
            <video class="intro__video" src="${src}" poster="/media/env-poster.jpg" muted playsinline webkit-playsinline preload="auto" aria-hidden="true" tabindex="-1"></video>
            <img class="intro__names" src="/media/names.jpg" alt="" />
          </div>
          <div class="intro__vig"></div>
          <div class="intro__flash"></div>
          <div class="intro__ui">
            <div class="intro__invoc"><span lang="hi">${config.invocation.deva}</span></div>
            <span class="intro__ring"></span>
            <div class="intro__cta">
              <span class="intro__tap">Tap to open</span>
              ${diya('intro__diya')}
              <span class="intro__hint">${config.rsvp.note}</span>
            </div>
          </div>
          <i class="intro__loader"></i>
        </div>
        <div class="intro__frame" aria-hidden="true"></div>
      </div>
      <div class="intro__hit" role="button" tabindex="0" aria-label="Tap to open your invitation"></div>
      <button class="intro__skip" type="button">Skip</button>
      <button class="intro__cue" type="button"><span>Scroll to begin ↓</span></button>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const stage = $('.intro__stage'), card = $('.intro__card'), video = $('.intro__video'), namesImg = $('.intro__names');
  const ring = $('.intro__ring'), cta = $('.intro__cta'), invoc = $('.intro__invoc'), flash = $('.intro__flash');
  const hit = $('.intro__hit'), skip = $('.intro__skip'), cue = $('.intro__cue'), loader = $('.intro__loader');
  const zoom = $('.intro__zoom'), vig = $('.intro__vig'), frame = $('.intro__frame'), clip = $('.intro__clip'), ambientBox = $('.intro__ambient');
  let ambient = null, opened = false, cueShown = false, done = false, autoTimer, seal = { x: 0, y: 0 };
  video.muted = true; video.defaultMuted = true;

  // Card mode on wide screens (blurred ambient fill); cover on phones. Seal point from the rendered video box.
  function layout() {
    const wide = innerWidth / innerHeight > 0.7;
    root.classList.toggle('is-card', wide);
    const cw = card.clientWidth, ch = card.clientHeight;
    const s = Math.max(cw / VW, ch / VH);
    seal = { x: (cw - VW * s) / 2 + VW * s * SEAL.x, y: (ch - VH * s) / 2 + VH * s * SEAL.y };
    gsap.set([ring, flash], { left: seal.x, top: seal.y });
    gsap.set(zoom, { transformOrigin: `${seal.x}px ${seal.y}px` });
    const ringSize = Math.max(72, VW * s * 0.31);
    ring.style.width = ring.style.height = ringSize + 'px';
    ring.style.margin = `${-ringSize / 2}px 0 0 ${-ringSize / 2}px`;
    cta.style.top = Math.min(seal.y + ringSize / 2 + 18, ch - 190) + 'px';
    if (wide && !ambient) {
      ambient = document.createElement('video');
      Object.assign(ambient, { src, muted: true, playsInline: true, preload: 'auto' });
      ambient.setAttribute('aria-hidden', 'true');
      ambientBox.prepend(ambient);
      if (opened && !video.paused) ambient.play().catch(() => {});
    }
  }
  layout();
  addEventListener('resize', layout);

  // Entrance after the preloader lifts: frame draws in (scale from inside), then the text and ring.
  const uiItems = [invoc, ring, ...cta.children];
  gsap.set(uiItems, { autoAlpha: 0 });
  gsap.set(frame, { autoAlpha: 0 });
  const diyaPaths = gsap.utils.toArray('.intro__diya .draw', root);
  diyaPaths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: reduced ? 0 : l }); });
  const entrance = () => {
    gsap.to(frame, { autoAlpha: 1, duration: 1.6, ease: EASE.out });
    gsap.fromTo(frame, { scale: 0.96 }, { scale: 1, duration: 2, ease: EASE.out });
    gsap.fromTo(uiItems, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE.out, stagger: 0.18, delay: 0.25, clearProps: 'transform' });
    if (!reduced) gsap.to(diyaPaths, { strokeDashoffset: 0, duration: 2.2, ease: EASE.silk, stagger: 0.12, delay: 0.9 });
  };
  document.addEventListener('preloader:done', entrance, { once: true });

  // ---- finish: hand over to #gate, fire intro:done once ----
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(autoTimer);
    removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTs); removeEventListener('touchmove', onTm); removeEventListener('keydown', onKey);
    removeEventListener('resize', layout);
    skip.style.visibility = 'hidden'; cue.style.visibility = 'hidden';
    const end = () => { video.pause(); ambient?.pause(); root.style.display = 'none'; root.remove(); };
    const go = () => document.dispatchEvent(new Event('intro:done'));
    if (reduced) { gsap.to(root, { autoAlpha: 0, duration: 0.6, onComplete: end }); go(); return; }
    // The card swells and fades; its gold frame keeps growing outward like the arch about to be drawn.
    gsap.timeline({ onComplete: end })
      .to(frame, { scale: 1.7, autoAlpha: 0, duration: 1.9, ease: EASE.silk }, 0)
      .to(clip, { scale: 1.12, filter: 'blur(14px)', autoAlpha: 0, duration: 1.5, ease: EASE.silk }, 0)
      .to(ambientBox, { autoAlpha: 0, duration: 1.2, ease: 'sine.inOut' }, 0)
      .to(root, { backgroundColor: 'rgba(255,251,247,0)', duration: 1.1, ease: 'sine.inOut' }, 0.7)
      .add(go, 0.8);
  }
  // Another module (or the test harness) may fire intro:done itself.
  document.addEventListener('intro:done', () => { if (!done) { done = true; clearTimeout(autoTimer); root.remove(); } });

  // ---- names visible: cue + auto-advance ----
  function showCue() {
    if (cueShown || done) return;
    cueShown = true;
    cue.style.visibility = 'visible';
    gsap.fromTo(cue, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.out });
    autoTimer = setTimeout(finish, 2500);
  }
  const onWheel = (e) => { if (cueShown && e.deltaY > 8) finish(); };
  let ty = 0;
  const onTs = (e) => { ty = e.touches[0].clientY; };
  const onTm = (e) => { if (cueShown && ty - e.touches[0].clientY > 24) finish(); };
  const onKey = (e) => { if (cueShown && ['ArrowDown', 'PageDown'].includes(e.key)) finish(); };
  addEventListener('wheel', onWheel, { passive: true });
  addEventListener('touchstart', onTs, { passive: true });
  addEventListener('touchmove', onTm, { passive: true });
  addEventListener('keydown', onKey);
  cue.addEventListener('click', finish);
  skip.addEventListener('click', finish);

  // Fallback path: crossfade straight to names.jpg.
  function fallback() {
    if (done || cueShown) return;
    video.pause();
    gsap.to(namesImg, { opacity: 1, duration: 1.4, ease: 'sine.inOut' });
    gsap.to(vig, { opacity: 0, duration: 1 });
    setTimeout(showCue, 1200);
  }

  // ---- open ----
  function open() {
    if (opened) return;
    opened = true;
    document.dispatchEvent(new Event('intro:open'));
    hit.classList.add('is-off'); hit.removeAttribute('role'); hit.removeAttribute('tabindex');
    skip.style.visibility = 'visible';
    gsap.fromTo(skip, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.6 });
    // Start playback inside the gesture.
    if (reduced) fallback();
    else {
      const p = video.play();
      ambient?.play().catch(() => {});
      p?.catch(fallback);
      gsap.to(zoom, { scale: 1.06, duration: 15, ease: 'none' });
    }
    // Ripple from the seal, UI dissolves.
    gsap.timeline()
      .fromTo(flash, { scale: 0.5, opacity: 0.95 }, { scale: Math.max(card.clientWidth, card.clientHeight) / 14, opacity: 0, duration: 1.6, ease: 'expo.out' })
      .to(uiItems, { autoAlpha: 0, scale: 1.06, duration: 0.7, ease: 'power2.out', stagger: 0.04 }, 0);
  }
  hit.addEventListener('click', open);
  hit.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  // Names appear around 8s: check on timeupdate rather than a timer.
  video.addEventListener('timeupdate', () => { if (video.currentTime >= NAMES_AT) showCue(); });
  video.addEventListener('ended', showCue);
  video.addEventListener('error', () => opened && fallback());
  const stall = () => opened && !cueShown && loader.classList.add('is-on');
  video.addEventListener('waiting', stall); video.addEventListener('stalled', stall);
  video.addEventListener('playing', () => loader.classList.remove('is-on'));
}

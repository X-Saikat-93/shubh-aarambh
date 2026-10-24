// Envelope intro, drawn live (CSS 3D + SVG, no video): tap the wax seal -> the seal lifts away,
// the flap swings open, the invitation card rises out with the couple's names -> the card grows
// to fill the screen and dissolves into #gate. Fires 'intro:open' on tap and 'intro:done' once.
import { gsap, reduced, isTouch, EASE } from '../lib/motion.js';
import { seal, diya, paisley, rule } from '../lib/ornaments.js';

export default function init({ root, config }) {
  const { couple, invocation, rsvp } = config;
  root.innerHTML = `
    <div class="intro__stage">
      <div class="intro__invoc" lang="hi">${invocation.deva}</div>
      <div class="env" aria-hidden="true">
        <div class="env__float">
          <div class="env__back"></div>
          <div class="env__card">
            <img class="ec__mono" src="${couple.monogram}" alt="" />
            <p class="ec__names script">${couple.groom}<em class="display">&amp;</em>${couple.bride}</p>
            <p class="ec__wed label">are getting married</p>
            ${rule('ec__rule')}
            <p class="ec__date display">${config.dateLine.replace('&', '<em>&amp;</em>')}</p>
          </div>
          <div class="env__front">
            <svg class="env__folds" viewBox="0 0 100 68" preserveAspectRatio="none">
              <path d="M0 68 L50 34 L100 68" /><path d="M0 0 L50 37 L100 0" />
            </svg>
            <span class="env__pa env__pa--l">${paisley()}</span><span class="env__pa env__pa--r">${paisley()}</span>
            <i class="env__sheen"></i>
          </div>
          <div class="env__flap"><div class="env__flap-out"><i class="env__sheen"></i></div><div class="env__flap-in"></div></div>
          <div class="env__seal"><span class="env__ring"></span>${seal(couple.monogram)}</div>
        </div>
        <div class="env__shadow"></div>
      </div>
      <div class="intro__cta">
        <span class="intro__tap">Tap the seal to open</span>
        ${diya('intro__diya')}
        <span class="intro__hint">${rsvp.note}</span>
      </div>
      <div class="intro__flash"></div>
      <div class="intro__hit" role="button" tabindex="0" aria-label="Open your invitation"></div>
      <button class="intro__skip" type="button">Skip</button>
      <button class="intro__cue" type="button"><span>Scroll to begin ↓</span></button>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const env = $('.env'), float = $('.env__float'), flap = $('.env__flap'), card = $('.env__card');
  const sealEl = $('.env__seal'), shadow = $('.env__shadow'), flash = $('.intro__flash');
  const invoc = $('.intro__invoc'), cta = $('.intro__cta'), hit = $('.intro__hit'), skip = $('.intro__skip'), cue = $('.intro__cue');
  const cardBits = [...card.children];
  let opened = false, cueShown = false, done = false, autoTimer, idle;

  // ---- entrance after the preloader: envelope settles in, seal and prompt appear ----
  const diyaPaths = gsap.utils.toArray('.intro__diya .draw', root);
  diyaPaths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: reduced ? 0 : l }); });
  gsap.set([invoc, ...cta.children], { autoAlpha: 0 });
  gsap.set(env, { autoAlpha: 0, y: 40, rotationX: 18 });
  gsap.set(sealEl, { scale: 0.4, autoAlpha: 0 });
  const entrance = () => {
    gsap.timeline()
      .to(env, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.6, ease: EASE.out })
      .to(sealEl, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(2.2)' }, 0.7)
      .to(invoc, { autoAlpha: 1, duration: 1.2 }, 0.5)
      .fromTo(cta.children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.out, stagger: 0.15 }, 1)
      .to(diyaPaths, { strokeDashoffset: 0, duration: 2, ease: EASE.silk, stagger: 0.1 }, 1.3);
    if (!reduced) idle = gsap.to(float, { y: -8, rotation: -0.6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  };
  document.addEventListener('preloader:done', entrance, { once: true });

  // Desktop: the envelope tilts toward the pointer.
  if (!isTouch && !reduced) {
    const rx = gsap.quickTo(env, 'rotationX', { duration: 0.9, ease: 'power3' });
    const ry = gsap.quickTo(env, 'rotationY', { duration: 0.9, ease: 'power3' });
    root.addEventListener('pointermove', (e) => {
      if (opened) return;
      rx(-(e.clientY / innerHeight - 0.5) * 10); ry((e.clientX / innerWidth - 0.5) * 14);
    });
  }

  // ---- open: seal lifts away, flap swings, card rises with the names ----
  function open() {
    if (opened) return;
    opened = true;
    document.dispatchEvent(new Event('intro:open'));
    hit.classList.add('is-off'); hit.removeAttribute('role'); hit.removeAttribute('tabindex');
    idle?.pause();
    skip.style.visibility = 'visible';
    gsap.fromTo(skip, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.8 });
    gsap.set(cardBits, { autoAlpha: 0, y: 12 });
    if (reduced) {
      gsap.set([sealEl, ...cta.children], { autoAlpha: 0 });
      gsap.set(flap, { rotationX: 180, zIndex: 1 });
      gsap.set(card, { yPercent: -50 });
      gsap.set(cardBits, { autoAlpha: 1, y: 0 });
      return showCue();
    }
    const r = sealEl.getBoundingClientRect();
    gsap.set(flash, { left: r.left + r.width / 2, top: r.top + r.height / 2 });
    gsap.timeline({ onComplete: showCue })
      .add(() => gsap.killTweensOf(diyaPaths), 0)
      .to(env, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' }, 0)
      .to(cta.children, { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05, overwrite: true }, 0) // beats a still-running entrance
      .to(sealEl, { scale: 1.18, duration: 0.25, ease: 'power2.out' }, 0)
      .fromTo(flash, { scale: 0.3, opacity: 0.9 }, { scale: 9, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.2)
      .to(sealEl, { y: -90, rotation: 28, scale: 0.7, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, 0.25)
      .to(flap, { rotationX: 180, duration: 1.2, ease: 'power3.inOut' }, 0.45)
      .set(flap, { zIndex: 1 }, 1.05) // past vertical: the open flap now sits behind the card
      .to(card, { yPercent: -50, duration: 1.5, ease: EASE.out }, 1.25)
      .to(shadow, { scaleX: 1.15, opacity: 0.55, duration: 1.5, ease: EASE.out }, 1.25)
      .to(cardBits, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.14 }, 1.7)
      .to(invoc, { y: -6, duration: 1.5, ease: EASE.out }, 1.25);
  }
  hit.addEventListener('click', open);
  hit.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  // ---- cue + auto-advance ----
  function showCue() {
    if (cueShown || done) return;
    cueShown = true;
    cue.style.visibility = 'visible';
    gsap.fromTo(cue, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.out });
    autoTimer = setTimeout(finish, 2600);
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
  skip.addEventListener('click', () => { if (!opened) open(); finish(); });

  // ---- finish: the envelope falls away, the card grows to fill the screen and dissolves into #gate ----
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(autoTimer);
    removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTs); removeEventListener('touchmove', onTm); removeEventListener('keydown', onKey);
    skip.style.visibility = 'hidden'; cue.style.visibility = 'hidden';
    const end = () => { idle?.kill(); root.remove(); };
    const go = () => document.dispatchEvent(new Event('intro:done'));
    if (reduced) { gsap.to(root, { autoAlpha: 0, duration: 0.6, onComplete: end }); go(); return; }
    const c = card.getBoundingClientRect();
    const grow = Math.max(innerWidth / c.width, innerHeight / c.height) * 1.15;
    gsap.timeline({ onComplete: end })
      .to([cue, invoc], { autoAlpha: 0, duration: 0.4 }, 0)
      .to(['.env__back', '.env__front', flap, shadow], { y: '45vh', autoAlpha: 0, duration: 1.1, ease: 'power3.in' }, 0)
      .to(cardBits, { autoAlpha: 0, duration: 0.5 }, 0.3)
      .to(card, { scale: grow, duration: 1.4, ease: EASE.silk }, 0.25)
      .to(root, { autoAlpha: 0, duration: 0.8, ease: 'sine.inOut' }, 1.1)
      .add(go, 1.0);
  }
  // Another module (or the test harness) may fire intro:done itself.
  document.addEventListener('intro:done', () => { if (!done) { done = true; clearTimeout(autoTimer); idle?.kill(); root.remove(); } });
}

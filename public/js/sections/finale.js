// Closing benediction — the toran drapes, diyas light one by one, dawn-light blooms behind the names.
import { gsap, SplitText, reduced, EASE, drawSVG, scrubTo, magnetic } from '../lib/motion.js';
import { diya, toran } from '../lib/ornaments.js';

export default function init({ root, config, lenis }) {
  const { couple, credit } = config;
  const lampsHtml = Array.from({ length: 9 }, () => `<span class="fn__lamp">${diya()}</span>`).join('');

  root.innerHTML = `
    <div class="fn">
      <div class="fn__toran">${toran('', 7)}</div>
      <div class="fn__dawn" aria-hidden="true"></div>
      <div class="fn__body wrap">
        <div class="fn__main fn__lamp" aria-hidden="true">${diya()}</div>
        <p class="label fn__bless">With the blessings of the Almighty and our elders</p>
        <h2 class="fn__names" aria-label="${couple.groom} and ${couple.bride}">
          <span class="script fn__a" aria-hidden="true">${couple.groom}</span>
          <em class="fn__amp" aria-hidden="true">&amp;</em>
          <span class="script fn__a" aria-hidden="true">${couple.bride}</span>
        </h2>
        <div class="fn__date">
          <p class="label">Save the date</p>
          <p class="fn__d">${config.dateLabel}</p>
        </div>
        <p class="fn__love">With love — the ${config.families} families</p>
        <button class="btn" type="button" data-top>Back to top</button>
      </div>
      <div class="fn__row" aria-hidden="true">${lampsHtml}</div>
      <p class="fn__credit">${credit.url ? `<a href="${credit.url}" target="_blank" rel="noopener">${credit.label}</a>` : credit.label}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  $('[data-top]').addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 3 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })));
  magnetic($('[data-top]'));

  const lamps = [...root.querySelectorAll('.fn__lamp')];
  if (reduced) return lamps.forEach((l) => l.classList.add('is-lit'));

  const fn = $('.fn');
  const names = [...root.querySelectorAll('.fn__a')];
  const chars = names.flatMap((n) => SplitText.create(n, { type: 'chars' }).chars);

  // Toran drapes in from above, then its strokes draw.
  gsap.from('.fn__toran', { yPercent: -100, duration: 2, ease: EASE.out, scrollTrigger: { trigger: fn, start: 'top 70%', once: true } });
  drawSVG($('.fn__toran'), { trigger: fn, start: 'top 70%', duration: 2.6, stagger: 0.01 });

  const tl = gsap.timeline({ scrollTrigger: { trigger: '.fn__body', start: 'top 70%', once: true } });
  tl.add(() => $('.fn__main').classList.add('is-lit'), 0.2)
    .from('.fn__main', { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: EASE.out }, 0)
    .from('.fn__bless', { y: 16, autoAlpha: 0, duration: 1.2, ease: EASE.out }, 0.4)
    .from(chars, { yPercent: 70, rotate: 6, autoAlpha: 0, filter: 'blur(10px)', duration: 1.5, ease: EASE.out, stagger: 0.07, clearProps: 'filter' }, 0.7)
    .from('.fn__amp', { scale: 0.4, autoAlpha: 0, duration: 1.4, ease: EASE.out }, 1.1)
    .from('.fn__date > *, .fn__love, [data-top]', { y: 28, autoAlpha: 0, duration: 1.2, ease: EASE.out, stagger: 0.12 }, 1.8);

  // Row of diyas lights from the centre outward.
  const row = [...root.querySelectorAll('.fn__row .fn__lamp')];
  const mid = (row.length - 1) / 2;
  gsap.from(row, { y: 30, autoAlpha: 0, duration: 1.2, ease: EASE.out, stagger: { each: 0.08, from: 'center' }, scrollTrigger: { trigger: '.fn__row', start: 'top 95%', once: true } });
  const lit = gsap.timeline({ scrollTrigger: { trigger: '.fn__row', start: 'top 95%', once: true } });
  row.map((l, i) => [l, Math.abs(i - mid)]).sort((x, y) => x[1] - y[1]).forEach(([l], i) => lit.add(() => l.classList.add('is-lit'), 1 + i * 0.22));

  // Dawn light expands behind the names as the footer scrolls into view.
  scrubTo('.fn__dawn', { scale: 1.4, opacity: 1 }, { trigger: fn, start: 'top 85%', end: 'center 40%' });
  gsap.set('.fn__dawn', { scale: 0.2, opacity: 0 });
}

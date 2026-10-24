// Garv & Kaavya — one phone-width column: envelope (opens on scroll) -> save the date (scratch card)
// -> invitation -> events -> special moments -> countdown -> RSVP -> regards. Petals fall throughout.
import { seal, kalash, marigold, rosette, moon, sun, agni } from './ornaments.js';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- content ----------
const C = {
  mono: '/media/monogram.png',
  bride: 'Kaavya', groom: 'Garv',
  invocation: '॥ श्री गणेशाय नमः ॥',
  elders: ['Lt. Shri Laxmipat Singh Chandalia', 'Lt. Smt. Bhiki Devi Chandalia'],
  hosts: 'Smt. Sunita & Shri Rakesh Kumar Chandalia',
  request: 'joyfully invite you to celebrate the marriage of their beloved daughter',
  groomParents: 'S/O Smt. Kavita & Shri Sanjay Garg',
  tagline: 'Two families, one blessing, and a forever that begins with seven steps around the sacred fire.',
  families: 'Chandalia & Garg Families',
  hashtag: '#kaarvinlove',
  wedding: '2026-12-12T00:00:00+05:30',
  dateBig: '12 · 12 · 2026', dateDay: 'Saturday',
  venue: 'Sher Bengal River Resort', address: 'Kolaghat, Purba Medinipur, West Bengal',
  map: 'https://share.google/ondJkXiFkBXDm8Jhc',
  events: [
    { id: 'mayra', name: 'Mayra', date: '11th December 2026 · Friday', art: rosette, tint: '#E9F1E6',
      blurb: 'The maternal family arrives bearing gifts and blessings, the first ritual of the celebrations.' },
    { id: 'sangeet', name: 'Sangeet', date: '11th December 2026 · Friday', art: moon, tint: '#F3E4EE',
      blurb: 'A night of song and dance as two families find one rhythm.' },
    { id: 'haldi', name: 'Haldi Carnival', date: '12th December 2026 · Saturday', art: sun, tint: '#FBF0D6',
      blurb: 'Turmeric, marigolds and plenty of colour. Come ready to get a little yellow.' },
    { id: 'wedding', name: 'Wedding', date: '12th December 2026 · Saturday', art: agni, tint: '#F8E2DD',
      blurb: 'Seven steps around the sacred fire, and a lifetime together begins.' },
  ],
  time: 'Timings to be announced',
  photos: [0, 3, 1, 8, 4, 2, 5, 7, 6, 9, 10],
  credit: 'Crafted by The Corporate Pot',
};
const photo = (i, s) => `/media/photos/p${String(i).padStart(2, '0')}-${s}.webp`;

// A blossom sprig drawn up the envelope's side: one stem, alternating leaves and five-petal flowers.
const sprig = () => {
  let b = '<path class="draw" d="M30 600 C14 520 46 450 28 370 S44 220 26 140 S36 40 30 0" />';
  for (let y = 560, i = 0; y > 20; y -= 46, i++) {
    const s = i % 2 ? 1 : -1, x = 30 + s * 2;
    b += `<path class="draw" d="M${x} ${y} q${s * 16} -6 ${s * 22} -22 q${-s * 14} 2 ${-s * 22} 22z" />`;
    if (i % 2 === 0) {
      const cx = 30 - s * 14, cy = y - 22;
      for (let k = 0; k < 5; k++) b += `<ellipse class="petal" cx="${cx}" cy="${cy - 5}" rx="3.6" ry="5.4" transform="rotate(${k * 72} ${cx} ${cy})" />`;
      b += `<circle class="fill" cx="${cx}" cy="${cy}" r="1.8" />`;
    }
  }
  return `<svg class="orn sprig" viewBox="0 0 60 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${b}</svg>`;
};
const garland = () => `<div class="garland">${Array.from({ length: 7 }, (_, i) => marigold(i % 2 ? 'g g--s' : 'g')).join('')}</div>`;

// ---------- markup ----------
const app = document.getElementById('app');
app.innerHTML = `
<section class="env">
  <div class="env__stick">
    <div class="env__inside">
      <img src="${C.mono}" alt="" />
      <p class="script env__names">${C.groom} <em>&amp;</em> ${C.bride}</p>
      <p class="caps sm">are getting married</p>
    </div>
    <div class="env__paper"></div>
    <div class="env__side env__side--l">${sprig()}</div>
    <div class="env__side env__side--r">${sprig()}</div>
    <div class="env__flap env__flap--b"><i></i></div>
    <div class="env__flap env__flap--t"><i></i><span class="env__flour">${rosette()}</span></div>
    <div class="env__seal">${seal(C.mono)}</div>
    <div class="env__cue"><span class="caps sm">Scroll down</span><span class="mouse"><i></i></span></div>
  </div>
</section>

<section class="sec std">
  <h2 class="caps title rv">Save the Date</h2>
  <div class="scratch rv">
    <div class="scratch__under">
      <span class="caps sm">${C.dateDay}</span>
      <b class="caps">${C.dateBig}</b>
      <span class="sm">${C.venue}</span>
    </div>
    <canvas aria-label="Scratch card: scratch to reveal the date"></canvas>
  </div>
  <p class="hint rv">Scratch the card to reveal</p>
</section>

<section class="sec inv">
  <div class="paper rv">
    ${kalash('inv__kalash')}
    <p class="deva" lang="hi">${C.invocation}</p>
    <p class="caps sm">With the divine blessings of</p>
    <p class="elders">${C.elders.join('<br>')}</p>
    <p class="hosts">${C.hosts}</p>
    <p class="req">${C.request}</p>
    <p class="script name">${C.bride}</p>
    <p class="with">with</p>
    <p class="script name">${C.groom}</p>
    <p class="par">(${C.groomParents})</p>
    ${garland()}
  </div>
  <p class="tagline rv">${C.tagline}</p>
</section>

<section class="sec evs">
  <header class="head rv"><h2 class="script">Events Schedule</h2><p class="sub">Two days of rituals, music and joy</p></header>
  ${C.events.map((e, i) => `
  <article class="ev rv ${i % 2 ? 'ev--r' : ''}" style="--tint:${e.tint}">
    <div class="ev__art">${e.art()}</div>
    <h3 class="script">${e.name}</h3>
    <p class="ev__blurb">${e.blurb}</p>
    <dl>
      <div><dt class="caps">Date</dt><dd>${e.date}</dd></div>
      <div><dt class="caps">Time</dt><dd>${C.time}</dd></div>
      <div><dt class="caps">Venue</dt><dd>${C.venue}, ${C.address}</dd></div>
    </dl>
    <a class="pill" href="${C.map}" target="_blank" rel="noopener">Tap for directions</a>
  </article>`).join('')}
</section>

<section class="sec mom">
  <header class="head rv"><h2 class="script">Special Moments</h2><p class="sub">A few frames from our story so far</p></header>
  <div class="mom__track rv">${C.photos.map((p, i) => `
    <figure class="frame" style="--r:${[-2.5, 2, -1.5, 3, -3, 1.5][i % 6]}deg"><img src="${photo(p, 'sm')}" srcset="${photo(p, 'sm')} 720w, ${photo(p, 'lg')} 1800w" sizes="80vw" alt="${C.groom} and ${C.bride}" loading="lazy" decoding="async" /></figure>`).join('')}
  </div>
  <div class="mom__nav rv"><button type="button" data-d="-1" aria-label="Previous photo">‹</button><span class="mom__n">01 / ${String(C.photos.length).padStart(2, '0')}</span><button type="button" data-d="1" aria-label="Next photo">›</button></div>
</section>

<section class="sec cd">
  <header class="head rv"><h2 class="script">Counting Down</h2><p class="sub">${C.dateDay}, 12th December 2026</p></header>
  <div class="cd__grid rv">${['Days', 'Hours', 'Minutes', 'Seconds'].map((l) => `<div class="cd__box"><b>00</b><span class="caps sm">${l}</span></div>`).join('')}</div>
</section>

<section class="sec rsvp">
  <form class="card rv" novalidate>
    <h2 class="caps title">RSVP</h2>
    <p class="caps sm note">This invitation is exclusively for you</p>
    <fieldset class="choice">
      <legend class="sr">Will you attend?</legend>
      <label><input type="radio" name="att" value="yes" checked /><span>Joyfully attending</span></label>
      <label><input type="radio" name="att" value="no" /><span>Regretfully declining</span></label>
    </fieldset>
    <label class="field"><span>Full name*</span><input name="name" autocomplete="name" placeholder="Your name" required minlength="2" maxlength="80" /></label>
    <label class="field"><span>Contact no.*</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91" required /></label>
    <input class="sr" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button class="pill pill--solid" type="submit">Submit</button>
    <p class="status" role="status" aria-live="polite"></p>
  </form>
</section>

<footer class="sec regards">
  ${rosette('regards__rose')}
  <h2 class="script rv">Regards</h2>
  <p class="rv">${C.families}</p>
  <p class="tag rv">${C.hashtag}</p>
  <p class="caps sm credit">${C.credit}</p>
</footer>`;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- smooth scroll ----------
const lenis = reduced ? null : new Lenis({ autoRaf: false });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- petals ----------
const cv = $('.petals'), ctx = cv.getContext('2d');
const PINKS = ['#F4B7C3', '#F7C9D2', '#EE9FB1', '#F9D8DE', '#E88CA2'];
let petals = [], W = 0, H = 0;
const dpr = Math.min(devicePixelRatio || 1, 2);
const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
const petal = (top) => ({
  x: Math.random() * W, y: top ? -20 - Math.random() * H * 0.3 : Math.random() * H,
  s: 4 + Math.random() * 6, vy: 0.35 + Math.random() * 0.7, sway: Math.random() * 6.28, sw: 0.4 + Math.random() * 0.8,
  rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.04, flip: Math.random() * 6.28, c: PINKS[(Math.random() * PINKS.length) | 0],
});
const burst = (n = 40) => { if (!reduced) for (let i = 0; i < n; i++) petals.push({ ...petal(true), vy: 1 + Math.random() * 1.6 }); };
size(); addEventListener('resize', size);
if (!reduced) {
  petals = Array.from({ length: W < 600 ? 26 : 44 }, () => petal(false));
  gsap.ticker.add(() => {
    ctx.clearRect(0, 0, W, H);
    petals = petals.filter((p, i) => {
      p.y += p.vy; p.sway += 0.012; p.x += Math.sin(p.sway) * p.sw; p.rot += p.vr; p.flip += 0.03;
      if (p.y > H + 20) { if (i >= 44) return false; Object.assign(p, petal(true)); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(p.flip), 1);
      ctx.fillStyle = p.c; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.5, p.s * 0.6, p.s * 0.8, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.6, p.s * 0.8, -p.s * 0.9, -p.s * 0.5, 0, -p.s);
      ctx.fill(); ctx.restore();
      return true;
    });
  });
}

// ---------- envelope: opens as you scroll ----------
const env = $('.env');
gsap.set('.env__inside', { autoAlpha: 0, scale: 0.92 });
gsap.from(['.env__seal', '.env__cue'], { autoAlpha: 0, y: 20, scale: 0.9, duration: 1.4, ease: 'power3.out', stagger: 0.25, delay: 0.3 });
gsap.timeline({ scrollTrigger: { trigger: env, start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.8 } })
  .to('.env__cue', { autoAlpha: 0, duration: 0.1 }, 0)
  .to('.env__seal', { scale: 1.25, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 0.05)
  .to('.env__flap--t', { yPercent: -105, duration: 0.6, ease: 'power2.inOut' }, 0.2)
  .to('.env__flap--b', { yPercent: 105, duration: 0.6, ease: 'power2.inOut' }, 0.2)
  .to('.env__side--l', { xPercent: -110, duration: 0.5 }, 0.3)
  .to('.env__side--r', { xPercent: 110, duration: 0.5 }, 0.3)
  .to('.env__paper', { autoAlpha: 0, duration: 0.4 }, 0.45)
  .to('.env__inside', { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 0.5)
  .add(() => {}, 1);
ScrollTrigger.create({ trigger: env, start: 'top+=25% top', once: true, onEnter: () => burst(50) });

// ---------- reveals ----------
$$('.rv').forEach((el) => {
  const x = el.classList.contains('ev') ? (el.classList.contains('ev--r') ? 40 : -40) : 0;
  gsap.from(el, { autoAlpha: 0, y: x ? 20 : 36, x, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
});
$$('.ev__art .draw, .inv__kalash .draw, .regards__rose .draw').forEach((p) => {
  const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: reduced ? 0 : l });
});
if (!reduced) $$('.ev__art, .inv__kalash, .regards__rose').forEach((svg) =>
  gsap.to($$('.draw', svg), { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.04, scrollTrigger: { trigger: svg, start: 'top 85%', once: true } }));

// ---------- scratch card ----------
{
  const wrap = $('.scratch'), c = $('canvas', wrap), g = c.getContext('2d');
  let ready = false, done = false, moves = 0;
  const paint = () => {
    const r = wrap.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const grd = g.createLinearGradient(0, 0, r.width, r.height);
    grd.addColorStop(0, '#7A2430'); grd.addColorStop(1, '#5A141E');
    g.globalCompositeOperation = 'source-over'; g.fillStyle = grd; g.fillRect(0, 0, r.width, r.height);
    g.strokeStyle = 'rgba(214,176,106,.55)'; g.lineWidth = 1; g.strokeRect(8.5, 8.5, r.width - 17, r.height - 17);
    g.fillStyle = '#E2C07D'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `${Math.round(r.width / 9)}px "Pinyon Script", cursive`;
    g.fillText('Scratch to reveal', r.width / 2, r.height / 2);
    ready = true;
  };
  document.fonts.ready.then(paint);
  const reveal = () => {
    done = true;
    gsap.to(c, { autoAlpha: 0, duration: 0.8, onComplete: () => c.remove() });
    gsap.fromTo('.scratch__under b', { scale: 0.9 }, { scale: 1, duration: 1, ease: 'back.out(2)' });
    $('.hint').textContent = 'See you there!';
    burst(70);
  };
  const cleared = () => {
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, t = 0;
    for (let i = 3; i < d.length; i += 64) { t++; if (d[i] === 0) n++; }
    return n / t;
  };
  const scratch = (e) => {
    if (!ready || done) return;
    const r = c.getBoundingClientRect();
    g.globalCompositeOperation = 'destination-out';
    g.beginPath(); g.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, 7); g.fill();
    if (++moves % 12 === 0 && cleared() > 0.45) reveal();
  };
  let down = false;
  c.addEventListener('pointerdown', (e) => { down = true; try { c.setPointerCapture(e.pointerId); } catch {} scratch(e); });
  c.addEventListener('pointermove', (e) => { if (down) scratch(e); });
  addEventListener('pointerup', () => { down = false; });
  c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') reveal(); });
  c.tabIndex = 0;
}

// ---------- special moments: swipe track + arrows ----------
{
  const track = $('.mom__track'), frames = $$('.frame', track), n = $('.mom__n');
  const total = String(frames.length).padStart(2, '0');
  const current = () => Math.round(track.scrollLeft / (frames[1].offsetLeft - frames[0].offsetLeft));
  track.addEventListener('scroll', () => { n.textContent = `${String(current() + 1).padStart(2, '0')} / ${total}`; }, { passive: true });
  $$('.mom__nav button').forEach((b) => b.addEventListener('click', () => {
    const i = Math.max(0, Math.min(frames.length - 1, current() + +b.dataset.d));
    track.scrollTo({ left: frames[i].offsetLeft - frames[0].offsetLeft, behavior: 'smooth' });
  }));
}

// ---------- countdown ----------
{
  const boxes = $$('.cd__box b'), end = new Date(C.wedding).getTime();
  const tick = () => {
    const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60]
      .forEach((v, i) => { boxes[i].textContent = String(v).padStart(2, '0'); });
  };
  tick(); setInterval(tick, 1000);
}

// ---------- RSVP: POST /api/rsvp (Pages Function -> KV) ----------
{
  const f = $('.rsvp form'), status = $('.status', f), btn = $('button', f);
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = f.name.value.trim(), phone = f.phone.value.replace(/\D/g, '');
    if (name.length < 2) { status.textContent = 'Please enter your full name.'; return f.name.focus(); }
    if (phone.length < 10 || phone.length > 13) { status.textContent = 'Please enter a valid contact number.'; return f.phone.focus(); }
    const attending = f.att.value === 'yes';
    btn.disabled = true; status.textContent = 'Sending…';
    try {
      const r = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, phone, attending, guests: 1, events: [], website: f.website.value }),
      });
      if (!r.ok) throw new Error(r.status);
      status.textContent = attending ? 'Thank you! We can’t wait to celebrate with you.' : 'Thank you for letting us know. You’ll be missed!';
      f.reset(); if (attending) burst(60);
    } catch {
      status.textContent = 'Sorry, that didn’t go through. Please try again.';
    } finally { btn.disabled = false; }
  });
}

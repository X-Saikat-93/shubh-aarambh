// Kindly respond — a handwritten-reply card that folds into a sealed envelope on send.
import { gsap, reduced, EASE, sectionHead, fadeUp, magnetic } from '../lib/motion.js';
import { seal, lotus } from '../lib/ornaments.js';

const KEY = 'ka-rsvp-v2';
const store = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode */ } },
};

// 10-digit Indian mobile, tolerating +91 / 91 / 0 prefixes and spaces.
function normPhone(v) {
  let d = String(v).replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : '';
}

const field = (id, label, extra = '', tag = 'input') => `
  <div class="rs__f" data-f="${id}">
    ${tag === 'input'
      ? `<input class="rs__in" id="rs-${id}" name="${id}" placeholder=" " ${extra} />`
      : `<textarea class="rs__in" id="rs-${id}" name="${id}" placeholder=" " rows="2" ${extra}></textarea>`}
    <label for="rs-${id}">${label}</label><i class="rs__line" aria-hidden="true"></i>
    <p class="rs__err" id="rs-${id}-err" role="alert"></p>
  </div>`;

export default function init({ root, config }) {
  const { events, couple } = config;
  root.innerHTML = `
    <div class="wrap rs">
      <div class="sec-head">
        <p class="label">Kindly respond</p>
        <h2 class="h2">Will you <em>join us?</em></h2>
        <p class="lede">${config.rsvp.note}</p>
      </div>
      <div class="rs__stage">
        <form class="rs__card" novalidate>
          <span class="rs__lotus" aria-hidden="true">${lotus()}</span>
          <fieldset class="rs__choice">
            <legend class="label">Your reply</legend>
            <label><input type="radio" name="attending" value="yes" /><span><em>Joyfully</em> accepts</span></label>
            <label><input type="radio" name="attending" value="no" /><span><em>Regretfully</em> declines</span></label>
            <p class="rs__err" id="rs-attending-err" role="alert"></p>
          </fieldset>
          ${field('name', 'Full name', 'autocomplete="name" required aria-describedby="rs-name-err"')}
          ${field('phone', 'Contact number', 'type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="rs-phone-err"')}
          <div class="rs__more" hidden>
            <div class="rs__more-in">
              <div class="rs__guests">
                <span class="label" id="rs-g">Guests</span>
                <div class="rs__step" role="group" aria-labelledby="rs-g">
                  <button type="button" data-step="-1" aria-label="One fewer guest">&minus;</button>
                  <output class="rs__count" aria-live="polite">1</output>
                  <button type="button" data-step="1" aria-label="One more guest">+</button>
                </div>
              </div>
              <fieldset class="rs__events">
                <legend class="label">Joining us for</legend>
                ${events.map((e) => `<label class="rs__chip"><input type="checkbox" name="events" value="${e.id}" checked /><span>${e.name}<small>${e.short}</small></span></label>`).join('')}
              </fieldset>
            </div>
          </div>
          ${field('message', 'A blessing or note (optional)', 'maxlength="500" autocomplete="off"', 'textarea')}
          <div class="rs__hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off" /></label></div>
          <div class="rs__fail" hidden role="alert">
            <p>We couldn't send that just now. Please try again, or send it to us directly.</p>
            <a class="link" data-wa target="_blank" rel="noopener">Send via WhatsApp</a>
          </div>
          <button class="btn btn--solid rs__send" type="submit"><span>Send with love</span></button>
        </form>

        <div class="rs__done" hidden inert>
          <div class="rs__env" aria-hidden="true">
            <div class="rs__env-back"></div>
            <div class="rs__env-letter"><span class="script">K &amp; A</span></div>
            <div class="rs__env-front"></div>
            <div class="rs__env-flap"></div>
            <div class="rs__seal">${seal(couple.monogram)}</div>
          </div>
          <div class="rs__thanks" tabindex="-1">
            <h3 class="script rs__t"></h3>
            <p class="rs__p"></p>
            <button class="link rs__edit" type="button">Edit response</button>
          </div>
        </div>
      </div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const form = $('.rs__card'), stage = $('.rs__stage'), done = $('.rs__done');
  const more = $('.rs__more'), count = $('.rs__count'), fail = $('.rs__fail'), send = $('.rs__send');
  let guests = 1;
  const att = () => form.querySelector('[name=attending]:checked')?.value;

  sectionHead($('.sec-head'));
  fadeUp(form, { trigger: stage, y: 60, start: 'top 88%' });
  magnetic(send, 0.25);

  // Inline validation message with a soft drop-in.
  function setErr(id, msg) {
    const p = $(`#rs-${id}-err`);
    const f = p.closest('.rs__f') || p.closest('fieldset');
    const el = form.elements[id];
    if (el && el.setAttribute) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    f.classList.toggle('is-bad', !!msg);
    if (p.textContent === (msg || '')) return;
    p.textContent = msg || '';
    if (msg && !reduced) gsap.fromTo(p, { y: -6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE.out });
  }

  // Height-animate the conditional panel (attending only).
  function toggleMore(show) {
    if (!show && more.hidden) return;
    more.hidden = false;
    more.querySelectorAll('input,button').forEach((n) => (n.disabled = !show));
    if (reduced) { more.hidden = !show; return; }
    gsap.to(more, { height: show ? 'auto' : 0, autoAlpha: show ? 1 : 0, duration: 0.9, ease: EASE.out, onComplete: () => { more.hidden = !show; } });
  }
  gsap.set(more, { height: 0, autoAlpha: 0 });

  form.addEventListener('change', (e) => {
    if (e.target.name === 'attending') { setErr('attending'); toggleMore(e.target.value === 'yes'); }
  });
  form.addEventListener('input', (e) => { if (e.target.name === 'name' || e.target.name === 'phone') setErr(e.target.name); });
  form.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    guests = Math.min(10, Math.max(1, guests + Number(b.dataset.step)));
    count.textContent = guests;
    if (!reduced) gsap.fromTo(count, { y: b.dataset.step > 0 ? 10 : -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE.out });
  });
  form.elements.phone.addEventListener('blur', (e) => { const n = normPhone(e.target.value); if (n) e.target.value = n; });

  function validate() {
    const bad = [];
    if (!att()) bad.push(['attending', 'Please let us know if you can join.']);
    if (form.elements.name.value.trim().length < 2) bad.push(['name', 'Please write your full name.']);
    if (!normPhone(form.elements.phone.value)) bad.push(['phone', 'Enter a 10-digit mobile number (+91 is fine).']);
    ['attending', 'name', 'phone'].forEach((k) => setErr(k, bad.find((b) => b[0] === k)?.[1]));
    if (bad.length) (form.elements[bad[0][0]]?.focus ? form.elements[bad[0][0]] : form.querySelector('[name=attending]')).focus();
    return !bad.length;
  }

  const payload = () => ({
    name: form.elements.name.value.trim(),
    phone: normPhone(form.elements.phone.value),
    attending: att() === 'yes',
    guests: att() === 'yes' ? guests : 1,
    events: att() === 'yes' ? [...form.querySelectorAll('[name=events]:checked')].map((c) => c.value) : [],
    message: form.elements.message.value.trim(),
    website: form.elements.website.value,
  });

  function waLink(p) {
    const ev = p.events.map((id) => events.find((e) => e.id === id)?.name).filter(Boolean).join(', ');
    const t = [`RSVP - ${couple.groom} & ${couple.bride}'s Wedding`, `Name: ${p.name}`, `Contact: ${p.phone}`,
      p.attending ? `Attending: Yes (${p.guests} guest${p.guests > 1 ? 's' : ''})` : 'Attending: Regretfully cannot make it',
      ev && `Events: ${ev}`, p.message && `Message: ${p.message}`].filter(Boolean).join('\n');
    return 'https://wa.me/?text=' + encodeURIComponent(t);
  }

  // Thank-you state. animate=true plays the fold: card shrinks into the envelope, flap closes, seal stamps.
  function showThanks(p, animate) {
    const first = p.name.split(/\s+/)[0];
    $('.rs__t').textContent = `Thank you, ${first}`;
    $('.rs__p').textContent = p.attending
      ? "We can't wait to celebrate with you."
      : "We'll miss you dearly, and carry your blessings with us.";
    const env = $('.rs__env'), flap = $('.rs__env-flap'), letter = $('.rs__env-letter'), sl = $('.rs__seal');
    const text = [$('.rs__t'), $('.rs__p'), $('.rs__edit')];
    done.hidden = false;
    form.inert = true;
    const h0 = stage.offsetHeight;

    const finish = () => { form.hidden = true; done.inert = false; $('.rs__thanks').focus({ preventScroll: true }); };
    if (!animate || reduced) {
      gsap.set(flap, { rotationX: 0 }); gsap.set(letter, { yPercent: 0 }); gsap.set(sl, { scale: 1, autoAlpha: 1 }); gsap.set(text, { autoAlpha: 1, y: 0 });
      return finish();
    }
    gsap.set(env, { autoAlpha: 0, scale: 0.9 });
    gsap.set(flap, { rotationX: 180, zIndex: 0 });
    gsap.set(letter, { yPercent: -70 });
    gsap.set(sl, { scale: 3, autoAlpha: 0, y: -40 });
    gsap.set(text, { autoAlpha: 0, y: 24 });
    const d = gsap.timeline({ defaults: { ease: EASE.out } });
    d.to(form, { scale: 0.62, y: -30, rotationX: 22, autoAlpha: 0, duration: 1.1, ease: 'power3.inOut', transformPerspective: 900, transformOrigin: '50% 40%' })
      .to(env, { autoAlpha: 1, scale: 1, duration: 1 }, 0.5)
      .add(() => { form.hidden = true; gsap.fromTo(stage, { height: h0 }, { height: 'auto', duration: 0.9, ease: EASE.silk, clearProps: 'height' }); }, 1.1)
      .to(letter, { yPercent: 0, duration: 1.1, ease: 'power3.inOut' }, 1.2)
      .to(flap, { rotationX: 0, duration: 1.1, ease: 'power3.inOut' }, 2.1)
      .set(flap, { zIndex: 4 }, 2.65)
      // seal: drop, squash, settle
      .to(sl, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.in' }, 3.1)
      .to(sl, { scaleY: 0.82, scaleX: 1.12, duration: 0.12, ease: 'power2.out' })
      .to(sl, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1, .4)' })
      .to(text, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1.1 }, '-=0.5')
      .add(finish, '-=0.8');
  }

  function editResponse(p) {
    form.elements.name.value = p.name;
    form.elements.phone.value = p.phone;
    form.elements.message.value = p.message || '';
    form.querySelector(`[name=attending][value=${p.attending ? 'yes' : 'no'}]`).checked = true;
    guests = p.guests || 1; count.textContent = guests;
    form.querySelectorAll('[name=events]').forEach((c) => (c.checked = (p.events || []).includes(c.value)));
    toggleMore(p.attending);
    done.inert = true; done.hidden = true;
    form.hidden = false; form.inert = false;
    gsap.set(form, { clearProps: 'all' });
    fadeUp(form, { trigger: stage, y: 30 });
    send.disabled = false; send.classList.remove('is-loading');
    form.elements.name.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    fail.hidden = true;
    if (!validate()) return;
    const p = payload();
    send.disabled = true; send.classList.add('is-loading');
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 12000);
      const res = await fetch(config.rsvp.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(p), signal: ctl.signal });
      clearTimeout(to);
      if (!res.ok) throw new Error(res.status);
      delete p.website;
      store.set(p);
      showThanks(p, true);
    } catch {
      $('[data-wa]').href = waLink(p);
      fail.hidden = false;
      if (!reduced) gsap.from(fail, { y: 12, autoAlpha: 0, duration: 0.8, ease: EASE.out });
      send.disabled = false; send.classList.remove('is-loading');
    }
  });

  $('.rs__edit').addEventListener('click', () => { const p = store.get(); if (p) editResponse(p); });

  const prev = store.get();
  if (prev?.name) { showThanks(prev, false); }
}

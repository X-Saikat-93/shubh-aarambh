// Cloudflare Pages Function: POST /api/rsvp -> KV binding `RSVP`.
const EVENTS = ['haldi', 'sangeet', 'wedding'];
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  if (!env.RSVP) return json({ ok: false, error: 'RSVP storage is not configured' }, 503);

  let b;
  try { b = await request.json(); } catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }
  if (!b || typeof b !== 'object') return json({ ok: false, error: 'Invalid body' }, 400);

  if (b.website) return json({ ok: true }); // honeypot: pretend success, store nothing

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const phone = typeof b.phone === 'string' || typeof b.phone === 'number' ? String(b.phone).replace(/\D/g, '') : '';
  const message = b.message == null ? '' : b.message;
  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push('name');
  if (phone.length < 10 || phone.length > 13) errors.push('phone');
  if (typeof b.attending !== 'boolean') errors.push('attending');
  let guests = 1, events = [];
  if (b.attending === true) {
    guests = b.guests;
    if (!Number.isInteger(guests) || guests < 1 || guests > 10) errors.push('guests');
    events = b.events ?? [];
    if (!Array.isArray(events) || !events.every((e) => EVENTS.includes(e))) errors.push('events');
  }
  if (typeof message !== 'string' || message.length > 500) errors.push('message');
  if (errors.length) return json({ ok: false, error: 'Invalid fields', fields: errors }, 400);

  const now = Date.now();
  const record = {
    name, phone, attending: b.attending, guests, events: [...new Set(events)], message: message.trim(),
    timestamp: new Date(now).toISOString(), country: request.cf?.country || null,
  };
  await env.RSVP.put(`rsvp:${now}:${phone}`, JSON.stringify(record));
  return json({ ok: true });
}

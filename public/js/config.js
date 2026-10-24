// Single source of truth for every word, date and link on the invite.
export const CONFIG = {
  couple: { bride: 'Anika', groom: 'Krish', monogram: ['K', 'A'] },
  families: 'Malhotra & Mehta',
  invocation: { deva: '॥ श्री गणेशाय नमः ॥', latin: 'Shri Ganeshaya Namah' },
  tagline: 'A sacred union of hearts, families, and traditions as we begin our forever.',
  // Formal invitation wording (The Letter section).
  letter: [
    'Together with their families,',
    'the Malhotras & the Mehtas',
    'request the honour of your presence',
    'as their children',
  ],
  // Countdown target = wedding start (IST).
  weddingISO: '2026-11-27T16:00:00+05:30',
  dateLabel: '27 · 11 · 2026',
  venue: {
    name: 'Radisson Hotel',
    city: 'Zirakpur, Punjab',
    address: 'Patiala Road, Village Nabha, Green Enclave Road, Zirakpur, Punjab',
    map: 'https://maps.app.goo.gl/mizirRQuE7iddZYk6',
    embed: 'https://www.google.com/maps?q=Radisson+Hotel+Zirakpur+Patiala+Road&output=embed',
  },
  // Each event is a "scene"; `theme` maps to a palette in main.js THEMES.
  events: [
    {
      id: 'haldi',
      name: 'Haldi Carnival',
      date: '26th November 2026',
      short: '26 Nov',
      day: 'Thursday',
      time: '10 AM onwards',
      hour: 'Morning',
      blurb: 'A vibrant morning of haldi, laughter, and blessings to brighten the celebrations.',
      theme: 'haldi',
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      date: '26th November 2026',
      short: '26 Nov',
      day: 'Thursday',
      time: '7 PM onwards',
      hour: 'Evening',
      blurb: 'An evening of music, dance and celebration to kick off the wedding festivities.',
      theme: 'sangeet',
    },
    {
      id: 'wedding',
      name: 'Wedding',
      date: '27th November 2026',
      short: '27 Nov',
      day: 'Friday',
      time: '4 PM onwards',
      hour: 'Dusk',
      blurb: 'Under the canopy of blessings, two souls become one — join us as we take our pheras.',
      theme: 'wedding',
    },
  ],
  // Our-story chapters (photo index refers to /media/photos/pNN-*.webp).
  story: [
    { photo: 0, numeral: 'I', title: 'Two paths', text: 'Somewhere between ordinary days and unplanned conversations, two strangers became each other’s favourite place.' },
    { photo: 3, numeral: 'II', title: 'One heartbeat', text: 'Laughter turned into comfort, comfort turned into home — and home turned into forever.' },
    { photo: 8, numeral: 'III', title: 'Forever begins', text: 'With the blessings of both our families, we are ready to write the rest of our story — together.' },
  ],
  // Saat Phere — the seven vows taken around the sacred fire (our own wording of the traditional meanings).
  vows: [
    { n: 'Pehla', title: 'Nourishment', text: 'We promise to nourish and care for each other, and for the home we build together.' },
    { n: 'Doosra', title: 'Strength', text: 'We promise to grow strong together — in body, in mind and in spirit.' },
    { n: 'Teesra', title: 'Prosperity', text: 'We promise to work side by side and share every blessing honestly.' },
    { n: 'Chautha', title: 'Family', text: 'We promise to honour and love each other’s families as our own.' },
    { n: 'Paanchva', title: 'Joy', text: 'We promise to fill our days with kindness, laughter and little celebrations.' },
    { n: 'Chhatha', title: 'Togetherness', text: 'We promise to walk together through every season of life.' },
    { n: 'Saatvan', title: 'Friendship', text: 'We promise to remain best friends and companions — for this life and beyond.' },
  ],
  gallery: [1, 2, 4, 5, 6, 7, 9, 10],
  gallerySubtitle: 'Little glimpses of us, captured between laughter, love and everything in between.',
  rsvp: {
    note: 'This invitation is exclusively for you',
    endpoint: '/api/rsvp',
  },
  credit: { label: 'Crafted by The Corporate Pot', url: '' },
};

// Photo orientation lookup (portrait unless listed) so layouts can reserve space.
export const LANDSCAPE = new Set([7, 8]);
export const photo = (i, size = 'lg') => `/media/photos/p${String(i).padStart(2, '0')}-${size}.webp`;

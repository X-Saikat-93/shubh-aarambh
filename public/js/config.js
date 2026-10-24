// Single source of truth for every word, date and link on the invite.
export const CONFIG = {
  couple: {
    groom: 'Garv', bride: 'Kaavya',
    groomFull: 'Garv Garg', brideFull: 'Kaavya Chandalia',
    monogram: '/media/monogram.png', // the couple's G & K logo (gold, transparent)
  },
  families: 'Chandalia & Garg',
  hashtag: '#kaarvinlove',
  invocation: { deva: '॥ श्री गणेशाय नमः ॥', latin: 'Shri Ganeshaya Namah' },
  tagline: 'A sacred union of hearts, families, and traditions as we begin our forever.',

  // The Letter — traditional bride-side wording.
  letter: {
    blessingLabel: 'With the divine blessings of',
    blessings: ['Lt. Shri Laxmipat Singh Chandalia', 'Lt. Smt. Bhiki Devi Chandalia'],
    hosts: 'Smt. Sunita & Shri Rakesh Kumar Chandalia',
    request: 'request the honour of your gracious presence at the wedding of their beloved daughter',
    joiner: 'with',
    groomParents: 'son of Smt. Kavita & Shri Sanjay Garg',
    groomBlessings: [], // groom's grandparents — to be shared; add names here and they appear automatically
  },

  // Countdown target. Timings are not announced yet, so this counts to the wedding day itself (IST).
  weddingISO: '2026-12-12T00:00:00+05:30',
  dateLine: '11 & 12 December 2026',
  dateLabel: '12 · 12 · 2026',

  venue: {
    name: 'Sher Bengal River Resort',
    place: 'Kolaghat',
    city: 'Kolaghat, West Bengal',
    address: 'Kolaghat, Purba Medinipur, West Bengal',
    map: 'https://share.google/ondJkXiFkBXDm8Jhc',
    embed: 'https://www.google.com/maps?q=Sher+Bengal+River+Resort+Kolaghat&output=embed',
  },

  // Each event is a "scene"; `theme` maps to a palette in main.js THEMES.
  // `hour` is the large decorative word behind each scene.
  events: [
    {
      id: 'mayra', name: 'Mayra', date: '11th December 2026', short: '11 Dec', day: 'Friday',
      time: 'Timings to be announced', hour: 'Ashirwad',
      blurb: 'The maternal family arrives with gifts and heartfelt blessings — a cherished tradition that opens the celebrations.',
      theme: 'mayra',
    },
    {
      id: 'sangeet', name: 'Sangeet', date: '11th December 2026', short: '11 Dec', day: 'Friday',
      time: 'Timings to be announced', hour: 'Sur',
      blurb: 'An evening of music, dance and celebration as both families come together.',
      theme: 'sangeet',
    },
    {
      id: 'haldi', name: 'Haldi Carnival', date: '12th December 2026', short: '12 Dec', day: 'Saturday',
      time: 'Timings to be announced', hour: 'Rang',
      blurb: 'A vibrant celebration of haldi, laughter, and blessings to brighten the big day.',
      theme: 'haldi',
    },
    {
      id: 'wedding', name: 'Wedding', date: '12th December 2026', short: '12 Dec', day: 'Saturday',
      time: 'Timings to be announced', hour: 'Vivah',
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

// Hand-drawn inline SVG line art — no third-party artwork. Every stroke has class
// "draw" so motion.drawSVG() can animate it; colour comes from currentColor (.orn → var(--accent)).

const svg = (cls, vb, body) => `<svg class="orn ${cls}" viewBox="${vb}" aria-hidden="true">${body}</svg>`;

/** Hairline rule with a central diamond. */
export const rule = (cls = '') => svg(`rule ${cls}`, '0 0 240 16', `
  <path class="draw" d="M2 8 H104" /><path class="draw" d="M136 8 H238" />
  <path class="draw" d="M120 1 L127 8 L120 15 L113 8 Z" />
  <circle class="fill" cx="108" cy="8" r="1.4" /><circle class="fill" cx="132" cy="8" r="1.4" />`);
export const divider = rule; // legacy alias

/** Temple-door arch (mandir dwar) with a pointed shikhara crown. viewBox 200x300; stretch with preserveAspectRatio="none". */
export const arch = (cls = '') => `<svg class="orn arch ${cls}" viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
  <path class="draw" d="M4 298 V110 C4 70 40 44 70 34 C84 28 94 18 100 4 C106 18 116 28 130 34 C160 44 196 70 196 110 V298" />
  <path class="draw" d="M14 298 V114 C14 80 46 56 74 46 C86 41 95 32 100 20 C105 32 114 41 126 46 C154 56 186 80 186 114 V298" />
</svg>`;

/** Mango leaf (aam patta) — strung into the toran. */
export const leaf = (cls = '') => svg(`leaf ${cls}`, '0 0 40 100', `
  <path class="draw" d="M20 2 C34 20 38 52 30 76 C26 88 22 94 20 98 C18 94 14 88 10 76 C2 52 6 20 20 2 Z" />
  <path class="draw" d="M20 8 V96 M20 30 L28 24 M20 46 L30 38 M20 62 L29 54 M20 38 L12 32 M20 54 L10 46 M20 70 L11 62" />`);

/** Kalash with coconut and mango leaves. */
export const kalash = (cls = '') => svg(`kalash ${cls}`, '0 0 120 140', `
  <path class="draw" d="M36 70 C20 84 22 116 44 128 H76 C98 116 100 84 84 70 Z" />
  <path class="draw" d="M40 70 H80 M44 64 H76 V70 M44 64 C44 58 76 58 76 64" />
  <path class="draw" d="M60 30 C72 30 78 40 76 50 C74 58 66 60 60 60 C54 60 46 58 44 50 C42 40 48 30 60 30 Z" />
  <path class="draw" d="M44 56 C30 50 22 38 20 26 C32 30 42 42 46 54 M76 56 C90 50 98 38 100 26 C88 30 78 42 74 54" />
  <path class="draw" d="M40 98 H80 M42 106 H78" /><circle class="draw" cx="60" cy="88" r="6" />
  <path class="draw" d="M44 128 L40 136 H80 L76 128" />`);

/** Om (drawn as strokes for animation; also usable as a crest). */
export const om = (cls = '') => svg(`om ${cls}`, '0 0 120 120', `
  <path class="draw" d="M22 44 C30 32 52 32 54 46 C56 58 44 62 36 62 C50 62 60 70 58 84 C56 98 36 102 24 92" />
  <path class="draw" d="M54 66 C64 56 82 56 88 70 C94 84 88 100 74 102 C64 104 58 96 60 88" />
  <path class="draw" d="M70 30 C80 36 92 36 100 28" />
  <path class="draw" d="M84 14 C88 18 92 18 96 14" /><circle class="fill" cx="90" cy="20" r="2.4" />`);

/** Diya (oil lamp) with flame. */
export const diya = (cls = '') => svg(`diya ${cls}`, '0 0 120 90', `
  <path class="draw" d="M8 52 C24 78 96 78 112 52 C90 60 30 60 8 52 Z" />
  <path class="draw" d="M98 54 C104 50 110 50 114 46" />
  <path class="draw" d="M60 8 C68 22 72 30 70 38 C68 46 52 46 50 38 C48 30 54 22 60 8 Z" />
  <path class="draw" d="M60 24 C63 30 64 34 62 38 C60 41 58 38 58 36 C57 32 58 28 60 24 Z" />
  <path class="draw" d="M44 80 H76" />`);

/** Toran: a scalloped marigold garland with hanging mango leaves. Returns the svg; width fills its box. */
export const toran = (cls = '', n = 9) => {
  const w = 1200, step = w / n;
  let body = `<path class="draw" d="M0 12 H${w}" />`;
  for (let i = 0; i < n; i++) {
    const x = i * step, cx = x + step / 2;
    body += `<path class="draw" d="M${x} 14 Q${cx} 70 ${x + step} 14" />`;
    for (let k = 1; k < 8; k++) {
      const t = k / 8, bx = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t * t * (x + step), by = (1 - t) ** 2 * 14 + 2 * (1 - t) * t * 70 + t * t * 14;
      body += `<circle class="draw bead" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="5" />`;
    }
    body += `<g class="drop" transform="translate(${cx - 10} 44)"><path class="draw" d="M10 0 C20 12 22 34 16 48 C14 54 12 58 10 60 C8 58 6 54 4 48 C-2 34 0 12 10 0 Z" /><path class="draw" d="M10 4 V58" /></g>`;
  }
  return `<svg class="orn toran ${cls}" viewBox="0 0 ${w} 110" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${body}</svg>`;
};
export const cypress = leaf; // legacy alias

/** Peacock feather. */
export const feather = (cls = '') => svg(`feather ${cls}`, '0 0 80 200', `
  <path class="draw" d="M40 196 C40 150 40 110 40 60" />
  <path class="draw" d="M40 8 C60 14 70 34 66 52 C62 70 50 78 40 78 C30 78 18 70 14 52 C10 34 20 14 40 8 Z" />
  <path class="draw" d="M40 24 C52 28 56 40 54 50 C52 60 46 64 40 64 C34 64 28 60 26 50 C24 40 28 28 40 24 Z" />
  <ellipse class="draw" cx="40" cy="46" rx="7" ry="10" />
  <path class="draw" d="M40 90 C26 96 18 104 12 116 M40 104 C28 110 20 120 16 132 M40 120 C30 126 24 136 22 148 M40 90 C54 96 62 104 68 116 M40 104 C52 110 60 120 64 132 M40 120 C50 126 56 136 58 148" />`);

/** Marigold bloom (haldi). */
export const marigold = (cls = '') => {
  let petals = '';
  for (let i = 0; i < 12; i++) petals += `<path class="draw" transform="rotate(${i * 30} 50 50)" d="M50 50 C44 38 44 22 50 12 C56 22 56 38 50 50 Z" />`;
  for (let i = 0; i < 12; i++) petals += `<path class="draw" transform="rotate(${i * 30 + 15} 50 50)" d="M50 50 C46 42 46 32 50 26 C54 32 54 42 50 50 Z" />`;
  return svg(`marigold ${cls}`, '0 0 100 100', `${petals}<circle class="draw" cx="50" cy="50" r="6" />`);
};

/** Radiant sun (morning). */
export const sun = (cls = '') => {
  let rays = '';
  for (let i = 0; i < 24; i++) rays += `<path class="draw" transform="rotate(${i * 15} 60 60)" d="M60 ${i % 2 ? 18 : 8} V30" />`;
  return svg(`sun ${cls}`, '0 0 120 120', `<circle class="draw" cx="60" cy="60" r="24" /><circle class="draw" cx="60" cy="60" r="18" />${rays}`);
};

/** Crescent moon with stars (evening). */
export const moon = (cls = '') => svg(`moon ${cls}`, '0 0 120 120', `
  <path class="draw" d="M74 16 C50 22 36 44 40 68 C44 92 66 106 90 102 C76 112 52 112 36 98 C18 82 16 54 30 36 C40 22 56 14 74 16 Z" />
  <path class="draw" d="M96 30 L98 36 L104 38 L98 40 L96 46 L94 40 L88 38 L94 36 Z" />
  <path class="draw" d="M84 60 L85 63 L88 64 L85 65 L84 68 L83 65 L80 64 L83 63 Z" />`);

/** Sacred fire / diya (wedding pheras). */
export const agni = (cls = '') => svg(`agni ${cls}`, '0 0 120 120', `
  <path class="draw" d="M60 14 C70 32 82 40 80 60 C78 76 70 82 60 82 C50 82 42 76 40 60 C38 44 50 38 52 26 C56 34 58 40 60 42 C62 32 62 22 60 14 Z" />
  <path class="draw" d="M60 50 C66 58 68 64 66 70 C64 76 56 76 54 70 C52 64 56 58 60 50 Z" />
  <path class="draw" d="M22 86 C40 100 80 100 98 86 M30 86 H90" />
  <path class="draw" d="M34 96 L28 112 M86 96 L92 112 M60 100 V114" />`);

/** Paisley (buta): teardrop body with a hooked tip, inner contour, a small bloom and a bead border. */
export const paisley = (cls = '') => {
  let beads = '';
  [[22, 96], [15, 84], [13, 71], [17, 59], [25, 49], [34, 41], [42, 33], [62, 44], [65, 58], [64, 72], [59, 86], [50, 98]]
    .forEach(([x, y]) => (beads += `<circle class="fill" cx="${x}" cy="${y}" r="1.3" />`));
  let bloom = '';
  for (let i = 0; i < 6; i++) bloom += `<path class="draw" transform="rotate(${i * 60} 38 78)" d="M38 78 C35 73 35 69 38 66 C41 69 41 73 38 78 Z" />`;
  return svg(`paisley ${cls}`, '0 0 80 120', `
  <path class="draw" d="M36 116 C14 114 3 96 6 76 C9 56 26 46 38 32 C46 23 48 13 42 5 C58 4 70 18 68 36 C76 54 76 78 68 94 C61 108 50 116 36 116 Z" />
  <path class="draw" d="M37 106 C22 105 14 93 16 79 C18 64 31 56 40 45 C52 54 60 67 58 82 C56 96 48 106 37 106 Z" />
  <path class="draw" d="M42 5 C38 12 40 18 46 20" />
  ${bloom}<circle class="draw" cx="38" cy="78" r="2.6" />${beads}`);
};

/** Carved lotus-mandala rosette (door panels, medallions). */
export const rosette = (cls = '') => {
  let petals = '';
  for (let i = 0; i < 8; i++) petals += `<path class="draw" transform="rotate(${i * 45} 60 60)" d="M60 31 C52 23 52 13 60 8 C68 13 68 23 60 31 Z" />`;
  for (let i = 0; i < 8; i++) petals += `<path class="draw" transform="rotate(${i * 45 + 22.5} 60 60)" d="M60 50 C55 44 55 37 60 33 C65 37 65 44 60 50 Z" />`;
  let dots = '';
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dots += `<circle class="fill" cx="${(60 + Math.cos(a) * 55).toFixed(1)}" cy="${(60 + Math.sin(a) * 55).toFixed(1)}" r="1.1" />`; }
  return svg(`rosette ${cls}`, '0 0 120 120', `
  <circle class="draw" cx="60" cy="60" r="58" /><circle class="draw" cx="60" cy="60" r="31" /><circle class="draw" cx="60" cy="60" r="9" />
  ${petals}${dots}<circle class="fill" cx="60" cy="60" r="3" />`);
};

/** Long botanical vine to run along a path; the main stroke has class "vine". */
export const vine = (cls = '') => svg(`vine ${cls}`, '0 0 1200 200', `
  <path class="draw vine" d="M0 120 C150 40 250 180 400 110 S650 30 800 100 S1050 170 1200 80" />
  <path class="draw" d="M200 104 C210 80 232 74 244 82 C236 98 220 106 200 104 Z" />
  <path class="draw" d="M520 84 C512 60 524 44 540 42 C544 60 536 76 520 84 Z" />
  <path class="draw" d="M760 102 C780 84 804 84 812 96 C798 108 778 110 760 102 Z" />
  <path class="draw" d="M1000 128 C996 104 1010 90 1026 90 C1028 108 1018 122 1000 128 Z" />
  <circle class="draw" cx="400" cy="110" r="5" /><circle class="draw" cx="800" cy="100" r="5" />`);

/** Corner flourish – mirror with CSS transforms. */
export const corner = (cls = '') => svg(`corner ${cls}`, '0 0 120 120', `
  <path class="draw" d="M4 116 V40 C4 18 18 4 40 4 H116" />
  <path class="draw" d="M14 116 V46 C14 28 28 14 46 14 H116" />
  <path class="draw" d="M30 30 C44 30 52 40 48 52 C44 62 30 60 30 50 C30 42 40 40 42 46" />
  <circle class="fill" cx="30" cy="30" r="2.2" />`);

/** Lotus crest. */
export const lotus = (cls = '') => svg(`lotus ${cls}`, '0 0 120 70', `
  <path class="draw" d="M60 66 C46 52 46 26 60 6 C74 26 74 52 60 66 Z" />
  <path class="draw" d="M60 66 C40 60 26 42 28 22 C44 28 56 44 60 66 Z" />
  <path class="draw" d="M60 66 C80 60 94 42 92 22 C76 28 64 44 60 66 Z" />
  <path class="draw" d="M60 66 C34 66 12 54 4 38 C24 36 46 48 60 66 Z" />
  <path class="draw" d="M60 66 C86 66 108 54 116 38 C96 36 74 48 60 66 Z" />`);

// Wax blob outline: a circle with layered low-frequency wobble so the drip edge looks poured, not drawn.
const SEAL_PATH = (() => {
  let d = '';
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const r = 88 + 5 * Math.sin(7 * t + 0.5) + 3 * Math.sin(13 * t + 1.3) + 1.6 * Math.sin(23 * t + 2.1);
    d += `${i ? 'L' : 'M'}${(100 + r * Math.cos(t)).toFixed(1)} ${(100 + r * Math.sin(t)).toFixed(1)}`;
  }
  return d + 'Z';
})();

/** Wax seal; `mono` is a logo image URL or a [a, b] letter pair. Unique gradient ids per call. */
let sealN = 0;
export const seal = (mono = ['G', 'K'], id = `s${++sealN}`) => `
<svg class="seal-svg" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <radialGradient id="${id}g" cx="40%" cy="34%" r="72%">
      <stop offset="0" stop-color="#A3343A"/><stop offset=".6" stop-color="#6B1A1F"/><stop offset="1" stop-color="#3B1214"/>
    </radialGradient>
    <radialGradient id="${id}p" cx="50%" cy="50%" r="50%">
      <stop offset=".78" stop-color="#5A1418" stop-opacity="0"/><stop offset=".92" stop-color="#3B1214" stop-opacity=".55"/><stop offset="1" stop-color="#A3343A" stop-opacity=".5"/>
    </radialGradient>
    <linearGradient id="${id}o" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F4E2B0"/><stop offset=".5" stop-color="#C9A45C"/><stop offset="1" stop-color="#94733A"/>
    </linearGradient>
  </defs>
  <path fill="url(#${id}g)" d="${SEAL_PATH}"/>
  <circle cx="100" cy="100" r="70" fill="url(#${id}p)"/>
  <circle cx="100" cy="100" r="62" fill="none" stroke="url(#${id}o)" stroke-width="1.8"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="url(#${id}o)" stroke-width=".7" stroke-dasharray="1.5 3.5" opacity=".75"/>
  <ellipse cx="72" cy="58" rx="26" ry="12" transform="rotate(-28 72 58)" fill="#fff" opacity=".1"/>
  ${typeof mono === 'string'
    ? `<image href="${mono}" x="52" y="56" width="96" height="88" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="100" y="114" text-anchor="middle" font-family="Pinyon Script, cursive" font-size="46" fill="url(#${id}o)">${mono[0]}<tspan font-size="24" dx="1" dy="-4">&amp;</tspan><tspan dx="1" dy="4">${mono[1]}</tspan></text>`}
</svg>`;

<div align="center">

# Shubh Aarambh

### Garv &amp; Kaavya · 11 – 12 December 2026 · Sher Bengal River Resort, Kolaghat

*A Hindu wedding invitation told as one auspicious day, from dusk to dawn.* · **#kaarvinlove**

**[shubh-aarambh.pages.dev](https://shubh-aarambh.pages.dev)**

<sub>Crafted by The Corporate Pot</sub>

</div>

---

## The experience

The invitation is one continuous scroll. The page's palette moves through the day as you go: blush dusk, moonlit pearl, haldi saffron, sangeet rose, wedding vermilion, and ivory dawn.

| | Chapter | What happens |
|---|---|---|
| 01 | **The Envelope** | Guests tap the wax seal, the envelope film plays and marigold and rose petals shower down, and the couple's names write in over the garden. |
| 02 | **Shubh Aarambh** | Under a marigold toran, carved temple doors swing open in 3D to reveal ॥ श्री गणेशाय नमः ॥ and the couple's names. |
| 03 | **The Invitation** | A letterpress card rises from its envelope and each line inks in: the grandparents' blessing, the parents, then the couple. |
| 04 | **Our Story** | A gold thread draws through three chapters framed in temple arches. |
| 05 | **The Celebrations** | Mayra, Sangeet, Haldi Carnival and Wedding each get a full scene with drawn motifs: rosette and diyas, moon, sun and agni. |
| 06 | **Saat Phere** | Seven vows light up one by one around the sacred fire. |
| 07 | **The Venue** | A map in an arch window, a compass, directions and copy-address. |
| 08 | **Moments** | A 3D fly-through gallery on desktop, an editorial collage on mobile, and a lightbox. |
| 09 | **Shubh Muhurat** | A gold astrolabe countdown with add-to-calendar (.ics and Google). |
| 10 | **RSVP** | The reply card folds into an envelope and is sealed with wax. |
| 11 | **Finale** | Diyas light one by one under the closing blessing, with the #kaarvinlove hashtag. |

All sections work on phones, respect *reduced motion*, and can be used with a keyboard.

## Built with

- **Plain HTML, CSS and ES modules.** No framework and no build step.
- **[GSAP 3.13](https://gsap.com)** (ScrollTrigger, SplitText, CustomEase) and **[Lenis](https://lenis.darkroom.engineering)** smooth scroll, loaded from CDNs with pinned versions.
- **Cloudflare Pages** hosts the site, a **Pages Function** handles RSVPs, and **Workers KV** stores the replies.
- All ornaments (toran, kalash, diya, rosette, paisley and the rest) are hand-drawn inline SVG, so there is no third-party artwork.

## Project structure

```
public/                 ← everything that is deployed
  index.html            page shell: one mount per section
  css/base.css          design tokens, type, theme variables
  css/<section>.css     one stylesheet per section
  js/config.js          ★ every name, date, venue, vow and photo lives here
  js/main.js            bootstrap, smooth scroll, theme engine, chapter rail
  js/fx.js              petal shower (rose, marigold, jasmine and gold leaf)
  js/lib/motion.js      shared animation helpers
  js/lib/ornaments.js   hand-drawn SVG ornament library
  js/sections/*.js      one module per section
  media/                intro film, posters, optimised photos (WebP)
functions/api/rsvp.js   RSVP endpoint: validates and stores in KV
wrangler.toml           Pages config and the RSVP KV binding
```

## Editing content

Almost everything you'd want to change is in **[`public/js/config.js`](public/js/config.js)**:

- couple, families, hashtag and the Ganesha invocation
- the invitation letter (grandparents, parents, wording); the groom's grandparents go in `letter.groomBlessings`
- events (name, date, time, description). Timings currently read "Timings to be announced"; replace `time` per event when they're fixed
- the couple's G & K logo is `public/media/monogram.png`
- venue and Google Maps links
- story chapters, the seven vows and gallery order
- the countdown target (`weddingISO`)

To add or replace photos, put WebP files in `public/media/photos/` named `pNN-lg.webp` (1800 px) and `pNN-sm.webp` (720 px), then reference the number `NN` in `config.js`.

For background music, add `public/media/music.mp3`. A sound toggle appears automatically after the envelope opens.

## Run locally

```bash
python3 -m http.server 8000 -d public
# open http://localhost:8000
```

The RSVP endpoint only runs on Cloudflare. Locally, the form falls back to a pre-filled WhatsApp message. To run the endpoint as well, use `npx wrangler pages dev`.

## Deploy

Deploys are manual, using Wrangler from the project root. There is no CI.

```bash
npx wrangler login              # once, with the Cloudflare account that owns the project
npx wrangler pages deploy --branch=main
```

Wrangler reads `wrangler.toml`, uploads `public/` and `functions/`, and attaches the `RSVP` KV binding. The site goes live at **https://shubh-aarambh.pages.dev**.

<details>
<summary><b>Setting up from scratch on a new Cloudflare account</b></summary>

```bash
npx wrangler pages project create shubh-aarambh --production-branch=main
npx wrangler kv namespace create wedding-rsvp
# copy the printed id into wrangler.toml → [[kv_namespaces]] id
npx wrangler pages deploy --branch=main
```

To use a custom domain, go to Cloudflare dashboard → Workers & Pages → *shubh-aarambh* → Custom domains.
</details>

## Reading RSVPs

Each reply is stored as `rsvp:<timestamp>:<phone>`, with the name, attendance, guest count, events, message and country.

```bash
# list replies
npx wrangler kv key list --namespace-id ab57e49849fc489d892a8f8980f07a5a --prefix rsvp:

# read one
npx wrangler kv key get --namespace-id ab57e49849fc489d892a8f8980f07a5a "rsvp:<timestamp>:<phone>"
```

You can also browse them in the dashboard: **Workers & Pages → KV → wedding-rsvp**.

## Cost

**Free.** Everything runs within Cloudflare's free tier:

| Service | Free allowance | This invite uses |
|---|---|---|
| Pages hosting | Unlimited static requests and bandwidth | the whole site |
| Pages Functions | 100,000 requests / day | one per RSVP |
| Workers KV | 1,000 writes and 100,000 reads / day, 1 GB storage | one write per RSVP |

No card is needed and nothing is billed unless you choose a paid plan.

---

<div align="center">
<sub>॥ शुभ विवाह ॥<br/>Crafted with love by <b>The Corporate Pot</b></sub>
</div>

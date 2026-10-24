# Deploy to Cloudflare Pages

1. Push the project to Git (or use `wrangler pages deploy public`).
2. Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> connect the repo.
3. Build settings: **Framework preset: None**, **Build command: (empty)**, **Build output directory: `public`**.
   The `functions/` folder at the project root is picked up automatically as Pages Functions (`/api/rsvp`).
4. RSVP storage: Workers & Pages -> KV -> Create namespace (e.g. `wedding-rsvp`).
   Then Pages project -> Settings -> Bindings (Functions) -> Add -> KV namespace, variable name **`RSVP`**, pick the namespace. Redeploy.
   Without the binding the API answers 503 and the form falls back to "Send via WhatsApp".

## Reading RSVPs
- Dashboard: KV -> your namespace -> View (keys are `rsvp:<timestamp>:<phone>`).
- CLI:
  ```
  npx wrangler kv key list --namespace-id <ID> --prefix rsvp:
  npx wrangler kv key get  --namespace-id <ID> "rsvp:1790000000000:9876543210"
  ```
  Dump all: `for k in $(npx wrangler kv key list --namespace-id <ID> | jq -r '.[].name'); do npx wrangler kv key get --namespace-id <ID> "$k"; echo; done`

## Optional music
Drop an MP3 at `public/media/music.mp3`; the sound toggle appears after the envelope opens.

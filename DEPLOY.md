# Deploy to Cloudflare Pages

Live: https://kaavyaandgarvwedding.online (Pages project `kaavya-garv-wedding`, account thecorporatepotfiles@gmail.com)

Auto-deploy: every push to `ayush` runs `.github/workflows/deploy.yml` (needs repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Manual run: GitHub → Actions → Deploy → Run workflow.

Manual deploy from the project root (picks up `public/`, `functions/` and the KV binding in `wrangler.toml`):

```bash
npx wrangler login        # once
npx wrangler pages deploy --project-name=kaavya-garv-wedding --branch=ayush
```

`wrangler.toml` binds the KV namespace `wedding-rsvp` (id `ab57e49849fc489d892a8f8980f07a5a`) as `RSVP`,
so bindings are managed in that file, not in the dashboard.

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

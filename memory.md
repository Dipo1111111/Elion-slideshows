# Memory

Last updated: 2026-08-06

## Session: Production deploy to Render, billing verification, Lemon Squeezy research

### What was built
- **First production deploy of Elion to Render** via Render MCP.
  - Web service: name `elion`, id `srv-d9q57pl3erlc738hdb1g`, workspace `tea-d9q4rrht0dsc73c8s9gg`, free plan, Oregon region, autoDeploy on.
  - Production URL: **https://elion-ix26.onrender.com** (slug is `elion-ix26`, NOT `elion.onrender.com`).
  - Build `npm install && npm run build`, start `npm start`, Node 24.14.1, build clean (Vite 8.2.0, 1925 modules). Dashboard: https://dashboard.render.com/web/srv-d9q57pl3erlc738hdb1g
  - All env vars copied from local `.env` into Render env. `PORT` left unset (Render injects). `SUPABASE_JWT_SECRET` omitted on purpose (auth falls back to Supabase `/auth/v1/user`).
  - Verified live: `/api/health` returns `{"ok":true}`, `/api/me` returns 401 without a token, homepage serves the built SPA.
- **GitHub repo made public**: `Dipo1111111/Elion-slideshows` was private; Render MCP could not clone it, so it was flipped to public.
- **Installed `@playwright/test` + Chromium** as dev dependencies (not committed, no E2E spec written yet).
- **Server-side billing verified end-to-end on the deployed app**: created a throwaway user via Supabase admin API, then sent a properly-signed webhook `order_created` (Creator variant) and confirmed `/api/me` flipped `free → creator`, then `subscription_cancelled` flipped back to `free`. Test user email/password were given to the user; it can be deleted in Supabase → Authentication → Users.

### Decisions made
- Deploy target is **Render** (a Vercel preview URL is static-only and cannot run the Express API).
- **Production host is `https://elion-ix26.onrender.com`** — every external integration (Lemon Squeezy webhook URL, Google OAuth origins/redirect URIs) must use this host.
- Repo left public for Render auto-deploys. If it goes private again, Render must have GitHub connected (dashboard Settings → GitHub), otherwise every push redeploy fails.
- Billing is provider-agnostic: `LEMON_*` env vars + one webhook handler (`server/lemon.js`) mapping variant ID → plan. No other system depends on Lemon Squeezy.

### Problems solved
- **Render MCP "repo URL invalid or unfetchable"**: the old memory listed the remote as `Dipo1111/...` but the actual remote is `Dipo1111111/...` (six ones). Even then Render could not fetch it until the repo was made public. Local git had worked only via Windows Credential Manager, so visibility was easy to misjudge.
- **Deploy initially set `APP_URL=https://elion.onrender.com`** but Render assigned slug `elion-ix26`. Fixed by updating the env var (triggered a redeploy).
- **Google OAuth `bad_oauth_state` redirecting to dead `http://localhost:3000`**: root cause was Supabase Auth **Site URL** still at the default `localhost:3000`. Fixed in Supabase dashboard (Authentication → URL Configuration): Site URL → `https://elion-ix26.onrender.com`, added redirect URL `https://elion-ix26.onrender.com/**`. Auth (Google + email/password) works after the fix.
- **Lemon Squeezy "Connect Stripe" block (Nigeria)**: researched; see open questions.

### Current state
- Production is live and verified: app serves, auth works, billing webhook logic flips plans.
- Lemon Squeezy store: user reported setup now works ("never mind its worked"). Full activation is not confirmed: store setup + payouts, products published, webhook pointing at `https://elion-ix26.onrender.com/api/lemon/webhook` with a signing secret matching `LEMON_SQUEEZY_WEBHOOK_SECRET` in `.env`, and a "Send test webhook" pass are still outstanding.
- Product descriptions for Creator and Studio were drafted and given to the user for the Lemon Squeezy checkout pages (matches the current placeholder caps: 100/mo Creator, 500/mo Studio).
- Playwright is installed but unused so far.

### Next session starts with
1. Confirm the Lemon Squeezy store is fully activated: finish store/payout setup, publish the Creator + Studio products, create the webhook at `https://elion-ix26.onrender.com/api/lemon/webhook` (signing secret must equal `LEMON_SQUEEZY_WEBHOOK_SECRET`), then run LS "Send test webhook".
2. Write and run the Playwright browser E2E (BUILD_PLAN §16): homepage load, email/password signup + login, Google button starts OAuth, `/api/me` plan, one real generation, free watermark vs paid export.
3. Re-run the signed-webhook smoke test after any provider change.

### Open questions
- Does the user's Lemon Squeezy store actually stay on the classic bank/PayPal payout path, or did they get pushed onto Stripe Managed Payments (needs Stripe, which is unsupported in Nigeria)? LS's official fallback is Stripe Atlas (US incorporation). Alternative MoRs to consider if blocked: Paddle, Gumroad (PayPal/bank), Paystack/Flutterwave (gateways, not MoR).
- Monthly caps are placeholders (`LIMIT_MONTHLY_GEN`, `LIMIT_MONTHLY_GEN_STUDIO`).
- Remaining roadmap: Playwright E2E, Phase 11 security hardening (RLS, rate limiting, input validation; `npm audit` shows 3 vulnerabilities), margin math, bundle code-splitting (1.04 MB / 276 KB gzip chunk warning), custom domain decision.

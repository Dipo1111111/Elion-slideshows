# Memory

Last updated: 2026-08-08

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

---

## Session: UI/UX polish (skeletons, editor preview, slide text on thumbs) + trademark drop

Last updated: 2026-08-06

### What was built
- **Editor preview** (`src/components/SlideshowEditorModal.tsx`): the left 9:16 phone now shows the current slide's real script text over its background (legibility scrim + bottom gradient) instead of a bare index numeral.
- **Skeleton loaders on every content tab**: Dashboard, Library, Billing no longer flash the empty state for 1-2s before content glitches in. Empty states only render after a completed load genuinely returns empty.
- **Library delete is smooth**: optimistic card-out exit (190ms), immediate grid removal, GSAP FLIP glide for surviving cards into freed slots, restore-on-error at the original index. Reduced-motion safe.
- **SlideThumb shows script text instead of the index numeral** (`src/components/primitives.tsx`): used on product cards (featured `w-24` + grid `w-12`) and the landing page. Text is centered, wraps to at most two lines, and auto-scales down by the overflow ratio (floor 0.6) when longer, so no ellipsis (dot-dot-dot) ever appears. Index numeral kept as the fallback where no text exists (Auth demo thumbs).
- **Dashboard empty-state flash fixed**: `runGenerate` bumps `reloadKey` and flips `generating` off in the same React batch, so one render had a stale empty queue with no in-flight fetch. Added a sync-epoch state (`syncedKey`) that holds the skeleton until a fetch resolves for the current `reloadKey`. The generating branch moved first so navigating to Dashboard mid-generation shows "Writing your scripts".
- **Landing page** (`src/landing/ProductShots.tsx`): removed all slide-image numerals ("1 2 3" on dashboard card thumbs, big "2" on the editor phone) and replaced with real sample slide text, centered, reusing the app's `SlideThumb`. Kept the legit UI numbers: Export-tab per-row index tiles, the "2 / 7" counter, Generate modal count chips.
- **DESIGN.md §11.7**: new allowed deviation documenting slide-thumb text (2-line cap, auto-scale, numeral fallback).
- **PROGRESS_TRACKER.md**: trademark item marked DROPPED; UI/UX polish marked done in the milestone header.
- All changes committed on `main` (commits `f2538c9`, `9884fc9`, `2423954`), working tree clean. Repo is public, so Render auto-deploys main; production now has these fixes.

### Decisions made
- Slide-thumb text treatment (user-requested, overrides the DESIGN.md numeral recipe): centered, wrap to two lines, auto-scale down instead of ellipsis; TikTok-safe side padding kept. Iterated from bottom-anchored multi-line, then centered single-line truncated, to the final centered 2-line auto-fit.
- Loading pattern across views: `null` sentinel state means "not synced yet" (skeleton), gate on `meLoading`, only render the empty state when a completed fetch returns empty; Dashboard additionally gates on `syncedKey === reloadKey`.
- **Trademark clearance for "Elion" DROPPED** by user 2026-08-06. ELION is a registered US mark held by several non-competing companies (most relevantly Elion Inc, Menlo Park CA, a health IT platform). Not a pre-launch blocker on a Render subdomain; revisit only if the user buys a custom domain or sees real growth.
- Reusing the app's `SlideThumb` on the landing keeps fit behavior consistent (DRY) instead of duplicating the measurement logic.

### Problems solved
- Empty-state flash after generation: one-frame gap from `reloadKey` bump + `setGenerating(false)` in the same batch. Solved with the `syncedKey` epoch guard.
- Text too long for a tiny thumb: measured the 2-line-capped box (max-h 25px featured / 18px grid), `scale = clientHeight / scrollHeight` (floor 0.6), re-measured via `requestAnimationFrame` after first paint to catch font settling. Used px caps, not the `lh` unit, to avoid any unit-support risk.

### Current state
- All UI/UX tasks done, typechecked clean (`tsc --noEmit` exit 0). Local dev server (Vite 5173 + API 8787) running with hot reload.
- Production https://elion-ix26.onrender.com is live; latest fixes pushed to main (auto-deploy).
- Remaining pre-launch: Playwright E2E (BUILD_PLAN §16); Lemon Squeezy store activation (ON HOLD until LS verifies, then ask user first). Post-launch: Claude Haiku model swap, stock packs, server-side watermark (v2).

### Next session starts with
1. Playwright E2E (BUILD_PLAN §16): signup → brain → generate → edit → swap background → export/watermark → upgrade via webhook → clean export → limits (403/429).
2. Lemon Squeezy store activation stays ON HOLD until LS verification clears; when it does, ASK the user before proceeding.

### Open questions
- LS store/payout path for Nigeria (Stripe Managed vs legacy bank/PayPal) still unconfirmed; alternatives if blocked: Paddle, Gumroad, Paystack/Flutterwave.
- Monthly caps are placeholders (`LIMIT_MONTHLY_GEN`, `LIMIT_MONTHLY_GEN_STUDIO`).
- Bundle code-splitting (1.04 MB / 276 KB gzip chunk warning) still outstanding.

---

## Session: Marketing kickoff (Reddit post is the first move)

Last updated: 2026-08-07

### What was built
- Nothing new built this session. This session sets the new direction: user considers the build close to done and wants to shift focus to marketing.

### Decisions made
- **User wants to start marketing now**, before/around the last pre-launch items. The build is effectively done: prod is live at https://elion-ix26.onrender.com, auth + billing webhook verified.
- **First marketing move: write a Reddit post about Elion** (user's explicit ask). Broader plan is TBD ("etc.") but Reddit is the starting point.

### Problems solved
- None this session.

### Current state
- Production live and verified (see prior sessions). Pre-launch leftovers still open: Lemon Squeezy store activation (user-side, on hold until LS verifies), Playwright E2E, Phase 11 security hardening, margin math/real caps, bundle code-splitting.
- Marketing has NOT started yet; nothing posted anywhere.

### Next session starts with
1. Draft the Reddit post about Elion. Cover: what Elion is ("writes your slideshow for you" for solo TikTok/IG creators), the hook (AI writes the script in your voice, real photo backgrounds, export 1080x1920 PNGs, post manually in TikTok's native font), and the URL https://elion-ix26.onrender.com.
2. Pick target subreddits that allow self-promo (e.g. r/SideProject, r/indiehackers, creator-focused subs) and read each one's promo rules BEFORE posting; no spam.
3. Keep the pre-launch engineering items moving in parallel (LS activation, Playwright E2E) when the user wants to pause marketing.

### Open questions
- Which subreddits, what tone/format (build-in-public vs launch post vs tutorial), and whether the user wants to wait for full LS activation before driving traffic to a checkout that is not yet live.
- Posting cadence and which channels come after Reddit (TikTok is the user's domain; maybe dogfood the product to make promo content).

---

## Session: Short-form marketing pivot (2-format video system, FINAL)

Last updated: 2026-08-08

### What was built
- No product code this session. Strategy alignment on how to market Elion: Reddit is dropped; marketing = short-form video (TikTok/Instagram) selling Elion.
- Content-dashboard seed library rewritten (storage key v4) as the Elion marketing library, then revised again after the format review below.

### Decisions made
- **Reddit-first move is DROPPED.** First marketing channel = short-form video selling Elion (faceless: ElevenLabs AI voice, Pexels/Pixabay B-roll, screen recordings, text overlays).
- **2-format video rotation (LOCKED 2026-08-08):** Trojan Horse listicle (2 known/popular apps + Elion as the #3 "secret weapon"; swap the app pairings each post so it never feels repetitive) and Greed speedrun (the hook diverts toward a universal output, e.g. "how do creators post 10 slides a day without missing?", then the fast Elion screen demo answers it; the lazy/fast benefit is the byproduct, not the literal pitch; NO she/he and NO named creator, so no real person ever has to be sourced for the video).
- **2 formats only, no third.** Contrarian REJECTED (doesn't resonate with the user). Build-in-Public / Insider REJECTED: it needs a face and first-person "I", and all short-form is faceless (no "I", no personal brand). The Receipts (evidence/pattern insight) was proposed, then SCRAPPED by the user 2026-08-08. Seed = 6 Trojan Horse + 6 Greed speedrun.
- **No URLs or app names in the first 5 seconds** (algorithm ad-flag risk). Traffic leaves via comment keyword triggers → ManyChat automated DM funnel (CREATOR / LAZY / STARTUP-style words). Never a URL on screen or in captions.
- **No posting schedule.** The dashboard just needs the UI flows working: see scripts, choose, remove, undo, add one, undo.
- Every marketing script = 3 segments (Hook 0-2s, Mechanism/Proof 2-6s, Comment CTA 6-8s), 8-15s total, with per-segment visual direction.
- Standing rule: "slideshow", never "carousel", even in marketing copy.

### Problems solved
- Caught that the content-dashboard seed was generic creator-tips, not Elion marketing. First fix: all 12 scripts rebuilt around Elion (storage key v4). Second fix: align to the Gemini strategy. Final fix (2026-08-08): The Receipts scrapped, seed rewritten as the 2-format faceless library (6 + 6, storage key v5).

### Current state
- content-dashboard seed (v5) = the final 2-format library: 6 Trojan Horse listicles + 6 Greed speedruns, every script a 3-part video (hook / mechanism-demo / comment CTA) with per-beat visual direction and a ManyChat trigger keyword ('CREATOR' on listicles, 'LAZY' on speedruns). No third format; `output` removed from the data model (types, picker, import). All 18 logic checks + build green.

### Next session starts with
1. Seed rewrite is DONE (6+6, key v5, tests + build green). Next: git init + first commit in content-dashboard, then deploy to Render as a static site so the owner can install it on their phone.
2. Optional: ManyChat funnel setup (CREATOR / LAZY keyword triggers → auto-DM the Elion link).

### Open questions
- ManyChat setup: CREATOR / LAZY keyword triggers → auto-DM the Elion link. Not built yet.
- Does the beat `note` field need an explicit visual-direction field? Current notes already carry B-roll / screen recording / text overlay / DM mockup direction, so probably not.

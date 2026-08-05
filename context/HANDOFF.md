# HANDOFF — Restore this into a new session

> Paste this into a new Claude Code session to restore full context. Say:
> "Read `context/HANDOFF.md` and resume from where the last session left off. Then read `loop.md`, `BUILD_PLAN.md`, and `PROGRESS_TRACKER.md` and do the last set of tasks."

---

## Who you're working with

- **Communication style:** Direct, fast, no fluff. The user hates being asked redundant questions or given long explanations for simple things. Don't pad answers. Don't explain what you're about to do, just do it.
- **What they hate:** Being asked things already answered in docs. Being asked "is this plan okay?" repeatedly. Long preambles. Em dashes in UI copy. Being stopped for permission when they said "build everything." Overexplaining.
- **What they want:** You to just BUILD. Loop engineering: generate → verify → checkpoint → next. No stopping, no asking, no "here's what I'm going to do." Do it and report back when done.
- **Typing style is casual/sloppy** (voice-to-text or fast typing). Don't mirror it. Be professional.
- **They are stepping out while you build.** Do NOT pause for confirmation. Every decision is locked in the docs.

---

## Project: Elion

**Elion** ("Elion AI") = hosted, clean-room, feature-for-feature rebuild of SlideSmith for solo TikTok/Instagram carousel slideshow creators. SlideSmith (`Documents\slideshow gen software\SlideSmith`) is feature reference ONLY, never copy source code, prompts, or images (PolyForm Noncommercial, cannot be sold).

### Core value
"Writes your carousel for you." Creator sets up a Brain → AI writes slideshow script → review/edit → export 1080x1920 PNG backgrounds + copyable text → post manually in the native app.

### Locked decisions (DO NOT RE-ASK)
- **Design:** Synthover is the locked winner. **`DESIGN.md` (repo root) is the binding UI contract**: it pins EVERY value and component recipe verbatim. Build to it 1:1, no restyling, no iteration on the look; the only deviations are DESIGN.md §11. Black/blue/white ONLY. Page black `#08080A`. Containers = transparent + hairline border (never filled, no navy). One accent blue `#3B82F6` as translucent glass (`/20` fills, never solid except tiny data marks). Modals = the only elevated layer. No amber, no purple, no navy.
- **Pricing:** Free = 3 lifetime gens, watermarked exports, 1 project. Pro = $19/mo or $99/yr, 100 slideshows/mo placeholder, 5 projects placeholder, no watermark. Anti-abuse 10 gens/hr all tiers.
- **Fonts:** Schibsted Grotesk Variable (display/headers), Inter Tight Variable (body + whole sidebar), DM Sans Variable (numbers/counters). Lucide icons at `strokeWidth={1.5}`.
- **Model (locked 2026-08-05):** OpenRouter is RETIRED. Generation provider = **OpenCode Zen**, model = **`big-pickle`** (the free model, verified live against the API), base URL = `https://opencode.ai/zen/v1`, key env `OPENCODE_API_KEY`. Other OpenCode models available: `glm-5`, `glm-5.1`, `glm-5.2`, plus claude/gemini/gpt families. Env-driven: `OPENCODE_API_KEY`, `OPENCODE_MODEL`, `OPENCODE_BASE_URL`. Never hardcode a model name in code. `server/openrouter.js` is rewired to OpenCode and reads `OPENCODE_*` (live-tested PASS).
- **Images:** Real photos. Pinterest pulls via platform-held Apify key → Supabase Storage (`backgrounds` bucket, sha256 keys) → same-origin `/api/images/:hash` proxy. Dev fallback = picsum URLs when `APIFY_API_KEY` unset. NO bundled starter packs. No gradient state in UI (empty state → skeleton → image-backed cards).
- **NO post-bridge** in v1 (no posting/scheduling/analytics). Manual posting in native apps only.
- **Stack:** React 19 + TS + Vite 8 + Tailwind 4 + shadcn/ui (radix-nova) + react-router-dom + lucide-react + @supabase/supabase-js. Express 5 (ESM, plain JS) in `server/`. jose for JWT verify.
- **Deploy:** Render single Node process (Express serves dist + SPA fallback). No vercel.json needed.
- **No em dashes** in any user-facing string. Periods, commas, colons only. "Slideshows" and "slides", never "carousels."
- **Brand:** `BRAND_NAME = 'Elion'`. No tagline. Logo is `src/assets/elion-logo.png` (real wordmark, never invent a mark).
- **Brand switcher (FORBIDDEN rules):** NEVER in the sidebar, NEVER on the Dashboard. Only home = Brand Voice tab header (`src/components/ProjectSwitcher.tsx`), compact neutral hairline control, animated dropdown, no navy fills, no initials-in-a-box. Copy uses "brand"/"brands".

---

## What's been done

Full design exploration: 7 mockups → Clover → Synthover (merged) → locked. Navy fill audit + impeccable modal pass. All .md docs synced against PRD. architect blueprint. `loop.md` written. Synthover extracted to `src/index.css` (design-role tokens + shadcn semantic mapping, dark-only). UI contract `DESIGN.md` written.

**Build is COMPLETE through Phase 9** (all phases ticked in `PROGRESS_TRACKER.md`): design tokens, auth, Brain/projects, generation, queue UI + editor, export (+ watermark + send-to-phone QR), library, billing, landing. `npx tsc` clean, `npm run build` clean, em-dash grep clean.

**Done 2026-08-05 (this session):**
- Modal exit animations on all three modals (Generate, Editor, Brand wizard): close with a 200 ms fade + shrink via `src/lib/useAnimatedClose.ts` + `.modal-backdrop-out` / `.modal-panel-out` keyframes. Reduced-motion safe.
- Brand switcher relocated to Brand Voice tab header only; FORBIDDEN rules written into CLAUDE.md + DESIGN.md + memory.
- Vite `/s` proxy MIME bug fixed: proxy key `'/s'` → `'/s/'` (trailing slash is load-bearing; `/src/*` must never be proxied).
- OpenCode Zen wired + verified: base URL `https://opencode.ai/zen/v1`, model `big-pickle` (the free model), key provided by user. `server/openrouter.js` rewired to OpenCode, live-tested (real JSON round trip PASS). Real values are in `.env` (gitignored); `.env.example` updated (added `SUPABASE_STORAGE_BUCKET`, `APIFY_*`, `OPENCODE_*`; removed `OPENROUTER_*`). CLAUDE.md, BUILD_PLAN.md, PROGRESS_TRACKER.md, memory all updated to match.
- Supabase MCP: **no personal access token needed.** The project `.mcp.json` already has the official Supabase **OAuth** MCP (`mcp.supabase.com/mcp`) pointed at the user's project ref `wadmyrurjnlvbrugcnud`. Complete the OAuth browser login on next session start. A token-based duplicate I added earlier was removed (it errored on the unset `SUPABASE_ACCESS_TOKEN` env var).
- **Supabase schema + bucket LIVE (2026-08-05):** user ran `supabase/schema.sql` in the SQL Editor and created the **private** `backgrounds` bucket. Verified: tables 200, signup trigger auto-creates profile (`plan=free`) + default "My brand" project. No more PGRST205 / NoSuchBucket.
- **Auth verified through the real server (2026-08-05):** admin create → sign in → Bearer token against the running server → `/api/me` 200 (plan free, project "My brand", limits `{total:3, monthly:100, hourly:10, projects:{free:1, pro:5}}`); no token → 401; garbage token → 401. Confirms tokens are **ES256** and the GoTrue-verify auth path works.
- **Auth page email-confirmation state (2026-08-05):** signup with email confirm on returns no session, so `src/pages/Auth.tsx` now shows a "Check your email" panel with Resend + Back, instead of bouncing back to auth. Footer legal links to `/terms` + `/privacy`.
- **Landing page rewritten (2026-08-05):** `src/pages/Landing.tsx` now a full landing (nav, hero with staggered slide thumbs, 3-step How it works, What you get, Free/Pro pricing, FAQ with native `<details>`, footer). Follows palette + brand rules only (not DESIGN.md-locked).
- **Legal pages built (2026-08-05):** `src/pages/Legal.tsx` renders Terms / Privacy / Refund keyed by slug, routes wired in `App.tsx`. Template docs; swap in lawyer-reviewed copy before launch.

---

## The last set of tasks (do these in order, tick as you go)

1. **Supabase (DONE + verified 2026-08-05).** `.env` has `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (all given 2026-08-05, verified live). User ran `supabase/schema.sql` and created the private `backgrounds` bucket. Auth chain verified end to end (admin create → sign in → `/api/me` 200): access tokens are **ES256** (ECC P-256), so `server/auth.js` verifies via Supabase's `/auth/v1/user` with an optional HS256 fast path; `SUPABASE_JWT_SECRET` is **not needed** and stays blank. No action needed.
2. **OpenCode wiring (DONE + verified).** Base URL `https://opencode.ai/zen/v1`, model `big-pickle` (free), key in `.env`. Adapter rewired + live-tested PASS. No action needed.
3. **Apify (DONE).** `APIFY_API_KEY` provided 2026-08-05 + verified live (account `DIPO8LG`). Actor `fatihtahta/pinterest-scraper-search` exists, is public, and its input schema matches the code (`queries` array + `limit` integer). `APIFY_ACTOR_ID` defaults to it. Real Pinterest pulls are live.
4. **Google OAuth (user).** Frontend button is wired (`supabase.auth.signInWithOAuth({provider:'google', options:{redirectTo: origin + '/app'}})`); it will fail until Supabase's Google provider is enabled. User must: Google Cloud Console → OAuth consent screen (External, scopes `email` + `profile`) → OAuth Client ID (**Web application**) → Authorized JS origins: `https://wadmyrurjnlvbrugcnud.supabase.co` and `http://localhost:5173` (dev) → Authorized redirect URI: `https://wadmyrurjnlvbrugcnud.supabase.co/auth/v1/callback` → paste Client ID + Secret into Supabase → Authentication → Providers → Google → Enable.
5. **Lemon Squeezy (user).** Routes verified wired (`/api/lemon/webhook` → clean 503 until secret set; `/api/upgrade-url` auth-gated). User provides store URL, Pro monthly $19 variant ID, Pro annual $99 variant ID, webhook secret → set `LEMON_SQUEEZY_*` env. Webhook points at `POST /api/lemon/webhook`.
6. **Deploy.** User provides `APP_URL` + target (Render per plan). Then:
   - Playwright end-to-end (BUILD_PLAN §16): signup → brain → generate → edit → swap background → export (watermark logic) → upgrade via signed webhook payload → clean export → limits (403/429).
   - Phase 11 security hardening checklist (PROGRESS_TRACKER.md).
   - Initial git commit (nothing committed yet, only the planning commit 088edda).
   - Deploy.

**Verification at every checkpoint:** `npx tsc`, `npm run build`, impeccable detector on UI files, em-dash grep on `src/`.

**Key files:** `server/index.js` (all routes), `server/openrouter.js` (rewire to OpenCode), `server/auth.js`, `server/db.js`, `server/generate.js`, `server/images.js`, `server/limits.js`, `server/lemon.js`, `server/exports.js`, `supabase/schema.sql`, `src/lib/api.ts`, `src/lib/supabase.ts`, `src/views/*`, `src/components/*`. Design reference: `DESIGN.md` (repo root). CSS: `src/index.css` (done).

---

## Environment
- Dev runs without any env vars set (health + UI render; auth/generate show configured-but-inert states).
- `npm run dev` = Vite (5173) + server (8787) via concurrently. Vite proxies `/api` → `http://localhost:8787` and `/s/` → API.
- Env vars are all in `.env.example`.

## When you're done
1. Every phase in PROGRESS_TRACKER.md through Phase 11 ticked (or explicitly deferred).
2. `tsc` + `npm run build` clean.
3. Every UI file passes the detector with `[]`.
4. Zero em dashes in UI copy.
5. Deployed and `/api/health` green.

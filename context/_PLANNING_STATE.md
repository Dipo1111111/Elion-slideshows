# Planning State — Hosted Carousel SaaS (clean rebuild)

Last updated: 2026-08-04

## BLOCKER RESOLVED ✅

- User is NOT the author of the SlideSmith repo (taken from GitHub). Licensed PolyForm Noncommercial → cannot sell.
- **Decision: Rebuild from scratch (clean-room).** Existing SlideSmith repo = feature reference ONLY. No copied code, no copied images.
- Bundled ~140 images are off-limits (unlicensed scraped stock) → **backgrounds come from a real image library: Pinterest pulls via a platform-held Apify key** (actor `fatihtahta/pinterest-scraper-search`), cached in Supabase Storage (sha256-keyed), served same-origin via `/api/images/:hash`. Dev fallback = picsum URLs when APIFY_API_KEY unset. No bundled starter packs.
- New project gets its own fresh git repo; new directory = **`C:\Users\USER\Documents\elion`** (working name `daftquad` was superseded; final brand name = **Elion** / "Elion AI").

## Decisions made (locked)

- **Product**: Hosted, multi-tenant carousel generator for solo creators. Branding/name deferred (BRAND_NAME constant for easy swap). Working code name: Carousel SaaS.
- **Customer**: solo TikTok/IG creators (user's own workflow).
- **MVP scope**: sign up → Brain → AI generates carousels → review/edit → export 1080×1920 PNGs + text. No posting/scheduling/analytics.
- **Pricing**: Free = 3 lifetime gens, watermarked exports, 1 project. Pro = $19/mo or $99/yr, capped slideshows/month (placeholder 100), watermark-free, up to 5 projects (placeholder), each project owns its own Brain. Anti-abuse 10/hr/user.
- **Billing**: Lemon Squeezy (MoR). Webhook flips plan.
- **AI**: OpenRouter server key. Launch on cheapest (Gemini Flash 2.x) → swap to Claude Haiku after ~2 paid customers.
- **Hosting**: Render (single Node process) + Supabase (Postgres, Auth, Storage bucket `backgrounds`). Storage is required for the cached background image pool.
- **Auth**: Supabase email+password, JWT middleware.
- **Launch**: public landing page + email signup.
- **Watermark**: client-side (accepted; v2 = server-side).
- **Stack**: React 19 + TypeScript + Vite + Tailwind + **shadcn/ui** frontend; Express 5 server (single process serving dist + API).

## Rejected / parked

- Names: CarouselAI (AutoStore TM), SlideSmith (slidesmith.ai), Deckr/SpinDeck/FlickDeck/Deckly/StoryDeck/Carou/SwipeDeck. Clean candidates for branding brainstorm: Carouzen / Carusel / Slyde.
- post-bridge / auto-posting / OAuth / per-user keys. (Apify is now IN via a single platform-held key, not per-user.)
- Server-side watermark (v2), async worker (later).
- Multi-project accounts (one Brain per user for MVP).

## Open items for later

1. Brand/name deep-dive → BRAND_NAME + domain swap. **Name locked: Elion.** Domain `elion.ai` availability still to check (method TBD — user rejected Bash RDAP + WebFetch-whois earlier).
2. Model upgrade to Claude Haiku.
3. Background packs via stock APIs or user upload (post-MVP).
4. Server-side watermark / async worker as needed.

## Next step (current)

1. **Docs reconciled** against PRD (2026-08-04): BUILD_PLAN.md rewritten (locked pricing, image library, full API, build phases), CLAUDE.md / PRODUCT.md / BRAND.md / schema.sql / PROGRESS_TRACKER.md synced.
2. **Architect blueprint** (this step) → user confirms → **loop.md** (loop engineering) → then build everything per BUILD_PLAN §15.
3. After the code: user sets up keys (Supabase, OpenRouter, Apify, Lemon Squeezy store + webhooks) → Playwright end-to-end verification.

> **UPDATE 2026-08-02 (post-session):** Name **LOCKED = Elion** ("Elion AI"). Folder created: `C:\Users\USER\Documents\elion`. Planning docs (CLAUDE.md, BUILD_PLAN.md, PROGRESS_TRACKER.md) written here.
> **UPDATE 2026-08-04:** Design LOCKED = Synthover (`src/components/design1/synthover.tsx`, the `/design1` chosen design, black/blue/white). Navy-fill audit + impeccable modal pass done. Docs synced. Next: /architect blueprint → loop.md → build all code.

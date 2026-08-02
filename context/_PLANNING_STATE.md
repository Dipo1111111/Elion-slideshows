# Planning State — Hosted Carousel SaaS (clean rebuild)

Last updated: 2026-08-02

## BLOCKER RESOLVED ✅

- User is NOT the author of the SlideSmith repo (taken from GitHub). Licensed PolyForm Noncommercial → cannot sell.
- **Decision: Rebuild from scratch (clean-room).** Existing SlideSmith repo = feature reference ONLY. No copied code, no copied images.
- Bundled ~140 images are off-limits (unlicensed scraped stock) → **backgrounds are gradients-only for MVP**; user-uploaded backgrounds + licensed stock packs (Unsplash/Pexels APIs) are post-launch options.
- New project gets its own fresh git repo; new directory = **`C:\Users\USER\Documents\elion`** (working name `daftquad` was superseded; final brand name = **Elion** / "Elion AI").

## Decisions made (locked)

- **Product**: Hosted, multi-tenant carousel generator for solo creators. Branding/name deferred (BRAND_NAME constant for easy swap). Working code name: Carousel SaaS.
- **Customer**: solo TikTok/IG creators (user's own workflow).
- **MVP scope**: sign up → Brain → AI generates carousels → review/edit → export 1080×1920 PNGs + text. No posting/scheduling/analytics.
- **Pricing**: Free = 3 lifetime gens, watermarked exports. Pro = $19/mo or $99/yr, 300 gens/month, watermark-free. Anti-abuse 10/hr/user.
- **Billing**: Lemon Squeezy (MoR). Webhook flips plan.
- **AI**: OpenRouter server key. Launch on cheapest (Gemini Flash 2.x) → swap to Claude Haiku after ~2 paid customers.
- **Hosting**: Render (single Node process) + Supabase (Postgres, Auth). Storage not needed for MVP (gradients only).
- **Auth**: Supabase email+password, JWT middleware.
- **Launch**: public landing page + email signup.
- **Watermark**: client-side (accepted; v2 = server-side).
- **Stack**: React 19 + TypeScript + Vite + Tailwind + **shadcn/ui** frontend; Express 5 server (single process serving dist + API).

## Rejected / parked

- Names: CarouselAI (AutoStore TM), SlideSmith (slidesmith.ai), Deckr/SpinDeck/FlickDeck/Deckly/StoryDeck/Carou/SwipeDeck. Clean candidates for branding brainstorm: Carouzen / Carusel / Slyde.
- post-bridge / auto-posting / OAuth / Apify / per-user keys.
- Server-side watermark (v2), async worker (later).
- Multi-project accounts (one Brain per user for MVP).

## Open items for later

1. Brand/name deep-dive → BRAND_NAME + domain swap. **Name locked: Elion.** Domain `elion.ai` availability still to check (method TBD — user rejected Bash RDAP + WebFetch-whois earlier).
2. Model upgrade to Claude Haiku.
3. Background packs via stock APIs or user upload (post-MVP).
4. Server-side watermark / async worker as needed.

## Next step (revised order)

1. **Branding deep-dive (Zag framework) — NOW**:
   - Phase 1 locked: Purpose = level the playing field; Vision = default tool for solo creators; Onlyness = the ONLY carousel generator that learns your brand voice; Passion = creator first.
   - Phase 2: category (brand-aware AI carousel generation), ecosystem, edge (the Brain), price ($19/$99) drafted. Name decision in progress.
   - Then: logo direction, tagline, brand palette/type, then assets.
2. Create separate brand-named folder (clean rebuild) once branding locks.
3. Architect blueprint → user confirms → writing-plans → implementation.

> **UPDATE 2026-08-02 (post-session):** Name **LOCKED = Elion** ("Elion AI"). Folder created: `C:\Users\USER\Documents\elion`. Planning docs (CLAUDE.md, BUILD_PLAN.md, PROGRESS_TRACKER.md) written here. Next per user's process: **design exploration** — brand markdown file (color/tagline/positioning) → scaffold React + shadcn → `/compare` mockup studio (batches of 4–6 completely different designs until one is picked) → extract chosen design into global CSS → build per BUILD_PLAN.md.

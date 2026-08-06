# CLAUDE.md — Elion

## What this is

**Elion** ("Elion AI") is a hosted, multi-tenant **slideshow generator** for solo TikTok/Instagram creators.
Core value: **"Writes your slideshow for you."** A creator sets up a **Brain** (niche, audience, style memory), the AI
writes slideshow scripts in that voice, they review/edit, then export 1080×1920 PNG backgrounds + copyable text to post
manually in TikTok's native font.

## Clean-room law (non-negotiable)

- Elion is a **clean-room rebuild**. The old repo `SlideSmith/` (`Documents\slideshow gen software\SlideSmith`) is
  **feature reference ONLY**.
- NEVER copy its source code, its prompt text, or its images into Elion. Understand the feature, then write our own.
- SlideSmith is licensed PolyForm Noncommercial (cannot be sold). Elion is a new, independent codebase with its own
  fresh git repo.

## Brand

- Name: **Elion** — brand form "Elion AI". All brand-y strings flow through `BRAND_NAME` in `src/lib/brand.ts` and the
  shadcn theme tokens. Do NOT hardcode "Elion" scattered across the UI.
- The brand design (color, tagline, positioning) is defined in the design-exploration phase in a dedicated markdown
  file. Until then, use the placeholder tokens in `brand.ts`.
- **Font pairing:** Schibsted Grotesk Variable (`--font-display`) is the main display face for headers and titles;
  Inter Tight Variable (`--font-sans`) is the body/UI face and the sidebar font; DM Sans Variable (`--font-num`) is
  for numbers and counters (prices, slide indices, usage figures). Icons are lucide-react at `strokeWidth={1.5}`
  (thin stroke). Never render the whole UI in one font. Fonts load via `@fontsource-variable/*` in `src/index.css`.
- **Logo:** mockups must NOT contain a placeholder logo mark (no monogram tiles, round-rectangle marks, or invented
  logos). The real Elion logo is built by the user as a reusable component and linked into the UI; render it wherever
  a brand mark is needed, and don't invent one in the meantime.
- **Palette discipline (locked, non-negotiable):** black, blue, and white ONLY. Page black `#08080A`; containers are
  transparent with a hairline border (never filled container backgrounds, no navy tints); the one accent is blue
  `#3B82F6` used as translucent glass (`/20` fills, `/25` hairlines, never solid except tiny data marks). The modal is
  the only elevated layer. No amber, no purple, no navy.
- **FORBIDDEN: navy-blue-tinted background surfaces.** `#3B82F6` is a tiny accent only: text links, icons ≤16px,
  thin progress marks, focus rings. Never a filled background area, and never a blue-tinted tile/pill/card/panel (no
  `bg-[#3B82F6]/20`-style fills). The user has rejected this repeatedly ("navy blue bg"); do not reintroduce it.
- **FORBIDDEN: brand/project switcher placement + form.** The brand switcher must NEVER be in the sidebar and NEVER
  be a full-width strip block on the Dashboard. Its only home is a compact, neutral hairline control in the Brand
  Voice tab header (`src/components/ProjectSwitcher.tsx`). No blue-tinted tile, no initials-in-a-box (no box-in-a-box
  nesting), no heavy card styling, and the dropdown must animate open (expo ease-out, reduced-motion safe). Copy uses
  "brand"/"brands", never "project"/"projects".
- **UI contract (locked, non-negotiable):** `DESIGN.md` at the repo root pins EVERY value and component recipe
  from the locked Synthover design (colors, radii, text sizes, spacing, hover states, copy). The build is a 1:1
  reproduction of that document. No restyling, no "improvements", no iteration on the look. The only deviations
  allowed are the exhaustive list in DESIGN.md §11.

## Stack

- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind 4 + **shadcn/ui** + react-router-dom + lucide-react + `@supabase/supabase-js`.
- **Server:** Express 5 (ESM, plain JS) in `server/` — a single Node process serves the built UI + API in production.
- **Data/Auth:** Supabase (Postgres + email/password Auth). Server verifies access tokens against Supabase's `/auth/v1/user` (algorithm-agnostic; survives JWT key rotation to ECC/ES256) and uses the service-role key for DB.
- **AI:** OpenCode Zen (replaces OpenRouter). Server key + base URL + model from `OPENCODE_API_KEY` / `OPENCODE_BASE_URL` / `OPENCODE_MODEL` env. Model = **`big-pickle`** (the free model), base URL `https://opencode.ai/zen/v1`, verified live 2026-08-05.
- **Image library:** real backgrounds. A platform Apify key pulls Pinterest images by the Brain's niche and caches them in each project's `imagePacks` for reuse across slideshows (pooling keeps cost down). NO bundled starter packs in v1. Slides always show real photos; there is no gradient state in the UI (empty state → skeleton loader → image-backed cards).
- **Billing:** Lemon Squeezy (merchant of record). Free = 3 lifetime generations (watermarked exports); Creator = $19/mo or $190/yr, 100 slideshows/mo (placeholder), no watermark, 3 brand projects; Studio = $49/mo or $490/yr, 500 slideshows/mo (placeholder), no watermark, 10 brand projects. Webhook flips plan between `free` / `creator` / `studio` by variant ID.
- **Projects:** brand voices live on projects, not the user. Free = 1 project, Creator = 3, Studio = 10 (each project owns its own Brain). Queue rows belong to a project. Caps (monthly gens, projects) are placeholders until launch.

## How to run

```bash
npm install
npm run dev     # Vite (5173) + server (8787) together
npm run build   # tsc + vite build
npm start       # single process, serves dist + API on PORT (default 8787)
```

Env vars (see `.env.example`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`,
`SUPABASE_STORAGE_BUCKET`, `OPENCODE_API_KEY`, `OPENCODE_MODEL`, `OPENCODE_BASE_URL`, `APIFY_API_KEY`, `APIFY_ACTOR_ID`,
`LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_URL`, `LEMON_SQUEEZY_VARIANT_ID`,
`LEMON_SQUEEZY_VARIANT_ID_ANNUAL`, `LEMON_SQUEEZY_VARIANT_ID_STUDIO`, `LEMON_SQUEEZY_VARIANT_ID_STUDIO_ANNUAL`,
`APP_URL`, `PORT`, `BRAND_NAME`.

## File map (once scaffolded)

- `server/index.js` — Express app + all routes
- `server/auth.js` — JWT verify middleware → `req.user`
- `server/db.js` — Supabase service-role client
- `server/generate.js` — Brain → prompt → OpenCode → parse slideshows
- `server/openrouter.js` — OpenCode chat call (env-driven, replaces OpenRouter) + tolerant JSON parse
- `server/images.js` — Apify Pinterest pull → download → Supabase Storage → same-origin `/api/images/:hash`
- `server/limits.js` — usage limits (3 lifetime free / 100 monthly creator / 500 monthly studio / 10 per hr)
- `server/lemon.js` — Lemon Squeezy webhook (HMAC verify + plan flip)
- `src/lib/brand.ts` — `BRAND_NAME` + brand tokens
- `src/lib/render.ts` — 1080×1920 canvas renderer + background-only export
- `src/lib/watermark.ts` — free-tier watermark baked into exports
- `src/pages/` — `Landing`, `Auth`, `AppShell`
- `src/views/` — `DashboardView`, `LibraryView`, `BrandVoiceView`, `BillingView` (finalized sidebar: Generate · Dashboard · Library · Brand Voice · Plan & Billing)
- `src/components/ui/*` — shadcn components

## Process rules

- Build order comes from `PROGRESS_TRACKER.md` — work phases in order, tick boxes as you go.
- **No em dashes in UI copy.** Every user-facing string (buttons, captions, empty states, errors, landing copy) uses periods, commas, or colons instead of "—". Standing user rule; do not reintroduce em dashes.
- **Slideshows, never carousels.** The output is always a slideshow / slides. "Carousel" is banned from user-facing copy AND from code comments and docs; say "slideshow" instead. Standing user rule; do not reintroduce it.
- UI components come from **shadcn/ui** — never hand-roll buttons/cards/dialogs.
- **No ad-hoc UI styling.** The visual design comes from the locked Synthover design, pinned verbatim in
  `DESIGN.md` and extracted into global CSS + theme tokens (`src/index.css`). Do not invent a design during
  implementation, and do not deviate from `DESIGN.md` (see the UI contract rule above).
- Design phase comes first: brand file → scaffold → `/design1` batches → chosen design → then build.
- MVP scope is fixed (see BUILD_PLAN.md): no posting/scheduling/analytics, backgrounds = Pinterest image
  library via a platform Apify key (no bundled starter packs), one Brain per project (brand voices live on
  projects, not users), client-side watermark. Source of truth for what Elion is: `PRD.md`.

## Source of truth

- `BUILD_PLAN.md` — architecture, data model, API, all implementation detail.
- `PROGRESS_TRACKER.md` — task checklist (tick as you go).
- `context/` — transferred history: memory, planning state, reference README, workflow rules.

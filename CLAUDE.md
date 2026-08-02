# CLAUDE.md — Elion

## What this is

**Elion** ("Elion AI") is a hosted, multi-tenant **carousel slideshow generator** for solo TikTok/Instagram creators.
Core value: **"Your story, told in your voice."** A creator sets up a **Brain** (niche, audience, style memory), the AI
writes carousel scripts in that voice, they review/edit, then export 1080×1920 PNG backgrounds + copyable text to post
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

## Stack

- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind 3 + **shadcn/ui** + react-router-dom + lucide-react + `@supabase/supabase-js`.
- **Server:** Express 5 (ESM, plain JS) in `server/` — a single Node process serves the built UI + API in production.
- **Data/Auth:** Supabase (Postgres + email/password Auth). Server verifies the JWT and uses the service-role key for DB.
- **AI:** OpenRouter server key. Model from `OPENROUTER_MODEL` env (default cheapest Gemini Flash; swap to Claude Haiku later).
- **Billing:** Lemon Squeezy. Webhook flips plan between `free` / `pro`.

## How to run

```bash
npm install
npm run dev     # Vite (5173) + server (8787) together
npm run build   # tsc + vite build
npm start       # single process, serves dist + API on PORT (default 8787)
```

Env vars (see `.env.example`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`,
`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_URL`,
`LEMON_SQUEEZY_VARIANT_ID`, `APP_URL`, `PORT`, `BRAND_NAME`.

## File map (once scaffolded)

- `server/index.js` — Express app + all routes
- `server/auth.js` — JWT verify middleware → `req.user`
- `server/db.js` — Supabase service-role client
- `server/generate.js` — Brain → prompt → OpenRouter → parse slideshows
- `server/limits.js` — usage limits (3 lifetime free / 300 monthly pro / 10 per hr)
- `server/lemon.js` — Lemon Squeezy webhook (HMAC verify + plan flip)
- `src/lib/brand.ts` — `BRAND_NAME` + brand tokens
- `src/lib/render.ts` — 1080×1920 canvas renderer + background-only export
- `src/lib/watermark.ts` — free-tier watermark baked into exports
- `src/pages/` — `Landing`, `Auth`, `AppShell`, `Compare`
- `src/views/` — `BrainView`, `QueueView`, `PlanView`
- `src/components/ui/*` — shadcn components

## Process rules

- Build order comes from `PROGRESS_TRACKER.md` — work phases in order, tick boxes as you go.
- UI components come from **shadcn/ui** — never hand-roll buttons/cards/dialogs.
- **No ad-hoc UI styling.** The visual design comes from the chosen `/compare` design, extracted into global CSS +
  theme tokens. Do not invent a design during implementation.
- Design phase comes first: brand file → scaffold → `/compare` batches → chosen design → then build.
- MVP scope is fixed (see BUILD_PLAN.md): no posting/scheduling, no image library, one Brain per user,
  gradients-only backgrounds, client-side watermark.

## Source of truth

- `BUILD_PLAN.md` — architecture, data model, API, all implementation detail.
- `PROGRESS_TRACKER.md` — task checklist (tick as you go).
- `context/` — transferred history: memory, planning state, reference README, workflow rules.

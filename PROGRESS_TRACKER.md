# PROGRESS_TRACKER — Elion

> Tick boxes as work completes. Header shows current milestone + next action. Phases must be done in order.

**Current milestone:** Planning setup (Phase A) — in progress
**Last updated:** 2026-08-02
**Next action:** Approve planning docs, then Phase C design exploration (name = Elion)

---

## Phase A — Planning setup

- [x] Create `C:\Users\USER\Documents\elion` folder (sibling of old folder)
- [x] Transfer context files → `elion/context/` (memory.md, _PLANNING_STATE.md, reference-README.md, WORKFLOW.md)
- [x] Write `CLAUDE.md`
- [x] Write `BUILD_PLAN.md`
- [x] Write this `PROGRESS_TRACKER.md`
- [ ] Fresh git repo in elion + initial commit
- [ ] Report back to user (stop — no code yet)

## Phase C — Design exploration (AFTER planning; user-led)

### C1. Brand file
- [ ] User picks final brand direction / confirms Elion positioning
- [ ] Write brand markdown file in `elion/` (BRAND.md): color palette, tagline, positioning ("Your story, told in your voice"), audience voice
- [ ] Define `BRAND_NAME` + brand tokens (placeholder until then)

### C2. Scaffold (React + shadcn)
- [ ] `npm create vite@latest` (react-ts) into elion root
- [ ] Tailwind 3 + postcss + autoprefixer config
- [ ] `shadcn init` + add base components (button, card, input, textarea, label, dialog, tabs, badge, dropdown-menu, select, toast)
- [ ] Express 5 server skeleton + `concurrently` dev script
- [ ] `.env.example`, `supabase/schema.sql`, vite proxy `/api → server`
- [ ] React Router routes: `/`, `/auth`, `/app`, `/compare`
- [ ] `src/lib/brand.ts` with BRAND_NAME

### C3. `/compare` design studio
- [ ] Build Compare page: renders 4–6 **completely different** non-functional mockups of the core UI (different layout, hierarchy, style, fonts, margins)
- [ ] Batch 1 presented to user
- [ ] Iterate batches of 5–6 new designs until user picks one
- [ ] Extract chosen design → global CSS / shadcn theme tokens / Tailwind config

## Phase 0 — Scaffold (app foundation)

- [ ] Vite + React 19 + TS + Tailwind + shadcn wired (from C2)
- [ ] Express skeleton: `/api/health`, json body limit 50mb, SPA fallback in prod
- [ ] `npm run dev` boots Vite + server together; `npm run build`; `npm start`
- [ ] Supabase schema applied (profiles, queue, RLS) + profile auto-create on login

## Phase 1 — Auth

- [ ] Supabase project created + auth email/password enabled
- [ ] `src/lib/supabase.ts` client (anon key, VITE_ env)
- [ ] Signup + login forms (`/auth`)
- [ ] Server JWT verify middleware (`server/auth.js`, HS256 via SUPABASE_JWT_SECRET)
- [ ] `GET /api/me` returns profile + plan + usage
- [ ] Protected `/app` (redirect to `/auth` when no session)

## Phase 2 — Brain

- [ ] BrainView: 5 fields (niche, app name, app description, audience, style memory)
- [ ] `PUT /api/brain` (whitelist keys) + debounced autosave
- [ ] Load brain into form on mount (from `/api/me`)

## Phase 3 — Generation

- [ ] `server/openrouter.js` (chat JSON, tolerant parse, attribution headers)
- [ ] `server/generate.js` (prompt from brain, batch loop, gradient assignment)
- [ ] `server/limits.js` (3 lifetime / 300 monthly / 10 per hr; counters only on success)
- [ ] `POST /api/generate` → checks → generate → insert queue rows → return
- [ ] GenerateModal (count 1/3/5/10) + generate button in QueueView
- [ ] Error surface for 403/429 with upgrade CTA

## Phase 4 — Queue UI + editor

- [ ] `GET /api/queue`, `PUT /api/queue/:id`, `DELETE /api/queue/:id`
- [ ] QueueView cards (slide preview grid, rationale, hook, caption, hashtags, Edit/Export/Delete)
- [ ] SlidePreview (9:16 gradient thumbnail)
- [ ] SlideshowEditorModal — Post tab (caption, hashtags), Slide tab (per-slide text, gradient shuffle, delete slide), preview + prev/next dots

## Phase 5 — Export

- [ ] `src/lib/render.ts` — 1080×1920 gradient + vignette, background-only
- [ ] `src/lib/watermark.ts` — free-tier BRAND_NAME watermark; skipped for pro
- [ ] Export tab: Download bg (per slide), Download all, Copy text (per slide), Copy all text
- [ ] Watermark gated on plan from `/api/me`

## Phase 6 — Billing

- [ ] Lemon Squeezy store + Pro variant created
- [ ] `GET /api/upgrade-url` (checkout + custom user_id)
- [ ] `POST /api/lemon/webhook` (HMAC verify; plan flip; idempotent)
- [ ] PlanView (plan, usage counters, Upgrade, refresh)
- [ ] Watermark/limits respect live plan after webhook

## Phase 7 — Landing + polish

- [ ] Landing page (hero, pricing, signup, login) styled from chosen design
- [ ] Auth page styled
- [ ] Empty states, loading states, error toasts (sonner)
- [ ] Copy pass on all user-facing strings (BRAND_NAME everywhere)

## Phase 8 — Deploy

- [ ] Render web service (Node, `npm run build` + `npm start`)
- [ ] Env vars set in Render (all from §13 of BUILD_PLAN)
- [ ] `/api/health` green on Render
- [ ] Prod verification: signup → brain → generate → edit → export (watermark logic) → upgrade → clean export

---

## Open items

- [ ] **Domain check** `elion.ai` availability — method to be agreed (user rejected Bash RDAP + WebFetch-whois)
- [ ] Trademark clearance for "Elion" in content-creation category (informational; brand owns the lane)
- [ ] Post-launch: Claude Haiku model swap, stock background packs, server-side watermark (v2)

## Done / shipped

(nothing yet — planning in progress)

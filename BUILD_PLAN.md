# BUILD_PLAN — Elion (clean-room slideshow SaaS)

Name locked: **Elion** ("Elion AI"). Folder: `C:\Users\USER\Documents\elion`. Core value: **"Writes your slideshow for you."**

This is the single source of truth for the implementation. Follow `PROGRESS_TRACKER.md` for ordering; this doc has the how.
Source of truth for *what* the product is: `PRD.md`. Reconcile any disagreement against the PRD, then fix this doc.

---

## 1. Product (locked 2026-08-04)

- **Who:** solo TikTok/IG creators. Non-technical. They post slideshows on a schedule and want the next post fast.
- **Flow:** sign up → set up your Brain (niche, app name, app description, audience, style memory) → Generate (AI writes the script, Elion supplies the background images) → review/edit in the Queue → export 1080×1920 PNG backgrounds + copyable text → post manually in the native app.
- **Pricing:** Free = 3 lifetime generations (watermarked exports), **1 project**. Creator = **$19/mo or $190/yr**, **100** slideshows/month (placeholder, tune before launch), zero watermark, **3 brand projects** (each owns its own Brain). Studio = **$49/mo or $490/yr**, **500** slideshows/month (placeholder), zero watermark, **10 brand projects**. Anti-abuse: hard **10 generations/hr/user** rate limit at the API route.
- **Backgrounds = a real image library:** Pinterest pulls via a **platform-held Apify key** (actor `fatihtahta/pinterest-scraper-search`), downloaded and stored for reuse across slideshows (pooling keeps cost low). **NO bundled starter packs in v1** (they may return as a paid-plan perk). Every slide gets a real photo; no gradient state in the UI (empty state → skeleton loader → image-backed cards).
- **Explicitly NOT in MVP:** posting/scheduling/analytics (no post-bridge — manual posting in native apps), bring-your-own-keys, self-hosting, OAuth (email + password only), user image uploads.

## 2. Architecture

```
Browser (React 19 + Vite + shadcn, served from dist)
   │  @supabase/supabase-js (email+password auth)  ·  fetch /api (Bearer JWT)
   ▼
Express 5 — single Node process (PORT, binds 0.0.0.0 in prod)
   ├─ auth middleware: verify Supabase JWT (HS256) → req.user = { id }
   ├─ db: Supabase service-role client (bypasses RLS) → profiles, projects, queue
   ├─ POST /api/generate → limits check → OpenCode (server key) → parse → resolve backgrounds → insert queue
   ├─ images: Apify Pinterest pull (platform key) → download → Supabase Storage → same-origin proxy
   ├─ GET /api/images/:hash → same-origin bytes (canvas export is never tainted)
   ├─ POST /api/lemon/webhook (HMAC-verified, public) → flip profiles.plan
   └─ static: serves dist/ with SPA fallback (non-/api GET → index.html)
```

## 3. Stack + dependencies

- `react`, `react-dom` ^19, `react-router-dom` ^7, `lucide-react`
- `@supabase/supabase-js` (browser auth + server service-role + storage)
- `express` ^5, `jose` (server JWT verify)
- dev: `vite` ^8, `@vitejs/plugin-react`, `typescript`, `tailwindcss` ^4 (via `@tailwindcss/vite`), `concurrently`, shadcn/ui deps (radix + class-variance-authority + clsx + tailwind-merge + tw-animate-css)
- Fonts via `@fontsource-variable/*`: schibsted-grotesk (display), inter-tight (body + sidebar), dm-sans (numbers)
- Scripts: `dev` = `concurrently "vite" "node --watch server/index.js"`; `build` = `tsc --noEmit && vite build`; `start` = `node server/index.js`

## 4. Repo layout

```
elion/
  CLAUDE.md  BUILD_PLAN.md  PROGRESS_TRACKER.md  PRD.md  PRODUCT.md  BRAND.md  context/
  package.json  vite.config.ts  index.html  .env.example  tsconfig.json  components.json
  supabase/schema.sql
  server/   index.js  auth.js  db.js  generate.js  openrouter.js  images.js  limits.js  lemon.js
  src/
    main.tsx  App.tsx  index.css
    lib/  brand.ts  api.ts  types.ts  supabase.ts  render.ts  watermark.ts  format.ts
    pages/  Landing.tsx  Auth.tsx  AppShell.tsx
    views/  DashboardView.tsx  LibraryView.tsx  BrandVoiceView.tsx  BillingView.tsx
    components/  Sidebar.tsx  GenerateModal.tsx  SlideshowEditorModal.tsx  SlidePreview.tsx  UsageWidget.tsx
    components/ui/  (shadcn: button, card, input, textarea, label, dialog, tabs, badge, dropdown-menu, select, sonner/toast)
    components/design1/  (design exploration gallery — Synthover is the locked winner, not shipped)
```

## 5. Data model (`supabase/schema.sql`)

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','creator','studio')),
  total_gens int not null default 0,      -- free = 3 lifetime (all projects share the quota)
  monthly_gens int not null default 0,    -- paid = cap/month (creator 100 / studio 500, month-windowed)
  month_start timestamptz not null default now(),
  ls_subscription_id text,                -- Lemon Squeezy ref (idempotent webhook)
  created_at timestamptz not null default now()
);

-- Brand voices live on projects. Free = 1 project, Creator = 3, Studio = 10 (project cap = plan).
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My brand',
  brain jsonb not null default '{}'::jsonb, -- {niche, appName, appDescription, audience, styleMemory}
  imagePacks jsonb not null default '[]'::jsonb, -- [{id, url, pulledAt}] reusable background pool (Pinterest pulls)
  created_at timestamptz not null default now()
);
create index on public.projects (user_id, created_at desc);

create table public.queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  data jsonb not null,   -- Slideshow {id, hook, caption, hashtags[], rationale, slides[{id, text, bg}], status, createdAt}
  created_at timestamptz not null default now()
);
create index on public.queue (user_id, project_id, created_at desc);
```

On signup, a trigger inserts a profile row + a default "My brand" project. `brain` defaults to `{}`; treat missing fields as empty strings. RLS is defense-in-depth (server uses the service role which bypasses RLS); see schema.sql for the policies.

## 6. Auth + middleware

- Frontend: `@supabase/supabase-js` — `auth.signUp({email, password})`, `auth.signInWithPassword`, `auth.onAuthStateChange`, `auth.getSession`. Attach `Authorization: Bearer <access_token>` to every `/api` call.
- Server `server/auth.js`: parse Bearer token → verify HS256 signature with `SUPABASE_JWT_SECRET`, check `exp`, set `req.user = { id: payload.sub }`. Reject 401 on failure. Applied to every `/api` route except `health` and `lemon/webhook`.
- First-login safety: on any authed request, if no profile row exists for the user, upsert one (handles trigger-less setups).

## 7. API surface (all JSON; errors → `{ error: message }`)

Public:
- `GET /api/health` → `{ ok: true }`
- `POST /api/lemon/webhook` → HMAC-verify, handle events, always 200 (LS retries on non-2xx)

Authed:
- `GET /api/me` → `{ id, plan, totalGens, monthlyGens, monthStart, limit: { total: 3, monthly: 100, monthlyStudio: 500, hourly: 10, projects: { free: 1, creator: 3, studio: 10, pro: 3 } }, projects: [{id, name, brain, imagePacks}], activeProjectId }`
- `POST /api/projects` body `{name?}` → create (free ≤ 1, creator ≤ 3, studio ≤ 10); returns project
- `GET /api/projects` → list user's projects
- `PUT /api/projects/:id` body `{name?, brain?}` → rename / update brain (whitelist: niche, appName, appDescription, audience, styleMemory)
- `DELETE /api/projects/:id` → remove project + its queue rows
- `POST /api/generate` body `{count, projectId}` → limits check → generate from that project's brain → resolve backgrounds → insert queue rows → return `Slideshow[]`
- `GET /api/queue?projectId=` → slideshows for a project (newest first)
- `PUT /api/queue/:id` body `{caption?, hashtags?, hook?, slides?}` → merge whitelisted fields into `data`
- `DELETE /api/queue/:id` → remove
- `GET /api/library?projectId=` → project's `imagePacks` (the reusable background pool)
- `POST /api/library/pull` body `{query?, projectId}` → Apify Pinterest scrape (or dev fallback) → download → store → append to `imagePacks`; returns the new entries
- `GET /api/images/:hash` → same-origin image bytes (proxy/cache; the only way the client loads slide backgrounds, so canvas export is never tainted)
- `POST /api/exports` body `{projectId, slideshowId, caption?, hashtags?, slides: [{text, bg}]}` → snapshot a finished slideshow to a 24h share link; returns `{token, url}`
- `GET /s/:token` → public phone page for a share (images same-origin + copyable text block); 404 after expiry
- `GET /api/upgrade-url` → LS checkout URL with `checkout[custom][user_id]=<id>` and variant id

## 8. Generation (`server/generate.js` + `server/openrouter.js` + `server/images.js`)

**Prompt** (freshly authored — do NOT copy SlideSmith's): system context includes the active project's Brain fields (niche, appName, appDescription, audience, styleMemory) and rules: short-form TikTok/IG slideshow, hook max ~8 words scroll-stopper on slide 1, 5–6 slides, max ~8 words each, last slide = CTA ("Save this"), caption with 1–2 emoji, 3 hashtags, one-line rationale tied to the style memory. Ask for N slideshows as JSON `{ "slideshows": [{hook, slides[], caption, hashtags[], rationale}] }`.

**Call:** OpenAI-compatible `/chat/completions` against **OpenCode Zen** (retires OpenRouter, locked 2026-08-05): base URL `OPENCODE_BASE_URL` (default `https://opencode.ai/zen/v1`), `Authorization: Bearer <OPENCODE_API_KEY>`, `model: OPENCODE_MODEL` = **`big-pickle`** (the free model, verified live), `max_tokens: 6000`, `response_format: { type: 'json_object' }`.

**Parse:** tolerant — strip ``` fences, slice from first `{` to last `}`, `JSON.parse`.

**Batch:** request ~6 per call, loop until `count` reached; break early if a batch is empty. Cap `count` 1–100.

**Backgrounds:** for each generated slideshow, resolve one image per slide from the project's `imagePacks` pool (rotate/reuse), pulling a fresh Pinterest batch by the Brain's niche when the pool is empty. Each slide stores `bg: { id, url }` where the client always loads `/api/images/<id>` (same-origin). No gradients are ever the designed state; empty pool → images get pulled first.

**Normalize** each into `Slideshow`:
```ts
{ id: 'q-<ts>-<i>', hook, caption, hashtags: [], rationale, createdAt: ISO, status: 'Draft',
  slides: [{ id: 'slide-<ts>-<i>-<j>', text, bg: { id, url } }] }
```

## 9. Image library (`server/images.js`)

- **Apify pull:** `POST /api/library/pull` runs the Pinterest search actor with the platform key, parses `pinimg.com` results, validates HTTPS-only URLs, downloads the bytes, stores them in Supabase Storage bucket `backgrounds` (key = sha256 of the URL), and appends `{id, url, pulledAt}` to the project's `imagePacks`.
- **Dev fallback:** when `APIFY_API_KEY` is unset, `pull` returns deterministic picsum URLs (stand-ins for the Pinterest pool) so the whole app is testable without keys. Prod requires the real key.
- **Same-origin serving:** `GET /api/images/:hash` streams bytes from storage (cache-first). The client loads every slide/library thumbnail and every canvas image from this route → no taint, and the route enforces HTTPS-only + an allowlist (Phase 9: no SSRF).
- **Pooling:** pulls are cached and reused across slideshows, which is what makes the $19/100 cap hold margin (PRD §6).

## 10. Usage limits (`server/limits.js`)

Check before generating (single transaction to avoid races on counters):
1. Load profile; resolve the requested `projectId` (must belong to the user).
2. **Hourly anti-abuse (all tiers):** in-memory `Map<userId, timestamps[]>`; drop entries older than 60 min; if length ≥ 10 → 429. Hard cap enforced at the API route.
3. **Free:** `total_gens >= 3` → 403 `"Free plan includes 3 lifetime generations. Upgrade to Creator."`
4. **Paid:** if `month_start` < start of current calendar month → reset `monthly_gens=0`, `month_start=now()`. If `monthly_gens >= cap` (creator 100 / studio 500, config) → 403.
5. Generate. **On success only:** `total_gens+1`, and for paid `monthly_gens+1`, then save. (Failed generations do not consume quota.)
6. Hourly limiter increments on attempt regardless (anti-abuse).

Caps live behind a config object (`LIMITS`) so the real numbers are set before launch without code changes.

## 11. Export + watermark (`src/lib/render.ts`, `src/lib/watermark.ts`)

- Canvas **1080×1920**. Draw the slide's background image (via `/api/images/:id`) + a light scrim for text legibility. Background-only — text is added in TikTok's native font.
- Buttons: **Download bg** per slide, **Download all** (all slides → `elion-slide-N.png`), **Copy text** per slide, **Copy all text** (`Slide 1: …\nSlide 2: …`).
- **Watermark (free tier):** before `toDataURL`, draw `BRAND_NAME` diagonal, semi-transparent white (~14% alpha, large font, center band) across the canvas. Paid plans: skip. Client decides from `/api/me`.

## 12. Billing (`server/lemon.js`)

- **Checkout:** `GET /api/upgrade-url` → `${LEMON_SQUEEZY_STORE_URL}/buy/${LEMON_SQUEEZY_VARIANT_ID}?checkout[custom][user_id]=${userId}` (annual uses `LEMON_SQUEEZY_VARIANT_ID_ANNUAL`, studio uses `LEMON_SQUEEZY_VARIANT_ID_STUDIO[_ANNUAL]`). Client redirects.
- **Webhook `POST /api/lemon/webhook`:** verify `X-Signature` = HMAC-SHA256 of the raw body with `LEMON_SQUEEZY_WEBHOOK_SECRET`. Parse event name from `meta.event_name`. Handle:
  - `order_created`, `subscription_created`, `subscription_updated` → plan by variant ID (`creator` or `studio`), store `ls_subscription_id` (idempotent: match on subscription id). Legacy `pro` rows are treated as `creator`.
  - `subscription_cancelled`, `subscription_expired` → plan = `free`.
  - Map user via `meta.custom_data.user_id` (fallback: `data.attributes.customer_email`).
- `BillingView` shows plan + usage counters + Upgrade buttons for Creator (monthly $19 / annual $190) and Studio (monthly $49 / annual $490) + "Already paid? Refresh".

## 13. Frontend

Routes (react-router):
- `/` **Landing** — hero "Writes your slideshow for you", product blurb, pricing (Free / Creator $19/mo or $190/yr / Studio $49/mo or $490/yr), email signup, login link. Dark, on the Synthover palette.
- `/auth` **Auth** — sign up / sign in forms (mode toggle) using Supabase; on success → `/app`.
- `/app` **AppShell** — protected (redirect to `/auth` if no session). Pinned sidebar matching the locked Synthover design: wordmark (real logo) · **Generate** (nav-style white row) · **Dashboard** · **Library** · **Brand Voice** · **Plan & Billing** · pinned bottom: free-plan widget (status + meter + Upgrade link), **Settings** · **Sign out** · account block. Active nav = text + icon turn blue, no bg.
  - **DashboardView** — empty state (new user) → skeleton loader (generating) → image-backed cards. Cards: slide-thumb filmstrip, status badge (Draft / Ready / Exported), hook, caption clamp, hashtag pills, Edit / Export / Delete. "Generate" opens the GenerateModal (count 1/3/5/10) → `POST /api/generate`. Error banners for 403/429 with upgrade CTA.
  - **LibraryView** — search + "Pull new" (`POST /api/library/pull`) + filter chips + image grid with pick state. "Use on slide" surfaces in the editor.
  - **BrandVoiceView** — 5 fields for the active project (niche, app name, app description, audience, style memory), debounced autosave via `PUT /api/projects/:id`. Free = one project; paid plans get a project switcher + "New brand".
  - **BillingView** — current plan, usage (`totalGens/3` free; `monthlyGens/100` creator; `monthlyGens/500` studio), Upgrade (Creator monthly $19 / annual $190; Studio monthly $49 / annual $490), refresh, plan gates on export watermark.
  - **SlideshowEditorModal** — tabs **Post** (caption + char count, hashtags), **Slides** (per-slide text, background swap from library / shuffle / Browse Library, delete slide if >1), **Export** (per-slide Download bg + Copy text, Download all backgrounds, Copy all text). Left: 9:16 preview with prev/next dots. Esc to close; backdrop dim + hairline panel (modal = the only elevated layer).
- `/design1` — design exploration gallery (kept for reference; Synthover is the winner, not shipped).

Brand: `src/lib/brand.ts` → `export const BRAND_NAME = 'Elion'`; watermark + landing use it. Theme = shadcn CSS variables extracted from Synthover (page `#08080A`, hairline `#1E2028`, accent `#3B82F6` glass, white actions).

## 14. Env vars (`.env.example`)

| Var | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server DB access (secret) |
| `SUPABASE_JWT_SECRET` | Verify user JWTs |
| `SUPABASE_STORAGE_BUCKET` | Bucket for background images (default `backgrounds`) |
| `OPENCODE_API_KEY` | OpenCode Zen generation key (retires OpenRouter) |
| `OPENCODE_MODEL` | **`big-pickle`**, the free model on OpenCode Zen (locked 2026-08-05) |
| `OPENCODE_BASE_URL` | OpenCode Zen base URL (default `https://opencode.ai/zen/v1`) |
| `APIFY_API_KEY` | Pinterest scraping (platform key) |
| `APIFY_ACTOR_ID` | Pinterest search actor (default `fatihtahta/pinterest-scraper-search`) |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook HMAC |
| `LEMON_SQUEEZY_STORE_URL` | `https://<store>.lemonsqueezy.com` |
| `LEMON_SQUEEZY_VARIANT_ID` | Creator monthly variant ($19/mo) |
| `LEMON_SQUEEZY_VARIANT_ID_ANNUAL` | Creator annual variant ($190/yr) |
| `LEMON_SQUEEZY_VARIANT_ID_STUDIO` | Studio monthly variant ($49/mo) |
| `LEMON_SQUEEZY_VARIANT_ID_STUDIO_ANNUAL` | Studio annual variant ($490/yr) |
| `APP_URL` | Public origin (landing links, redirects) |
| `PORT` | Server port (Render sets this) |
| `BRAND_NAME` | Optional override of brand.ts |

Frontend reads `VITE_*` via `import.meta.env` (only non-secret: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## 15. Build phases (order = PROGRESS_TRACKER.md)

0. **Scaffold** — repo exists; Vite+React+TS+Tailwind+shadcn, Express skeleton, env example, schema.sql, scripts, `npm run dev` boots both.
1. **Design tokens** — DONE. Synthover extracted to `src/index.css` (design-role tokens + shadcn semantic mapping, dark-only, fonts trimmed). **UI contract: `DESIGN.md`** (repo root) pins every value + component recipe verbatim; the build reproduces it 1:1 with NO deviation (allowed deviations only per DESIGN.md §11). Remaining: theme the shadcn/ui components to the DESIGN.md values.
2. **Auth** — schema applied, signup/login, `/api/me`, protected `/app`, profile auto-create.
3. **Brain + projects** — BrandVoiceView, project CRUD, autosave, active project.
4. **Generation** — openrouter.js, generate.js, images.js, limits.js, `POST /api/generate`, queue insert.
5. **Queue UI + editor** — DashboardView, GenerateModal, SlidePreview, SlideshowEditorModal (Post/Slides tabs).
6. **Export** — render.ts, watermark.ts, Export tab (downloads + copy text).
7. **Library** — LibraryView, `GET /api/library`, `POST /api/library/pull`, image grid + pick, editor background swap.
8. **Billing** — upgrade-url (monthly + annual), webhook, BillingView, plan gates on export watermark.
9. **Landing + polish** — Landing, Auth styling, empty states, error handling.
10. **Security hardening** — see PROGRESS_TRACKER Phase 9 checklist.

## 16. Verification

- **Per phase:** `npm run build` (tsc + vite) clean; exercise the specific behavior with `npm run dev`.
- **End-to-end (Playwright):** new user signs up → Brand Voice saved → Generate (3) → cards appear → Edit text → swap a background → Export → PNGs download (free = watermark visible) → Upgrade via webhook (simulate with `LEMON_SQUEEZY_WEBHOOK_SECRET` + a signed test payload) → export now clean → Library pull adds images → limits: free 4th gen → 403, 10/hr → 429.
- **Prod:** `npm run build` + `npm start`; `/api/health` green; signup→generate works.

## 17. Risks / notes

- "Elion" has namesakes in other categories (Elion Health, an "Elion AI" agents platform, ELION voice agents, elion.media). Different markets — usable, but the brand work must own the content-creation lane. **Domain `elion.ai` availability: OPEN.**
- **Model (locked 2026-08-05):** **`big-pickle`** on **OpenCode Zen** (`https://opencode.ai/zen/v1`) is the generation model, the free model, verified live. Other OpenCode models available: `glm-5`, `glm-5.1`, `glm-5.2`, plus claude/gemini/gpt families. OpenRouter is retired. Driven entirely by env (`OPENCODE_MODEL`); never hardcode a model name in code. Inference cost is the margin lever.
- **Plan caps + project model (locked 2026-08-06):** no plan is unlimited. Creator = 100 slideshows/month (placeholder) + 3 brand projects (each with its own Brain); Studio = 500 slideshows/month (placeholder) + 10 brand projects; free = 1 project, 3 lifetime gens. Legacy `pro` profiles are treated as Creator. Exact caps are placeholders — set real numbers before launch, behind the `LIMITS` config.
- **Margin math (pre-launch, PRD §6):** real per-generation cost (OpenCode + Apify amortized across pooled backgrounds + storage/bandwidth) must leave margin at Creator $19/100 and Studio $49/500. Pooling is required; if fresh-per-gen, lower the cap.
- **Canvas taint:** all background images load same-origin through `/api/images/:hash`; never render from a cross-origin URL into the export canvas.
- Client-side watermark is accepted for MVP (v2 = server-side).
- No em dashes in any user-facing string. Slideshows / slides, never "carousels".

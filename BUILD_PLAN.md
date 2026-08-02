# BUILD_PLAN — Elion (clean-room carousel SaaS)

Name locked: **Elion** ("Elion AI"). Folder: `C:\Users\USER\Documents\elion`. Core value: **"Your story, told in your voice."**

This is the single source of truth for the implementation. Follow `PROGRESS_TRACKER.md` for ordering; this doc has the how.

---

## 1. Product (locked)

- **Who:** solo TikTok/IG creators.
- **Flow:** sign up → set up Brain → AI generates carousels → review/edit → export 1080×1920 PNG backgrounds + text.
- **Pricing:** Free = 3 lifetime generations, watermarked exports. Pro = $19/mo or $99/yr, 300 gens/month, watermark-free. Anti-abuse: 10 generation attempts/hr/user.
- **Explicitly NOT in MVP:** posting/scheduling/analytics, image library (gradients only), multi-project (one Brain per user), phone-transfer, OAuth.

## 2. Architecture

```
Browser (React 19 + Vite + shadcn, served from dist)
   │  @supabase/supabase-js (email+password auth)  ·  fetch /api (Bearer JWT)
   ▼
Express 5 — single Node process on Render (PORT, binds 0.0.0.0 in prod)
   ├─ auth middleware: verify Supabase JWT (HS256) → req.user = { id }
   ├─ db: Supabase service-role client (bypasses RLS) → profiles, queue
   ├─ POST /api/generate → limits check → OpenRouter (server key) → parse → insert queue
   ├─ POST /api/lemon/webhook (HMAC-verified, public) → flip profiles.plan
   └─ static: serves dist/ with SPA fallback (non-/api GET → index.html)
```

## 3. Stack + dependencies

- `react`, `react-dom` ^19, `react-router-dom` ^7, `lucide-react`
- `@supabase/supabase-js` (browser auth + server service-role)
- `express` ^5, `jszip` (not needed MVP — skip unless phone-transfer returns)
- dev: `vite` ^8, `@vitejs/plugin-react`, `typescript`, `tailwindcss` ^3, `postcss`, `autoprefixer`, `concurrently`, shadcn/ui deps (radix + class-variance-authority + clsx + tailwind-merge + tw-animate-css)
- `jose` (server JWT verify) — or verify HS256 manually with `crypto`
- Scripts: `dev` = `concurrently "vite" "node --watch server/index.js"`; `build` = `tsc -b && vite build`; `start` = `node server/index.js`

## 4. Repo layout

```
elion/
  CLAUDE.md  BUILD_PLAN.md  PROGRESS_TRACKER.md  context/
  package.json  vite.config.ts  index.html  .env.example  tsconfig.json  tailwind.config.js
  supabase/schema.sql
  server/   index.js  auth.js  db.js  generate.js  openrouter.js  lemon.js  limits.js
  src/
    main.tsx  App.tsx  index.css
    lib/  brand.ts  api.ts  render.ts  watermark.ts  supabase.ts  types.ts
    pages/  Landing.tsx  Auth.tsx  AppShell.tsx  Compare.tsx
    views/  BrainView.tsx  QueueView.tsx  PlanView.tsx
    components/  Sidebar.tsx  SlidePreview.tsx  GenerateModal.tsx  SlideshowEditorModal.tsx
    components/ui/  (shadcn: button, card, input, textarea, label, dialog, tabs, badge, dropdown-menu, select, sonner/toast)
```

## 5. Data model (`supabase/schema.sql`)

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  total_gens int not null default 0,      -- free = 3 lifetime
  monthly_gens int not null default 0,    -- pro = 300/month
  month_start timestamptz not null default now(),
  ls_subscription_id text,                -- Lemon Squeezy ref (idempotent webhook)
  brain jsonb not null default '{}'::jsonb, -- {niche, appName, appDescription, audience, styleMemory}
  created_at timestamptz not null default now()
);

create table public.queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  data jsonb not null,   -- Slideshow {id, hook, caption, hashtags[], slides[], rationale, createdAt}
  created_at timestamptz not null default now()
);
create index on public.queue (user_id, created_at desc);

-- RLS (defense in depth; server uses service role which bypasses RLS)
alter table public.profiles enable row level security;
alter table public.queue enable row level security;
create policy "own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid());
create policy "own queue" on public.queue for all to authenticated using (user_id = auth.uid());
```

On signup, insert a profile row (via trigger or app code). `brain` defaults to `{}`; treat missing fields as empty strings.

## 6. Auth + middleware

- Frontend: `@supabase/supabase-js` — `auth.signUp({email, password})`, `auth.signInWithPassword`, `auth.onAuthStateChange`, `auth.getSession`. Persist session; attach `Authorization: Bearer <access_token>`.
- Server `server/auth.js`: parse Bearer token → verify HS256 signature with `SUPABASE_JWT_SECRET` (the `anon`/`service_role` JWT secret from Supabase project settings), check `exp`, set `req.user = { id: payload.sub }`. Reject 401 on failure.
- First-login safety: on any authed request, if no profile row exists for the user, create one (upsert) — handles trigger-less setup.

## 7. API surface (all JSON; errors → `{ error: message }`)

Public:
- `GET /api/health` → `{ ok: true }` (Render healthcheck)
- `POST /api/lemon/webhook` → HMAC-verify, handle events, always 200 (LS retries on non-2xx)

Authed:
- `GET /api/me` → `{ id, plan, totalGens, monthlyGens, monthStart, limit: {total: 3, monthly: 300}, brain }`
- `PUT /api/brain` body `{brain}` → upsert brain jsonb (whitelist keys: niche, appName, appDescription, audience, styleMemory)
- `POST /api/generate` body `{count}` → limits check → generate → insert queue rows → return `Slideshow[]`
- `GET /api/queue` → user's slideshows (newest first)
- `PUT /api/queue/:id` body `{caption?, hashtags?, hook?, slides?}` → merge whitelisted fields into `data`
- `DELETE /api/queue/:id` → remove
- `GET /api/upgrade-url` → LS checkout URL with `checkout[custom][user_id]=<id>` and variant id

## 8. Generation (`server/generate.js` + `server/openrouter.js`)

**Prompt** (freshly authored — do NOT copy SlideSmith's): system context includes Brain fields (niche, appName, appDescription, audience, styleMemory) and rules: short-form TikTok/IG carousel, hook max ~8 words scroll-stopper on slide 1, 5–6 slides, max ~8 words each, last slide = CTA ("Save this"), caption with 1–2 emoji, 3 hashtags, one-line rationale tied to the style memory. Ask for N carousels as JSON `{ "slideshows": [{hook, slides[], caption, hashtags[], rationale}] }`.

**Call:** `POST https://openrouter.ai/api/v1/chat/completions` with `Authorization: Bearer <OPENROUTER_API_KEY>`, `model: OPENROUTER_MODEL`, `max_tokens: 6000`, `response_format: { type: 'json_object' }`. Include OpenRouter attribution headers (`HTTP-Referer`, `X-Title`).

**Parse:** tolerant — strip ``` fences, slice from first `{` to last `}`, `JSON.parse`.

**Batch:** request ~6 per call, loop until `count` reached; break early if a batch is empty. Cap `count` 1–100.

**Normalize** each into `Slideshow`:
```ts
{ id: 'q-<ts>-<i>', hook, caption, hashtags: [], rationale, createdAt: ISO,
  slides: [{ id: 'slide-<ts>-<i>-<j>', text, bgFrom, bgTo }] }
```
Assign gradient `bgFrom/bgTo` from the palette below, rotating per slide (no images — gradients only MVP):
```js
const PALETTE = [
  ['#0f172a','#1e293b'], ['#1a1a2e','#16213e'], ['#2d1b1b','#1a1010'],
  ['#0a1f1c','#0f2922'], ['#1f1147','#160d33'], ['#26120a','#1a0c06'],
]
```

## 9. Usage limits (`server/limits.js`)

Check before generating (single transaction to avoid races on counters):
1. Load profile.
2. **Hourly anti-abuse:** in-memory `Map<userId, timestamps[]>`; drop entries older than 60 min; if length ≥ 10 → 429.
3. **Free:** `total_gens >= 3` → 403 `"Free plan includes 3 lifetime generations. Upgrade for 300/month."`
4. **Pro:** if `month_start` < start of current calendar month → reset `monthly_gens=0`, `month_start=now()`. If `monthly_gens >= 300` → 403.
5. Generate. **On success only:** `total_gens+1`, and for pro `monthly_gens+1`, then save. (Failed generations do not consume quota.)
6. Hourly limiter increments on attempt regardless (anti-abuse).

## 10. Export + watermark (`src/lib/render.ts`, `src/lib/watermark.ts`)

- Canvas **1080×1920**. Gradient (`bgFrom→bgTo` 135deg) + radial vignette (matching preview). Background-only — text is added in TikTok's native font.
- Buttons: **Download bg** per slide, **Download all** (all slides → `elion-slide-N.png`), **Copy text** per slide, **Copy all text** (`Slide 1: …\nSlide 2: …`).
- **Watermark (free tier):** before `toDataURL`, draw `BRAND_NAME` diagonal, semi-transparent white (e.g. 14% alpha, large font, center band) across the canvas. Pro: skip. Client decides from `/api/me`.
- `downloadPng(dataUrl, filename)` → create `<a download>` + click.

## 11. Billing (`server/lemon.js`)

- **Checkout:** `GET /api/upgrade-url` → `${LEMON_SQUEEZY_STORE_URL}/buy/${LEMON_SQUEEZY_VARIANT_ID}?checkout[custom][user_id]=${userId}` (also pass email if known). Client redirects.
- **Webhook `POST /api/lemon/webhook`:** verify `X-Signature` = HMAC-SHA256 of raw body with `LEMON_SQUEEZY_WEBHOOK_SECRET`. Parse event name from `meta.event_name`. Handle:
  - `order_created`, `subscription_created`, `subscription_updated` → plan = `pro`, store `ls_subscription_id` (idempotent: match on subscription id).
  - `subscription_cancelled`, `subscription_expired` → plan = `free`.
  - Map user via `meta.custom_data.user_id` (fallback: `data.attributes.customer_email` → look up profile by email if we store it).
- `PlanView` shows plan + usage counters + Upgrade button (opens `/api/upgrade-url`) + "Already paid? Refresh".

## 12. Frontend

Routes (react-router):
- `/` **Landing** — hero "Your story, told in your voice", product blurb, pricing (Free / $19 Pro), email signup, login link.
- `/auth` **Auth** — sign up / sign in forms (mode toggle) using Supabase; on success → `/app`.
- `/app` **AppShell** — protected (redirect to `/auth` if no session). Sidebar: Brain · Queue · Plan · (Compare placeholder, dev-only).
  - **BrainView** — 5 fields: niche, app name, app description, audience, style memory. Debounced autosave via `PUT /api/brain`.
  - **QueueView** — "Generate" button (count picker 1/3/5/10) → `POST /api/generate`. Cards: 6-col slide preview grid (9:16), rationale, hook, caption (2-line clamp), hashtag pills, buttons Edit / Export / Delete. Error banners for limit 403s.
  - **SlideshowEditorModal** — tabs: **Post** (caption textarea + char count, hashtags input), **Slide N** (per-slide text textarea, gradient re-shuffle, delete slide if >1), **Export** (per-slide Download bg + Copy text, Download all backgrounds, Copy all text). Left: 200px preview w/ prev/next dots.
  - **PlanView** — current plan, usage `totalGens/3` (free) or `monthlyGens/300` (pro), Upgrade button, refresh.
- `/compare` **Compare** — design-exploration studio (Phase C). Placeholder in MVP code.

Brand: `src/lib/brand.ts` → `export const BRAND_NAME = 'Elion'`; watermark + landing use it. Theme = shadcn CSS variables (design-phase tokens).

## 13. Env vars (`.env.example`)

| Var | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server DB access (secret) |
| `SUPABASE_JWT_SECRET` | Verify user JWTs |
| `OPENROUTER_API_KEY` | AI generation |
| `OPENROUTER_MODEL` | Default `google/gemini-2.0-flash-001` (cheap); Claude Haiku later |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook HMAC |
| `LEMON_SQUEEZY_STORE_URL` | `https://<store>.lemonsqueezy.com` |
| `LEMON_SQUEEZY_VARIANT_ID` | Pro variant |
| `APP_URL` | Public origin (landing links, redirects) |
| `PORT` | Server port (Render sets this) |
| `BRAND_NAME` | Optional override of brand.ts |

Frontend reads `VITE_*` via `import.meta.env` (only non-secret: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## 14. Build phases (order = PROGRESS_TRACKER.md)

0. **Scaffold** — repo already exists; Vite+React+TS+Tailwind+shadcn, Express skeleton, env example, schema.sql, scripts, `npm run dev` boots both.
1. **Auth** — Supabase project, schema applied, signup/login, `/api/me`, protected `/app`.
2. **Brain** — form + `PUT /api/brain` autosave + load in `/api/me`.
3. **Generation** — openrouter.js, generate.js, limits.js, `POST /api/generate`, queue insert.
4. **Queue UI + editor** — QueueView, GenerateModal, SlidePreview, SlideshowEditorModal (Post/Slide tabs).
5. **Export** — render.ts, watermark.ts, Export tab (downloads + copy text).
6. **Billing** — upgrade-url, webhook, PlanView, plan gates on export watermark.
7. **Landing + polish** — Landing, Auth styling, empty states, error handling.
8. **Deploy** — Render service, env vars, healthcheck, prod verification.

## 15. Verification

- **Per phase:** `npm run dev`, exercise the specific behavior manually.
- **End-to-end:** new user signs up → Brain saved → Generate (3) → cards appear → Edit text → Export → PNGs download (free = watermark visible) → Upgrade via webhook (simulate with `LEMON_SQUEEZY_WEBHOOK_SECRET` + a signed test payload) → export now clean, monthly counter usable.
- **Limits:** free 4th gen → 403; 10 requests in an hour → 429; pro `monthly_gens=300` → 403.
- **Prod:** `npm run build` + `npm start` on Render; `/api/health` green; signup→generate works.

## 16. Risks / notes

- "Elion" has namesakes in other categories (Elion Health, an "Elion AI" agents platform, ELION voice agents, elion.media). Different markets — usable, but the brand work must own the content-creation lane. **Domain `elion.ai` availability: OPEN — verify with a method the user accepts.**
- Gradients-only backgrounds are an MVP constraint (off-limits scraped images).
- Client-side watermark is accepted for MVP (v2 = server-side).

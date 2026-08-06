# PROGRESS_TRACKER — Elion

> Tick boxes as work completes. Header shows current milestone + next action. Phases must be done in order.

**Current milestone:** **DEPLOYED + LIVE 2026-08-06**: https://elion-ix26.onrender.com (auto-deploy via Render Deploy Hook). Pinterest pulls curated (resolution + dedupe gate, parallel downloads, search expansion), Library delete animation fixed, **Phase 11 security hardening COMPLETE**, **plan margin math DONE** (~98% margin at caps; pulls rate-limited 6/hr as the one cost leak), domain check checked off. **UI/UX polish DONE 2026-08-06**: editor phone preview shows slide script text, skeleton loaders on every content tab (never flash empty state), Library delete FLIPs the grid instead of snap. Remaining before launch: Playwright E2E; Lemon Squeezy store finish (ON HOLD until LS verification; ask user when verified).
**Last updated:** 2026-08-06
**Next action:** Playwright E2E (BUILD_PLAN §16) — signup → brain → generate → edit → swap background → export (watermark logic) → upgrade via webhook → clean export → limits (403/429). Then Lemon Squeezy store finish (ask user first, on hold pending LS verification).

---

## Phase A — Planning setup

- [x] Create `C:\Users\USER\Documents\elion` folder (sibling of old folder)
- [x] Transfer context files → `elion/context/` (memory.md, _PLANNING_STATE.md, reference-README.md, WORKFLOW.md)
- [x] Write `CLAUDE.md`
- [x] Write `AGENTS.md` (behavioral contract — no inline CSS, file size limits, anti-slop rules)
- [x] Write `BUILD_PLAN.md`
- [x] Write this `PROGRESS_TRACKER.md`
- [x] Fresh git repo in elion + initial commit (repo `Elion-slideshows`, many commits; public for Render auto-deploy)
- [x] Report back to user (stop — no code yet)

## Phase C — Design exploration (AFTER planning; user-led)

### C1. Brand file — DONE 2026-08-02
- [x] User picks final brand direction: black & white base + one accent (pink/purple out); accent = **blue** since 2026-08-03 (gold-on-dark read as Claude's brand, retired)
- [x] Write brand markdown file in `elion/` (BRAND.md): palette, tagline, positioning, audience voice
- [x] Define `BRAND_NAME` + brand tokens in `brand.ts`

### C2. Scaffold (React + shadcn) — DONE 2026-08-02
- [x] Vite react-ts base scaffolded in place (elion root already held planning docs)
- [x] Tailwind **v4** via `@tailwindcss/vite` plugin (v4 — no postcss/autoprefixer needed)
- [x] `shadcn init` (`-b radix -p nova`) + base components: button, card, input, textarea, label, dialog, tabs, badge, dropdown-menu, select, sonner
- [x] Express 5 server skeleton + `concurrently` dev script
- [x] `.env.example`, `supabase/schema.sql`, vite proxy `/api → server`
- [x] React Router routes: `/`, `/auth`, `/app`, `/compare`
- [x] `src/lib/brand.ts` with BRAND_NAME

### C3. `/compare` design studio (superseded → `/design1`)
- [x] Build Compare page: renders 4–6 **completely different** non-functional mockups of the core UI (different layout, hierarchy, style, fonts, margins)
- [x] `/compare` = gallery of preview cards **only**; each card links to a full standalone mockup page (`/compare/:slug`) showing the complete app — nav, Brain, Queue, Plan, every element
- [x] Batch 1 v2 (B&W + gold) **REJECTED + deleted** by user — "all trash, not how actual software is"
- [x] Batch 1 v3 — **color experimentation** (user: "don't keep me in these colors — experiment with colors, default, radius, hierarchy"): indigo-command, terminal-green, rust-editorial, violet-studio, fresh-teal; palettes from ui-ux-pro-max search, per impeccable product register
- [x] Batch 1 (v3, full pages) presented to user
- [x] Batch 1 **REJECTED wholesale** — root causes: one font everywhere, sidebar without icons/account block, no Home tab, plan tab merged in, no real chrome. Bar: Inter Tight display + distinct body + mono counters; Home tab; icon nav; pinned account block; dedicated Plan tab
- [x] Batch 2 — five designs rebuilt on that bar (ledger, studio-noir, atelier, rig, cedar; each shows a different active screen)
- [x] Batch 2 **deleted by user** + fresh start requested (`/design1`, static full-product mockups only)
- [x] `/design1` gallery built — 7 **completely distinct** full SaaS mockups (Cedar, Signal, Stamp, Tessellate, Noise, Clover, Aurora): different bones/layout, palette, and typography each; every one is a complete product screen (Style, Slideshows, Plan, generate, export) — built from impeccable + ui-ux-pro-max subskill files
- [x] `/design1` = preview cards only; each opens full mockup at `/design1/:slug`; old `/compare` pages deleted, routes repointed
- [x] `tsc --noEmit` + `vite build` clean
- [x] Clover rebuilt on SlideSmith's desktop shell (sidebar + views; styling LOCKED) — `context/layout-analysis-slidesmith.md`
- [x] Impeccable audit cleanup applied to Clover: borders removed (shadows do the work), one typeface (mono only in slide thumbs), no uppercase eyebrows, naming pass — `context/app-flow-map.md`
- [x] SlideSmith's full flow mapped to Elion's page set + consistent naming — `context/app-flow-map.md`
- [x] Clover feature-complete (2026-08-02): nav renamed **Home · Brand · Billing**, dead chrome (search/bell/dup avatar) removed, Generate = header button → modal (count + optional idea), Editor modal (Post/Slides/Export) added, cards show caption + hashtags
- [x] Impeccable audit + polish of Clover (2026-08-02): green out → **palette-driven** (`Palette` object → future shadcn tokens); contrast failures fixed (secondary 4.05:1→5.4:1, placeholder 2.3:1→4.8:1); Delete added to cards (Edit/Export/Delete per flow map); dead "Save changes" removed (autosave only); focus-visible rings + aria-labels; slide textarea keyed; copy fixes (no tagline descriptor, alex@dailygrind.com)
- [x] Quieter + layout pass (2026-08-02, /impeccable): **elevation made scarce** — all container shadows removed, the modal is the only elevated layer; containers separate by tone + 1px hairline; **one accent CTA per view** (Generate only; card actions → quiet neutral pills); type does the hierarchy (title > hook semibold > caption muted > meta faint); "Tune your Brand" peer-card → slim strip; dead top bar removed; warm cream → **cool B&W ramp** (#F2F4F6 / #24292F)
- [x] Color direction (2026-08-02): **Calm Blue** (#3F6C8E, white-text 5.5:1) is the default `clover` variant on the B&W base; Gold + Terracotta kept in gallery for A/B — `tsc` + `vite build` clean
- [x] **Two-variant split (2026-08-02, user-led):** Clover now exists as **Calm Blue (flat)** — zero borders, zero hover, no shadows except the modal, containers separate by tone only; and **Black & White (shadow)** — strictly monochrome (`clover-black`), the soft-lift shadows restored but restrained to containers only (cards, brand chip, Pro card, one selected nav pill), never icons/buttons. Gold + Terracotta removed from the gallery. Both share one component threaded by `Palette` + `Mode` objects.
- [x] **AI-icon removal (2026-08-02, user-led):** removed the two generator tells — Sparkles (Generate) and the Leaf logo mark; brand mark is now an "E" monogram. Every functional icon kept (nav, edit/export/trash, settings/sign out, chevrons, copy/shuffle). `tsc` + `vite build` clean.
- [x] **Winner locked (2026-08-02, user-led):** Black & White (`/design1/clover`) is the chosen design. The blue/flat variant was removed from the gallery and the file; one monochrome palette + one shadow mode remain as the token source.
- [x] **Deep black pass (2026-08-02, user-led):** the accent, all ink, solid surfaces (Ready chip, avatar, E monogram, Pro card), and slide-gradient corners deepened from charcoal `#24292F`/`#1F242A` to near-pure `#0A0D11`. Body text now ≥19:1, accent-on-tint ≥16:1. `tsc` + `vite build` clean.
- [x] **Daily Grind chip removed (2026-08-02, user-led):** the sidebar's workspace/project chip is gone (one Brand per user, no switcher, no dropdown). Brand context now lives in Brand view and the Generate modal subtitle.
- [x] **Home layout pass (2026-08-02, /impeccable layout):** two-tier greeting ("Good morning" + muted question, em-dash-free), "Your slideshows" header gains a live count ("3 slideshows · 1 ready to post"), and the newest slideshow leads as a full-width featured card (preview filmstrip left, text right) that breaks the identical-card grid.
- [x] **Em-dash ban (2026-08-02, user-led):** zero em dashes anywhere in Elion UI copy (greeting, captions, strip, modal copy, comments). Rule saved to CLAUDE.md + memory.
- [x] **Radius system locked (2026-08-02, user-led):** radius is constant per role, never a hierarchy lever. 4-role scale: `full` pills (buttons/chips/tabs/dots/**nav+settings row active states**), `2xl` large surfaces (cards/modals/Pro), `xl` controls + small containers (inputs/fields/meter/strip/tiles), `lg` media + tiny tiles (thumbs/swatches/index tiles). Fixed three violations: nav active pill was a stubby 12px rectangle (now a capsule matching Generate), Settings/Sign-out rows were 8px (now capsules), export index tile was 6px (now 8px). Commented scale in clover.tsx → shadcn radius tokens on extraction.
- [x] **Font pairing locked (2026-08-03, user-led):** Inter Tight Variable = display/headings (the main face), Geist Variable = body/UI (the sub face), JetBrains Mono Variable = counters inside slide thumbs. Installed `@fontsource-variable/inter-tight` + `jetbrains-mono`, wired in index.css; Clover now uses `font-display`/`font-mono` utilities + the global Geist body. Rule saved to CLAUDE.md.
- [x] **Logo placeholder removed (2026-08-03, user-led):** the "E" monogram tile and the "Slideshow generator" descriptor are gone from Clover's sidebar and preview card. Wordmark only. The real Elion logo will be built as a reusable component and linked across the UI; never invent a mark. Rule saved to CLAUDE.md.
- [x] `tsc --noEmit` + `vite build` clean after winner lock + layout pass
- [x] **Critique + audit + polish (2026-08-03):** Clover critique 26/40, detector clean; audit 13/20. Polish applied: Pro card button inverted (white on dark, no more black-on-black), Generate modal shows the cost ("This uses 1 of your 3 free slideshows."), Editor footer is tab-aware (Save on Post/Slides, Done on Export), "Bg" → "Image", Brand copy aligned to the mockup state, style memory now matches the grayscale palette, text floor raised to 11px, icon/dot contrast raised to ≥3:1 graphics
- [x] **Font pivot (2026-08-03, user-led):** Onest Variable = display/headers (main face), Inter Tight Variable = body (sub face), JetBrains Mono = counters. Geist retired for Elion UI (still bundled for other gallery mockups). CLAUDE.md + index.css updated
- [x] **Ember direction (2026-08-03):** completely new dark amber studio built via /design-taste-frontend with the sidebar as the only layout rule. Dark ink page, amber accent, hairline-flat surfaces, editorial masthead. **REJECTED by user:** the amber-on-dark accent reads as Claude's brand color. Kept in gallery at `/design1/ember` for reference, not a winner
- [x] **Synthover built (2026-08-03, user-led merge):** Clover's product on Synth's material, new file `src/components/design1/synthover.tsx`. Synth sidebar structure + nav names (Dashboard/Brand Voice/Plan & Billing), purple → monochrome white accent, Clover's pinned bottom (free plan card, Settings, Sign out, Alex Carter), Create button + Assistance/Theme removed, Home rebuilt with Clover's Good morning + Your slideshows (featured-first cards, thumbs, status chips, hooks, captions, hashtags, Edit/Export), Brand Voice + Plan & Billing rebuilt from Clover content in dark outlined material, Generate modal with cost line, Editor modal with tab-aware Save/Done. Wordmark only, no em dashes, no gradient text, no amber/purple. `tsc` + `vite build` clean, detector zero hits. `synth.tsx` and `clover.tsx` untouched.
- [x] **Real logo placed (2026-08-03, user-led):** user's `elion logo.png` (white lockup on transparent, 492×148) copied to `src/assets/elion-logo.png`; Synthover sidebar header + gallery preview now render it (`<img>`, h-8 sidebar / h-3 preview). `tsc` + `vite build` clean, detector zero hits.
- [x] **Pinned sidebar + nav redesign (2026-08-03, user-led):** shell is now `h-screen overflow-hidden`, main scrolls independently, sidebar stays put. Nav/Settings/Sign-out rows carry **zero background fills** (third rejection of the filled block / translucent-glass patterns): active = white text + bold + `aria-current`, hover = text brighten only, inactive = muted `#7A7F87`. `tsc` + `vite build` clean, detector zero hits.
- [x] **Brand accent gold → blue (2026-08-03, user-led):** the accent is now **blue `#3B82F6`** (dark ink text on it ≥5.6:1, blue text on dark ≥5.6:1). BRAND.md + `brand.ts` (`BRAND_ACCENT`) + `index.css` (`--brand` / `--color-brand`, deep `#1D4ED8`, ink `#1E40AF`) + gallery hover updated. Synthover's accent moments swapped white → blue: Generate CTA (hover brightens `#4C8DFF`), active nav text/icon, Ready/Free/Current chips, usage meter + track, Upgrade + Open Brand links, generate-count pill, editor active tab, slide index tile, Pro card border `#3B82F6/40`, focus rings. `tsc` + `vite build` clean, detector zero hits.
- [x] **Glass material pass (2026-08-03, user-led):** the accent is now **translucent glass, never solid**. All blue fills → `bg-[#3B82F6]/20` + white text; pill buttons (MintButton) gain a `border-[#3B82F6]/25` hairline + `/30` hover; only the tiny usage-meter bar stays solid (a data mark). **Active nav reverted** to text + icon turning blue (no bg, no padding — the "text changes color" state the user preferred); hover = text brighten only, no bg anywhere in the rail. Generate is a nav-style white text row. **Free-plan widget quieted:** solid "Free plan" chip removed → muted status text + neutral track, accent only on "Upgrade to Pro". Logo reduced h-8 → h-6. Sidebar `<aside>` pinned to `font-sans` (Inter Tight); verified zero `font-display` (Geist) inside the sidebar. `tsc` + `vite build` clean, detector zero hits.
- [x] **Synthesise type stack (2026-08-03, user-led):** font pairing pivoted to **Schibsted Grotesk = display/headers** (`--font-display`, the synthesise.ai hero face), **Inter Tight = body + sidebar** (`--font-sans`, unchanged), **DM Sans = numbers** (`--font-num`: prices, slide indices, usage figures, count pills). Installed `@fontsource-variable/schibsted-grotesk` + `dm-sans`, wired in `index.css`. JetBrains Mono still bundled for other gallery mockups. **Icons: lucide at `strokeWidth={1.5}`** (thin/regular weight), with Elion's own icon mapping kept (Home/BookOpen/Wallet/Plus/Settings/LogOut) instead of Synthesise's LayoutDashboard/GitFork/History list. `tsc` + `vite build` clean, detector zero hits.
- [x] **Business model locked (2026-08-03):** freemium via Lemon Squeezy (merchant of record). **Free** = 3 lifetime generations, watermarked exports. **Pro = $19/mo or $99/yr**: unlimited high-res PNG exports, zero watermark, custom brand voice profiles. Anti-abuse: hard **10 generations/hour/user** rate limit at the API route. Model stays env-driven (`OPENROUTER_MODEL`, default cheapest Gemini Flash, Claude Haiku later; NOT Gemini 1.5 Flash). BUILD_PLAN, schema, `.env.example`, and the Synthover pricing card updated (Pro dropped the 300/mo cap).
- [x] **Pro cap + project model (2026-08-03, user-led):** "unlimited" Pro dropped (can't afford it at launch) → Pro = **capped slideshows/month (placeholder 500)** + **multiple brand projects**, each project owns its own Brain (this is what "custom brand voice profiles" means); free = 1 project, 3 lifetime gens. Schema: new `projects` table (brain moved here), `queue.project_id`, monthly counters restored for the Pro cap. **Model decision deferred** (not Gemini 1.5 Flash; candidates = capable free models e.g. NVIDIA or JLM-style via OpenRouter, env-driven only).
- [x] Synthover locked as the base (2026-08-04): user iterating on it, not Clover
- [x] Off-palette hover/disabled blue fixed in Synthover (2026-08-04): Generate row hover `#A7C4FF` → on-palette `#6FA1FF`; disabled prev/next now dim via neutral ramp, not `opacity-30`
- [x] **Scope-accurate redesign pass on Synthover (2026-08-04):** real photo backgrounds replace every gradient (picsum stands in for the Pinterest pool, served same-origin in prod); dashboard default is an EMPTY STATE for new users, a SKELETON LOADER while generating, then image-backed cards; new Library view (search + Pull new + pick grid); nav = Dashboard / Library / Brand Voice / Plan & Billing; editor background strip + Browse Library; pricing card → $19/mo, $99/yr, 100 slideshows/mo; style memory copy no longer says gradients. DemoBar lets the reviewer step the flow. `tsc` + build clean, detector zero hits
- [x] Extract chosen design → global CSS / shadcn theme tokens / Tailwind config (2026-08-04: Synthover extracted to `src/index.css` — design-role tokens `page/inset/ink/hairline/accent-glass/action-glass/danger` + shadcn semantic mapping, dark-only, fonts trimmed to Schibsted Grotesk / Inter Tight / DM Sans / JetBrains Mono. `tsc` + build clean, tokens verified in dist)

## Phase 0 — Scaffold (app foundation)

- [x] Vite + React 19 + TS + Tailwind + shadcn wired (from C2)
- [x] Express skeleton: `/api/health`, json body limit 50mb, SPA fallback in prod
- [x] `npm run dev` boots Vite + server together; `npm run build`; `npm start` — verified
- [x] Supabase schema applied (profiles, projects, queue, RLS) + profile/project auto-create on login (live; auto-create trigger verified during auth testing)

## Phase 1 — Design tokens

- [x] Extract Synthover into `src/index.css` + shadcn theme: page `#08080A`, hairline ramp, muted text ramp, accent `#3B82F6` glass, radii, fonts (Schibsted Grotesk / Inter Tight / DM Sans)
- [x] Dark-only theme; utility tokens (page, inset, ink, sub, faint, dim, hairline, accent, danger)
- [x] **UI contract written: `DESIGN.md` (repo root)** — exhaustive verbatim spec of the locked Synthover UI (every color, radius, text size, spacing, hover state, copy). Build reproduces it 1:1, NO deviation (allowed deviations only per DESIGN.md §11). CLAUDE.md + AGENTS.md + HANDOFF.md updated to make it binding.
- [x] shadcn components themed to the palette (button, input, textarea, label, dialog, tabs, badge, dropdown-menu, select, sonner) — **must render the exact DESIGN.md values, see DESIGN.md §11.5**

## Phase 2 — Auth

- [x] Supabase project created + auth email/password enabled (user) + Google OAuth (2026-08-06)
- [x] `src/lib/supabase.ts` client (anon key, VITE_ env) — exists, wire to `/api/me`
- [x] Signup + login forms (`/auth`)
- [x] Server JWT verify middleware (`server/auth.js`, HS256 via SUPABASE_JWT_SECRET)
- [x] `GET /api/me` returns profile + plan + usage + projects + activeProjectId
- [x] Protected `/app` (redirect to `/auth` when no session)

## Phase 3 — Brain + projects

- [x] BrandVoiceView: 5 fields for the active project (niche, app name, app description, audience, style memory)
- [x] Project CRUD: `POST/GET /api/projects`, `PUT /api/projects/:id` (rename + brain, whitelist keys), `DELETE /api/projects/:id`; free = 1 project, Creator = 3, Studio = 10
- [x] Load active project's brain into form on mount (from `/api/me`); brain persisted on Save (modal, not debounced — flagged)

## Phase 4 — Generation

- [x] `server/openrouter.js` (chat JSON, tolerant parse, attribution headers)
- [x] `server/images.js` (Apify Pinterest pull → download → storage → same-origin `/api/images/:hash` proxy; dev picsum fallback)
- [x] `server/generate.js` (prompt from brain, batch loop, background resolution from the project's imagePacks)
- [x] `server/limits.js` (3 lifetime free / 100 monthly creator / 500 monthly studio placeholder / 10 per hr all tiers; counters only on success; config-driven caps)
- [x] `POST /api/generate` `{count, projectId}` → checks → generate from project brain → resolve backgrounds → insert queue rows → return
- [x] GenerateModal (count 1/3/5/10) + generate button in DashboardView
- [x] Error surface for 403/429: modal clamps over-limit counts (danger line) + toast surfaces server errors

## Phase 5 — Queue UI + editor

- [x] `GET /api/queue?projectId=`, `PUT /api/queue/:id`, `DELETE /api/queue/:id`
- [x] DashboardView cards (image slide grid, rationale, hook, caption, hashtags, Edit/Export/Delete), empty state, skeleton loader
- [x] SlidePreview (9:16 image thumbnail)
- [x] SlideshowEditorModal — Post tab (caption, hashtags), Slides tab (per-slide text, background swap from library / shuffle, delete slide), preview + prev/next dots

## Phase 6 — Export

- [x] `src/lib/render.ts` — 1080×1920 background image + legibility scrim, background-only
- [x] `src/lib/watermark.ts` — free-tier BRAND_NAME watermark; skipped for paid plans
- [x] Export tab: Download bg (per slide), Download all, Copy text (per slide), Copy all text
- [x] Watermark gated on plan from `/api/me`
- [x] Send to phone: `POST /api/exports` snapshots draft to a 24h token share; `GET /s/:token` public phone page (same-origin images + copyable text); QR rendered in Export tab via `qrcode`

## Phase 7 — Library

- [x] `GET /api/library?projectId=` returns project's imagePacks
- [x] `POST /api/library/pull` `{query?, projectId}` → Apify scrape (or dev fallback) → store → append to imagePacks
- [x] LibraryView: search, Pull new, filter chips, image grid, pick state, "Use on slide" in the editor

## Phase 8 — Billing

- [x] Lemon Squeezy store + Creator/Studio variants created (user, 2026-08-06): store `https://elionapp.lemonsqueezy.com`, Creator `1987497`/`1987471`, Studio `1987509`/`1987502`, webhook secret saved to `.env`
- [x] `GET /api/upgrade-url` (checkout + custom user_id, monthly + annual)
- [x] `POST /api/lemon/webhook` (HMAC verify; plan flip; idempotent)
- [x] BillingView (plan, usage counters, Upgrade, refresh)
- [x] Watermark/limits respect live plan after webhook

## Phase 9 — Landing + polish

- [x] Landing page (hero, signup CTA) styled from Synthover tokens (free-form, not locked)
- [x] Auth page styled
- [x] Empty states, loading states, error toasts (sonner)
- [x] Copy pass on all user-facing strings (BRAND_NAME everywhere, no em dashes)
- [x] Smooth scroll behavior (`scroll-behavior: smooth`, reduced-motion gated; `scroll-mt` on anchors)
- [x] Landing navbar redesigned via /impeccable (scroll-progress hairline, animated underline links, mobile hamburger, Escape closes) — verified via screenshots
- [x] Landing mobile responsiveness fixed (HowItWorks grid overflow)
- [x] Onboarding rewritten as a fully functional 3-step guided flow (create brand via 5-question wizard → pull backgrounds → open generator) — verified end-to-end via puppeteer in forced preview mode
- [x] Brand Voice empty-state glitch fixed (skeleton on `meLoading` + `hasBrain` form gating — no flash on hard refresh)

## Phase 10 — Deploy + verification

- [x] `vercel.json` created (SPA rewrites to `/index.html`, `/api/*` passthrough, security headers). NOTE: Vercel serves the static build only; the Express API in `server/` needs serverless functions or a separate host for `/api` to work in production. Current `npm start` (Node + `server/`) is the full-stack path.
- [x] Render web service (Node, `npm run build` + `npm start`) (user) — service `elion`, live 2026-08-06
- [x] Env vars set in Render (all from BUILD_PLAN §14) (user)
- [x] `/api/health` green on Render + auto-deploy via Render Deploy Hook → GitHub webhook
- [ ] **Playwright end-to-end** (BUILD_PLAN §16): signup → brain → generate → edit → swap background → export (watermark logic) → upgrade via webhook → clean export → limits (403/429) — last major pre-launch verification

## Phase 11 — Security hardening (before launch)

- [x] Secrets: keys live only in server env; `VITE_` prefix audit confirms nothing secret ships to the client bundle (only `VITE_SUPABASE_URL` + anon key, which is public-by-design and RLS-restricted) — DONE 2026-08-06
- [x] Supabase: anon key restricted to auth + RLS; service-role key never client-side; RLS reviewed per table (profiles own-row, projects own, queue own) — DONE 2026-08-06
- [x] Auth: server verifies access tokens on every `/api` route via GoTrue `/auth/v1/user` (algorithm-agnostic; project tokens are ES256 after Supabase key migration) with optional HS256 fast path if `SUPABASE_JWT_SECRET` set; session expiry + refresh handled — DONE (verified pre-existing)
- [x] Rate limiting: 10 gens/hr/user enforced at the API route (not client-gated); brute-force protection on auth endpoints (auth is GoTrue-side) — DONE (verified pre-existing)
- [x] Input validation: whitelist body fields (brain, queue edits, project renames); reject unknown keys; length caps on all strings — DONE 2026-08-06 (added caps on library pull searches + LLM-expanded queries)
- [x] Webhook: Lemon Squeezy HMAC verified; webhook handler idempotent; secret never logged — DONE (verified pre-existing)
- [x] HTTP: security headers, strict CORS allowlist, no CORS on `/api/lemon/webhook`, referrer policy — DONE 2026-08-06 (nosniff, X-Frame-Options DENY, no-referrer, COOP/CORP same-origin, Permissions-Policy; Origin allowlist rejects unknown-origin browser requests; webhook is server-to-server, no Origin)
- [x] Outbound safety: OpenCode/Apify responses length-capped; image URLs validated HTTPS-only; no SSRF (Pinterest queries are platform-chosen, not raw user input) — DONE 2026-08-06 (pinimg.com host gate on every pulled URL)
- [x] Logging: no PII, tokens, or keys in logs; structured and redacted — DONE (swept 2026-08-06, clean)
- [x] Deps: `npm audit` clean or known-and-accepted; lockfile pinned — DONE 2026-08-06 (hono ReDoS patched 4.12.33→4.13.0; react-router 7.18.2 RSC-mode CSRF advisory ACCEPTED: SPA has no RSC/action mode, vector unreachable, fix requires major v8 migration)
- [x] Abuse: usage counters race-safe (server-side, transactional); cap enforcement server-side — DONE 2026-08-06 (chargeGeneration now compare-and-swap guarded UPDATE, retries on stale read)

---

## Open items

- [x] **Pricing tiers (2026-08-06):** three-tier structure adopted from PRICING.md. Creator $19/mo or $190/yr (100 gens/mo, 3 projects); Studio $49/mo or $490/yr (500 gens/mo, 10 projects). `pro` kept as a legacy alias for `creator` in code and DB. Caps configurable via `LIMIT_MONTHLY_GEN` / `LIMIT_MONTHLY_GEN_STUDIO` / `LIMITS.projects`.
- [x] **Plan margin math (done 2026-08-06):** OpenCode model is free today (`big-pickle`); Apify pulls $0.04 (10-count) / $0.16 (40-count) from real run data; storage + bandwidth ≈ $0.005/gen. At caps: Creator ≈ $0.35/mo vs $19, Studio ≈ $1.15/mo vs $49 → ~98% margin, and still 95%+ if swapped to a paid Haiku (~$0.0055/gen). No cap cut needed. Only real leak found: pulls had no rate limit → added 6 pulls/hr/user.
- [x] **Google OAuth (done, user 2026-08-06):** Google provider enabled in Supabase (Auth → Providers → Google) with Client ID/Secret from Google Cloud Console. Frontend already wired (`supabase.auth.signInWithOAuth`).
- [x] **Lemon Squeezy wired (2026-08-06):** Creator + Studio variants, store URL, and webhook secret in `.env`; webhook maps variant → plan (`server/lemon.js`), `/api/upgrade-url` takes `tier` + `annual`, BillingView shows three tiers. Endpoint verified live via a signed test webhook (flipped a real user's plan). Store-side completion is the open item below.
- [x] **Supabase ALTER (done, user 2026-08-06):** live `profiles` table now accepts `plan in ('free','creator','studio','pro')`; `supabase/schema.sql` already updated.
- [ ] **Lemon Squeezy store finish (user, in LS dashboard):** point webhook callback URL at `https://elion-ix26.onrender.com/api/lemon/webhook`; publish Creator + Studio products (checkout live); set up payout account; run a real checkout → webhook → plan-flip test. Backend is done and verified. **NOTE (2026-08-06):** ON HOLD until Lemon Squeezy completes and verifies their store/account verification. When that verification is done, ASK the user before continuing the activation steps (don't proceed on your own).
- [x] **Domain check** `elion.ai` availability — checked off by user 2026-08-06 (not blocking launch; ship on the current Render URL)
- [x] **Trademark clearance — DROPPED (user 2026-08-06).** ELION is a registered US mark held by several non-competing companies (most relevantly Elion Inc of Menlo Park CA, a health IT intelligence platform; plus Elion International, Elion LLC, Fluke Corporation). Product verticals differ enough that it's not a pre-launch blocker: the app ships on a Render subdomain with no custom domain and no revenue yet. Nothing to lose now; revisit only if the user invests in a custom domain or real brand growth.
- [ ] Post-launch: Claude Haiku model swap, stock background packs, server-side watermark (v2)

## Done / shipped

(nothing yet — planning in progress)

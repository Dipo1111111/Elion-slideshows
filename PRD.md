# PRD: Elion

Product Requirements Document. This is the source of truth for what Elion is, who it is
for, and what it does. BUILD_PLAN.md holds implementation detail and sits below this doc.

Status: DRAFT, awaiting review. Locked by the user on 2026-08-04.

## 1. The one-line product

Elion is SlideSmith, rebuilt as a hosted product for non-technical creators: the AI writes
the slideshow script, Elion supplies the background images (including Pinterest pulls), the
text goes on top, and the creator exports ready-to-post slides. No repos, no API keys, no
config. The user does not need to be technical.

## 2. Reference and clean-room rule

The reference is SlideSmith (Documents/slideshow gen software/SlideSmith). SlideSmith is a
powerful open-source generator, but it is built for technical people: clone the repo,
install it, and supply your own API keys (OpenRouter for the AI, Apify for Pinterest
scraping, post-bridge for posting). A non-technical creator will not do any of that.

Elion is the same product for everyone else: a hosted, feature-for-feature rebuild of
SlideSmith's experience, with every external service built in and paid by the platform.

Clean-room rule (non-negotiable, from CLAUDE.md): SlideSmith is a feature reference ONLY.
We understand the features and rebuild them ourselves. We never copy its source code, its
prompt text, or its images into Elion.

## 3. Who it is for

Primary: solo TikTok and Instagram creators posting slideshow content. Non-technical,
posting on a schedule, allergic to setup. They want the next post fast, not a tool to learn.

Secondary: creators managing multiple accounts or brands (paid plans, multiple projects,
one Brain per project).

## 4. Core loop

Sign up (email + password) → set up your Brain (niche, app, audience, style) → Generate
(the AI writes the script, Elion supplies the background) → Review and edit in the Queue →
Export PNGs + copyable text → post manually in the native TikTok or Instagram app.

## 5. Feature set (v1)

### In scope

1. Auth: email + password via Supabase. Hosted.
2. Projects: free = 1 project, Creator = 3, Studio = 10 (placeholders). Each project owns
   its own Brain and its own queue of slideshows.
3. Brain (per project): niche, app name, app description, audience, style memory. Autosaved
   on the project.
4. Generate: a platform-held OpenRouter key writes N slideshows (hook, 5-6 slides, caption,
   hashtags, rationale) in the Brain's voice. Batch loop until the count is met. Cap count.
5. Image library: real backgrounds. A platform-held Apify key pulls Pinterest images by
   search and stores them for reuse across slideshows. No bundled starter packs in v1
   (locked 2026-08-04; packs may return later as a paid-plan perk). Each slide gets a background
   image, auto-pulling fresh backgrounds when the pool is empty.
6. Queue: generated slideshows with status (Draft / Ready / Exported), edit, delete, and a
   count picker on Generate (1/3/5/10).
7. Editor: per-slide text, background swap / re-shuffle, caption, hashtags.
8. Export: 1080x1920 background PNGs plus copyable text, per slide and all at once. Free
   tier watermarked; paid plans clean.
9. Billing: Lemon Squeezy. Free = 3 lifetime generations, watermarked exports, 1 project.
   Creator = $19/mo or $190/yr (100 slideshows/mo placeholder), Studio = $49/mo or $490/yr
   (500 slideshows/mo placeholder), no watermark, multiple projects. Anti-abuse: hard 10
   generations/hour for all tiers.

### Out of scope (v1, explicit)

- NO posting, scheduling, or analytics. No post-bridge. Posting is manual in the native
  app. Rationale: post-bridge is a paid service, and forcing every user to pay for it on
  top of the subscription is rejected. This may return later as an optional add-on, not a
  v1 requirement.
- NO bring-your-own-keys. The platform holds every key. A non-technical user never sees a
  key field or a config screen.
- NO self-hosting or repo duplication.
- NO OAuth (email + password only for v1).
- NO user image uploads in v1. Backgrounds come only from Pinterest pulls and starter packs.

## 6. Hosted services and cost model

The platform pays for and holds:

- OpenCode Zen: cost per generation.
- Apify: cost per Pinterest scrape.

Both are baked into the pricing. The plan monthly caps and the hourly rate limit protect
margins. Never promise unlimited generation; the caps are the margin guard.

Before launch, do the margin math (user request, 2026-08-04): real per-generation cost
(OpenCode LLM + Apify scrape, amortized across cached backgrounds, plus storage and
bandwidth) against the plan prices and caps. Pricing locked at Creator $19/mo or $190/yr
(100/month cap placeholder) and Studio $49/mo or $490/yr (500/month cap placeholder); if
the math shows a cap is too generous, lower it before launch. Never promise unlimited
generation; the caps are the margin guard.

## 7. Data model (summary)

- profiles: plan, total_gens, monthly_gens, month_start, ls_subscription_id
- projects: name, brain (jsonb), imagePacks
- queue: project_id, data (slideshow)

Full schema in supabase/schema.sql. The schema also needs imagePacks on projects.

## 8. Design

The chosen /design1 design (winner open between Synthover and Clover) is extracted into
global CSS + theme tokens before building. Fonts: Schibsted Grotesk (display), Inter Tight
(body + whole sidebar), DM Sans (numbers), lucide icons at 1.5 stroke. No em dashes in any
user-facing string. Brand: Elion, blue accent #3B82F6, dark quiet chrome, loud content.

## 9. Success metrics

- Time from signup to first generated slideshow.
- Percent of new users who generate within the first 24 hours.
- Weekly active creators and generation count per active.
- Free to paid conversion and churn.
- Median time from generate to export (edit friction).

## 10. Open decisions (lock before build)

1. Background library: LOCKED to Pinterest-only for v1 (2026-08-04). No bundled starter
   packs at launch; packs may return as a paid-plan perk.
2. Pricing: LOCKED (2026-08-06) Creator $19/mo or $190/yr and Studio $49/mo or $490/yr
   (margin math in §6). Monthly caps placeholder Creator 100 / Studio 500; project caps
   placeholder Creator 3 / Studio 10. Set real numbers before launch.
3. AI model: LOCKED to **`big-pickle` on OpenCode Zen** (2026-08-05): base URL `https://opencode.ai/zen/v1`, key `OPENCODE_API_KEY`,
   model env-driven via `OPENCODE_MODEL`. OpenRouter retired. NOT Gemini 1.5 Flash.
4. Design winner: Synthover vs Clover, then extract to tokens.

## 11. Doc reconciliation (after this PRD is approved)

- BUILD_PLAN.md: add the image library (Pinterest via Apify) and remove the wrong
  "gradients only / no image library" framing. Keep no-posting.
- PRODUCT.md: fix the "no image library" line in Product Purpose.
- CLAUDE.md: update "What this is" and the MVP scope lines to match.
- PROGRESS_TRACKER.md: re-add the Library phase.
- supabase/schema.sql: add imagePacks to projects.

# Memory — SaaS rebuild: branding/name selection in progress (previously: Railway abandoned, laptop-only workflow)

Last updated: 2026-08-02

## What was built

- **Export for TikTok tab** in `src/components/SlideshowEditorModal.tsx` — downloads clean 1080×1920 background PNGs (no text) per slide, batch download all, copy text per slide or all at once
- **`renderSlideBackground()`** in `src/lib/render.ts` — canvas-based background-only render (image+darkening or gradient+vignette), no text
- **`downloadPng()`** in `src/lib/render.ts` — triggers browser PNG download from canvas data URL
- **`railway.json`** — Railway deploy config with healthcheck
- **`nixpacks.toml`** — Railway build config to include devDependencies
- **Server host binding fix** (`server/index.js`) — auto-detects Railway via `PORT` env var, binds `0.0.0.0`; added `healthcheck.railway.app` and `.up.railway.app` suffix to allowed hosts
- **Env var fallback** (`server/store.js`) — `getConfig()` reads `OPENROUTER_KEY`, `APIFY_KEY`, `MODEL` from environment variables as override
- **AtomicXP Project 2 brain** fully configured in local config — niche, app description, audience, style memory with hook formulas, slide structure, word count rules, specificity rules

## Decisions made

- **No Railway deployment** — user scrapped it. Too many headaches with builder config, host binding, healthcheck, and re-entering config. User will use laptop only.
- **No post-bridge / auto-posting** — user posts manually inside TikTok with native font for better performance. Export feature replaces the scheduling pipeline.
- **Background images assigned randomly per slide by server** — AI writes text only. Backgrounds come from user-selected packs in Settings → Background packs or the Generate modal.
- **Apify Pinterest scraper** for building custom background library

## Git state

- GitHub remote: `github.com/Dipo1111111/slidesmith.git` (branch: `main`)
- Local git is healthy inside `SlideSmith/` folder
- All Railway-related fixes are committed and pushed (`10601dd`)

## Current state

- Slidesmith runs locally at `localhost:5173`
- OpenRouter key + model configured — generation works
- AtomicXP brain configured (Project 2 with full style memory, slide structure, hook formulas)
- Apify key added — Pinterest scraping works in Library view
- Export for TikTok tab works — renders backgrounds, downloads PNGs, copies text
- Local config has background packs selected for AtomicXP (Luxury Lifestyle, dark workspace, Faceless Gym, etc.)
- Railway is abandoned — laptop-only workflow

## Next session starts with

Run `npm run dev` in the `SlideSmith/` directory to start the dev server, then open `http://localhost:5173`. Generate slideshows using the AtomicXP brain, export background images + text via the Export tab, send to phone, and post manually on TikTok.

## Open questions

- AtomicXP TikTok handle (@name) — not yet created
- First batch of AtomicXP content to generate — user needs to decide on specific hooks/topics

---

## Session: SaaS Rebuild — Core Value Defined + Name Brainstorm (the 3-hour naming saga)

Last updated: 2026-08-02

### What was built

No code. Branding/planning session only. The clean-room SaaS core value was defined and locked with the user (see _PLANNING_STATE.md for the full product plan).

### Decisions made

- **Core value LOCKED (the naming foundation):** "Your story, told in your voice." — a carousel generator for solo TikTok/IG creators.
- **Critical correction from user:** the Brain does NOT "learn" your voice. You GIVE it your voice (niche, audience, style) and it writes in that voice. No "learning" claim — it follows what you set. The differentiator is "brand-aware AI carousel generation," not self-learning.
- **Naming process (user's explicit instruction):** follow the standard advice IN ORDER — (1) define core value, (2) brainstorm keywords/abstract ideas from it, (3) verify domain + trademarks. User was angry when I skipped ahead to verification or asked them to pick name-energies via AskUserQuestion before defining the core value.
- **User's candidate workflow (they insisted on this):** "Give me 25 names, I choose, you check if not good, give 25 more." User picks → assistant verifies ONLY their picks.
- **User taste (hard-won, do NOT violate):** LOVES real, meaningful, already-existing names — Monaco, Void, Beam, Notion, Cluely, Nike, Shopify, Claude, Fable, Mythos, Lyft. HATES invented/vague/robotic/AI-slop — Evro, Evra, Skyler, Nevio, Nova, Zadar, Venko, Carousel, Slideify. Soft-flowing, ≤6 letters, no "-AI", no harsh sounds (rejected Verk/Kestel = "sounds like an animal"), no animal names. They also like person names (Claude) and places (Monaco).
- **Sound-discoverability rule (user discovered this):** the name must pass "say it to someone → they type it → they find you." Respellings like Havyn fail: heard "Havyn," searched "haven," landed on 6 unrelated software products. This kills respelling common words (Lyft survived only via massive ad spend).
- **Core-value brainstorm produced 14 candidates:** Ballad, Griot, Skald, Psalm, Rime, Timbre, Cantus, Vesper, Refrain, Rondo, Gyre, Whorl, Theia, Mneme. My top 3 recommendation: Rondo (musical theme that keeps returning = literally a carousel), Ballad, Griot (the storyteller).

### Problems solved

- **The 3-hour "everything is taken" loop:** root cause = web-searching for *famous* names (famous names are taken by definition). Fix: define core value first, brainstorm from it, verify only the user's picks.
- **Havyn trap (user caught it):** respellings change spelling, not sound — and sound is what drives word-of-mouth search.
- **WebSearch technique:** multi-word quoted queries return "No links found"; use single-term + loose modifier (e.g. `Boreas company`). "No links found" ≠ proven clean (Nevio was actually taken — user's instinct was right).

### Current state

- Core value locked: "Your story, told in your voice." → **SUPERSEDED 2026-08-02** (user rejected — didn't describe the software). Replacement "AI carousels, ready to post." also rejected same day (too vague). Current: **"Writes your carousel for you."**
- 14 brainstormed names on the table (Rondo/Ballad/Griot recommended). **User has NOT picked yet.**
- NONE of the 14 have been verified. An earlier 25-name list (Naiad, Notus, Theia, Leto, Dione, Ione, Coeus, Mneme, Erebus, Vesper, Ballad, Psalm, Ochre, Rime, Zinnia, Tilia, Yarrow, Pavo, Morpho, Vireo, Corfu, Samos, Paros, Milos, Chios) is also unverified and was never picked from.
- Names VERIFIED TAKEN this session (do not re-propose): Mythos, Cluely, Fable, Ichor, Pythia, Lethe, Hymn, Aeolus, Delos, Erato, Umber, Sonnet, Chora, Voyd, Fayble, Lyrik, Vyvid, Lumyn, Klio, Tayle, Embyr, Ambre, Havyn, Tyche, Kismet, Boreas, Eunoia, Ischia, Giglio, Sepia, Sylph, Eurus, Alder.

### Next session starts with

1. User picks favorite name(s) from the 14 (or asks for a fresh batch from the core value).
2. Verify ONLY their picks. NOTE: user rejected Bash domain-checking (RDAP curl) twice — agree on a verification method they accept before running anything.
3. Lock name → logo direction → tagline → brand palette/typography → create the separate brand-named folder (clean rebuild, fresh git repo, sibling under `Documents\slideshow gen software\`) → architect blueprint → user confirms → writing-plans → implementation.

### Open questions

- Which name the user picks, or whether they want a fresh batch.
- How verification should be done (user rejected Bash RDAP twice — needs a method they accept).
- Trademark-check methodology for the final pick.
- Post-name branding sequence is queued (logo, tagline, palette) per _PLANNING_STATE.md.

> **UPDATE 2026-08-02 (post-session):** Name **LOCKED = Elion** ("Elion AI"). New project folder = `C:\Users\USER\Documents\elion` (clean-room rebuild, separate from SlideSmith). Brand design (color/tagline/positioning) comes in the design-exploration phase. SlideSmith = feature reference only. This memory + `_PLANNING_STATE.md` transferred into `elion/context/`.

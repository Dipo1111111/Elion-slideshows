# App flow map — SlideSmith → Elion

> Clean-room note: **feature reference only**. Describes how SlideSmith's app is
> structured so we can build our own, cleaner version. No source code copied.
> Written 2026-08-02.

## The one-line takeaway

Elion is SlideSmith with three things removed (API-key setup, image-library
farming, posting/scheduling) and every surface cleaned. The **flow** — one shell,
review the generated work, open any slideshow in an editor with Post/Slide/Export —
is identical. We keep the bones and the flow, and cut the parts a non-technical
founder should never see.

## How SlideSmith's app works (the flow)

1. **Setup (Settings).** First run forces you to Settings to paste API keys
   (OpenRouter for AI, Postbridge for posting, Apify for image packs). No keys →
   no generate button.
   → **Elion: gone.** Keys are pre-configured on the server. The user never sees them.
2. **Brain (BrainView).** Niche, audience, style memory — shapes every generation.
   A centered form, autosaved.
   → **Elion: Style.** Same job, same shape.
3. **Generate (GenerateModal).** The Generate button lives in the **Queue view
   header** (top-right). It opens a modal: pick a count (1/3/5/10, up to 100) +
   background packs → AI writes N slideshows into the Queue.
   → **Elion: Generate modal.** Same placement (view-header action → modal), same
   count selector. Elion adds one optional field SlideSmith lacks: the idea/topic.
4. **Queue (QueueView).** Review grid, `max-w-5xl`. Each card = slide strip
   (6 thumbs) + AI rationale + hook + caption + hashtags + **Edit / Approve /
   Reject**. Bulk-select → bulk schedule.
   → **Elion: Slideshows.** Card = slide strip + hook + caption + hashtags +
   **Edit / Export / Delete**. No Approve/Reject (no scheduler to approve into).
5. **Edit (SlideshowEditorModal).** Left = live 9:16 preview with prev/next dots
   and a counter. Right panel has tabs:
   - **Post** — caption + hashtags
   - **Slide N** — per-slide text, delete slide, background (gradient or library pack)
   - **Export** — copy text / download bg per slide, download all bgs, copy all text
   → **Elion: Editor modal.** Same three tabs (Post / Slides / Export). Export is a
   tab, not a page — you never leave the editor to download.
6. **Approve → Schedule (ScheduleModal → ScheduleView).** Pick social accounts,
   draft vs scheduled time.
   → **Elion: gone.** No posting/scheduling in MVP.
7. **Library (LibraryView).** Browse/manage background image packs (pulled via
   Apify).
   → **Elion: IN.** Library is v1 — Pinterest pulls via platform Apify key, cached in Supabase Storage, same-origin proxy for canvas-safe export. No bundled starter packs.
8. **Results (ResultsView).** Posted results (via Postbridge).
   → **Elion: gone.** Nothing is posted by the app.

## The shell (both apps share this)

```
┌──────────┬──────────────────────────────────────────┐
│ Sidebar  │  ViewHeader (title + actions, e.g. Generate) │
│ (nav)    ├──────────────────────────────────────────┤
│          │  scrollable content — swaps per nav        │
│          │  deep flows (generate/edit/export) in modals│
└──────────┴──────────────────────────────────────────┘
```

- No router pages for the deep flows. Generate, Editor, Export all overlay the
  shell as modals — you keep your place.
- Sidebar zones: brand block → (project block) → nav → settings/account pinned.
- Elion has **one Brain per user**, so the project *switcher* disappears; the brand
  block stays as context.

## Elion pages (the set we build)

| Surface | Job | Replaces |
|---|---|---|
| **Home** (nav label) | The work list: greeting + "Your slideshows" header with a **Generate** button → modal; grid of slideshow cards with Edit / Export / Delete | Queue |
| **Editor modal** | Post / Slides / Export tabs on a slideshow | SlideshowEditorModal |
| **Generate modal** | Count (+ optional idea) → generates into Home | GenerateModal |
| **Brand** (nav label) | Niche, app name, app description, audience, style memory — autosave | Brain |
| **Billing** (nav label) | Free vs Pro, usage meter, upgrade | — (Elion adds billing) |
| **Settings** | Account (name, email, sign out) | Settings (minus keys) |
| Landing + Auth | Pre-app pages | — |

> Nav label decision (2026-08-02, user-led): the sidebar reads **Home · Brand · Billing**.
> "Slideshows" stayed as the *product* word (cards, copy, "Your slideshows") but is too
> redundant to be a nav item in an app whose whole job is slideshows; "Style" was renamed
> to **Brand** to match the "Your brand" section; "Plan" → **Billing**.

Dropped entirely: **Library, Schedule, Results, API-key settings, project
switching.**

## Where the generate button sits

SlideSmith: **top-right of the Queue view header**, opens GenerateModal (count +
packs). Elion matches exactly: the Home view's **"Your slideshows" header** carries
a **Generate** button (top-right) → GenerateModal with count 1/3/5/10 and an
**optional** idea field. Empty idea → generates purely from the Brand. The old
inline "what's this about?" idea card + example chips were removed from the main
view on 2026-08-02 (user flagged them as wrong — the flow is a generic Generate
button, not a chatbot-style prompt on the landing view).

## Naming (consistent vocabulary — the "most clear word" pass)

| Word | Meaning | Notes |
|---|---|---|
| **Slideshows** | The generated products | One slideshow = hook + slides + caption + hashtags. Never "carousels". |
| **Slides** | The 9:16 screens inside a slideshow | "12 slides" is a slideshow's size. |
| **Home** | The work list (nav label) | Landing view: greeting + "Your slideshows" + Generate. |
| **Brand** | What the AI knows about your brand (nav label) | Was "Brain", then "Style". Niche, app name, audience, style memory. Section header "Your brand". |
| **Generate** | The verb for creating slideshows | "Generate slideshow" / "Generate 5". |
| **Billing** | Free vs Pro (nav label) | Was "Plan". Usage meter lives here and in the sidebar. |
| **Settings** | Account | Name, email, sign out. |
| **Draft / Ready / Exported** | Slideshow status | Draft = generated, not reviewed; Ready = reviewed; Exported = backgrounds downloaded. |

**Inconsistencies found in the Clover mockup and fixed:**
- "Your slides" section header → **"Your slideshows"** (matches the nav word).
- "New" button (redundant with the generate card) → **removed**.
- "~6 SLIDES" chip floating inside the idea input → **removed** (was a fake affordance).
- "Account context" section → **"Your brand"** (niche/app/audience is the creator's brand, not their account).
- "FREE PLAN" / "CURRENT" / "$9/MO" → **"Free plan" / "Current" / "$9/mo"** (sentence case, no shouty caps).
- Mono uppercase eyebrows on every section → **normal-weight headings** (see audit).
- Nav "Slideshows / Style / Plan" → **"Home / Brand / Billing"** (user: the tab names sounded wrong; "Plan" should be "Billing").
- Inline "what's this about?" idea card + example chips → **removed**; Generate is now a plain header button → GenerateModal (count 1/3/5/10 + optional idea).
- Search + Bell icons and the duplicate AC avatar in the top bar → **removed** (account chip already lives pinned in the sidebar).

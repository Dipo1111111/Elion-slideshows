# Layout analysis — SlideSmith (reference for Elion's desktop UI)

> Clean-room note: this is **feature reference only**. It describes the layout *structure*
> SlideSmith uses, so we understand the bones and can build our own. No source code, prompts,
> or images are copied. Written 2026-08-02 while prepping the Clover rebuild.

## The one-line takeaway

SlideSmith is a **desktop-first, full-height app shell**: a persistent left sidebar drives
everything, the main region swaps content per sidebar selection, and deep flows (generate,
edit, export) happen in **modals** on top — not as new pages. Elion should adopt that shell,
but apply it to Clover's styling.

## App shell (the "sidebar + something else" structure)

```
┌──────────┬──────────────────────────────────────────┐
│ Sidebar  │  ViewHeader (title · subtitle · actions) │
│ 220px    ├──────────────────────────────────────────┤
│          │  scrollable content body                  │
│          │  (the "something else" — swaps per nav)   │
└──────────┴──────────────────────────────────────────┘
```

- One top-level `flex h-full` row. No router pages — a single `activeView` state; the sidebar
  sets it, `<main>` renders the matching view. Full-height, no vertical page scroll on chrome.
- The sidebar is the **only** persistent frame. Every destination is a top-level view, not a tab.

## Sidebar anatomy (fixed 220px, left, own scroll, hairline right border)

Four stacked zones:

1. **Brand block** (top, bottom-bordered): logo tile + product name + one-line descriptor
   ("Open Source Generator"). Gives the sidebar a base, not just floating nav.
2. **Project switcher** (below brand, bottom-bordered): small uppercase label, then a button
   (initials avatar + project name + chevron) that opens a popover listing projects + "New
   project". — *Elion MVP has ONE Brain per user, so we skip the switcher, but the concept of
   an account/workspace block at this spot is right.*
3. **Primary nav** (scrollable middle): vertical rows of `icon + label + right-aligned badge`.
   - Nav row anatomy: 14px icon, 13px label, count badge on the right.
   - Active state = filled/raised background + darker text; idle = muted; hover raises.
   - Order matters: work-first (Queue, Library, Schedule, Results), Brain after.
4. **Pinned bottom** (top-bordered): Settings — always one click away, separated from nav.

## Main region patterns

- **ViewHeader**: `px-8 py-5`, bottom hairline, title (semibold) + subtitle (muted) left,
  action buttons right. Every view leads with one of these.
- **Content bodies** vary by job:
  - *List of work* (Queue): full-height scrollable region, `grid` of preview cards,
    `max-w-5xl mx-auto`. Card = slide-thumbnail strip + rationale + hook + caption + hashtags
    + action row (Edit / Approve / Reject).
  - *Settings / Brain form*: **centered narrow column** (`max-w-3xl mx-auto`), grouped sections
    with uppercase labels + descriptions, 2-col grids of labeled fields, mono textarea for
    style memory.
  - *Empty states*: centered icon in a raised circle + title + one-line explanation + action.
- **Modals** carry the flows that need focus: Generate (pack picker + count), Editor
  (full-ish overlay with tabs **Post / Slide / Export**), Schedule. They overlay the shell
  rather than routing away — you keep your place.

## What's genuinely bad about their UI (so we know what NOT to keep)

- **No design system payoff**: everything is flat gray, one muted text color, `text-[13px]`
  everywhere. No type scale, no color, no accent — nothing guides the eye.
- **No hierarchy or rhythm**: dense cards, tiny icons, no spacing cadence, no empty-state
  polish. It reads "engineer's tool" not "product."
- **No delight**: zero rounded elegance, zero shadows, zero color, zero personality.

Their **layout bones** are worth keeping; their **finish** is exactly what Clover fixes.

## What Elion takes from this (bones only)

1. **Persistent left sidebar + one main region.** Kill Clover's narrow centered column for the
   core screens — desktop is the primary surface.
2. **Sidebar zones**: brand at top, primary nav in the middle, account/plan pinned at bottom.
3. **Nav = icon + label rows** with a clear active state (filled pill in Clover's green), and a
   right-aligned badge where counts matter (e.g. Slideshows count).
4. **Destinations become sidebar views, not segmented tabs.** No more "Style · Slideshows ·
   Plan" pill control. They're full screens with their own header (title + subtitle + actions).
5. **Generate / Editor / Export live in modals** on top of the shell, so switching between
   Style and Slideshows never loses your place.
6. **Two content patterns**: centered narrow column for forms (Style), scrollable card grid for
   work (Slideshows) — same as SlideSmith's Brain vs Queue.

## Proposed Elion nav (sidebar, not tabs)

- **Style** — the creator's setup (niche, app name, audience, style memory) as a grouped,
  centered form.
- **Slideshows** — the queue: scrollable grid of generated slideshows; "New slideshow" opens
  the generate modal; clicking a result opens the editor modal (slides / caption / export).
- **Plan** — usage + upgrade (pinned reachable, or its own view).
- **Account / Settings** — pinned at the bottom of the sidebar.

## Applied — Clover rebuild (2026-08-02)

Rebuilt **Clover** on this shell in `src/components/design1/clover.tsx`: styling locked
(cream `#F6F4EF`, clover green `#2E9E7B`, Manrope, rounded-2xl, soft shadows, the greeting,
logo mark, no chrome gradients) with the new bones:
- Persistent 248px sidebar: brand block (Leaf mark + "Elion" + descriptor) → workspace chip
  (Daily Grind) → nav (**Home · Brand · Billing**, active = mint pill) → pinned
  bottom (Free-plan meter card, Settings/Sign out, account chip).
- Main region: slim top bar (view name + search/bell/avatar) + scrollable content that swaps
  per nav. Slideshows view holds the greeting + generate card + "Your slideshows" card grid;
  Style is a centered grouped form; Plan is the Free/Pro comparison. `tsc` + `vite build` clean.
- **Audit cleanup pass (2026-08-02):** borders removed in favor of the locked soft shadows +
  subtle bg fills, one typeface (JetBrains Mono only inside slide thumbs), uppercase eyebrows
  replaced with normal headings, consistent naming applied ("Your slideshows", "Your brand",
  sentence-case chips). The **full app-flow map** (SlideSmith pages → Elion pages, generate
  button placement, naming table) lives in `context/app-flow-map.md`.
- **Feature-complete pass (2026-08-02):** nav renamed **Home · Brand · Billing**; Search/Bell/
  duplicate-avatar chrome removed from the top bar; the inline idea card + example chips
  removed — **Generate** is a plain button in the "Your slideshows" header (matching SlideSmith's
  Queue header) opening a GenerateModal (count 1/3/5/10 + optional idea, empty → Brand); Editor
  modal (Post / Slides / Export) added, opened by Edit (Post) or Export (Export).

# Workflow & Process Rules (Elion)

Captured 2026-08-02 from the naming/branding session. These are the user's explicit process rules — follow them.

## The build process (user's order — do NOT skip ahead)

1. **Planning phase** (DONE): this folder + `CLAUDE.md` + `BUILD_PLAN.md` + `PROGRESS_TRACKER.md`.
2. **Design exploration AFTER a name is chosen** (name now LOCKED = Elion):
   - Write a **brand markdown file** — pick a **color**, **tagline**, and **positioning** built around the Elion name. Separate Markdown file.
3. **Scaffold the React app** using **shadcn/ui** (mandatory — the user wants shadcn).
4. **Build a `/compare` page** — a *design studio* showing **4–6 completely different mockups** of what the UI could be. Mockups are **visual only, non-functional**. When I say completely different, I mean **completely different** — different layout, different hierarchy, different style, different fonts, different margins, different everything.
5. **Iterate** — keep doing batches of 5–6 brand-new designs until the user picks one they like. If not found, keep generating until hit.
6. **Extract the chosen design** into the **global CSS** (and shadcn theme tokens / Tailwind config).
7. **Then** build the real app from `BUILD_PLAN.md` and `PROGRESS_TRACKER.md`.

## Hard rules

- **Clean-room:** SlideSmith = feature reference ONLY. Never copy its code, its prompts verbatim, or its images. Reference lives at `Documents/slideshow gen software/SlideSmith`.
- **Name:** Elion ("Elion AI"). Brand flows through a `BRAND_NAME` constant + CSS tokens.
- **shadcn/ui** for all UI components — not hand-rolled buttons/cards.
- **Progress tracker drives implementation** — update `PROGRESS_TRACKER.md` as tasks complete; build in phase order.
- **No ad-hoc UI styling** — designs must come from the chosen `/compare` design first.

## Open items

- `elion.ai` domain availability check — verification method to be agreed (user rejected Bash RDAP + WebFetch-whois before). Non-blocking.
- Trademark clearance for "Elion" in the content-creation / carousel software category (Elion Health, an "Elion AI" agents platform, ELION voice agents, and elion.media exist in other categories).

## Context files in this folder

- `memory.md` — the 3-hour naming saga, user taste, verified-taken names, process history.
- `_PLANNING_STATE.md` — product plan + locked decisions.
- `reference-README.md` — SlideSmith feature surface (read-only reference).

# AGENTS.md — Behavioral Contract for AI in Elion

Rules for how any AI agent must behave — and must **NOT** behave — while working in this repo. These are binding. "AI slop" and sloppy coding are not acceptable here.

Project context (stack, clean-room law, how to run, file map): see `CLAUDE.md`. This file is about **behavior**.

---

## 1. The clean-room law (absolute)

- Elion is a clean-room rebuild. SlideSmith is **feature reference ONLY**.
- Never copy its code, prompt text, or images. Never import its files. Understand the feature, then write our own.
- Never write, commit, or modify anything inside the SlideSmith folder.

## 2. Work from the plan

- Follow `BUILD_PLAN.md` + `PROGRESS_TRACKER.md` **in order**. Tick boxes as you finish.
- Don't jump ahead to a later phase. Don't build features that aren't in scope.
- **YAGNI:** if it's not in the plan, don't add it.

## 3. File size limits

- A single code file must stay **under 250 lines** (aim ≤ 200).
- If a file is near the limit, **split it**: extract components, hooks, utilities, or a `lib/` module.
- One responsibility per file. If a file does two things, split it.
- Keep functions small too: one job per function, ≤ ~40 lines.

## 4. Styling rules (no inline CSS)

- **Never use inline `style={{...}}` props in JSX.** The only exception is dynamic canvas/geometry values in render/export code.
- Use **Tailwind utility classes** in `className`.
- All theme/token styling lives in **CSS-based files**: `src/index.css`, the shadcn theme variables, and `src/components/ui/*`.
- Repeated style patterns → extract into a component or a reusable CSS class. Don't repeat the same class soup 5+ times.
- No `!important`, no magic hex colors scattered in JSX, no random px values duplicated around the app (use theme tokens / `brand.ts`).
- **Exception (binding):** `DESIGN.md` pins the locked UI verbatim, including literal hex class strings. Where a
  DESIGN.md recipe uses a literal hex, use it exactly as written. The no-magic-hex rule yields to the contract
  for these pinned values. Token utilities may be substituted only when they render the identical value.

## 5. Code quality

- **Naming:** descriptive and precise. No `data`, `x`, `temp`, `foo`, `thing`. Name things by what they are or do.
- **No magic values:** colors, numbers, sizes used more than once → constants (`brand.ts`, config).
- **Comments:** explain **why**, not what. No "// increments counter by one" on obvious code. No commented-out code — delete it.
- **Types:** strict TypeScript. No `any` (except a documented, narrow escape), no `@ts-ignore`, no `@ts-nocheck`.
- **Error handling:** no empty catch blocks, no swallowed errors, no `console.log` left in shipped code (use a logger or rethrow).
- **Readability over cleverness:** no obfuscated one-liners, no deeply nested ternaries, no clever chains that are hard to read.

## 6. Anti-slop checklist — NEVER do these

- ✗ Leave dead code, unused imports, unused variables, unused functions.
- ✗ Leave TODO / FIXME / placeholder stubs that pretend to work.
- ✗ Ship "it compiles" without verifying it actually runs.
- ✗ Over-engineer: no speculative abstractions, factories, or config systems the app doesn't need.
- ✗ Generate filler: repetitive boilerplate a helper/loop/component would do once.
- ✗ Hardcode secrets, API keys, URLs, or user data in code.
- ✗ Add new npm dependencies without asking — they multiply risk.
- ✗ Refactor/rename unrelated code while doing a task (keep diffs minimal and focused).
- ✗ Copy patterns verbatim from SlideSmith or other projects into Elion.
- ✗ Leave the repo in a broken or half-finished state at the end of a turn.

## 7. React + TypeScript specifics

- Follow React hooks rules: no conditional hooks, correct dependency arrays.
- Functional components only; use React 19 idioms.
- Keys on list items — stable keys, not index unless the list is static.
- Colocate state; lift only when needed. No global state for local UI.
- Optimize (memo/useCallback) only when there's a measured reason — not preemptively.
- Every data call handles **loading + error** states — never leave an `await` unguarded.
- Accessible basics: real `<label>`s, semantic HTML, visible focus states, buttons as `<button>`.

## 8. Working rhythm

- Make small, verifiable changes. After any behavior-affecting change, run the app / build / the relevant check.
- Verify before claiming: if a test failed, say it failed with the output. Never claim "works" without running it.
- If something is ambiguous, **ask** — don't guess silently.
- Report faithfully: what was done, what was skipped, what's still open.

## 9. Git behavior

- Keep commits focused and meaningful; follow the project's conventions.
- Don't commit unless asked to, or as an agreed step.
- Never touch SlideSmith — it is read-only reference.

## 10. Final check before calling something done

1. File sizes within limits (≤ 250 lines)?
2. No inline `style={...}`? Styling in utilities / CSS files?
3. No dead code, unused imports, `console.log`s?
4. TypeScript clean (no `any`, no `ts-ignore`)?
5. Actually verified it runs (dev or build)?
6. `PROGRESS_TRACKER.md` updated?

## 11. The UI is a locked reproduction — NO deviation

- `DESIGN.md` (repo root) is the binding visual contract. The build renders exactly what it specifies.
- **Never restyle.** No "improvements", no margin/radius/color/font/spacing/copy tweaks, no "make it look better".
  The only allowed deviations are the exhaustive list in DESIGN.md §11 (DemoBar excluded, real data fills slots,
  "carousels" → "slideshows", /design1 not shipped, shadcn only if themed exactly).
- If you believe something in the contract looks wrong, build it exactly as specified and flag it in your report.
  Do not change it.

## 12. Open items — things to come back to (user-directed)

- **Tagline: NONE.** Decided 2026-08-02 — the user dropped the tagline entirely. Do NOT invent one.
  If ever revisited, the user's own candidates were the "cheat code" angle: "the cheat code for slideshow
  creators", "the cheat code for creating slides", "the replacement for slides" (earlier ideas: "Just post.",
  "You think. We write.").
- **Word choice:** user-facing copy calls the product's output **slideshows / slides** — never "carousels."
- **`elion.ai` domain check** — still open; verification method to be agreed (user rejected Bash RDAP + WebFetch-whois).
- **Trademark clearance** for "Elion" in the content-creation category (informational).
- Post-launch (v2): Claude Haiku model swap, stock background packs, server-side watermark.

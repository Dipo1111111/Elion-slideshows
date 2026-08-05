# loop.md — Loop Engineering for the Elion build

> How this build is executed: one generate → verify → persist loop, run to the end.
> Pattern after Andrej Karpathy's LOOPS.md. The job is not "write files"; it is
> "loop until every verifier passes, checkpoint, and keep going."

## The loop

```
generate → verify → persist → advance → (repeat) → done
```

- **generate**: write the code for the current phase (one cohesive unit at a time).
- **verify**: run every verifier that can catch a defect cheaply. Fix what they
  catch before moving on. A phase is not "done" until its verifiers pass.
- **persist**: checkpoint. Update `PROGRESS_TRACKER.md` (tick the boxes), the
  task list, and `context/_PLANNING_STATE.md`. The checkpoint is the resume
  point if the session dies.
- **advance**: next phase per `BUILD_PLAN.md §15`. Never skip ahead and never
  restart — resume from the last checkpoint.

## Verifiers (cheap, fast, run constantly)

1. **`npx tsc`** — TypeScript. Type errors are build breakers; fix immediately.
2. **`npm run build`** — full vite build. Catches import/alias/module issues tsc misses.
3. **Impeccable detector** — `node C:/Users/USER/.claude/skills/impeccable/scripts/detect.mjs --json <file>`
   for each UI file touched. Catches off-palette colors, gradient text, eyebrows,
   side-stripes, glassy overuse. Must return `[]` (or only accepted) per file.
4. **Em-dash grep** — every user-facing string. `grep -rn "—" src/` must be empty
   in UI copy. Periods, commas, colons only.
5. **Palette discipline check** — visual scan + grep for hex: only `#000`/`#08080A`
   family, neutrals from the hairline ramp, `#3B82F6` accent (and its /20 /25
   glass forms), white. No navy tints (`#0E0F13` is banned), no amber, no purple.

Heavy verification happens at checkpoints (tsc + build + detector + grep together).
Light verification (tsc) happens as often as it's cheap.

## Persistent state — the checkpoint

- `PROGRESS_TRACKER.md` — the live checklist. Phases are ticked **only** when
  their verifiers pass.
- Task list (session) — mirrors the current phase; updated every checkpoint.
- `context/_PLANNING_STATE.md` — architectural state; updated when a decision changes.
- `BUILD_PLAN.md` — source of truth for what is being built. Do not drift from it.

Rule: **never trust memory, always trust the files.** If a session resumes, the
first action is to read the tracker's last ticked phase and the open items, then
continue from exactly there.

## Bilevel loop

- **Outer loop**: the phases (tokens → auth → brain → generate → queue → export
  → library → billing → landing → security). One phase, one checkpoint.
- **Inner loop**: within a phase, one component/route at a time (generate → verify
  → next). The inner loop is what keeps each unit small enough to verify cheaply.

The two loops meet at the checkpoint: outer advances only when the inner loop's
last unit passed every verifier.

## Loop-to-the-end

"Done" is not "the code compiles". Done is:

1. Every verifier passes on the whole repo (`tsc`, `build`, detector sweep, em-dash grep).
2. Every phase in `PROGRESS_TRACKER.md` through Phase 9 is ticked (Phases 0 and 1
   already are; Phases 10/11 are deploy + hardening, Phase 10 is user's).
3. The app boots with **no env vars set** and every surface renders a sane state
   (not configured / empty / signed-out) instead of crashing.
4. What remains is explicitly external to this loop: Supabase project + keys,
   OpenRouter key, Apify key, Lemon Squeezy store + variants + webhook secret,
   Render deploy, and a Playwright end-to-end pass against real keys.

When 1–3 hold, the loop is exhausted and the code job is done.

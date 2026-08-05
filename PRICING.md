# Elion Pricing Model — 2026-08-04

Monte Carlo unit-economics + conversion model. Script: `scripts/pricing.mjs` (100k runs per structure, no deps).

## TL;DR (recommendation)

**Three columns: Free · Creator $19/mo ($190/yr) · Studio $49/mo ($490/yr).**

- **Keep $19 as the anchor.** Fix the annual to **$190/yr** (10 months, ~17% off). The current $99/yr on a $19 list is a 57% discount that was inherited from the $10 era and is inconsistent.
- **Add a Studio tier at $49/mo** for multi-brand creators (500 slideshows/mo, 10 projects, priority model). Near-zero marginal cost makes it almost pure profit.
- **Do NOT add a $9 Starter tier at launch.** The math makes it look attractive, but that is an artifact of the model ignoring support load and cheap-tier churn, and it fights the brand positioning. Revisit with real conversion data after launch.

## Why the price is a positioning decision, not a math decision

One slideshow costs us roughly **$0.0015** (p10 $0.0005, p90 $0.0040):

| Component | Cost / slideshow |
|---|---|
| LLM (flash-class on OpenRouter, batched 3/call, ~800 in / ~400 out tokens) | ~$0.0005 |
| Apify Pinterest pull (pooled: ~40 images → ~15 slideshows) | ~$0.0003 |
| Egress + storage (~6 MB / slideshow) | ~$0.0006 |
| Buffer / misc | ~$0.0001 |

So per-user variable cost is trivial:

| Slideshows/mo | Cost/user/mo (median) | Worst case (p90) |
|---|---|---|
| 3 | ~$0.00 | ~$0.01 |
| 10 | ~$0.01 | ~$0.05 |
| 30 | ~$0.04 | ~$0.15 |
| 100 | ~$0.15 | ~$0.50 |
| 500 | ~$0.75 | ~$2.50 |

The real per-subscriber costs are **Lemon Squeezy fees (5% + $0.50)** and **fixed overhead (~$40/mo**: Render + Supabase + domain + misc). A $19 subscriber generating 20 slideshows/mo nets ~$17/mo, **~89% gross margin**. A $49 Studio subscriber generating 100/mo nets ~$45/mo.

Because marginal cost is ~0, **the profit curve is nearly flat across every price from $9 to $39**. The variable that actually moves the business is visitors × signup conversion, not price. Price is a brand and retention decision.

## Monte Carlo results (10,000 visitors/mo, steady state)

| Structure | Paying users (median) | Gross/mo | Profit/mo | P(profitable) | P(≥100 users) |
|---|---|---|---|---|---|
| A. Free + Pro $19 (2 plans, as-locked, $99/yr) | 53 | $832 | $717 | 98.1% | 28% |
| **B. Free + Creator $19 + Studio $49 (recommended)** | **59** | **$1.5k** | **$1.4k** | **99.2%** | **32%** |
| C. Free + Starter $9 + Creator $19 + Studio $39 | 143 | $2.9k | $2.6k | 99.7% | 62% |
| D. Free + Creator $29 + Studio $59 | 37 | $1.3k | $1.2k | 99.1% | 18% |

p10–p90 (B): 12–230 users, $305–$6.3k gross, $237–$5.8k profit.

## Odds: does a visitor convert?

| Structure | Payers per 10,000 visitors/mo |
|---|---|
| A | ~5 |
| B | ~6 |
| C | ~12 |
| D | ~4 |

Funnel: 10k visitors × ~2.5% signups × ~2.4% paid conversion ≈ **6 new payers/mo**; × ~12.5-mo lifetime ≈ **~75 paying steady-state** (B).

## Price sweep (single paid tier, annual = 10 months)

| Price | Paying users | Profit/mo | P(≥100 users) |
|---|---|---|---|
| $9 | 120 | $889 | 56% |
| $12 | 88 | $881 | 45% |
| $15 | 68 | $855 | 36% |
| $19 | 53 | $850 | 28% |
| $25 | 39 | $834 | 19% |
| $29 | 33 | $825 | 15% |
| $39 | 24 | $796 | 9% |

**Price buys users, not profit.** Dropping $19 → $9 roughly 2.3x's users at flat profit. But every 2x of *visitors* doubles users at any price. The growth lever is marketing, not a cheaper anchor. Cheap pricing also raises support load and churn, which this model deliberately does not charge (both effects favor the low tier, so the recommendation is conservative against them).

## Feature matrix (recommended 3 columns)

**Free ($0, no card):**
- 3 lifetime slideshows (never expires, no monthly reset)
- AI writes the script in your Brain's voice: hook, 5-6 slides, caption, 3 hashtags, rationale
- Pinterest background library: pull backgrounds by search, swap any slide's background
- Full editor: edit the hook, every slide's text, the caption, the hashtags
- Export: 1080×1920 background PNGs per slide + copyable text (per slide and all at once)
- Small 'Made with Elion' mark in the bottom-right corner of every exported background
- 1 brand project (niche, app name, app description, audience, style memory)
- Anti-abuse rate limit: 10 generations/hour

**Creator ($19/mo or $190/yr):**
- 100 slideshows per month (resets each calendar month)
- Everything in Free
- No watermark on exports
- 3 brand projects, each with its own Brain and its own queue
- Project switcher + create new projects

**Studio ($49/mo or $490/yr):**
- 500 slideshows per month
- Everything in Creator
- 10 brand projects
- Priority generation (skips ahead in the queue)
- Higher-quality model option for script writing
- Priority support

Not in any tier: posting, scheduling, or analytics (manual posting in TikTok/IG, v1 scope).

- Free costs ~$0.03/user lifetime (3 × $0.0015 + infra) and is the cheapest possible acquisition channel.
- Caps are placeholders behind the `LIMITS` config; 100/mo at $19 is safe even at p90 cost ($0.50/user/mo).

## Model caveats

- Signup (2.5%) and paid conversion (2.4%) are beta priors from typical self-serve freemium; replace with real data post-launch.
- Churn (8%/mo, ~12.5-mo lifetime) is flat across price; real cheap tiers churn faster.
- No per-user support/abuse cost is charged; this makes low-price tiers look better than they are.
- $99/yr is flagged as inconsistent with a $19 list throughout the codebase and docs (see PROGRESS_TRACKER Phase 8). Fix to $190/yr if the recommendation is adopted.

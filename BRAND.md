# BRAND — Elion AI

> Identity source of truth. The **brand system** (name, palette, voice) lives here.
> The **app's visual theme** (shadcn CSS tokens) is extracted later from the chosen `/compare` design — the brand system holds across that.

---

## Name

- **Elion** — brand form **"Elion AI"**. Constant `BRAND_NAME` in `src/lib/brand.ts`.
- Namesakes exist in other categories (healthcare IT, an agents platform, voice agents, media). Elion owns the **content-creation lane**.
- Wordmark only — no logo/icon in MVP. The free-tier export watermark is the wordmark, white and semi-transparent.

## What it is (one line)

Elion makes slideshows faster. You bring the idea; Elion does the slow part — finding slide backgrounds and writing the script. It hands back the background images (1080×1920) plus the hook, slide text, caption, and hashtags, ready to drop into TikTok/IG's native app.

## What problem it solves

The time cost of a slideshow is everything before you post: hunting for the right background slides, then writing the hook, the slide-by-slide script, the caption, and the hashtags. Elion removes that grind — instead of sourcing and writing for an hour, you type what the post is about and get backgrounds + copy in one shot. Generate, review, export, post.

## Positioning

For solo TikTok/Instagram creators, Elion is the tool that takes the slow, manual setup out of slideshows. It writes the script and supplies the slide backgrounds, so you go from idea to postable slideshow in minutes instead of an evening.

## Tagline — NONE

Decided 2026-08-02: **Elion has no tagline.** User's call. Do not invent one.

If ever revisited, the user's own candidates were the "cheat code" angle:
- "The cheat code for slideshow creators"
- "The cheat code for creating slides"
- "The replacement for slides"
(earlier ideas: "Just post.", "You think. We write.")

Word choice: user-facing copy calls the output **slideshows / slides** — never "carousels."

## Palette — Black & White + Blue

Dead-ass black & white base with **one** bright accent. **Blue** (`#3B82F6`) is the accent.
Pink and purple are **out**. Gold was retired 2026-08-03 (gold-on-dark read as Claude's brand); blue replaces it. Never add a second accent.

| Token | Hex | Use |
|---|---|---|
| background | `#000000` | app canvas |
| surface | `#0E0E0E` | cards / raised panels |
| muted | `#161616` | secondary fills |
| border | `#262626` | hairline dividers |
| foreground | `#FFFFFF` | primary text |
| muted-foreground | `#A1A1AA` | secondary text |
| **primary (blue)** | **`#3B82F6`** | CTAs, active nav, focus rings, small highlights — **the pop** |
| primary-foreground | `#000000` | text on blue |

- Blue is used **sparingly**: primary actions, active states, focus. Never flood the UI with it — when everything pops, nothing pops.
- White buttons (`background #FFFFFF`, black text) are the secondary action style.
- No other color enters the UI.

## Typography

- **Schibsted Grotesk Variable** (`--font-display`) — headers and titles.
- **Inter Tight Variable** (`--font-sans`) — body/UI and the whole sidebar.
- **DM Sans Variable** (`--font-num`) — numbers and counters: prices, slide indices, usage figures.
- Icons: lucide-react at `strokeWidth={1.5}`.

## Voice

Warm, direct, zero hype-speak. Speaks like a smart friend who knows the platform. Short sentences, confident, factual.

- DO: "Generate 5 slideshows." / "Free includes 3 lifetime generations."
- DON'T: "Unleash the power of AI storytelling." / "Elevate your content." / "Unlock your potential."

## Export / watermark

- Free tier: `BRAND_NAME` wordmark, white, semi-transparent, baked into exported backgrounds (accepted for MVP). Pro: clean.
- Slide backgrounds are real photos from the image library (Pinterest pulls via the platform Apify key), always loaded same-origin through `/api/images/:hash`. There is no gradient state in the UI; new users see an empty state, generating shows a skeleton loader, then image-backed cards.

---

_Tokens: `src/lib/brand.ts` · Tracker: `PROGRESS_TRACKER.md` C1 · Tagline: none (decided). Rejected: "Your story, told in your voice" · "AI carousels, ready to post" · "Writes your carousel for you" — then the whole tagline exercise._

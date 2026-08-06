# DESIGN.md: The UI Contract (LOCKED)

This is the binding visual contract for Elion's product UI. It is a **1:1 specification** of the
locked design, `src/components/design1/synthover.tsx`. Every value below is final.

**THE RULE: there is no deviation.** The build must render exactly what this document specifies.
Do not "improve" it, do not tweak margins, radii, colors, fonts, spacing, copy, or layout. Do not
"make it look better." Do not iterate on the look. If a value is pinned here, it is pinned. The only
changes allowed are the ones explicitly listed in [§11 Allowable deviations](#11-allowable-deviations).

The reference implementation is `src/components/design1/synthover.tsx`. When this document and the
file disagree, **this document wins** (it was written from a full audit of the file).

`src/index.css` already encodes the theme (design-role tokens + shadcn semantic mapping, dark-only).
Use the class strings in this document directly. Where a token utility (`bg-page`, `border-hairline`,
`text-ink-faint`, `bg-accent-glass`, `bg-action-glass`, ...) renders the identical value as the hex in
a recipe, you MAY use the utility; the rendered color must match the recipe exactly. Do not invent new
tokens.

---

## 1. The scene (why it is dark)

Night. A creator in a dim room, phone in hand, has an idea and wants it turned into a post they can
ship tonight. The interface recedes; the work is black, hairline-drawn, with one blue thread of state
and white triggers. Dark-only. There is no light theme, and `:root` carries the dark values.

## 2. Design language (recap, binding)

- **Page** is deep matte black `#08080A`. Containers are **transparent with a hairline border**, never
  filled card surfaces, no navy tints, no grey panels. The only filled areas are the inset `#0C0D10`
  (media strips, thumbnails, field bodies, style-memory box) and the specific status chips listed below.
- **One accent = blue `#3B82F6`, used as translucent glass only**: `/20` fills, never solid except tiny
  data marks (usage-meter fill, selection check, active nav dot) and as text (links, active nav).
- **Two action/state languages. WHITE is the action language** (primary CTA is white glass: `bg-white/20`
  + `border-white/30` + white ink). **BLUE is the state language** (status, selection, links, focus ring).
- **Modals are the only elevated layer** (backdrop + `shadow-2xl` + `backdrop-blur-xs`).
- **No gradient state anywhere.** Slides always show real photos. A new user sees an EMPTY STATE,
  generating shows a SKELETON LOADER, and only after generation do image-backed cards appear.
- **Radius is constant per role**, it is never a hierarchy lever. See §5.
- **Fonts:** Schibsted Grotesk = headers/display (`font-display`), Inter Tight = body + the whole
  sidebar (`font-sans`), DM Sans = numbers/counters (`font-num`). Icons: lucide-react at
  `strokeWidth={1.5}`.
- **Copy rule: NO em dashes.** Periods, commas, colons. Output is "slideshows" and "slides", never
  "carousels".
- **Wordmark only.** The real Elion logo (`src/assets/elion-logo.png`, white on transparent) is used
  wherever a brand mark appears. Never invent a logo mark.

## 3. Color registry (complete)

Every color that appears in the locked design. Grouped by role.

### 3.1 Surface & hairline ramp

| Value | Role |
|---|---|
| `#08080A` | **page.** App background, sidebar, modal panels, input/count/filter bodies |
| `#0C0D10` | **inset.** Media strips on cards, field bodies, SlideThumb background, style-memory box |
| `#121317` | quiet chip background (Draft/Exported status chips), disabled prev/next background |
| `#14151B` | Brand-strip hover background |
| `#16171D` | **sidebar hairline.** Sidebar border-right, account divider, DemoBar border (DemoBar not shipped) |
| `#181920` | avatar background |
| `#1A1B21` | Shimmer (skeleton) background, QuietButton hover background, hashtag-chip background |
| `#1C1E26` | field border, disabled prev/next border |
| `#1E2026` | prev/next button background |
| `#1E2028` | **card hairline.** Card borders, plan widget, empty-state section |
| `#1F2026` | editor modal divider (preview border-r, tab-bar/footer border-b) |
| `#1F212B` | input hairline, inactive filter/count-pill border, export-row border |
| `#22242D` | modal border (Generate + Editor panels) |
| `#262834` | chip hairline (Draft/Exported chips, feature chips, "or $190/yr"), avatar border, prev/next border |
| `#282B33` | prev/next hover background |
| `#2E3140` | **hairline-strong.** QuietButton border, card hover border |

### 3.2 Ink ramp (text)

| Value | Role |
|---|---|
| `#FFFFFF` | pure white. MintButton ink, Ready-chip ink + dot, active nav dot, check marks, slide index |
| `#F2F4F7` | hook line on cards |
| `#E5E7EB` | **primary ink.** Root text, field values, style-memory text, export-row text, prices, Creator list |
| `#D1D5DB` | secondary text. QuietButton ink, Free-plan list text |
| `#9CA0A8` | muted/faint. Labels, captions, subtitles, meta-ish text, chip ink, helper text |
| `#8E8E93` | meta, inactive filter/count ink, prev/next counter, close icon, editor delete/shuffle link ink |
| `#7C838C` | placeholder text, "+N more", delete-icon idle, Generate-modal helper |
| `#7A7F87` | nav inactive ink, Settings/Sign-out ink |
| `#6E737B` | dim. Plan-widget count, Draft dot, preview-icon idle |
| `#5F646B` | nav icon idle, Search icon, Settings/LogOut icons |

### 3.3 Accent (blue), the state language

| Value | Role |
|---|---|
| `#3B82F6` | accent. **Solid only for data marks** (usage-meter fill, library check, active nav dot) **and text** (links, active nav). Everything else is glass. |
| `#6FA1FF` | accent hover. Links, active-nav hover, Generate-row hover |
| `bg-[#3B82F6]/20` | accent glass fill. Ready chip, Current chip, active count pill, active filter, active editor tab, export index tiles, brand-strip icon tile active |
| `border-[#3B82F6]/40` | Creator card border |
| `border-[#3B82F6]/60` | library picked-image border |
| `ring-2 ring-[#3B82F6]` | editor background-override selection ring |

### 3.4 White action glass, the action language

| Value | Role |
|---|---|
| `bg-white/20` + `border-white/30` + `hover:bg-white/30` | **MintButton** (primary CTA) |
| `bg-white/10` | empty-state icon tile, brand-strip icon tile, usage-meter track |
| `border-white/10` | gallery-preview avatar border (not product UI) |
| `text-white/90` | slide index numerals (with `drop-shadow`) |
| `bg-white` | Ready chip dot, active editor nav dot |

### 3.5 Black scrims (legibility only, never decoration)

| Value | Role |
|---|---|
| `bg-black/80` + `backdrop-blur-xs` | modal backdrop |
| `bg-black/55` | Library "Use on slide" hover label |
| `bg-black/30` | Library hover overlay |
| `bg-black/25` | SlideThumb legibility scrim |
| `bg-black/20` | editor preview scrim |
| `bg-black/0` | Library overlay default (transitions to `black/30` on hover) |

### 3.6 Danger

| Value | Role |
|---|---|
| `#F4877E` | over-limit cost text, delete-hover ink |
| `#3A2320` | delete-hover background |

### 3.7 Elevation / material

| Value | Role |
|---|---|
| `shadow-2xl` | modals only |
| `backdrop-blur-xs` | modal backdrop only |
| `drop-shadow` | slide-index numerals (legibility) |

## 4. Typography (exact per role)

Sizes are absolute pixels via arbitrary values (`text-[13px]`). Do not change sizes.

| Element | Classes |
|---|---|
| Home greeting (h1) | `font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white` |
| Page title, Library/Brand/Billing (h1) | `font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white` |
| Section title, "Your slideshows" (h2) | `font-display text-[16px] font-bold text-white` |
| Modal title | `font-display text-[17px] font-bold tracking-[-0.01em] text-white` |
| Card title (h3) | `font-display text-[15px] font-bold leading-snug text-white` |
| Brand section label / strip title | `font-display text-[13px] font-bold text-white` |
| Empty-state title | `font-display text-[17px] font-bold text-white` |
| Greeting subtitle | `mt-1.5 text-[13.5px] text-[#9CA0A8]` (accent span: `text-[#3B82F6]`) |
| Page subtitle (Library/Brand/Billing) | `mt-1.5 text-[13px] text-[#9CA0A8]` |
| Work-list subtitle | `mt-1 text-[12px] font-medium text-[#9CA0A8]` |
| Card hook | `mt-1 text-[13px] font-semibold leading-snug text-[#F2F4F7]` |
| Card caption | `mt-1.5 line-clamp-2 (or -3) text-[12px] leading-relaxed text-[#9CA0A8]` |
| Card meta | `text-[11.5px] font-medium text-[#8E8E93]` |
| Empty-state body | `mt-1.5 max-w-[380px] text-[13px] leading-relaxed text-[#9CA0A8]` |
| Nav rows | `text-[13px] font-medium` |
| Generate row | `text-[13px] font-bold` |
| MintButton | `text-[13px] font-semibold` (modal footer: `text-[12.5px]`; export actions: `text-[12px]`) |
| QuietButton | `text-[12px] font-semibold` |
| StatusChip | `text-[11px] font-bold` |
| Hashtag chip | `text-[11px] font-medium` |
| Feature chip / "or $190/yr" / Current | `text-[11px] font-bold` |
| Filter chip / editor tab | `text-[12px] font-semibold` |
| Field label | `text-[11px] font-semibold text-[#9CA0A8]` |
| Modal field label | `text-[11px] font-bold text-[#9CA0A8]` |
| Field value | `text-[13px] text-[#E5E7EB]` |
| Plan widget label | `text-[11px] font-semibold text-[#9CA0A8]` |
| Plan widget count | `font-num text-[11px] text-[#6E737B]` |
| Blue link (Upgrade / Open Brand / Tune) | `text-[12px] font-bold text-[#3B82F6] hover:text-[#6FA1FF]` |
| Sidebar account name | `text-[12px] font-semibold text-white` (truncate) |
| Sidebar account email | `text-[11px] text-[#8E8E93]` (truncate) |
| Avatar initials | `text-[10px] font-bold text-white` |
| Slide index (thumb) | `font-num text-[9px] font-bold text-white/90 drop-shadow` |
| Slide index (editor preview) | `font-num text-[10px] font-bold text-white/90 drop-shadow` |
| Export index tile | `font-num text-[11px] font-bold text-white` |
| Prev/next counter | `font-num text-[11px] text-[#8E8E93]` |
| Price | `font-num text-[28px] font-bold leading-none tracking-tight text-white` |
| Count pill | `font-num text-[13px] font-bold` |
| "+N more" | `text-[11px] font-semibold text-[#7C838C]` |
| Editor sub-links (delete/shuffle/browse/copy/image) | `text-[11px] font-semibold` (colors per §9) |
| Modal helper | `text-[12px] text-[#8E8E93]` |
| Modal subtitle | `mt-1 text-[12.5px] text-[#9CA0A8]` |
| Generate-modal cost line | `mt-3 text-[11.5px] font-medium text-[#8E8E93]` |
| Export-tab intro | `text-[12px] leading-relaxed text-[#9CA0A8]` |
| Library hover label | `text-[11px] font-semibold text-white` |
| Billing list | `text-[13px]` (`#D1D5DB` on Free, `#E5E7EB` on Creator/Studio) |
| Export row slide text | `min-w-0 flex-1 truncate text-[12px] text-[#E5E7EB]` |

**`font-num` is ONLY for:** prices, slide indices, usage figures, count pills, prev/next counter,
export index tiles. Never for labels or body.

## 5. Radius (constant per role, never a hierarchy lever)

| Role | Radius | Used on |
|---|---|---|
| Pill | `rounded-full` | MintButton, QuietButton, StatusChip, hashtag chips, feature chips, filter chips, editor tabs, prev/next buttons, nav dots, Current chip, "or $190/yr" chip, delete button, usage-meter track + fill, library check, avatar |
| Modal | `rounded-2xl` | GenerateModal panel, EditorModal panel |
| Card | `rounded-xl` | slideshow cards, empty-state section, plan widget, Brand sections, Library image cards, Brand strip, Billing cards |
| Control | `rounded-lg` | nav rows, Generate row, Settings/Sign-out rows, inputs, fields, SlideThumb, Shimmer, count pills, export rows, export index tiles, editor background thumbs, brand-strip icon tile |
| Micro | `rounded-md` | Shimmer line variants, Library hover label |

## 6. Geometry (exact numbers)

- **Shell:** `flex h-screen w-full flex-col overflow-hidden bg-[#08080A] text-[#E5E7EB]`; inner row
  `flex min-h-0 flex-1` = Sidebar + `main.min-w-0.flex-1.overflow-y-auto`. (The mockup has a DemoBar
  above this row; DemoBar is NOT product UI, see §11.)
- **Sidebar:** fixed `w-[240px] shrink-0`, `border-r border-[#16171D]`, whole sidebar `font-sans`.
  - Brand block: `px-5 pb-5 pt-6`, logo `h-6 w-auto`.
  - Generate row wrapper: `px-2`.
  - Nav: `flex-1 space-y-1 overflow-y-auto px-2 py-2`.
  - Pinned bottom: `p-3`.
- **Content widths:** Home + Library `mx-auto w-full max-w-[880px] px-6 py-8`. Brand + Billing
  `mx-auto w-full max-w-[720px] px-6 py-8`.
- **Header margins:** Home `mb-8`. Library/Brand/Billing `mb-7`.
- **Work-list header:** `mb-4 flex items-end justify-between gap-4` (title+count left, one Generate
  MintButton right).
- **Card grid:** `grid grid-cols-1 gap-4 lg:grid-cols-2`. First card is `lg:col-span-2` (featured,
  full-width with horizontal thumb strip); the rest fill the two columns.
- **Row heights:** nav rows, Generate row, Settings/Sign-out rows are all `h-9` with `gap-3 px-3`.
- **Icon sizes in rows:** nav/generate icons `h-[16px] w-[16px]`; Settings/LogOut `h-4 w-4`.
- **MintButton:** `px-5 py-2.5` (default), `gap-2`; icon `h-4 w-4`. QuietButton: `px-3 py-1.5`,
  `gap-1.5`; icon `h-3 w-3`.
- **Modals:** Generate panel `w-full max-w-md p-6`. Editor panel `max-h-[90vh] w-full max-w-4xl`;
  preview side `sm:w-80` + `border-r border-[#1F2026]`; editor side `sm:w-96`.
- **Thumb strips on cards:** featured strip `flex shrink-0 items-center gap-2 bg-[#0C0D10] p-4` with
  `w-24` thumbs; grid-card strip `flex gap-2 bg-[#0C0D10] px-4 py-3` with `w-12` thumbs.
- **SlideThumb:** `relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg bg-[#0C0D10]`, image
  `absolute inset-0 h-full w-full object-cover`, scrim `absolute inset-0 bg-black/25`, index
  `absolute inset-0 flex items-center justify-center`.
- **Library grid:** `grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4`.
- **Editor bg-override grid:** `grid grid-cols-4 gap-1.5`, thumbs `relative aspect-[9/16]
  overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5`, selected `ring-2
  ring-[#3B82F6]`.

## 7. Component recipes (verbatim)

> These are the exact class strings from the locked design. Copy them. `FOCUS` =
> `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]` and is
> appended to every interactive element.

**SlideThumb**
```
relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg bg-[#0C0D10]   (+ width override)
  <img class="absolute inset-0 h-full w-full object-cover" loading="lazy">
  <div class="absolute inset-0 bg-black/25" />                              (legibility scrim)
  <span class="absolute inset-0 flex items-center justify-center font-num text-[9px] font-bold text-white/90 drop-shadow">{index}</span>
```

**Shimmer (skeleton block)**
```
animate-pulse rounded-lg bg-[#1A1B21]   (+ size overrides)
```

**MintButton (primary action: white glass)**
```
inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/20
px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/30   + FOCUS
icon: h-4 w-4 (lucide, strokeWidth 1.5)
```

**QuietButton (secondary action)**
```
inline-flex items-center gap-1.5 rounded-full border border-[#2E3140] bg-transparent px-3 py-1.5
text-[12px] font-semibold text-[#D1D5DB] transition-colors hover:bg-[#1A1B21] hover:text-white   + FOCUS
icon: h-3 w-3
```

**StatusChip**
- Ready: `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3B82F6]/20
  px-2.5 py-1 text-[11px] font-bold text-white` + dot `h-1.5 w-1.5 rounded-full bg-white`.
- Draft / Exported: `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border
  border-[#262834] bg-[#121317] px-2.5 py-1 text-[11px] font-bold text-[#9CA0A8]` + dot
  `h-1.5 w-1.5 rounded-full bg-[#6E737B]` (Draft) or `bg-[#9CA0A8]` (Exported).

**Field (Brand view read-only box)**
```
label: mb-1.5 block text-[11px] font-semibold text-[#9CA0A8]
box:   flex items-center rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3.5 py-2.5
       text-[13px] text-[#E5E7EB]
```

**Input (modal / library search / editor)**
```
w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white
outline-none placeholder:text-[#7C838C] focus:border-[#52525B]
(library search: py-2.5 pl-9 pr-3.5, leading Search icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F646B])
```

**Textarea (editor)**
```
w-full resize-none rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-3 text-[13px]
leading-relaxed text-white outline-none focus:border-[#52525B]
```

**Nav row (sidebar)**
```
flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition-colors
active:   text-[#3B82F6]        (icon: h-[16px] w-[16px] text-[#3B82F6])
inactive: text-[#7A7F87] hover:text-[#D1D5DB]   (icon: text-[#5F646B])
+ FOCUS; aria-current={isActive ? 'page' : undefined}
```

**Generate row (sidebar primary action: nav-style text row, NOT a padded pill)**
```
flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left font-bold text-white transition-colors
hover:text-[#6FA1FF]   + FOCUS
Plus icon: h-[16px] w-[16px] shrink-0 text-white
label: text-[13px]
```

**Plan widget (sidebar bottom)**
```
rounded-xl border border-[#1E2028] p-3.5
header:  flex items-baseline justify-between gap-2
         "Free plan"  -> text-[11px] font-semibold text-[#9CA0A8]
         "{used} of 3 used" -> font-num text-[11px] text-[#6E737B]
track:   mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10
fill:    h-full rounded-full bg-[#3B82F6]   (width = round(used/3*100)%)
upgrade: mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6]
         hover:text-[#6FA1FF] + FOCUS   (ArrowRight h-3 w-3)
```

**Settings / Sign out rows**
```
flex h-9 items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium
text-[#7A7F87] transition-colors hover:text-[#D1D5DB]   + FOCUS
icon: h-4 w-4 text-[#5F646B]
```

**Account block (sidebar bottom)**
```
mt-2 flex items-center gap-2.5 border-t border-[#16171D] px-1.5 pt-3
avatar: flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#262834]
        bg-[#181920] text-[10px] font-bold text-white        (initials)
name:   min-w-0 truncate text-[12px] font-semibold text-white
email:  truncate text-[11px] text-[#8E8E93]
```

**Focus ring (global constant)**
```
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]
```

## 8. States

| State | Behavior |
|---|---|
| Card hover | border `#1E2028` → `#2E3140` (`transition-colors`) |
| Delete hover | `text-[#7C838C]` → `hover:bg-[#3A2320] hover:text-[#F4877E]` |
| QuietButton hover | `hover:bg-[#1A1B21] hover:text-white` |
| Nav hover | text `#7A7F87` → `#D1D5DB`; icon stays `#5F646B` |
| Nav active | text + icon `#3B82F6`; no background, no pill |
| Generate row hover | text white → `#6FA1FF` |
| Blue link hover | `#3B82F6` → `#6FA1FF` |
| Input focus | `border-[#1F212B]` → `border-[#52525B]` |
| Library image hover | border `#1E2028` → `#2E3140`; overlay `bg-black/0` → `bg-black/30`; label opacity 0 → 100 |
| Library picked | border `#3B82F6]/60` + solid blue check `bg-[#3B82F6]` |
| Editor bg-override hover | `hover:-translate-y-0.5`; selected `ring-2 ring-[#3B82F6]` |
| Prev/next enabled | `border-[#262834] bg-[#1E2026] hover:bg-[#282B33]` |
| Prev/next disabled | `disabled:cursor-not-allowed disabled:border-[#1C1E26] disabled:bg-[#121317] disabled:text-[#3A3F47] disabled:hover:bg-[#121317]` |
| Editor nav dots | active: `w-5`, `backgroundColor #FFFFFF`; inactive: `w-1.5 bg-[#3A3F47]` (`transition-all`) |
| Skeleton | `animate-pulse` Shimmer blocks, same card anatomy as the real cards |
| Focus | every interactive element gets the blue `focus-visible` ring |

## 9. Icons (lucide-react, `strokeWidth={1.5}`)

| Role | Icon | Size |
|---|---|---|
| Nav: Dashboard / Library / Brand Voice / Plan & Billing | `Home` / `Images` / `BookOpen` / `Wallet` | `h-[16px] w-[16px]` |
| Generate row | `Plus` | `h-[16px] w-[16px]` |
| Settings / Sign out | `Settings` / `LogOut` | `h-4 w-4` |
| Empty-state tile | `Images` | `h-5 w-5` |
| MintButton icons | per action (`Plus`, `Download`, `Check`) | `h-4 w-4` |
| QuietButton icons | per action (`PenLine`, `Download`, `Copy`) | `h-3 w-3` |
| Blue links | `ArrowRight` | `h-3 w-3` |
| Card delete | `Trash2` | `h-3.5 w-3.5` |
| Brand strip | `Sliders` (tile) + `ArrowRight` | `h-4 w-4` / `h-3 w-3` |
| Library search | `Search` | `h-4 w-4` |
| Billing list | `Check` | `h-3.5 w-3.5` |
| Modal close | `X` | `h-[18px] w-[18px]` |
| Editor prev/next | `ChevronLeft` / `ChevronRight` | `h-3.5 w-3.5` |
| Editor slides tab | `Trash2` (delete), `Shuffle` (shuffle all), `Images` (browse library) | `h-3 w-3` |
| Editor export rows | `Copy`, `Download` | `h-3 w-3` |

## 10. Per-view anatomy (structure is locked)

### Sidebar
1. Brand block (logo, `h-6`), 2. Generate row, 3. Nav (Dashboard / Library / Brand Voice /
Plan & Billing), 4. pinned bottom: plan widget, Settings + Sign out, account block.

### Home (`max-w-[880px]`)
- **Empty (new user):** greeting header; centered empty-state section (icon tile, title, body, one
  MintButton "Generate your first slideshow", secondary blue link "Tune your Brand first"). No fake
  cards, no gradients.
- **Loading (generating):** same greeting header with "Scraping Pinterest, writing your scripts,
  rendering previews. About a minute."; "Your slideshows" + "Writing N slideshows for {Brand}...";
  two skeleton cards with the same anatomy as real cards (thumb strip, title line, caption lines,
  chip pills, footer with two button pills).
- **Ready:** greeting header; work-list header ("Your slideshows" + count + Generate); card grid
  (featured full-width first, then two-column).
- **FORBIDDEN (user mandate): no Brand strip on the Dashboard.** The brand switcher must NEVER render on
  the Dashboard (in any state) and NEVER in the sidebar. Its only home is a compact, neutral hairline
  control in the Brand Voice tab header: plain brand name (`text-[12px] font-semibold`), no initials
  tile, no blue anywhere; `ChevronsUpDown` rotates on open; dropdown rises with an expo ease-out and
  20ms row stagger (`.dropdown-in`/`.dropdown-row` in `src/index.css`, reduced-motion safe). Copy uses
  "brand"/"brands", never "project".

### Library (`max-w-[880px]`)
Page title + subtitle; search + Pull new; filter row (All / Dark moody / Cozy / Bold text); 4-col
image grid (selected gets blue border + check + "Use on slide" on hover).

### Brand Voice (`max-w-[720px]`)
Page title + subtitle; "Your brand" section (Field grid: Niche, App name, Audience, App description);
"Style memory" section (pre-line read-only box). Single column, no cards-within-cards.

### Plan & Billing (`max-w-[720px]`)
Page title + subtitle; three columns side by side (Free hairline + Current chip; Creator blue
hairline + "or $190/yr" chip; Studio hairline). Creator and Studio cards end with full-width
MintButton. See §11 item 6 (three-tier pricing deviation).

### GenerateModal
Backdrop `bg-black/80 backdrop-blur-xs`; panel `max-w-md rounded-2xl border-[#22242D] shadow-2xl`;
title + subtitle + close; Idea input; How many count pills (1 / 3 / 5 / 10); cost line (danger when
over limit); footer Cancel + Generate.

### EditorModal
Backdrop same; panel `max-w-4xl rounded-2xl`; left preview side (`sm:w-80`): 9:16 phone preview with
scrim + index, prev/dots/next nav, "{n} / {total}" counter; right editor side (`sm:w-96`): tab bar
(Post / Slides / Export), scrollable body, footer (Cancel + Save/Done). Post tab = Caption textarea +
Hashtags input. Slides tab = slide text textarea + Delete slide link + Background strip (Shuffle all
/ Browse Library + 8-thumb grid + hint). Export tab = intro copy + per-slide rows (index tile, slide
text, Copy, Image) + Download all / Copy all text.

## 11. Allowable deviations (exhaustive: nothing else)

1. **DemoBar is not product UI.** The mockup's flow-control bar is a design-review tool and is
   excluded from the build. The app shell is the `h-screen` row directly (Sidebar + main).
2. **Real data replaces sample data.** Account name/email, brand fields, slideshow titles/captions/
   hooks/hashtags/times/counts, and image URLs come from the API/Supabase. The structure and copy
   PATTERNS are unchanged; only the values are dynamic. The seeded demo slideshows are examples, not
   shipped content.
3. **The word "carousels" → "slideshows".** The mockup's loading line says "Writing 3 carousels for
   Daily Grind..."; the build MUST render "Writing 3 slideshows for Daily Grind..." (standing word
   rule). This is the only mandated copy change.
4. **`/design1` gallery is kept for reference, not shipped.** The gallery preview cards (including
   Synthover's own `Preview`, which uses 7px/8px/8.5px micro sizes, a `w-[64px]` mini-rail, and a
   `bg-[#121317]` card fill) are design-review artifacts only. None of those values apply to product UI.
5. **shadcn/ui components** may be used for behavior (buttons, dialogs, dropdowns) ONLY if they are
   themed to render these exact values. Do not let shadcn defaults leak in (no default borders,
   fills, radii, or focus styles). If a shadcn component cannot reproduce a recipe exactly, hand-roll
   the element with the recipe class string instead. Identical rendering wins over component reuse.
6. **Three-tier pricing (PRICING.md).** The locked two-plan anatomy (Free + Pro) is extended to
   three columns: Free · Creator $19/mo ($190/yr) · Studio $49/mo ($490/yr). Billing copy, the
   UsageWidget label, and plan names render Creator/Studio; the blue-highlighted card is Creator.
   Everything else in the Billing recipe is unchanged.

Everything else: every color, size, radius, spacing, font, icon, hover state, transition, and copy
string is fixed by this document. No restyling. No iteration on the look. Build it to look exactly
like this.

## 12. Build-time verification gates

After building any UI surface, verify before moving on:
1. `npx tsc` clean.
2. `npm run build` clean.
3. Em-dash grep on UI copy: `grep -rn "—" src/` must show no em dashes in user-facing strings.
4. Spot-check every rendered element against this document's recipes (colors, radii, text sizes,
   hover states). If a value differs, fix it to match. Do not "improve" it.

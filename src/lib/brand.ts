// Single source of truth for brand strings + palette. Full system: BRAND.md.
// The app's visual theme (shadcn CSS tokens) is extracted from the chosen
// /compare design — these constants cover the brand identity that holds across
// designs (tagline, watermark, palette).

export const BRAND_NAME = 'Elion'
// No tagline — decided 2026-08-02 (see BRAND.md). Landing hero copy is descriptive, not a slogan.

// Black & white base with ONE accent: blue. Pink/purple are out; gold was
// retired 2026-08-03 (gold-on-dark read as Claude's brand). To swap the
// accent, only this constant changes (see BRAND.md).
export const BRAND_ACCENT = '#3B82F6'

export const brandPalette = {
  background: '#000000',
  surface: '#0E0E0E',
  muted: '#161616',
  border: '#262626',
  foreground: '#FFFFFF',
  mutedForeground: '#A1A1AA',
  primary: BRAND_ACCENT,
  primaryForeground: '#000000',
} as const

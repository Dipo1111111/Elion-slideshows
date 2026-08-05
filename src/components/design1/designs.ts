import type { ComponentType } from 'react'
import { Preview as CedarPreview, Page as CedarPage } from './cedar'
import { Preview as SignalPreview, Page as SignalPage } from './signal'
import { Preview as StampPreview, Page as StampPage } from './stamp'
import { Preview as TessellatePreview, Page as TessellatePage } from './tessellate'
import { Preview as NoisePreview, Page as NoisePage } from './noise'
import { Preview as CloverPreview, Page as CloverPage } from './clover'
import { Preview as AuroraPreview, Page as AuroraPage } from './aurora'
import { Preview as EmberPreview, Page as EmberPage } from './ember'
import { Preview as SynthPreview, Page as SynthPage } from './synth'
import { Preview as SynthoverPreview, Page as SynthoverPage } from './synthover'
import { Preview as PrismPreview, Page as PrismPage } from './prism'

// Design exploration gallery (batch 1): 9 fully distinct product UI mockups.
// Each is a static, non-functional full-app screen — the winner gets extracted
// into global CSS + theme tokens, everything else is discarded.
export type Design = {
  index: number
  slug: string
  name: string
  note: string
  Preview: ComponentType
  Page: ComponentType
}

export const designs: Design[] = [
  { index: 1, slug: 'cedar', name: 'Cedar', note: 'warm editorial studio', Preview: CedarPreview, Page: CedarPage },
  { index: 2, slug: 'signal', name: 'Signal', note: 'dark ops dashboard', Preview: SignalPreview, Page: SignalPage },
  { index: 3, slug: 'stamp', name: 'Stamp', note: 'editorial broadsheet', Preview: StampPreview, Page: StampPage },
  { index: 4, slug: 'tessellate', name: 'Tessellate', note: 'modular tile grid', Preview: TessellatePreview, Page: TessellatePage },
  { index: 5, slug: 'noise', name: 'Noise', note: 'brutalist, high contrast', Preview: NoisePreview, Page: NoisePage },
  { index: 6, slug: 'clover', name: 'Clover', note: 'black & white · soft shadows on containers only', Preview: CloverPreview, Page: CloverPage },
  { index: 7, slug: 'aurora', name: 'Aurora', note: 'dark luminous editor', Preview: AuroraPreview, Page: AuroraPage },
  { index: 8, slug: 'ember', name: 'Ember', note: 'dark amber studio · editorial, hairline-flat', Preview: EmberPreview, Page: EmberPage },
  { index: 9, slug: 'synth', name: 'Synth', note: 'deep matte dark studio · synthesise inspiration', Preview: SynthPreview, Page: SynthPage },
  { index: 10, slug: 'synthover', name: 'Synthover', note: 'Clover product · Synth material · monochrome white accent', Preview: SynthoverPreview, Page: SynthoverPage },
  { index: 11, slug: 'prism', name: 'Prism', note: 'Vertical cards · bottom sheet generate · docked editor · animated', Preview: PrismPreview, Page: PrismPage },
]

// Shared client types, mirroring the server data shapes (BUILD_PLAN §5/§8).

export type Plan = 'free' | 'pro'

export type BrainKey =
  | 'niche'
  | 'appName'
  | 'appDescription'
  | 'audience'
  | 'audiencePain'
  | 'accountGoal'
  | 'voiceTone'
  | 'styleMemory'

export interface Brain {
  niche: string
  appName: string
  appDescription: string
  audience: string
  audiencePain: string
  accountGoal: string
  voiceTone: string
  styleMemory: string
}

export interface ImageEntry {
  id: string
  url: string
  pulledAt: string
  query?: string
  pack?: string
}

// A library pack is one pull: the joined searches that named it, how many
// images landed, and up to four cover ids for a 2×2 preview collage.
export interface LibraryPack {
  name: string
  count: number
  covers: string[]
}

export interface Project {
  id: string
  name: string
  brain: Partial<Brain>
  imagePacks: ImageEntry[]
  createdAt: string
}

export interface SlideBg {
  id: string
  url: string
}

export interface Slide {
  id: string
  text: string
  bg?: SlideBg | null
}

export type SlideStatus = 'Draft' | 'Ready' | 'Exported'

export interface Slideshow {
  id: string
  title: string
  hook: string
  caption: string
  hashtags: string[]
  rationale: string
  createdAt: string
  status: SlideStatus
  slides: Slide[]
}

export interface Limits {
  total: number
  monthly: number
  hourly: number
  projects: { free: number; pro: number }
}

export interface Me {
  id: string
  plan: Plan
  totalGens: number
  monthlyGens: number
  monthStart: string
  limit: Limits
  projects: Project[]
  activeProjectId: string | null
}

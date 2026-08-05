// Preview data used while Supabase is not configured yet (VITE_SUPABASE_*
// unset). The whole app renders in preview mode so the UI can be reviewed
// before auth is wired up: a demo profile, one project with a Brain, and two
// sample slideshows. The moment the env vars are set, real auth and data take
// over and nothing here is ever used.
import type { Session } from '@supabase/supabase-js'
import type { Me, Project, Slideshow } from './types'

const now = () => new Date().toISOString()

export const DEMO_PROJECT: Project = {
  id: 'demo-project',
  name: 'Nordic Home',
  brain: {
    niche: 'Minimalist home decor',
    appName: 'Nordic Home',
    appDescription: 'Helps you design your home with the best tools, on any budget.',
    audience: 'Design lovers in their 20s and 30s who rent.',
    audiencePain: 'Not satisfied with their room, blind to the small problems holding it back.',
    accountGoal: 'Grow the account',
    voiceTone: 'Warm, Direct',
    styleMemory: 'Short, warm sentences. Concrete tips, no filler.',
  },
  // Seeded library so preview shows the real flow: pull once in the Library,
  // then Generate assigns from this pool (no silent Pinterest scrape).
  imagePacks: [
    { id: 'elion-demo-0', url: 'https://picsum.photos/seed/elion-demo-0/640/960', pulledAt: now(), query: 'Minimalist home decor', pack: 'Minimalist home decor' },
    { id: 'elion-demo-1', url: 'https://picsum.photos/seed/elion-demo-1/640/960', pulledAt: now(), query: 'Minimalist home decor', pack: 'Minimalist home decor' },
    { id: 'elion-demo-2', url: 'https://picsum.photos/seed/elion-demo-2/640/960', pulledAt: now(), query: 'Cozy', pack: 'Cozy' },
  ],
  createdAt: now(),
}

export const DEMO_ME: Me = {
  id: 'demo-user',
  plan: 'pro',
  totalGens: 0,
  monthlyGens: 0,
  monthStart: now(),
  limit: { total: 3, monthly: 100, hourly: 10, projects: { free: 1, pro: 5 } },
  projects: [DEMO_PROJECT],
  activeProjectId: DEMO_PROJECT.id,
}

export const DEMO_SESSION = { user: { id: 'demo-user', email: 'demo@elion.app' } } as unknown as Session

export const DEMO_QUEUE: Slideshow[] = [
  {
    id: 'demo-1',
    title: '5 Cozy Fall Habits',
    hook: 'Fall reset, but make it cozy.',
    caption: 'Save this for your next slow evening.',
    hashtags: ['#cozyhome', '#fallvibes', '#slowliving'],
    rationale: 'Ties the niche to the season with a soft, inviting opener.',
    createdAt: now(),
    status: 'Ready',
    slides: [
      { id: 'demo-1-1', text: 'Light a candle the second you walk in.', bg: { id: 'elion-demo-0', url: 'https://picsum.photos/seed/elion-demo-0/640/960' } },
      { id: 'demo-1-2', text: 'Swap your duvet for a heavier one.', bg: { id: 'elion-demo-1', url: 'https://picsum.photos/seed/elion-demo-1/640/960' } },
      { id: 'demo-1-3', text: 'Make tea in your favorite mug.', bg: { id: 'elion-demo-2', url: 'https://picsum.photos/seed/elion-demo-2/640/960' } },
      { id: 'demo-1-4', text: 'Read for 20 minutes, no phone.', bg: { id: 'elion-demo-0', url: 'https://picsum.photos/seed/elion-demo-0/640/960' } },
      { id: 'demo-1-5', text: 'Which one starts tonight?', bg: { id: 'elion-demo-1', url: 'https://picsum.photos/seed/elion-demo-1/640/960' } },
    ],
  },
  {
    id: 'demo-2',
    title: 'Small Space, Big Style',
    hook: 'Your apartment can feel twice as big.',
    caption: 'Five tricks, under five minutes each.',
    hashtags: ['#smallspaces', '#interiordesign', '#apartmentdecor'],
    rationale: 'High-intent topic for renters who want a fast upgrade.',
    createdAt: now(),
    status: 'Draft',
    slides: [
      { id: 'demo-2-1', text: 'Hang curtains higher than the window frame.', bg: { id: 'elion-demo-2', url: 'https://picsum.photos/seed/elion-demo-2/640/960' } },
      { id: 'demo-2-2', text: 'One large mirror doubles the light.', bg: { id: 'elion-demo-0', url: 'https://picsum.photos/seed/elion-demo-0/640/960' } },
      { id: 'demo-2-3', text: 'Use low furniture to open the ceiling.', bg: { id: 'elion-demo-1', url: 'https://picsum.photos/seed/elion-demo-1/640/960' } },
    ],
  },
]

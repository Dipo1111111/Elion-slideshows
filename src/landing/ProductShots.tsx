// Faithful miniature screens of the actual Elion app, used as the landing's
// "product screenshots". Each preview mirrors a real surface 1:1: the app
// sidebar + dashboard cards (Sidebar.tsx / DashboardView.tsx / SlideshowCard),
// Brand Voice (BrandVoiceView.tsx), the Generate modal (GenerateModal.tsx),
// and the editor Export tab (SlideshowEditorModal + editor/ExportTab.tsx).
// Sample text is what a generated slideshow actually holds (hook, slide text,
// caption, hashtags). Photos are real (picsum seeds) so slides read as slides.
import type { ReactNode } from 'react'
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Home,
  Images,
  Lock,
  PenLine,
  Plus,
  Wallet,
} from 'lucide-react'
import logoUrl from '@/assets/elion-logo.png'

const picsum = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`

/* ---------- browser chrome around every preview ---------- */
export function AppWindow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#1E2028] bg-[#0B0C0E] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] ${
        className ?? ''
      }`}
    >
      <div className="flex h-9 items-center gap-3 border-b border-[#16171D] px-3.5">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3F47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3F47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A3F47]" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md border border-[#262834] bg-[#111317] px-3 py-1 text-[10px] font-medium text-[#9CA0A8]">
          <Lock className="h-2.5 w-2.5" strokeWidth={1.5} />
          app.elion.ai
        </span>
        <span aria-hidden className="h-5 w-5 rounded-full border border-[#3A3F47]" />
      </div>
      {children}
    </div>
  )
}

/* ---------- tiny slide thumb, real SlideThumb anatomy: photo, scrim, index ---------- */
function SlideThumb({ seed, w, index }: { seed: string; w: number; index?: number }) {
  const h = Math.round((w * 16) / 9)
  return (
    <div
      className="relative aspect-[9/16] shrink-0 overflow-hidden rounded-[3px] bg-[#0C0D10]"
      style={{ width: w }}
    >
      <img src={picsum(seed, w, h)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/25" />
      {index != null && (
        <span className="absolute inset-0 flex items-center justify-center font-num text-[8px] font-bold text-white/90 drop-shadow">
          {index}
        </span>
      )}
    </div>
  )
}

/* ---------- real StatusChip (Ready = blue fill, Draft = gray) ---------- */
function StatusChip({ status }: { status: 'Ready' | 'Draft' }) {
  return status === 'Ready' ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#3B82F6]/20 px-2 py-[2px] text-[7.5px] font-bold text-white">
      <span className="h-1 w-1 rounded-full bg-white" />
      Ready
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#262834] bg-[#121317] px-2 py-[2px] text-[7.5px] font-bold text-[#9CA0A8]">
      <span className="h-1 w-1 rounded-full bg-[#6E737B]" />
      Draft
    </span>
  )
}

/* ---------- real MintButton (white glass pill) and QuietButton (outlined) ---------- */
function MintPill({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-[3px] text-[8.5px] font-semibold text-white">
      {icon}
      {children}
    </span>
  )
}

function QuietPill({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#2E3140] px-2 py-[3px] text-[7.5px] font-semibold text-[#D1D5DB]">
      {icon}
      {children}
    </span>
  )
}

/* ---------- hero shot: the dashboard, mirroring DashboardView + Sidebar ---------- */
const CARDS = [
  {
    title: '3 morning habits that changed my energy',
    hook: 'Not coffee. Not a cold shower.',
    caption: 'Tiny changes, stacked. Save this for the mornings you wake up heavy.',
    meta: '9 slides · 2 min ago',
    status: 'Ready' as const,
    thumbs: ['elion-dash-a', 'elion-dash-b', 'elion-dash-c'],
    tags: ['habits', 'energy'],
  },
  {
    title: 'Why most diets fail by week two',
    hook: 'It is not about willpower.',
    caption: 'The plan you can actually keep beats the plan that is perfect on paper.',
    meta: '7 slides · 1 hour ago',
    status: 'Draft' as const,
    thumbs: ['elion-dash-d', 'elion-dash-e', 'elion-dash-f'],
    tags: ['nutrition', 'habits'],
  },
]

function SidebarRail() {
  const NAV = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Images, label: 'Library', active: false },
    { icon: BookOpen, label: 'Brand Voice', active: false },
    { icon: Wallet, label: 'Plan & Billing', active: false },
  ]
  return (
    <aside className="hidden w-[150px] shrink-0 flex-col border-r border-[#16171D] px-2 py-3 sm:flex">
      <img src={logoUrl} alt="" className="h-4 w-auto shrink-0 self-start" />
      <span className="mt-3 flex h-7 items-center gap-1.5 rounded-md px-2 text-[8.5px] font-bold text-white">
        <Plus className="h-3 w-3 text-white" strokeWidth={1.5} />
        Generate
      </span>
      <nav className="mt-1.5 space-y-0.5">
        {NAV.map((n) => (
          <span
            key={n.label}
            className={`flex h-7 items-center gap-1.5 rounded-md px-2 text-[8.5px] font-medium ${
              n.active ? 'text-[#3B82F6]' : 'text-[#7A7F87]'
            }`}
          >
            <n.icon className={`h-3 w-3 ${n.active ? 'text-[#3B82F6]' : 'text-[#5F646B]'}`} strokeWidth={1.5} />
            {n.label}
          </span>
        ))}
      </nav>
      <div className="mt-auto rounded-lg border border-[#1E2028] p-2">
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-[7px] font-semibold text-[#9CA0A8]">Free plan</span>
          <span className="font-num text-[7px] text-[#6E737B]">0 of 3 used</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[10%] rounded-full bg-[#3B82F6]" />
        </div>
        <span className="mt-1.5 inline-flex items-center gap-0.5 text-[7px] font-bold text-[#3B82F6]">
          Upgrade to Creator
        </span>
      </div>
    </aside>
  )
}

function DashboardCard({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#1E2028] bg-[#0C0D10]">
      <div className="flex items-center gap-1.5 bg-[#0C0D10] px-2 py-1.5">
        {card.thumbs.map((s, i) => (
          <SlideThumb key={s} seed={s} w={32} index={i + 1} />
        ))}
        <span className="ml-auto self-end pb-0.5 text-[6.5px] font-semibold text-[#7C838C]">
          +{card.status === 'Ready' ? 6 : 4} more
        </span>
      </div>
      <div className="p-2">
        <div className="flex items-start justify-between gap-1.5">
          <p className="min-w-0 truncate text-[8.5px] font-bold text-white">{card.title}</p>
          <StatusChip status={card.status} />
        </div>
        <p className="mt-0.5 truncate text-[7.5px] font-semibold text-[#F2F4F7]">{card.hook}</p>
        <p className="mt-0.5 line-clamp-2 text-[6.5px] leading-snug text-[#9CA0A8]">{card.caption}</p>
        <div className="mt-1 flex flex-wrap gap-0.5">
          {card.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[#262834] bg-[#1A1B21] px-1.5 py-[1px] text-[6px] font-medium text-[#9CA0A8]"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[6.5px] font-medium text-[#8E8E93]">{card.meta}</span>
          <span className="flex items-center gap-1">
            <QuietPill icon={<PenLine className="h-2 w-2" strokeWidth={1.5} />}>Edit</QuietPill>
            <QuietPill icon={<Download className="h-2 w-2" strokeWidth={1.5} />}>Export</QuietPill>
          </span>
        </div>
      </div>
    </div>
  )
}

export function DashboardPreview() {
  return (
    <div className="flex">
      <SidebarRail />
      <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
        <header className="mb-3">
          <p className="font-display text-[13px] font-bold text-white">Good morning</p>
          <p className="mt-0.5 text-[9px] text-[#9CA0A8]">
            Let's create your <span className="text-[#3B82F6]">slideshow</span>.
          </p>
        </header>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-[11px] font-bold text-white">Your slideshows</p>
            <p className="mt-0.5 text-[8px] font-medium text-[#9CA0A8]">2 slideshows · 1 ready to post</p>
          </div>
          <MintPill icon={<Plus className="h-2.5 w-2.5" strokeWidth={1.5} />}>Generate</MintPill>
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {CARDS.map((c) => (
            <DashboardCard key={c.title} card={c} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- how-it-works 1: Brand Voice, mirroring BrandVoiceView ---------- */
function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <span className="mb-1 block text-[7.5px] font-semibold text-[#9CA0A8]">{label}</span>
      <div className="flex min-h-[24px] items-center rounded-md border border-[#1C1E26] bg-[#0C0D10] px-2 py-1 text-[8.5px] text-[#E5E7EB]">
        <span className="truncate">{value}</span>
      </div>
    </div>
  )
}

const BRAIN = [
  { label: 'App name', value: 'Fit at Home', wide: false },
  { label: 'What it does', value: 'Short workouts for people with no equipment, no time, and no gym.', wide: true },
  { label: 'Niche', value: 'Fitness without a gym', wide: false },
  { label: 'Who it is for', value: 'Busy beginners', wide: false },
  { label: 'What bothers them', value: 'No time, no equipment, no idea where to start.', wide: true },
  { label: 'Your goal', value: 'Grow the account', wide: false },
  { label: 'Tone', value: 'Warm, Direct', wide: false },
]

export function BrainPreview() {
  return (
    <div className="px-4 py-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[13px] font-bold text-white">Brand Voice</p>
          <p className="mt-0.5 max-w-[300px] text-[8.5px] leading-snug text-[#9CA0A8]">
            Your app, niche, audience, and style memory. Elion writes every slideshow in this voice.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#2E3140] px-2 py-[2px] text-[7.5px] font-semibold text-[#D1D5DB]">
            <span className="h-1 w-1 rounded-full bg-[#3B82F6]" />
            Fit at Home
          </span>
          <QuietPill icon={<PenLine className="h-2 w-2" strokeWidth={1.5} />}>Edit</QuietPill>
        </span>
      </header>
      <section className="mt-3 rounded-lg border border-[#1E2028] p-3">
        <p className="mb-2.5 font-display text-[9px] font-bold text-white">Your brand</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BRAIN.map((f) => (
            <Field key={f.label} label={f.label} value={f.value} wide={f.wide} />
          ))}
        </div>
      </section>
      <section className="mt-2.5 rounded-lg border border-[#1E2028] p-3">
        <p className="mb-2 font-display text-[9px] font-bold text-white">Style memory</p>
        <div className="rounded-md border border-[#1C1E26] bg-[#0C0D10] px-2.5 py-2 text-[8.5px] leading-relaxed text-[#E5E7EB]">
          Short, warm sentences. Concrete tips, no filler. First person, like a friend who knows.
        </div>
      </section>
    </div>
  )
}

/* ---------- how-it-works 2: the Generate modal, mirroring GenerateModal ---------- */
// Real photos, matched to the preview Brain (Fitness without a gym). Each pack
// gets its own covers; a remote failure falls back to a picsum seed so the
// cell never ships blank.
const FALLBACKS = [
  ['elion-pack-a', 'elion-pack-b', 'elion-pack-c', 'elion-pack-d'],
  ['elion-pack-e', 'elion-pack-f', 'elion-pack-g', 'elion-pack-h'],
]
const PACKS = [
  {
    name: 'Home workouts',
    count: 40,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=320&q=70&auto=format&fit=crop',
    ],
  },
  {
    name: 'No equipment',
    count: 24,
    images: [
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=320&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=320&q=70&auto=format&fit=crop',
    ],
  },
]

export function GeneratePreview() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[13px] font-bold text-white">Generate slideshow</p>
          <p className="mt-0.5 text-[8.5px] text-[#9CA0A8]">From your Brand: Fit at Home · Fitness without a gym.</p>
        </div>
        <QuietPill>Cancel</QuietPill>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-[7.5px] font-bold text-[#9CA0A8]">Idea (optional)</span>
        <div className="flex items-center rounded-md border border-[#1F212B] bg-[#08080A] px-2 py-1.5 text-[8.5px] text-[#7C838C]">
          e.g. Money habits of disciplined people
        </div>
      </label>
      <p className="mt-1 text-[7px] text-[#8E8E93]">Leave empty to generate from your Brand.</p>

      <div className="mt-3">
        <span className="mb-1 block text-[7.5px] font-bold text-[#9CA0A8]">How many?</span>
        <div className="flex gap-1.5">
          {[1, 3, 5, 10].map((o) => (
            <span
              key={o}
              className={`flex h-6 w-7 items-center justify-center rounded-md font-num text-[8.5px] font-bold ${
                o === 1 ? 'bg-[#3B82F6]/20 text-white' : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93]'
              }`}
            >
              {o}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[7.5px] font-bold text-[#9CA0A8]">Background packs</span>
          <span className="text-[7px] font-semibold text-[#5F646B]">2 of 2 selected</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PACKS.map((p, pi) => (
            <div
              key={p.name}
              className="relative overflow-hidden rounded-md border border-[#3B82F6]/60 text-left"
            >
              <span className="grid aspect-[4/5] grid-cols-2 grid-rows-2">
                {p.images.map((src, i) => (
                  <span key={i} className="overflow-hidden bg-[#0C0D10]">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget
                        img.onerror = null
                        img.src = picsum(FALLBACKS[pi][i], 120, 150)
                      }}
                    />
                  </span>
                ))}
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/20 px-1.5 pb-1 pt-4">
                <span className="block truncate text-[7px] font-semibold text-white">{p.name}</span>
                <span className="block text-[6px] font-medium text-white/70">{p.count} images</span>
              </span>
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={2} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[7.5px] font-medium text-[#8E8E93]">
        Backgrounds come from your Library, pulled once and reused. This uses 1 of your 3 remaining free slideshows.
      </p>

      <div className="mt-3 flex justify-end gap-1.5">
        <MintPill>Generate</MintPill>
      </div>
    </div>
  )
}

/* ---------- how-it-works 3: the editor Export tab, mirroring the real modal ---------- */
const SLIDES = [
  { text: '3 morning habits that changed my energy' },
  { text: 'You have tried everything. Mornings still win.' },
  { text: 'Habit one: water before your phone.' },
  { text: 'Habit two: five minutes on one floor.' },
  { text: 'Habit three: write the first task at night.' },
  { text: 'Bonus tip: track it in Fit at Home.' },
]

export function EditorPreview() {
  return (
    <div className="flex gap-4 px-4 py-4">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div className="relative aspect-[9/16] w-[130px] overflow-hidden rounded-lg">
          <img
            src={picsum('elion-edit-main', 260, 462)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute inset-0 flex items-center justify-center font-num text-[13px] font-bold text-white/90 drop-shadow">
            2
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white">
            <ChevronLeft className="h-3 w-3" strokeWidth={1.5} />
          </span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full ${i === 1 ? 'w-3.5 bg-white' : 'w-1 bg-[#3A3F47]'}`}
              />
            ))}
          </div>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white">
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          </span>
        </div>
        <span className="font-num text-[8px] text-[#8E8E93]">2 / 7</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex gap-1">
          {['Post', 'Slides', 'Export'].map((t) => (
            <span
              key={t}
              className={`rounded-full px-2 py-[2px] text-[7.5px] font-semibold ${
                t === 'Export' ? 'bg-[#3B82F6]/20 text-white' : 'text-[#8E8E93]'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[7.5px] leading-relaxed text-[#9CA0A8]">
          Download the background images, then add text inside TikTok with the native font.
        </p>
        <div className="mt-2 space-y-1">
          {SLIDES.map((s, i) => (
            <div key={s.text} className="flex items-center gap-1.5 rounded-md border border-[#1F212B] bg-[#08080A] px-1.5 py-1">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#3B82F6]/20 font-num text-[7px] font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[8px] text-[#E5E7EB]">{s.text}</span>
              <span className="inline-flex items-center gap-0.5 text-[7px] font-semibold text-[#9CA0A8]">
                <Copy className="h-2 w-2" strokeWidth={1.5} />
                Copy
              </span>
              <span className="inline-flex items-center gap-0.5 text-[7px] font-semibold text-[#9CA0A8]">
                <Download className="h-2 w-2" strokeWidth={1.5} />
                Image
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <MintPill icon={<Download className="h-2 w-2" strokeWidth={1.5} />}>Download all</MintPill>
          <QuietPill icon={<Copy className="h-2 w-2" strokeWidth={1.5} />}>Copy all text</QuietPill>
        </div>
      </div>
    </div>
  )
}

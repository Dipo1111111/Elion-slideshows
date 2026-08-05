import { useState } from 'react';
import {
  PenLine,
  Sliders,
  LayoutGrid,
  CreditCard,
  Settings,
  LogOut,
  Download,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Shuffle,
  Trash2,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Ember: a dark amber studio. The second direction, built with the    */
/* design-taste-frontend discipline. The ONLY layout rule is a sidebar */
/* (user-given); everything else is a deliberate choice.               */
/*                                                                     */
/* Design read: a creator-tool product app for solo TikTok/Instagram   */
/* creators, premium dark-studio language: warm off-white ink on a     */
/* near-black page, one amber accent (the brand gold), editorial       */
/* asymmetry, hairline-separated flat surfaces instead of shadow lift. */
/*                                                                     */
/* Dials (design-taste): DESIGN_VARIANCE 7, MOTION_INTENSITY 4 (hover  */
/* states only; this is a static mockup), VISUAL_DENSITY 4.            */
/*                                                                     */
/* Palette: deep ink page (#14161A), hairline cards (#1B1F26 + white/  */
/* 10), amber accent (#E8B53B, dark text on it ≥9:1, amber text on     */
/* dark ≥9:1). Slide gradients are the saturated content: every        */
/* slideshow leads with one amber "ember" slide, neutrals follow.      */
/*                                                                     */
/* Font pairing: Onest Variable = headers (main face); Inter Tight     */
/* Variable = body/UI (sub face); JetBrains Mono Variable = mono       */
/* kickers (the masthead date) + slide counters.                       */
/*                                                                     */
/* Copy rule: NO em dashes anywhere in user-facing strings.            */
/*                                                                     */
/* Radius scale (constant per role, maps to shadcn tokens):            */
/*   full = pills: buttons, chips, tabs, dots, row active states       */
/*   2xl  = large surfaces: cards, modals, Pro card                    */
/*   xl   = controls + small containers: inputs, fields, usage card    */
/*   lg   = media + tiny tiles: slide thumbs, swatches, index tiles    */
/*                                                                     */
/* No logo mark in the mockup: the real Elion logo is built as a       */
/* reusable component and linked in. Wordmark only.                    */
/* ------------------------------------------------------------------ */

type View = 'home' | 'brand' | 'billing';
type EditorTab = 'post' | 'slides' | 'export';

type Tone = { from: string; to: string };

type Palette = {
  name: string;
  accent: string;      // solid accent: primary action, selection, state
  accentText: string;  // ink that sits ON the accent (≥4.5:1 on accent)
  accentTint: string;  // accent-washed surface (chips, meter card, tabs)
  tones: Tone[];       // slide background gradients (the saturated content)
};

/* Structural treatment: flat dark surfaces, hairline separation. */
type Mode = {
  page: string;
  sidebar: string;
  card: string;
  rowHover: string;   // idle nav / settings rows
  softBtn: string;    // secondary buttons
  strip: string;      // "Tune your Brand" strip
  proCard: string;    // Pro plan card (amber-ringed dark surface)
  link: string;       // text links
  button: string;     // primary button hover lift
  iconDanger: string; // trash icon hover
  linkDanger: string; // "Delete slide" hover
  thumb: string;      // background-thumb lift
};

const MODAL_SHADOW = 'shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65)]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B53B]';

const PALETTES = {
  ember: {
    name: 'Ember',
    accent: '#E8B53B',   // brand gold; on near-black and on-tint ≥8:1
    accentText: '#1A1B12',
    accentTint: '#262215',
    tones: [
      { from: '#14171B', to: '#7A551F' }, // amber glow: every slideshow's first ember
      { from: '#14171B', to: '#2E3238' }, // neutral
      { from: '#14171B', to: '#41464D' }, // lighter neutral
      { from: '#14171B', to: '#3A332A' }, // dark warm brown
    ],
  },
} satisfies Record<string, Palette>;

const MODE: Mode = {
  page: 'bg-[#14161A]',
  sidebar: 'bg-[#171B21]',
  card: 'rounded-2xl border border-white/10 bg-[#1B1F26]',
  rowHover: 'transition-colors hover:bg-white/5',
  softBtn: 'bg-[#23272E] text-[#D6D3CC] transition-colors hover:bg-[#2B3037]',
  strip: 'rounded-xl border border-white/10 bg-[#1B1F26] transition-colors hover:bg-[#20252C]',
  proCard: 'rounded-2xl border border-[#E8B53B]/40 bg-[#20242B]',
  link: 'text-[#A3A6AC] hover:text-[#ECE9E2]',
  button: 'transition-transform hover:-translate-y-px',
  iconDanger: 'hover:bg-[#3A2320] hover:text-[#E57C6A]',
  linkDanger: 'hover:text-[#E57C6A]',
  thumb: 'transition-transform hover:-translate-y-0.5',
};

const NAV: { key: View; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: LayoutGrid },
  { key: 'brand', label: 'Brand', icon: Sliders },
  { key: 'billing', label: 'Billing', icon: CreditCard },
];

type SlideItem = {
  title: string;
  status: 'Draft' | 'Ready' | 'Exported';
  count: number;
  time: string;
  tones: number[]; // indices into Palette.tones
  hook: string;
  caption: string;
  hashtags: string[];
  slides: string[];
};

const SLIDESHOWS: SlideItem[] = [
  {
    title: "5 signs you're not lazy",
    status: 'Ready',
    count: 8,
    time: '2h ago',
    tones: [0, 2, 0],
    hook: "You're not lazy. Your brain is just on airplane mode.",
    caption:
      "If you've ever called yourself lazy, read this. You're not the problem. Your system is. Five signs that what feels like laziness is actually your brain asking for something different. Save this for the next time you feel stuck.",
    hashtags: ['habits', 'mindset', 'selfimprovement', 'discipline'],
    slides: [
      "You're not lazy.",
      'Your brain is just on airplane mode.',
      "It's a signal, not a personality trait.",
      'You want the result but not the system.',
      "Your standards are too high for your energy.",
      "You're waiting for motivation that never comes.",
      'Try making the first step embarrassingly small.',
      'Save this for the next time you feel stuck.',
    ],
  },
  {
    title: 'Money habits of disciplined people',
    status: 'Draft',
    count: 9,
    time: 'Yesterday',
    tones: [3, 2, 0],
    hook: 'Rich people do these 4 things before 9am.',
    caption:
      "Discipline isn't about willpower. It's about systems. The money habits disciplined people actually follow, in one post. Which one will you start this week?",
    hashtags: ['moneymindset', 'habits', 'wealth', 'selfimprovement'],
    slides: [
      "Rich people don't have more willpower.",
      'They have better systems.',
      'Habit 1: they pay themselves first.',
      'Habit 2: they automate the boring stuff.',
      'Habit 3: they check their numbers weekly.',
      'Habit 4: they say no to cheap distractions.',
      'Habit 5: they build income, not just savings.',
      'Start with one habit this week.',
      'Discipline is a system, not a feeling.',
    ],
  },
  {
    title: 'How to build a 5am routine',
    status: 'Exported',
    count: 8,
    time: '3d ago',
    tones: [2, 1, 0],
    hook: 'The 5am routine that actually sticks.',
    caption:
      "The 5am routine isn't about waking up early. It's about what you do with the first hour. Here's the routine that actually sticks.",
    hashtags: ['morningroutine', 'habits', '5amclub', 'selfimprovement'],
    slides: [
      'The 5am routine that actually sticks.',
      'Wake up at the same time, even weekends.',
      'Prep the night before: clothes, water, coffee.',
      'First hour: no phone.',
      'Win the morning with one task, not ten.',
      "If you miss a day, don't break the chain.",
      'Your brain adapts in about 21 days.',
      'Save this for your next attempt.',
    ],
  },
];

/* ----------------------------- primitives -------------------------- */

/* Status chips. Ready carries the amber accent; the rest sit quiet. */
const CHIP_NEUTRALS = {
  Draft: { chip: 'bg-[#23272E] text-[#A3A6AC]', dot: 'bg-[#6B747E]', label: 'Draft' },
  Exported: { chip: 'bg-[#23272E] text-[#A3A6AC]', dot: 'bg-[#7A838D]', label: 'Exported' },
};

function StatusChip({ status, p }: { status: SlideItem['status']; p: Palette }) {
  if (status === 'Ready') {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{ backgroundColor: p.accent, color: p.accentText }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accentText }} />
        Ready
      </span>
    );
  }
  const s = CHIP_NEUTRALS[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${s.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SlideThumb({ tone, index, className = '' }: { tone: Tone; index: number; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center font-mono text-[9px]"
        style={{ color: '#E8ECF0' }}
      >
        {index}
      </span>
    </div>
  );
}

function Icon({ icon, className }: { icon: LucideIcon; className: string }) {
  const Cmp = icon;
  return <Cmp className={className} />;
}

/* Primary action. Amber fill, dark ink on it. Hover lift only. */
function MintButton({
  children,
  icon,
  className = '',
  onClick,
  p,
  m,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
  p: Palette;
  m: Mode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${m.button} ${FOCUS} ${className}`}
      style={{ backgroundColor: p.accent, color: p.accentText }}
    >
      {icon && <Icon icon={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* Secondary action. Dark neutral; recedes so the one amber leads. */
function QuietButton({
  children,
  icon,
  className = '',
  onClick,
  m,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
  m: Mode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${m.softBtn} ${FOCUS} ${className}`}
    >
      {icon && <Icon icon={icon} className="h-3 w-3" />}
      {children}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#A3A6AC]">{label}</span>
      <div className="flex items-center rounded-xl border border-white/10 bg-[#20242B] px-3.5 py-2.5 text-sm text-[#ECE9E2]">
        {value}
      </div>
    </label>
  );
}

/* ------------------------------ sidebar ---------------------------- */

function Sidebar({ active, onSelect, p, m }: { active: View; onSelect: (v: View) => void; p: Palette; m: Mode }) {
  return (
    <aside className={`flex w-[252px] shrink-0 flex-col ${m.sidebar}`}>
      {/* Brand. Wordmark only: no logo mark in the mockup. The real Elion
          logo will be a reusable component, linked in across the UI. */}
      <div className="px-5 pb-4 pt-5">
        <p className="font-display text-[16px] font-bold tracking-[-0.01em] text-[#ECE9E2]">Elion</p>
      </div>

      {/* Nav (one Brand per user, so no project switcher) */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV.map(({ key, label, icon: IconCmp }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex h-10 w-full items-center gap-3 rounded-full px-4 text-left ${m.rowHover} ${FOCUS} ${
                isActive ? 'bg-[#E8B53B] text-[#1A1B12]' : 'text-[#A3A6AC]'
              }`}
            >
              <Icon
                icon={IconCmp}
                className={`h-[17px] w-[17px] shrink-0 ${isActive ? 'text-[#1A1B12]' : 'text-[#8C929B]'}`}
              />
              <span className="flex-1 text-[13.5px] font-semibold">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned bottom */}
      <div className="p-3">
        <div className="rounded-xl border border-white/10 bg-[#1B1F26] p-3.5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-[#D6D3CC]">
              Free plan
            </span>
            <span className="text-[11px] font-semibold text-[#A3A6AC]">
              2 of 3 used
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: p.accent }} />
          </div>
          <button className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold ${FOCUS}`} style={{ color: p.accent }}>
            Upgrade to Pro
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="mt-2 flex flex-col">
          <button className={`flex h-9 items-center gap-3 rounded-full px-4 text-[13px] font-medium text-[#A3A6AC] ${m.rowHover} ${FOCUS}`}>
            <Settings className="h-4 w-4 text-[#8C929B]" />
            Settings
          </button>
          <button className={`flex h-9 items-center gap-3 rounded-full px-4 text-[13px] font-medium text-[#A3A6AC] ${m.rowHover} ${FOCUS}`}>
            <LogOut className="h-4 w-4 text-[#8C929B]" />
            Sign out
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2.5 px-1.5 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#23272E] text-[11px] font-bold text-[#ECE9E2]">
            AC
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12.5px] font-semibold text-[#ECE9E2]">Alex Carter</p>
            <p className="truncate text-[11px] text-[#8C929B]">alex@dailygrind.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ views ------------------------------ */

/* Shared card body: title, hook, caption, hashtags, meta, actions. */
/* Used by both the featured card and the standard grid cards.       */
function CardBody({
  s,
  i,
  onEdit,
  p,
  captionLines,
}: {
  s: SlideItem;
  i: number;
  onEdit: (i: number, tab: EditorTab) => void;
  p: Palette;
  captionLines: 2 | 3;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold leading-snug text-[#ECE9E2]">{s.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusChip status={s.status} p={p} />
          <button
            aria-label={`Delete ${s.title}`}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[#7A838D] ${MODE.iconDanger} ${FOCUS}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-[#ECE9E2]">{s.hook}</p>
      <p
        className={`mt-1.5 ${captionLines === 3 ? 'line-clamp-3' : 'line-clamp-2'} text-[12px] leading-relaxed text-[#A3A6AC]`}
      >
        {s.caption}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.hashtags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[#A3A6AC]">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-[#8C929B]">
          {s.count} slides · {s.time}
        </span>
        <div className="flex items-center gap-2">
          <QuietButton icon={PenLine} onClick={() => onEdit(i, 'post')} m={MODE}>
            Edit
          </QuietButton>
          <QuietButton icon={Download} onClick={() => onEdit(i, 'export')} m={MODE}>
            Export
          </QuietButton>
        </div>
      </div>
    </div>
  );
}

function HomeView({
  onGenerate,
  onEdit,
  onTuneBrand,
  p,
}: {
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onTuneBrand: () => void;
  p: Palette;
}) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-8 py-8">
      {/* Masthead: mono date, big display greeting, the one amber CTA */}
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] text-[#8C929B]">Saturday, 2 Aug</p>
          <h1 className="mt-2 font-display text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-[#ECE9E2]">
            Good morning, Alex.
          </h1>
          <p className="mt-2 text-[13.5px] text-[#A3A6AC]">One of your three slideshows is ready to post.</p>
        </div>
        <MintButton onClick={onGenerate} p={p} m={MODE}>
          Generate
        </MintButton>
      </header>

      {/* Work list */}
      <div className="mb-4 mt-8 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[15px] font-bold text-[#ECE9E2]">Your slideshows</h2>
        <p className="text-[12px] font-medium text-[#A3A6AC]">
          {SLIDESHOWS.length} total · {SLIDESHOWS.filter((s) => s.status === 'Ready').length} ready
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SLIDESHOWS.map((s, i) =>
          i === 0 ? (
            /* The one you're working on now leads: full width, a vertical
               contact sheet of slides on a warm inset, text right. */
            <article key={s.title} className={`overflow-hidden lg:col-span-2 ${MODE.card}`}>
              <div className="flex flex-col sm:flex-row">
                <div className="flex shrink-0 items-start gap-2 bg-[#171510] p-4 sm:flex-col">
                  {s.tones.slice(0, 3).map((idx, j) => (
                    <SlideThumb key={j} tone={p.tones[idx]} index={j + 1} className="w-20 sm:w-24" />
                  ))}
                  <span className="pl-1 text-[11px] font-semibold text-[#8C929B]">+{s.count - 3} more</span>
                </div>
                <CardBody s={s} i={i} onEdit={onEdit} p={p} captionLines={3} />
              </div>
            </article>
          ) : (
            <article key={s.title} className={`overflow-hidden ${MODE.card}`}>
              <div className="flex gap-2 bg-[#171510] px-4 py-3">
                {s.tones.map((idx, j) => (
                  <SlideThumb key={j} tone={p.tones[idx]} index={j + 1} className="w-12" />
                ))}
                <span className="ml-auto flex items-center self-end pb-0.5 text-[11px] font-semibold text-[#8C929B]">
                  +{s.count - 3} more
                </span>
              </div>
              <CardBody s={s} i={i} onEdit={onEdit} p={p} captionLines={2} />
            </article>
          ),
        )}
      </div>

      {/* Brand nudge: a slim strip, not a peer card, so the work leads */}
      <button
        onClick={onTuneBrand}
        className={`mt-4 flex w-full items-center gap-3 px-4 py-3 text-left ${MODE.strip} ${FOCUS}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: p.accentTint }}>
          <Sliders className="h-4 w-4" style={{ color: p.accent }} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-display text-[13px] font-bold text-[#ECE9E2]">Tune your Brand</span>
          <span className="mt-0.5 block text-[12px] text-[#A3A6AC]">
            Niche, audience, and style memory, so Elion writes in your voice.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold" style={{ color: p.accent }}>
          Open Brand
          <ArrowRight className="h-3 w-3" />
        </span>
      </button>
    </div>
  );
}

function BrandView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-[#ECE9E2]">
          What the AI knows about you
        </h1>
        <p className="mt-1.5 text-sm text-[#A3A6AC]">
          Your niche, audience, and style memory. Elion writes every slideshow in this voice.
        </p>
      </header>

      <section className={`p-6 ${MODE.card}`}>
        <p className="mb-4 font-display text-[13px] font-bold text-[#ECE9E2]">Your brand</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Niche" value="Self-improvement" />
          <Field label="App name" value="Daily Grind" />
          <Field label="Audience" value="Men 18–34 on TikTok" />
          <Field label="App description" value="Daily motivation for people building discipline" />
        </div>
      </section>

      <section className={`mt-5 p-6 ${MODE.card}`}>
        <p className="mb-4 font-display text-[13px] font-bold text-[#ECE9E2]">Style memory</p>
        <div className="whitespace-pre-line rounded-xl border border-white/10 bg-[#20242B] px-4 py-3.5 text-[13px] leading-relaxed text-[#ECE9E2]">
          {'Short punchy lines.\nBlack-and-amber gradient slides.\nNo emojis. End every slide with a question.'}
        </div>
      </section>
    </div>
  );
}

function BillingView({ p }: { p: Palette }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-[#ECE9E2]">
          Simple. Just the two plans.
        </h1>
        <p className="mt-1.5 text-sm text-[#A3A6AC]">You're on the free plan.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className={`p-6 ${MODE.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-[#ECE9E2]">Free</h3>
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: p.accentTint, color: p.accent }}>
              Current
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#A3A6AC]">For trying it out.</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[#D6D3CC]">
            {[
              ['3 lifetime slideshows', '2 of 3 used'],
              ['Elion watermark on exports'],
              ['1080×1920 backgrounds + copy'],
            ].map(([row, right]) => (
              <li key={row} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: p.accent }} />
                  {row}
                </span>
                {right && (
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: p.accentTint, color: p.accent }}>
                    {right}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={`p-6 ${MODE.proCard}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-[#ECE9E2]">Pro</h3>
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: p.accentTint, color: p.accent }}>
              $9/mo
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#A3A6AC]">For posting on a schedule.</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[#D6D3CC]">
            {['300 slideshows every month', 'No watermark', 'Everything in Free'].map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: p.accent }} />
                {row}
              </li>
            ))}
          </ul>
          <MintButton className="mt-5 w-full" p={p} m={MODE}>
            Upgrade to Pro
          </MintButton>
        </section>
      </div>
    </div>
  );
}

/* --------------------------- Generate modal ------------------------ */
/* Generic Generate button → this modal. Count + optional idea; empty  */
/* idea = generate from Brand. Cost line shows the free-plan budget.   */

function GenerateModal({ onClose, p }: { onClose: () => void; p: Palette }) {
  const [count, setCount] = useState(3);
  const options = [1, 3, 5, 10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-[#1E232B] p-6 ${MODAL_SHADOW}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[18px] font-bold tracking-[-0.01em] text-[#ECE9E2]">Generate slideshow</h2>
            <p className="mt-1 text-[12.5px] text-[#A3A6AC]">From your Brand: Daily Grind · Self-improvement.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className={MODE.link}>
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[11px] font-bold text-[#A3A6AC]">Idea (optional)</span>
          <input
            placeholder="e.g. Money habits of disciplined people"
            className="w-full rounded-xl border border-white/10 bg-[#20242B] px-3.5 py-2.5 text-[13px] text-[#ECE9E2] outline-none placeholder:text-[#8C929B]"
          />
        </label>
        <p className="mt-1.5 text-[12px] text-[#8C929B]">Leave empty to generate from your Brand.</p>

        <div className="mt-4">
          <span className="mb-1.5 block text-[11px] font-bold text-[#A3A6AC]">How many?</span>
          <div className="flex gap-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setCount(o)}
                aria-pressed={count === o}
                className={`flex h-10 w-12 items-center justify-center rounded-full text-[13px] font-bold ${FOCUS} ${
                  count === o ? 'bg-[#E8B53B] text-[#1A1B12]' : MODE.softBtn
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11.5px] font-medium text-[#8C929B]">
          This uses 1 of your 3 free slideshows.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <QuietButton onClick={onClose} className="px-4 py-2" m={MODE}>
            Cancel
          </QuietButton>
          <MintButton onClick={onClose} p={p} m={MODE}>
            Generate
          </MintButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Editor modal -------------------------- */
/* The Post / Slides / Export flow. Opens from Edit (Post tab) or       */
/* Export (Export tab). Save on Post/Slides, Done on Export.            */

function EditorModal({
  slideshow,
  initialTab,
  onClose,
  p,
}: {
  slideshow: SlideItem;
  initialTab: EditorTab;
  onClose: () => void;
  p: Palette;
}) {
  const [tab, setTab] = useState<EditorTab>(initialTab);
  const [index, setIndex] = useState(0);
  const total = slideshow.slides.length;

  const tabs: { key: EditorTab; label: string }[] = [
    { key: 'post', label: 'Post' },
    { key: 'slides', label: 'Slides' },
    { key: 'export', label: 'Export' },
  ];

  const inputCls = 'w-full rounded-xl border border-white/10 bg-[#20242B] px-3.5 py-2.5 text-[13px] text-[#ECE9E2] outline-none';
  const textareaCls = 'w-full resize-none rounded-xl border border-white/10 bg-[#20242B] px-3.5 py-3 text-[13px] leading-relaxed text-[#ECE9E2] outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className={`flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1E232B] ${MODAL_SHADOW} sm:flex-row`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview side: the slide on a darker scrim */}
        <div className="flex flex-col items-center justify-center gap-4 bg-[#121418] p-6 sm:flex-1">
          <SlideThumb
            tone={p.tones[slideshow.tones[index % slideshow.tones.length]]}
            index={index + 1}
            className="w-44 sm:w-52"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#23272E] text-[#A3A6AC] disabled:opacity-40 ${FOCUS}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {slideshow.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${FOCUS} ${i === index ? 'w-5' : 'w-1.5 bg-[#3A3F47]'}`}
                  style={i === index ? { backgroundColor: p.accent } : undefined}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              aria-label="Next slide"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#23272E] text-[#A3A6AC] disabled:opacity-40 ${FOCUS}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-[#8C929B]">
            {index + 1} / {total}
          </span>
        </div>

        {/* Editor side */}
        <div className="flex min-w-0 w-full flex-col sm:w-96">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${MODE.link} ${FOCUS}`}
                  style={tab === t.key ? { backgroundColor: p.accentTint, color: p.accent } : undefined}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close" className={MODE.link}>
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            {tab === 'post' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#A3A6AC]">Caption</span>
                  <textarea rows={5} defaultValue={slideshow.caption} className={textareaCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#A3A6AC]">Hashtags</span>
                  <input defaultValue={slideshow.hashtags.map((t) => `#${t}`).join(' ')} className={inputCls} />
                </label>
              </>
            )}

            {tab === 'slides' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A3A6AC]">Slide {index + 1} text</span>
                  <button className={`inline-flex items-center gap-1 text-[11px] font-semibold ${MODE.linkDanger} ${FOCUS}`}>
                    <Trash2 className="h-3 w-3" />
                    Delete slide
                  </button>
                </div>
                <textarea key={index} rows={4} defaultValue={slideshow.slides[index]} className={textareaCls} />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#A3A6AC]">Background</span>
                    <button className={`inline-flex items-center gap-1 text-[11px] font-semibold ${FOCUS}`} style={{ color: p.accent }}>
                      <Shuffle className="h-3 w-3" />
                      Shuffle all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {p.tones.map((tone, i) => (
                      <button
                        key={i}
                        aria-label={`Background ${i + 1}`}
                        className={`aspect-[9/16] rounded-lg ${MODE.thumb} ${FOCUS}`}
                        style={{ backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
                      >
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'export' && (
              <>
                <p className="text-[12px] leading-relaxed text-[#A3A6AC]">
                  Download the background images, then add text inside TikTok with the native font.
                  The free plan adds a small Elion watermark.
                </p>
                <div className="space-y-1.5">
                  {slideshow.slides.map((text, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#20242B] p-2.5">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#262215] text-[11px] font-bold"
                        style={{ color: p.accent }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-[#ECE9E2]">{text}</span>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${MODE.link} ${FOCUS}`}>
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${MODE.link} ${FOCUS}`}>
                        <Download className="h-3 w-3" />
                        Image
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <MintButton icon={Download} className="px-4 py-2 text-[12px]" p={p} m={MODE}>
                    Download all
                  </MintButton>
                  <QuietButton icon={Copy} className="px-4 py-2 text-[12px]" m={MODE}>
                    Copy all text
                  </QuietButton>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 px-4 py-3">
            <QuietButton onClick={onClose} className="px-4 py-2" m={MODE}>
              Cancel
            </QuietButton>
            {tab === 'export' ? (
              <MintButton icon={Check} onClick={onClose} className="px-4 py-2 text-[12.5px]" p={p} m={MODE}>
                Done
              </MintButton>
            ) : (
              <MintButton icon={Check} className="px-4 py-2 text-[12.5px]" p={p} m={MODE}>
                Save
              </MintButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Page (full app) ------------------------ */

function Ember({ p }: { p: Palette }) {
  const [view, setView] = useState<View>('home');
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState<{ i: number; tab: EditorTab } | null>(null);

  return (
    <div className={`min-h-screen w-full ${MODE.page} text-[#ECE9E2]`}>
      <div className="flex min-h-screen">
        <Sidebar active={view} onSelect={setView} p={p} m={MODE} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {view === 'home' && (
            <HomeView
              onGenerate={() => setGenerating(true)}
              onEdit={(i, tab) => setEditing({ i, tab })}
              onTuneBrand={() => setView('brand')}
              p={p}
            />
          )}
          {view === 'brand' && <BrandView />}
          {view === 'billing' && <BillingView p={p} />}
        </main>
      </div>

      {generating && <GenerateModal onClose={() => setGenerating(false)} p={p} />}
      {editing && SLIDESHOWS[editing.i] && (
        <EditorModal
          slideshow={SLIDESHOWS[editing.i]}
          initialTab={editing.tab}
          onClose={() => setEditing(null)}
          p={p}
        />
      )}
    </div>
  );
}

/* -------------------------- Preview (card) -------------------------- */

function PreviewEmber({ p }: { p: Palette }) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#14161A]">
      <div className="flex h-full">
        {/* mini sidebar */}
        <div className="flex w-[64px] shrink-0 flex-col border-r border-white/5 bg-[#171B21] px-2 py-2.5">
          <span className="truncate font-display text-[8px] font-bold text-[#ECE9E2]">Elion</span>
          <div className="mt-2.5 flex flex-col gap-1">
            {(
              [
                [LayoutGrid, true],
                [Sliders, false],
                [CreditCard, false],
              ] as [LucideIcon, boolean][]
            ).map(([Icon, active]) => (
              <span
                key={Icon.displayName ?? Icon.name}
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-[#E8B53B] text-[#1A1B12]' : 'text-[#8C929B]'}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
          <span className="mt-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#23272E] text-[7px] font-bold text-[#ECE9E2]">
            AC
          </span>
        </div>

        {/* mini main */}
        <div className="flex min-w-0 flex-1 flex-col p-3">
          <p className="font-mono text-[8px] text-[#8C929B]">Sat, 2 Aug</p>
          <p className="mt-0.5 font-display text-[12px] font-bold leading-tight text-[#ECE9E2]">Good morning, Alex.</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-[9px] font-bold text-[#ECE9E2]">Your slideshows</p>
            <span
              className="inline-flex items-center rounded-full bg-[#E8B53B] px-2 py-0.5 text-[7px] font-semibold text-[#1A1B12]"
            >
              Generate
            </span>
          </div>

          {SLIDESHOWS.slice(0, 2).map((s) => (
            <div key={s.title} className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 bg-[#1B1F26] p-2">
              <SlideThumb tone={p.tones[s.tones[0]]} index={1} className="w-6" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[8.5px] font-bold text-[#ECE9E2]">{s.title}</p>
                <p className="truncate text-[7px] text-[#8C929B]">{s.hook}</p>
              </div>
              <StatusChip status={s.status} p={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Page() {
  return <Ember p={PALETTES.ember} />;
}

export function Preview() {
  return <PreviewEmber p={PALETTES.ember} />;
}

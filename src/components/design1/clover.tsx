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
/* Clover: the chosen direction. Black & white, soft rounded, desktop  */
/* sidebar shell.                                                      */
/*                                                                     */
/* Monochrome palette, deep black accent (#0A0D11). The soft-lift      */
/* shadows are used with restraint: cards, the brand strip, the Pro    */
/* card, the one selected nav pill. Never icons or buttons. No borders */
/* anywhere; shadow and tone do the separation.                        */
/*                                                                     */
/* Icons: the AI-generator tells (Sparkles, the Leaf logo mark) are    */
/* removed; functional icons stay. No logo mark in the mockup: the     */
/* real Elion logo will be built as a reusable component and linked in */
/* across the UI. The Daily Grind project chip is gone (one Brand per  */
/* user, no switcher); brand context lives in Brand view and the       */
/* Generate modal.                                                     */
/*                                                                     */
/* Font pairing: Onest Variable = display/headers (main face); Inter   */
/* Tight Variable = body/UI text (sub face); JetBrains Mono Variable = */
/* counters inside slide thumbnails. Loaded in index.css.              */
/*                                                                     */
/* Copy rule: NO em dashes in any user-facing string.                  */
/*                                                                     */
/* Palette + mode objects flow into shadcn tokens later.               */
/* ------------------------------------------------------------------ */

type View = 'home' | 'brand' | 'billing';
type EditorTab = 'post' | 'slides' | 'export';

type Tone = { from: string; to: string };

type Palette = {
  name: string;
  accent: string;      // solid accent: primary action, selection, state
  accentText: string;  // accent text on the tint (≥4.5:1)
  accentTint: string;  // pale accent background (chips, meter card, tabs)
  tones: Tone[];       // slide background gradients (the saturated content)
};

/* Structural treatment: restrained soft-lift shadows on containers. */
type Mode = {
  page: string;
  sidebar: string;
  card: string;
  rowHover: string;   // idle nav / settings rows
  softBtn: string;    // secondary buttons
  strip: string;      // "Tune your Brand" strip
  proCard: string;    // Pro plan card (dark)
  proButton: string;  // Pro card CTA: white fill on the dark card
  link: string;       // text links
  button: string;     // primary button hover lift
  iconDanger: string; // trash icon hover
  linkDanger: string; // "Delete slide" hover
  thumb: string;      // background-thumb lift
  readySolid: boolean;// Ready chip: solid ink
};

/* Radius scale. Constant per role; never a hierarchy lever (size,
   shadow, weight do hierarchy). These map to shadcn tokens later.
     full = pills: buttons, chips, tabs, dots, row active states
     2xl  = large surfaces: cards, modals, Pro card
     xl   = controls + small containers: inputs, fields, meter card, strip, tiles
     lg   = media + tiny tiles: slide thumbs, swatches, index tiles */
const MODAL_SHADOW = 'shadow-[0_24px_64px_-20px_rgba(20,25,30,0.35)]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0D11]';

const PALETTES = {
  black: {
    name: 'Black & White',
    accent: '#0A0D11',
    accentText: '#0A0D11',
    accentTint: '#E9ECEF',
    tones: [
      { from: '#0A0D11', to: '#2E353D' },
      { from: '#0A0D11', to: '#4A5158' },
      { from: '#0A0D11', to: '#5B646C' },
      { from: '#0A0D11', to: '#3A4149' },
    ],
  },
} satisfies Record<string, Palette>;

const MODE: Mode = {
  page: 'bg-[#F2F4F6]',
  sidebar: 'bg-white',
  card: 'rounded-2xl bg-white shadow-[0_1px_2px_rgba(20,25,30,0.04),0_14px_30px_-20px_rgba(20,25,30,0.35)]',
  rowHover: 'transition-colors hover:bg-[#E9ECEF]',
  softBtn: 'bg-[#EBEEF1] text-[#454D56] transition-colors hover:bg-[#E2E6EA]',
  strip: 'rounded-xl bg-white shadow-[0_1px_2px_rgba(20,25,30,0.04),0_10px_24px_-14px_rgba(20,25,30,0.25)] transition-shadow hover:shadow-[0_1px_2px_rgba(20,25,30,0.04),0_16px_32px_-16px_rgba(20,25,30,0.4)]',
  proCard: 'rounded-2xl bg-[#0A0D11] shadow-[0_1px_2px_rgba(20,25,30,0.1),0_24px_48px_-24px_rgba(20,25,30,0.5)]',
  proButton: 'bg-white text-[#0A0D11] transition-colors hover:bg-[#E9ECEF]',
  link: 'text-[#5C6570] hover:text-[#0A0D11]',
  button: 'transition-transform hover:-translate-y-px',
  iconDanger: 'hover:bg-[#F4E5E4] hover:text-[#C0433A]',
  linkDanger: 'hover:text-[#C0433A]',
  thumb: 'transition-transform hover:-translate-y-0.5',
  readySolid: true,
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

/* Status chips. Draft/Exported are neutral; Ready carries the accent  */
/* (tinted in flat, solid ink in the monochrome shadow variant).       */
const CHIP_NEUTRALS = {
  Draft: { chip: 'bg-[#EBEEF1] text-[#5C6570]', dot: 'bg-[#6B747E]', label: 'Draft' },
  Exported: { chip: 'bg-[#E4E7EB] text-[#5F6872]', dot: 'bg-[#7A838D]', label: 'Exported' },
};

/* ----------------------------- primitives -------------------------- */

function StatusChip({ status, p, m }: { status: SlideItem['status']; p: Palette; m: Mode }) {
  if (status === 'Ready') {
    if (m.readySolid) {
      return (
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0A0D11] px-2.5 py-1 text-[11px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Ready
        </span>
      );
    }
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{ backgroundColor: p.accentTint, color: p.accentText }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
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

/* Primary action. Flat accent fill; hover lift only in shadow mode. */
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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white ${m.button} ${FOCUS} ${className}`}
      style={{ backgroundColor: p.accent }}
    >
      {icon && <Icon icon={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* Secondary action. Flat neutral; recedes so the one accent leads. */
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
      <span className="mb-1.5 block text-[11px] font-semibold text-[#5C6570]">{label}</span>
      <div className="flex items-center rounded-xl bg-[#F2F4F6] px-3.5 py-2.5 text-sm text-[#0A0D11]">
        {value}
      </div>
    </label>
  );
}

/* ------------------------------ sidebar ---------------------------- */

function Sidebar({ active, onSelect, p, m }: { active: View; onSelect: (v: View) => void; p: Palette; m: Mode }) {
  return (
    <aside className={`flex w-[248px] shrink-0 flex-col ${m.sidebar}`}>
      {/* Brand. Wordmark only: no logo mark in the mockup. The real Elion
          logo will be a reusable component, linked in across the UI. */}
      <div className="px-5 pb-4 pt-5">
        <p className="font-display text-[15px] font-bold text-[#0A0D11]">Elion</p>
      </div>

      {/* Nav (one Brand per user, so no project switcher) */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex h-10 w-full items-center gap-3 rounded-full px-4 text-left ${m.rowHover} ${FOCUS} ${
                isActive ? 'text-white' : 'text-[#5C6570]'
              }`}
              style={isActive ? { backgroundColor: p.accent } : undefined}
            >
              <Icon className={`h-[17px] w-[17px] shrink-0 ${isActive ? 'text-white' : 'text-[#6B747E]'}`} />
              <span className="flex-1 text-[13.5px] font-semibold">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned bottom */}
      <div className="p-3">
        <div className="rounded-xl p-3.5" style={{ backgroundColor: p.accentTint }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold" style={{ color: p.accentText }}>
              Free plan
            </span>
            <span className="text-[11px] font-semibold" style={{ color: p.accentText }}>
              2 of 3 used
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: p.accent }} />
          </div>
          <button className={`mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold ${FOCUS}`} style={{ color: p.accentText }}>
            Upgrade to Pro
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="mt-2 flex flex-col">
          <button className={`flex h-9 items-center gap-3 rounded-full px-4 text-[13px] font-medium text-[#5C6570] ${m.rowHover} ${FOCUS}`}>
            <Settings className="h-4 w-4 text-[#6B747E]" />
            Settings
          </button>
          <button className={`flex h-9 items-center gap-3 rounded-full px-4 text-[13px] font-medium text-[#5C6570] ${m.rowHover} ${FOCUS}`}>
            <LogOut className="h-4 w-4 text-[#6B747E]" />
            Sign out
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2.5 px-1.5 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0D11] text-[11px] font-bold text-white">
            AC
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12.5px] font-semibold text-[#0A0D11]">Alex Carter</p>
            <p className="truncate text-[10.5px] text-[#5C6570]">alex@dailygrind.com</p>
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
  m,
  captionLines,
}: {
  s: SlideItem;
  i: number;
  onEdit: (i: number, tab: EditorTab) => void;
  p: Palette;
  m: Mode;
  captionLines: 2 | 3;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold leading-snug text-[#0A0D11]">{s.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusChip status={s.status} p={p} m={m} />
          <button
            aria-label={`Delete ${s.title}`}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[#7A838D] ${m.iconDanger} ${FOCUS}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-[#0A0D11]">{s.hook}</p>
      <p
        className={`mt-1.5 ${captionLines === 3 ? 'line-clamp-3' : 'line-clamp-2'} text-[12px] leading-relaxed text-[#5C6570]`}
      >
        {s.caption}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.hashtags.map((tag) => (
          <span key={tag} className="rounded-full bg-[#EBEEF1] px-2 py-0.5 text-[11px] font-medium text-[#5C6570]">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-[#636D78]">
          {s.count} slides · {s.time}
        </span>
        <div className="flex items-center gap-2">
          <QuietButton icon={PenLine} onClick={() => onEdit(i, 'post')} m={m}>
            Edit
          </QuietButton>
          <QuietButton icon={Download} onClick={() => onEdit(i, 'export')} m={m}>
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
  m,
}: {
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onTuneBrand: () => void;
  p: Palette;
  m: Mode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-8 py-8">
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-[#0A0D11]">Good morning</h1>
        <p className="mt-1.5 text-sm text-[#5C6570]">Saturday, 2 Aug. What are we posting today?</p>
      </header>

      {/* Work-list header: title + count left, Generate right (the ONE accent CTA) */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[17px] font-bold text-[#0A0D11]">Your slideshows</h2>
          <p className="mt-1 text-[12px] font-medium text-[#5C6570]">
            {SLIDESHOWS.length} slideshows · {SLIDESHOWS.filter((s) => s.status === 'Ready').length} ready to post
          </p>
        </div>
        <MintButton onClick={onGenerate} p={p} m={m}>
          Generate
        </MintButton>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SLIDESHOWS.map((s, i) =>
          i === 0 ? (
            /* The one you're working on now leads: full width, preview left */
            <article key={s.title} className={`overflow-hidden lg:col-span-2 ${m.card}`}>
              <div className="flex flex-col sm:flex-row">
                <div className="flex shrink-0 items-center gap-2 bg-[#F2F4F6]/60 p-4">
                  {s.tones.slice(0, 3).map((idx, j) => (
                    <SlideThumb key={j} tone={p.tones[idx]} index={j + 1} className="w-24" />
                  ))}
                  <span className="pl-1 text-[11px] font-semibold text-[#636D78]">+{s.count - 3} more</span>
                </div>
                <CardBody s={s} i={i} onEdit={onEdit} p={p} m={m} captionLines={3} />
              </div>
            </article>
          ) : (
            <article key={s.title} className={`overflow-hidden ${m.card}`}>
              <div className="flex gap-2 bg-[#F2F4F6]/60 px-4 py-3">
                {s.tones.map((idx, j) => (
                  <SlideThumb key={j} tone={p.tones[idx]} index={j + 1} className="w-12" />
                ))}
                <span className="ml-auto flex items-center self-end pb-0.5 text-[11px] font-semibold text-[#636D78]">
                  +{s.count - 3} more
                </span>
              </div>
              <CardBody s={s} i={i} onEdit={onEdit} p={p} m={m} captionLines={2} />
            </article>
          ),
        )}
      </div>

      {/* Brand nudge: a slim strip, not a peer card, so the work leads */}
      <button
        onClick={onTuneBrand}
        className={`mt-4 flex w-full items-center gap-3 px-4 py-3 text-left ${m.strip} ${FOCUS}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: p.accentTint }}>
          <Sliders className="h-4 w-4" style={{ color: p.accentText }} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-display text-[13px] font-bold text-[#0A0D11]">Tune your Brand</span>
          <span className="mt-0.5 block text-[12px] text-[#5C6570]">
            Niche, audience, and style memory, so Elion writes in your voice.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold" style={{ color: p.accentText }}>
          Open Brand
          <ArrowRight className="h-3 w-3" />
        </span>
      </button>
    </div>
  );
}

function BrandView({ m }: { m: Mode }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-[-0.01em] text-[#0A0D11]">
          What the AI knows about you
        </h1>
        <p className="mt-1.5 text-sm text-[#5C6570]">
          Your niche, audience, and style memory. Elion writes every slideshow in this voice.
        </p>
      </header>

      <section className={`p-6 ${m.card}`}>
        <p className="mb-4 font-display text-[13px] font-bold text-[#0A0D11]">Your brand</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Niche" value="Self-improvement" />
          <Field label="App name" value="Daily Grind" />
          <Field label="Audience" value="Men 18–34 on TikTok" />
          <Field label="App description" value="Daily motivation for people building discipline" />
        </div>
      </section>

      <section className={`mt-5 p-6 ${m.card}`}>
        <p className="mb-4 font-display text-[13px] font-bold text-[#0A0D11]">Style memory</p>
        <div className="whitespace-pre-line rounded-xl bg-[#F2F4F6] px-4 py-3.5 text-[13px] leading-relaxed text-[#0A0D11]">
          {'Short punchy lines.\nBlack-and-gray gradient slides.\nNo emojis. End every slide with a question.'}
        </div>
      </section>
    </div>
  );
}

function BillingView({ p, m }: { p: Palette; m: Mode }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-[-0.01em] text-[#0A0D11]">
          Simple. Just the two plans.
        </h1>
        <p className="mt-1.5 text-sm text-[#5C6570]">You're on the free plan.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className={`p-6 ${m.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-[#0A0D11]">Free</h3>
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: p.accentTint, color: p.accentText }}>
              Current
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#5C6570]">For trying it out.</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[#454D56]">
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
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: p.accentTint, color: p.accentText }}>
                    {right}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={`p-6 text-white ${m.proCard}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-[#F4F6F8]">Pro</h3>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#E2DCCE]">
              $9/mo
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#B9C1C9]">For posting on a schedule.</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[#F0F2F4]">
            {['300 slideshows every month', 'No watermark', 'Everything in Free'].map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#B8C0C9]" />
                {row}
              </li>
            ))}
          </ul>
          <button className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${m.proButton} ${FOCUS}`}>
            Upgrade to Pro
          </button>
        </section>
      </div>
    </div>
  );
}

/* --------------------------- Generate modal ------------------------ */
/* Generic Generate button → this modal. Count + optional idea; empty  */
/* idea = generate from Brand. Matches SlideSmith's GenerateModal.     */

function GenerateModal({ onClose, p, m }: { onClose: () => void; p: Palette; m: Mode }) {
  const [count, setCount] = useState(3);
  const options = [1, 3, 5, 10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,28,33,0.4)] p-4" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-6 ${MODAL_SHADOW}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[18px] font-bold text-[#0A0D11]">Generate slideshow</h2>
            <p className="mt-1 text-[12.5px] text-[#5C6570]">From your Brand: Daily Grind · Self-improvement.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className={m.link}>
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[11px] font-bold text-[#5C6570]">Idea (optional)</span>
          <input
            placeholder="e.g. Money habits of disciplined people"
            className="w-full rounded-xl bg-[#F2F4F6] px-3.5 py-2.5 text-[13px] text-[#0A0D11] outline-none placeholder:text-[#636D78]"
          />
        </label>
        <p className="mt-1.5 text-[12px] text-[#636D78]">Leave empty to generate from your Brand.</p>

        <div className="mt-4">
          <span className="mb-1.5 block text-[11px] font-bold text-[#5C6570]">How many?</span>
          <div className="flex gap-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setCount(o)}
                aria-pressed={count === o}
                className={`flex h-10 w-12 items-center justify-center rounded-full text-[13px] font-bold ${m.softBtn} ${FOCUS} ${count === o ? 'text-white' : ''}`}
                style={count === o ? { backgroundColor: p.accent } : undefined}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11.5px] font-medium text-[#636D78]">
          This uses 1 of your 3 free slideshows.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <QuietButton onClick={onClose} className="px-4 py-2" m={m}>
            Cancel
          </QuietButton>
          <MintButton onClick={onClose} p={p} m={m}>
            Generate
          </MintButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Editor modal -------------------------- */
/* The Post / Slides / Export flow. SlideSmith's SlideshowEditorModal,  */
/* rebuilt in Clover. Opens from Edit (Post tab) or Export (Export tab).*/

function EditorModal({
  slideshow,
  initialTab,
  onClose,
  p,
  m,
}: {
  slideshow: SlideItem;
  initialTab: EditorTab;
  onClose: () => void;
  p: Palette;
  m: Mode;
}) {
  const [tab, setTab] = useState<EditorTab>(initialTab);
  const [index, setIndex] = useState(0);
  const total = slideshow.slides.length;

  const tabs: { key: EditorTab; label: string }[] = [
    { key: 'post', label: 'Post' },
    { key: 'slides', label: 'Slides' },
    { key: 'export', label: 'Export' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,28,33,0.4)] p-4" onClick={onClose}>
      <div
        className={`flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white ${MODAL_SHADOW} sm:flex-row`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview side */}
        <div className="flex flex-col items-center justify-center gap-4 bg-[#F2F4F6] p-6 sm:flex-1">
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
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5C6570] disabled:opacity-40 ${FOCUS}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {slideshow.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${FOCUS} ${i === index ? 'w-5' : 'w-1.5 bg-[#D3D9DF]'}`}
                  style={i === index ? { backgroundColor: p.accent } : undefined}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              aria-label="Next slide"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5C6570] disabled:opacity-40 ${FOCUS}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-[#5C6570]">
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
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${m.link} ${FOCUS}`}
                  style={tab === t.key ? { backgroundColor: p.accentTint, color: p.accentText } : undefined}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close" className={m.link}>
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            {tab === 'post' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#5C6570]">Caption</span>
                  <textarea
                    rows={5}
                    defaultValue={slideshow.caption}
                    className="w-full resize-none rounded-xl bg-[#F2F4F6] px-3.5 py-3 text-[13px] leading-relaxed text-[#0A0D11] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#5C6570]">Hashtags</span>
                  <input
                    defaultValue={slideshow.hashtags.map((t) => `#${t}`).join(' ')}
                    className="w-full rounded-xl bg-[#F2F4F6] px-3.5 py-2.5 text-[13px] text-[#0A0D11] outline-none"
                  />
                </label>
              </>
            )}

            {tab === 'slides' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5C6570]">Slide {index + 1} text</span>
                  <button className={`inline-flex items-center gap-1 text-[11px] font-semibold ${m.linkDanger} ${FOCUS}`}>
                    <Trash2 className="h-3 w-3" />
                    Delete slide
                  </button>
                </div>
                <textarea
                  key={index}
                  rows={4}
                  defaultValue={slideshow.slides[index]}
                  className="w-full resize-none rounded-xl bg-[#F2F4F6] px-3.5 py-3 text-[13px] leading-relaxed text-[#0A0D11] outline-none"
                />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5C6570]">Background</span>
                    <button className={`inline-flex items-center gap-1 text-[11px] font-semibold ${FOCUS}`} style={{ color: p.accentText }}>
                      <Shuffle className="h-3 w-3" />
                      Shuffle all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {p.tones.map((tone, i) => (
                      <button
                        key={i}
                        aria-label={`Background ${i + 1}`}
                        className={`aspect-[9/16] rounded-lg ${m.thumb} ${FOCUS}`}
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
                <p className="text-[12px] leading-relaxed text-[#5C6570]">
                  Download the background images, then add text inside TikTok with the native font.
                  The free plan adds a small Elion watermark.
                </p>
                <div className="space-y-1.5">
                  {slideshow.slides.map((text, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl bg-[#F2F4F6] p-2.5">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-bold"
                        style={{ color: p.accentText }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-[#0A0D11]">{text}</span>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${m.link} ${FOCUS}`}>
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${m.link} ${FOCUS}`}>
                        <Download className="h-3 w-3" />
                        Image
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <MintButton icon={Download} className="px-4 py-2 text-[12px]" p={p} m={m}>
                    Download all
                  </MintButton>
                  <QuietButton icon={Copy} className="px-4 py-2 text-[12px]" m={m}>
                    Copy all text
                  </QuietButton>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 px-4 py-3">
            <QuietButton onClick={onClose} className="px-4 py-2" m={m}>
              Cancel
            </QuietButton>
            {tab === 'export' ? (
              <MintButton icon={Check} onClick={onClose} className="px-4 py-2 text-[12.5px]" p={p} m={m}>
                Done
              </MintButton>
            ) : (
              <MintButton icon={Check} className="px-4 py-2 text-[12.5px]" p={p} m={m}>
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

function Clover({ p, m }: { p: Palette; m: Mode }) {
  const [view, setView] = useState<View>('home');
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState<{ i: number; tab: EditorTab } | null>(null);

  return (
    <div className={`min-h-screen w-full ${m.page} text-[#0A0D11]`}>
      <div className="flex min-h-screen">
        <Sidebar active={view} onSelect={setView} p={p} m={m} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {view === 'home' && (
            <HomeView
              onGenerate={() => setGenerating(true)}
              onEdit={(i, tab) => setEditing({ i, tab })}
              onTuneBrand={() => setView('brand')}
              p={p}
              m={m}
            />
          )}
          {view === 'brand' && <BrandView m={m} />}
          {view === 'billing' && <BillingView p={p} m={m} />}
        </main>
      </div>

      {generating && <GenerateModal onClose={() => setGenerating(false)} p={p} m={m} />}
      {editing && SLIDESHOWS[editing.i] && (
        <EditorModal
          slideshow={SLIDESHOWS[editing.i]}
          initialTab={editing.tab}
          onClose={() => setEditing(null)}
          p={p}
          m={m}
        />
      )}
    </div>
  );
}

/* -------------------------- Preview (card) -------------------------- */

function PreviewClover({ p, m }: { p: Palette; m: Mode }) {
  return (
    <div className={`relative w-full aspect-[4/3] overflow-hidden rounded-lg ${m.page}`}>
      <div className="flex h-full">
        {/* mini sidebar */}
        <div className={`flex w-[64px] shrink-0 flex-col px-2 py-2.5 ${m.sidebar}`}>
          <span className="truncate font-display text-[8px] font-bold text-[#0A0D11]">Elion</span>
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
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'text-white' : 'text-[#8B939C]'}`}
                style={active ? { backgroundColor: p.accent } : undefined}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
          <span className="mt-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#0A0D11] text-[7px] font-bold text-white">
            AC
          </span>
        </div>

        {/* mini main */}
        <div className="flex min-w-0 flex-1 flex-col p-3">
          <p className="text-[9px] font-medium text-[#5C6570]">Sat · 2 Aug</p>
          <p className="mt-0.5 font-display text-[13px] font-bold leading-tight text-[#0A0D11]">Good morning</p>
          <p className="text-[8px] text-[#5C6570]">What are we posting today?</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-[9px] font-bold text-[#0A0D11]">Your slideshows</p>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[7px] font-semibold text-white"
              style={{ backgroundColor: p.accent }}
            >
              Generate
            </span>
          </div>

          {SLIDESHOWS.slice(0, 2).map((s) => (
            <div key={s.title} className={`mt-1.5 flex items-center gap-2 p-2 ${m.card}`}>
              <SlideThumb tone={p.tones[s.tones[0]]} index={1} className="w-6" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[8.5px] font-bold text-[#0A0D11]">{s.title}</p>
                <p className="truncate text-[7px] text-[#5C6570]">{s.hook}</p>
              </div>
              <StatusChip status={s.status} p={p} m={m} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- exported page ------------------------- */
/* The chosen direction: Black & White with restrained shadows.        */

export function Page() {
  return <Clover p={PALETTES.black} m={MODE} />;
}
export function Preview() {
  return <PreviewClover p={PALETTES.black} m={MODE} />;
}

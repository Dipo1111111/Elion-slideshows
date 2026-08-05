import { useEffect, useState } from 'react';
import {
  PenLine,
  Sliders,
  Home,
  Images,
  BookOpen,
  Wallet,
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
  Settings,
  Plus,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import elionLogo from '../../assets/elion-logo.png';

/* ------------------------------------------------------------------ */
/* Synthover: Clover's product on Synth's deep-black material.         */
/*                                                                     */
/* The user-led merge: keep Synth's sidebar structure and outlined     */
/* dark studio material, swap the purple accent for blue (#3B82F6),    */
/* graft Clover's pinned sidebar bottom (free plan, settings, sign     */
/* out, account), keep Synth's nav naming (Dashboard / Library /       */
/* Brand Voice / Plan & Billing), rebuild Home, Library, Brand Voice,  */
/* and Plan & Billing from Clover's content in Synth's material.       */
/*                                                                     */
/* Palette: deep matte black page (#08080A) with #0C0D10 insets for    */
/* media and controls. Cards are hairline-flat: border only, no grey   */
/* fills, so the work disappears into the task. One accent = blue      */
/* (#3B82F6), used as translucent glass only: /20 fills, /25 hairlines, */
/* never solid. Active nav = text + icon turn blue (no bg, no padding), */
/* hover = text brightens. Generate is a nav-style white text row (no  */
/* padded pill), so the rail stays one rhythm. The one primary action  */
/* pill (MintButton) is translucent WHITE glass (white/20 + white/30   */
/* hairline), high-contrast trigger without a solid fill; blue is the  */
/* state language (status, selection, links), white is the action      */
/* language. Plan widget is quiet: status text, neutral track, blue    */
/* upgrade link. Modals are the only elevated layer. Sidebar is pinned */
/* (h-screen shell, main scrolls).                                     */
/*                                                                     */
/* NO gradient state in the UI. Slides always show real photos: the    */
/* picsum URLs below stand in for the Pinterest pool (served same-     */
/* origin in production so canvas export is never tainted). A new      */
/* user's dashboard is an EMPTY STATE, generating shows a SKELETON     */
/* LOADER, and only after generation do image-backed cards appear.     */
/* The thin scrim on thumbs is for text legibility, not decoration.    */
/*                                                                     */
/* Fonts: Schibsted Grotesk = headers and main display (font-display),  */
/* Inter Tight = body and the whole sidebar (font-sans), DM Sans =       */
/* numbers and counters (font-num). Icons: lucide-react at 1.5 stroke.  */
/*                                                                     */
/* Copy rule: NO em dashes in any user-facing string. Wordmark only,   */
/* no invented logo mark.                                              */
/*                                                                     */
/* Radius (constant per role):                                         */
/*   full = pills: primary buttons, chips, tabs, dots                  */
/*   xl   = cards and modals                                           */
/*   lg   = controls, inputs, nav rows, thumbs, swatches, index tiles  */
/* ------------------------------------------------------------------ */

type View = 'home' | 'library' | 'brand' | 'billing';
type Phase = 'empty' | 'loading' | 'ready';
type EditorTab = 'post' | 'slides' | 'export';

type SlideItem = {
  title: string;
  status: 'Draft' | 'Ready' | 'Exported';
  count: number;
  time: string;
  seed: string; // base seed into the background pool; per-slide = `${seed}-${slideIndex}`
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
    seed: 'lazy',
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
    seed: 'money',
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
    seed: '5am',
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

/* Background pool stand-in. Real backgrounds come from Pinterest pulls
   via Apify, stored and served same-origin. picsum.photos is a stable,
   keyless stand-in so the mockup shows real images, never gradients. */
const BG = (seed: string) => `https://picsum.photos/seed/elion-${seed}/640/960`;

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]';

/* ----------------------------- primitives -------------------------- */

function SlideThumb({ image, index, className = '' }: { image: string; index: number; className?: string }) {
  return (
    <div className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg bg-[#0C0D10] ${className}`}>
      <img src={image} alt={`Slide ${index}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      {/* Legibility scrim, not a designed background. */}
      <div className="absolute inset-0 bg-black/25" />
      <span className="absolute inset-0 flex items-center justify-center font-num text-[9px] font-bold text-white/90 drop-shadow">
        {index}
      </span>
    </div>
  );
}

function Icon({ icon, className }: { icon: LucideIcon; className: string }) {
  const Cmp = icon;
  return <Cmp className={className} strokeWidth={1.5} />;
}

/* Skeleton block for the generating state. */
function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#1A1B21] ${className}`} />;
}

/* Primary action. Translucent blue glass, white ink: nothing solid. */
function MintButton({
  children,
  icon,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/30 ${FOCUS} ${className}`}
    >
      {icon && <Icon icon={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* Secondary action. Outlined dark; recedes so the white leads. */
function QuietButton({
  children,
  icon,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#2E3140] bg-transparent px-3 py-1.5 text-[12px] font-semibold text-[#D1D5DB] transition-colors hover:bg-[#1A1B21] hover:text-white ${FOCUS} ${className}`}
    >
      {icon && <Icon icon={icon} className="h-3 w-3" />}
      {children}
    </button>
  );
}

/* Status chips. Ready carries the blue accent; the rest sit quiet. */
function StatusChip({ status }: { status: SlideItem['status'] }) {
  if (status === 'Ready') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3B82F6]/20 px-2.5 py-1 text-[11px] font-bold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Ready
      </span>
    );
  }
  const neutral =
    status === 'Draft'
      ? { chip: 'text-[#9CA0A8]', dot: 'bg-[#6E737B]', label: 'Draft' }
      : { chip: 'text-[#9CA0A8]', dot: 'bg-[#9CA0A8]', label: 'Exported' };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#262834] bg-[#121317] px-2.5 py-1 text-[11px] font-bold ${neutral.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${neutral.dot}`} />
      {neutral.label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#9CA0A8]">{label}</span>
      <div className="flex items-center rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3.5 py-2.5 text-[13px] text-[#E5E7EB]">
        {value}
      </div>
    </label>
  );
}

/* ------------------------------ sidebar ---------------------------- */

function Sidebar({
  active,
  onSelect,
  onGenerate,
  used,
}: {
  active: View;
  onSelect: (v: View) => void;
  onGenerate: () => void;
  used: number;
}) {
  const navItems: { key: View; label: string; icon: LucideIcon }[] = [
    { key: 'home', label: 'Dashboard', icon: Home },
    { key: 'library', label: 'Library', icon: Images },
    { key: 'brand', label: 'Brand Voice', icon: BookOpen },
    { key: 'billing', label: 'Plan & Billing', icon: Wallet },
  ];

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[#16171D] bg-[#08080A] font-sans">
      {/* Brand header. Real Elion logo (user-provided lockup, white on transparent). Sidebar runs Inter Tight (font-sans). */}
      <div className="px-5 pb-5 pt-6">
        <img src={elionLogo} alt="Elion" className="h-6 w-auto" />
      </div>

      {/* Primary action. Nav-style text row, white, not a padded pill: a pill
          in a rail of text rows is a pattern interrupt. Same gutter + row
          geometry as the nav items so it sits in the rail's rhythm. */}
      <div className="px-2">
        <button
          onClick={onGenerate}
          className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left font-bold text-white transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
        >
          <Plus className="h-[16px] w-[16px] shrink-0 text-white" strokeWidth={1.5} />
          <span className="text-[13px]">Generate</span>
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {navItems.map(({ key, label, icon: IconCmp }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition-colors ${
                isActive ? 'text-[#3B82F6]' : 'text-[#7A7F87] hover:text-[#D1D5DB]'
              } ${FOCUS}`}
            >
              <Icon
                icon={IconCmp}
                className={`h-[16px] w-[16px] shrink-0 ${isActive ? 'text-[#3B82F6]' : 'text-[#5F646B]'}`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned bottom: Clover's block on Synth's material */}
      <div className="p-3">
        {/* Plan status + upgrade. Quiet status (no solid chip on "free"),
            neutral track; the accent lives on the upgrade action alone. */}
        <div className="rounded-xl border border-[#1E2028] p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#9CA0A8]">Free plan</span>
            <span className="font-num text-[11px] text-[#6E737B]">{used} of 3 used</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#3B82F6]"
              style={{ width: `${Math.round((used / 3) * 100)}%` }}
            />
          </div>
          <button
            onClick={() => onSelect('billing')}
            className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
          >
            Upgrade to Pro
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>

        {/* Settings + Sign out */}
        <div className="mt-2 flex flex-col">
          <button className={`flex h-9 items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-[#7A7F87] transition-colors hover:text-[#D1D5DB] ${FOCUS}`}>
            <Settings className="h-4 w-4 text-[#5F646B]" strokeWidth={1.5} />
            Settings
          </button>
          <button className={`flex h-9 items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-[#7A7F87] transition-colors hover:text-[#D1D5DB] ${FOCUS}`}>
            <LogOut className="h-4 w-4 text-[#5F646B]" strokeWidth={1.5} />
            Sign out
          </button>
        </div>

        {/* Account */}
        <div className="mt-2 flex items-center gap-2.5 border-t border-[#16171D] px-1.5 pt-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#262834] bg-[#181920] text-[10px] font-bold text-white">
            AC
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12px] font-semibold text-white">Alex Carter</p>
            <p className="truncate text-[11px] text-[#8E8E93]">alex@dailygrind.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ views ------------------------------ */

/* Shared card body: title, hook, caption, hashtags, meta, actions. */
function CardBody({
  s,
  i,
  onEdit,
  captionLines,
}: {
  s: SlideItem;
  i: number;
  onEdit: (i: number, tab: EditorTab) => void;
  captionLines: 2 | 3;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold leading-snug text-white">{s.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusChip status={s.status} />
          <button
            aria-label={`Delete ${s.title}`}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[#7C838C] transition-colors hover:bg-[#3A2320] hover:text-[#F4877E] ${FOCUS}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-[#F2F4F7]">{s.hook}</p>
      <p
        className={`mt-1.5 ${captionLines === 3 ? 'line-clamp-3' : 'line-clamp-2'} text-[12px] leading-relaxed text-[#9CA0A8]`}
      >
        {s.caption}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.hashtags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#262834] bg-[#1A1B21] px-2 py-0.5 text-[11px] font-medium text-[#9CA0A8]">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-[#8E8E93]">
          {s.count} slides · {s.time}
        </span>
        <div className="flex items-center gap-2">
          <QuietButton icon={PenLine} onClick={() => onEdit(i, 'post')}>
            Edit
          </QuietButton>
          <QuietButton icon={Download} onClick={() => onEdit(i, 'export')}>
            Export
          </QuietButton>
        </div>
      </div>
    </div>
  );
}

/* The honest default for a new user: no slideshows exist yet. No fake
   cards, no gradient previews. One clear action: generate. */
function EmptyView({
  onGenerate,
  onTuneBrand,
}: {
  onGenerate: () => void;
  onTuneBrand: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Good morning
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#9CA0A8]">
          Let's create your first <span className="text-[#3B82F6]">slideshow</span>.
        </p>
      </header>

      <section className="flex flex-col items-center justify-center rounded-xl border border-[#1E2028] px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <Images className="h-5 w-5 text-white" strokeWidth={1.5} />
        </span>
        <h2 className="mt-4 font-display text-[17px] font-bold text-white">No slideshows yet</h2>
        <p className="mt-1.5 max-w-[380px] text-[13px] leading-relaxed text-[#9CA0A8]">
          Elion writes the script, pulls backgrounds from Pinterest, and gives you ready-to-post
          slides. Your first one takes about a minute.
        </p>
        <MintButton icon={Plus} onClick={onGenerate} className="mt-6">
          Generate your first slideshow
        </MintButton>
        <button
          onClick={onTuneBrand}
          className={`mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
        >
          Tune your Brand first
          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </button>
      </section>
    </div>
  );
}

/* Skeleton loader while Generate runs. Cards take the same shape as the
   real ones, but nothing is rendered until the images are in. */
function LoadingView() {
  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Good morning
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#9CA0A8]">
          Scraping Pinterest, writing your scripts, rendering previews. About a minute.
        </p>
      </header>

      <div className="mb-4">
        <h2 className="font-display text-[16px] font-bold text-white">Your slideshows</h2>
        <p className="mt-1 text-[12px] font-medium text-[#9CA0A8]">
          Writing 3 carousels for Daily Grind...
        </p>
      </div>

      <div className="space-y-4">
        {[0, 1].map((k) => (
          <div key={k} className="overflow-hidden rounded-xl border border-[#1E2028]">
            <div className="flex gap-2 bg-[#0C0D10] px-4 py-3">
              <Shimmer className="aspect-[9/16] w-12" />
              <Shimmer className="aspect-[9/16] w-12" />
              <Shimmer className="aspect-[9/16] w-12" />
              <Shimmer className="ml-auto w-16 self-end rounded-md pb-0.5" />
            </div>
            <div className="space-y-2 p-4">
              <Shimmer className="h-4 w-1/2 rounded-md" />
              <Shimmer className="h-3 w-3/4 rounded-md" />
              <Shimmer className="h-3 w-full rounded-md" />
              <div className="flex gap-1.5 pt-1">
                <Shimmer className="h-5 w-16 rounded-full" />
                <Shimmer className="h-5 w-14 rounded-full" />
                <Shimmer className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Shimmer className="h-3 w-20 rounded-md" />
                <div className="flex gap-2">
                  <Shimmer className="h-7 w-16 rounded-full" />
                  <Shimmer className="h-7 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* After generation: image-backed cards. Featured card leads, the rest
   fall into a two-column grid. */
function ReadyView({
  onGenerate,
  onEdit,
  onTuneBrand,
}: {
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onTuneBrand: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      {/* Greeting header */}
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Good morning
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#9CA0A8]">
          Tuesday, 4 Aug. Let's create your <span className="text-[#3B82F6]">slideshow</span>.
        </p>
      </header>

      {/* Work-list header: title + count left, Generate right (one accent CTA) */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[16px] font-bold text-white">Your slideshows</h2>
          <p className="mt-1 text-[12px] font-medium text-[#9CA0A8]">
            {SLIDESHOWS.length} slideshows · {SLIDESHOWS.filter((s) => s.status === 'Ready').length} ready to post
          </p>
        </div>
        <MintButton onClick={onGenerate}>
          Generate
        </MintButton>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SLIDESHOWS.map((s, i) =>
          i === 0 ? (
            /* The one you're working on now leads: full width, preview left */
            <article key={s.title} className="overflow-hidden rounded-xl border border-[#1E2028] transition-colors hover:border-[#2E3140] lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                <div className="flex shrink-0 items-center gap-2 bg-[#0C0D10] p-4">
                  {[0, 1, 2].map((j) => (
                    <SlideThumb key={j} image={BG(`${s.seed}-${j}`)} index={j + 1} className="w-24" />
                  ))}
                  <span className="pl-1 text-[11px] font-semibold text-[#7C838C]">+{s.count - 3} more</span>
                </div>
                <CardBody s={s} i={i} onEdit={onEdit} captionLines={3} />
              </div>
            </article>
          ) : (
            <article key={s.title} className="overflow-hidden rounded-xl border border-[#1E2028] transition-colors hover:border-[#2E3140]">
              <div className="flex gap-2 bg-[#0C0D10] px-4 py-3">
                {[0, 1, 2].map((j) => (
                  <SlideThumb key={j} image={BG(`${s.seed}-${j}`)} index={j + 1} className="w-12" />
                ))}
                <span className="ml-auto flex items-center self-end pb-0.5 text-[11px] font-semibold text-[#7C838C]">
                  +{s.count - 3} more
                </span>
              </div>
              <CardBody s={s} i={i} onEdit={onEdit} captionLines={2} />
            </article>
          ),
        )}
      </div>

      {/* Brand nudge: a slim strip, not a peer card, so the work leads */}
      <button
        onClick={onTuneBrand}
        className={`mt-4 flex w-full items-center gap-3 rounded-xl border border-[#1E2028] px-4 py-3 text-left transition-colors hover:border-[#2E3140] hover:bg-[#14151B] ${FOCUS}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Sliders className="h-4 w-4 text-white" strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-display text-[13px] font-bold text-white">Tune your Brand</span>
          <span className="mt-0.5 block text-[12px] text-[#9CA0A8]">
            Niche, audience, and style memory, so Elion writes in your voice.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-[#3B82F6]">
          Open Brand
          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </span>
      </button>
    </div>
  );
}

function HomeView({
  phase,
  onGenerate,
  onEdit,
  onTuneBrand,
}: {
  phase: Phase;
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onTuneBrand: () => void;
}) {
  if (phase === 'empty') return <EmptyView onGenerate={onGenerate} onTuneBrand={onTuneBrand} />;
  if (phase === 'loading') return <LoadingView />;
  return <ReadyView onGenerate={onGenerate} onEdit={onEdit} onTuneBrand={onTuneBrand} />;
}

/* Library: the Pinterest background pool for the project's niche. Search,
   pull new, pick. Selection is a tiny solid mark (a data mark, like the
   usage meter), everything else stays translucent glass. */
function LibraryView() {
  const [picked, setPicked] = useState<number | null>(null);
  const filters = ['All', 'Dark moody', 'Cozy', 'Bold text'];
  const [filter, setFilter] = useState('All');

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">
          Library
        </h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">
          Backgrounds pulled from Pinterest for your niche. Pick one for any slide.
        </p>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F646B]" strokeWidth={1.5} />
          <input
            placeholder="Search Pinterest for backgrounds..."
            className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] py-2.5 pl-9 pr-3.5 text-[13px] text-white outline-none placeholder:text-[#7C838C] focus:border-[#52525B]"
          />
        </div>
        <MintButton icon={Plus} className="shrink-0">
          Pull new
        </MintButton>
      </div>

      <div className="mb-5 flex gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
              filter === f
                ? 'bg-[#3B82F6]/20 text-white'
                : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
            } ${FOCUS}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => i).map((i) => {
          const isPicked = picked === i;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`group relative aspect-[9/16] overflow-hidden rounded-xl border transition-colors ${
                isPicked ? 'border-[#3B82F6]/60' : 'border-[#1E2028] hover:border-[#2E3140]'
              } ${FOCUS}`}
            >
              <img src={BG(`lib-${i}`)} alt="" className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
              {isPicked && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] text-white">
                  <Check className="h-3 w-3" strokeWidth={1.5} />
                </span>
              )}
              <span className="absolute inset-x-2 bottom-2 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                Use on slide
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BrandView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">
          Brand Voice
        </h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">
          Your niche, audience, and style memory. Elion writes every slideshow in this voice.
        </p>
      </header>

      <section className="rounded-xl border border-[#1E2028] p-6">
        <p className="mb-4 font-display text-[13px] font-bold text-white">Your brand</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Niche" value="Self-improvement" />
          <Field label="App name" value="Daily Grind" />
          <Field label="Audience" value="Men 18–34 on TikTok" />
          <Field label="App description" value="Daily motivation for people building discipline" />
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-[#1E2028] p-6">
        <p className="mb-4 font-display text-[13px] font-bold text-white">Style memory</p>
        <div className="whitespace-pre-line rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-4 py-3.5 text-[13px] leading-relaxed text-[#E5E7EB]">
          {'Short punchy lines.\nDark moody photo backgrounds.\nNo emojis. End every slide with a question.'}
        </div>
      </section>
    </div>
  );
}

function BillingView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">
          Simple. Just the two plans.
        </h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">You're on the free plan.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Free. Hairline only: the Current chip carries the state. */}
        <section className="rounded-xl border border-[#1E2028] p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-white">Free</h3>
            <span className="rounded-full bg-[#3B82F6]/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
              Current
            </span>
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$0</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For trying it out.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#D1D5DB]">
            {[
              ['3 lifetime slideshows', '2 of 3 used'],
              ['Elion watermark on exports'],
              ['1080×1920 backgrounds + copy'],
            ].map(([row, right]) => (
              <li key={row} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                  {row}
                </span>
                {right && (
                  <span className="shrink-0 rounded-full border border-[#262834] px-2 py-0.5 text-[11px] font-bold text-[#9CA0A8]">
                    {right}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Pro. The blue hairline marks the paid tier; the price leads. */}
        <section className="rounded-xl border border-[#3B82F6]/40 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-white">Pro</h3>
            <span className="rounded-full border border-[#262834] px-2.5 py-0.5 text-[11px] font-bold text-[#9CA0A8]">
              or $99/yr
            </span>
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$19/mo</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For creators posting every week.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#E5E7EB]">
            {['100 slideshows a month', 'No watermark', 'Multiple brand projects'].map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                {row}
              </li>
            ))}
          </ul>
          <MintButton className="mt-5 w-full">
            Upgrade to Pro
          </MintButton>
        </section>
      </div>
    </div>
  );
}

/* --------------------------- Generate modal ------------------------ */

function GenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: () => void }) {
  const [count, setCount] = useState(3);
  const options = [1, 3, 5, 10];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-[#22242D] bg-[#08080A] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[17px] font-bold tracking-[-0.01em] text-white">Generate slideshow</h2>
            <p className="mt-1 text-[12.5px] text-[#9CA0A8]">From your Brand: Daily Grind · Self-improvement.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#8E8E93] transition-colors hover:text-white">
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Idea (optional)</span>
          <input
            placeholder="e.g. Money habits of disciplined people"
            className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white outline-none placeholder:text-[#7C838C] focus:border-[#52525B]"
          />
        </label>
        <p className="mt-1.5 text-[12px] text-[#8E8E93]">Leave empty to generate from your Brand.</p>

        <div className="mt-4">
          <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">How many?</span>
          <div className="flex gap-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setCount(o)}
                aria-pressed={count === o}
                className={`flex h-8 w-10 items-center justify-center rounded-lg font-num text-[13px] font-bold transition-colors ${
                  count === o
                    ? 'bg-[#3B82F6]/20 text-white'
                    : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                } ${FOCUS}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11.5px] font-medium text-[#8E8E93]">
          Backgrounds are pulled from Pinterest to match each slide.{' '}
          {count > 3 ? (
            <span className="font-semibold text-[#F4877E]">That is more than your 3 free slideshows.</span>
          ) : (
            <>This uses {count} of your 3 free slideshows.</>
          )}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <QuietButton onClick={onClose} className="px-4 py-2">
            Cancel
          </QuietButton>
          <MintButton onClick={onGenerate} className="px-4 py-2 text-[12.5px]">
            Generate
          </MintButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Editor modal -------------------------- */

function EditorModal({
  slideshow,
  initialTab,
  onClose,
  onBrowseLibrary,
}: {
  slideshow: SlideItem;
  initialTab: EditorTab;
  onClose: () => void;
  onBrowseLibrary: () => void;
}) {
  const [tab, setTab] = useState<EditorTab>(initialTab);
  const [index, setIndex] = useState(0);
  const [bgOverride, setBgOverride] = useState<number | null>(null);
  const total = slideshow.slides.length;

  const tabs: { key: EditorTab; label: string }[] = [
    { key: 'post', label: 'Post' },
    { key: 'slides', label: 'Slides' },
    { key: 'export', label: 'Export' },
  ];

  const inputCls = 'w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#52525B]';
  const textareaCls = 'w-full resize-none rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-3 text-[13px] leading-relaxed text-white outline-none focus:border-[#52525B]';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#22242D] bg-[#08080A] text-white shadow-2xl sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview side: the real background image with the slide text. */}
        <div className="flex flex-col items-center justify-center gap-4 border-[#1F2026] bg-[#08080A] p-6 sm:w-80 sm:border-r">
          <div className="relative aspect-[9/16] w-44 overflow-hidden rounded-lg sm:w-52">
            <img
              src={BG(`${slideshow.seed}-${bgOverride ?? index}`)}
              alt={`Slide ${index + 1} background`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center font-num text-[10px] font-bold text-white/90 drop-shadow">
              {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white transition-colors hover:bg-[#282B33] disabled:cursor-not-allowed disabled:border-[#1C1E26] disabled:bg-[#121317] disabled:text-[#3A3F47] disabled:hover:bg-[#121317]"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <div className="flex gap-1.5">
              {slideshow.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${FOCUS} ${i === index ? 'w-5' : 'w-1.5 bg-[#3A3F47]'}`}
                  style={i === index ? { backgroundColor: '#FFFFFF' } : undefined}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              aria-label="Next slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white transition-colors hover:bg-[#282B33] disabled:cursor-not-allowed disabled:border-[#1C1E26] disabled:bg-[#121317] disabled:text-[#3A3F47] disabled:hover:bg-[#121317]"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <span className="font-num text-[11px] text-[#8E8E93]">
            {index + 1} / {total}
          </span>
        </div>

        {/* Editor side */}
        <div className="flex min-w-0 w-full flex-col sm:w-96">
          <div className="flex items-center justify-between border-b border-[#1F2026] px-4 py-3">
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    tab === t.key ? 'bg-[#3B82F6]/20 text-white' : 'text-[#8E8E93] hover:text-white'
                  } ${FOCUS}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[#8E8E93] transition-colors hover:text-white">
              <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            {tab === 'post' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Caption</span>
                  <textarea rows={5} defaultValue={slideshow.caption} className={textareaCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Hashtags</span>
                  <input defaultValue={slideshow.hashtags.map((t) => `#${t}`).join(' ')} className={inputCls} />
                </label>
              </>
            )}

            {tab === 'slides' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#9CA0A8]">Slide {index + 1} text</span>
                  <button className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E8E93] transition-colors hover:text-[#F4877E] ${FOCUS}`}>
                    <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                    Delete slide
                  </button>
                </div>
                <textarea key={index} rows={4} defaultValue={slideshow.slides[index]} className={textareaCls} />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#9CA0A8]">Background</span>
                    <div className="flex items-center gap-2">
                      <button className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E8E93] transition-colors hover:text-white ${FOCUS}`}>
                        <Shuffle className="h-3 w-3" strokeWidth={1.5} />
                        Shuffle all
                      </button>
                      <button
                        onClick={onBrowseLibrary}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
                      >
                        <Images className="h-3 w-3" strokeWidth={1.5} />
                        Browse Library
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                      <button
                        key={i}
                        onClick={() => setBgOverride(i)}
                        aria-label={`Background ${i + 1}`}
                        className={`relative aspect-[9/16] overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5 ${
                          bgOverride === i ? 'ring-2 ring-[#3B82F6]' : ''
                        }`}
                      >
                        <img src={BG(`pick-${i}`)} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[#8E8E93]">
                    Backgrounds come from your Library. Shuffle picks another from the pool.
                  </p>
                </div>
              </>
            )}

            {tab === 'export' && (
              <>
                <p className="text-[12px] leading-relaxed text-[#9CA0A8]">
                  Download the background images, then add text inside TikTok with the native font.
                  The free plan adds a small Elion watermark.
                </p>
                <div className="space-y-1.5">
                  {slideshow.slides.map((text, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-[#1F212B] bg-[#08080A] p-2.5">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/20 font-num text-[11px] font-bold text-white"
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-[#E5E7EB]">{text}</span>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}>
                        <Copy className="h-3 w-3" strokeWidth={1.5} />
                        Copy
                      </button>
                      <button className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}>
                        <Download className="h-3 w-3" strokeWidth={1.5} />
                        Image
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <MintButton icon={Download} className="px-4 py-2 text-[12px]">
                    Download all
                  </MintButton>
                  <QuietButton icon={Copy} className="px-4 py-2 text-[12px]">
                    Copy all text
                  </QuietButton>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[#1F2026] px-4 py-3">
            <QuietButton onClick={onClose} className="px-4 py-2">
              Cancel
            </QuietButton>
            {tab === 'export' ? (
              <MintButton icon={Check} onClick={onClose} className="px-4 py-2 text-[12.5px]">
                Done
              </MintButton>
            ) : (
              <MintButton icon={Check} className="px-4 py-2 text-[12.5px]">
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

/* Mockup control: lets the reviewer step through the real flow. This is
   a design-review tool, not product UI: it disappears in the build. */
function DemoBar({ phase, setPhase }: { phase: Phase; setPhase: (p: Phase) => void }) {
  const steps: { key: Phase; label: string }[] = [
    { key: 'empty', label: '1 New account' },
    { key: 'loading', label: '2 Generating' },
    { key: 'ready', label: '3 Generated' },
  ];
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[#16171D] bg-[#08080A] px-4 py-2">
      <span className="text-[11px] font-semibold text-[#6E737B]">Mockup flow</span>
      <div className="flex gap-1.5">
        {steps.map((s) => (
          <button
            key={s.key}
            onClick={() => setPhase(s.key)}
            aria-pressed={phase === s.key}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              phase === s.key ? 'bg-[#3B82F6]/20 text-white' : 'text-[#8E8E93] hover:text-white'
            } ${FOCUS}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <span className="ml-auto text-[11px] text-[#6E737B]">
        Gradients are gone: empty state, skeleton loader, then real images.
      </span>
    </div>
  );
}

function Synthover() {
  const [view, setView] = useState<View>('home');
  const [phase, setPhase] = useState<Phase>('empty');
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState<{ i: number; tab: EditorTab } | null>(null);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setTimeout(() => setPhase('ready'), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#08080A] text-[#E5E7EB]">
      <DemoBar phase={phase} setPhase={setPhase} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          active={view}
          onSelect={setView}
          onGenerate={() => setGenerating(true)}
          used={phase === 'ready' ? 2 : 0}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {view === 'home' && (
            <HomeView
              phase={phase}
              onGenerate={() => setGenerating(true)}
              onEdit={(i, tab) => setEditing({ i, tab })}
              onTuneBrand={() => setView('brand')}
            />
          )}
          {view === 'library' && <LibraryView />}
          {view === 'brand' && <BrandView />}
          {view === 'billing' && <BillingView />}
        </main>
      </div>

      {generating && (
        <GenerateModal
          onClose={() => setGenerating(false)}
          onGenerate={() => {
            setGenerating(false);
            setPhase('loading');
          }}
        />
      )}
      {editing && SLIDESHOWS[editing.i] && (
        <EditorModal
          slideshow={SLIDESHOWS[editing.i]}
          initialTab={editing.tab}
          onClose={() => setEditing(null)}
          onBrowseLibrary={() => {
            setEditing(null);
            setView('library');
          }}
        />
      )}
    </div>
  );
}

/* -------------------------- Preview (card) -------------------------- */

function PreviewSynthover() {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#08080A]">
      <div className="flex h-full">
        {/* mini sidebar */}
        <div className="flex w-[64px] shrink-0 flex-col border-r border-[#16171D] bg-[#08080A] px-2 py-2.5">
          <img src={elionLogo} alt="Elion" className="h-3 w-auto" />
          <div className="mt-2.5 flex flex-col gap-1">
            {(
              [
                [Home, true],
                [Images, false],
                [BookOpen, false],
                [Wallet, false],
              ] as [LucideIcon, boolean][]
            ).map(([IconCmp, active], k) => (
              <span
                key={k}
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-[#3B82F6]/20 text-white' : 'text-[#6E737B]'}`}
              >
                <IconCmp className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            ))}
          </div>
          <span className="mt-auto flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#181920] text-[7px] font-bold text-white">
            AC
          </span>
        </div>

        {/* mini main */}
        <div className="flex min-w-0 flex-1 flex-col p-3">
          <p className="font-display text-[12px] font-bold leading-tight text-white">Good morning</p>
          <p className="mt-0.5 text-[8px] text-[#8E8E93]">Let's create your first slideshow.</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-[9px] font-bold text-white">Your slideshows</p>
            <span className="inline-flex items-center rounded-full bg-[#3B82F6]/20 px-2 py-0.5 text-[7px] font-bold text-white">
              Generate
            </span>
          </div>

          {SLIDESHOWS.slice(0, 2).map((s) => (
            <div key={s.title} className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#1E2028] bg-[#121317] p-2">
              <SlideThumb image={BG(`${s.seed}-0`)} index={1} className="w-6" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[8.5px] font-bold text-white">{s.title}</p>
                <p className="truncate text-[7px] text-[#8E8E93]">{s.hook}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Page() {
  return <Synthover />;
}

export function Preview() {
  return <PreviewSynthover />;
}

import { useState } from 'react';
import {
  Sliders,
  LayoutGrid,
  CreditCard,
  LogOut,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Shuffle,
  X,
  Plus,
  HelpCircle,
  Sun,
  MoreHorizontal,
  Grid,
  List,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Synth: Deep Matte Black Editorial Studio.                          */
/* Pure deep pitch blacks (#090A0C / #0D0D0E), outlined cards         */
/* border border-[#1E2028], transparent/outline sidebar promo box,    */
/* subtle dark violet active nav pill, and clean warm gradient text   */
/* matching reference strictly.                                       */
/*                                                                     */
/* Clean-room rules:                                                   */
/* - Wordmark "Elion" only; no invented logo mark.                     */
/* - Fonts: Onest Variable (font-display), Inter Tight (font-sans),    */
/*   JetBrains Mono (font-mono).                                       */
/* - No em dashes in any user-facing copy.                             */
/* - Slideshows / slides terminology only.                             */
/* ------------------------------------------------------------------ */

type View = 'home' | 'brand' | 'billing';
type EditorTab = 'post' | 'slides' | 'export';

type Tone = { from: string; to: string };

type SlideItem = {
  title: string;
  date: string;
  status: 'Draft' | 'Ready' | 'Exported';
  count: number;
  time: string;
  tones: number[];
  hook: string;
  caption: string;
  hashtags: string[];
  slides: string[];
};

const SLIDESHOWS: SlideItem[] = [
  {
    title: "Coaching Infopreneurs",
    date: '12/2/2024, 11:35AM',
    status: 'Ready',
    count: 8,
    time: 'Today, 1:32pm',
    tones: [0, 2, 0],
    hook: "You're not lazy. Your brain is just on airplane mode.",
    caption:
      "If you've ever called yourself lazy, read this. You're not the problem. Your system is. Five signs that what feels like laziness is actually your brain asking for something different.",
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
    title: 'Marketing & UI/UX DP',
    date: '12/2/2024, 11:35AM',
    status: 'Draft',
    count: 9,
    time: 'Today, 1:32pm',
    tones: [1, 3, 0],
    hook: 'Rich people do these 4 things before 9am.',
    caption:
      "Discipline isn't about willpower. It's about systems. The money habits disciplined people actually follow, in one post.",
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
    title: 'Untitled Product',
    date: '12/2/2024, 11:35AM',
    status: 'Draft',
    count: 6,
    time: 'Today, 1:32pm',
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
      'Your brain adapts in about 21 days.',
    ],
  },
  {
    title: 'Building Digital Product',
    date: '12/2/2024, 11:35AM',
    status: 'Exported',
    count: 8,
    time: 'Today, 1:32pm',
    tones: [0, 1, 2],
    hook: 'How to structure a digital product in 2025.',
    caption:
      'Designing clean products requires eliminating useless chrome. Here is the framework for modern digital creators.',
    hashtags: ['design', 'products', 'buildinpublic'],
    slides: [
      'How to structure a digital product.',
      'Step 1: Focus on the core value path.',
      'Step 2: Strip away decorative noise.',
      'Step 3: Make actions obvious.',
      'Step 4: Optimize for speed.',
      'Step 5: Iterate with real feedback.',
    ],
  },
];

const GRADIENTS: Tone[] = [
  { from: '#13141F', to: '#252636' },
  { from: '#151926', to: '#242F42' },
  { from: '#1A1824', to: '#322842' },
  { from: '#141E1C', to: '#203630' },
];

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/* ------------------------------ Sidebar ---------------------------- */

function Sidebar({
  active,
  onSelect,
  onGenerate,
}: {
  active: View;
  onSelect: (v: View) => void;
  onGenerate: () => void;
}) {
  const navItems: { key: View; label: string; icon: LucideIcon }[] = [
    { key: 'home', label: 'Dashboard', icon: LayoutGrid },
    { key: 'brand', label: 'Brand Voice', icon: Sliders },
    { key: 'billing', label: 'Plan & Billing', icon: CreditCard },
  ];

  return (
    <aside className="flex w-[240px] shrink-0 flex-col bg-[#08080A] border-r border-[#16171D]">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[#08080A] font-bold text-xs">
          E
        </div>
        <span className="font-display text-[15px] font-bold tracking-tight text-white">Elion</span>
      </div>

      {/* Primary Action Button */}
      <div className="px-3 py-1">
        <button
          onClick={onGenerate}
          className={`flex w-full items-center gap-2 rounded-lg bg-transparent px-3 py-2 text-xs font-semibold text-[#D1D5DB] transition-colors hover:bg-[#14151B] hover:text-white ${FOCUS}`}
        >
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map(({ key, label, icon: IconCmp }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left transition-colors ${
                isActive
                  ? 'bg-[#1A162B] text-[#D8B4FE] font-semibold'
                  : 'text-[#8E8E93] hover:bg-[#131419] hover:text-white font-medium'
              } ${FOCUS}`}
            >
              <IconCmp className={`h-[16px] w-[16px] shrink-0 ${isActive ? 'text-[#C084FC]' : 'text-[#68686E]'}`} />
              <span className="text-[13px]">{label}</span>
            </button>
          );
        })}

        {/* Secondary Links */}
        <div className="pt-4 mt-4 border-t border-[#16171D] space-y-1">
          <button className={`flex h-8 w-full items-center gap-3 rounded-lg px-3 text-left text-[#71717A] hover:bg-[#131419] hover:text-white text-[12.5px] font-medium transition-colors ${FOCUS}`}>
            <HelpCircle className="h-3.5 w-3.5 text-[#52525B]" />
            <span>Assistance</span>
          </button>
          <button className={`flex h-8 w-full items-center gap-3 rounded-lg px-3 text-left text-[#71717A] hover:bg-[#131419] hover:text-white text-[12.5px] font-medium transition-colors ${FOCUS}`}>
            <Sun className="h-3.5 w-3.5 text-[#52525B]" />
            <span>Theme</span>
          </button>
        </div>
      </nav>

      {/* Reference-Matched Outlined Card at Sidebar Bottom */}
      <div className="p-3">
        <div className="rounded-xl border border-[#20222B] bg-transparent p-3.5">
          <p className="text-[12px] font-bold text-white">Powered by Elion Pro</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#8E8E93]">
            Your Elion account is synced with active brand memory, giving you full access for managing and scaling your slideshows.
          </p>
          <button
            onClick={() => onSelect('billing')}
            className="mt-3.5 w-full rounded-lg border border-[#2D303E] bg-transparent py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/5"
          >
            Upgrade Plan
          </button>
        </div>

        {/* User Account */}
        <div className="mt-3 flex items-center justify-between px-1 pt-2.5 border-t border-[#16171D]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#181920] text-[10px] font-bold text-white border border-[#262834]">
              AC
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-semibold text-white">Alex Carter</p>
              <p className="truncate text-[10px] text-[#68686E]">alex@dailygrind.com</p>
            </div>
          </div>
          <button aria-label="Sign out" className="text-[#68686E] hover:text-white p-1 rounded-md hover:bg-[#131419]">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Views ------------------------------ */

function HomeView({
  onGenerate,
  onEdit,
}: {
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
}) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      {/* Page Header / Layout toggle icon */}
      <div className="mb-6 flex items-center gap-2">
        <button aria-label="Toggle layout sidebar" className="text-[#68686E] hover:text-white">
          <div className="h-4 w-4 border border-[#52525B] rounded-sm flex">
            <div className="w-1/3 border-r border-[#52525B]" />
          </div>
        </button>
      </div>

      {/* Reference Hero Banner */}
      <section className="mb-10 text-center py-6">
        <h1 className="font-display text-[28px] font-bold tracking-tight text-white">
          Let's Create Your{' '}
          <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF4D00] bg-clip-text text-transparent">
            Slideshow
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#8E8E93]">
          Elion is here to guide you in creating and refining slideshows that stand out. Let's get started by setting up your first product or exploring your recent projects.
        </p>
        <div className="mt-5 flex justify-center">
          <button
            onClick={onGenerate}
            className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#08080A] transition-transform hover:scale-[1.02] active:scale-[0.98] ${FOCUS}`}
          >
            <Plus className="h-3.5 w-3.5" />
            Start New Slideshow
          </button>
        </div>
      </section>

      {/* History Header with controls */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-[16px] font-bold text-white">History</h2>
        <div className="flex items-center gap-3">
          {/* Pagination controls */}
          <div className="flex items-center gap-1 text-[#68686E]">
            <button className="p-1 hover:text-white"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <button className="p-1 hover:text-white"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
          {/* View Toggle */}
          <div className="flex items-center rounded-lg bg-[#121318] p-0.5 border border-[#1E2028]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#22242D] text-white' : 'text-[#68686E] hover:text-white'}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#22242D] text-white' : 'text-[#68686E] hover:text-white'}`}
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Outlined Subtle History List (Reference-Matched) */}
      <div className="space-y-3">
        {SLIDESHOWS.map((s, i) => (
          <article
            key={s.title}
            onClick={() => onEdit(i, 'post')}
            className="group cursor-pointer rounded-xl border border-[#1E2028] bg-[#121317] p-4 transition-all hover:bg-[#16171D] hover:border-[#2E3140]"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[15px] font-bold text-white group-hover:text-white">
                  {s.title} ({s.date})
                </h3>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-[12px] text-[#71717A]">{s.time}</span>
                  <span className="text-[11px] text-[#52525B]">· {s.count} slides</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[11.5px] text-[#71717A]">Last Edited</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(i, 'post');
                  }}
                  aria-label="Options"
                  className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#22242D] hover:text-white transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BrandView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-6">
        <h1 className="font-display text-[22px] font-bold tracking-tight text-white">Brand Memory</h1>
        <p className="mt-1 text-xs text-[#8E8E93]">
          Your niche, audience, and style memory context. Elion applies these rules to all generations.
        </p>
      </header>

      <section className="rounded-xl border border-[#1E2028] bg-transparent p-5">
        <h2 className="mb-3 font-display text-[13px] font-bold text-white">Target Profile</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10.5px] font-medium text-[#71717A]">Niche</label>
            <div className="rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3 py-2 text-xs text-white">
              Self-improvement
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10.5px] font-medium text-[#71717A]">App Name</label>
            <div className="rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3 py-2 text-xs text-white">
              Daily Grind
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-[10.5px] font-medium text-[#71717A]">Audience</label>
            <div className="rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3 py-2 text-xs text-white">
              Men 18–34 on TikTok
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-[#1E2028] bg-transparent p-5">
        <h2 className="mb-3 font-display text-[13px] font-bold text-white">Style Memory</h2>
        <div className="whitespace-pre-line rounded-lg border border-[#1C1E26] bg-[#0C0D10] p-3 text-xs leading-relaxed text-[#D1D5DB]">
          {'Short punchy lines.\nDark moody background slides.\nNo emojis. End every slide with a question.'}
        </div>
      </section>
    </div>
  );
}

function BillingView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-6">
        <h1 className="font-display text-[22px] font-bold tracking-tight text-white">Plan & Billing</h1>
        <p className="mt-1 text-xs text-[#8E8E93]">Choose the plan that fits your posting schedule.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Free Plan */}
        <section className="rounded-xl border border-[#1E2028] bg-transparent p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-bold text-white">Free</h2>
            <span className="rounded-full bg-[#181920] px-2.5 py-0.5 text-[10px] font-bold text-[#8E8E93]">
              Current
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[#71717A]">For testing the workflow.</p>
          <ul className="mt-4 space-y-2 text-[12px] text-[#D1D5DB]">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              3 lifetime slideshows (2 used)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              Elion watermark on exports
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              1080×1920 background exports
            </li>
          </ul>
        </section>

        {/* Pro Plan */}
        <section className="rounded-xl border border-[#2E284D] bg-[#12101F]/40 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-bold text-white">Pro</h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">
              $9/month
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[#8E8E93]">For consistent creators.</p>
          <ul className="mt-4 space-y-2 text-[12px] text-white">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              300 slideshows every month
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              Watermark-free exports
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-white" />
              Full Brand memory retention
            </li>
          </ul>
          <button className={`mt-5 w-full rounded-full bg-white py-2 text-xs font-semibold text-[#08080A] transition-colors hover:bg-gray-100 ${FOCUS}`}>
            Upgrade to Pro
          </button>
        </section>
      </div>
    </div>
  );
}

/* --------------------------- Modals -------------------------------- */

function GenerateModal({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState(3);
  const options = [1, 3, 5, 10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-[#22242D] bg-[#08080A] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[16px] font-bold text-white">Generate Slideshow</h2>
            <p className="mt-0.5 text-[11.5px] text-[#71717A]">From Brand: Daily Grind · Self-improvement.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#68686E] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-[11px] font-medium text-[#8E8E93]">Topic or Idea (optional)</span>
          <input
            placeholder="e.g. 5 morning habits for focus"
            className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3 py-2 text-xs text-white outline-none placeholder:text-[#52525B] focus:border-[#52525B]"
          />
        </label>

        <div className="mt-3">
          <span className="mb-1 block text-[11px] font-medium text-[#8E8E93]">Quantity</span>
          <div className="flex gap-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setCount(o)}
                className={`flex h-8 w-10 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  count === o
                    ? 'bg-white text-[#08080A]'
                    : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#71717A] hover:text-white">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#08080A] hover:bg-gray-100"
          >
            Generate Now
          </button>
        </div>
      </div>
    </div>
  );
}

function EditorModal({
  slideshow,
  initialTab,
  onClose,
}: {
  slideshow: SlideItem;
  initialTab: EditorTab;
  onClose: () => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#22242D] bg-[#08080A] text-white shadow-2xl sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Slide Preview Pane */}
        <div className="flex flex-col items-center justify-center gap-4 border-[#1F2026] bg-[#08080A] p-6 sm:w-72 sm:border-r">
          <div
            className="relative aspect-[9/16] w-44 overflow-hidden rounded-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(135deg, ${GRADIENTS[slideshow.tones[index % slideshow.tones.length]].from}, ${GRADIENTS[slideshow.tones[index % slideshow.tones.length]].to})`,
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/80">
              {index + 1}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E2026] text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#8E8E93]">
              {index + 1} / {total}
            </span>
            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              aria-label="Next slide"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E2026] text-white disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Editor Tab Pane */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between border-b border-[#1F2026] px-4 py-3">
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    tab === t.key ? 'bg-white text-[#08080A]' : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[#68686E] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {tab === 'post' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[#8E8E93]">Caption</label>
                  <textarea
                    rows={4}
                    defaultValue={slideshow.caption}
                    className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] p-2.5 text-xs text-white outline-none focus:border-[#52525B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[#8E8E93]">Hashtags</label>
                  <input
                    defaultValue={slideshow.hashtags.map((h) => `#${h}`).join(' ')}
                    className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3 py-2 text-xs text-white outline-none focus:border-[#52525B]"
                  />
                </div>
              </div>
            )}

            {tab === 'slides' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[#8E8E93]">
                    Slide {index + 1} Text
                  </label>
                  <textarea
                    rows={4}
                    value={slideshow.slides[index] || ''}
                    readOnly
                    className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] p-2.5 text-xs text-white outline-none"
                  />
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2026] px-3 py-1 text-xs text-[#D1D5DB] hover:text-white">
                  <Shuffle className="h-3 w-3" />
                  Shuffle Gradient
                </button>
              </div>
            )}

            {tab === 'export' && (
              <div className="space-y-3">
                <div className="rounded-lg border border-[#1F212B] bg-[#08080A] p-4">
                  <p className="text-xs font-semibold text-white">Export 1080×1920 Backgrounds</p>
                  <p className="mt-0.5 text-[11px] text-[#71717A]">
                    Clean gradient PNG backgrounds ready for text placement in TikTok or Instagram.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#08080A] hover:bg-gray-100">
                      <Download className="h-3.5 w-3.5" />
                      Download Backgrounds
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full bg-[#1E2026] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#282B33]">
                      <Copy className="h-3.5 w-3.5" />
                      Copy Copyable Text
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-[#1F2026] px-4 py-2.5">
            <button onClick={onClose} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#08080A]">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Gallery Preview ---------------------------- */

export function Preview() {
  return (
    <div className="flex h-full w-full flex-col bg-[#08080A] p-3 text-white">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#C084FC]" />
        <span className="font-display text-xs font-bold">Synth Deep Dark</span>
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-lg border border-[#1F2026] bg-[#08080A] p-3">
        <div className="space-y-2">
          <div className="h-3 w-2/3 rounded bg-white/20" />
          <div className="h-2 w-1/3 rounded bg-white/10" />
        </div>
        <div className="flex h-7 w-full items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#08080A]">
          + Start New Slideshow
        </div>
      </div>
    </div>
  );
}

export function Page() {
  const [activeView, setActiveView] = useState<View>('home');
  const [showGenerate, setShowGenerate] = useState(false);
  const [editingItem, setEditingItem] = useState<{ index: number; tab: EditorTab } | null>(null);

  return (
    <div className="flex min-h-screen font-sans bg-[#08080A] text-[#E5E7EB]">
      <Sidebar active={activeView} onSelect={setActiveView} onGenerate={() => setShowGenerate(true)} />

      <main className="flex-1 overflow-y-auto">
        {activeView === 'home' && (
          <HomeView
            onGenerate={() => setShowGenerate(true)}
            onEdit={(i, tab) => setEditingItem({ index: i, tab })}
          />
        )}
        {activeView === 'brand' && <BrandView />}
        {activeView === 'billing' && <BillingView />}
      </main>

      {showGenerate && <GenerateModal onClose={() => setShowGenerate(false)} />}

      {editingItem !== null && (
        <EditorModal
          slideshow={SLIDESHOWS[editingItem.index]}
          initialTab={editingItem.tab}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

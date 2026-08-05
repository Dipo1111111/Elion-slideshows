/**
 * Prism — a completely different Elion UI.
 *
 * Design DNA: cinematic vertical cards, dramatic typography, purposeful motion.
 * Where Synthover is a quiet studio, Prism is a screening room.
 *
 * Differences from Synthover:
 *  - Sidebar: wider (280px), structured into zones (brand, nav, project, user)
 *  - Cards: vertical 9:16 image-forward (phone-screen ratio), not horizontal strips
 *  - Typography: dramatically larger display sizes, tighter hierarchy
 *  - Motion: every surface animates — page transitions, card entrances, hover lifts
 *  - Generate: slides up from bottom as a full-width panel, not a centered modal
 *  - Editor: slides in from the right as a docked panel
 *  - Empty state: cinematic, not just centered text
 *  - Loading: pulsing card outlines, not skeleton shimmer
 *
 * Brand constraints: black #08080A page, transparent containers + hairline border,
 * blue #3B82F6 accent, modals = only elevated layer. No amber, no purple, no navy.
 */

import { useState, useEffect } from 'react';
import {
  Home, Images, Sliders, CreditCard, Settings, LogOut, Plus, ArrowRight,
  X, Check, Search, Trash2, PenLine, Download, Copy, ChevronLeft,
  ChevronRight, Shuffle, Sparkles, Zap, Clock, LayoutGrid,
  ChevronDown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CSS ANIMATIONS — the biggest visual differentiator from Synthover.
   Synthover is static. Prism breathes.
   ═══════════════════════════════════════════════════════════════════ */

const ANIMATIONS = `
  @keyframes prism-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes prism-slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes prism-slideRight {
    from { opacity: 0; transform: translateX(24px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes prism-scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes prism-pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.15); }
  }
  @keyframes prism-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes prism-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes prism-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes prism-cardEnter {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes prism-panelSlide {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes prism-bottomSlide {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @keyframes prism-dotPulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    @keyframes prism-fadeIn { from { opacity: 1; } to { opacity: 1; } }
    @keyframes prism-slideUp { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
    @keyframes prism-slideRight { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
    @keyframes prism-scaleIn { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
    @keyframes prism-pulseGlow { from { box-shadow: none; } to { box-shadow: none; } }
    @keyframes prism-float { from { transform: none; } to { transform: none; } }
    @keyframes prism-cardEnter { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
    @keyframes prism-panelSlide { from { transform: none; } to { transform: none; } }
    @keyframes prism-bottomSlide { from { transform: none; } to { transform: none; } }
    @keyframes prism-dotPulse { from { opacity: 1; } to { opacity: 1; } }
  }
`;

/* ═══════════════════════════════════════════════════════════════════
   TYPES & DATA — same data shape as Synthover for compatibility.
   ═══════════════════════════════════════════════════════════════════ */

type View = 'home' | 'library' | 'brand' | 'billing';
type Phase = 'empty' | 'loading' | 'ready';
type EditorTab = 'post' | 'slides' | 'export';

type SlideItem = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  slides: string[];
  status: 'Draft' | 'Ready' | 'Exported';
  count: number;
  time: string;
  seed: number;
};

const SLIDESHOWS: SlideItem[] = [
  {
    title: 'Discipline beats motivation',
    hook: 'Motivation gets you started. Discipline keeps you going.',
    caption: 'Every successful person stopped waiting for the "right mood." They built systems instead. Here is how you can too.',
    hashtags: ['discipline', 'selfimprovement', 'mindset', 'grindset', 'dailygrind'],
    slides: [
      'Motivation is a feeling. Feelings fade.',
      'Discipline is a system. Systems compound.',
      'Wake up at the same time every day.',
      'Do the hard thing first.',
      'Track your streaks. Never break the chain.',
      'Who you become matters more than what you achieve.',
    ],
    status: 'Ready',
    count: 6,
    time: '2 min ago',
    seed: 42,
  },
  {
    title: 'Money habits of the rich',
    hook: 'The rich do not earn more. They waste less.',
    caption: 'Small daily habits separate those who build wealth from those who stay stuck.',
    hashtags: ['money', 'wealth', 'habits', 'finance', 'dailygrind'],
    slides: [
      'Track every dollar for 30 days.',
      'Automate savings before you see the money.',
      'Invest early, invest consistently.',
      'Avoid lifestyle inflation like a disease.',
      'Build multiple income streams.',
    ],
    status: 'Draft',
    count: 5,
    time: '1 hour ago',
    seed: 17,
  },
  {
    title: 'Morning routine for winners',
    hook: 'Your morning sets the tone for everything that follows.',
    caption: 'The first 90 minutes of your day determine the other 14.5 hours.',
    hashtags: ['morning', 'routine', 'productivity', 'success', 'dailygrind'],
    slides: [
      'Wake before the world does.',
      'Move your body for 20 minutes.',
      'Cold water. No negotiation.',
      'Journal: one page, raw thoughts.',
      'Plan the day in 3 priorities, not 30.',
      'Execute the hardest task before noon.',
    ],
    status: 'Ready',
    count: 6,
    time: '3 hours ago',
    seed: 8,
  },
  {
    title: 'Stop scrolling, start building',
    hook: 'You will never scroll your way to a better life.',
    caption: 'Every hour on your phone is an hour someone else is building what you want.',
    hashtags: ['focus', 'discipline', 'building', 'selfimprovement', 'dailygrind'],
    slides: [
      'Your phone is the enemy of progress.',
      'Set 3 screen-time boundaries today.',
      'Replace scrolling with creating.',
      'Boredom is where ideas live.',
      'Protect your attention like your life depends on it.',
    ],
    status: 'Exported',
    count: 5,
    time: 'Yesterday',
    seed: 33,
  },
];

/* Picsum-based backgrounds for mockup (matches Synthover's approach). */
function bg(seed: string | number) {
  return `https://picsum.photos/seed/${seed}/400/711`;
}

/* ═══════════════════════════════════════════════════════════════════
   FOCUS RING — shared focus-visible style.
   ═══════════════════════════════════════════════════════════════════ */

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080A]';

/* ═══════════════════════════════════════════════════════════════════
   PRIMITIVES — completely different visual treatment from Synthover.
   Synthover: glass fills, hairline borders, subtle.
   Prism: solid accents, bolder contrasts, more presence.
   ═══════════════════════════════════════════════════════════════════ */

/** Primary CTA. Synthover's MintButton is glass; Prism's is solid blue. */
function ActionButton({
  children,
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-200';
  const styles =
    variant === 'primary'
      ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-[0.97] shadow-lg shadow-[#3B82F6]/20'
      : 'bg-transparent text-[#9CA3AF] hover:text-white hover:bg-white/5 active:scale-[0.97]';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className} ${FOCUS}`}
    >
      {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
      {children}
    </button>
  );
}

/** Ghost button for secondary actions. */
function GhostButton({
  children,
  icon: Icon,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#9CA3AF] transition-all duration-200 hover:text-white hover:bg-white/5 active:scale-[0.97] ${className} ${FOCUS}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />}
      {children}
    </button>
  );
}

/** Status pill. Synthover uses translucent glass; Prism uses solid bg. */
function StatusChip({ status }: { status: SlideItem['status'] }) {
  const map = {
    Draft: 'bg-white/10 text-[#9CA3AF]',
    Ready: 'bg-[#3B82F6]/20 text-[#60A5FA]',
    Exported: 'bg-emerald-500/15 text-emerald-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${map[status]}`}>
      {status === 'Ready' && <Zap className="h-3 w-3" strokeWidth={1.5} />}
      {status === 'Exported' && <Check className="h-3 w-3" strokeWidth={1.5} />}
      {status}
    </span>
  );
}

/** Text input. Synthover uses dark bg + hairline; Prism uses darker inset. */
function Field({
  label,
  value,
  placeholder,
  multiline = false,
  rows = 1,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const cls =
    'w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-[#6B7280] focus:border-[#3B82F6]/40 focus:bg-white/[0.05]';
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#9CA3AF]">{label}</span>
      {multiline ? (
        <textarea rows={rows} defaultValue={value} placeholder={placeholder} className={`${cls} resize-none leading-relaxed`} />
      ) : (
        <input defaultValue={value} placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}

/** Shimmer placeholder. Prism uses a different shimmer style — gradient sweep. */
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white/[0.04] ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'prism-shimmer 1.8s ease-in-out infinite',
      }}
    />
  );
}

/** Slide thumbnail — vertical 9:16 ratio. Synthover uses small w-12 thumbs;
    Prism uses larger, more prominent thumbnails. */
function SlideThumb({
  image,
  index,
  className = '',
}: {
  image: string;
  index: number;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[9/16] overflow-hidden rounded-lg ${className}`}>
      <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute bottom-1 left-1 font-num text-[9px] font-bold text-white/80">{index}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR — completely different structure from Synthover.
   Synthover: narrow (240px), flat nav, pinned bottom.
   Prism: wider (280px), zoned (brand / nav / project / user),
   with a subtle blue glow on the active item.
   ═══════════════════════════════════════════════════════════════════ */

const NAV_ITEMS: { key: View; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'library', label: 'Library', icon: Images },
  { key: 'brand', label: 'Brand', icon: Sliders },
  { key: 'billing', label: 'Billing', icon: CreditCard },
];

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
  return (
    <aside
      className="flex h-full w-[280px] shrink-0 flex-col border-r border-white/[0.06] bg-[#08080A]"
      style={{ animation: 'prism-fadeIn 0.4s ease-out' }}
    >
      {/* Brand zone — the Elion wordmark, bigger and bolder than Synthover */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/15">
          <Sparkles className="h-4.5 w-4.5 text-[#3B82F6]" strokeWidth={1.5} />
        </span>
        <div>
          <p className="font-display text-[15px] font-bold tracking-[-0.01em] text-white">Elion</p>
          <p className="text-[11px] text-[#6B7280]">AI slideshow generator</p>
        </div>
      </div>

      {/* Generate CTA — top of sidebar, prominent. Synthover's is a small
          button; Prism's is a full-width glowing CTA. */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onGenerate}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#2563EB] active:scale-[0.97] shadow-lg shadow-[#3B82F6]/25 ${FOCUS}`}
          style={{ animation: 'prism-pulseGlow 3s ease-in-out infinite' }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Generate slideshow
        </button>
      </div>

      {/* Primary nav — icons + labels, with a blue glow on active */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {NAV_ITEMS.map(({ key, label, icon: IconCmp }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#3B82F6]/10 text-[#60A5FA] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]'
                  : 'text-[#6B7280] hover:text-[#D1D5DB] hover:bg-white/[0.03]'
              } ${FOCUS}`}
            >
              <IconCmp
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  isActive ? 'text-[#3B82F6]' : 'text-[#4B5563] group-hover:text-[#9CA3AF]'
                }`}
                strokeWidth={1.5}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Project context — Synthover doesn't have this; it's a Prism addition
          showing the active project's niche. */}
      <div className="mx-3 mb-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#6B7280]">Active project</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.05]">
            <ChevronDown className="h-3 w-3 text-[#6B7280]" strokeWidth={1.5} />
          </span>
        </div>
        <p className="mt-2 text-[12px] font-semibold text-white">Daily Grind</p>
        <p className="mt-0.5 text-[11px] text-[#6B7280]">Self-improvement</p>
      </div>

      {/* Pinned bottom zone: usage + settings + account */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        {/* Usage meter — Synthover shows "2 of 3 used"; Prism shows a progress ring. */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="relative h-10 w-10 shrink-0">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16" fill="none" stroke="#3B82F6" strokeWidth="3"
                strokeDasharray={`${(used / 3) * 100.53} 100.53`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-num text-[11px] font-bold text-white">
              {used}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-white">{used} of 3 free</p>
            <p className="text-[11px] text-[#6B7280]">slideshows used</p>
          </div>
        </div>

        {/* Settings + Sign out */}
        <div className="mt-2 space-y-0.5">
          <button className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-[#6B7280] transition-colors hover:text-[#D1D5DB] hover:bg-white/[0.03] ${FOCUS}`}>
            <Settings className="h-4 w-4 text-[#4B5563]" strokeWidth={1.5} />
            Settings
          </button>
          <button className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-[#6B7280] transition-colors hover:text-[#D1D5DB] hover:bg-white/[0.03] ${FOCUS}`}>
            <LogOut className="h-4 w-4 text-[#4B5563]" strokeWidth={1.5} />
            Sign out
          </button>
        </div>

        {/* Account — Synthover shows initials; Prism shows the same but with
            a blue ring border for more personality. */}
        <div className="mt-2.5 flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[11px] font-bold text-[#60A5FA]">
            AC
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12px] font-semibold text-white">Alex Carter</p>
            <p className="truncate text-[11px] text-[#6B7280]">alex@dailygrind.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOME VIEWS — completely different layout from Synthover.
   Synthover: greeting + card grid (horizontal cards, image strip left).
   Prism: hero greeting + vertical image-forward cards in a responsive grid.
   ═══════════════════════════════════════════════════════════════════ */

function EmptyHome({
  onGenerate,
  onBrand,
}: {
  onGenerate: () => void;
  onBrand: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[960px] px-8 py-10">
      {/* Cinematic empty state — Synthover has a simple centered message;
          Prism has a full-width hero with floating animation. */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#08080A] via-[#0B0D14] to-[#08080A] px-8 py-20 text-center"
        style={{ animation: 'prism-fadeIn 0.6s ease-out' }}
      >
        {/* Subtle blue glow in the background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/[0.04] blur-[80px]" />
        </div>

        <div className="relative" style={{ animation: 'prism-float 4s ease-in-out infinite' }}>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B82F6]/10">
            <Images className="h-7 w-7 text-[#3B82F6]" strokeWidth={1.5} />
          </span>
        </div>

        <h2
          className="relative mt-6 font-display text-[24px] font-bold tracking-[-0.02em] text-white"
          style={{ animation: 'prism-slideUp 0.6s ease-out 0.1s both', textWrap: 'balance' }}
        >
          No slideshows yet
        </h2>
        <p
          className="relative mx-auto mt-3 max-w-[420px] text-[14px] leading-relaxed text-[#9CA3AF]"
          style={{ animation: 'prism-slideUp 0.6s ease-out 0.2s both', textWrap: 'pretty' }}
        >
          Elion writes the script, pulls backgrounds from Pinterest, and gives you
          ready-to-post slides. Your first one takes about a minute.
        </p>

        <div
          className="relative mt-8 flex items-center justify-center gap-3"
          style={{ animation: 'prism-slideUp 0.6s ease-out 0.3s both' }}
        >
          <ActionButton icon={Plus} onClick={onGenerate}>
            Generate your first slideshow
          </ActionButton>
        </div>

        <button
          onClick={onBrand}
          className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          style={{ animation: 'prism-slideUp 0.6s ease-out 0.35s both' }}
        >
          Set up your Brand first
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function LoadingHome() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-8 py-10">
      <header className="mb-8" style={{ animation: 'prism-fadeIn 0.4s ease-out' }}>
        <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.03em] text-white">
          Good morning
        </h1>
        <p className="mt-2 text-[14px] text-[#9CA3AF]">
          Scraping Pinterest, writing scripts, rendering previews. About a minute.
        </p>
      </header>

      {/* Loading cards — Synthover uses skeleton cards with shimmer;
          Prism uses pulsing card outlines for a different feel. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01]"
            style={{ animation: `prism-cardEnter 0.5s ease-out ${k * 0.1}s both` }}
          >
            <Shimmer className="aspect-[9/16] w-full rounded-none rounded-t-2xl" />
            <div className="space-y-3 p-4">
              <Shimmer className="h-5 w-3/4 rounded-md" />
              <Shimmer className="h-3.5 w-full rounded-md" />
              <Shimmer className="h-3.5 w-5/6 rounded-md" />
              <div className="flex gap-1.5 pt-1">
                <Shimmer className="h-5 w-14 rounded-full" />
                <Shimmer className="h-5 w-16 rounded-full" />
                <Shimmer className="h-5 w-12 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Shimmer className="h-3 w-20 rounded-md" />
                <div className="flex gap-2">
                  <Shimmer className="h-7 w-16 rounded-lg" />
                  <Shimmer className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Card body — Synthover puts text next to the image strip;
   Prism puts text BELOW the large vertical image. */
function CardBody({
  s,
  i,
  onEdit,
}: {
  s: SlideItem;
  i: number;
  onEdit: (i: number, tab: EditorTab) => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold leading-snug text-white" style={{ textWrap: 'balance' }}>
          {s.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusChip status={s.status} />
          <button
            aria-label={`Delete ${s.title}`}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#4B5563] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="mt-1.5 text-[13px] font-semibold leading-snug text-[#E5E7EB]">{s.hook}</p>
      <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-[#9CA3AF]">{s.caption}</p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {s.hashtags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#9CA3AF]">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
          <LayoutGrid className="h-3 w-3" strokeWidth={1.5} />
          {s.count} slides
          <span className="mx-1 text-[#374151]">|</span>
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {s.time}
        </span>
        <div className="flex items-center gap-1">
          <GhostButton icon={PenLine} onClick={() => onEdit(i, 'post')}>
            Edit
          </GhostButton>
          <GhostButton icon={Download} onClick={() => onEdit(i, 'export')}>
            Export
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

function ReadyHome({
  onGenerate,
  onEdit,
  onBrand,
}: {
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onBrand: () => void;
}) {
  const readyCount = SLIDESHOWS.filter((s) => s.status === 'Ready').length;

  return (
    <div className="mx-auto w-full max-w-[960px] px-8 py-10">
      {/* Greeting — Synthover uses 28px; Prism uses 36px for more drama. */}
      <header style={{ animation: 'prism-slideUp 0.5s ease-out' }}>
        <h1 className="font-display text-[36px] font-bold leading-tight tracking-[-0.03em] text-white">
          Good morning
        </h1>
        <p className="mt-2 text-[14px] text-[#9CA3AF]">
          Tuesday, 4 Aug. Let's create your next{' '}
          <span className="font-semibold text-[#60A5FA]">slideshow</span>.
        </p>
      </header>

      {/* Work-list header */}
      <div
        className="mb-6 mt-8 flex items-end justify-between gap-4"
        style={{ animation: 'prism-slideUp 0.5s ease-out 0.1s both' }}
      >
        <div>
          <h2 className="font-display text-[18px] font-bold text-white">Your slideshows</h2>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">
            {SLIDESHOWS.length} total · {readyCount} ready to post
          </p>
        </div>
        <ActionButton icon={Plus} onClick={onGenerate}>
          Generate
        </ActionButton>
      </div>

      {/* Featured card — the most recent slideshow gets the full-width
          hero treatment. Synthover does this too, but with a horizontal
          layout; Prism uses a large vertical image. */}
      <article
        className="mb-5 overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-300 hover:border-[#3B82F6]/20 hover:shadow-lg hover:shadow-[#3B82F6]/[0.05]"
        style={{ animation: 'prism-cardEnter 0.5s ease-out 0.15s both' }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Large image strip — Synthover shows 3 small thumbs;
              Prism shows a tall 9:16 hero image. */}
          <div className="relative flex shrink-0 items-end gap-2 bg-white/[0.02] p-4 sm:w-56">
            <div className="flex gap-2">
              {[0, 1, 2].map((j) => (
                <SlideThumb key={j} image={bg(`${SLIDESHOWS[0].seed}-${j}`)} index={j + 1} className="w-16" />
              ))}
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
              +{SLIDESHOWS[0].count - 3}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <CardBody s={SLIDESHOWS[0]} i={0} onEdit={onEdit} />
          </div>
        </div>
      </article>

      {/* Grid of remaining slideshows — vertical cards with large images */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SLIDESHOWS.slice(1).map((s, i) => (
          <article
            key={s.title}
            className="overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-300 hover:border-[#3B82F6]/20 hover:shadow-lg hover:shadow-[#3B82F6]/[0.05] hover:-translate-y-0.5"
            style={{ animation: `prism-cardEnter 0.5s ease-out ${0.2 + i * 0.08}s both` }}
          >
            {/* Large vertical image — the visual lead */}
            <div className="relative aspect-[9/16] w-full overflow-hidden">
              <img
                src={bg(`${s.seed}-0`)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Slide count overlay */}
              <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-0.5 font-num text-[11px] font-bold text-white backdrop-blur-sm">
                {s.count} slides
              </span>
              {/* Status badge */}
              <span className="absolute left-3 top-3">
                <StatusChip status={s.status} />
              </span>
              {/* Title overlay at bottom of image */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-[16px] font-bold leading-snug text-white" style={{ textWrap: 'balance' }}>
                  {s.title}
                </h3>
                <p className="mt-1 text-[12px] font-medium text-white/70">{s.hook}</p>
              </div>
            </div>
            {/* Actions below image */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                {s.time}
              </span>
              <div className="flex items-center gap-1">
                <GhostButton icon={PenLine} onClick={() => onEdit(i + 1, 'post')}>
                  Edit
                </GhostButton>
                <GhostButton icon={Download} onClick={() => onEdit(i + 1, 'export')}>
                  Export
                </GhostButton>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Brand nudge — slim strip, not a card */}
      <button
        onClick={onBrand}
        className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.01] px-5 py-4 text-left transition-all duration-200 hover:border-[#3B82F6]/20 hover:bg-white/[0.02]"
        style={{ animation: 'prism-slideUp 0.5s ease-out 0.4s both' }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10">
          <Sliders className="h-5 w-5 text-[#3B82F6]" strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-display text-[14px] font-bold text-white">Tune your Brand</span>
          <span className="mt-0.5 block text-[12px] text-[#6B7280]">
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
  onBrand,
}: {
  phase: Phase;
  onGenerate: () => void;
  onEdit: (i: number, tab: EditorTab) => void;
  onBrand: () => void;
}) {
  if (phase === 'empty') return <EmptyHome onGenerate={onGenerate} onBrand={onBrand} />;
  if (phase === 'loading') return <LoadingHome />;
  return <ReadyHome onGenerate={onGenerate} onEdit={onEdit} onBrand={onBrand} />;
}

/* ═══════════════════════════════════════════════════════════════════
   LIBRARY — different grid and interaction from Synthover.
   Synthover: 4-col uniform grid, blue border on pick.
   Prism: masonry-ish 3-col grid with hover overlay and smooth selection.
   ═══════════════════════════════════════════════════════════════════ */

function LibraryView() {
  const [picked, setPicked] = useState<number | null>(null);
  const filters = ['All', 'Dark moody', 'Cozy', 'Bold text', 'Minimal'];
  const [filter, setFilter] = useState('All');

  return (
    <div className="mx-auto w-full max-w-[960px] px-8 py-10">
      <header style={{ animation: 'prism-slideUp 0.5s ease-out' }}>
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Library
        </h1>
        <p className="mt-2 text-[13px] text-[#9CA3AF]">
          Backgrounds pulled from Pinterest for your niche. Pick one for any slide.
        </p>
      </header>

      {/* Search + Pull — Synthover has a flat search bar; Prism has a
          search bar with a pull button and filter chips below. */}
      <div
        className="mb-5 mt-6 flex items-center gap-3"
        style={{ animation: 'prism-slideUp 0.5s ease-out 0.1s both' }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" strokeWidth={1.5} />
          <input
            placeholder="Search backgrounds..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-[13px] text-white outline-none placeholder:text-[#6B7280] focus:border-[#3B82F6]/30 focus:bg-white/[0.04] transition-colors"
          />
        </div>
        <ActionButton icon={Plus} className="shrink-0">
          Pull new
        </ActionButton>
      </div>

      {/* Filter chips */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        style={{ animation: 'prism-slideUp 0.5s ease-out 0.15s both' }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
              filter === f
                ? 'bg-[#3B82F6]/15 text-[#60A5FA] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]'
                : 'border border-white/[0.06] bg-transparent text-[#6B7280] hover:text-[#D1D5DB] hover:border-white/[0.1]'
            } ${FOCUS}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Image grid — Synthover uses 4-col; Prism uses 3-col with
          9:16 aspect ratio and hover overlay. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 12 }, (_, i) => i).map((i) => {
          const isPicked = picked === i;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`group relative aspect-[9/16] overflow-hidden rounded-2xl border transition-all duration-300 ${
                isPicked
                  ? 'border-[#3B82F6]/50 shadow-lg shadow-[#3B82F6]/10'
                  : 'border-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20'
              } ${FOCUS}`}
              style={{ animation: `prism-cardEnter 0.4s ease-out ${0.2 + i * 0.03}s both` }}
            >
              <img
                src={bg(`lib-${i}`)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <span className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
              {/* Selection check */}
              {isPicked && (
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30" style={{ animation: 'prism-scaleIn 0.2s ease-out' }}>
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
              )}
              {/* Hover action */}
              <span className="absolute inset-x-3 bottom-3 rounded-xl bg-black/60 px-3 py-2 text-[12px] font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                Use on slide
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BRAND VOICE — different form layout from Synthover.
   Synthover: single column, all fields in one section.
   Prism: two-column layout (form left, preview right).
   ═══════════════════════════════════════════════════════════════════ */

function BrandView() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-8 py-10">
      <header style={{ animation: 'prism-slideUp 0.5s ease-out' }}>
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Brand Voice
        </h1>
        <p className="mt-2 text-[13px] text-[#9CA3AF]">
          Your niche, audience, and style memory. Elion writes every slideshow in this voice.
        </p>
      </header>

      {/* Two-column layout — Synthover is single column; Prism splits
          form and preview side by side. */}
      <div
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5"
        style={{ animation: 'prism-slideUp 0.5s ease-out 0.1s both' }}
      >
        {/* Form — takes 3/5 width */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 lg:col-span-3">
          <p className="mb-5 font-display text-[14px] font-bold text-white">Your brand</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Niche" value="Self-improvement" />
            <Field label="App name" value="Daily Grind" />
            <Field label="Audience" value="Men 18-34 on TikTok" />
            <Field label="App description" value="Daily motivation for people building discipline" />
          </div>

          <div className="mt-6">
            <p className="mb-3 font-display text-[14px] font-bold text-white">Style memory</p>
            <Field
              label="Style memory"
              multiline
              rows={4}
              value="Short punchy lines. Dark moody photo backgrounds. No emojis. End every slide with a question."
              placeholder="How should Elion write your slides?"
            />
          </div>

          <div className="mt-5 flex justify-end">
            <ActionButton icon={Check}>Save Brand</ActionButton>
          </div>
        </section>

        {/* Preview — takes 2/5 width. Synthover doesn't have a live preview;
          Prism shows how a generated slideshow would look. */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 lg:col-span-2">
          <p className="mb-4 font-display text-[14px] font-bold text-white">Preview</p>
          <p className="mb-4 text-[12px] text-[#6B7280]">How your slideshows will look with this Brand.</p>

          <div className="space-y-3">
            {SLIDESHOWS.slice(0, 2).map((s, i) => (
              <div
                key={s.title}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.1]"
                style={{ animation: `prism-cardEnter 0.4s ease-out ${0.3 + i * 0.1}s both` }}
              >
                <SlideThumb image={bg(`${s.seed}-0`)} index={1} className="w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-white">{s.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[#9CA3AF]">{s.hook}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]">
            Generate a test slideshow
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BILLING — different plan card treatment from Synthover.
   Synthover: two side-by-side cards, Pro has blue hairline.
   Prism: stacked cards with progress visualization, Pro has a glow.
   ═══════════════════════════════════════════════════════════════════ */

function BillingView() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-10">
      <header style={{ animation: 'prism-slideUp 0.5s ease-out' }}>
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
          Simple. Just the two plans.
        </h1>
        <p className="mt-2 text-[13px] text-[#9CA3AF]">You're on the free plan.</p>
      </header>

      <div className="mt-6 space-y-4">
        {/* Free plan — Synthover shows it as a simple card; Prism adds
            a usage visualization. */}
        <section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6"
          style={{ animation: 'prism-cardEnter 0.5s ease-out 0.1s both' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[18px] font-bold text-white">Free</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
              Current
            </span>
          </div>
          <p className="mt-3 font-num text-[32px] font-bold leading-none tracking-tight text-white">$0</p>
          <p className="mt-2 text-[13px] text-[#9CA3AF]">For trying it out.</p>

          {/* Usage bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#6B7280]">Slideshows used</span>
              <span className="font-num font-bold text-white">2 / 3</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[#3B82F6] transition-all duration-700"
                style={{ width: '66%' }}
              />
            </div>
          </div>

          <ul className="mt-5 space-y-3 text-[13px] text-[#D1D5DB]">
            {[
              '3 lifetime slideshows',
              'Elion watermark on exports',
              '1080x1920 backgrounds + copy',
            ].map((row) => (
              <li key={row} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                  <Check className="h-3 w-3 text-[#9CA3AF]" strokeWidth={2} />
                </span>
                {row}
              </li>
            ))}
          </ul>
        </section>

        {/* Pro plan — Synthover has a blue hairline; Prism has a blue glow. */}
        <section
          className="relative overflow-hidden rounded-2xl border border-[#3B82F6]/30 bg-gradient-to-br from-[#3B82F6]/[0.06] to-transparent p-6"
          style={{ animation: 'prism-cardEnter 0.5s ease-out 0.2s both' }}
        >
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#3B82F6]/[0.08] blur-[60px]" />

          <div className="relative flex items-center justify-between">
            <h3 className="font-display text-[18px] font-bold text-white">Pro</h3>
            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-[11px] font-bold text-[#9CA3AF]">
              or $99/yr
            </span>
          </div>
          <p className="relative mt-3 font-num text-[32px] font-bold leading-none tracking-tight text-white">$10<span className="text-[16px] font-normal text-[#6B7280]">/mo</span></p>
          <p className="relative mt-2 text-[13px] text-[#9CA3AF]">For creators posting every week.</p>

          <ul className="relative mt-5 space-y-3 text-[13px] text-[#E5E7EB]">
            {['100 slideshows a month', 'No watermark', 'Multiple brand projects'].map((row) => (
              <li key={row} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/20">
                  <Check className="h-3 w-3 text-[#3B82F6]" strokeWidth={2} />
                </span>
                {row}
              </li>
            ))}
          </ul>

          <ActionButton className="relative mt-6 w-full justify-center">
            Upgrade to Pro
          </ActionButton>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GENERATE PANEL — Synthover uses a centered modal; Prism uses a
   bottom sheet that slides up. More natural on mobile, more
   cinematic on desktop.
   ═══════════════════════════════════════════════════════════════════ */

function GeneratePanel({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: () => void;
}) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      {/* Backdrop — Synthover uses bg-black/80; Prism uses bg-black/60
          with a blur for a softer feel. */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — slides up from bottom on mobile, scales in on desktop. */}
      <div
        className="relative w-full max-w-lg rounded-t-2xl border border-white/[0.08] bg-[#0D0E12] p-6 text-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'prism-bottomSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[18px] font-bold tracking-[-0.01em] text-white">Generate slideshow</h2>
            <p className="mt-1 text-[13px] text-[#9CA3AF]">From your Brand: Daily Grind · Self-improvement.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-[#9CA3AF]">Idea (optional)</span>
          <input
            placeholder="e.g. Money habits of disciplined people"
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none placeholder:text-[#6B7280] focus:border-[#3B82F6]/30 focus:bg-white/[0.05] transition-colors"
          />
        </label>
        <p className="mt-1.5 text-[12px] text-[#6B7280]">Leave empty to generate from your Brand.</p>

        <div className="mt-5">
          <span className="mb-2 block text-[12px] font-semibold text-[#9CA3AF]">How many?</span>
          <div className="flex gap-2">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => setCount(o)}
                aria-pressed={count === o}
                className={`flex h-10 flex-1 items-center justify-center rounded-xl font-num text-[14px] font-bold transition-all duration-200 ${
                  count === o
                    ? 'bg-[#3B82F6]/15 text-[#60A5FA] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
                    : 'border border-white/[0.06] bg-white/[0.02] text-[#6B7280] hover:text-white hover:border-white/[0.1]'
                } ${FOCUS}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[12px] text-[#6B7280]">
          Backgrounds are pulled from Pinterest to match each slide.{' '}
          {count > 3 ? (
            <span className="font-semibold text-red-400">That is more than your 3 free slideshows.</span>
          ) : (
            <>This uses {count} of your 3 free slideshows.</>
          )}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <ActionButton variant="ghost" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton icon={Sparkles} onClick={onGenerate}>
            Generate
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDITOR PANEL — Synthover uses a centered modal; Prism uses a
   right-docked panel that slides in. More like a real editor.
   ═══════════════════════════════════════════════════════════════════ */

function EditorPanel({
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />

      {/* Panel — slides in from right. Synthover centers a modal;
          Prism docks a 640px panel. */}
      <div
        className="relative flex h-full w-full max-w-[640px] flex-col border-l border-white/[0.08] bg-[#0D0E12] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'prism-panelSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                    tab === t.key
                      ? 'bg-[#3B82F6]/15 text-[#60A5FA]'
                      : 'text-[#6B7280] hover:text-white hover:bg-white/[0.03]'
                  } ${FOCUS}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="text-[12px] font-semibold text-[#6B7280]">
              {slideshow.title}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Preview — always visible on the left side of the panel.
              Synthover shows it in the modal; Prism shows it as a
              persistent sidebar within the panel. */}
          <div className="flex w-[240px] shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#08080A] p-5">
            <div className="relative aspect-[9/16] w-full max-w-[180px] overflow-hidden rounded-xl">
              <img
                src={bg(`${slideshow.seed}-${bgOverride ?? index}`)}
                alt={`Slide ${index + 1} background`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute inset-0 flex items-center justify-center font-num text-[12px] font-bold text-white/90 drop-shadow">
                {index + 1}
              </span>
            </div>

            {/* Navigation dots */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                aria-label="Previous slide"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:text-[#374151]"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <div className="flex gap-1">
                {slideshow.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${FOCUS} ${
                      i === index ? 'w-4 bg-[#3B82F6]' : 'w-1.5 bg-[#374151] hover:bg-[#4B5563]'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                disabled={index === total - 1}
                aria-label="Next slide"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:text-[#374151]"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <span className="mt-2 font-num text-[11px] text-[#6B7280]">
              {index + 1} / {total}
            </span>
          </div>

          {/* Editor form */}
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-5 py-5">
            {tab === 'post' && (
              <div className="space-y-5" style={{ animation: 'prism-fadeIn 0.2s ease-out' }}>
                <Field label="Caption" multiline rows={5} value={slideshow.caption} />
                <Field label="Hashtags" value={slideshow.hashtags.map((t) => `#${t}`).join(' ')} />
              </div>
            )}

            {tab === 'slides' && (
              <div className="space-y-5" style={{ animation: 'prism-fadeIn 0.2s ease-out' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#9CA3AF]">Slide {index + 1} text</span>
                  <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] transition-colors hover:text-red-400">
                    <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                    Delete slide
                  </button>
                </div>
                <textarea
                  key={index}
                  rows={4}
                  defaultValue={slideshow.slides[index]}
                  className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-white outline-none focus:border-[#3B82F6]/30 focus:bg-white/[0.05] transition-colors"
                />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#9CA3AF]">Background</span>
                    <div className="flex items-center gap-2">
                      <GhostButton icon={Shuffle}>Shuffle all</GhostButton>
                      <GhostButton icon={Images} onClick={onBrowseLibrary} className="text-[#3B82F6] hover:text-[#60A5FA]">
                        Browse Library
                      </GhostButton>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                      <button
                        key={i}
                        onClick={() => setBgOverride(i)}
                        aria-label={`Background ${i + 1}`}
                        className={`relative aspect-[9/16] overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
                          bgOverride === i ? 'ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#0D0E12]' : ''
                        }`}
                      >
                        <img src={bg(`pick-${i}`)} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-[#6B7280]">
                    Backgrounds come from your Library. Shuffle picks another from the pool.
                  </p>
                </div>
              </div>
            )}

            {tab === 'export' && (
              <div className="space-y-5" style={{ animation: 'prism-fadeIn 0.2s ease-out' }}>
                <p className="text-[13px] leading-relaxed text-[#9CA3AF]">
                  Download the background images, then add text inside TikTok with the native font.
                  The free plan adds a small Elion watermark.
                </p>
                <div className="space-y-2">
                  {slideshow.slides.map((text, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.1]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/15 font-num text-[11px] font-bold text-[#60A5FA]">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-[#E5E7EB]">{text}</span>
                      <GhostButton icon={Copy}>Copy</GhostButton>
                      <GhostButton icon={Download}>Image</GhostButton>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <ActionButton icon={Download}>Download all</ActionButton>
                  <ActionButton variant="ghost" icon={Copy}>Copy all text</ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-white/[0.06] px-5 py-3">
          <ActionButton variant="ghost" onClick={onClose}>
            Cancel
          </ActionButton>
          {tab === 'export' ? (
            <ActionButton icon={Check} onClick={onClose}>
              Done
            </ActionButton>
          ) : (
            <ActionButton icon={Check}>Save</ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DEMO BAR — mockup control for stepping through states.
   ═══════════════════════════════════════════════════════════════════ */

function DemoBar({ phase, setPhase }: { phase: Phase; setPhase: (p: Phase) => void }) {
  const steps: { key: Phase; label: string }[] = [
    { key: 'empty', label: '1 New account' },
    { key: 'loading', label: '2 Generating' },
    { key: 'ready', label: '3 Generated' },
  ];
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#08080A] px-5 py-2">
      <span className="text-[11px] font-semibold text-[#4B5563]">Prism mockup</span>
      <div className="flex gap-1.5">
        {steps.map((s) => (
          <button
            key={s.key}
            onClick={() => setPhase(s.key)}
            aria-pressed={phase === s.key}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ${
              phase === s.key
                ? 'bg-[#3B82F6]/15 text-[#60A5FA]'
                : 'text-[#6B7280] hover:text-white hover:bg-white/[0.03]'
            } ${FOCUS}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <span className="ml-auto text-[11px] text-[#4B5563]">
        Vertical cards · Bottom sheet generate · Docked editor · Animated
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP — the shell. Same structure as Synthover (sidebar + main)
   but with page transitions and different proportions.
   ═══════════════════════════════════════════════════════════════════ */

function PrismApp() {
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
      <style>{ANIMATIONS}</style>
      <DemoBar phase={phase} setPhase={setPhase} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          active={view}
          onSelect={setView}
          onGenerate={() => setGenerating(true)}
          used={phase === 'ready' ? 2 : 0}
        />
        <main
          className="min-w-0 flex-1 overflow-y-auto"
          key={view}
          style={{ animation: 'prism-fadeIn 0.3s ease-out' }}
        >
          {view === 'home' && (
            <HomeView
              phase={phase}
              onGenerate={() => setGenerating(true)}
              onEdit={(i, tab) => setEditing({ i, tab })}
              onBrand={() => setView('brand')}
            />
          )}
          {view === 'library' && <LibraryView />}
          {view === 'brand' && <BrandView />}
          {view === 'billing' && <BillingView />}
        </main>
      </div>

      {/* Generate panel — slides up from bottom */}
      {generating && (
        <GeneratePanel
          onClose={() => setGenerating(false)}
          onGenerate={() => {
            setGenerating(false);
            setPhase('loading');
          }}
        />
      )}

      {/* Editor panel — slides in from right */}
      {editing && (
        <EditorPanel
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

/* ═══════════════════════════════════════════════════════════════════
   EXPORTS — Page (full app) + Preview (gallery thumbnail).
   ═══════════════════════════════════════════════════════════════════ */

export function Page() {
  return <PrismApp />;
}

export function Preview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#08080A] text-[#E5E7EB]">
      <style>{ANIMATIONS}</style>
      {/* Mini sidebar */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.06] bg-[#08080A] px-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#3B82F6]/15">
          <Sparkles className="h-2.5 w-2.5 text-[#3B82F6]" strokeWidth={1.5} />
        </span>
        <span className="text-[10px] font-bold text-white">Prism</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {/* Mini sidebar nav */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-1.5 border-r border-white/[0.06] py-2">
          {[Home, Images, Sliders, CreditCard].map((Icon, i) => (
            <span
              key={i}
              className={`flex h-6 w-6 items-center justify-center rounded-md ${
                i === 0 ? 'bg-[#3B82F6]/15 text-[#3B82F6]' : 'text-[#4B5563]'
              }`}
            >
              <Icon className="h-3 w-3" strokeWidth={1.5} />
            </span>
          ))}
        </div>
        {/* Mini content */}
        <div className="flex-1 p-2">
          <div className="mb-1.5 h-4 w-32 rounded bg-white/[0.08]" />
          <div className="mb-2 h-2.5 w-20 rounded bg-white/[0.04]" />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-white/[0.06]">
                <div className="aspect-[9/16] w-full bg-white/[0.03]" style={{ animation: `prism-cardEnter 0.4s ease-out ${i * 0.08}s both` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

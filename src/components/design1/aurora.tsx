import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
  Home,
  LayoutDashboard,
  LayoutGrid,
  List,
  LogOut,
  PenLine,
  Play,
  Plus,
  Search,
  Settings,
  Sliders,
  Sparkles,
  Star,
  Upload,
  User,
  Zap,
} from 'lucide-react';

const MONO = { fontFamily: 'JetBrains Mono' };

/* Gold-and-black slide fills (the saved Style memory: "Dark gold-and-black gradient slides. No emojis.") */
const GOLDS = [
  'linear-gradient(163deg,#3B2B18 0%,#241608 46%,#0B0D16 100%)',
  'linear-gradient(163deg,#42321C 0%,#281708 44%,#0B0D16 100%)',
  'linear-gradient(163deg,#35260F 0%,#221207 50%,#0B0D16 100%)',
  'linear-gradient(163deg,#3A2913 0%,#241505 42%,#0B0D16 100%)',
  'linear-gradient(163deg,#443318 0%,#291806 48%,#0B0D16 100%)',
];

const TONES = {
  draft: 'border-[#1F2A44] bg-[#12182B] text-[#8B95B8]',
  ready: 'border-[#46C47C]/40 bg-[#46C47C]/10 text-[#46C47C]',
  exported: 'border-[#6EE7E0]/40 bg-[#6EE7E0]/10 text-[#6EE7E0]',
} as const;

function StatusTag({ label, tone }: { label: string; tone: keyof typeof TONES }) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded border px-1.5 py-[2px] text-[9px] font-medium ' +
        TONES[tone]
      }
      style={MONO}
    >
      {tone === 'ready' && <CheckCircle2 size={9} />}
      {label.toUpperCase()}
    </span>
  );
}

function SlideThumb({ n, gold, selected }: { n: number; gold: number; selected?: boolean }) {
  return (
    <div
      className={
        'relative aspect-[9/16] w-[76px] shrink-0 overflow-hidden rounded-lg border ' +
        (selected
          ? 'border-[#6EE7E0] shadow-[0_0_0_1px_rgba(110,231,224,0.25),0_0_22px_rgba(167,139,250,0.30),0_0_8px_rgba(110,231,224,0.28)]'
          : 'border-[#1F2A44]')
      }
      style={{ background: GOLDS[gold % GOLDS.length] }}
    >
      <div className="absolute left-2.5 top-2.5 h-5 w-5 rounded-md bg-[#C9A15A]/20" />
      <div className="absolute left-2.5 top-[52px] h-[3px] w-[60%] rounded-full bg-[#C9A15A]/45" />
      <div className="absolute left-2.5 top-[60px] h-[3px] w-[40%] rounded-full bg-[#C9A15A]/25" />
      <span
        className="absolute bottom-1.5 left-2 text-[9px] font-semibold text-[#C9A15A]/80"
        style={MONO}
      >
        {String(n).padStart(2, '0')}
      </span>
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#1F2A44] bg-[#0A0E1A]/85 text-[#6EE7E0]">
          <Play size={8} fill="currentColor" />
        </span>
      )}
    </div>
  );
}

function Chip({ label, value, saved }: { label: string; value: string; saved?: boolean }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#1F2A44] bg-[#182038] px-2.5 py-1.5">
      {saved && <Star size={10} className="shrink-0 text-[#6EE7E0]" />}
      <span className="text-[8px] uppercase tracking-[0.12em] text-[#4A5478]" style={MONO}>
        {label}
      </span>
      <span className="truncate text-[11px] font-sans text-[#C6CDE8]">{value}</span>
    </span>
  );
}

function ScriptRow({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-11 shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#8B95B8]"
        style={MONO}
      >
        {label}
      </span>
      <div
        className={
          'flex-1 truncate rounded-md border border-[#1F2A44] bg-[#182038] px-3 py-1.5 text-[12px] font-sans ' +
          (accent ? 'text-[#6EE7E0]' : 'text-[#C6CDE8]')
        }
      >
        {text}
      </div>
    </div>
  );
}

const TABS = ['Style', 'Slideshows', 'Plan'];
const NAV = [
  { key: 'style', icon: LayoutGrid, active: false },
  { key: 'slideshows', icon: List, active: true },
  { key: 'plan', icon: CreditCard, active: false },
];
const QUEUE = [
  { title: "5 signs you're not lazy", tone: 'ready' as const, time: 'Today' },
  { title: 'Money habits of disciplined people', tone: 'draft' as const, time: 'Yesterday' },
  { title: 'How to build a 5am routine', tone: 'exported' as const, time: 'Mon' },
];
const SCRIPT = [
  { label: 'Hook', text: "3 signs you're not lazy — you're just tired" },
  { label: '01', text: 'Sign one: you rest, then feel guilty' },
  { label: '02', text: 'Sign two: you start late, but finish strong' },
  { label: '03', text: 'Sign three: you crave deep rest, not escape' },
  { label: '04', text: 'The fix: plan rest like a real task' },
  { label: '05', text: "You're not broken. You're running on empty." },
  { label: 'Caption', text: 'Save this for your next reset.' },
  { label: 'Tags', text: '#selfimprovement #growthmindset #rest #notlazy', accent: true },
];

export function Preview() {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden"
      style={{ fontFamily: 'Inter Tight' }}
    >
      <div className="absolute inset-0 bg-[#0A0E1A]">
        <div className="absolute -top-14 left-1/2 h-36 w-64 -translate-x-1/2 rounded-full bg-[#6EE7E0]/10 blur-3xl" />
        {/* mini app window */}
        <div className="absolute inset-[5%] flex flex-col overflow-hidden rounded-[10px] border border-[#1F2A44] bg-[#0A0E1A]">
          {/* mini top bar */}
          <div className="flex h-7 shrink-0 items-center justify-between border-b border-[#1F2A44] px-2.5">
            <div className="flex items-center gap-1.5" style={MONO}>
              <span className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-[#6EE7E0] text-[5px] font-bold text-[#0A0E1A]">
                E
              </span>
              <span className="text-[6px] text-[#8B95B8]">Daily Grind</span>
              <ChevronRight size={6} className="text-[#4A5478]" />
              <span className="text-[6px] text-[#E9EDFF]">New slideshow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="rounded border border-[#1F2A44] bg-[#12182B] px-1 py-[2px] text-[5px] text-[#8B95B8]"
                style={MONO}
              >
                FREE
              </span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#182038] text-[#8B95B8]">
                <User size={7} />
              </span>
            </div>
          </div>
          {/* mini split */}
          <div className="flex min-h-0 flex-1">
            {/* mini icon rail */}
            <div className="flex w-5 shrink-0 flex-col items-center gap-1.5 border-r border-[#1F2A44] py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7E0]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#2A3556]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#2A3556]" />
            </div>
            {/* mini storyboard */}
            <div className="flex w-[30%] shrink-0 flex-col items-center justify-center gap-1.5 border-r border-[#1F2A44] p-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={
                    'relative aspect-[9/16] w-full max-w-[34px] rounded-[3px] border ' +
                    (i === 1
                      ? 'border-[#6EE7E0] shadow-[0_0_10px_rgba(110,231,224,0.25)]'
                      : 'border-[#1F2A44]')
                  }
                  style={{ background: GOLDS[i] }}
                >
                  <span className="absolute bottom-1 left-1.5 text-[5px] font-semibold text-[#C9A15A]/80" style={MONO}>
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
            {/* mini editor */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5">
              <span
                className="text-[5.5px] uppercase tracking-[0.14em] text-[#8B95B8]"
                style={MONO}
              >
                What's this slideshow about?
              </span>
              <div
                className="rounded-[4px] border border-[#2A3556] bg-[#182038] px-2 py-1 text-[6px] text-[#4A5478]"
                style={MONO}
              >
                What's this slideshow about?
              </div>
              <div className="flex gap-1">
                <span
                  className="rounded-[3px] border border-[#1F2A44] bg-[#182038] px-1.5 py-[2px] text-[5px] text-[#C6CDE8]"
                  style={MONO}
                >
                  Self-improvement
                </span>
                <span
                  className="rounded-[3px] border border-[#1F2A44] bg-[#182038] px-1.5 py-[2px] text-[5px] text-[#C6CDE8]"
                  style={MONO}
                >
                  Men 18–34
                </span>
              </div>
              <button className="flex items-center justify-center gap-1 rounded-[4px] bg-[#6EE7E0] py-1 text-[6px] font-semibold text-[#0A0E1A] shadow-[0_0_12px_rgba(110,231,224,0.25)]">
                <Sparkles size={7} />
                Generate slideshow
              </button>
              <div className="space-y-1">
                {[
                  { l: 'HOOK', t: "3 signs you're not lazy…" },
                  { l: '01', t: 'Rest, then guilt' },
                  { l: '05', t: 'Running on empty' },
                ].map((r) => (
                  <div key={r.l} className="flex items-center gap-1">
                    <span className="w-7 shrink-0 text-[4.5px] text-[#8B95B8]" style={MONO}>
                      {r.l}
                    </span>
                    <span className="flex-1 truncate rounded-[3px] border border-[#1F2A44] bg-[#182038] px-1.5 py-[2px] text-[5.5px] font-sans text-[#C6CDE8]">
                      {r.t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-[#1F2A44] pt-1.5">
                <span className="text-[5px] text-[#8B95B8]" style={MONO}>
                  1080×1920
                </span>
                <div className="flex gap-1">
                  <span
                    className="flex items-center gap-0.5 rounded-[3px] border border-[#1F2A44] bg-[#182038] px-1 py-[2px] text-[5px] text-[#E9EDFF]"
                    style={MONO}
                  >
                    <Download size={6} /> PNGs
                  </span>
                  <span
                    className="flex items-center gap-0.5 rounded-[3px] border border-[#1F2A44] bg-[#182038] px-1 py-[2px] text-[5px] text-[#E9EDFF]"
                    style={MONO}
                  >
                    <Copy size={6} /> Copy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page() {
  return (
    <div
      style={{ fontFamily: 'Inter Tight' }}
      className="relative flex min-h-screen w-full overflow-hidden bg-[#0A0E1A] text-[#E9EDFF]"
    >
      {/* faint cinematic glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(110,231,224,0.07),transparent)]" />

      {/* far-left icon rail */}
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center border-r border-[#1F2A44] py-4">
        <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-md bg-[#6EE7E0] text-sm font-extrabold text-[#0A0E1A]">
          E
        </div>
        <div className="flex flex-col gap-1">
          {NAV.map(({ key, icon: Icon, active }) => (
            <div
              key={key}
              className={
                'relative flex h-10 w-10 items-center justify-center rounded-lg ' +
                (active ? 'bg-[#182038] text-[#6EE7E0]' : 'text-[#8B95B8]')
              }
            >
              {active && (
                <span className="absolute left-[7px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#6EE7E0] shadow-[0_0_8px_rgba(110,231,224,0.5)]" />
              )}
              <Icon size={18} strokeWidth={1.8} />
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8B95B8]">
            <Settings size={18} strokeWidth={1.8} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8B95B8]">
            <LogOut size={18} strokeWidth={1.8} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="flex h-[58px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#1F2A44] px-5">
          <div className="hidden items-center gap-1.5 text-[13px] font-sans md:flex">
            <Home size={14} className="text-[#8B95B8]" />
            <span className="text-[#8B95B8]">Daily Grind</span>
            <ChevronRight size={13} className="text-[#4A5478]" />
            <span className="font-medium text-[#E9EDFF]">New slideshow</span>
          </div>

          <div className="flex items-center gap-0.5 rounded-lg border border-[#1F2A44] bg-[#12182B] p-1">
            {TABS.map((t) => {
              const active = t === 'Slideshows';
              return (
                <button
                  key={t}
                  className={
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium ' +
                    (active ? 'bg-[#182038] text-[#E9EDFF]' : 'text-[#8B95B8]')
                  }
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7E0]" />}
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span
              className="rounded border border-[#1F2A44] bg-[#12182B] px-2 py-1 text-[10px] text-[#8B95B8]"
              style={MONO}
            >
              FREE
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-[#8B95B8]">
              <Bell size={16} strokeWidth={1.8} />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1F2A44] bg-[#182038] text-[#8B95B8]">
              <User size={15} />
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-5">
          {/* recent slideshows */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#E9EDFF]">Recent slideshows</h2>
              <button className="flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[11px] font-sans text-[#8B95B8]">
                <Search size={13} />
                Search
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#2A3556] py-6 text-[#8B95B8]">
                <Plus size={14} />
                <span className="text-[11px] tracking-[0.08em]" style={MONO}>
                  NEW SLIDESHOW
                </span>
              </div>
              {QUEUE.map((q, i) => (
                <div
                  key={q.title}
                  className="flex items-center gap-3 rounded-xl border border-[#1F2A44] bg-[#12182B] px-3 py-2.5"
                >
                  <div
                    className="h-[54px] w-9 shrink-0 rounded-md border border-[#1F2A44]"
                    style={{ background: GOLDS[i % GOLDS.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-[#E9EDFF]">{q.title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <StatusTag label={q.tone} tone={q.tone} />
                      <span className="flex items-center gap-1 text-[8px] text-[#4A5478]" style={MONO}>
                        <Clock size={8} />
                        {q.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* editor split view */}
          <main className="mt-5 flex flex-wrap gap-4">
            {/* storyboard */}
            <section className="flex w-full flex-col rounded-xl border border-[#1F2A44] bg-[#12182B] p-4 lg:w-[34%]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <LayoutDashboard size={13} className="text-[#6EE7E0]" />
                  <span className="text-[11px] font-semibold text-[#E9EDFF]">Storyboard</span>
                </div>
                <span className="text-[9px] tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                  05 SLIDES
                </span>
              </div>

              <div className="relative mt-4 flex flex-col items-center gap-3 pb-3">
                <SlideThumb n={1} gold={0} />
                <SlideThumb n={2} gold={1} selected />
                <SlideThumb n={3} gold={2} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#12182B] to-transparent" />
              </div>

              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#2A3556] py-2.5 text-[8px] uppercase tracking-[0.12em] text-[#8B95B8]">
                <Plus size={11} />
                Add slide
              </button>

              {/* plan / usage */}
              <div className="mt-auto pt-4">
                <div className="rounded-lg border border-[#1F2A44] bg-[#182038] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                      FREE PLAN
                    </span>
                    <BarChart3 size={13} className="text-[#6EE7E0]" />
                  </div>
                  <p className="mt-2 text-[11px] font-sans text-[#E9EDFF]">
                    2 of 3 lifetime generations used
                  </p>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#0A0E1A]">
                    <div className="h-1 w-2/3 rounded-full bg-[#6EE7E0]" />
                  </div>
                  <button className="mt-2.5 flex items-center gap-1 text-[9px] text-[#8B95B8] hover:text-[#E9EDFF]" style={MONO}>
                    Upgrade to Pro
                    <ArrowRight size={9} />
                  </button>
                </div>
              </div>
            </section>

            {/* editor panel */}
            <section className="min-w-0 flex-1 rounded-xl border border-[#1F2A44] bg-[#12182B] p-5">
              {/* idea input */}
              <div>
                <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                  <PenLine size={11} className="text-[#6EE7E0]" />
                  What's this slideshow about?
                </label>
                <div className="mt-1.5 rounded-lg border border-[#2A3556] bg-[#182038] px-3.5 py-3">
                  <p className="text-sm font-sans text-[#E9EDFF]">
                    3 signs you're not lazy — you're just tired
                  </p>
                  <p className="mt-1 text-[8px] tracking-[0.14em] text-[#4A5478]" style={MONO}>
                    IDEA
                  </p>
                </div>
              </div>

              {/* style */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sliders size={12} className="text-[#6EE7E0]" />
                  <span className="text-[9px] uppercase tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                    Style
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip label="Niche" value="Self-improvement" />
                  <Chip label="Audience" value="Men 18–34 on TikTok" />
                  <Chip
                    label="Memory"
                    value="Short punchy lines. Dark gold-and-black gradient slides. No emojis."
                    saved
                  />
                </div>
              </div>

              {/* generate */}
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6EE7E0] py-3 text-sm font-semibold text-[#0A0E1A] shadow-[0_0_26px_rgba(110,231,224,0.18)]">
                <Sparkles size={15} />
                Generate slideshow
              </button>
              <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[#8B95B8]" style={MONO}>
                <Zap size={10} />
                ABOUT 30 SECONDS · SCRIPT + 5 SLIDES + CAPTION + HASHTAGS
              </p>

              {/* script */}
              <div className="mt-5 border-t border-[#1F2A44] pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileText size={12} className="text-[#6EE7E0]" />
                    <span className="text-[9px] uppercase tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                      Script
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-[#46C47C]" style={MONO}>
                    <Check size={11} />
                    5 SLIDES READY
                  </span>
                </div>
                <div className="space-y-1.5">
                  {SCRIPT.map((row) => (
                    <ScriptRow key={row.label} label={row.label} text={row.text} accent={row.accent} />
                  ))}
                </div>
              </div>

              {/* export */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1F2A44] pt-4">
                <div className="flex items-center gap-1.5">
                  <Upload size={12} className="text-[#6EE7E0]" />
                  <span className="text-[9px] uppercase tracking-[0.14em] text-[#8B95B8]" style={MONO}>
                    Export · 1080×1920 PNG
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 rounded-md border border-[#1F2A44] bg-[#182038] px-3 py-2 text-[11px] font-sans text-[#E9EDFF]">
                    <Download size={12} className="text-[#6EE7E0]" />
                    Download PNGs
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md border border-[#1F2A44] bg-[#182038] px-3 py-2 text-[11px] font-sans text-[#E9EDFF]">
                    <Copy size={12} className="text-[#6EE7E0]" />
                    Copy text
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

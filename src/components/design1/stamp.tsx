import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  LayoutGrid,
  LogOut,
  PenLine,
  Play,
  Search,
  Settings,
  Sparkles,
  Star,
  User,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/*  Shared data — the "Stamp" issue.                                 */
/* ---------------------------------------------------------------- */

const navItems = ['Style', 'Slideshows', 'Plan'] as const;

const styleFields = [
  { label: 'Niche', value: 'Self-improvement' },
  { label: 'App name', value: 'Daily Grind' },
  { label: 'Audience', value: 'Men 18–34 on TikTok' },
  { label: 'Style memory', value: 'Short punchy lines. Dark gold-and-black gradient slides. No emojis.' },
] as const;

const recentRows = [
  { title: "3 signs you're not lazy — you're just tired", meta: '6 slides · 1080×1920 · Today 08:40', status: 'Ready' },
  { title: "5 signs you're not lazy", meta: '5 slides · Exported 2 min ago', status: 'Exported' },
  { title: 'Money habits of disciplined people', meta: 'Draft · saved Jul 30', status: 'Draft' },
  { title: 'How to build a 5am routine', meta: 'Draft · saved Jul 28', status: 'Draft' },
] as const;

const tagList = ['selfimprovement', 'rest', 'burnout', 'motivation', 'health', 'sleep', 'mindset', 'tired'] as const;

function statusTag(status: string) {
  if (status === 'Exported') {
    return (
      <span
        style={{ fontFamily: 'JetBrains Mono' }}
        className="inline-flex shrink-0 items-center gap-1.5 border border-[#3E6B4F] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#3E6B4F]"
      >
        <CheckCircle2 size={11} strokeWidth={2.2} />
        Exported
      </span>
    );
  }
  if (status === 'Ready') {
    return (
      <span
        style={{ fontFamily: 'JetBrains Mono' }}
        className="inline-flex shrink-0 items-center gap-1.5 bg-[#1A1713] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#FBF8F3]"
      >
        <Star size={11} strokeWidth={2.2} fill="currentColor" />
        Ready
      </span>
    );
  }
  return (
    <span
      style={{ fontFamily: 'JetBrains Mono' }}
      className="inline-flex shrink-0 items-center gap-1.5 border border-[#0E0D0B]/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6B645A]"
    >
      <Clock size={11} strokeWidth={2.2} />
      Draft
    </span>
  );
}

/* ---------------------------------------------------------------- */
/*  Preview — compact gallery card of the signature screen.          */
/* ---------------------------------------------------------------- */

export function Preview() {
  return (
    <div
      className="relative flex aspect-[4/3] w-full flex-col overflow-hidden bg-[#FBF8F3] px-5 pb-4 pt-4 text-[#1A1713]"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* mini masthead */}
      <div className="flex items-end justify-between">
        <span className="text-[21px] font-bold leading-none tracking-[-0.01em]">
          Elion<sup className="ml-1 text-[10px] font-semibold text-[#C2342A]">AI</sup>
        </span>
        <span
          style={{ fontFamily: 'JetBrains Mono' }}
          className="text-[7px] uppercase tracking-[0.18em] text-[#6B645A]"
        >
          Sat · Aug 2 2026 · Vol 1 № 47
        </span>
      </div>
      <div className="mt-2 h-[2px] w-full bg-[#0E0D0B]" />

      {/* mini index */}
      <div className="flex items-center justify-between border-b border-[#0E0D0B]/25 py-1.5">
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.13em]">
          <span className="text-[#1A1713]">Style</span>
          <span className="border-b-2 border-[#C2342A] font-bold text-[#C2342A]">Slideshows</span>
          <span className="text-[#1A1713]">Plan</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[7px] uppercase tracking-[0.14em] text-[#6B645A]">
          Free · 2/3
        </span>
      </div>

      {/* body */}
      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        {/* brief */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[12px] font-bold text-[#C2342A]">01</span>
            <span className="text-[12px] font-semibold">Style</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
            <div>
              <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[6.5px] uppercase tracking-[0.16em] text-[#6B645A]">
                Niche
              </div>
              <div className="text-[10px] leading-tight">Self-improvement</div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[6.5px] uppercase tracking-[0.16em] text-[#6B645A]">
                App
              </div>
              <div className="text-[10px] leading-tight">Daily Grind</div>
            </div>
            <div className="col-span-2">
              <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[6.5px] uppercase tracking-[0.16em] text-[#6B645A]">
                Style memory
              </div>
              <div className="text-[10px] leading-tight">Short punchy lines. Dark gold-and-black gradient slides.</div>
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[12px] font-bold text-[#C2342A]">02</span>
            <span className="text-[12px] font-semibold">Idea</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 border-b border-[#1A1713] pb-1">
            <PenLine size={10} className="shrink-0 text-[#6B645A]" />
            <span className="truncate text-[10px] text-[#B4AA9B]">What's this slideshow about?</span>
          </div>

          <div className="mt-auto pt-3">
            <div className="inline-flex items-center gap-1.5 bg-[#C2342A] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#FBF8F3]">
              Print the slideshow
              <ArrowRight size={9} strokeWidth={2.4} />
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[8px] leading-tight text-[#6B645A]">
              <Sparkles size={9} className="shrink-0 text-[#C2342A]" />
              <span style={{ fontFamily: 'Public Sans' }}>Script · backgrounds · caption · hashtags</span>
            </div>
          </div>
        </div>

        {/* proof deck */}
        <div className="relative w-[34%] shrink-0">
          <div className="absolute inset-y-0 right-[3%] w-[86%] bg-[#0E0D0B]" />
          <div className="absolute inset-y-0 right-[1.5%] w-[88%] bg-[#241B12]" />
          <div className="absolute inset-y-0 right-0 flex w-[92%] flex-col bg-[linear-gradient(165deg,#0D0C0A_0%,#1E1710_42%,#8F6E22_135%)] p-2">
            <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[6px] uppercase tracking-[0.14em] text-[#FBF8F3]/70">
              Daily Grind · 01/06
            </div>
            <div className="my-auto text-[12px] font-bold leading-snug text-[#FBF8F3]">
              3 signs you're not lazy — you're just tired
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[0.12em] text-[#FBF8F3]/70">elion.ai</span>
              <span className="flex items-center gap-1 text-[7px] uppercase tracking-[0.12em] text-[#FBF8F3]/70">
                <Play size={7} fill="currentColor" />
                slide 01
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* colophon */}
      <div
        style={{ fontFamily: 'JetBrains Mono' }}
        className="mt-3 flex items-center justify-between border-t border-[#0E0D0B]/25 pt-1.5 text-[7px] uppercase tracking-[0.16em] text-[#6B645A]"
      >
        <span>Free — 2 of 3 lifetime generations used</span>
        <span>Style · Slideshows · Plan</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Page — full desktop app mockup, the "Stamp" broadsheet.           */
/* ---------------------------------------------------------------- */

export function Page() {
  return (
    <div style={{ fontFamily: 'Public Sans' }} className="min-h-screen w-full bg-[#FBF8F3] text-[#1A1713] antialiased">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        {/* ============ MASTHEAD ============ */}
        <header className="pt-12">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="flex items-baseline gap-4">
                <span
                  style={{ fontFamily: 'Georgia, serif' }}
                  className="text-6xl font-bold leading-none tracking-[-0.015em] text-[#1A1713]"
                >
                  Elion
                  <sup className="ml-3 align-super text-2xl font-semibold text-[#C2342A]">AI</sup>
                </span>
                <span
                  style={{ fontFamily: 'JetBrains Mono' }}
                  className="hidden text-[11px] uppercase tracking-[0.22em] text-[#6B645A] sm:block"
                >
                  A slideshow, set &amp; printed
                </span>
              </div>
              <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-[#6B645A]">
                Elion writes your slideshow for you — script, 1080×1920 backgrounds, hook, caption and hashtags.
              </p>
            </div>

            <div className="text-right">
              <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[11px] uppercase tracking-[0.2em] text-[#6B645A]">
                Saturday · August 2, 2026
              </div>
              <div style={{ fontFamily: 'JetBrains Mono' }} className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6B645A]">
                Vol. 1 — No. 47 · Creator Edition
              </div>
              <div className="mt-3 flex items-center justify-end gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1713] text-[#FBF8F3]">
                  <User size={15} />
                </span>
                <span className="text-sm font-semibold text-[#1A1713]">The Daily Grind</span>
              </div>
            </div>
          </div>
          <div className="mt-7 h-[3px] w-full bg-[#0E0D0B]" />
        </header>

        {/* ============ INDEX / NAV ============ */}
        <nav className="flex items-center justify-between border-b border-[#0E0D0B]/25">
          <div className="flex items-center gap-7">
            {navItems.map((item) => {
              const active = item === 'Slideshows';
              return (
                <button
                  key={item}
                  type="button"
                  className={`relative flex items-center px-0.5 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                    active ? 'text-[#C2342A]' : 'text-[#1A1713] hover:text-[#6B645A]'
                  }`}
                >
                  {item}
                  {active && <span className="absolute inset-x-0 -bottom-px h-[2.5px] bg-[#C2342A]" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            {[
              { icon: <Search size={15} />, label: 'Search' },
              { icon: <Bell size={15} />, label: 'Alerts' },
              { icon: <Settings size={15} />, label: 'Settings' },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-label={b.label}
                className="p-2 text-[#6B645A] transition-colors hover:text-[#1A1713]"
              >
                {b.icon}
              </button>
            ))}
            <span className="mx-2 h-5 w-px bg-[#0E0D0B]/20" />
            <button
              type="button"
              aria-label="Sign out"
              className="p-2 text-[#6B645A] transition-colors hover:text-[#C2342A]"
            >
              <LogOut size={15} />
            </button>
          </div>
        </nav>

        {/* ============ TWO-COLUMN SPREAD ============ */}
        <main className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.22fr)] lg:gap-0">
          {/* ---- LEFT · the editorial brief ---- */}
          <section className="lg:border-r lg:border-[#0E0D0B]/20 lg:pr-10">
            <div className="flex items-baseline justify-between border-b border-[#0E0D0B] pb-2">
              <div className="flex items-baseline gap-3">
                <span style={{ fontFamily: 'Georgia, serif' }} className="text-[15px] italic text-[#C2342A]">
                  №
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-[22px] font-bold tracking-tight text-[#1A1713]">
                  New slideshow
                </h2>
              </div>
              <span
                style={{ fontFamily: 'JetBrains Mono' }}
                className="text-[10px] uppercase tracking-[0.2em] text-[#6B645A]"
              >
                Editorial brief
              </span>
            </div>

            {/* 01 — Style */}
            <section className="mt-7">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span style={{ fontFamily: 'Georgia, serif' }} className="text-[20px] font-bold text-[#C2342A]">
                    01
                  </span>
                  <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[18px] font-semibold text-[#1A1713]">
                    Style
                  </h3>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C2342A] hover:text-[#1A1713]"
                >
                  <PenLine size={13} />
                  Edit style
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                {styleFields.map((f) => (
                  <div key={f.label} className={f.label === 'Style memory' ? 'col-span-2' : ''}>
                    <div
                      style={{ fontFamily: 'JetBrains Mono' }}
                      className="text-[10px] uppercase tracking-[0.18em] text-[#6B645A]"
                    >
                      {f.label}
                    </div>
                    <div className="mt-1 text-[14px] leading-snug text-[#1A1713]">{f.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02 — Idea */}
            <section className="mt-8">
              <div className="flex items-baseline gap-3">
                <span style={{ fontFamily: 'Georgia, serif' }} className="text-[20px] font-bold text-[#C2342A]">
                  02
                </span>
                <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[18px] font-semibold text-[#1A1713]">
                  Idea
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-3 border-b border-[#1A1713] pb-2.5">
                <PenLine size={15} className="shrink-0 text-[#6B645A]" />
                <input
                  defaultValue="3 signs you're not lazy — you're just tired"
                  placeholder="What's this slideshow about?"
                  className="w-full bg-transparent text-[16px] text-[#1A1713] outline-none placeholder:text-[#B4AA9B]"
                  aria-label="Slideshow idea"
                />
              </div>
              <div
                style={{ fontFamily: 'JetBrains Mono' }}
                className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#6B645A]"
              >
                Manuscript line · 44 characters · 6 slides
              </div>
            </section>

            {/* 03 — Generate */}
            <section className="mt-8">
              <div className="flex items-baseline gap-3">
                <span style={{ fontFamily: 'Georgia, serif' }} className="text-[20px] font-bold text-[#C2342A]">
                  03
                </span>
                <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[18px] font-semibold text-[#1A1713]">
                  Generate
                </h3>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="group inline-flex items-center gap-2.5 bg-[#C2342A] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.13em] text-[#FBF8F3] transition-colors hover:bg-[#A22A22]"
                >
                  Print the slideshow
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </button>
              </div>
              <div className="mt-4 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[#6B645A]">
                <Sparkles size={13} className="mt-0.5 shrink-0 text-[#C2342A]" />
                <p>
                  Writes the script, supplies the 1080×1920 backgrounds, and drafts the hook, caption and hashtags.
                  Six slides, ready to post in TikTok or Instagram's native app.
                </p>
              </div>
            </section>
          </section>

          {/* ---- RIGHT · the page proof ---- */}
          <section className="lg:pl-10">
            <div className="flex items-center justify-between border-b border-[#0E0D0B] pb-2">
              <div className="flex items-baseline gap-3">
                <span style={{ fontFamily: 'Georgia, serif' }} className="text-[15px] italic text-[#C2342A]">
                  №
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-[22px] font-bold tracking-tight text-[#1A1713]">
                  Page proof
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border border-[#0E0D0B]/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1A1713] transition-colors hover:border-[#0E0D0B]"
              >
                <Download size={13} />
                Export PNG
              </button>
            </div>

            {/* stacked slide proofs */}
            <div className="mt-6 flex flex-wrap items-start gap-5">
              {/* slide 1 — title */}
              <div className="relative aspect-[9/16] w-[208px] shrink-0 overflow-hidden border border-[#0E0D0B]/80 bg-[linear-gradient(165deg,#0D0C0A_0%,#1E1710_42%,#8F6E22_135%)]">
                <div className="flex h-full flex-col p-4">
                  <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[8px] uppercase tracking-[0.16em] text-[#FBF8F3]/70">
                    The Daily Grind
                  </div>
                  <div
                    style={{ fontFamily: 'Georgia, serif' }}
                    className="my-auto text-[21px] font-bold leading-[1.15] text-[#FBF8F3]"
                  >
                    3 signs you're not lazy — you're just tired
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[7px] uppercase tracking-[0.14em] text-[#FBF8F3]/70">
                      elion.ai
                    </span>
                    <span
                      style={{ fontFamily: 'JetBrains Mono' }}
                      className="inline-flex items-center gap-1 text-[7px] uppercase tracking-[0.14em] text-[#FBF8F3]/80"
                    >
                      <Play size={8} fill="currentColor" />
                      Slide 01
                    </span>
                  </div>
                </div>
                <span
                  style={{ fontFamily: 'JetBrains Mono' }}
                  className="absolute right-3 top-3 border border-[#FBF8F3]/40 px-1.5 py-0.5 text-[8px] tracking-[0.1em] text-[#FBF8F3]/90"
                >
                  01 / 06
                </span>
              </div>

              {/* slide 2 */}
              <div className="relative aspect-[9/16] w-[208px] shrink-0 overflow-hidden border border-[#0E0D0B]/80 bg-[linear-gradient(200deg,#14110D_0%,#2B2114_55%,#7A5C1C_135%)]">
                <div className="flex h-full flex-col p-4">
                  <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[8px] uppercase tracking-[0.16em] text-[#FBF8F3]/70">
                    The Daily Grind · Sign 1 of 3
                  </div>
                  <div
                    style={{ fontFamily: 'Georgia, serif' }}
                    className="my-auto text-[19px] font-bold leading-[1.18] text-[#FBF8F3]"
                  >
                    You sleep eight hours and still wake up wrecked.
                  </div>
                  <div
                    style={{ fontFamily: 'JetBrains Mono' }}
                    className="text-[7px] uppercase tracking-[0.14em] text-[#FBF8F3]/70"
                  >
                    Slide 02
                  </div>
                </div>
                <span
                  style={{ fontFamily: 'JetBrains Mono' }}
                  className="absolute right-3 top-3 border border-[#FBF8F3]/40 px-1.5 py-0.5 text-[8px] tracking-[0.1em] text-[#FBF8F3]/90"
                >
                  02 / 06
                </span>
              </div>

              {/* folio rail */}
              <div className="mt-1 flex flex-col gap-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span
                      key={n}
                      style={{ fontFamily: 'JetBrains Mono' }}
                      className={`flex h-6 w-6 items-center justify-center text-[9px] ${
                        n <= 2 ? 'bg-[#1A1713] text-[#FBF8F3]' : 'border border-[#0E0D0B]/25 text-[#6B645A]'
                      }`}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[9px] uppercase tracking-[0.16em] text-[#6B645A]">
                  Slides 1–2 · proof
                </span>
              </div>
            </div>

            {/* caption + hashtags footnote */}
            <div className="mt-9 border-t-2 border-[#0E0D0B] pt-5">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[10px] uppercase tracking-[0.18em] text-[#6B645A]">
                      Caption · 248 chars
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3E6B4F]"
                    >
                      <Check size={12} strokeWidth={2.6} />
                      Copied
                    </button>
                  </div>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#1A1713]">
                    “Most people call it laziness. It’s usually exhaustion. Here are 3 signs you’re just tired — and
                    what to do about it. Save this for when you need a reset.”
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[10px] uppercase tracking-[0.18em] text-[#6B645A]">
                      Hashtags · 8 tags
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A1713] hover:text-[#C2342A]"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {tagList.map((t) => (
                      <span
                        key={t}
                        style={{ fontFamily: 'JetBrains Mono' }}
                        className="border border-[#0E0D0B]/20 px-2 py-1 text-[11px] text-[#6B645A]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ============ RECENT SLIDESHOWS ============ */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between border-b border-[#0E0D0B] pb-2">
            <div className="flex items-center gap-3">
              <LayoutGrid size={15} className="text-[#C2342A]" />
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-[22px] font-bold tracking-tight text-[#1A1713]">
                Recent slideshows
              </h2>
            </div>
            <span
              style={{ fontFamily: 'JetBrains Mono' }}
              className="text-[10px] uppercase tracking-[0.2em] text-[#6B645A]"
            >
              Last edited today · 08:40
            </span>
          </div>

          <div className="mt-1 divide-y divide-[#0E0D0B]/10 border-b border-[#0E0D0B]/10">
            {recentRows.map((row) => (
              <div key={row.title} className="group flex items-center justify-between gap-6 py-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    style={{ fontFamily: 'JetBrains Mono' }}
                    className="hidden w-8 shrink-0 text-center text-[11px] tracking-[0.1em] text-[#C2342A] sm:block"
                  >
                    {String(recentRows.indexOf(row) + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium text-[#1A1713]">{row.title}</div>
                    <div
                      style={{ fontFamily: 'JetBrains Mono' }}
                      className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#6B645A]"
                    >
                      {row.meta}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  {statusTag(row.status)}
                  <ChevronRight
                    size={16}
                    className="text-[#6B645A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1A1713]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FOOTER · COLOPHON ============ */}
        <footer className="mt-14 border-t-2 border-[#0E0D0B] pb-12 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div style={{ fontFamily: 'JetBrains Mono' }} className="text-[11px] uppercase tracking-[0.2em] text-[#6B645A]">
              Free — 2 of 3 lifetime generations used
              <span className="ml-3 inline-flex items-center gap-1 align-middle">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-[6px] w-4 ${n <= 2 ? 'bg-[#1A1713]' : 'bg-[#0E0D0B]/15'}`}
                  />
                ))}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span
                style={{ fontFamily: 'JetBrains Mono' }}
                className="text-[11px] uppercase tracking-[0.2em] text-[#6B645A]"
              >
                Style · Slideshows · Plan
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#C2342A] hover:text-[#1A1713]"
              >
                <CreditCard size={14} />
                Upgrade to Pro
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

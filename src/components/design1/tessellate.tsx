import type { CSSProperties } from 'react';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileText,
  LayoutGrid,
  List,
  PenLine,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';

const MONO: CSSProperties = { fontFamily: 'JetBrains Mono' };
const TITLE_FONT: CSSProperties = { fontFamily: 'Inter Tight', fontWeight: 700 };
const SLIDE_GRADIENT =
  'linear-gradient(180deg,#EFC15C 0%,#6B4A16 58%,#17120B 100%)';
const TILE =
  'rounded-lg border border-[#E2E6EC] bg-white p-5 transition-colors hover:border-[#C7CDD8]';
const M_ID =
  'text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3AF]';

function TileHead({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={MONO} className={M_ID}>{id}</span>
      <span className="flex gap-[3px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[3px] w-[3px] rounded-full bg-[#C7CDD8]" />
        ))}
      </span>
    </div>
  );
}

export function Preview() {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden"
      style={{ fontFamily: 'Figtree' }}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-[#E2E6EC] bg-[#F3F5F7] shadow-sm">
        <div className="flex h-6 shrink-0 items-center gap-1 border-b border-[#E2E6EC] bg-white px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E2E6EC]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#E2E6EC]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#E2E6EC]" />
          <span style={MONO} className="ml-auto text-[7px] uppercase tracking-[0.14em] text-[#9AA3AF]">Daily Grind</span>
          <LayoutGrid className="ml-1 h-2.5 w-2.5 text-[#9AA3AF]" />
        </div>
        <div className="flex h-6 shrink-0 items-center gap-0.5 border-b border-[#E2E6EC] bg-white px-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#E7E9FC] text-[#4F5BD5]"><LayoutGrid className="h-2.5 w-2.5" /></span>
          <span className="flex h-4 w-4 items-center justify-center text-[#9AA3AF]"><List className="h-2.5 w-2.5" /></span>
          <span className="flex h-4 w-4 items-center justify-center text-[#9AA3AF]"><Settings className="h-2.5 w-2.5" /></span>
          <span className="ml-auto flex w-14 items-center gap-1 rounded border border-[#E2E6EC] bg-[#F3F5F7] px-1.5 py-0.5">
            <Search className="h-2 w-2 text-[#9AA3AF]" />
            <span className="text-[6px] text-[#9AA3AF]">Search</span>
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-1.5 p-1.5">
          <div className="col-span-1 row-span-2 flex flex-col rounded-md border border-[#E2E6EC] bg-white p-1.5">
            <span style={MONO} className="text-[6px] uppercase tracking-[0.14em] text-[#9AA3AF]">01 · Generate</span>
            <p style={TITLE_FONT} className="mt-1 text-[8px] text-[#171B24]">New slideshow</p>
            <p className="mt-0.5 text-[6px] leading-snug text-[#6A7280]">We write the slides from one idea.</p>
            <div className="mt-1.5 rounded border border-[#C7CDD8] bg-white px-1.5 py-1 text-[6px] text-[#9AA3AF]">What's this slideshow about?</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="flex items-center gap-0.5 rounded bg-[#4F5BD5] px-1.5 py-1 text-[6px] font-semibold text-white"><Sparkles className="h-2 w-2" />Generate</span>
              <span style={MONO} className="text-[5px] uppercase tracking-[0.1em] text-[#9AA3AF]">~40s</span>
            </div>
            <div className="mt-1 flex items-center gap-1 rounded bg-[#DFF3EA] px-1.5 py-1">
              <CheckCircle2 className="h-2 w-2 shrink-0 text-[#2F9E77]" />
              <span className="truncate text-[6px] text-[#2F9E77]">Ready in 38s</span>
            </div>
            <div className="mt-auto flex flex-wrap gap-1">
              <span className="rounded-full border border-[#E2E6EC] bg-[#F3F5F7] px-1.5 py-0.5 text-[6px] text-[#6A7280]">3 signs…</span>
              <span className="rounded-full border border-[#E2E6EC] bg-[#F3F5F7] px-1.5 py-0.5 text-[6px] text-[#6A7280]">5am routine</span>
              <span className="flex items-center gap-0.5 rounded-full border border-dashed border-[#C7CDD8] px-1.5 py-0.5 text-[6px] text-[#9AA3AF]"><Plus className="h-1.5 w-1.5" />Add</span>
            </div>
          </div>
          <div className="col-span-1 rounded-md border border-[#E2E6EC] bg-white p-1.5">
            <span style={MONO} className="text-[6px] uppercase tracking-[0.14em] text-[#9AA3AF]">03 · Plan</span>
            <p style={TITLE_FONT} className="mt-1 text-[7px] text-[#171B24]">Plan</p>
            <div className="mt-1 flex items-center gap-1">
              <span style={MONO} className="rounded bg-[#EEF0F3] px-1 py-[1px] text-[5px] uppercase tracking-[0.08em] text-[#6A7280]">Free</span>
              <span style={MONO} className="ml-auto text-[5px] uppercase text-[#9AA3AF]">2/3</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-[#E2E6EC]">
              <div className="h-full w-2/3 rounded-full bg-[#4F5BD5]" />
            </div>
            <span className="mt-1 flex items-center justify-center gap-0.5 rounded border border-[#4F5BD5] px-1 py-[3px] text-[6px] font-semibold text-[#4F5BD5]"><Zap className="h-1.5 w-1.5" />Upgrade</span>
          </div>
          <div className="col-span-1 rounded-md border border-[#E2E6EC] bg-white p-1.5">
            <span style={MONO} className="text-[6px] uppercase tracking-[0.14em] text-[#9AA3AF]">02 · Queue</span>
            <p style={TITLE_FONT} className="mt-1 text-[7px] text-[#171B24]">Slideshows</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between gap-1 rounded border border-[#E2E6EC] px-1.5 py-1">
                <span className="truncate text-[6px] text-[#171B24]">5 signs you're not lazy</span>
                <span style={MONO} className="flex shrink-0 items-center gap-0.5 text-[5px] uppercase text-[#6A7280]"><span className="h-1 w-1 rounded-full bg-[#9AA3AF]" />Draft</span>
              </div>
              <div className="flex items-center justify-between gap-1 rounded border border-[#E2E6EC] px-1.5 py-1">
                <span className="truncate text-[6px] text-[#171B24]">Money habits</span>
                <span style={MONO} className="flex shrink-0 items-center gap-0.5 text-[5px] uppercase text-[#4F5BD5]"><span className="h-1 w-1 rounded-full bg-[#4F5BD5]" />Ready</span>
              </div>
            </div>
          </div>
          <div className="col-span-1 rounded-md border border-[#E2E6EC] bg-white p-1.5">
            <span style={MONO} className="text-[6px] uppercase tracking-[0.14em] text-[#9AA3AF]">04 · Style</span>
            <div className="mt-1 space-y-[3px]">
              <div className="flex items-baseline justify-between gap-1"><span style={MONO} className="text-[5px] uppercase text-[#9AA3AF]">Niche</span><span className="text-[6px] text-[#171B24]">Self-improvement</span></div>
              <div className="flex items-baseline justify-between gap-1"><span style={MONO} className="text-[5px] uppercase text-[#9AA3AF]">Audience</span><span className="text-[6px] text-[#171B24]">Men 18–34</span></div>
              <div className="flex items-baseline justify-between gap-1"><span style={MONO} className="text-[5px] uppercase text-[#9AA3AF]">Voice</span><span className="text-[6px] text-[#171B24]">Short lines. Gold slides.</span></div>
            </div>
          </div>
          <div className="col-span-1 rounded-md border border-[#E2E6EC] bg-white p-1.5">
            <span style={MONO} className="text-[6px] uppercase tracking-[0.14em] text-[#9AA3AF]">05 · Export</span>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="relative h-10 w-6 shrink-0 overflow-hidden rounded-sm border border-[#E2E6EC]" style={{ background: SLIDE_GRADIENT }}>
                <p style={TITLE_FONT} className="px-[3px] pt-1 text-[5px] leading-none text-white">Daily Grind</p>
                <p style={MONO} className="absolute inset-x-0 bottom-[2px] text-center text-[4px] text-white/60">01/10</p>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="flex items-center justify-center gap-0.5 rounded bg-[#4F5BD5] px-1 py-[3px] text-[6px] font-semibold text-white"><Download className="h-1.5 w-1.5" />PNG 1080×1920</span>
                <span className="flex items-center justify-center gap-0.5 rounded border border-[#E2E6EC] px-1 py-[3px] text-[6px] text-[#6A7280]"><Copy className="h-1.5 w-1.5" />Hook + caption</span>
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
      style={{ fontFamily: 'Figtree' }}
      className="min-h-screen w-full bg-[#F3F5F7] text-[#171B24]"
    >
      <div className="mx-auto flex min-h-screen max-w-[1280px]">
        <aside className="flex w-14 shrink-0 flex-col items-center gap-1.5 border-r border-[#E2E6EC] bg-white py-4">
          <div className="mb-2 grid grid-cols-2 gap-[3px]" aria-hidden>
            <span className="h-[5px] w-[5px] rounded-[1px] bg-[#4F5BD5]" />
            <span className="h-[5px] w-[5px] rounded-[1px] bg-[#9AA3AF]" />
            <span className="h-[5px] w-[5px] rounded-[1px] bg-[#9AA3AF]" />
            <span className="h-[5px] w-[5px] rounded-[1px] bg-[#C7CDD8]" />
          </div>
          <button aria-label="Grid" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7E9FC] text-[#4F5BD5]"><LayoutGrid className="h-[18px] w-[18px]" /></button>
          <button aria-label="List" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA3AF] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]"><List className="h-[18px] w-[18px]" /></button>
          <div className="flex-1" />
          <button aria-label="Settings" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA3AF] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]"><Settings className="h-[18px] w-[18px]" /></button>
          <button aria-label="Account" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA3AF] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]"><User className="h-[18px] w-[18px]" /></button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#E2E6EC] bg-white px-5">
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F5BD5] text-white"><LayoutGrid className="h-4 w-4" /></div>
              <span className="text-[15px] font-bold tracking-tight text-[#171B24]">Elion</span>
            </div>
            <div className="h-5 w-px bg-[#E2E6EC]" />
            <div className="flex items-center gap-1.5">
              <span style={MONO} className="hidden text-[9px] uppercase tracking-[0.16em] text-[#9AA3AF] sm:block">Project</span>
              <span className="text-[13px] font-semibold text-[#171B24]">Daily Grind</span>
              <ChevronRight className="h-3.5 w-3.5 rotate-90 text-[#9AA3AF]" />
            </div>
            <nav className="ml-3 hidden items-center gap-1 md:flex" aria-label="Sections">
              <span className="rounded-md px-2.5 py-1 text-[12px] font-medium text-[#6A7280] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]">Style</span>
              <span className="rounded-md bg-[#E7E9FC] px-2.5 py-1 text-[12px] font-semibold text-[#4F5BD5]">Slideshows</span>
              <span className="rounded-md px-2.5 py-1 text-[12px] font-medium text-[#6A7280] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]">Plan</span>
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden w-64 items-center gap-2 rounded-lg border border-[#E2E6EC] bg-[#F3F5F7] px-3 py-1.5 sm:flex">
                <Search className="h-4 w-4 text-[#9AA3AF]" />
                <span className="text-[13px] text-[#9AA3AF]">Search slideshows…</span>
              </div>
              <button aria-label="Notifications" className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#6A7280] transition-colors hover:bg-[#F3F5F7]">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4F5BD5]" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171B24] text-[11px] font-semibold text-white">DG</div>
            </div>
          </header>

          <div className="flex items-end justify-between px-6 pt-6">
            <div>
              <h1 style={TITLE_FONT} className="text-[20px] leading-none text-[#171B24]">Slideshows</h1>
              <p className="mt-1.5 text-[13px] text-[#6A7280]">Drop an idea in the grid. Tiles stay where you put them.</p>
            </div>
            <span style={MONO} className="hidden text-[9px] uppercase tracking-[0.16em] text-[#9AA3AF] sm:block">5 modules · auto-saved</span>
          </div>

          <main className="p-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className={`${TILE} flex flex-col xl:row-span-2`}>
                <TileHead id="01 · Generate" />
                <h2 style={TITLE_FONT} className="mt-4 text-[16px] text-[#171B24]">New slideshow</h2>
                <p className="mt-1 text-[13px] text-[#6A7280]">Paste an idea. We write the slides, the hook, and the captions.</p>
                <span style={MONO} className="mb-1.5 mt-4 text-[9px] uppercase tracking-[0.16em] text-[#6A7280]">Idea</span>
                <input
                  placeholder="What's this slideshow about?"
                  className="w-full rounded-lg border border-[#C7CDD8] bg-white px-3.5 py-3 text-[14px] text-[#171B24] outline-none placeholder:text-[#9AA3AF] focus:border-[#4F5BD5] focus:ring-2 focus:ring-[#4F5BD5]/15"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <button className="flex items-center gap-2 rounded-lg bg-[#4F5BD5] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#414DC4]">
                    <Sparkles className="h-4 w-4" />
                    Generate slideshow
                  </button>
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">~40s · 10 slides</span>
                </div>
                <div style={MONO} className="mt-3 flex items-center gap-2 rounded-lg bg-[#F3F5F7] px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-[#6A7280]">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-[#9AA3AF]" />
                  <span>Hook · slide scripts · captions · hashtags · 1080×1920 PNG</span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#DFF3EA] bg-[#F5FBF7] px-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2F9E77]" />
                  <p className="text-[12.5px] leading-snug text-[#2F9E77]">
                    Last run ready in 38s — <span className="font-semibold">“Money habits of disciplined people”</span> is in your slideshows.
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.16em] text-[#9AA3AF]">Try an idea</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button className="max-w-[240px] truncate rounded-full border border-[#E2E6EC] bg-white px-3 py-1.5 text-[12px] text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]">3 signs you're not lazy — you're just tired</button>
                    <button className="max-w-[240px] truncate rounded-full border border-[#E2E6EC] bg-white px-3 py-1.5 text-[12px] text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]">Money habits of disciplined people</button>
                    <button className="max-w-[240px] truncate rounded-full border border-[#E2E6EC] bg-white px-3 py-1.5 text-[12px] text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]">How to build a 5am routine</button>
                    <button className="flex items-center gap-1 rounded-full border border-dashed border-[#C7CDD8] px-3 py-1.5 text-[12px] text-[#6A7280] transition-colors hover:border-[#4F5BD5] hover:text-[#4F5BD5]"><Plus className="h-3.5 w-3.5" />Add idea</button>
                  </div>
                </div>
              </section>

              <section className={`${TILE} flex flex-col`}>
                <TileHead id="03 · Plan" />
                <h2 style={TITLE_FONT} className="mt-4 text-[15px] text-[#171B24]">Plan</h2>
                <div className="mt-3 flex items-center justify-between">
                  <span style={MONO} className="rounded-md bg-[#EEF0F3] px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-[#6A7280]">Free</span>
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Lifetime</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-[#E2E6EC]">
                  <div className="h-full w-2/3 rounded-full bg-[#4F5BD5]" />
                </div>
                <p className="mt-2 text-[12.5px] text-[#6A7280]">2 of 3 lifetime generations used</p>
                <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#4F5BD5] bg-white px-3 py-2 text-[12.5px] font-semibold text-[#4F5BD5] transition-colors hover:bg-[#E7E9FC]"><Zap className="h-3.5 w-3.5" />Upgrade to Pro</button>
              </section>

              <section className={`${TILE} flex flex-col`}>
                <TileHead id="02 · Queue" />
                <div className="mt-4 flex items-baseline justify-between">
                  <h2 style={TITLE_FONT} className="text-[15px] text-[#171B24]">Slideshows</h2>
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Recent</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E6EC] px-3 py-2.5 transition-colors hover:border-[#C7CDD8]">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#171B24]">5 signs you're not lazy</p>
                      <p style={MONO} className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-[#9AA3AF]"><Clock className="h-2.5 w-2.5" />2h ago</p>
                    </div>
                    <span style={MONO} className="flex shrink-0 items-center gap-1 rounded-md bg-[#EEF0F3] px-1.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-[#6A7280]"><span className="h-1 w-1 rounded-full bg-[#9AA3AF]" />Draft</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E6EC] px-3 py-2.5 transition-colors hover:border-[#C7CDD8]">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#171B24]">Money habits of disciplined people</p>
                      <p style={MONO} className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-[#9AA3AF]"><Clock className="h-2.5 w-2.5" />1d ago</p>
                    </div>
                    <span style={MONO} className="flex shrink-0 items-center gap-1 rounded-md bg-[#E7E9FC] px-1.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-[#4F5BD5]"><span className="h-1 w-1 rounded-full bg-[#4F5BD5]" />Ready</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E6EC] px-3 py-2.5 transition-colors hover:border-[#C7CDD8]">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#171B24]">How to build a 5am routine</p>
                      <p style={MONO} className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-[#9AA3AF]"><Clock className="h-2.5 w-2.5" />3d ago</p>
                    </div>
                    <span style={MONO} className="flex shrink-0 items-center gap-1 rounded-md bg-[#DFF3EA] px-1.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-[#2F9E77]"><span className="h-1 w-1 rounded-full bg-[#2F9E77]" />Exported</span>
                  </div>
                </div>
                <div className="mt-auto pt-3">
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-[#4F5BD5]">View all slideshows<ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </section>

              <section className={`${TILE} flex flex-col`}>
                <div className="flex items-start justify-between">
                  <span style={MONO} className={M_ID}>04 · Style</span>
                  <button aria-label="Edit style" className="flex h-6 w-6 items-center justify-center rounded-md text-[#9AA3AF] transition-colors hover:bg-[#F3F5F7] hover:text-[#171B24]"><PenLine className="h-3.5 w-3.5" /></button>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h2 style={TITLE_FONT} className="text-[15px] text-[#171B24]">Style</h2>
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Saved voice</span>
                </div>
                <div className="mt-1 divide-y divide-[#E2E6EC]">
                  <div className="flex items-start justify-between gap-3 py-2.5"><span style={MONO} className="mt-0.5 shrink-0 text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Niche</span><span className="text-right text-[12.5px] text-[#171B24]">Self-improvement</span></div>
                  <div className="flex items-start justify-between gap-3 py-2.5"><span style={MONO} className="mt-0.5 shrink-0 text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">App name</span><span className="text-right text-[12.5px] text-[#171B24]">Daily Grind</span></div>
                  <div className="flex items-start justify-between gap-3 py-2.5"><span style={MONO} className="mt-0.5 shrink-0 text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Audience</span><span className="text-right text-[12.5px] text-[#171B24]">Men 18–34 on TikTok</span></div>
                  <div className="flex items-start justify-between gap-3 py-2.5"><span style={MONO} className="mt-0.5 shrink-0 text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Style memory</span><span className="max-w-[200px] text-right text-[12px] leading-snug text-[#171B24]">Short punchy lines. Dark gold-and-black gradient slides. No emojis.</span></div>
                </div>
              </section>

              <section className={`${TILE} flex flex-col`}>
                <TileHead id="05 · Export" />
                <div className="mt-4 flex items-baseline justify-between">
                  <h2 style={TITLE_FONT} className="text-[15px] text-[#171B24]">Export</h2>
                  <span style={MONO} className="text-[9px] uppercase tracking-[0.14em] text-[#9AA3AF]">Ready to post</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative h-[112px] w-[62px] shrink-0 overflow-hidden rounded-md border border-[#E2E6EC]" style={{ background: SLIDE_GRADIENT }}>
                    <p style={TITLE_FONT} className="px-1.5 pt-2 text-[12px] leading-tight text-white">Daily Grind</p>
                    <p style={MONO} className="absolute inset-x-0 bottom-1 text-center text-[7px] uppercase tracking-[0.1em] text-white/60">01 / 10</p>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg bg-[#4F5BD5] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#414DC4]"><Download className="h-3.5 w-3.5" />PNG 1080×1920</button>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button className="flex items-center justify-center gap-1 rounded-lg border border-[#E2E6EC] px-2 py-1.5 text-[11px] font-medium text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]"><Copy className="h-3 w-3" />Copy hook</button>
                      <button className="flex items-center justify-center gap-1 rounded-lg border border-[#E2E6EC] px-2 py-1.5 text-[11px] font-medium text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]"><Copy className="h-3 w-3" />Caption</button>
                      <button className="col-span-2 flex items-center justify-center gap-1 rounded-lg border border-[#E2E6EC] px-2 py-1.5 text-[11px] font-medium text-[#6A7280] transition-colors hover:border-[#C7CDD8] hover:text-[#171B24]"><Copy className="h-3 w-3" />Copy hashtags</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

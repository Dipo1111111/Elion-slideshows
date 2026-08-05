import {
  Sparkles,
  Sliders,
  LayoutGrid,
  Star,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Plus,
  Clock,
  CreditCard,
  ArrowRight,
  Play,
  Download,
  ChevronRight,
  FileText,
  PenLine,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TONES = {
  gold: 'from-[#241A10] to-[#C08A2D]',
  blaze: 'from-[#C08A2D] to-[#B4552D]',
  ember: 'from-[#B4552D] to-[#7A2E16]',
} as const;

type Tone = keyof typeof TONES;

function StatusTag({ status }: { status: 'Draft' | 'Ready' | 'Exported' }) {
  const chip = {
    Draft: 'bg-[#F0E3C8] text-[#8A6A24]',
    Ready: 'bg-[#E3EDE3] text-[#356C48]',
    Exported: 'bg-[#EDE5D6] text-[#6B5B48]',
  } as const;
  const dot = {
    Draft: 'bg-[#C9A227]',
    Ready: 'bg-[#3E7B52]',
    Exported: 'bg-[#8A7A62]',
  } as const;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 ${chip[status]}`}
      style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

function Thumb({ tone, count, className = 'w-14' }: { tone: Tone; count: string; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${TONES[tone]} ${className}`}
    >
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#F5E7D2' }}
      >
        {count}
      </span>
      <span
        className="absolute left-1 top-1 rounded-[3px] bg-black/20 px-1 py-px text-[7px]"
        style={{ fontFamily: 'JetBrains Mono', color: '#EAD9B8', letterSpacing: '0.08em' }}
      >
        9:16
      </span>
    </div>
  );
}

function Field({ label, value, textarea = false }: { label: string; value: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#6B5B48]">{label}</span>
      {textarea ? (
        <div className="whitespace-pre-line rounded-xl border border-[#E3D8C6] bg-[#FBF5E9] px-3.5 py-2.5 text-sm leading-relaxed text-[#33291F]">
          {value}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E3D8C6] bg-[#FBF5E9] px-3.5 py-2.5 text-sm text-[#33291F]">
          {value}
        </div>
      )}
    </label>
  );
}

function MiniField({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-0.5 block text-[8px] font-bold text-[#6B5B48]">{label}</span>
      <div className="truncate rounded-lg border border-[#E3D8C6] bg-[#FBF5E9] px-2 py-1 text-[9px] text-[#33291F]">
        {value}
      </div>
    </label>
  );
}

function RailItem({ icon: Icon, label, active = false }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <button
      className={`flex w-full flex-col items-center gap-1 rounded-xl py-2 ${
        active ? 'bg-[#EBD9C2]' : 'hover:bg-[#EFE4D2]'
      }`}
    >
      <Icon className={`h-[18px] w-[18px] ${active ? 'text-[#B4552D]' : 'text-[#7A6A55]'}`} />
      {label ? (
        <span className={`text-[10px] ${active ? 'font-bold text-[#B4552D]' : 'font-semibold text-[#7A6A55]'}`}>
          {label}
        </span>
      ) : null}
    </button>
  );
}

const CARD = 'bg-[#FAF5EC] rounded-2xl shadow-[0_1px_2px_rgba(51,41,31,0.05),0_10px_28px_-18px_rgba(51,41,31,0.28)]';

const RECENT: Array<{
  title: string;
  status: 'Draft' | 'Ready' | 'Exported';
  count: string;
  time: string;
  tone: Tone;
  Action: LucideIcon;
}> = [
  { title: "5 signs you're not lazy", status: 'Ready', count: '12', time: '2h ago', tone: 'gold', Action: Play },
  { title: 'Money habits of disciplined people', status: 'Draft', count: '9', time: 'Yesterday', tone: 'blaze', Action: PenLine },
  { title: 'How to build a 5am routine', status: 'Exported', count: '8', time: '3d ago', tone: 'ember', Action: Download },
];

export function Preview() {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-[#E3D8C6] bg-[#F1E9DD] shadow-[0_1px_2px_rgba(51,41,31,0.05),0_16px_40px_-20px_rgba(51,41,31,0.35)]"
      style={{ fontFamily: 'Manrope' }}
    >
      <div className="flex h-full">
        <aside className="flex w-9 shrink-0 flex-col items-center border-r border-[#E3D8C6] bg-[#F7EFE1] py-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#33291F] text-[#F7EFE1]">
            <Sparkles className="h-3 w-3" />
          </span>
          <div className="mt-1.5 flex flex-col gap-0.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EBD9C2] text-[#B4552D]">
              <Sliders className="h-3 w-3" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[#7A6A55]">
              <LayoutGrid className="h-3 w-3" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[#7A6A55]">
              <Star className="h-3 w-3" />
            </span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-[#E3D8C6] px-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#E3B38A]" />
                <span className="h-2 w-2 rounded-full bg-[#E3D8C6]" />
                <span className="h-2 w-2 rounded-full bg-[#C9BFA8]" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#33291F]">
                <Home className="h-2.5 w-2.5 text-[#7A6A55]" />
                <ChevronRight className="h-2.5 w-2.5 text-[#B9A88E]" />
                Style
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-14 items-center gap-1 rounded border border-[#E3D8C6] bg-[#FBF5E9] px-1.5">
                <Search className="h-2.5 w-2.5 shrink-0 text-[#7A6A55]" />
                <span className="truncate text-[8px] text-[#A99A82]">Search</span>
              </div>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B4552D] text-[#FBF3E8]">
                <User className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] gap-2 p-2.5">
            <div className="flex min-w-0 flex-col rounded-xl bg-[#FAF5EC] p-2.5">
              <p
                className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#B4552D]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                Style
              </p>
              <h3
                className="mt-0.5 text-[13px] font-semibold leading-tight text-[#33291F]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                New slideshow
              </h3>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <MiniField label="Niche" value="Self-improvement" />
                <MiniField label="App name" value="Daily Grind" />
              </div>

              <MiniField
                className="mt-1.5"
                label="Style memory"
                value="Short punchy lines. Dark gold-and-black gradient slides. No emojis."
              />

              <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-[#E3D8C6] bg-[#FBF5E9] px-2 py-1.5">
                <PenLine className="h-3 w-3 shrink-0 text-[#B4552D]" />
                <span className="truncate text-[9px] text-[#33291F]">3 signs you're not lazy — you're just tired</span>
              </div>

              <button className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#B4552D] py-2 text-[10px] font-bold text-[#FBF3E8]">
                <Sparkles className="h-3 w-3" />
                Generate slideshow
              </button>

              <p className="mt-1.5 text-[8px] leading-snug text-[#7A6A55]">
                Script, 1080×1920 backgrounds, hook, caption &amp; hashtags — ready to post.
              </p>
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="mb-1.5 flex items-center justify-between">
                <p
                  className="text-[11px] font-semibold text-[#33291F]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Recent slideshows
                </p>
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FBF5E9] text-[#6B5B48]">
                  <Plus className="h-2.5 w-2.5" />
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-1.5">
                {RECENT.map((r) => (
                  <div key={r.title} className="flex items-center gap-1.5 rounded-lg bg-[#FAF5EC] p-1.5">
                    <Thumb tone={r.tone} count={r.count} className="w-7" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[9px] font-bold text-[#33291F]">{r.title}</p>
                      <div className="mt-0.5">
                        <StatusTag status={r.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between rounded-lg bg-[#FAF5EC] px-2 py-1.5">
                <span className="flex items-center gap-1 text-[8px] font-bold text-[#6B5B48]">
                  <CreditCard className="h-2.5 w-2.5 text-[#B4552D]" />
                  Free · 2 of 3 used
                </span>
                <span className="text-[7px] font-bold text-[#B4552D]" style={{ fontFamily: 'JetBrains Mono' }}>
                  1 LEFT
                </span>
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
      style={{ fontFamily: 'Manrope' }}
      className="min-h-screen w-full bg-[#F1E9DD] text-[#33291F]"
    >
      <div className="flex min-h-screen">
        <aside className="flex w-[76px] shrink-0 flex-col items-center gap-1.5 border-r border-[#E3D8C6] bg-[#F7EFE1] px-3 py-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#33291F] text-[#F7EFE1]">
            <Sparkles className="h-5 w-5" />
          </div>
          <RailItem icon={Sliders} label="Style" active />
          <RailItem icon={LayoutGrid} label="Slideshows" />
          <RailItem icon={Star} label="Plan" />
          <div className="mt-auto flex flex-col items-center gap-1.5">
            <RailItem icon={Settings} label="" />
            <RailItem icon={LogOut} label="" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-6 border-b border-[#E3D8C6] bg-[#F7EFE1]/60 px-8">
            <div className="flex items-center gap-1.5 text-sm">
              <Home className="h-4 w-4 text-[#7A6A55]" />
              <ChevronRight className="h-3.5 w-3.5 text-[#B9A88E]" />
              <span className="font-bold text-[#33291F]">Style</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex w-64 items-center gap-2 rounded-xl border border-[#E3D8C6] bg-[#FBF5E9] px-3 py-2">
                <Search className="h-4 w-4 text-[#7A6A55]" />
                <span className="text-sm text-[#A99A82]">Search slideshows</span>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3D8C6] bg-[#FBF5E9] text-[#7A6A55]">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B4552D] text-[#FBF3E8]">
                <User className="h-4 w-4" />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1280px] flex-1 px-10 py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
              <section className={`${CARD} p-8`}>
                <div className="mb-7 flex items-end justify-between gap-4">
                  <div>
                    <p
                      className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#B4552D]"
                      style={{ fontFamily: 'JetBrains Mono' }}
                    >
                      Style
                    </p>
                    <h1
                      className="text-[28px] leading-tight text-[#33291F]"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      New slideshow
                    </h1>
                  </div>
                  <span
                    className="rounded-full border border-[#E3D8C6] bg-[#F1E9DD] px-3 py-1 text-[10px] font-bold text-[#6B5B48]"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    1080×1920 · 9:16
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Niche" value="Self-improvement" />
                  <Field label="App name" value="Daily Grind" />
                  <Field label="Audience" value="Men 18–34 on TikTok" />
                  <div className="hidden sm:block" />
                  <div className="sm:col-span-2">
                    <Field
                      label="Style memory"
                      textarea
                      value="Short punchy lines. Dark gold-and-black gradient slides. No emojis."
                    />
                  </div>
                </div>

                <div className="mt-7 border-t border-[#E3D8C6] pt-7">
                  <label className="mb-1.5 block text-xs font-bold text-[#6B5B48]">
                    What's this slideshow about?
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-[#E3D8C6] bg-[#FBF5E9] px-3.5 py-3">
                    <PenLine className="h-4 w-4 shrink-0 text-[#B4552D]" />
                    <span className="truncate text-sm text-[#33291F]">
                      3 signs you're not lazy — you're just tired
                    </span>
                    <span
                      className="ml-auto shrink-0 text-[10px] font-bold text-[#A99A82]"
                      style={{ fontFamily: 'JetBrains Mono' }}
                    >
                      ~10 SLIDES
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#B4552D] px-5 py-3 text-sm font-bold text-[#FBF3E8] shadow-[0_10px_24px_-10px_rgba(180,85,45,0.75)]">
                    <Sparkles className="h-4 w-4" />
                    Generate slideshow
                  </button>
                  <p className="text-[13px] leading-relaxed text-[#7A6A55]">
                    You'll get a slide script, 1080×1920 backgrounds, hook, caption, and hashtags — ready to
                    paste into the TikTok app.
                  </p>
                </div>
              </section>

              <aside className="flex flex-col gap-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2
                      className="text-lg font-semibold text-[#33291F]"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Recent slideshows
                    </h2>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D8C6] bg-[#FBF5E9] px-3 py-1.5 text-xs font-bold text-[#6B5B48]">
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {RECENT.map((r) => {
                      const Action = r.Action;
                      return (
                        <div key={r.title} className={`${CARD} flex items-center gap-4 p-3.5`}>
                          <Thumb tone={r.tone} count={r.count} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#33291F]">{r.title}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <StatusTag status={r.status} />
                              <span className="flex shrink-0 items-center gap-1 text-[11px] text-[#7A6A55]">
                                <Clock className="h-3 w-3" />
                                {r.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span
                              className="flex items-center gap-1 text-[10px] font-bold text-[#7A6A55]"
                              style={{ fontFamily: 'JetBrains Mono' }}
                            >
                              <FileText className="h-3 w-3" />
                              {r.count} slides
                            </span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F1E9DD] text-[#6B5B48]">
                              <Action className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`${CARD} mt-auto p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0E3C8] text-[#B4552D]">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#33291F]">Free plan</p>
                        <p className="text-[11px] text-[#7A6A55]">Lifetime generations</p>
                      </div>
                    </div>
                    <span
                      className="rounded-full bg-[#F0E3C8] px-2.5 py-1 text-[10px] font-bold text-[#8A6A24]"
                      style={{ fontFamily: 'JetBrains Mono' }}
                    >
                      FREE
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs text-[#7A6A55]">Free · 2 of 3 lifetime generations used</span>
                      <span
                        className="shrink-0 text-[10px] font-bold text-[#B4552D]"
                        style={{ fontFamily: 'JetBrains Mono' }}
                      >
                        1 LEFT
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EBD9C2]">
                      <div className="h-full w-2/3 rounded-full bg-[#B4552D]" />
                    </div>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#B4552D]">
                    View plan
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

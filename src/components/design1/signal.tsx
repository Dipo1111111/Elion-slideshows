import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
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
  User,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MONO = { fontFamily: "JetBrains Mono" };

const STATUS_COLOR: Record<string, string> = {
  Draft: "#E0A03C",
  Ready: "#35B6A6",
  Exported: "#46C47C",
};

interface SlideRow {
  title: string;
  status: string;
  slides: number;
  words: number;
  updated: string;
}

const rows: SlideRow[] = [
  { title: "3 signs you're not lazy — you're just tired", status: "Ready", slides: 5, words: 142, updated: "2h ago" },
  { title: "5 signs you're not lazy", status: "Draft", slides: 5, words: 131, updated: "Yesterday" },
  { title: "Money habits of disciplined people", status: "Exported", slides: 7, words: 204, updated: "2d ago" },
  { title: "How to build a 5am routine", status: "Ready", slides: 6, words: 168, updated: "4d ago" },
];

const queue = ["5 signs you're not lazy", "Money habits of disciplined people", "How to build a 5am routine"];

const SLIDE_BG = { background: "linear-gradient(150deg,#1B1307 0%,#3A2A0E 45%,#6B4A12 100%)" };

function StatusTag({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? "#35B6A6";
  return (
    <span className="flex items-center gap-1.5 text-[10px] tracking-wide" style={{ fontFamily: "JetBrains Mono", color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status.toUpperCase()}
    </span>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2.5 border-l-2 px-2.5 py-[7px] text-[12px] hover:bg-[#12171D] " +
        (active
          ? "border-l-[#35B6A6] bg-[#161D25] text-[#E6EDF3]"
          : "border-l-transparent text-[#7E8B99]")
      }
    >
      <Icon className={"h-4 w-4 " + (active ? "text-[#35B6A6]" : "text-[#7E8B99]")} />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span style={MONO} className="bg-[#12171D] px-1.5 py-0.5 text-[9px] text-[#7E8B99]">
          {badge}
        </span>
      ) : null}
      {active ? <ChevronRight className="h-3 w-3 text-[#35B6A6]" /> : null}
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0D1218] px-2.5 py-2">
      <div style={MONO} className="text-[8px] uppercase tracking-[0.14em] text-[#7E8B99]">
        {label}
      </div>
      <div style={MONO} className="mt-0.5 text-[11px] text-[#E6EDF3]">
        {value}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={MONO} className="text-[8px] uppercase tracking-[0.16em] text-[#7E8B99]">
        {label}
      </div>
      <div className="mt-0.5 text-[11px] leading-snug text-[#E6EDF3]">{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={MONO} className="text-[9px] uppercase tracking-[0.18em] text-[#7E8B99]">
      {children}
    </div>
  );
}

function PlanMeter({ compact }: { compact?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span style={MONO} className="text-[9px] tracking-wider text-[#7E8B99]">
          FREE · 2/3 LIFETIME
        </span>
        <span style={MONO} className="text-[9px] text-[#35B6A6]">
          GENERATIONS
        </span>
      </div>
      <div className={"mt-2 flex w-full gap-px " + (compact ? "h-1" : "h-1.5")}>
        <div className="flex-1 bg-[#35B6A6]" />
        <div className="flex-1 bg-[#35B6A6]" />
        <div className="flex-1 bg-[#1F2831]" />
      </div>
      <div className="mt-2 flex items-start justify-between">
        <p className="text-[10px] leading-snug text-[#7E8B99]">2 of 3 lifetime generations used</p>
        <Zap className="h-3.5 w-3.5 shrink-0 text-[#E0A03C]" />
      </div>
    </div>
  );
}

function Inspector() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-[#1F2831] bg-[#0D1218] xl:flex">
      <div className="flex h-14 items-center border-b border-[#1F2831] px-4">
        <SectionLabel>Inspector</SectionLabel>
        <span style={MONO} className="ml-auto text-[9px] text-[#7E8B99]">
          #044
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <SectionLabel>Selected</SectionLabel>
        <div className="mt-2 text-[13px] leading-snug text-[#E6EDF3]">
          3 signs you're not lazy — you're just tired
        </div>
        <div className="mt-2.5">
          <StatusTag status="Ready" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px border border-[#1F2831] bg-[#1F2831]">
          <MetaCell label="Slides" value="5" />
          <MetaCell label="Words" value="142" />
          <MetaCell label="Format" value="1080×1920" />
          <MetaCell label="Run" value="#04" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <SectionLabel>Hook</SectionLabel>
            <p className="mt-0.5 text-[11px] leading-snug text-[#E6EDF3]">
              3 signs you're not lazy — you're just tired.
            </p>
          </div>
          <div>
            <SectionLabel>Caption</SectionLabel>
            <p className="mt-0.5 text-[11px] leading-snug text-[#E6EDF3]">
              Read #3 and go to bed. Save this for tomorrow morning.
            </p>
          </div>
          <div>
            <SectionLabel>Hashtags</SectionLabel>
            <p style={MONO} className="mt-0.5 text-[10px] leading-snug text-[#E6EDF3]">
              #selfimprovement #discipline #rest #routine
            </p>
          </div>
        </div>

        <div className="mt-4">
          <SectionLabel>Backgrounds</SectionLabel>
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 w-8" style={{ ...SLIDE_BG, border: "1px solid #1F2831" }} />
            ))}
          </div>
          <p style={MONO} className="mt-1.5 text-[9px] text-[#7E8B99]">
            5 × 1080×1920 PNG · READY
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 bg-[#35B6A6] py-1.5 text-[11px] font-semibold text-[#0A0E12]">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 border border-[#1F2831] bg-[#161D25] py-1.5 text-[11px] text-[#E6EDF3]">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>

        <div className="mt-4 border-t border-[#1F2831] pt-4">
          <SectionLabel>Style — Active</SectionLabel>
          <div className="mt-2.5 space-y-2.5">
            <Field label="Niche" value="Self-improvement" />
            <Field label="App name" value="Daily Grind" />
            <Field label="Audience" value="Men 18–34 on TikTok" />
            <Field label="Style memory" value="Short punchy lines. Dark gold-and-black gradient slides. No emojis." />
          </div>
        </div>
      </div>

      <div className="border-t border-[#1F2831] p-4">
        <PlanMeter />
        <button className="mt-3 w-full border border-[#1F2831] bg-[#161D25] py-1.5 text-[11px] text-[#E6EDF3]">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}

export function Page() {
  return (
    <div style={{ fontFamily: "Geist Variable" }} className="min-h-screen w-full bg-[#0A0E12] text-[#E6EDF3]">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col">
        {/* Top status strip */}
        <div
          style={MONO}
          className="flex h-8 shrink-0 items-center border-b border-[#1F2831] bg-[#0D1218] text-[10px]"
        >
          <span className="px-3 text-[#7E8B99]">
            QUEUE <span className="text-[#E6EDF3]">2</span>
          </span>
          <span className="h-3 w-px bg-[#1F2831]" />
          <span className="px-3 text-[#7E8B99]">
            GENERATED TODAY <span className="text-[#E6EDF3]">3</span>
          </span>
          <span className="h-3 w-px bg-[#1F2831]" />
          <span className="px-3 text-[#7E8B99]">
            MODEL <span className="text-[#E6EDF3]">gemini-2.5-flash</span>
          </span>
          <span className="h-3 w-px bg-[#1F2831]" />
          <span className="px-3 text-[#7E8B99]">
            UPTIME <span className="text-[#46C47C]">99.98%</span>
          </span>
          <span className="ml-auto flex items-center gap-1.5 px-3 text-[#7E8B99]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#46C47C]" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="hidden w-60 shrink-0 flex-col border-r border-[#1F2831] bg-[#0D1218] md:flex">
            <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-[#1F2831] px-4">
              <div className="flex h-7 w-7 items-center justify-center bg-[#35B6A6]">
                <LayoutGrid className="h-4 w-4 text-[#0A0E12]" />
              </div>
              <div className="leading-none">
                <div style={MONO} className="text-[13px] font-bold tracking-[0.18em] text-[#E6EDF3]">
                  ELION
                </div>
                <div style={MONO} className="mt-1 text-[8px] tracking-[0.2em] text-[#7E8B99]">
                  SLIDESHOW OPS
                </div>
              </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <div style={MONO} className="px-1.5 pb-2 text-[9px] uppercase tracking-[0.18em] text-[#7E8B99]">
                Workspace
              </div>
              <NavItem icon={Sliders} label="Style" />
              <NavItem icon={List} label="Slideshows" active badge="04" />
              <NavItem icon={CreditCard} label="Plan" />
              <div style={MONO} className="mt-5 px-1.5 pb-2 text-[9px] uppercase tracking-[0.18em] text-[#7E8B99]">
                System
              </div>
              <NavItem icon={BarChart3} label="Usage" />
              <NavItem icon={FileText} label="API" />
              <NavItem icon={Settings} label="Settings" />
            </nav>

            <div className="shrink-0 border-t border-[#1F2831] p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#161D25] text-[#35B6A6]">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-[#E6EDF3]">Dipo</div>
                  <div style={MONO} className="text-[9px] text-[#7E8B99]">
                    Free · 2/3 lifetime
                  </div>
                </div>
                <LogOut className="h-3.5 w-3.5 shrink-0 text-[#7E8B99]" />
              </div>
              <div
                style={MONO}
                className="mt-2.5 flex items-center justify-center border border-[#1F2831] bg-[#12171D] px-2 py-1 text-[9px] tracking-[0.2em] text-[#E0A03C]"
              >
                FREE TIER
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#1F2831] px-5">
              <div>
                <h1 style={MONO} className="text-[13px] font-bold tracking-[0.14em] text-[#E6EDF3]">
                  SLIDESHOWS
                </h1>
                <p className="mt-0.5 text-[11px] text-[#7E8B99]">Every generation, ready to post.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-[#1F2831] bg-[#12171D] px-2.5 py-1.5">
                  <Search className="h-3.5 w-3.5 text-[#7E8B99]" />
                  <span style={MONO} className="text-[10px] text-[#7E8B99]">
                    Search…
                  </span>
                </div>
                <div className="flex h-[30px] w-[30px] items-center justify-center border border-[#1F2831] bg-[#12171D] text-[#7E8B99]">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <button className="flex items-center gap-1.5 bg-[#35B6A6] px-2.5 py-1.5 text-[11px] font-semibold text-[#0A0E12]">
                  <Plus className="h-3.5 w-3.5" /> NEW
                </button>
              </div>
            </div>

            {/* New slideshow — ops command line */}
            <div className="shrink-0 border-b border-[#1F2831] p-5">
              <div className="border border-[#1F2831] bg-[#12171D]">
                <div className="flex items-center gap-3 px-3.5 py-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#35B6A6]" />
                  <span className="flex-1 truncate text-[13px] text-[#7E8B99]">
                    What's this slideshow about?
                  </span>
                  <span style={MONO} className="hidden shrink-0 items-center gap-1 text-[9px] text-[#7E8B99] sm:flex">
                    <Clock className="h-3 w-3" /> ~45s
                  </span>
                  <button className="flex shrink-0 items-center gap-1.5 bg-[#35B6A6] px-3 py-1.5 text-[11px] font-semibold text-[#0A0E12]">
                    Generate <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[#1F2831] px-3.5 py-1.5">
                  <span style={MONO} className="truncate text-[9px] tracking-wide text-[#7E8B99]">
                    WRITES SCRIPT · HOOK · CAPTION · HASHTAGS · RENDERS 1080×1920 BACKGROUNDS
                  </span>
                  <span style={MONO} className="flex shrink-0 items-center gap-1 text-[9px] text-[#46C47C]">
                    <CheckCircle2 className="h-3 w-3" /> LAST RUN 2H AGO · 5 SLIDES READY
                  </span>
                </div>
              </div>
            </div>

            {/* Queue ticker */}
            <div
              style={MONO}
              className="flex shrink-0 items-center gap-2 overflow-hidden border-b border-[#1F2831] bg-[#0D1218] px-5 py-1.5 text-[9px]"
            >
              <span className="shrink-0 tracking-[0.16em] text-[#7E8B99]">QUEUE</span>
              <span className="h-2.5 w-px shrink-0 bg-[#1F2831]" />
              {queue.map((q, i) => (
                <span key={q} className="flex min-w-0 items-center gap-2">
                  {i > 0 ? <span className="shrink-0 text-[#1F2831]">·</span> : null}
                  <span className="truncate text-[#E6EDF3]">{q}</span>
                </span>
              ))}
              <span className="ml-auto shrink-0 text-[#7E8B99]">ETA 45S</span>
            </div>

            {/* Data table */}
            <div className="min-h-0 flex-1 overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr style={MONO} className="text-left text-[9px] uppercase tracking-[0.16em] text-[#7E8B99]">
                    <th className="w-auto border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Title</th>
                    <th className="w-24 border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Status</th>
                    <th className="w-12 border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Slides</th>
                    <th className="w-16 border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Words</th>
                    <th className="w-[92px] border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Updated</th>
                    <th className="w-[120px] border-b border-[#1F2831] bg-[#0D1218] px-4 py-2 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.title} className={i === 0 ? "bg-[#12171D]" : "bg-[#0A0E12]"}>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <div
                          className={
                            "flex items-center gap-2.5 border-l-2 " +
                            (i === 0 ? "border-l-[#35B6A6]" : "border-l-transparent")
                          }
                        >
                          <span className="truncate text-[13px] text-[#E6EDF3]">{r.title}</span>
                        </div>
                      </td>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <StatusTag status={r.status} />
                      </td>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <span style={MONO} className="text-[11px] text-[#E6EDF3]">
                          {r.slides}
                        </span>
                      </td>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <span style={MONO} className="text-[11px] text-[#E6EDF3]">
                          {r.words}
                        </span>
                      </td>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <span style={MONO} className="text-[11px] text-[#7E8B99]">
                          {r.updated}
                        </span>
                      </td>
                      <td className="border-b border-[#1F2831] px-4 py-2.5">
                        <div className="flex items-center gap-0.5">
                          <button className="flex h-7 w-7 items-center justify-center">
                            <Play className={"h-3.5 w-3.5 " + (i === 0 ? "text-[#35B6A6]" : "text-[#7E8B99]")} />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center text-[#7E8B99]">
                            <PenLine className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center text-[#7E8B99]">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center text-[#7E8B99]">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Inspector />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Compact preview ---------------- */

const miniRows: SlideRow[] = [
  { title: "3 signs you're not lazy — you're just tired", status: "Ready", slides: 5, words: 142, updated: "2h" },
  { title: "5 signs you're not lazy", status: "Draft", slides: 5, words: 131, updated: "1d" },
  { title: "Money habits of disciplined people", status: "Exported", slides: 7, words: 204, updated: "2d" },
  { title: "How to build a 5am routine", status: "Ready", slides: 6, words: 168, updated: "4d" },
];

export function Preview() {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden bg-[#0A0E12] text-[#E6EDF3]"
      style={{ fontFamily: "Geist Variable" }}
    >
      {/* Window chrome */}
      <div className="flex h-7 items-center gap-2 border-b border-[#1F2831] bg-[#0D1218] px-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#E05252]" />
          <span className="h-2 w-2 rounded-full bg-[#E0A03C]" />
          <span className="h-2 w-2 rounded-full bg-[#46C47C]" />
        </div>
        <div style={MONO} className="ml-1 flex items-center gap-1.5 text-[9px] text-[#7E8B99]">
          <LayoutGrid className="h-2.5 w-2.5 text-[#35B6A6]" />
          signal — elion studio
        </div>
        <div style={MONO} className="ml-auto flex items-center gap-1 text-[8px] text-[#7E8B99]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#46C47C]" />
          LIVE
        </div>
      </div>

      {/* Status strip */}
      <div
        style={MONO}
        className="flex h-5 items-center gap-2.5 border-b border-[#1F2831] bg-[#0D1218] px-3 text-[7px] text-[#7E8B99]"
      >
        <span>
          QUEUE <span className="text-[#E6EDF3]">2</span>
        </span>
        <span className="text-[#1F2831]">|</span>
        <span>
          GEN <span className="text-[#E6EDF3]">3</span>
        </span>
        <span className="text-[#1F2831]">|</span>
        <span>
          MODEL <span className="text-[#E6EDF3]">gemini-2.5</span>
        </span>
        <span className="ml-auto">
          UP <span className="text-[#46C47C]">99.98%</span>
        </span>
      </div>

      {/* Body */}
      <div className="flex min-h-0 w-full flex-1">
        {/* Icon rail */}
        <div className="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-[#1F2831] bg-[#0D1218] py-2.5">
          <div className="flex h-5 w-5 items-center justify-center bg-[#35B6A6]">
            <LayoutGrid className="h-3 w-3 text-[#0A0E12]" />
          </div>
          <Sliders className="h-3.5 w-3.5 text-[#7E8B99]" />
          <List className="h-3.5 w-3.5 text-[#35B6A6]" />
          <CreditCard className="h-3.5 w-3.5 text-[#7E8B99]" />
          <Settings className="h-3.5 w-3.5 text-[#7E8B99]" />
        </div>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-[#1F2831] px-2.5 py-1.5">
            <div style={MONO} className="text-[8px] tracking-[0.16em] text-[#E6EDF3]">
              SLIDESHOWS
            </div>
            <Sparkles className="h-3 w-3 text-[#35B6A6]" />
          </div>

          <div className="flex shrink-0 items-center gap-2 border-b border-[#1F2831] px-2.5 py-2">
            <span className="flex-1 truncate text-[8px] text-[#7E8B99]">What's this slideshow about?</span>
            <button className="flex shrink-0 items-center gap-1 bg-[#35B6A6] px-2 py-0.5 text-[8px] font-semibold text-[#0A0E12]">
              Generate <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {miniRows.map((r, i) => (
              <div
                key={r.title}
                className={
                  "flex h-7 items-center gap-2 border-b border-[#1F2831] px-2.5 " +
                  (i === 0 ? "bg-[#12171D]" : "bg-[#0A0E12]")
                }
              >
                <span className="h-3 w-0.5 shrink-0" style={{ backgroundColor: i === 0 ? "#35B6A6" : "transparent" }} />
                <span className="flex-1 truncate text-[8px] text-[#E6EDF3]">{r.title}</span>
                <span
                  className="flex shrink-0 items-center gap-1 text-[6.5px]"
                  style={{ fontFamily: "JetBrains Mono", color: STATUS_COLOR[r.status] }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: STATUS_COLOR[r.status] }} />
                  {r.status.toUpperCase()}
                </span>
                <span style={MONO} className="w-3 shrink-0 text-right text-[7px] text-[#7E8B99]">
                  {r.slides}
                </span>
                {i === 0 ? <Play className="h-2.5 w-2.5 shrink-0 text-[#35B6A6]" /> : <Download className="h-2.5 w-2.5 shrink-0 text-[#7E8B99]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Mini inspector */}
        <div className="flex w-28 shrink-0 flex-col border-l border-[#1F2831] bg-[#0D1218]">
          <div style={MONO} className="border-b border-[#1F2831] px-2 py-1.5 text-[7px] tracking-[0.16em] text-[#7E8B99]">
            INSPECTOR
          </div>
          <div className="px-2 py-2">
            <div className="truncate text-[8px] leading-tight text-[#E6EDF3]">
              3 signs you're not lazy — you're just tired
            </div>
            <div style={MONO} className="mt-1 flex items-center gap-1 text-[7px] text-[#35B6A6]">
              <span className="h-1 w-1 rounded-full bg-[#35B6A6]" />
              READY
            </div>
            <div style={MONO} className="mt-2 text-[7px] text-[#7E8B99]">
              SLIDES <span className="text-[#E6EDF3]">5</span>
            </div>
            <div style={MONO} className="mt-0.5 text-[7px] text-[#7E8B99]">
              WORDS <span className="text-[#E6EDF3]">142</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-[12px]" style={{ ...SLIDE_BG, border: "1px solid #1F2831" }} />
              ))}
            </div>
          </div>
          <div className="mt-auto border-t border-[#1F2831] p-2">
            <div style={MONO} className="text-[7px] tracking-wider text-[#7E8B99]">
              FREE · 2/3
            </div>
            <div className="mt-1 flex h-1 w-full gap-px">
              <div className="flex-1 bg-[#35B6A6]" />
              <div className="flex-1 bg-[#35B6A6]" />
              <div className="flex-1 bg-[#1F2831]" />
            </div>
            <div style={MONO} className="mt-1 flex items-center justify-between text-[6.5px] text-[#7E8B99]">
              <span>USED</span>
              <span className="text-[#E0A03C]">1 LEFT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

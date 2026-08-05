import {
  ArrowRight,
  CheckCircle2,
  Download,
  PenLine,
  Sparkles,
  Zap,
} from 'lucide-react';

const MONO = { fontFamily: 'JetBrains Mono' } as const;

const QUEUE = [
  { index: '01', title: "5 signs you're not lazy", status: 'READY' },
  { index: '02', title: 'Money habits of disciplined people', status: 'DRAFT' },
  { index: '03', title: 'How to build a 5am routine', status: 'EXPORTED' },
] as const;

function StatusChip({ status }: { status: string }) {
  if (status === 'READY') {
    return (
      <span
        style={MONO}
        className="inline-flex items-center border-[2px] border-[#111111] bg-[#2E6E4E] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F1EEE6]"
      >
        Ready
      </span>
    );
  }
  if (status === 'EXPORTED') {
    return (
      <span
        style={MONO}
        className="inline-flex items-center border-[2px] border-[#111111] bg-[#111111] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F1EEE6]"
      >
        Exported
      </span>
    );
  }
  return (
    <span
      style={MONO}
      className="inline-flex items-center border-[2px] border-[#111111] bg-[#F1EEE6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#55514A]"
    >
      Draft
    </span>
  );
}

function RowAction({ status }: { status: string }) {
  if (status === 'READY') {
    return (
      <span
        style={MONO}
        className="flex items-center gap-1.5 border-[2px] border-[#111111] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em]"
      >
        <Download className="h-3.5 w-3.5" /> Export
      </span>
    );
  }
  if (status === 'DRAFT') {
    return (
      <span
        style={MONO}
        className="flex items-center gap-1.5 border-[2px] border-[#111111] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em]"
      >
        <PenLine className="h-3.5 w-3.5" /> Edit
      </span>
    );
  }
  return (
    <span
      style={MONO}
      className="flex items-center gap-1.5 px-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#55514A]"
    >
      <CheckCircle2 className="h-3.5 w-3.5" /> Done
    </span>
  );
}

function StyleField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[3px] border-[#111111] px-4 py-3">
      <span
        style={MONO}
        className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#55514A]"
      >
        {label}
      </span>
      <span className="mt-1 block text-[15px] font-semibold leading-tight">{value}</span>
    </div>
  );
}

export function Preview() {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden"
      style={{ fontFamily: 'Inter Tight' }}
    >
      <div className="flex h-full w-full flex-col border-[3px] border-[#111111] bg-[#F1EEE6] text-[#111111]">
        {/* mini top bar */}
        <div className="flex items-center justify-between border-b-[3px] border-[#111111] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#FF4D00]" />
            <span className="text-[15px] font-extrabold uppercase leading-none tracking-tight">
              Elion
            </span>
          </div>
          <div className="flex items-center">
            <span
              style={MONO}
              className="border-[2px] border-[#111111] bg-[#111111] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#F1EEE6]"
            >
              Style
            </span>
            <span
              style={MONO}
              className="border-[2px] border-l-0 border-[#111111] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em]"
            >
              Slideshows
            </span>
            <span
              style={MONO}
              className="border-[2px] border-l-0 border-[#111111] bg-[#FF4D00] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em]"
            >
              Export
            </span>
          </div>
        </div>

        {/* headline */}
        <div className="border-b-[3px] border-[#111111] px-3 pb-2 pt-2.5">
          <h2 className="text-[clamp(20px,6vw,34px)] font-extrabold uppercase leading-[0.85] tracking-[-0.02em]">
            Make a slideshow<span className="text-[#FF4D00]">.</span>
          </h2>
        </div>

        {/* idea */}
        <div className="border-b-[3px] border-[#111111] px-3 py-2">
          <span
            style={MONO}
            className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#55514A]"
          >
            Idea
          </span>
          <span className="block truncate text-[13px] font-extrabold uppercase tracking-tight">
            3 signs you're not lazy — you're just tired
          </span>
        </div>

        {/* generate */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="flex flex-1 items-center justify-center gap-1.5 border-[2px] border-[#111111] bg-[#FF4D00] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.05em]">
            Generate <ArrowRight className="h-3 w-3" />
          </span>
          <span
            style={MONO}
            className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#55514A]"
          >
            ~6 slides
          </span>
        </div>

        {/* queue rows */}
        <div className="flex-1 border-t-[3px] border-[#111111]">
          <div className="flex items-center gap-2.5 border-b-[3px] border-[#111111] px-3 py-2">
            <span style={MONO} className="text-[15px] font-bold leading-none">
              01
            </span>
            <span className="flex-1 truncate text-[11px] font-extrabold uppercase tracking-tight">
              5 signs you're not lazy
            </span>
            <span
              style={MONO}
              className="border-[2px] border-[#111111] bg-[#2E6E4E] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.15em] text-[#F1EEE6]"
            >
              Ready
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span style={MONO} className="text-[15px] font-bold leading-none">
              02
            </span>
            <span className="flex-1 truncate text-[11px] font-extrabold uppercase tracking-tight">
              Money habits of disciplined people
            </span>
            <span
              style={MONO}
              className="border-[2px] border-[#111111] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.15em] text-[#55514A]"
            >
              Draft
            </span>
          </div>
        </div>

        {/* plan band */}
        <div className="flex items-center justify-between bg-[#111111] px-3 py-1.5 text-[#F1EEE6]">
          <span
            style={MONO}
            className="text-[7px] font-bold uppercase tracking-[0.15em]"
          >
            Free — 2/3 used
          </span>
          <span
            style={MONO}
            className="flex items-center gap-1 bg-[#FF4D00] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.15em] text-[#111111]"
          >
            <Zap className="h-2.5 w-2.5" /> Pro
          </span>
        </div>
      </div>
    </div>
  );
}

export function Page() {
  return (
    <div
      style={{ fontFamily: 'Inter Tight' }}
      className="min-h-screen w-full bg-[#F1EEE6] text-[#111111]"
    >
      {/* top bar */}
      <header className="border-b-[3px] border-[#111111] bg-[#F1EEE6]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-stretch justify-between">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="h-3.5 w-3.5 bg-[#FF4D00]" />
            <span className="text-[30px] font-extrabold uppercase leading-none tracking-tight">
              Elion
            </span>
          </div>
          <nav className="flex items-stretch">
            <span
              style={MONO}
              className="flex items-center border-l-[3px] border-[#111111] bg-[#111111] px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F1EEE6]"
            >
              Style
            </span>
            <span
              style={MONO}
              className="flex items-center border-l-[3px] border-[#111111] px-5 text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Slideshows
            </span>
            <span
              style={MONO}
              className="flex items-center border-l-[3px] border-[#111111] px-5 text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Plan
            </span>
            <span className="flex items-center border-l-[3px] border-[#111111] bg-[#FF4D00] px-5 text-[11px] font-extrabold uppercase tracking-[0.2em]">
              Export
            </span>
          </nav>
        </div>
      </header>

      {/* headline band */}
      <section className="border-b-[3px] border-[#111111]">
        <div className="mx-auto max-w-[1280px] px-6 py-10 md:py-14">
          <p
            style={MONO}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#55514A]"
          >
            Elion AI — writes your slideshow for you
          </p>
          <h1 className="text-[clamp(48px,9vw,118px)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em]">
            Make a slideshow<span className="text-[#FF4D00]">.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-snug text-[#55514A]">
            Bring an idea. We write the script, the slides, the hook, the caption, and the
            hashtags. You review it, export the backgrounds, and post straight from TikTok
            or Instagram.
          </p>
        </div>
      </section>

      {/* main split */}
      <main className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-2">
        {/* left — create stack */}
        <section className="border-b-[3px] border-[#111111] px-6 py-8 lg:border-b-0 lg:border-r-[3px] lg:pr-10">
          <p
            style={MONO}
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
          >
            01 — New slideshow
          </p>

          <label
            style={MONO}
            htmlFor="idea"
            className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#55514A]"
          >
            Idea
          </label>
          <div className="border-[3px] border-[#111111] px-5 py-5">
            <input
              id="idea"
              defaultValue="3 signs you're not lazy — you're just tired"
              placeholder="What's this slideshow about?"
              className="w-full bg-transparent text-[clamp(18px,2vw,24px)] font-extrabold uppercase leading-tight tracking-tight outline-none placeholder:text-[#111111]/40"
            />
          </div>
          <p
            style={MONO}
            className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#55514A]"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            We write ~6 slides + hook + caption + hashtags. You review, then export.
          </p>

          <p
            style={MONO}
            className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-[0.25em]"
          >
            02 — Style
          </p>
          <div className="space-y-3">
            <StyleField label="Niche" value="Self-improvement" />
            <StyleField label="App name" value="Daily Grind" />
            <StyleField label="Audience" value="Men 18–34 on TikTok" />
            <StyleField
              label="Style memory"
              value="Short punchy lines. Dark gold-and-black gradient slides. No emojis."
            />
          </div>

          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-3 border-[3px] border-[#111111] bg-[#FF4D00] px-6 py-5 text-[clamp(18px,2vw,22px)] font-extrabold uppercase tracking-[0.05em]"
          >
            Generate <ArrowRight className="h-5 w-5" />
          </button>
          <p
            style={MONO}
            className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#55514A]"
          >
            Takes about 30 seconds
          </p>
        </section>

        {/* right — queue */}
        <section className="px-6 py-8 lg:pl-10">
          <div className="mb-6 flex items-baseline justify-between">
            <p
              style={MONO}
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
            >
              Queue
            </p>
            <span
              style={MONO}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#55514A]"
            >
              {String(QUEUE.length).padStart(2, '0')} items
            </span>
          </div>

          {QUEUE.map((item, i) => (
            <div
              key={item.index}
              className={
                i === QUEUE.length - 1 ? 'py-5' : 'border-b-[3px] border-[#111111] py-5'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span style={MONO} className="pt-1 text-[26px] font-bold leading-none">
                    {item.index}
                  </span>
                  <div>
                    <p className="text-[19px] font-extrabold uppercase leading-tight tracking-tight">
                      {item.title}
                    </p>
                    <div className="mt-2.5">
                      <StatusChip status={item.status} />
                    </div>
                  </div>
                </div>
                <RowAction status={item.status} />
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* plan band */}
      <footer className="bg-[#111111] text-[#F1EEE6]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <p
              style={MONO}
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Free — 2 of 3 lifetime generations used
            </p>
            <span className="hidden h-2.5 w-16 border-[2px] border-[#F1EEE6] sm:block">
              <span className="block h-full w-2/3 bg-[#FF4D00]" />
            </span>
            <span
              style={MONO}
              className="bg-[#C2342A] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em]"
            >
              1 left
            </span>
          </div>
          <span
            style={MONO}
            className="flex items-center gap-2 bg-[#FF4D00] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]"
          >
            <Zap className="h-3.5 w-3.5" /> Upgrade to Pro
          </span>
        </div>
      </footer>
    </div>
  );
}

// Library, restructured like the reference product's. A Pinterest scrape bar
// (comma-separated searches + a Max count, min 10 / default 10 / up to 40)
// pulls batches that become named packs, grouped below with per-image delete.
// Generation draws from these packs, so this is the one visible pull step.
import { useEffect, useMemo, useState } from 'react'
import { Download, Images, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError, imageUrl } from '@/lib/api'
import { useMe } from '@/lib/me'
import { FOCUS, MintButton } from '@/components/primitives'

const PULL_MIN = 10
const PULL_MAX = 40
const PULL_DEFAULT = 10

// Suggest search terms that read like examples of what a pull gives you.
const EXAMPLES = ['Minimalist home decor', 'Gym motivation', 'Cozy fall']

export default function LibraryView() {
  const { activeProject, refreshMe } = useMe()
  const [searches, setSearches] = useState('')
  const [count, setCount] = useState(PULL_DEFAULT)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Local pool is the grid source so deletions are optimistic. Re-seed it only
  // when the active project changes, never on every /api/me refresh.
  const [pool, setPool] = useState(activeProject?.imagePacks ?? [])
  const [removing, setRemoving] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPool(activeProject?.imagePacks ?? [])
    setRemoving(new Set())
  }, [activeProject?.id])

  const niche = activeProject?.brain?.niche?.trim() || activeProject?.name?.trim() || 'your brand'

  // One group per pack (the search label that named it), like the reference
  // library. Entries without a stored pack fold into the niche group.
  const groups = useMemo(() => {
    const map = new Map<string, typeof pool>()
    for (const entry of pool) {
      const key = entry.pack || entry.query || niche
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(entry)
    }
    return [...map.entries()]
  }, [pool, niche])

  const suggestions = useMemo(() => {
    const base = activeProject?.brain?.niche?.trim()
    const list = EXAMPLES.filter((e) => e.toLowerCase() !== (base ?? '').toLowerCase())
    return base ? [base, ...list].slice(0, 3) : list
  }, [activeProject?.brain?.niche])

  const pull = async (query?: string) => {
    if (!activeProject || busy) return
    setError(null)
    setNote(null)
    setBusy(true)
    const terms = (query ?? searches)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const label = terms.join(', ') || niche
    try {
      const { entries } = await api.pullImages({ projectId: activeProject.id, searches: terms.join(', '), count })
      if (entries.length) setPool((prev) => [...prev, ...entries])
      setNote(
        entries.length
          ? `Added ${entries.length} image${entries.length === 1 ? '' : 's'} to "${entries[0]?.pack || label}".`
          : 'No new images found. Try different searches.',
      )
      await refreshMe()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not pull new backgrounds.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!activeProject || removing.has(id)) return
    // Optimistic: play the exit animation immediately, then drop the card once
    // it has played. No success toast, the card leaving is the feedback.
    setRemoving((prev) => new Set(prev).add(id))
    try {
      await api.deleteLibraryImage(id, activeProject.id)
      setTimeout(() => {
        setPool((prev) => prev.filter((e) => e.id !== id))
        setRemoving((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, 180)
      await refreshMe()
    } catch (err) {
      // Restore the card and say why.
      setRemoving((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      toast.error(err instanceof ApiError ? err.message : 'Could not remove this background.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">Library</h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">
          Backgrounds pulled from Pinterest, grouped into packs, and reused across every slideshow. This is the one pull
          step.
        </p>
      </header>

      <div className="rounded-xl border border-[#1E2028] p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Pinterest searches</label>
            <input
              value={searches}
              onChange={(e) => setSearches(e.target.value)}
              placeholder={`e.g. ${EXAMPLES.join(', ').toLowerCase()}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void pull()
              }}
              className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-[#7C838C] focus:border-[#52525B]"
            />
          </div>
          <div className="w-24">
            <label className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Max</label>
            <input
              type="number"
              value={count}
              min={PULL_MIN}
              max={PULL_MAX}
              onChange={(e) => setCount(Number(e.target.value))}
              onBlur={() => setCount((c) => Math.min(Math.max(Math.round(c) || PULL_MIN, PULL_MIN), PULL_MAX))}
              className="w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-[#52525B]"
            />
            <span className="mt-1 block text-[10px] font-medium text-[#5F646B]">min {PULL_MIN} · up to {PULL_MAX}</span>
          </div>
          <MintButton icon={Download} onClick={() => void pull()} disabled={busy || !activeProject} className="shrink-0">
            {busy ? 'Pulling...' : 'Pull Pinterest'}
          </MintButton>
        </div>
        {note && <p className="mt-2.5 text-[12px] font-medium text-[#6FA1FF]">{note}</p>}
        {error && <p className="mt-2.5 text-[12px] font-medium text-[#F4877E]">{error}</p>}
      </div>

      {pool.length === 0 ? (
        <section className="mt-6 flex flex-col items-center rounded-xl border border-[#1E2028] px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Images className="h-5 w-5 text-white" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-display text-[17px] font-bold text-white">No backgrounds yet</h2>
          <p className="mt-1.5 max-w-[400px] text-[13px] leading-relaxed text-[#9CA0A8]">
            Enter Pinterest searches above, or pull a batch matched to your niche. Here's what a pull looks like:
          </p>
          <div className="mt-5 flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[9/16] w-16 overflow-hidden rounded-lg border border-[#1E2028]">
                <img
                  src={`https://picsum.photos/seed/elion-example-${i}/160/284`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11.5px] font-semibold text-[#5F646B]">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSearches(s)}
                className={`rounded-full border border-[#1F212B] bg-[#08080A] px-2.5 py-1 text-[11.5px] font-semibold text-[#8E8E93] transition hover:text-white active:scale-[0.96] ${FOCUS}`}
              >
                {s}
              </button>
            ))}
          </div>
          <MintButton icon={Download} onClick={() => void pull(niche)} disabled={busy || !activeProject} className="mt-6">
            Pull {count} for {niche}
          </MintButton>
        </section>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map(([pack, imgs]) => (
            <section key={pack}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <h2 className="text-[13px] font-semibold text-white">{pack}</h2>
                <span className="text-[11px] font-medium text-[#5F646B]">
                  {imgs.length} image{imgs.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {imgs.map((entry) => (
                  <div
                    key={entry.id}
                    className={`group relative aspect-[9/16] overflow-hidden rounded-lg border border-[#1E2028] ${removing.has(entry.id) ? 'card-out' : ''}`}
                  >
                    <img
                      src={imageUrl(entry)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                    />
                    <button
                      type="button"
                      onClick={() => void remove(entry.id)}
                      aria-label="Remove image"
                      className={`absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100 ${FOCUS}`}
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

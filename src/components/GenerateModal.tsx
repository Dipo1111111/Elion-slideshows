// GenerateModal, DESIGN.md §7 recipe + mockup anatomy verbatim. One instance
// lives in AppShell; the sidebar row and dashboard both open it. Generate
// clamps to the plan's remaining quota and disables over-limit counts.
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Images, X } from 'lucide-react'
import { useGenerate, remainingForMe } from '@/lib/generate'
import { useAnimatedClose } from '@/lib/useAnimatedClose'
import { useMe } from '@/lib/me'
import type { LibraryPack } from '@/lib/types'
import { FOCUS, FieldLabel, MintButton, QuietButton, TextInput } from './primitives'

const OPTIONS = [1, 3, 5, 10] as const

export function GenerateModal() {
  const { modalOpen, closeModal, runGenerate, generating } = useGenerate()
  const { closing, requestClose } = useAnimatedClose(modalOpen, closeModal)
  const { me, activeProject } = useMe()
  const navigate = useNavigate()
  const [count, setCount] = useState<number>(1)
  const [idea, setIdea] = useState('')
  const [selectedPacks, setSelectedPacks] = useState<string[]>([])

  const remaining = me ? remainingForMe(me) : 0
  const overLimit = count > remaining
  const planName = me?.plan === 'studio' ? 'Studio' : me?.plan === 'creator' || me?.plan === 'pro' ? 'Creator' : 'Free'
  const capLabel = me?.plan === 'free' ? 'free slideshows' : `${planName} slideshows this month`
  // A project exists but its Brain is unset. Short descriptions produce
  // generic scripts, so nudge the user to fill the niche before generating.
  const brainEmpty = activeProject ? !activeProject.brain?.niche : false
  // Backgrounds come from the Library, pulled once and reused. An empty pool
  // gates Generate behind a single pull so no one stares at a silent scrape.
  const pool = activeProject?.imagePacks ?? []
  const libraryEmpty = pool.length === 0

  // Derive packs from the pool. Every pull is a named pack (the searches that
  // made it); the picker below lets Generate draw from a selection instead of
  // the whole library.
  const packs = useMemo<LibraryPack[]>(() => {
    const map = new Map<string, LibraryPack>()
    for (const entry of pool) {
      const name = entry.pack || entry.query || activeProject?.brain?.niche || 'Backgrounds'
      let p = map.get(name)
      if (!p) {
        p = { name, count: 0, covers: [] }
        map.set(name, p)
      }
      p.count += 1
      if (p.covers.length < 4) p.covers.push(entry.id)
    }
    return [...map.values()]
  }, [pool, activeProject?.brain?.niche])

  const togglePack = (name: string) =>
    setSelectedPacks((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]))

  useEffect(() => {
    if (modalOpen) {
      setCount(1)
      setIdea('')
      setSelectedPacks(packs.map((p) => p.name))
    }
  }, [modalOpen, packs])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, requestClose])

  if (!modalOpen) return null

  const subtitle = activeProject
    ? `From your Brand: ${activeProject.name}${activeProject.brain?.niche ? ` · ${activeProject.brain.niche}` : ''}.`
    : 'Set up your Brand first, then generate.'

  return (
    <div
      className={`${closing ? 'modal-backdrop-out' : 'modal-backdrop'} fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs`}
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generate slideshow"
        className={`${closing ? 'modal-panel-out pointer-events-none' : 'modal-panel'} w-full max-w-md rounded-2xl border border-[#22242D] bg-[#08080A] p-6 text-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[17px] font-bold tracking-[-0.01em] text-white">Generate slideshow</h2>
            <p className="mt-1 text-[12.5px] text-[#9CA0A8]">{subtitle}</p>
            {brainEmpty && (
              <button
                type="button"
                onClick={() => {
                  closeModal()
                  navigate('/app/brand')
                }}
                className={`mt-1.5 inline-flex items-center gap-1 text-left text-[12px] font-semibold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
              >
                Your Brand is empty. Set your niche so scripts land, not generic advice.
                <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </button>
            )}
          </div>
          <button onClick={requestClose} aria-label="Close" className={`text-[#8E8E93] transition-colors hover:text-white ${FOCUS}`}>
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {libraryEmpty ? (
          <div className="mt-5 rounded-xl border border-[#1F212B] bg-[#0C0D10] p-4">
            <p className="text-[12.5px] font-semibold text-white">Pull backgrounds first</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#9CA0A8]">
              Your Library is empty. Pull a batch from Pinterest once, then generate. The same backgrounds are reused
              across every slideshow.
            </p>
            <MintButton
              icon={Images}
              onClick={() => {
                closeModal()
                navigate('/app/library')
              }}
              className="mt-3"
            >
              Open Library
            </MintButton>
          </div>
        ) : (
          <>
            <label className="mt-5 block">
              <FieldLabel bold>Idea (optional)</FieldLabel>
              <TextInput
                placeholder="e.g. Money habits of disciplined people"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </label>
            <p className="mt-1.5 text-[12px] text-[#8E8E93]">Leave empty to generate from your Brand.</p>

            <div className="mt-4">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">How many?</span>
              <div className="flex gap-2">
                {OPTIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setCount(o)}
                    aria-pressed={count === o}
                    className={`flex h-8 w-10 items-center justify-center rounded-lg font-num text-[13px] font-bold transition active:scale-95 ${FOCUS} ${
                      count === o
                        ? 'bg-[#3B82F6]/20 text-white'
                        : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {o}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Math.round(Number(e.target.value)) || 1)))}
                  aria-label="Custom slideshow count"
                  className="h-8 w-16 rounded-lg border border-[#1F212B] bg-[#08080A] text-center font-num text-[13px] font-bold text-white outline-none transition-colors focus:border-[#52525B]"
                />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-[#8E8E93]">1 to 100. Large batches take a while.</p>
            </div>

            {packs.length > 0 && (
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#9CA0A8]">Background packs</span>
                  <span className="text-[11px] font-semibold text-[#5F646B]">
                    {selectedPacks.length} of {packs.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {packs.map((p) => {
                    const on = selectedPacks.includes(p.name)
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => togglePack(p.name)}
                        aria-pressed={on}
                        className={`relative overflow-hidden rounded-lg text-left transition active:scale-[0.97] ${FOCUS} ${
                          on ? 'border-[#3B82F6]/60' : 'border-[#1F212B] hover:border-[#2E3140]'
                        }`}
                      >
                        <span className="grid aspect-[4/5] grid-cols-2 grid-rows-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span key={i} className="overflow-hidden bg-[#0C0D10]">
                              {p.covers[i] ? (
                                <img
                                  src={`/api/images/${encodeURIComponent(p.covers[i])}`}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </span>
                          ))}
                        </span>
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/20 px-2 pb-1.5 pt-5">
                          <span className="block truncate text-[10.5px] font-semibold leading-tight text-white">{p.name}</span>
                          <span className="block text-[9.5px] font-medium text-white/70">
                            {p.count} image{p.count === 1 ? '' : 's'}
                          </span>
                        </span>
                        {on && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow">
                            <Check className="h-3 w-3" strokeWidth={1.5} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="mt-3 text-[11.5px] font-medium text-[#8E8E93]">
              Backgrounds come from your Library, pulled once and reused.{' '}
              {overLimit ? (
                <span className="font-semibold text-[#F4877E]">
                  That is more than your {remaining} remaining {capLabel}.
                </span>
              ) : (
                <>This uses {count} of your {remaining} remaining {capLabel}.</>
              )}
            </p>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <QuietButton onClick={requestClose} className="px-4 py-2">
            Cancel
          </QuietButton>
          {!libraryEmpty && (
            <MintButton
              onClick={() => void runGenerate(count, idea, selectedPacks)}
              disabled={!activeProject || overLimit || generating || selectedPacks.length === 0}
              className="px-4 py-2 text-[12.5px]"
            >
              {generating ? 'Writing...' : 'Generate'}
            </MintButton>
          )}
        </div>
      </div>
    </div>
  )
}

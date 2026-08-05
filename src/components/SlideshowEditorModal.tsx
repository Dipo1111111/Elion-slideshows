// Editor modal shell, DESIGN.md §10 EditorModal + mockup verbatim. Owns the
// draft (caption, hashtags text, slide objects with their backgrounds) and
// persists on Save; the three tabs are controlled children. The left side is
// a 9:16 phone preview of the current slide's real background.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError, imageUrl } from '@/lib/api'
import { useMe } from '@/lib/me'
import { useAnimatedClose } from '@/lib/useAnimatedClose'
import type { ImageEntry, Slide, Slideshow } from '@/lib/types'
import { FOCUS, MintButton, QuietButton } from './primitives'
import { PostTab } from './editor/PostTab'
import { SlidesTab } from './editor/SlidesTab'
import { ExportTab } from './editor/ExportTab'

export type EditorTab = 'post' | 'slides' | 'export'

export interface EditorDraft {
  caption: string
  hashtagsText: string
  slides: Slide[]
}

const TABS: { key: EditorTab; label: string }[] = [
  { key: 'post', label: 'Post' },
  { key: 'slides', label: 'Slides' },
  { key: 'export', label: 'Export' },
]

export function SlideshowEditorModal({
  slideshow,
  initialTab,
  onClose,
  onSaved,
}: {
  slideshow: Slideshow
  initialTab: EditorTab
  onClose: () => void
  onSaved: () => void
}) {
  const navigate = useNavigate()
  const { me, activeProject } = useMe()
  const { closing, requestClose } = useAnimatedClose(true, onClose)
  const [tab, setTab] = useState<EditorTab>(initialTab)
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<EditorDraft>({
    caption: slideshow.caption,
    hashtagsText: slideshow.hashtags.map((t) => `#${t}`).join(' '),
    slides: slideshow.slides,
  })

  const pool = activeProject?.imagePacks ?? []
  const total = draft.slides.length
  const currentBg = draft.slides[index]?.bg

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  const patch = (p: Partial<EditorDraft>) => setDraft((d) => ({ ...d, ...p }))

  const save = async () => {
    try {
      await api.updateQueue(slideshow.id, {
        status: 'Ready',
        caption: draft.caption,
        hashtags: draft.hashtagsText
          .split(/\s+/)
          .map((t) => t.replace(/^#/, ''))
          .filter(Boolean),
        slides: draft.slides,
      })
      toast.success('Saved.')
      onSaved()
      requestClose()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not save your edits.')
    }
  }

  const deleteSlide = () => {
    if (draft.slides.length <= 1) return
    const next = draft.slides.filter((_, i) => i !== index)
    setIndex((i) => Math.min(i, next.length - 1))
    patch({ slides: next })
  }

  const pickBg = (entry: ImageEntry) => {
    patch({ slides: draft.slides.map((s, i) => (i === index ? { ...s, bg: { id: entry.id, url: entry.url } } : s)) })
  }

  const shuffleAll = (source: ImageEntry[]) => {
    if (source.length === 0) return
    const used = new Set<string>()
    patch({
      slides: draft.slides.map((s) => {
        // Prefer a background not yet used in this carousel; fall back to any
        // remaining when the pool runs out, so a repeat never loops forever.
        const fresh = source.find((e) => !used.has(e.id))
        const entry = fresh ?? source[Math.floor(Math.random() * source.length)]
        used.add(entry.id)
        return { ...s, bg: { id: entry.id, url: entry.url } }
      }),
    })
  }

  return (
    <div
      className={`${closing ? 'modal-backdrop-out' : 'modal-backdrop'} fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs`}
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit slideshow"
        className={`${closing ? 'modal-panel-out pointer-events-none' : 'modal-panel'} flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#22242D] bg-[#08080A] text-white shadow-2xl sm:flex-row`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center gap-4 border-[#1F2026] bg-[#08080A] p-6 sm:w-80 sm:border-r">
          <div className="relative aspect-[9/16] w-44 overflow-hidden rounded-lg sm:w-52">
            {currentBg && (
              <img
                key={index}
                src={imageUrl(currentBg)}
                alt={`Slide ${index + 1} background`}
                className="fade-in absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center font-num text-[10px] font-bold text-white/90 drop-shadow">
              {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white transition hover:bg-[#282B33] active:scale-[0.95] disabled:cursor-not-allowed disabled:border-[#1C1E26] disabled:bg-[#121317] disabled:text-[#3A3F47] disabled:hover:bg-[#121317]"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <div className="flex gap-1.5">
              {draft.slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${FOCUS} ${i === index ? 'w-5' : 'w-1.5 bg-[#3A3F47]'}`}
                  style={i === index ? { backgroundColor: '#FFFFFF' } : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              aria-label="Next slide"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#262834] bg-[#1E2026] text-white transition hover:bg-[#282B33] active:scale-[0.95] disabled:cursor-not-allowed disabled:border-[#1C1E26] disabled:bg-[#121317] disabled:text-[#3A3F47] disabled:hover:bg-[#121317]"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <span className="font-num text-[11px] text-[#8E8E93]">
            {index + 1} / {total}
          </span>
        </div>

        <div className="flex min-w-0 w-full flex-col sm:w-96">
          <div className="flex items-center justify-between border-b border-[#1F2026] px-4 py-3">
            <div className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition active:scale-[0.96] ${
                    tab === t.key ? 'bg-[#3B82F6]/20 text-white' : 'text-[#8E8E93] hover:text-white'
                  } ${FOCUS}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={requestClose} aria-label="Close" className={`text-[#8E8E93] transition-colors hover:text-white ${FOCUS}`}>
              <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            <div key={tab} className="tab-fade">
            {tab === 'post' && <PostTab draft={draft} patch={patch} />}
            {tab === 'slides' && (
              <SlidesTab
                draft={draft}
                patch={patch}
                index={index}
                pool={pool}
                onDelete={deleteSlide}
                onPick={pickBg}
                onShuffle={shuffleAll}
                onBrowseLibrary={() => navigate('/app/library')}
              />
            )}
            {tab === 'export' && <ExportTab slideshow={slideshow} draft={draft} watermark={me?.plan === 'free'} />}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#1F2026] px-4 py-3">
            <QuietButton onClick={requestClose} className="px-4 py-2">
              Cancel
            </QuietButton>
            {tab === 'export' ? (
              <MintButton icon={Check} onClick={requestClose} className="px-4 py-2 text-[12.5px]">
                Done
              </MintButton>
            ) : (
              <MintButton icon={Check} onClick={() => void save()} className="px-4 py-2 text-[12.5px]">
                Save
              </MintButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

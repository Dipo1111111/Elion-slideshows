// Editor Slides tab: per-slide text, delete, background override strip.
// DESIGN.md EditorModal recipe, amended to match the reference editor: the
// grid filters by pack (All / one pull), shows the whole filtered pool, and
// Shuffle picks a fresh background per slide so a carousel never repeats.
import { useMemo, useState } from 'react'
import { Images, Shuffle, Trash2 } from 'lucide-react'
import { imageUrl } from '@/lib/api'
import type { ImageEntry } from '@/lib/types'
import { FOCUS, TextArea } from '@/components/primitives'
import type { EditorDraft } from '@/components/SlideshowEditorModal'

export function SlidesTab({
  draft,
  patch,
  index,
  pool,
  onDelete,
  onPick,
  onShuffle,
  onBrowseLibrary,
}: {
  draft: EditorDraft
  patch: (p: Partial<EditorDraft>) => void
  index: number
  pool: ImageEntry[]
  onDelete: () => void
  onPick: (entry: ImageEntry) => void
  onShuffle: (pool: ImageEntry[]) => void
  onBrowseLibrary: () => void
}) {
  const slide = draft.slides[index]
  const [pack, setPack] = useState('all')

  // Every pull names a pack; images without one fold into the pool as "all".
  const packs = useMemo(
    () => ['all', ...Array.from(new Set(pool.map((e) => e.pack || e.query).filter(Boolean)))] as string[],
    [pool],
  )
  const filtered = useMemo(
    () => (pack === 'all' ? pool : pool.filter((e) => (e.pack || e.query) === pack)),
    [pool, pack],
  )

  const setText = (text: string) => {
    patch({ slides: draft.slides.map((s, i) => (i === index ? { ...s, text } : s)) })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#9CA0A8]">Slide {index + 1} text</span>
        <button
          type="button"
          onClick={onDelete}
          disabled={draft.slides.length <= 1}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E8E93] transition-colors hover:text-[#F4877E] disabled:pointer-events-none disabled:opacity-50 ${FOCUS}`}
        >
          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
          Delete slide
        </button>
      </div>
      <TextArea key={index} rows={4} value={slide?.text ?? ''} onChange={(e) => setText(e.target.value)} />
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#9CA0A8]">Background</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShuffle(filtered)}
              disabled={filtered.length === 0}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E8E93] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50 ${FOCUS}`}
            >
              <Shuffle className="h-3 w-3" strokeWidth={1.5} />
              Shuffle all
            </button>
            <button
              type="button"
              onClick={onBrowseLibrary}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
            >
              <Images className="h-3 w-3" strokeWidth={1.5} />
              Browse Library
            </button>
          </div>
        </div>
        {pool.length > 0 ? (
          <>
            <div className="mb-2 flex items-center gap-2">
              <select
                value={pack}
                onChange={(e) => setPack(e.target.value)}
                aria-label="Filter backgrounds by pack"
                className="h-7 rounded-md border border-[#1F212B] bg-[#08080A] px-1.5 text-[11px] font-semibold text-[#9CA0A8] outline-none transition-colors focus:border-[#52525B]"
              >
                {packs.map((p) => (
                  <option key={p} value={p}>
                    {p === 'all' ? 'All packs' : p}
                  </option>
                ))}
              </select>
              <span className="text-[10.5px] font-medium text-[#5F646B]">{filtered.length} available</span>
            </div>
            <div className="grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
              {filtered.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onPick(entry)}
                  aria-label={`Background ${entry.url}`}
                  className={`relative aspect-[9/16] overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5 ${
                    slide?.bg?.id === entry.id ? 'ring-2 ring-[#3B82F6]' : ''
                  }`}
                >
                  <img src={imageUrl(entry)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-[11px] text-[#8E8E93]">
            Your Library is empty. Pull new backgrounds from the Library page.
          </p>
        )}
        <p className="mt-2 text-[11px] text-[#8E8E93]">
          Backgrounds come from your Library. Shuffle picks a fresh one per slide.
        </p>
      </div>
    </>
  )
}

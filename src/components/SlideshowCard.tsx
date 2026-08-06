// Slideshow card, DESIGN.md §10 Home anatomy + mockup CardBody verbatim.
// Featured (full-width, horizontal thumb strip) leads; the rest are grid
// cards with a small strip. Real photos, status chip, hashtags, actions.
import type { CSSProperties } from 'react'
import { Download, PenLine, Trash2 } from 'lucide-react'
import { imageUrl } from '@/lib/api'
import { timeAgo } from '@/lib/format'
import type { Slideshow } from '@/lib/types'
import { FOCUS, QuietButton, SlideThumb, StatusChip } from './primitives'
import type { EditorTab } from './SlideshowEditorModal'

function CardBody({
  slideshow,
  onEdit,
  onDelete,
  captionLines,
}: {
  slideshow: Slideshow
  onEdit: (tab: EditorTab) => void
  onDelete: () => void
  captionLines: 2 | 3
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold leading-snug text-white">{slideshow.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusChip status={slideshow.status} />
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${slideshow.title}`}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[#7C838C] transition-colors hover:bg-[#3A2320] hover:text-[#F4877E] ${FOCUS}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-[#F2F4F7]">{slideshow.hook}</p>
      <p className={`mt-1.5 ${captionLines === 3 ? 'line-clamp-3' : 'line-clamp-2'} text-[12px] leading-relaxed text-[#9CA0A8]`}>
        {slideshow.caption}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {slideshow.hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#262834] bg-[#1A1B21] px-2 py-0.5 text-[11px] font-medium text-[#9CA0A8]"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-[#8E8E93]">
          {slideshow.slides.length} slides · {timeAgo(slideshow.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <QuietButton icon={PenLine} onClick={() => onEdit('post')}>
            Edit
          </QuietButton>
          <QuietButton icon={Download} onClick={() => onEdit('export')}>
            Export
          </QuietButton>
        </div>
      </div>
    </div>
  )
}

function ThumbStrip({ slideshow, size }: { slideshow: Slideshow; size: 'lg' | 'sm' }) {
  const thumbs = slideshow.slides.slice(0, 3)
  const more = slideshow.slides.length - 3
  if (size === 'lg') {
    return (
      <div className="flex shrink-0 items-center gap-2 bg-[#0C0D10] p-4">
        {thumbs.map((slide, j) => (
          <SlideThumb key={slide.id} image={imageUrl(slide.bg)} index={j + 1} label={slide.text} labelSize="lg" className="w-24" />
        ))}
        {more > 0 && <span className="pl-1 text-[11px] font-semibold text-[#7C838C]">+{more} more</span>}
      </div>
    )
  }
  return (
    <div className="flex gap-2 bg-[#0C0D10] px-4 py-3">
      {thumbs.map((slide, j) => (
        <SlideThumb key={slide.id} image={imageUrl(slide.bg)} index={j + 1} label={slide.text} className="w-12" />
      ))}
      {more > 0 && (
        <span className="ml-auto flex items-center self-end pb-0.5 text-[11px] font-semibold text-[#7C838C]">
          +{more} more
        </span>
      )}
    </div>
  )
}

export function SlideshowCard({
  slideshow,
  variant,
  onEdit,
  onDelete,
  className,
  style,
}: {
  slideshow: Slideshow
  variant: 'featured' | 'grid'
  onEdit: (tab: EditorTab) => void
  onDelete: () => void
  className?: string
  style?: CSSProperties
}) {
  if (variant === 'featured') {
    return (
      <article
        className={`overflow-hidden rounded-xl border border-[#1E2028] transition-colors hover:border-[#2E3140] lg:col-span-2 ${className ?? ''}`}
        style={style}
      >
        <div className="flex flex-col sm:flex-row">
          <ThumbStrip slideshow={slideshow} size="lg" />
          <CardBody slideshow={slideshow} onEdit={onEdit} onDelete={onDelete} captionLines={3} />
        </div>
      </article>
    )
  }
  return (
    <article
      className={`overflow-hidden rounded-xl border border-[#1E2028] transition-colors hover:border-[#2E3140] ${className ?? ''}`}
      style={style}
    >
      <ThumbStrip slideshow={slideshow} size="sm" />
      <CardBody slideshow={slideshow} onEdit={onEdit} onDelete={onDelete} captionLines={2} />
    </article>
  )
}

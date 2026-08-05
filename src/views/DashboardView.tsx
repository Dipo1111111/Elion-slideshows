// Dashboard (Home), DESIGN.md §10. Empty / loading / ready states, greeting
// header, card grid, brand strip. Owns the active project's queue and the
// editor modal instance.
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Images, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { BRAND_NAME } from '@/lib/brand'
import { formatMonthDay } from '@/lib/format'
import { useGenerate } from '@/lib/generate'
import { useMe } from '@/lib/me'
import type { Slideshow } from '@/lib/types'
import { FOCUS, MintButton, Shimmer } from '@/components/primitives'
import { SlideshowCard } from '@/components/SlideshowCard'
import { SlideshowEditorModal, type EditorTab } from '@/components/SlideshowEditorModal'

function GreetingHeader({ line }: { line: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">Good morning</h1>
      <p className="mt-1.5 text-[13.5px] text-[#9CA0A8]">{line}</p>
    </header>
  )
}

const blueSlideshow = <span className="text-[#3B82F6]">slideshow</span>

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1E2028]">
      <div className="flex gap-2 bg-[#0C0D10] px-4 py-3">
        <Shimmer className="aspect-[9/16] w-12" />
        <Shimmer className="aspect-[9/16] w-12" />
        <Shimmer className="aspect-[9/16] w-12" />
        <Shimmer className="ml-auto w-16 self-end rounded-md pb-0.5" />
      </div>
      <div className="space-y-2 p-4">
        <Shimmer className="h-4 w-1/2 rounded-md" />
        <Shimmer className="h-3 w-3/4 rounded-md" />
        <Shimmer className="h-3 w-full rounded-md" />
        <div className="flex gap-1.5 pt-1">
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-5 w-14 rounded-full" />
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Shimmer className="h-3 w-20 rounded-md" />
          <div className="flex gap-2">
            <Shimmer className="h-7 w-16 rounded-full" />
            <Shimmer className="h-7 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardView() {
  const navigate = useNavigate()
  const { meLoading, activeProject } = useMe()
  const { generating, pendingCount, reloadKey, openModal } = useGenerate()
  const [slideshows, setSlideshows] = useState<Slideshow[] | null>(null)
  const [editing, setEditing] = useState<{ slideshow: Slideshow; tab: EditorTab } | null>(null)

  const refresh = useCallback(async () => {
    if (!activeProject) {
      setSlideshows([])
      return
    }
    try {
      setSlideshows(await api.queue(activeProject.id))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not load your slideshows.')
    }
  }, [activeProject?.id])

  useEffect(() => {
    void refresh()
  }, [refresh, reloadKey])

  const remove = async (slideshow: Slideshow) => {
    try {
      await api.deleteQueue(slideshow.id)
      toast.success('Deleted.')
      await refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not delete this slideshow.')
    }
  }

  const tuneBrand = () => navigate('/app/brand')

  if (meLoading) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8">
        <GreetingHeader line={<>Let's create your first {blueSlideshow}.</>} />
        <div className="mb-4">
          <h2 className="font-display text-[16px] font-bold text-white">Your slideshows</h2>
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8">
        <GreetingHeader line={<>Writing your scripts and assigning backgrounds from your Library. About a minute.</>} />
        <div className="mb-4">
          <h2 className="font-display text-[16px] font-bold text-white">Your slideshows</h2>
          <p className="mt-1 text-[12px] font-medium text-[#9CA0A8]">
            Writing {pendingCount} slideshows for {activeProject?.name ?? 'your brand'}...
          </p>
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (!slideshows || slideshows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8">
        <GreetingHeader line={<>Let's create your first {blueSlideshow}.</>} />
        <section className="flex flex-col items-center justify-center rounded-xl border border-[#1E2028] px-6 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Images className="h-5 w-5 text-white" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-display text-[17px] font-bold text-white">No slideshows yet</h2>
          <p className="mt-1.5 max-w-[380px] text-[13px] leading-relaxed text-[#9CA0A8]">
            {BRAND_NAME} writes the script, pulls backgrounds from your Library, and gives you ready-to-post slides.
            Your first one takes about a minute.
          </p>
          <MintButton icon={Plus} onClick={openModal} className="mt-6">
            Generate your first slideshow
          </MintButton>
          <button
            type="button"
            onClick={tuneBrand}
            className={`mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
          >
            Tune your Brand first
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </section>
      </div>
    )
  }

  const readyCount = slideshows.filter((s) => s.status === 'Ready').length
  // Adaptive grid: an odd count leads with the full-width featured card (the
  // rest fill rows of two). An even count renders a uniform grid so no row is
  // ever left half empty, e.g. exactly two slideshows sit side by side.
  const lead: 'featured' | 'grid' = slideshows.length % 2 === 1 ? 'featured' : 'grid'

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8">
      <GreetingHeader
        line={
          <>
            {formatMonthDay(new Date())}. Let's create your {blueSlideshow}.
          </>
        }
      />
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[16px] font-bold text-white">Your slideshows</h2>
          <p className="mt-1 text-[12px] font-medium text-[#9CA0A8]">
            {slideshows.length} slideshows · {readyCount} ready to post
          </p>
        </div>
        <MintButton onClick={openModal}>Generate</MintButton>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {slideshows.map((s, i) => (
          <SlideshowCard
            key={s.id}
            slideshow={s}
            variant={i === 0 ? lead : 'grid'}
            onEdit={(tab) => setEditing({ slideshow: s, tab })}
            onDelete={() => void remove(s)}
            className="card-enter"
            style={{ '--i': Math.min(i, 8) } as CSSProperties}
          />
        ))}
      </div>

      {editing && (
        <SlideshowEditorModal
          slideshow={editing.slideshow}
          initialTab={editing.tab}
          onClose={() => setEditing(null)}
          onSaved={() => void refresh()}
        />
      )}
    </div>
  )
}

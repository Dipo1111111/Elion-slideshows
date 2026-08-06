// First-run onboarding. A guided 3-step wizard that does the real work: create
// the Brand (and the five-question voice wizard), pull a background pack, then
// hand off to the generator. Steps advance automatically as their state
// completes; any dismissal (X, backdrop, Escape, Skip) remembers the choice so
// it never nags. Demo preview has a seeded project, so it never opens there
// and never blocks review.
import { useEffect, useState } from 'react'
import { BookOpen, Check, Images, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { useAnimatedClose } from '@/lib/useAnimatedClose'
import { useGenerate } from '@/lib/generate'
import { useMe } from '@/lib/me'
import { BrandWizardModal } from '@/views/BrandVoiceView'
import { FOCUS, MintButton, QuietButton } from '@/components/primitives'

const DONE_KEY = 'elion.onboardingDone'

interface StepMeta {
  key: 'brand' | 'library' | 'generate'
  icon: typeof BookOpen
  title: string
  body: string
  cta: string
  ctaBusy: string
  helper: string
  doneLabel: string
}

const STEPS: StepMeta[] = [
  {
    key: 'brand',
    icon: BookOpen,
    title: 'Create your Brand',
    body: 'Answer five quick questions about your app, your niche, and your audience. That becomes your Brain, and every slideshow it writes sounds like you.',
    cta: 'Create your brand',
    ctaBusy: 'Creating...',
    helper: 'Five quick questions. You can edit it anytime.',
    doneLabel: 'Brand created',
  },
  {
    key: 'library',
    icon: Images,
    title: 'Pull backgrounds',
    body: 'Real photos matched to your niche, cached in your Library and reused across every slideshow.',
    cta: 'Pull backgrounds',
    ctaBusy: 'Pulling...',
    helper: 'Pulls a batch of real photos into your Library.',
    doneLabel: 'Backgrounds ready',
  },
  {
    key: 'generate',
    icon: Sparkles,
    title: 'Generate your first slideshow',
    body: 'Type one idea, or leave it empty to write from your Brand. Export 1080×1920 slides ready to post.',
    cta: 'Open the generator',
    ctaBusy: '',
    helper: 'You can also start it anytime from the sidebar.',
    doneLabel: 'First slideshow ready',
  },
]

export default function Onboarding() {
  const { me, meLoading, activeProject, refreshMe, setActiveProjectId } = useMe()
  const { openModal } = useGenerate()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [creating, setCreating] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [wizard, setWizard] = useState<string | null>(null)

  // Only fresh accounts (zero projects) get onboarding.
  const isFresh = !meLoading && me !== null && me.projects.length === 0

  useEffect(() => {
    if (!isFresh || localStorage.getItem(DONE_KEY)) return
    // Slight delay so the shell's view-enter rise finishes first. No ref
    // guard here: the effect only reruns when isFresh flips, and a StrictMode
    // double-effect must still get its timer.
    const t = window.setTimeout(() => setOpen(true), 350)
    return () => window.clearTimeout(t)
  }, [isFresh])

  const brandDone = (me?.projects.length ?? 0) > 0
  const libraryDone = (activeProject?.imagePacks.length ?? 0) > 0
  const generateDone = (me?.totalGens ?? 0) > 0
  const allDone = brandDone && libraryDone && generateDone
  const isDone = [brandDone, libraryDone, generateDone][step]

  // Auto-advance as each step completes; finish with a check when all are
  // done. The voice wizard holds the screen over step 1, so advance only
  // once it closes.
  useEffect(() => {
    if (!open) return
    if (allDone) {
      const t = window.setTimeout(() => {
        localStorage.setItem(DONE_KEY, '1')
        setOpen(false)
      }, 850)
      return () => window.clearTimeout(t)
    }
    if (wizard !== null) return
    if (isDone && step < STEPS.length - 1) {
      const t = window.setTimeout(() => setStep((s) => s + 1), 600)
      return () => window.clearTimeout(t)
    }
  }, [open, step, isDone, allDone, wizard])

  const startBrand = async () => {
    if (brandDone) {
      setStep(1)
      return
    }
    if (creating) return
    setCreating(true)
    try {
      let id = activeProject?.id
      if (!id) {
        const project = await api.createProject()
        setActiveProjectId(project.id)
        await refreshMe()
        id = project.id
      }
      // Open the five-question wizard on the fresh project so the Brain gets
      // a real voice, not just a name.
      setWizard(id)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create your brand.')
    } finally {
      setCreating(false)
    }
  }

  const pull = async () => {
    if (!activeProject || pulling) return
    setPulling(true)
    try {
      const res = await api.pullImages({ projectId: activeProject.id })
      await refreshMe()
      toast.success(`Pulled ${res.entries.length} backgrounds.`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not pull backgrounds.')
    } finally {
      setPulling(false)
    }
  }

  // Hand off to the real generator (one instance lives in the app shell).
  const openGenerator = () => {
    setOpen(false)
    openModal()
  }

  // Any dismiss (X, backdrop, Escape, skip) remembers the decision, so the
  // wizard never nags a user who chose not to run it.
  const dismiss = () => {
    localStorage.setItem(DONE_KEY, '1')
    setOpen(false)
  }

  // Keep the panel alive through the brand step: once open it stays until the
  // flow completes or the user dismisses, even after isFresh flips false.
  if (!isFresh && !open) return null

  return (
    <>
      <OnboardingPanel
        open={open}
        step={step}
        meta={STEPS[step]}
        isDone={isDone}
        creating={creating}
        pulling={pulling}
        onClose={dismiss}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onPrimary={step === 0 ? startBrand : step === 1 ? pull : openGenerator}
      />
      {wizard && (
        <BrandWizardModal
          projectId={wizard}
          initial={activeProject?.brain ?? {}}
          onClose={() => setWizard(null)}
          onSaved={() => void refreshMe()}
        />
      )}
    </>
  )
}

function OnboardingPanel({
  open,
  step,
  meta,
  isDone,
  creating,
  pulling,
  onClose,
  onBack,
  onPrimary,
}: {
  open: boolean
  step: number
  meta: StepMeta
  isDone: boolean
  creating: boolean
  pulling: boolean
  onClose: () => void
  onBack: () => void
  onPrimary: () => void
}) {
  const { closing, requestClose } = useAnimatedClose(open, onClose)
  const busy = creating || pulling

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  if (!open) return null

  const Icon = meta.icon

  return (
    <div
      className={`${closing ? 'modal-backdrop-out' : 'modal-backdrop'} fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs`}
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Step ${step + 1} of ${STEPS.length}: ${meta.title}`}
        className={`${closing ? 'modal-panel-out pointer-events-none' : 'modal-panel'} w-full max-w-md rounded-2xl border border-[#22242D] bg-[#08080A] p-6 text-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* step progress */}
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[#3B82F6]/60' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold text-[#6E737B]">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1 font-display text-[19px] font-bold tracking-[-0.01em] text-white">{meta.title}</h2>
          </div>
          <button
            onClick={requestClose}
            aria-label="Close"
            className={`text-[#8E8E93] transition hover:text-white active:scale-[0.96] ${FOCUS}`}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div key={step} className="tab-fade mt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Icon className="h-[18px] w-[18px] text-white" strokeWidth={1.5} />
            </span>
            <p className="text-[13px] leading-relaxed text-[#9CA0A8]">{meta.body}</p>
          </div>

          <div className="mt-6">
            {isDone ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-[#262834] bg-[#0C0D10] px-4 py-3">
                <Check className="h-4 w-4 shrink-0 text-[#3B82F6]" strokeWidth={2} />
                <span className="text-[13px] font-semibold text-white">{meta.doneLabel}</span>
              </div>
            ) : (
              <MintButton icon={Icon} onClick={onPrimary} disabled={busy} className="w-full">
                {busy ? meta.ctaBusy : meta.cta}
              </MintButton>
            )}
            <p className="mt-2.5 text-center text-[11.5px] text-[#6E737B]">{meta.helper}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2 border-t border-[#16171D] pt-4">
          {step > 0 ? (
            <QuietButton onClick={onBack} className="px-4 py-2">
              Back
            </QuietButton>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={requestClose}
            className={`text-[12px] font-semibold text-[#8E8E93] transition hover:text-white ${FOCUS}`}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

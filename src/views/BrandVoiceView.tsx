// Brand Voice, DESIGN.md §10 Brand anatomy verbatim: read-only summary grid +
// style-memory box. Editing opens the setup wizard: a guided 5-step Q&A so
// the Brain gets a real voice profile. The questions mirror what a creator
// actually knows: the app (its purpose), the niche it sits in, who uses it and
// what bothers them, the creator's goal for the account, and the voice.
// Save persists via PUT /api/projects/:id.
// FLAGGED: the Edit button + wizard are a functional necessity, not in the mockup.
import { useEffect, useState } from 'react'
import { BookOpen, Pencil, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { BRAND_NAME } from '@/lib/brand'
import { useAnimatedClose } from '@/lib/useAnimatedClose'
import { useMe } from '@/lib/me'
import type { Brain, BrainKey } from '@/lib/types'
import { FOCUS, Field, MintButton, QuietButton, TextArea, TextInput } from '@/components/primitives'
import { ProjectSwitcher } from '@/components/ProjectSwitcher'

const BRAIN_FIELDS: { key: BrainKey; label: string; long?: boolean }[] = [
  { key: 'appName', label: 'App name' },
  { key: 'appDescription', label: 'What it does', long: true },
  { key: 'niche', label: 'Niche' },
  { key: 'audience', label: 'Who it is for' },
  { key: 'audiencePain', label: 'What bothers them', long: true },
  { key: 'accountGoal', label: 'Your goal' },
  { key: 'voiceTone', label: 'Tone' },
]

const NICHE_SUGGESTIONS = [
  'Minimalist home decor',
  'Personal finance for creatives',
  'Healthy eating on a budget',
  'Productivity for founders',
  'Skincare science',
  'Fitness without a gym',
]

const TONE_CHOICES = ['Warm', 'Direct', 'Funny', 'Minimal', 'Bold', 'Nerdy']

// Different creators run the account for different reasons. The goal decides
// what the last slide pushes people toward, so it belongs in the Brain.
const GOAL_CHOICES = ['Grow the account', 'Sell digital products', 'Promote an app', 'Promote a game']

const STEP_TITLES = ['Your app', 'The niche', 'Your audience', 'Your goal', 'Your voice']

const STEP_HELP = [
  'The purpose of your app, or what your account is about. Every slideshow sells this.',
  'The category it lives in. This is the topic every slideshow is about.',
  'The people the slides work for. Their dissatisfaction is what hooks them.',
  'What the account should push people toward. This shapes the last slide.',
  'The model mirrors this voice on every slide.',
]

interface WizardDraft {
  appName: string
  appDescription: string
  niche: string
  audience: string
  audiencePain: string
  accountGoal: string
  voiceTone: string[]
  styleMemory: string
}

export default function BrandVoiceView() {
  const { activeProject, refreshMe, setActiveProjectId } = useMe()
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)
  const brain = activeProject?.brain ?? {}

  const createBrand = async () => {
    if (creating) return
    setCreating(true)
    try {
      const project = await api.createProject()
      setActiveProjectId(project.id)
      await refreshMe()
      setEditing(true)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create your brand.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">Brand Voice</h1>
          <p className="mt-1.5 text-[13px] text-[#9CA0A8]">
            Your app, niche, audience, and style memory. {BRAND_NAME} writes every slideshow in this voice.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ProjectSwitcher />
          {activeProject && (
            <QuietButton icon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </QuietButton>
          )}
        </div>
      </header>

      {activeProject ? (
        <>
          <section className="rounded-xl border border-[#1E2028] p-6">
            <p className="mb-4 font-display text-[13px] font-bold text-white">Your brand</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BRAIN_FIELDS.map((f) => (
                <div key={f.key} className={f.long ? 'sm:col-span-2' : ''}>
                  <Field label={f.label} value={brain[f.key] ?? ''} />
                </div>
              ))}
            </div>
          </section>
          <section className="mt-5 rounded-xl border border-[#1E2028] p-6">
            <p className="mb-4 font-display text-[13px] font-bold text-white">Style memory</p>
            <div className="whitespace-pre-line rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-4 py-3.5 text-[13px] leading-relaxed text-[#E5E7EB]">
              {brain.styleMemory ?? ''}
            </div>
          </section>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-xl border border-[#1E2028] px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <BookOpen className="h-5 w-5 text-white" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-display text-[17px] font-bold text-white">Set up your brand</h2>
          <p className="mt-1.5 max-w-[380px] text-[13px] leading-relaxed text-[#9CA0A8]">
            Tell {BRAND_NAME} what you're building, who it is for, and how you sound. Every slideshow is written from
            that.
          </p>
          <MintButton icon={Plus} onClick={() => void createBrand()} disabled={creating} className="mt-6">
            {creating ? 'Creating...' : 'Create your brand'}
          </MintButton>
        </section>
      )}

      {editing && activeProject && (
        <BrandWizardModal
          projectId={activeProject.id}
          initial={brain}
          onClose={() => setEditing(false)}
          onSaved={() => void refreshMe()}
        />
      )}
    </div>
  )
}

function BrandWizardModal({
  projectId,
  initial,
  onClose,
  onSaved,
}: {
  projectId: string
  initial: Partial<Brain>
  onClose: () => void
  onSaved: () => void
}) {
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const { closing, requestClose } = useAnimatedClose(true, onClose)
  const [draft, setDraft] = useState<WizardDraft>(() => ({
    appName: initial.appName ?? '',
    appDescription: initial.appDescription ?? '',
    niche: initial.niche ?? '',
    audience: initial.audience ?? '',
    audiencePain: initial.audiencePain ?? '',
    accountGoal: initial.accountGoal ?? '',
    voiceTone: (initial.voiceTone ?? '').split(/,\s*/).filter(Boolean),
    styleMemory: initial.styleMemory ?? '',
  }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  const set = (key: keyof WizardDraft, value: WizardDraft[keyof WizardDraft]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleTone = (tone: string) =>
    set(
      'voiceTone',
      draft.voiceTone.includes(tone) ? draft.voiceTone.filter((t) => t !== tone) : [...draft.voiceTone, tone],
    )

  // The app, the niche, the audience, and the goal are the anchors; the rest
  // sharpen but can stay blank. An app-less account still names its purpose.
  const canNext =
    step === 0
      ? draft.appDescription.trim() !== ''
      : step === 1
        ? draft.niche.trim() !== ''
        : step === 2
          ? draft.audience.trim() !== ''
          : step === 3
            ? draft.accountGoal.trim() !== ''
            : true

  const last = step === STEP_TITLES.length - 1

  const next = () => {
    if (canNext && !last) setStep((s) => s + 1)
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const save = async () => {
    setBusy(true)
    try {
      await api.updateProject(projectId, {
        brain: {
          appName: draft.appName.trim(),
          appDescription: draft.appDescription.trim(),
          niche: draft.niche.trim(),
          audience: draft.audience.trim(),
          audiencePain: draft.audiencePain.trim(),
          accountGoal: draft.accountGoal.trim(),
          voiceTone: draft.voiceTone.join(', '),
          styleMemory: draft.styleMemory.trim(),
        },
      })
      toast.success('Brand saved.')
      onSaved()
      requestClose()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not save your brand.')
    } finally {
      setBusy(false)
    }
  }

  const stepBody = (() => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Name of your app or brand (optional)</span>
              <TextInput
                value={draft.appName}
                onChange={(e) => set('appName', e.target.value)}
                placeholder="e.g. Nordic Home"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">What does it do?</span>
              <TextArea
                rows={3}
                value={draft.appDescription}
                onChange={(e) => set('appDescription', e.target.value)}
                placeholder="e.g. helps you design your home with the best tools, on any budget"
              />
            </label>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-[#9CA0A8]">What niche is it in?</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NICHE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('niche', s)}
                    aria-pressed={draft.niche === s}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition active:scale-[0.96] ${FOCUS} ${
                      draft.niche === s
                        ? 'bg-[#3B82F6]/20 text-white'
                        : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Your niche</span>
              <TextInput
                value={draft.niche}
                onChange={(e) => set('niche', e.target.value)}
                placeholder="e.g. Minimalist home decor"
                autoFocus
              />
            </label>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Who actually uses it, or would want to?</span>
              <TextInput
                value={draft.audience}
                onChange={(e) => set('audience', e.target.value)}
                placeholder="e.g. design lovers in their 20s and 30s who rent"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">What are they unhappy with, or not noticing?</span>
              <TextArea
                rows={2}
                value={draft.audiencePain}
                onChange={(e) => set('audiencePain', e.target.value)}
                placeholder="e.g. not satisfied with their room, blind to the small problems holding it back"
              />
            </label>
          </div>
        )
      case 3:
        return (
          <div>
            <p className="text-[11px] font-bold text-[#9CA0A8]">What's your goal for this account?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GOAL_CHOICES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('accountGoal', draft.accountGoal === g ? '' : g)}
                  aria-pressed={draft.accountGoal === g}
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition active:scale-[0.96] ${FOCUS} ${
                    draft.accountGoal === g
                      ? 'bg-[#3B82F6]/20 text-white'
                      : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#8E8E93]">
              Growing asks people to follow or save. Selling points to your digital products. Promoting an app or game
              invites trying it. This decides the last slide.
            </p>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-[#9CA0A8]">Which tones fit you?</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TONE_CHOICES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTone(t)}
                    aria-pressed={draft.voiceTone.includes(t)}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition active:scale-[0.96] ${FOCUS} ${
                      draft.voiceTone.includes(t)
                        ? 'bg-[#3B82F6]/20 text-white'
                        : 'border border-[#1F212B] bg-[#08080A] text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Write one sentence that sounds like you</span>
              <TextArea
                rows={2}
                value={draft.styleMemory}
                onChange={(e) => set('styleMemory', e.target.value)}
                placeholder="e.g. Short, warm sentences. Concrete tips, no filler."
                autoFocus
              />
            </label>
          </div>
        )
      default:
        return null
    }
  })()

  return (
    <div
      className={`${closing ? 'modal-backdrop-out' : 'modal-backdrop'} fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs`}
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Set up your brand"
        className={`${closing ? 'modal-panel-out pointer-events-none' : 'modal-panel'} w-full max-w-lg rounded-2xl border border-[#22242D] bg-[#08080A] p-6 text-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[17px] font-bold tracking-[-0.01em] text-white">Set up your Brand</h2>
            <p className="mt-1 text-[12.5px] text-[#9CA0A8]">
              Step {step + 1} of {STEP_TITLES.length} · {STEP_TITLES[step]}
            </p>
          </div>
          <button
            onClick={requestClose}
            aria-label="Close"
            className={`text-[#8E8E93] transition hover:text-white active:scale-[0.96] ${FOCUS}`}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4 flex gap-1">
          {STEP_TITLES.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#3B82F6]/60' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-[#8E8E93]">{STEP_HELP[step]}</p>

        <div key={step} className="tab-fade mt-4">
          {stepBody}
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          {step > 0 ? (
            <QuietButton onClick={back} className="px-4 py-2">
              Back
            </QuietButton>
          ) : (
            <span />
          )}
          {last ? (
            <MintButton onClick={() => void save()} disabled={busy} className="px-4 py-2 text-[12.5px]">
              {busy ? 'Saving...' : 'Save'}
            </MintButton>
          ) : (
            <MintButton onClick={next} disabled={!canNext} className="px-4 py-2 text-[12.5px]">
              Next
            </MintButton>
          )}
        </div>
      </div>
    </div>
  )
}

// Generation context. One GenerateModal instance lives at the AppShell level
// (the sidebar and the dashboard both open it). runGenerate drives the API
// call, refreshes usage, and bumps reloadKey so the dashboard refetches.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ApiError } from './api'
import { useMe } from './me'

interface GenerateContextValue {
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void
  generating: boolean
  pendingCount: number
  reloadKey: number
  runGenerate: (count: number, idea: string, packs?: string[]) => Promise<void>
}

const GenerateContext = createContext<GenerateContextValue | null>(null)

export function GenerateProvider({ children }: { children: ReactNode }) {
  const { activeProject, refreshMe } = useMe()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const runGenerate = useCallback(
    async (count: number, idea: string, packs?: string[]) => {
      if (!activeProject) {
        toast.error('Set up your Brand first, then generate.')
        return
      }
      setModalOpen(false)
      setGenerating(true)
      setPendingCount(count)
      navigate('/app/dashboard')
      try {
        await api.generate({
          count,
          projectId: activeProject.id,
          idea: idea || undefined,
          packs: packs && packs.length ? packs : undefined,
        })
        await refreshMe()
        setReloadKey((k) => k + 1)
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : 'Generation failed. Try again.')
      } finally {
        setGenerating(false)
      }
    },
    [activeProject, navigate, refreshMe],
  )

  const value = useMemo(
    () => ({ modalOpen, openModal, closeModal, generating, pendingCount, reloadKey, runGenerate }),
    [modalOpen, openModal, closeModal, generating, pendingCount, reloadKey, runGenerate],
  )

  return <GenerateContext.Provider value={value}>{children}</GenerateContext.Provider>
}

export function useGenerate(): GenerateContextValue {
  const ctx = useContext(GenerateContext)
  if (!ctx) throw new Error('useGenerate must be used within a GenerateProvider.')
  return ctx
}

// Used by the generate modal to clamp to the plan's remaining quota.
export function remainingForMe(me: { plan: string; totalGens: number; monthlyGens: number; limit: { total: number; monthly: number } }): number {
  if (me.plan === 'free') return Math.max(0, me.limit.total - me.totalGens)
  return Math.max(0, me.limit.monthly - me.monthlyGens)
}

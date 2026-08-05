// App session context: loads /api/me once, exposes the profile + projects,
// the active project, and a refresh. Rendered by AppShell inside the auth
// gate so every view and the sidebar read from one source of truth.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, ApiError } from './api'
import type { Me, Project } from './types'

const ACTIVE_KEY = 'elion.activeProjectId'

interface MeContextValue {
  me: Me | null
  meLoading: boolean
  meError: string
  refreshMe: () => Promise<void>
  activeProject: Project | null
  setActiveProjectId: (id: string) => void
}

const MeContext = createContext<MeContextValue | null>(null)

export function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [meLoading, setMeLoading] = useState(true)
  const [meError, setMeError] = useState('')
  const [activeId, setActiveId] = useState<string | null>(() => localStorage.getItem(ACTIVE_KEY))

  const refreshMe = useCallback(async () => {
    try {
      setMe(await api.me())
      setMeError('')
    } catch (err) {
      setMeError(err instanceof ApiError ? err.message : 'Could not load your account.')
    } finally {
      setMeLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const activeProject = useMemo(() => {
    if (!me) return null
    return me.projects.find((p) => p.id === activeId) ?? me.projects[0] ?? null
  }, [me, activeId])

  const setActiveProjectId = useCallback((id: string) => {
    setActiveId(id)
    localStorage.setItem(ACTIVE_KEY, id)
  }, [])

  const value = useMemo(
    () => ({ me, meLoading, meError, refreshMe, activeProject, setActiveProjectId }),
    [me, meLoading, meError, refreshMe, activeProject, setActiveProjectId],
  )

  return <MeContext.Provider value={value}>{children}</MeContext.Provider>
}

export function useMe(): MeContextValue {
  const ctx = useContext(MeContext)
  if (!ctx) throw new Error('useMe must be used within a MeProvider.')
  return ctx
}

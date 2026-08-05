// App shell, DESIGN.md §6: h-screen row of Sidebar + scrollable main. Auth
// gated: no Supabase session (or unconfigured client) redirects to /auth.
// One GenerateModal lives here so the sidebar row and every view share it.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { DEMO_SESSION } from '@/lib/demo'
import { GenerateModal } from '@/components/GenerateModal'
import { Toaster } from '@/components/ui/sonner'

export default function AppShell() {
  const location = useLocation()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(DEMO_SESSION)
      return
    }
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => subscription.subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  if (!session) return <Navigate to="/auth" replace />

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#08080A] text-[#E5E7EB]">
      <div className="flex min-h-0 flex-1">
        <Sidebar session={session} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div key={location.pathname} className="view-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <GenerateModal />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  )
}

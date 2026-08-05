// App sidebar, DESIGN.md §6/§7 verbatim. Brand block, Generate row, nav,
// then pinned bottom: plan widget, Sign out, account block. (Settings was a
// duplicate link to Plan & Billing, so it was removed; plan lives in billing.
// The brand switcher lives in the Brand Voice tab header, not the sidebar.)
import { NavLink } from 'react-router-dom'
import { BookOpen, Home, Images, LogOut, Plus, Wallet } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { useGenerate } from '@/lib/generate'
import { useMe } from '@/lib/me'
import { supabase } from '@/lib/supabase'
import { initialsFrom } from '@/lib/format'
import { BRAND_NAME } from '@/lib/brand'
import { FOCUS, Icon } from './primitives'
import { UsageWidget } from './UsageWidget'
import logoUrl from '@/assets/elion-logo.png'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: Home },
  { to: '/app/library', label: 'Library', icon: Images },
  { to: '/app/brand', label: 'Brand Voice', icon: BookOpen },
  { to: '/app/billing', label: 'Plan & Billing', icon: Wallet },
]

export default function Sidebar({ session }: { session: Session }) {
  const { me } = useMe()
  const { openModal } = useGenerate()
  const email = session.user.email ?? 'Account'

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[#16171D] font-sans">
      <div className="px-5 pb-5 pt-6">
        <img src={logoUrl} alt={BRAND_NAME} className="h-6 w-auto" />
      </div>

      <div className="px-2">
        <button
          type="button"
          onClick={openModal}
          className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left font-bold text-white transition hover:text-[#6FA1FF] active:scale-[0.98] ${FOCUS}`}
        >
          <Plus className="h-[16px] w-[16px] shrink-0 text-white" strokeWidth={1.5} />
          <span className="text-[13px]">Generate</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition active:scale-[0.98] ${FOCUS} ${
                isActive ? 'text-[#3B82F6]' : 'text-[#7A7F87] hover:text-[#D1D5DB]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  icon={icon}
                  className={`h-[16px] w-[16px] shrink-0 ${isActive ? 'text-[#3B82F6]' : 'text-[#5F646B]'}`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        {me && <UsageWidget me={me} />}

        <div className="mt-2 flex flex-col">
          <button
            type="button"
            onClick={() => void supabase?.auth.signOut()}
            className={`flex h-9 items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-[#7A7F87] transition hover:text-[#D1D5DB] active:scale-[0.98] ${FOCUS}`}
          >
            <LogOut className="h-4 w-4 text-[#5F646B]" strokeWidth={1.5} />
            Sign out
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2.5 border-t border-[#16171D] px-1.5 pt-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#262834] bg-[#181920] text-[10px] font-bold text-white">
            {initialsFrom(email)}
          </span>
          <p className="min-w-0 truncate text-[12px] font-semibold text-white">{email}</p>
        </div>
      </div>
    </aside>
  )
}

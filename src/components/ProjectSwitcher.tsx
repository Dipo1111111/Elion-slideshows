// Brand switcher, redesigned under /impeccable. Lives ONLY in the Brand Voice
// tab header (NOT the sidebar, NOT the Dashboard). Hard rules from CLAUDE.md:
// no navy-blue anywhere in it, no box-in-a-box (no initials tiles nested in
// bordered controls), no heavy card styling, real motion on open. The trigger
// is plain text + a chevron that rotates; the dropdown is a neutral panel that
// rises from its top-right corner with an expo ease-out and 20ms row stagger,
// reduced-motion safe. Copy uses "brand"/"brands", never "project"/"projects".
import { useState, type CSSProperties } from 'react'
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { useMe } from '@/lib/me'
import type { Project } from '@/lib/types'
import { FOCUS } from './primitives'

export function ProjectSwitcher() {
  const { me, activeProject, refreshMe, setActiveProjectId } = useMe()
  const [open, setOpen] = useState(false)

  const projects = me?.projects ?? []
  const cap = me ? me.limit.projects[me.plan] : 1
  const atCap = projects.length >= cap
  const active = activeProject ?? projects[0]

  const close = () => setOpen(false)

  const switchBrand = (id: string) => {
    setActiveProjectId(id)
    close()
  }

  const newBrand = async () => {
    if (atCap || !me) return
    const name = window.prompt('Name this brand', 'My brand')
    if (name === null) return
    const trimmed = name.trim().slice(0, 60) || 'My brand'
    try {
      const project = await api.createProject(trimmed)
      setActiveProjectId(project.id)
      await refreshMe()
      close()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create this brand.')
    }
  }

  const remove = async (project: Project) => {
    if (projects.length <= 1) return
    if (!window.confirm(`Delete "${project.name}" and all of its slideshows? This cannot be undone.`)) return
    try {
      await api.deleteProject(project.id)
      await refreshMe()
      if (project.id === active?.id) setActiveProjectId('')
      close()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not delete this brand.')
    }
  }

  if (!me) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-8 max-w-[200px] items-center gap-1 rounded-lg border border-[#1E2028] bg-transparent pl-2.5 pr-1.5 text-left transition-colors hover:border-[#2E3140] ${FOCUS}`}
      >
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#D1D5DB] transition-colors hover:text-white">
          {active?.name ?? 'No brand yet'}
        </span>
        <ChevronsUpDown
          className={`h-3 w-3 shrink-0 text-[#5F646B] transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <>
          <div className="fade-in fixed inset-0 z-30" onClick={close} aria-hidden="true" />
          <div
            role="listbox"
            aria-label="Brands"
            className="dropdown-in absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-[#22242D] bg-[#0C0D10] py-1 shadow-2xl"
          >
            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5F646B]">
              Your brands
            </p>
            {projects.map((p, i) => {
              const isActive = p.id === active?.id
              return (
                <div
                  key={p.id}
                  className="dropdown-row group flex items-center"
                  style={{ '--i': Math.min(i, 6) } as CSSProperties}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => switchBrand(p.id)}
                    className={`flex h-9 min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-[#16171D] ${FOCUS}`}
                  >
                    <span
                      className={`min-w-0 flex-1 truncate text-[13px] ${
                        isActive ? 'font-semibold text-white' : 'font-medium text-[#9CA0A8] group-hover:text-[#D1D5DB]'
                      }`}
                    >
                      {p.name}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} />}
                  </button>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => void remove(p)}
                      aria-label={`Delete ${p.name}`}
                      className={`mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#7C838C] opacity-0 transition-opacity hover:bg-[#3A2320] hover:text-[#F4877E] focus-visible:opacity-100 group-hover:opacity-100 ${FOCUS}`}
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              )
            })}
            <div className="dropdown-row mx-2 my-1 border-t border-[#1F212B]" style={{ '--i': projects.length } as CSSProperties} />
            <button
              type="button"
              onClick={() => void newBrand()}
              disabled={atCap}
              className={`dropdown-row flex h-9 w-full items-center gap-2 px-3 text-left text-[13px] font-semibold text-[#D1D5DB] transition-colors hover:bg-[#16171D] hover:text-white disabled:pointer-events-none disabled:text-[#3A3F47] ${FOCUS}`}
              style={{ '--i': projects.length + 1 } as CSSProperties}
            >
              <Plus className="h-3.5 w-3.5 shrink-0 text-[#9CA0A8]" strokeWidth={1.5} />
              New brand
            </button>
            {atCap && (
              <p className="px-3 pb-2 pt-1 text-[10.5px] font-medium text-[#5F646B]">
                Your {me.plan} plan allows {cap} brand{cap === 1 ? '' : 's'}. Upgrade to Pro for more.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

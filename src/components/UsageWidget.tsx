// Sidebar plan widget (DESIGN.md §7 recipe). Free: lifetime count vs 3,
// Upgrade link. Pro: monthly count vs monthly cap, no upgrade link.
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Me } from '@/lib/types'
import { FOCUS } from './primitives'

export function UsageWidget({ me }: { me: Me }) {
  const navigate = useNavigate()
  const isPro = me.plan === 'pro'
  const used = isPro ? me.monthlyGens : me.totalGens
  const cap = isPro ? me.limit.monthly : me.limit.total
  const pct = cap > 0 ? Math.round((used / cap) * 100) : 0

  return (
    <div className="rounded-xl border border-[#1E2028] p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#9CA0A8]">{isPro ? 'Pro plan' : 'Free plan'}</span>
        <span className="font-num text-[11px] text-[#6E737B]">
          {used} of {cap} used
        </span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#3B82F6] transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      {!isPro && (
        <button
          type="button"
          onClick={() => navigate('/app/billing')}
          className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6] transition-colors hover:text-[#6FA1FF] ${FOCUS}`}
        >
          Upgrade to Pro
          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

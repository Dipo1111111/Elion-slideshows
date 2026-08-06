// Plan & Billing. DESIGN.md §10 Billing anatomy, extended to three tiers per
// PRICING.md (Free · Creator $19/mo $190/yr · Studio $49/mo $490/yr). The
// annual chip and the Upgrade buttons open Lemon Squeezy checkout for the
// matching tier (monthly / annual). The Current chip moves to the plan the
// user is on and the matching CTA disappears (no portal in v1; flagged).
import { useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { BRAND_NAME } from '@/lib/brand'
import { useMe } from '@/lib/me'
import { FOCUS, MintButton, Shimmer } from '@/components/primitives'

export default function BillingView() {
  const { me, meLoading } = useMe()
  const [busy, setBusy] = useState(false)
  const plan = me?.plan ?? 'free'
  const isCreator = plan === 'creator' || plan === 'pro'
  const planName = plan === 'studio' ? 'Studio' : isCreator ? 'Creator' : 'Free'
  const cap = me?.limit.total ?? 3
  const used = me?.totalGens ?? 0
  const creatorCap = me?.limit.monthly ?? 100
  const studioCap = me?.limit.monthlyStudio ?? 500

  const upgrade = async (annual: boolean, tier: 'creator' | 'studio') => {
    if (busy) return
    setBusy(true)
    try {
      const { url } = await api.upgradeUrl({ annual, tier })
      window.location.href = url
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not open the checkout page.')
    } finally {
      setBusy(false)
    }
  }

  // Skeleton while /me loads so the page never shows "Free / 0 of 3 used"
  // before the real plan and usage arrive, then flips.
  if (meLoading) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-6 py-8">
        <header className="mb-7">
          <Shimmer className="h-8 w-72 rounded-lg" />
          <Shimmer className="mt-2.5 h-4 w-44 rounded-lg" />
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Shimmer key={i} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const freeRows: [string, string][] = [
    [`${cap} lifetime slideshows`, `${used} of ${cap} used`],
    [`Small 'Made with ${BRAND_NAME}' mark on exports`, ''],
    ['1080×1920 backgrounds + copy', ''],
    ['1 brand project', ''],
  ]
  const creatorRows = [`${creatorCap} slideshows a month`, 'No watermark', '3 brand projects']
  const studioRows = [`${studioCap} slideshows a month`, 'No watermark', '10 brand projects', 'Priority generation']

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">
          Simple. Three plans.
        </h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">You're on the {planName} plan.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <section className="rounded-xl border border-[#1E2028] p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-white">Free</h3>
            {plan === 'free' && (
              <span className="rounded-full bg-[#3B82F6]/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                Current
              </span>
            )}
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$0</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For trying it out.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#D1D5DB]">
            {freeRows.map(([row, right]) => (
              <li key={row} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                  {row}
                </span>
                {right && (
                  <span className="shrink-0 rounded-full border border-[#262834] px-2 py-0.5 text-[11px] font-bold text-[#9CA0A8]">
                    {right}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[#3B82F6]/40 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-white">Creator</h3>
            {isCreator ? (
              <span className="rounded-full bg-[#3B82F6]/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                Current
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void upgrade(true, 'creator')}
                className={`rounded-full border border-[#262834] px-2.5 py-0.5 text-[11px] font-bold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}
              >
                or $190/yr
              </button>
            )}
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$19/mo</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For creators posting every week.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#E5E7EB]">
            {creatorRows.map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                {row}
              </li>
            ))}
          </ul>
          {plan === 'free' ? (
            <MintButton onClick={() => void upgrade(false, 'creator')} disabled={busy} className="mt-5 w-full">
              Upgrade to Creator
            </MintButton>
          ) : (
            isCreator && (
              <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#3B82F6]/20 px-2.5 py-1 text-[11px] font-bold text-white">
                Current plan
              </span>
            )
          )}
        </section>

        <section className="rounded-xl border border-[#1E2028] p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[16px] font-bold text-white">Studio</h3>
            {plan === 'studio' ? (
              <span className="rounded-full bg-[#3B82F6]/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                Current
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void upgrade(true, 'studio')}
                className={`rounded-full border border-[#262834] px-2.5 py-0.5 text-[11px] font-bold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}
              >
                or $490/yr
              </button>
            )}
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$49/mo</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For multi-brand creators.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#E5E7EB]">
            {studioRows.map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                {row}
              </li>
            ))}
          </ul>
          {plan === 'studio' ? (
            <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#3B82F6]/20 px-2.5 py-1 text-[11px] font-bold text-white">
              Current plan
            </span>
          ) : (
            <MintButton onClick={() => void upgrade(false, 'studio')} disabled={busy} className="mt-5 w-full">
              Upgrade to Studio
            </MintButton>
          )}
        </section>
      </div>
    </div>
  )
}

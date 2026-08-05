// Plan & Billing, DESIGN.md §10 Billing anatomy verbatim. Real data: plan,
// generation counts, monthly cap. "Upgrade to Pro" and the "or $99/yr" chip
// open Lemon Squeezy checkout (monthly / annual). On Pro the Current chip
// moves to the Pro card and the CTA disappears (no portal in v1; flagged).
import { useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { BRAND_NAME } from '@/lib/brand'
import { useMe } from '@/lib/me'
import { FOCUS, MintButton } from '@/components/primitives'

export default function BillingView() {
  const { me } = useMe()
  const [busy, setBusy] = useState(false)
  const plan = me?.plan ?? 'free'
  const cap = me?.limit.total ?? 3
  const used = me?.totalGens ?? 0
  const monthly = me?.limit.monthly ?? 100

  const upgrade = async (annual: boolean) => {
    if (busy) return
    setBusy(true)
    try {
      const { url } = await api.upgradeUrl(annual)
      window.location.href = url
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not open the checkout page.')
    } finally {
      setBusy(false)
    }
  }

  const freeRows: [string, string][] = [
    [`${cap} lifetime slideshows`, `${used} of ${cap} used`],
    [`Small 'Made with ${BRAND_NAME}' mark on exports`, ''],
    ['1080×1920 backgrounds + copy', ''],
  ]
  const proRows = [`${monthly} slideshows a month`, 'No watermark', 'Multiple brand projects']

  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8">
      <header className="mb-7">
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white">
          Simple. Just the two plans.
        </h1>
        <p className="mt-1.5 text-[13px] text-[#9CA0A8]">
          You're on the {plan === 'free' ? 'free' : 'Pro'} plan.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <h3 className="font-display text-[16px] font-bold text-white">Pro</h3>
            <button
              type="button"
              onClick={() => void upgrade(true)}
              className={`rounded-full border border-[#262834] px-2.5 py-0.5 text-[11px] font-bold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}
            >
              or $99/yr
            </button>
          </div>
          <p className="mt-3 font-num text-[28px] font-bold leading-none tracking-tight text-white">$19/mo</p>
          <p className="mt-1.5 text-[12.5px] text-[#9CA0A8]">For creators posting every week.</p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#E5E7EB]">
            {proRows.map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={1.5} />
                {row}
              </li>
            ))}
          </ul>
          {plan === 'free' ? (
            <MintButton onClick={() => void upgrade(false)} disabled={busy} className="mt-5 w-full">
              Upgrade to Pro
            </MintButton>
          ) : (
            <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#3B82F6]/20 px-2.5 py-1 text-[11px] font-bold text-white">
              Current plan
            </span>
          )}
        </section>
      </div>
    </div>
  )
}

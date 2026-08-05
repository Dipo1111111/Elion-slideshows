import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND_NAME } from '@/lib/brand'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Tier {
  name: string
  monthly: string
  annual?: string
  tagline: string
  features: string[]
  cta: string
  solid?: boolean
  featured?: boolean
}

// Three columns per PRICING.md: Free · Creator $19 ($190/yr) · Studio $49 ($490/yr).
const TIERS: Tier[] = [
  {
    name: 'Free',
    monthly: '$0',
    tagline: 'For trying it out.',
    features: [
      '3 lifetime slideshows',
      'Hook, slides, caption, and hashtags in your voice',
      'Pinterest backgrounds, reused across slideshows',
      'Full editor, every slide editable',
      '1080×1920 PNGs plus copyable text',
      `Small ${BRAND_NAME} mark on exports`,
      '1 brand project',
    ],
    cta: 'Start free',
  },
  {
    name: 'Creator',
    monthly: '$19',
    annual: 'or $190/yr',
    tagline: 'For creators posting every week.',
    features: [
      '100 slideshows a month',
      'Everything in Free',
      'No watermark on exports',
      '3 brand projects, each with its own Brain',
      'Project switcher and new projects',
    ],
    cta: 'Upgrade to Creator',
    solid: true,
    featured: true,
  },
  {
    name: 'Studio',
    monthly: '$49',
    annual: 'or $490/yr',
    tagline: 'For agencies and multi-brand creators.',
    features: [
      '500 slideshows a month',
      'Everything in Creator',
      '10 brand projects',
      'Priority generation',
      'Higher-quality model option',
      'Priority support',
    ],
    cta: 'Go Studio',
  },
]

export default function Pricing() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.price-col', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
      })
    },
    { scope }
  )

  return (
    <section id="pricing" ref={scope} className="relative overflow-hidden border-t border-[#16171D] px-5 py-24 sm:px-6 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[760px] max-w-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(59,130,246,0.12), transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1080px]">
        <h2 className="text-center font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
          Three plans, one free.
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-center text-[14px] leading-relaxed text-[#9CA0A8]">
          Try it free. Upgrade when the slideshows matter more.
        </p>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3 md:gap-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`price-col relative rounded-2xl p-6 sm:p-7 ${
                t.featured
                  ? 'border border-[#3B82F6]/50 shadow-[0_0_60px_-18px_rgba(59,130,246,0.45)]'
                  : 'border border-[#1E2028]'
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#3B82F6]/60 bg-[#08080A] px-3 py-1 text-[10.5px] font-bold tracking-wide text-[#3B82F6]">
                  Most popular
                </span>
              )}

              <h3 className="font-display text-[16px] font-bold text-white">{t.name}</h3>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-num text-[48px] font-bold leading-none tracking-tight text-white">{t.monthly}</span>
                <span className="text-[14px] font-medium text-[#9CA0A8]">
                  {t.monthly === '$0' ? 'forever' : '/mo'}
                </span>
                {t.annual && <span className="text-[12px] font-semibold text-[#6E737B]">{t.annual}</span>}
              </div>
              <p className="mt-2.5 text-[13px] text-[#9CA0A8]">{t.tagline}</p>

              <ul className="mt-6 space-y-2.5 text-[13.5px] text-[#E5E7EB]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B82F6]" strokeWidth={1.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth"
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] ${
                  t.solid
                    ? 'bg-white text-black hover:bg-[#D7DAE0]'
                    : 'border border-[#2E3140] text-white hover:bg-white/5'
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[12px] text-[#6E737B]">Cancel anytime. Prices in USD.</p>
      </div>
    </section>
  )
}

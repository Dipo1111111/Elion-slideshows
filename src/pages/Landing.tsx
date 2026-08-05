// SaaS product landing. Sticky glass nav with real anchors and a persistent
// benefit CTA, a product-first hero (dashboard screenshot), concrete feature
// copy, transparent pricing, and a closing CTA band. Black stage, blue as
// LIGHT, film grain, cursor light. Brand voice: BRAND_NAME, no tagline,
// "slideshows" never "carousels", no em dashes. Reduced-motion safe.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/landing/Hero'
import HowItWorks from '@/landing/HowItWorks'
import Features from '@/landing/Features'
import Pricing from '@/landing/Pricing'
import Faq from '@/landing/Faq'
import Cta from '@/landing/Cta'
import Footer from '@/landing/Footer'
import { BRAND_NAME } from '@/lib/brand'
import logoUrl from '@/assets/elion-logo.png'
import '@/landing/landing.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const MARQUEE = ['Hooks', 'Slides', 'Captions', 'Hashtags', '1080 × 1920', 'TikTok', 'Instagram', 'Ready to post']

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Landing() {
  // ScrollTriggers measure against fonts + images; refresh once things settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 700)
    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="elion-lp relative min-h-screen bg-[#08080A] font-sans text-[#E5E7EB] antialiased">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header />

      <CursorGlow />

      <main id="main">
        <Hero />
        <Marquee />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
        <Cta />
      </main>

      <Footer />

      <svg className="grain" aria-hidden="true">
        <defs>
          <filter id="lp-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#lp-grain)" />
      </svg>
      <div className="vignette" aria-hidden="true" />
    </div>
  )
}

/* ---------- sticky glass nav: readable from scroll 0, anchors + CTA ---------- */
function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? 'border-[#16171D] bg-[#08080A]/85 backdrop-blur-md'
          : 'border-transparent bg-[#08080A]/45 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${BRAND_NAME} home`}>
          <img src={logoUrl} alt={BRAND_NAME} className="h-5 w-auto" />
        </Link>

        <nav aria-label="Page sections" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[#9CA0A8] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="hidden text-[13px] font-semibold text-[#9CA0A8] transition-colors hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-black transition-colors hover:bg-[#D7DAE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ---------- cursor light: soft blue glow that trails the pointer ---------- */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const m = gsap.matchMedia()
    m.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const el = ref.current
      if (!el) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }
      window.addEventListener('pointermove', move)
      return () => window.removeEventListener('pointermove', move)
    })
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}

/* ---------- ticker band ---------- */
function Marquee() {
  const Group = () => (
    <div className="marquee-group">
      {MARQUEE.map((t) => (
        <span
          key={t}
          className="mx-6 flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9CA0A8] sm:mx-10 sm:gap-10"
        >
          {t}
          <span className="text-[#3B82F6]">·</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee border-y border-[#16171D] py-5" aria-hidden="true">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  )
}

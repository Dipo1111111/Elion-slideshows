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
import { Menu, X } from 'lucide-react'
import { FOCUS } from '@/components/primitives'
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

/* ---------- header: scroll-progress hairline, display-type links with an
   animated underline, and a full-screen mobile menu (none existed before). */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)

  // Progress hairline writes to a ref so the nav never re-renders per scroll.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      if (bar.current) {
        bar.current.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open, lock the page and close on Escape.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? 'border-[#16171D] bg-[#08080A]/90 backdrop-blur-md'
          : 'border-transparent bg-[#08080A]/60 backdrop-blur-sm'
      }`}
    >
      <span ref={bar} aria-hidden className="nav-progress" />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${BRAND_NAME} home`}>
          <img src={logoUrl} alt={BRAND_NAME} className="h-5 w-auto" />
        </Link>

        <nav aria-label="Page sections" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} label={l.label} href={l.href} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className={`hidden text-[13px] font-semibold text-[#9CA0A8] transition-colors hover:text-white sm:block ${FOCUS}`}
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className={`hidden rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-black transition-colors hover:bg-[#D7DAE0] sm:inline-flex ${FOCUS}`}
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#262834] text-white transition hover:bg-white/5 active:scale-[0.96] lg:hidden ${FOCUS}`}
          >
            {open ? <X className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="nav-panel border-t border-[#16171D] bg-[#08080A]/95 backdrop-blur-md lg:hidden">
          <nav aria-label="Page sections" className="mx-auto max-w-[1200px] px-5 pb-6 pt-2 sm:px-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[#16171D] py-4 font-display text-[22px] font-bold tracking-[-0.01em] text-white transition-colors hover:text-[#6FA1FF]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-6 text-[13px] font-bold text-black transition-colors hover:bg-[#D7DAE0]"
              >
                Start free
              </Link>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#2E3140] px-6 text-[13px] font-semibold text-[#D1D5DB] transition-colors hover:bg-[#1A1B21] hover:text-white"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-6 text-center text-[11.5px] text-[#6E737B]">Free forever. 3 lifetime slideshows.</p>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ---------- desktop nav link: Schibsted Grotesk, blue underline that draws
   in from the left on hover and focus. Blue stays a thin mark, never a fill. */
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className={`group relative font-display text-[13.5px] font-semibold text-[#9CA0A8] transition-colors hover:text-white ${FOCUS}`}
    >
      {label}
      <span
        aria-hidden
        className="absolute -bottom-[7px] left-0 h-px w-full origin-left scale-x-0 bg-[#3B82F6] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
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

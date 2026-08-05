// Landing hero. Story-driven, product-first: a benefit headline that names
// what the software actually does, a concrete subhead, then the app dashboard
// rendered as a real screenshot (DashboardPreview) in a browser frame. Blue
// stays light: glows behind the window, thin marks, one accent word. GSAP
// entrance + scroll exit + a subtle 3D tilt on the window, all reduced-motion
// safe (static fully visible before/without JS).
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleField from './ParticleField'
import { AppWindow, DashboardPreview } from './ProductShots'
import { useReducedMotion } from './useReducedMotion'
import { BRAND_NAME } from '@/lib/brand'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Token = { t: string; blue?: boolean }
const LINES: Token[][] = [
  [{ t: 'Writes' }, { t: 'the' }, { t: 'script.' }],
  [{ t: 'Sources' }, { t: 'the' }, { t: 'visuals.' }],
  [{ t: 'You' }, { t: 'post.', blue: true }],
]

const WORDS = ['hook', 'slides', 'caption', 'hashtags']

export default function Hero() {
  const scope = useRef<HTMLElement>(null)
  const cta = useRef<HTMLAnchorElement>(null)
  const appRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useGSAP(
    () => {
      const m = gsap.matchMedia()
      m.add('(prefers-reduced-motion: no-preference)', () => {
        // Entrance choreography
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from('.word-inner', { yPercent: 120, duration: 1.05, stagger: 0.05 }, 0.1)
          .from('.hero-fade', { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.09 }, 0.55)
          .from('.hero-window', { autoAlpha: 0, y: 60, duration: 1.25 }, 0.45)
          .from('.hero-glow-bg', { autoAlpha: 0, duration: 1.8 }, 0.2)
          .from('.app-halo', { autoAlpha: 0, scale: 0.8, duration: 1.4 }, 0.6)
          .from('.hero-chip', { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.12 }, 0.95)
          .from('.scroll-cue', { autoAlpha: 0, duration: 0.6 }, 1.15)

        // Scroll-exit scrub: copy lifts and fades, the window drifts back.
        // The window keeps full opacity through the exit: one opacity
        // controller per element, or GSAP's two tweens fight and the window
        // reads as faded at odd scroll positions.
        gsap.to('.hero-left', {
          yPercent: -6,
          autoAlpha: 0.5,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom 45%', scrub: true },
        })
        gsap.to('.hero-window', {
          yPercent: -8,
          scale: 0.985,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom 25%', scrub: true },
        })

        // Magnetic primary CTA on fine pointers
        const el = cta.current
        if (el && window.matchMedia('(pointer: fine)').matches) {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
          const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            xTo((e.clientX - (r.left + r.width / 2)) * 0.18)
            yTo((e.clientY - (r.top + r.height / 2)) * 0.24)
          }
          const leave = () => {
            xTo(0)
            yTo(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          }
        }

        // Gentle 3D tilt on the app window
        const win = appRef.current
        if (win && window.matchMedia('(pointer: fine)').matches) {
          gsap.set(win, { transformPerspective: 1100 })
          const rx = gsap.quickTo(win, 'rotationX', { duration: 0.6, ease: 'power3.out' })
          const ry = gsap.quickTo(win, 'rotationY', { duration: 0.6, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = win.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            ry(nx * 5)
            rx(-ny * 4)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          win.addEventListener('pointermove', move)
          win.addEventListener('pointerleave', leave)
          return () => {
            win.removeEventListener('pointermove', move)
            win.removeEventListener('pointerleave', leave)
          }
        }
      })
    },
    { scope }
  )

  return (
    <section ref={scope} className="relative overflow-hidden">
      <ParticleField />
      <div aria-hidden className="hero-glow-bg" />

      <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-28 pt-20 sm:px-6 sm:pt-24">
        <div className="hero-left relative z-[1] mx-auto max-w-[820px] text-center">
          <CyclingLine words={WORDS} reduce={reduce} />

          <h1 className="hero-fade mt-5 font-display text-[clamp(2.2rem,6.4vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white text-wrap-normal">
            {LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => (
                  <span key={wi} className="word-mask">
                    <span className={`word-inner ${w.blue ? 'word-glow text-[#3B82F6]' : ''}`}>
                      {w.t}
                      {wi < line.length - 1 ? ' ' : ''}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-fade mx-auto mt-6 max-w-[54ch] text-pretty text-[15px] leading-relaxed text-[#9CA0A8] sm:text-[16px]">
            Set up your Brain once. {BRAND_NAME} learns your niche and your voice, writes the hook, slides, caption,
            and hashtags, pulls real backgrounds that fit, and exports 1080×1920 slides ready to post on TikTok and
            Instagram.
          </p>

          <div className="hero-fade mt-9">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                ref={cta}
                to="/auth"
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[13.5px] font-bold text-black transition-colors hover:bg-[#D7DAE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
              >
                Build your first slideshow
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-[13.5px] font-semibold text-[#D1D5DB] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
              >
                See how it works
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <p className="hero-fade mt-5 text-[12.5px] text-[#6E737B]">Free to start. 3 lifetime slideshows, then Creator from $19/mo.</p>
        </div>

        <div className="hero-window relative mx-auto mt-14 w-full max-w-[860px] sm:mt-16">
          <div aria-hidden className="app-halo" />
          <div ref={appRef} className="hero-window-inner relative z-[2]">
            <AppWindow className="hero-app w-full">
              <DashboardPreview />
            </AppWindow>
          </div>
          <span className="hero-chip absolute -right-2 top-8 z-[3] sm:right-4">
            <span className="chip-float inline-flex items-center gap-1.5 rounded-full border border-[#3A3F47] bg-[#0E0F12]/98 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              Ready to post
            </span>
          </span>
          <span className="hero-chip absolute -left-2 bottom-10 z-[3] sm:left-4">
            <span className="chip-float rounded-full border border-[#3A3F47] bg-[#0E0F12]/98 px-3 py-1.5 font-num text-[11px] font-bold text-white shadow-lg">
              1080 × 1920
            </span>
          </span>
        </div>
      </div>

      <div className="scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E737B]">Scroll</span>
        <span aria-hidden className="cue-line" />
      </div>
    </section>
  )
}

function CyclingLine({ words, reduce }: { words: string[]; reduce: boolean }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((p) => (p + 1) % words.length), 2000)
    return () => clearInterval(t)
  }, [words, reduce])

  return (
    <p className="hero-fade inline-flex flex-wrap items-center justify-center gap-1 text-[13px] font-medium text-[#9CA0A8]">
      It writes the{' '}
      <span className="relative inline-flex h-[1.35em] min-w-[5.5ch] items-center overflow-hidden align-bottom">
        <span key={i} className="cycling-word font-semibold text-[#3B82F6]">
          {words[i]}
        </span>
      </span>{' '}
      for you.
    </p>
  )
}

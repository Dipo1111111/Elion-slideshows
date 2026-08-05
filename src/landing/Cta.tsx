// Landing closing CTA band. Outcome headline, one dominant benefit-driven
// action, quiet trust line underneath.
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Cta() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cta-fade', {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: 'top 78%', once: true },
      })
    },
    { scope }
  )

  return (
    <section ref={scope} className="relative overflow-hidden border-t border-[#16171D] px-5 py-24 sm:px-6 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] max-w-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(59,130,246,0.12), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-[720px] text-center">
        <h2 className="cta-fade font-display text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white text-wrap-balance">
          Your next slideshow is three minutes away.
        </h2>
        <p className="cta-fade mx-auto mt-4 max-w-[50ch] text-[14px] leading-relaxed text-[#9CA0A8]">
          Set up your Brain, type one idea, and export a ready-to-post slideshow. No card needed to start.
        </p>
        <div className="cta-fade mt-8">
          <Link
            to="/auth"
            className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[13.5px] font-bold text-black transition-colors hover:bg-[#D7DAE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
          >
            Build your first slideshow
          </Link>
        </div>
        <p className="cta-fade mt-4 text-[12px] text-[#6E737B]">
          Free forever: 3 lifetime slideshows with a small corner mark. Creator removes the mark and adds monthly volume.
        </p>
      </div>
    </section>
  )
}

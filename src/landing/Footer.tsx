import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND_NAME } from '@/lib/brand'
import logoUrl from '@/assets/elion-logo.png'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Footer() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.footer-fade', {
        autoAlpha: 0,
        y: 18,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true },
      })
    },
    { scope }
  )

  return (
    <footer ref={scope} className="relative overflow-hidden border-t border-[#16171D] px-5 pb-10 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto w-full max-w-[1120px]">
        <Link to="/auth" className="footer-fade block w-fit">
          <img src={logoUrl} alt={BRAND_NAME} className="h-10 w-auto" />
        </Link>

        <div className="footer-fade mt-10 flex flex-col justify-between gap-6 text-[13px] text-[#9CA0A8] sm:flex-row sm:items-center">
          <p className="max-w-[32ch] text-[12.5px] leading-relaxed text-[#6E737B]">
            Slideshows for TikTok and Instagram. Written in your voice, posted by you.
          </p>
          <nav className="flex items-center gap-5 text-[12.5px] font-medium">
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link to="/refund" className="transition-colors hover:text-white">
              Refund policy
            </Link>
          </nav>
        </div>

        <div className="footer-fade mt-12 flex flex-col justify-between gap-6 border-t border-[#16171D] pt-8 sm:flex-row sm:items-center">
          <Link
            to="/auth"
            className="inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-[12.5px] font-bold text-black transition-colors hover:bg-[#D7DAE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
          >
            Get started free
          </Link>
          <p className="text-[12px] text-[#6E737B]">
            © {new Date().getFullYear()} {BRAND_NAME} AI. Free to start, Creator from $19/mo.
          </p>
        </div>
      </div>
    </footer>
  )
}

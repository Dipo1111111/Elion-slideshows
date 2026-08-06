import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FAQS: [string, string][] = [
  [
    'How is this different from posting with built-in tools?',
    'The app writes the full slideshow script in your brand voice and sources the backgrounds, so you go from idea to ready-to-post slides in minutes instead of an hour of staring at a blank page.',
  ],
  [
    'Do I need a card to start?',
    'No. The free plan gives you 3 lifetime slideshows with a small corner mark on exports. Upgrade to Creator when you want more and no watermark.',
  ],
  [
    'Can I change the slides after they are generated?',
    'Yes. Every slide is editable before export. You can rewrite any text, swap backgrounds, and rearrange the order.',
  ],
  [
    'Do you post for me?',
    'No. You post manually in TikTok or Instagram. That keeps reach high and the tool simple. Export gives you the backgrounds and the copy.',
  ],
]

export default function Faq() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.faq-row', {
        y: 26,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: 'top 78%', once: true },
      })
    },
    { scope }
  )

  return (
    <section id="faq" ref={scope} className="scroll-mt-16 px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[720px]">
        <h2 className="text-center font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
          Questions, answered.
        </h2>
        <div className="mt-10 divide-y divide-[#1E2028] border-y border-[#1E2028]">
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq-row group py-5">
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
              >
                {q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#262834] text-[#9CA0A8] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-pretty text-[13.5px] leading-relaxed text-[#9CA0A8]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

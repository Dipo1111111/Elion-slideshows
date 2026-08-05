// Landing how-it-works. Sticky left rail with a scrubbed progress line and
// active-step dots; the right column walks the actual product screens: Brand
// Voice setup, the generate pipeline, then the editor and export.
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppWindow, BrainPreview, EditorPreview, GeneratePreview } from './ProductShots'
import { BRAND_NAME } from '@/lib/brand'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Teach it your voice',
    body: 'Answer five quick questions about your app, your niche, and your audience. That becomes your Brain, and every slideshow it writes sounds like you.',
    preview: <BrainPreview />,
  },
  {
    num: '02',
    title: 'Generate the slideshow',
    body: `Type one idea. ${BRAND_NAME} writes the hook, slides, caption, and hashtags, then pulls real backgrounds that match your niche.`,
    preview: <GeneratePreview />,
  },
  {
    num: '03',
    title: 'Edit and export',
    body: 'Rewrite any slide, swap a background, reorder freely. Then export 1080×1920 PNGs and copy the caption to post in TikTok or Instagram.',
    preview: <EditorPreview />,
  },
]

export default function HowItWorks() {
  const scope = useRef<HTMLElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.from('.how-block', {
        y: 44,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: 'top 72%', once: true },
      })

      const blocks = gsap.utils.toArray<HTMLElement>('.how-block')
      blocks.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })

      if (fill.current) {
        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: scope.current, start: 'top 70%', end: 'bottom 85%', scrub: 0.4 },
          }
        )
      }
    },
    { scope }
  )

  return (
    <section id="how" ref={scope} className="scroll-mt-16 px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid w-full max-w-[1120px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="self-start lg:sticky lg:top-24">
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            From idea to a posted slideshow.
          </h2>
          <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-[#9CA0A8]">
            Three steps. Set up your voice, generate, edit, and export. No design skills needed, no long-winded
            prompts.
          </p>

          <div className="relative mt-12 pl-8">
            <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-[#1E2028]" />
            <span
              ref={fill}
              aria-hidden
              className="absolute bottom-1 left-[5px] top-1 w-px origin-top bg-[#3B82F6]"
              style={{ transform: 'scaleY(0)' }}
            />
            <ol className="space-y-9">
              {STEPS.map((s, i) => (
                <li key={s.num} className="relative flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`z-[1] h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-300 ${
                      active === i
                        ? 'border-[#3B82F6] bg-[#3B82F6] shadow-[0_0_14px_rgba(59,130,246,0.75)]'
                        : 'border-[#2E3140] bg-[#08080A]'
                    }`}
                  />
                  <span className={`font-num text-[12px] font-bold transition-colors ${active === i ? 'text-white' : 'text-[#6E737B]'}`}>
                    {s.num}
                  </span>
                  <span
                    className={`font-display text-[17px] font-bold transition-colors ${
                      active === i ? 'text-white' : 'text-[#9CA0A8]'
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-16 lg:gap-20">
          {STEPS.map((s) => (
            <article key={s.num} className="how-block">
              <div className="border-t border-[#16171D] pt-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-num text-[13px] font-bold text-[#3B82F6]">{s.num}</span>
                  <h3 className="font-display text-[24px] font-bold tracking-[-0.01em] text-white sm:text-[28px]">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[#9CA0A8]">{s.body}</p>
                <AppWindow className="mt-6 w-full">{s.preview}</AppWindow>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

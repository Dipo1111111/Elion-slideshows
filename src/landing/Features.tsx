// Landing features. Concrete, product-truthful rows: what the software
// actually does with the copy that sells it. No icon-card grid, no eyebrow
// kicker: numbered-free hairline rows, each revealing on scroll.
import { useRef } from 'react'
import { MessageSquareText, Image as ImageIcon, Pencil, Smartphone, Sparkles } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FEATURES = [
  {
    icon: Sparkles,
    word: 'Your voice, learned',
    body: 'Set your niche, audience, and style once. The Brain writes every hook and slide in the voice you already post with.',
  },
  {
    icon: MessageSquareText,
    word: 'The full script',
    body: 'One idea in, a complete scroll out. Hook, slides, caption, and hashtags, built to be swiped, not read.',
  },
  {
    icon: ImageIcon,
    word: 'Backgrounds that fit',
    body: 'Real photos pulled by your niche, cached per project and reused across slideshows. No generic stock feel.',
  },
  {
    icon: Pencil,
    word: 'Edit everything',
    body: 'Rewrite any slide, swap any background, reorder freely. You stay in control of the final scroll.',
  },
  {
    icon: Smartphone,
    word: 'Ready to post',
    body: 'Export 1080×1920 PNGs and copy the caption. Paste into TikTok or Instagram and post.',
  },
]

export default function Features() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.feat-row', {
        yPercent: 34,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
      })
    },
    { scope }
  )

  return (
    <section id="features" ref={scope} className="scroll-mt-16 border-t border-[#16171D] px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="max-w-[560px]">
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            One idea in. A ready-to-post slideshow out.
          </h2>
          <p className="mt-4 text-pretty text-[14px] leading-relaxed text-[#9CA0A8]">
            Every part of the scroll is generated for you, and every part stays editable until you export.
          </p>
        </div>

        <div className="mt-14">
          {FEATURES.map(({ icon: Icon, word, body }) => (
            <div
              key={word}
              className="feat-row grid items-baseline gap-4 border-t border-[#1E2028] py-10 md:grid-cols-[0.95fr_1.05fr] md:gap-10 md:py-12"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#262834] bg-[#101116]">
                  <Icon className="h-4 w-4 text-[#3B82F6]" strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-[22px] font-bold tracking-[-0.01em] text-white sm:text-[26px]">{word}</h3>
              </div>
              <p className="max-w-[52ch] text-[14px] leading-relaxed text-[#9CA0A8]">{body}</p>
            </div>
          ))}
          <div className="border-t border-[#1E2028]" />
        </div>
      </div>
    </section>
  )
}

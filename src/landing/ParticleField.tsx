import { useEffect, useRef } from 'react'

// Blue dust drifting up behind the hero. Canvas-based, throttled:
// pauses when off-screen or the tab is hidden, renders one static frame
// under prefers-reduced-motion. Pure decoration (aria-hidden).
type Particle = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  tw: number
  ph: number
}

export default function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let parts: Particle[] = []

    const make = (count: number) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: 0.12 + Math.random() * 0.35,
        a: 0.08 + Math.random() * 0.3,
        tw: 0.6 + Math.random() * 2.4,
        ph: Math.random() * Math.PI * 2,
      }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(90, Math.floor((w * h) / 16000))
      parts = make(n)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t / 1000 + p.ph) * 0.1
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
        }
        if (p.x < -4) p.x = w + 4
        else if (p.x > w + 4) p.x = -4
        const alpha = p.a * (0.6 + 0.4 * Math.sin((t / 1000) * p.tw + p.ph))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120, 160, 255, ${alpha.toFixed(3)})`
        ctx.fill()
      }
    }

    const tick = () => {
      if (!visible) return
      draw(performance.now())
      raf = requestAnimationFrame(tick)
    }

    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              if (visible) {
                tick()
              } else {
                cancelAnimationFrame(raf)
              }
            },
            { rootMargin: '120px' }
          )
        : null

    if (reduce) {
      dpr = 1
      resize()
      draw(0)
      return () => io?.disconnect()
    }

    resize()
    io?.observe(canvas)
    tick()

    const onResize = () => resize()
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else if (visible) {
        tick()
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}

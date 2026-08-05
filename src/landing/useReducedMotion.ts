import { useEffect, useState } from 'react'

// Tracks the prefers-reduced-motion query so non-GSAP animations
// (cycling words, particle cadence) can respect it too.
export function useReducedMotion() {
  const [reduce, setReduce] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}

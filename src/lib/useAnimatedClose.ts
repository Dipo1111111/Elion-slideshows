import { useCallback, useEffect, useRef, useState } from 'react'

// Exit animation for the custom modals (Generate, Editor, Brand wizard). A
// modal must stay mounted while its exit animation plays, so requestClose
// flips `closing` on (which swaps the modal-*-out classes in) and calls
// onClose after `ms` to actually unmount. Route every in-place close (X,
// Cancel, Done, backdrop, Escape) through requestClose; navigation flows can
// still call onClose directly. Reduced motion skips the animation but keeps
// the same short delay, so the close still feels immediate.
export function useAnimatedClose(open: boolean, onClose: () => void, ms = 200) {
  const [closing, setClosing] = useState(false)
  const timerRef = useRef<number | null>(null)

  // Reopen resets an in-flight close (close then reopen within `ms`).
  useEffect(() => {
    if (open) setClosing(false)
  }, [open])

  const requestClose = useCallback(() => {
    if (!open || closing) return
    setClosing(true)
    timerRef.current = window.setTimeout(() => onClose(), ms)
  }, [open, closing, onClose, ms])

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    []
  )

  return { closing, requestClose }
}

// DESIGN.md primitives. Every class string below is copied verbatim from the
// locked UI contract (repo root DESIGN.md §7). These are the only building
// blocks for interactive surfaces; where the contract pins a hex, use it
// exactly. Token utilities are never substituted for a pinned value.

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]'

export function Icon({ icon, className }: { icon: LucideIcon; className: string }) {
  const Cmp = icon
  return <Cmp className={className} strokeWidth={1.5} />
}

/** 9:16 slide thumbnail: real photo, legibility scrim, index numeral. */
export function SlideThumb({
  image,
  index,
  className = '',
}: {
  image?: string
  index: number
  className?: string
}) {
  return (
    <div className={`relative aspect-[9/16] shrink-0 overflow-hidden rounded-lg bg-[#0C0D10] ${className}`}>
      {image && <img src={image} alt={`Slide ${index}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
      <div className="absolute inset-0 bg-black/25" />
      <span className="absolute inset-0 flex items-center justify-center font-num text-[9px] font-bold text-white/90 drop-shadow">
        {index}
      </span>
    </div>
  )
}

/** Skeleton block for the generating state. */
export function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#1A1B21] ${className}`} />
}

/** Primary action: translucent white glass. White is the action language. */
export function MintButton({
  children,
  icon,
  className = '',
  onClick,
  type = 'button',
  disabled,
}: {
  children: ReactNode
  icon?: LucideIcon
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${FOCUS} ${className}`}
    >
      {icon && <Icon icon={icon} className="h-4 w-4" />}
      {children}
    </button>
  )
}

/** Secondary action: outlined dark pill. Recedes so the white leads. */
export function QuietButton({
  children,
  icon,
  className = '',
  onClick,
  disabled,
}: {
  children: ReactNode
  icon?: LucideIcon
  className?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#2E3140] bg-transparent px-3 py-1.5 text-[12px] font-semibold text-[#D1D5DB] transition hover:bg-[#1A1B21] hover:text-white active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${FOCUS} ${className}`}
    >
      {icon && <Icon icon={icon} className="h-3 w-3" />}
      {children}
    </button>
  )
}

export type SlideStatus = 'Draft' | 'Ready' | 'Exported'

/** Status chips. Ready carries the blue accent; the rest sit quiet. */
export function StatusChip({ status }: { status: SlideStatus }) {
  if (status === 'Ready') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3B82F6]/20 px-2.5 py-1 text-[11px] font-bold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Ready
      </span>
    )
  }
  const neutral = status === 'Draft' ? { dot: 'bg-[#6E737B]' } : { dot: 'bg-[#9CA0A8]' }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#262834] bg-[#121317] px-2.5 py-1 text-[11px] font-bold text-[#9CA0A8]">
      <span className={`h-1.5 w-1.5 rounded-full ${neutral.dot}`} />
      {status}
    </span>
  )
}

/** Read-only display box (Brand Voice static fields). */
export function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#9CA0A8]">{label}</span>
      <div className="flex items-center rounded-lg border border-[#1C1E26] bg-[#0C0D10] px-3.5 py-2.5 text-[13px] text-[#E5E7EB]">
        {value}
      </div>
    </label>
  )
}

/** Field label above a modal/brand input. */
export function FieldLabel({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={`mb-1.5 block text-[11px] ${bold ? 'font-bold' : 'font-semibold'} text-[#9CA0A8]`}>
      {children}
    </span>
  )
}

/** Text input, exact DESIGN.md recipe. */
export function TextInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-[#7C838C] focus:border-[#52525B] ${FOCUS} ${className}`}
      {...props}
    />
  )
}

/** Textarea, exact DESIGN.md recipe. */
export function TextArea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full resize-none rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-3 text-[13px] leading-relaxed text-white outline-none transition-colors placeholder:text-[#7C838C] focus:border-[#52525B] ${FOCUS} ${className}`}
      {...props}
    />
  )
}

/** Blue text link with optional arrow. Blue is the state language. */
export function BlueLink({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[12px] font-bold text-[#3B82F6] transition hover:text-[#6FA1FF] active:scale-[0.98] ${FOCUS} ${className}`}
    >
      {children}
    </button>
  )
}

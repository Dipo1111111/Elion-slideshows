// Small display formatters for times, dates, and initials. All output is
// em-dash-free and uses the app's copy voice.

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatMonthDay(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

// "alex.carter@gmail.com" → "AC". Falls back to the first character.
export function initialsFrom(identity: string): string {
  const local = identity.split('@')[0] || identity
  const words = local.split(/[^a-z0-9]+/i).filter(Boolean)
  const letters = (words.length >= 2 ? [words[0][0], words[words.length - 1][0]] : [local[0]]).filter(Boolean)
  return letters.join('').toUpperCase().slice(0, 2)
}

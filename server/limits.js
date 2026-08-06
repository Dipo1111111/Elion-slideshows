// Usage limits. Caps live behind a config object so the real numbers are
// set before launch without code changes (BUILD_PLAN §10).
//   free: 3 lifetime generations (all projects share the quota)
//   creator: 100/month (placeholder), month-windowed
//   studio: 500/month (placeholder), month-windowed
//   anti-abuse: hard 10 generations/hr/user, all tiers
// Counters increment only on success; the hourly limiter counts attempts.
// 'pro' is a legacy alias for 'creator' (profiles created before Studio).
import { HttpError } from './util.js'
import { requireDb } from './db.js'

export const LIMITS = {
  total: Number(process.env.LIMIT_TOTAL_GEN) || 3,
  monthly: Number(process.env.LIMIT_MONTHLY_GEN) || 100,
  monthlyStudio: Number(process.env.LIMIT_MONTHLY_GEN_STUDIO) || 500,
  hourly: 10,
  projects: { free: 1, creator: 3, studio: 10, pro: 3 },
}

const HOUR_MS = 60 * 60 * 1000
const hourlyHits = new Map() // userId -> number[] of recent attempt timestamps

export function getLimits() {
  return LIMITS
}

// Anti-abuse: max 10 generation attempts per hour, all tiers. Throws 429.
export function checkRateLimit(userId) {
  const now = Date.now()
  const recent = (hourlyHits.get(userId) || []).filter((t) => now - t < HOUR_MS)
  if (recent.length >= LIMITS.hourly) {
    hourlyHits.set(userId, recent)
    throw new HttpError(429, 'Too many generations this hour. Try again in a bit.')
  }
  recent.push(now)
  hourlyHits.set(userId, recent)
}

// Monthly cap for a paid plan (creator, studio, or legacy pro).
function monthlyCap(plan) {
  return plan === 'studio' ? LIMITS.monthlyStudio : LIMITS.monthly
}

// How many more generations this user has on the current plan right now.
export function remainingFor(profile) {
  if (profile.plan === 'free') return Math.max(0, LIMITS.total - (profile.total_gens || 0))
  const cap = monthlyCap(profile.plan)
  const ms = profile.month_start ? new Date(profile.month_start) : new Date()
  const now = new Date()
  const reset = ms.getUTCFullYear() !== now.getUTCFullYear() || ms.getUTCMonth() !== now.getUTCMonth()
  const used = reset ? 0 : profile.monthly_gens || 0
  return Math.max(0, cap - used)
}

// Throws 403 when the plan cap is already exhausted.
export async function assertCanGenerate(profile) {
  if (profile.plan === 'free' && (profile.total_gens || 0) >= LIMITS.total) {
    throw new HttpError(403, 'Free plan includes 3 lifetime generations. Upgrade to Pro.')
  }
  if (profile.plan !== 'free' && remainingFor(profile) <= 0) {
    throw new HttpError(403, 'You have used all your slideshows this month. Upgrade or wait for the next cycle.')
  }
}

// Increment counters on success only. Monthly window resets for paid plans.
export async function chargeGeneration(userId, plan) {
  const db = requireDb()
  const { data: profile } = await db
    .from('profiles')
    .select('total_gens, monthly_gens, month_start')
    .eq('id', userId)
    .maybeSingle()
  if (!profile) throw new HttpError(500, 'Profile not found.')
  const now = new Date()
  const ms = profile.month_start ? new Date(profile.month_start) : now
  const reset = ms.getUTCFullYear() !== now.getUTCFullYear() || ms.getUTCMonth() !== now.getUTCMonth()
  const patch = {
    total_gens: (profile.total_gens || 0) + 1,
    monthly_gens: plan !== 'free' ? (reset ? 1 : (profile.monthly_gens || 0) + 1) : profile.monthly_gens || 0,
    month_start: plan !== 'free' && reset ? now.toISOString() : profile.month_start,
  }
  const { error } = await db.from('profiles').update(patch).eq('id', userId)
  if (error) throw new HttpError(500, 'Could not update usage.')
}

export async function canCreateProject(userId, plan) {
  const db = requireDb()
  const { count, error } = await db
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw new HttpError(500, 'Could not count projects.')
  const cap = LIMITS.projects[plan] ?? LIMITS.projects.creator
  return count < cap || cap === Infinity
}

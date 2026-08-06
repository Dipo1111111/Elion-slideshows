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
const hourlyPulls = new Map() // userId -> number[] of recent pull timestamps

// Every pull of 10-40 backgrounds costs ~$0.04-0.16 on Apify (real run data,
// 2026-08-06), so pulls get their own cap separate from generations: 6 pulls/hr
// is many more than a real curation session needs, and bounds the blast radius
// if someone tries to run up scrape charges.
const PULL_HOURLY = 6

export function getLimits() {
  return LIMITS
}

function hitRateLimit(map, userId, cap, message) {
  const now = Date.now()
  const recent = (map.get(userId) || []).filter((t) => now - t < HOUR_MS)
  if (recent.length >= cap) {
    map.set(userId, recent)
    throw new HttpError(429, message)
  }
  recent.push(now)
  map.set(userId, recent)
}

// Anti-abuse: max 10 generation attempts per hour, all tiers. Throws 429.
export function checkRateLimit(userId) {
  hitRateLimit(hourlyHits, userId, LIMITS.hourly, 'Too many generations this hour. Try again in a bit.')
}

// Pulls are the only route with a real unit cost (Apify scrape), so cap them.
export function checkPullRateLimit(userId) {
  hitRateLimit(hourlyPulls, userId, PULL_HOURLY, 'Too many pulls this hour. Try again in a bit.')
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
    throw new HttpError(403, 'Free plan includes 3 lifetime generations. Upgrade to Creator.')
  }
  if (profile.plan !== 'free' && remainingFor(profile) <= 0) {
    throw new HttpError(403, 'You have used all your slideshows this month. Upgrade or wait for the next cycle.')
  }
}

// Increment counters on success only. Monthly window resets for paid plans.
// Compare-and-swap: read the counters, then UPDATE only if they still match
// what we read. Two concurrent generations from the same account would
// otherwise both read N and both write N+1 (one increment lost, so a burst of
// parallel requests could slip past a cap). The row lock Postgres takes on the
// guarded UPDATE makes the check-and-set atomic; a stale guard means another
// request incremented in between, so re-read and retry.
export async function chargeGeneration(userId, plan) {
  const db = requireDb()
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data: profile, error: readErr } = await db
      .from('profiles')
      .select('total_gens, monthly_gens, month_start')
      .eq('id', userId)
      .maybeSingle()
    if (readErr || !profile) throw new HttpError(500, 'Profile not found.')
    const now = new Date()
    const ms = new Date(profile.month_start)
    const reset = plan !== 'free' && (ms.getUTCFullYear() !== now.getUTCFullYear() || ms.getUTCMonth() !== now.getUTCMonth())
    const patch = {
      total_gens: profile.total_gens + 1,
      monthly_gens: reset ? 1 : profile.monthly_gens + (plan !== 'free' ? 1 : 0),
      month_start: reset ? now.toISOString() : profile.month_start,
    }
    // Guard on the two counters we actually increment. month_start is not a
    // guard: a reset flips monthly_gens to 1, which the monthly_gens guard
    // already catches, and timestamptz equality through PostgREST is the one
    // round-trip that could silently mismatch and 500 every generation.
    const { data: updated, error } = await db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .eq('total_gens', profile.total_gens)
      .eq('monthly_gens', profile.monthly_gens)
      .select('id')
      .maybeSingle()
    if (error) throw new HttpError(500, 'Could not update usage.')
    if (updated) return
    // Guard failed: counters moved under us. Loop re-reads fresh values.
  }
  throw new HttpError(500, 'Could not update usage.')
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

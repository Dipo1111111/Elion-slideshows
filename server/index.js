// Elion Express server, single Node process: API + (in prod) the built UI.
// ESM plain JS. API surface per BUILD_PLAN §7. Public routes: health,
// lemon/webhook, images/:hash. Everything else /api requires a Bearer JWT.
// Load .env FIRST so db.js/auth.js see SUPABASE_* at module top level.
import 'dotenv/config'
import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { requireAuth } from './auth.js'
import { HttpError, pick } from './util.js'
import * as db from './db.js'
import {
  getLimits,
  checkRateLimit,
  assertCanGenerate,
  remainingFor,
  chargeGeneration,
  canCreateProject,
} from './limits.js'
import { generateSlideshows } from './generate.js'
import { pullImages, removeImage, imageProxyHandler } from './images.js'
import { createShare, getShare, renderSharePage } from './exports.js'
import { handleWebhook } from './lemon.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 8787
const HOST = process.env.HOST || '0.0.0.0'
const DIST = join(__dirname, '..', 'dist')

const app = express()
app.use(
  express.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf
    },
  }),
)

// Async route wrapper: a rejected promise becomes a JSON error. HttpError
// carries its status; anything else is a 500.
const h = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err)
    const status = err instanceof HttpError ? err.status : 500
    res.status(status).json({ error: err.message || 'Internal error' })
  })

/* ----------------------------- public ----------------------------- */

app.get('/api/health', h(async (_req, res) => res.json({ ok: true })))
app.post('/api/lemon/webhook', h(handleWebhook))
app.get('/api/images/:hash', h(imageProxyHandler))

// Public send-to-phone share page. Unguessable token is the capability; the
// page is a stripped phone-first view of one slideshow's images + text.
app.get('/s/:token', h(async (req, res) => {
  const meta = await getShare(req.params.token)
  if (!meta) return res.status(404).send('This link has expired or does not exist.')
  res.type('html').send(renderSharePage(meta))
}))

// Everything below this line is an authed /api route.
app.use('/api', requireAuth)

/* --------------------------- authed: me ---------------------------- */

app.get('/api/me', h(async (req, res) => {
  const { id } = req.user
  await db.ensureProfile(id)
  const profile = await db.getProfile(id)
  const projects = await db.listProjects(id)
  const limits = getLimits()
  res.json({
    id,
    plan: profile.plan,
    totalGens: profile.total_gens,
    monthlyGens: profile.monthly_gens,
    monthStart: profile.month_start,
    limit: limits,
    projects,
    activeProjectId: projects[0]?.id || null,
  })
}))

/* -------------------------- authed: projects ----------------------- */

app.post('/api/projects', h(async (req, res) => {
  const profile = await db.getProfile(req.user.id)
  if (!(await canCreateProject(req.user.id, profile.plan))) {
    const cap = getLimits().projects[profile.plan] ?? getLimits().projects.creator
    throw new HttpError(403, `Your plan allows ${cap} project${cap === 1 ? '' : 's'}. Upgrade for more.`)
  }
  const project = await db.createProject(req.user.id, String(req.body?.name || 'My brand').slice(0, 60))
  res.json(project)
}))

app.get('/api/projects', h(async (req, res) => {
  res.json(await db.listProjects(req.user.id))
}))

const BRAIN_KEYS = ['niche', 'appName', 'appDescription', 'audience', 'audiencePain', 'accountGoal', 'voiceTone', 'styleMemory']
const MAX_STRING = 4000

app.put('/api/projects/:id', h(async (req, res) => {
  const patch = { name: undefined, brain: undefined }
  if (req.body?.name !== undefined) patch.name = String(req.body.name).slice(0, 60)
  if (req.body?.brain !== undefined) {
    const brain = pick(req.body.brain, BRAIN_KEYS)
    for (const key of BRAIN_KEYS) if (brain[key] !== undefined) brain[key] = String(brain[key]).slice(0, MAX_STRING)
    patch.brain = brain
  }
  res.json(await db.updateProject(req.user.id, req.params.id, patch))
}))

app.delete('/api/projects/:id', h(async (req, res) => {
  await db.deleteProject(req.user.id, req.params.id)
  res.json({ ok: true })
}))

/* --------------------------- authed: generate ---------------------- */

app.post('/api/generate', h(async (req, res) => {
  const count = Math.max(1, Math.min(100, Number(req.body?.count) || 1))
  const projectId = String(req.body?.projectId || '')
  const idea = typeof req.body?.idea === 'string' && req.body.idea.trim() ? req.body.idea.trim().slice(0, 300) : ''
  const packs = Array.isArray(req.body?.packs) ? req.body.packs.map((p) => String(p)).filter(Boolean).slice(0, 50) : undefined

  const profile = await db.getProfile(req.user.id)
  checkRateLimit(req.user.id)
  await assertCanGenerate(profile)
  const remaining = remainingFor(profile)
  if (count > remaining) {
    throw new HttpError(403, `Only ${remaining} slideshow${remaining === 1 ? '' : 's'} left on your plan.`)
  }

  const slideshows = await generateSlideshows({ userId: req.user.id, projectId, count, idea, packs })
  await chargeGeneration(req.user.id, profile.plan)
  res.json({ slideshows })
}))

/* --------------------------- authed: queue ------------------------- */

app.get('/api/queue', h(async (req, res) => {
  const projectId = String(req.query?.projectId || '')
  if (!projectId) throw new HttpError(400, 'projectId is required.')
  res.json(await db.listQueue(req.user.id, projectId))
}))

const QUEUE_KEYS = ['title', 'hook', 'caption', 'hashtags', 'slides', 'status']

app.put('/api/queue/:id', h(async (req, res) => {
  const patch = pick(req.body, QUEUE_KEYS)
  if (patch.hashtags !== undefined) patch.hashtags = Array.isArray(patch.hashtags) ? patch.hashtags.slice(0, 8) : []
  if (patch.slides !== undefined) {
    patch.slides = Array.isArray(patch.slides) ? patch.slides.slice(0, 20) : []
  }
  if (patch.status !== undefined && !['Draft', 'Ready', 'Exported'].includes(patch.status)) delete patch.status
  res.json(await db.updateQueue(req.user.id, req.params.id, patch))
}))

app.delete('/api/queue/:id', h(async (req, res) => {
  await db.deleteQueue(req.user.id, req.params.id)
  res.json({ ok: true })
}))

/* -------------------------- authed: send to phone ------------------- */

app.post('/api/exports', h(async (req, res) => {
  const projectId = String(req.body?.projectId || '')
  const slideshowId = String(req.body?.slideshowId || '')
  if (!projectId) throw new HttpError(400, 'projectId is required.')
  if (!slideshowId) throw new HttpError(400, 'slideshowId is required.')
  const { token } = await createShare({
    userId: req.user.id,
    projectId,
    slideshowId,
    caption: req.body?.caption,
    hashtags: req.body?.hashtags,
    slides: req.body?.slides,
  })
  const base = process.env.APP_URL || `${req.protocol}://${req.get('host')}`
  res.json({ token, url: `${base}/s/${token}` })
}))

/* --------------------------- authed: library ----------------------- */

app.get('/api/library', h(async (req, res) => {
  const projectId = String(req.query?.projectId || '')
  if (!projectId) throw new HttpError(400, 'projectId is required.')
  const project = await db.getProject(req.user.id, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  res.json(project.imagePacks || [])
}))

app.post('/api/library/pull', h(async (req, res) => {
  const projectId = String(req.body?.projectId || '')
  if (!projectId) throw new HttpError(400, 'projectId is required.')
  const searches = typeof req.body?.searches === 'string' ? req.body.searches : ''
  const count = Number(req.body?.count) || 40
  const { entries } = await pullImages({ userId: req.user.id, projectId, searches, count })
  res.json({ entries })
}))

app.delete('/api/library/:id', h(async (req, res) => {
  const projectId = String(req.query?.projectId || '')
  if (!projectId) throw new HttpError(400, 'projectId is required.')
  await removeImage({ userId: req.user.id, projectId, imageId: req.params.id })
  res.json({ ok: true })
}))

/* --------------------------- authed: billing ----------------------- */

app.get('/api/upgrade-url', h(async (req, res) => {
  const storeUrl = process.env.LEMON_SQUEEZY_STORE_URL
  const isStudio = req.query?.tier === 'studio'
  const isAnnual = req.query?.annual === '1'
  const envKey = isStudio
    ? isAnnual
      ? 'LEMON_SQUEEZY_VARIANT_ID_STUDIO_ANNUAL'
      : 'LEMON_SQUEEZY_VARIANT_ID_STUDIO'
    : isAnnual
      ? 'LEMON_SQUEEZY_VARIANT_ID_ANNUAL'
      : 'LEMON_SQUEEZY_VARIANT_ID'
  const variantId = process.env[envKey]
  if (!storeUrl || !variantId) {
    throw new HttpError(503, 'Billing is not configured on the server.')
  }
  const url = `${storeUrl}/buy/${variantId}?checkout[custom][user_id]=${encodeURIComponent(req.user.id)}`
  res.json({ url })
}))

/* ------------------------- production static ----------------------- */

if (existsSync(DIST)) {
  app.use(express.static(DIST))
  // SPA fallback. Never answer an asset-like path with index.html: a missing
  // or re-hashed bundle would otherwise come back as text/html and hard-fail
  // the module script with a confusing MIME error.
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
    if (/\.[a-zA-Z0-9]{1,8}$/.test(req.path)) return next()
    res.sendFile(join(DIST, 'index.html'))
  })
}

app.listen(PORT, HOST, () => {
  console.log(`\n  Elion server → http://localhost:${PORT} (bound to ${HOST})`)
})

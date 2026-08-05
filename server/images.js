// Image library. Pinterest pulls via the platform Apify key, downloaded and
// stored in Supabase Storage, served same-origin through /api/images/:hash
// so canvas export is never tainted. When APIFY_API_KEY is unset, pull
// returns deterministic picsum stand-ins so the whole app runs keyless.
// Mirrors the reference product's library: comma-separated searches, a Max
// count (10..40, default 10), and every pull becomes a named pack that
// generation draws from.
import { HttpError, sha256 } from './util.js'
import { sb, getProject, updateProject } from './db.js'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'backgrounds'

const PULL_DEFAULT = 10
const PULL_MIN = 10
const PULL_MAX = 40

// Pinterest's CDN 403s plain fetches, so downloads send a browser-ish UA and
// referer like a real visit would.
const IMG_FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Referer: 'https://www.pinterest.com/',
}

// "dark moody, cozy bedroom" → ["dark moody", "cozy bedroom"]. A comma list of
// phrases; each phrase may contain spaces.
function splitSearches(input) {
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean)
  return String(input || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Pull usable image URLs out of whatever the Apify actor returns. The actor
// shape varies between versions, so prefer the structured media fields, then
// scan the whole response for pinimg.com assets, de-duping by filename and
// keeping full-size originals over thumbnails.
function extractPinUrls(items) {
  const list = Array.isArray(items) ? items : []
  const urls = []
  const seen = new Set()
  const push = (raw) => {
    const u = String(raw).replace(/&amp;/g, '&').replace(/\\\//g, '/')
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(u)) return
    const name = (u.split('/').pop() || '').split('?')[0]
    if (!name || seen.has(name)) return
    seen.add(name)
    urls.push(u)
  }
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const media = item.media?.images
    const chosen = media?.original ?? media?.orig ?? media?.large ?? media?.medium ?? media?.small
    if (chosen?.url) push(chosen.url)
  }
  if (urls.length) return urls
  const blob = JSON.stringify(list)
  const found = blob.match(/https?:\\?\/\\?\/[^"'\\\s]*pinimg\.com[^"'\\\s]*/gi) || []
  for (const raw of found) if (/\/originals\//i.test(raw)) push(raw)
  for (const raw of found) push(raw)
  return urls
}

// Deterministic keyless fallback pool. Ids stay readable so the dev
// /api/images/:hash route can rebuild the picsum URL from the id.
function picsumEntries({ queries, count = PULL_DEFAULT, pack }) {
  const base =
    ((queries.length ? queries.join('-') : pack) || 'background')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase()
      .slice(0, 40) || 'background'
  return Array.from({ length: count }, (_, i) => ({
    id: `picsum-${base}-${i}`,
    url: `https://picsum.photos/seed/elion-${base}-${i}/640/960`,
    pulledAt: new Date().toISOString(),
    query: queries.join(', ') || pack,
    pack,
  }))
}

async function uploadToStorage(url) {
  const id = sha256(url)
  const res = await fetch(url, { headers: IMG_FETCH_HEADERS })
  if (!res.ok) return null
  const bytes = Buffer.from(await res.arrayBuffer())
  if (bytes.length < 1024) return null // skip tiny placeholders
  const type = res.headers.get('content-type') || 'image/jpeg'
  const { error } = await sb.storage.from(BUCKET).upload(id, bytes, { contentType: type, upsert: true })
  if (error) return null
  return { id, url, pulledAt: new Date().toISOString() }
}

// Single-request Apify run: the actor blocks until done (up to 5 min), so a
// pull is one visible wait instead of polling. Returns downloaded entries.
async function apifyPull({ queries, limit, pack }) {
  const apiKey = process.env.APIFY_API_KEY
  const actorPath = (process.env.APIFY_ACTOR_ID || 'fatihtahta/pinterest-scraper-search').replace('/', '~')
  const res = await fetch(`https://api.apify.com/v2/acts/${actorPath}/run-sync-get-dataset-items?token=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ queries, limit }),
    signal: AbortSignal.timeout(300_000),
  })
  if (!res.ok) throw new HttpError(502, `Apify scrape failed (${res.status}).`)
  const items = await res.json()
  const urls = extractPinUrls(items).slice(0, limit)
  const entries = []
  for (const url of urls) {
    const stored = await uploadToStorage(url)
    if (stored) entries.push({ ...stored, query: queries.join(', '), pack })
  }
  return entries
}

// Pull new backgrounds for a project. Searches are comma-separated phrases;
// the joined list names the pack. Appends to the pool, persists, returns the
// new entries so the UI can report exactly what landed.
export async function pullImages({ userId, projectId, searches, count }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  const queries = splitSearches(searches)
  const fallback = project.brain.niche || project.name
  const pack = queries.length ? queries.join(', ') : fallback
  const limit = Math.min(Math.max(Math.round(Number(count)) || PULL_DEFAULT, PULL_MIN), PULL_MAX)
  const entries = process.env.APIFY_API_KEY
    ? await apifyPull({ queries, limit, pack })
    : picsumEntries({ queries, count: limit, pack })
  const imagepacks = [...(project.imagePacks || []), ...entries]
  await updateProject(userId, projectId, { imagepacks })
  return { entries }
}

// Remove one library image from the pool (best-effort storage cleanup).
export async function removeImage({ userId, projectId, imageId }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  const imagepacks = (project.imagePacks || []).filter((e) => e.id !== imageId)
  await updateProject(userId, projectId, { imagepacks })
  if (sb) await sb.storage.from(BUCKET).remove([imageId]).catch(() => {})
  return imagepacks
}

// Assign one existing Library image per slide. Generation never scrapes:
// backgrounds are pulled first in the Library (a visible step with clear
// feedback), then reused across every slideshow. When `packs` names a
// selection, only those packs are drawn from. Prefers an image not yet used
// in the same slideshow so a carousel never repeats a background.
export async function assignBackgrounds({ userId, projectId, slideshows, packs }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  let pool = project.imagePacks || []
  if (Array.isArray(packs) && packs.length) {
    pool = pool.filter((e) => packs.includes(e.pack || e.query || ''))
  }
  if (pool.length === 0) {
    throw new HttpError(400, 'No backgrounds to use. Pull backgrounds in the Library first, then generate.')
  }
  for (const show of slideshows) {
    const used = new Set()
    for (const slide of show.slides) {
      const fresh = pool.filter((e) => !used.has(e.id))
      const pick = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))]
      used.add(pick.id)
      slide.bg = { id: pick.id, url: pick.url }
    }
  }
}

// Same-origin image bytes. Storage-backed in prod (key = sha256 of source
// URL); in dev it proxies the deterministic picsum URL so exports stay
// same-origin there too. Public: <img> tags cannot send Authorization.
export async function imageProxyHandler(req, res) {
  const hash = req.params.hash
  if (sb) {
    const { data, error } = await sb.storage.from(BUCKET).download(hash)
    if (error || !data) return res.status(404).json({ error: 'Image not found.' })
    const buffer = Buffer.from(await data.arrayBuffer())
    res.setHeader('content-type', data.type || 'image/jpeg')
    res.setHeader('cache-control', 'public, max-age=31536000, immutable')
    return res.send(buffer)
  }
  const upstream = await fetch(`https://picsum.photos/seed/${encodeURIComponent(hash)}/640/960`)
  if (!upstream.ok) return res.status(404).json({ error: 'Image not found.' })
  const buffer = Buffer.from(await upstream.arrayBuffer())
  res.setHeader('content-type', upstream.headers.get('content-type') || 'image/jpeg')
  res.setHeader('cache-control', 'public, max-age=86400')
  res.send(buffer)
}

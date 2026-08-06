// Image library. Pinterest pulls via the platform Apify key, downloaded and
// stored in Supabase Storage, served same-origin through /api/images/:hash
// so canvas export is never tainted. When APIFY_API_KEY is unset, pull
// returns deterministic picsum stand-ins so the whole app runs keyless.
// Mirrors the reference product's library: comma-separated searches, a Max
// count (10..40, default 10), and every pull becomes a named pack that
// generation draws from.
import sharp from 'sharp'
import { HttpError, sha256 } from './util.js'
import { sb, getProject, updateProject } from './db.js'
import { chatJSON } from './openrouter.js'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'backgrounds'

const PULL_DEFAULT = 10
const PULL_MIN = 10
const PULL_MAX = 40

// Quality gate for slideshow backgrounds (1080x1920, cover-cropped).
// Anything small enough to look soft on export, or far from portrait, is
// dropped before it reaches the Library. MIN_SIDE is the shorter side: at
// 1080 wide the renderer cover-crops 1:1 with no upscale; anything under 900
// (like square 800x800 pins) gets visibly soft when scaled up to fill.
const MIN_SIDE_PX = 900 // shorter side of the source image
const MAX_RATIO = 2.2 // width/height: reject ultra-wide (heavy side crop)
const MIN_RATIO = 0.35 // reject ultra-tall/skinny
const DUP_HAMMING = 3 // perceptual-hash distance that counts as a near-duplicate

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

// Read decoded dimensions (headers only, no full decode) so the gate can drop
// images that are too small or the wrong shape for a 9:16 background.
async function usableDimensions(bytes) {
  try {
    const meta = await sharp(bytes).metadata()
    if (!meta.width || !meta.height) return null
    const minSide = Math.min(meta.width, meta.height)
    const ratio = meta.width / meta.height
    if (minSide < MIN_SIDE_PX) return null
    if (ratio > MAX_RATIO || ratio < MIN_RATIO) return null
    return { width: meta.width, height: meta.height }
  } catch {
    return null
  }
}

// 64-bit average perceptual hash of the image at 8x8. Two versions of the same
// pin (different URLs, same picture) hash within a few bits of each other.
// sharp decodes in native C++ so a full-res pin hashes in a few ms.
async function phash(bytes) {
  try {
    const { data } = await sharp(bytes).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true })
    let sum = 0
    for (const g of data) sum += g
    const avg = sum / data.length
    let hash = 0n
    for (const g of data) hash = (hash << 1n) | (g >= avg ? 1n : 0n)
    return hash
  } catch {
    return null // undecodable, keep it (the dimension gate already ran)
  }
}

function hamming(a, b) {
  let d = 0
  let x = a ^ b
  while (x) {
    d++
    x &= x - 1n
  }
  return d
}

// Download one pin, run the quality gate, dedupe against the batch, and store.
// Returns the entry or null. Every rejection is logged so a bad pull is
// explainable from server logs.
async function downloadAndStore(url, seenHashes, queryLabel, pack) {
  const id = sha256(url)
  const log = `[images] ${url.slice(0, 80)}`
  let res
  try {
    res = await fetch(url, { headers: IMG_FETCH_HEADERS, signal: AbortSignal.timeout(20_000) })
  } catch (err) {
    console.error(`${log}: download ${err.name === 'TimeoutError' ? 'timed out' : `failed (${err.message})`}`)
    return null
  }
  if (!res.ok) {
    console.error(`${log}: download rejected HTTP ${res.status}`)
    return null
  }
  const bytes = Buffer.from(await res.arrayBuffer())
  if (bytes.length < 1024) {
    console.error(`${log}: download too small (${bytes.length}B)`)
    return null
  }
  const dims = await usableDimensions(bytes)
  if (!dims) {
    console.warn(`${log}: rejected (too small or wrong aspect)`)
    return null
  }
  const hash = await phash(bytes)
  if (hash !== null) {
    const dup = seenHashes.find((h) => hamming(h.hash, hash) <= DUP_HAMMING)
    if (dup) {
      console.log(`${log}: near-duplicate of ${dup.id.slice(0, 12)}`)
      return null
    }
    seenHashes.push({ hash, id })
  }
  const type = res.headers.get('content-type') || 'image/jpeg'
  const { error } = await sb.storage.from(BUCKET).upload(id, bytes, { contentType: type, upsert: true })
  if (error) {
    console.error(`${log}: storage upload failed (${error.message})`)
    return null
  }
  return { id, url, pulledAt: new Date().toISOString(), query: queryLabel, pack, width: dims.width, height: dims.height }
}

// Run `fn` over items with at most `limit` in flight. Pinterest full-res
// downloads are the slow part of a pull (seconds each), so fanning them out a
// few at a time cuts wall time without hammering the CDN.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return out
}

// Single-request Apify run: the actor blocks until done (up to 5 min), so a
// pull is one visible wait instead of polling. Returns the curated entries.
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
  const queryLabel = queries.join(', ')
  const seenHashes = []
  const stored = await mapLimit(urls, 4, (url) => downloadAndStore(url, seenHashes, queryLabel, pack))
  const entries = stored.filter(Boolean)
  if (urls.length > 0 && entries.length === 0) {
    console.error(`[images] pull "${pack}": found ${urls.length} pins, saved 0`)
    throw new HttpError(
      502,
      `Pinterest returned ${urls.length} images, but none could be downloaded and saved. Pinterest often blocks cloud servers; try again in a few minutes.`,
    )
  }
  console.log(`[images] pull "${pack}": saved ${entries.length}/${urls.length}`)
  return entries
}

// Expand a creator's raw searches into specific, aesthetic-qualified Pinterest
// queries via OpenCode (free model). Raw keywords like "gym aesthetic" return
// memes and quote cards; specific phrases return coherent photo sets. Falls
// back to the raw queries on any failure so a pull never blocks on the LLM.
async function expandSearches(queries, niche) {
  if (!process.env.OPENCODE_API_KEY) return queries
  const base = queries.length ? queries.join(', ') : niche
  if (!base) return queries
  const system =
    'You turn a Pinterest search into refined image-search phrases for slideshow backgrounds. ' +
    'Return JSON only: {"searches":["...","...","..."]}.'
  const user =
    `The creator wants background photos for: ${base}.\n` +
    'Return 3 to 4 specific search phrases (each 4 to 10 words) that would return ' +
    'high-quality, visually coherent photos with no text, watermarks, memes, or quote cards, ' +
    'and that work as portrait backgrounds. Vary the angles and subjects. ' +
    'Avoid filler words like "aesthetic", "background", "wallpaper", "hd", "beautiful".'
  // The free model is flaky (occasionally returns empty or drops the
  // connection), so retry once before giving up on the nicer searches.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const parsed = await chatJSON({ system, user, maxTokens: 300 })
      const out = Array.isArray(parsed?.searches)
        ? parsed.searches.map((s) => String(s).trim()).filter(Boolean).slice(0, 6)
        : []
      if (out.length) return out
    } catch {
      // empty or failed — one retry, then fall back
    }
  }
  console.warn('[images] search expansion fell back to raw queries (2 attempts)')
  return queries
}

// Pull new backgrounds for a project. Searches are comma-separated phrases;
// the joined list names the pack (the user's own words, not the expanded
// queries, so the Library grouping stays readable). Appends to the pool,
// persists, returns the new entries so the UI can report exactly what landed.
export async function pullImages({ userId, projectId, searches, count }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  const queries = splitSearches(searches)
  const fallback = project.brain.niche || project.name
  const pack = queries.length ? queries.join(', ') : fallback
  const limit = Math.min(Math.max(Math.round(Number(count)) || PULL_DEFAULT, PULL_MIN), PULL_MAX)
  let entries
  if (process.env.APIFY_API_KEY) {
    const searchTerms = await expandSearches(queries, fallback)
    if (searchTerms.join(', ') !== queries.join(', ')) {
      console.log(`[images] expanded "${queries.join(', ') || fallback}" -> ${searchTerms.join(' | ')}`)
    }
    entries = await apifyPull({ queries: searchTerms, limit, pack })
  } else {
    entries = picsumEntries({ queries, count: limit, pack })
  }
  // Never append the same pin twice across pulls: keep only entries whose
  // storage key (sha256 of the source URL) is not already in the pool.
  const have = new Set((project.imagePacks || []).map((e) => e.id))
  const fresh = entries.filter((e) => !have.has(e.id))
  const imagepacks = [...(project.imagePacks || []), ...fresh]
  await updateProject(userId, projectId, { imagepacks })
  return { entries: fresh }
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
// in the same slideshow so a slideshow never repeats a background.
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

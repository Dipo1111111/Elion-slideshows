// Send-to-phone shares. POST /api/exports snapshots a finished slideshow
// (caption, hashtags, per-slide text + background id) onto an unguessable,
// short-lived link served at /s/:token. The public share page loads the
// already-stored background images same-origin and offers a copyable block of
// text, so the creator scans the QR on their phone and posts straight from the
// TikTok app. Files expire after 24 hours; a sweep runs on every new share.
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HttpError } from './util.js'
import { getProject, getQueue } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIR = join(__dirname, 'data', 'exports')
const TTL_MS = 24 * 60 * 60 * 1000
const TOKEN_RE = /^[A-Za-z0-9_-]{8,64}$/

function cleanSlides(slides) {
  if (!Array.isArray(slides)) throw new HttpError(400, 'slides is required.')
  return slides.slice(0, 20).map((s) => ({
    text: String(s?.text || '').slice(0, 1000),
    bgId: String(s?.bg?.id || '').slice(0, 200) || null,
  }))
}

async function sweep() {
  try {
    const now = Date.now()
    for (const name of await readdir(DIR)) {
      if (!TOKEN_RE.test(name)) continue
      const file = join(DIR, name, 'meta.json')
      try {
        if (now - (await stat(file)).mtimeMs > TTL_MS) {
          await rm(join(DIR, name), { recursive: true, force: true })
        }
      } catch {
        // already gone; leave it for the next sweep
      }
    }
  } catch {
    // no share dir yet
  }
}

// Snapshot one slideshow into a share. The payload is the client's current
// draft (text + background ids), not the stored queue row, so unsaved edits
// are shared correctly. Background bytes stay in Supabase Storage; the share
// page references them through the public /api/images/:hash route.
export async function createShare({ userId, projectId, slideshowId, caption, hashtags, slides }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')
  const existing = await getQueue(userId, slideshowId)
  if (!existing) throw new HttpError(404, 'Slideshow not found.')
  const list = cleanSlides(slides)
  if (list.length === 0) throw new HttpError(400, 'slides is required.')

  await mkdir(DIR, { recursive: true })
  await sweep()

  const token = randomBytes(12).toString('base64url')
  const meta = {
    v: 1,
    created: Date.now(),
    caption: String(caption || '').slice(0, 2000),
    hashtags: Array.isArray(hashtags)
      ? hashtags
          .slice(0, 8)
          .map((t) => String(t).replace(/^#/, '').slice(0, 100))
          .filter(Boolean)
      : [],
    slides: list,
  }
  const dir = join(DIR, token)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'meta.json'), JSON.stringify(meta), 'utf8')
  return { token, meta }
}

export async function getShare(token) {
  if (!TOKEN_RE.test(token)) return null
  const file = join(DIR, token, 'meta.json')
  try {
    if (Date.now() - (await stat(file)).mtimeMs > TTL_MS) {
      await rm(dirname(file), { recursive: true, force: true })
      return null
    }
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return null
  }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// The phone page: every background at full size (tap to save), the caption
// and slide text in one copyable block, styled in Elion's black/blue/white.
function sharePage(meta) {
  const captionText = meta.caption || ''
  const hashtagsText = (meta.hashtags || []).map((h) => `#${h}`).join(' ')
  const copyText = [captionText, hashtagsText, '', ...meta.slides.map((s, i) => `${i + 1}. ${s.text}`)]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')

  const slides = meta.slides
    .map(
      (s, i) => `
      <figure class="slide">
        ${s.bgId ? `<a href="/api/images/${esc(s.bgId)}" download target="_blank" rel="noopener"><img src="/api/images/${esc(s.bgId)}" alt="Slide ${i + 1}" loading="lazy"></a>` : ''}
        <figcaption><span class="num">${i + 1}</span><span class="txt">${esc(s.text) || '&nbsp;'}</span></figcaption>
      </figure>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08080A">
<title>Your carousel is ready</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #08080A; color: #E5E7EB; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
  main { max-width: 560px; margin: 0 auto; padding: 28px 20px 48px; }
  header h1 { margin: 0; font-size: 22px; letter-spacing: -0.02em; color: #FFFFFF; }
  header p { margin: 6px 0 0; font-size: 13px; color: #9CA0A8; }
  .block { margin-top: 20px; border: 1px solid #1F212B; border-radius: 16px; background: #0C0D10; padding: 16px; }
  .block .cap { font-size: 14px; line-height: 1.55; color: #FFFFFF; white-space: pre-wrap; }
  .block .tags { margin-top: 8px; font-size: 12.5px; color: #6FA1FF; word-break: break-word; }
  button { width: 100%; margin-top: 12px; border: 0; border-radius: 12px; background: #3B82F6; color: #FFFFFF; font: inherit; font-weight: 700; font-size: 14px; padding: 13px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button:active { transform: scale(0.98); }
  .slide { margin-top: 16px; }
  .slide a { display: block; }
  .slide img { display: block; width: 100%; border-radius: 14px; border: 1px solid #1F212B; }
  .slide figcaption { display: flex; gap: 10px; align-items: flex-start; margin-top: 8px; }
  .slide .num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 7px; background: #3B82F6 / 20; background-color: rgba(59,130,246,0.2); color: #FFFFFF; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .slide .txt { font-size: 13px; line-height: 1.5; color: #D1D5DB; white-space: pre-wrap; }
  footer { margin-top: 28px; font-size: 12px; color: #5F646B; text-align: center; line-height: 1.6; }
  textarea.clip { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Elion</h1>
    <p>Your carousel is ready. Copy the text, save the images, then post in TikTok.</p>
  </header>

  <div class="block">
    ${captionText ? `<p class="cap">${esc(captionText)}</p>` : ''}
    ${hashtagsText ? `<p class="tags">${esc(hashtagsText)}</p>` : ''}
    <button id="copy-btn" type="button" onclick="copyText()">Copy all text</button>
  </div>

  ${slides}

  <footer>Tap an image to open it, then save it to your phone.<br>This link expires in 24 hours.</footer>

  <textarea class="clip" id="clip" readonly>${esc(copyText)}</textarea>
  <script>
    function copyText() {
      var ta = document.getElementById('clip');
      var btn = document.getElementById('copy-btn');
      function done() {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1600);
      }
      function fallback() {
        ta.focus();
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'Could not copy'; }
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(ta.value).then(done, fallback);
      } else {
        fallback();
      }
    }
  </script>
</main>
</body>
</html>`
}

export function renderSharePage(meta) {
  return sharePage(meta)
}

// Generation: Brain → prompt → OpenRouter → normalize → resolve backgrounds.
// The prompt is freshly authored for Elion (clean-room; SlideSmith's is never
// copied). Output is "slideshows" in copy, JSON shape per BUILD_PLAN §8.
import { HttpError } from './util.js'
import { getProject, insertQueue } from './db.js'
import { chatJSON } from './openrouter.js'
import { assignBackgrounds } from './images.js'

const BRAIN_LABELS = {
  niche: 'Niche',
  appName: 'App name',
  appDescription: 'App description',
  audience: 'Audience',
  audiencePain: 'What the audience is unhappy with or not noticing',
  accountGoal: "The creator's goal for the account",
  voiceTone: 'Tone words',
  styleMemory: 'Style memory',
}

const BATCH = 6

function buildPrompt({ brain, count, idea }) {
  const system =
    'You write short-form slideshow scripts for TikTok and Instagram creators. ' +
    'Rules:\n' +
    '- The hook is slide 1 and must be a scroll-stopper of max ~8 words.\n' +
    '- Each slideshow has 5-6 slides, each max ~8 words.\n' +
    '- The last slide is a call to action, e.g. "Save this for later."\n' +
    '- Caption: 1-2 short lines, at most 1-2 emoji.\n' +
    '- Exactly 3 hashtags, returned without the leading #.\n' +
    '- A one-line rationale that ties the choices to the style memory.\n' +
    '- A short title of 2-5 words naming the topic.\n' +
    "- Ground every script in the brand context: the app's purpose, the niche, who the audience is, and what they are unhappy with or not noticing. Specific beats generic.\n" +
    '- Never fall back to generic advice like "consistency is key", "start small", or "know your why".\n' +
    "- Shape the final call-to-action slide around the creator's goal: 'Grow the account' asks to follow or save, 'Sell digital products' points to the link in bio, 'Promote an app' invites trying it, 'Promote a game' invites checking it out.\n" +
    'Return JSON only: {"slideshows":[{"title","hook","slides":["..."],"caption","hashtags":["..."],"rationale"}]}'
  const brainBlock = Object.entries(brain)
    .filter(([, v]) => typeof v === 'string' && v)
    .map(([k, v]) => `${BRAIN_LABELS[k] || k}: ${v}`)
    .join('\n')
  const user =
    `Brand context:\n${brainBlock || '(none provided)'}\n\n` +
    `Write ${count} slideshow scripts in this voice.` +
    (idea ? `\nTopic: ${idea}` : '')
  return { system, user }
}

function normalize(item, index) {
  const ts = Date.now()
  const slides = Array.isArray(item.slides)
    ? item.slides.filter((s) => typeof s === 'string').map((text, j) => ({ id: `slide-${ts}-${index}-${j}`, text, bg: null }))
    : []
  if (slides.length === 0) throw new HttpError(502, 'The model returned a slideshow with no slides.')
  return {
    id: `q-${ts}-${index}`,
    title: String(item.title || item.hook || `Slideshow ${index + 1}`).slice(0, 80),
    hook: String(item.hook || slides[0].text || '').slice(0, 140),
    caption: String(item.caption || '').slice(0, 500),
    hashtags: Array.isArray(item.hashtags) ? item.hashtags.map((t) => String(t).replace(/^#/, '')).slice(0, 8) : [],
    rationale: String(item.rationale || ''),
    slides,
    status: 'Draft',
    createdAt: new Date().toISOString(),
  }
}

export async function generateSlideshows({ userId, projectId, count, idea, packs }) {
  const project = await getProject(userId, projectId)
  if (!project) throw new HttpError(404, 'Project not found.')

  // Generation never scrapes. Backgrounds are pulled first in the Library (a
  // visible step with feedback) and reused across every slideshow, so an
  // empty pool fails fast instead of burning a model call.
  if (!project.imagePacks || project.imagePacks.length === 0) {
    throw new HttpError(400, 'Your Library is empty. Pull backgrounds first, then generate.')
  }

  const slideshows = []
  let guard = 0
  while (slideshows.length < count && guard++ < 10) {
    const want = Math.min(BATCH, count - slideshows.length)
    const { system, user } = buildPrompt({ brain: project.brain, count: want, idea })
    const parsed = await chatJSON({ system, user })
    const batchList = Array.isArray(parsed?.slideshows) ? parsed.slideshows : []
    if (batchList.length === 0) break
    for (const item of batchList.slice(0, count - slideshows.length)) {
      slideshows.push(normalize(item, slideshows.length))
    }
    if (batchList.length < want) break
  }
  if (slideshows.length === 0) throw new HttpError(502, 'The model returned no slideshows. Try again.')

  await assignBackgrounds({ userId, projectId, slideshows, packs })
  return insertQueue(userId, projectId, slideshows)
}

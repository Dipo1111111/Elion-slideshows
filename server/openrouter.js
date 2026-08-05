// OpenCode Zen chat call (OpenAI-compatible) with tolerant JSON parsing.
// Provider, base URL, key, and model come entirely from env: OPENCODE_BASE_URL,
// OPENCODE_API_KEY, OPENCODE_MODEL. Never hardcode a model name in code.
// Module name is historical; this is the OpenCode provider adapter (OpenRouter
// retired 2026-08-05).
import { HttpError } from './util.js'

// Strip ``` fences, slice from the first { to the last }, then parse.
export function parseJSON(content) {
  if (typeof content !== 'string' || content.length === 0) {
    throw new HttpError(502, 'The model returned an empty response.')
  }
  const cleaned = content.replace(/```(?:json)?/gi, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new HttpError(502, 'The model returned unparseable JSON.')
  }
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    throw new HttpError(502, 'The model returned invalid JSON.')
  }
}

export async function chatJSON({ system, user, maxTokens = 6000 }) {
  const apiKey = process.env.OPENCODE_API_KEY
  if (!apiKey) throw new HttpError(503, 'OpenCode is not configured on the server.')
  const model = process.env.OPENCODE_MODEL
  if (!model) throw new HttpError(503, 'OPENCODE_MODEL is not set on the server.')
  const baseUrl = (process.env.OPENCODE_BASE_URL || 'https://opencode.ai/zen/v1').replace(/\/+$/, '')

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) throw new HttpError(502, `OpenCode error ${res.status}.`)
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  return parseJSON(content)
}

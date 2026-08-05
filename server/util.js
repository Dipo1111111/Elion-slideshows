// Shared server helpers. Plain ESM JS (see CLAUDE.md stack).
import { createHash } from 'node:crypto'

// Error that carries an HTTP status. The route wrapper (server/index.js)
// maps it to res.status(status).json({ error }).
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Whitelist object keys. Used for every body update so unknown fields can
// never reach the database (input validation, BUILD_PLAN §11).
export function pick(obj, keys) {
  const out = {}
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key]
  }
  return out
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const sha256 = (value) => createHash('sha256').update(value).digest('hex')

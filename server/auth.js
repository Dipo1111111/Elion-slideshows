// JWT verification middleware. Verifies the Supabase access token and sets
// req.user = { id } on success. Applied to every /api route except health,
// lemon/webhook, and images.
//
// Verification is algorithm-agnostic on purpose. Supabase migrated this
// project's JWT signing key from a legacy HS256 shared secret to ECC P-256,
// so a local HS256 verify would reject new tokens. Instead:
//   1. Fast path: local HS256 verify with SUPABASE_JWT_SECRET when set.
//   2. Fallback: Supabase's own GET /auth/v1/user, which accepts whatever
//      key GoTrue currently signs with and returns the user id.
// Either path alone is enough; both together means auth survives rotations.
import { jwtVerify } from 'jose'
import { HttpError } from './util.js'

async function verifyLocal(token) {
  const secret = process.env.SUPABASE_JWT_SECRET
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload?.sub || null
  } catch {
    return null
  }
}

async function verifyGoTrue(token) {
  const url = process.env.SUPABASE_URL
  const anon = process.env.VITE_SUPABASE_ANON_KEY
  if (!url) return null
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anon || '', authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.id || null
  } catch {
    return null
  }
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing access token.' })
    let id = await verifyLocal(token)
    if (!id) id = await verifyGoTrue(token)
    if (!id) return res.status(401).json({ error: 'Invalid or expired token.' })
    req.user = { id }
    next()
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

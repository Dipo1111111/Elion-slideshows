// Lemon Squeezy billing. Merchant of record: Free = 3 lifetime gens, Pro =
// $19/mo or $99/yr. The webhook flips profiles.plan; handler is idempotent
// (re-upserting the same plan is a no-op) and the secret is never logged.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { HttpError } from './util.js'
import { requireDb } from './db.js'

const PRO_EVENTS = ['order_created', 'subscription_created', 'subscription_updated']
const FREE_EVENTS = ['subscription_cancelled', 'subscription_expired']

function verifySignature(rawBody, signature) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) throw new HttpError(503, 'Webhook secret is not configured on the server.')
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
  const given = Buffer.from(signature || '', 'utf8')
  const want = Buffer.from(expected, 'utf8')
  if (given.length !== want.length || !timingSafeEqual(given, want)) {
    throw new HttpError(400, 'Invalid webhook signature.')
  }
}

// `meta.custom_data.user_id` (set at checkout) maps the purchase to the
// profile. If it is missing the event is acknowledged but skipped; matching
// by email would require the email to live on profiles, which it does not.
export async function handleWebhook(req, res) {
  verifySignature(req.rawBody, req.headers['x-signature'])
  const event = req.body?.meta?.event_name
  const userId = req.body?.meta?.custom_data?.user_id
  const subscriptionId =
    req.body?.data?.id || req.body?.data?.attributes?.first_subscription?.id || req.body?.data?.attributes?.subscription_id

  if (PRO_EVENTS.includes(event)) {
    if (userId) await setPlan(userId, 'pro', subscriptionId)
  } else if (FREE_EVENTS.includes(event) && userId) {
    await setPlan(userId, 'free', null)
  }
  res.json({ ok: true })
}

async function setPlan(userId, plan, subscriptionId) {
  const update = { plan }
  if (subscriptionId) update.ls_subscription_id = String(subscriptionId)
  const { error } = await requireDb().from('profiles').update(update).eq('id', userId)
  if (error) throw new HttpError(500, 'Could not update plan.')
}

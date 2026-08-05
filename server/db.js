// Supabase service-role data access. The service role bypasses RLS; RLS is
// defense in depth (see supabase/schema.sql). Every helper throws HttpError
// 503 when the server is not configured so the app boots without env vars.
import { createClient } from '@supabase/supabase-js'
import { HttpError } from './util.js'

const url = process.env.SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

export const sb = url && serviceRole ? createClient(url, serviceRole, { auth: { persistSession: false } }) : null
export const configured = Boolean(sb)

export function requireDb() {
  if (!sb) throw new HttpError(503, 'Supabase is not configured on the server.')
  return sb
}

// Signup trigger normally inserts a profile + default project; this covers
// trigger-less setups (BUILD_PLAN §6).
export async function ensureProfile(userId) {
  const db = requireDb()
  const { data } = await db.from('profiles').select('id').eq('id', userId).maybeSingle()
  if (data) return data
  const { error } = await db.from('profiles').insert({ id: userId })
  if (error && !error.message?.includes('duplicate')) throw new HttpError(500, 'Could not create profile.')
  return { id: userId }
}

export async function getProfile(userId) {
  const db = requireDb()
  const { data, error } = await db
    .from('profiles')
    .select('id, plan, total_gens, monthly_gens, month_start, ls_subscription_id')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw new HttpError(500, 'Could not load profile.')
  if (!data) return ensureProfile(userId)
  return data
}

const PROJECT_COLS = 'id, name, brain, imagepacks, created_at'

function mapProject(row) {
  return {
    id: row.id,
    name: row.name,
    brain: row.brain || {},
    imagePacks: row.imagepacks || [],
    createdAt: row.created_at,
  }
}

export async function listProjects(userId) {
  const db = requireDb()
  const { data, error } = await db
    .from('projects')
    .select(PROJECT_COLS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new HttpError(500, 'Could not load projects.')
  return (data || []).map(mapProject)
}

export async function getProject(userId, projectId) {
  const db = requireDb()
  const { data, error } = await db
    .from('projects')
    .select(PROJECT_COLS)
    .eq('id', projectId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new HttpError(500, 'Could not load project.')
  return data ? mapProject(data) : null
}

export async function createProject(userId, name = 'My brand') {
  const db = requireDb()
  const { data, error } = await db
    .from('projects')
    .insert({ user_id: userId, name })
    .select(PROJECT_COLS)
    .single()
  if (error) throw new HttpError(500, 'Could not create project.')
  return mapProject(data)
}

// Whitelisted patch keys: name, brain (whitelisted inside), imagepacks.
export async function updateProject(userId, projectId, patch) {
  const db = requireDb()
  const update = {}
  if (patch.name !== undefined) update.name = patch.name
  if (patch.brain !== undefined) update.brain = patch.brain
  if (patch.imagepacks !== undefined) update.imagepacks = patch.imagepacks
  const { data, error } = await db
    .from('projects')
    .update(update)
    .eq('id', projectId)
    .eq('user_id', userId)
    .select(PROJECT_COLS)
    .single()
  if (error) throw new HttpError(500, 'Could not update project.')
  return mapProject(data)
}

export async function deleteProject(userId, projectId) {
  const db = requireDb()
  const { error } = await db.from('projects').delete().eq('id', projectId).eq('user_id', userId)
  if (error) throw new HttpError(500, 'Could not delete project.')
}

export async function getQueue(userId, queueId) {
  const db = requireDb()
  const { data, error } = await db
    .from('queue')
    .select('id, data, created_at')
    .eq('id', queueId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new HttpError(500, 'Could not load slideshow.')
  return data ? { ...data.data, id: data.id } : null
}

export async function listQueue(userId, projectId) {
  const db = requireDb()
  const { data, error } = await db
    .from('queue')
    .select('id, data, created_at')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw new HttpError(500, 'Could not load slideshows.')
  return (data || []).map((row) => ({ ...row.data, id: row.id }))
}

export async function insertQueue(userId, projectId, slideshows) {
  const db = requireDb()
  const rows = slideshows.map((s) => ({ user_id: userId, project_id: projectId, data: s }))
  const { data, error } = await db.from('queue').insert(rows).select('id, data')
  if (error) throw new HttpError(500, 'Could not save slideshows.')
  return (data || []).map((row) => ({ ...row.data, id: row.id }))
}

export async function updateQueue(userId, queueId, patch) {
  const db = requireDb()
  const { data: row, error: fetchError } = await db
    .from('queue')
    .select('data')
    .eq('id', queueId)
    .eq('user_id', userId)
    .maybeSingle()
  if (fetchError) throw new HttpError(500, 'Could not load slideshow.')
  if (!row) throw new HttpError(404, 'Slideshow not found.')
  const { data, error } = await db
    .from('queue')
    .update({ data: { ...row.data, ...patch } })
    .eq('id', queueId)
    .eq('user_id', userId)
    .select('id, data')
    .single()
  if (error) throw new HttpError(500, 'Could not save slideshow.')
  return { ...data.data, id: data.id }
}

export async function deleteQueue(userId, queueId) {
  const db = requireDb()
  const { error } = await db.from('queue').delete().eq('id', queueId).eq('user_id', userId)
  if (error) throw new HttpError(500, 'Could not delete slideshow.')
}

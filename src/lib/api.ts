// Typed fetch wrapper for the Express API. Attaches the Supabase access
// token as a Bearer header when a session exists. Errors carry an HTTP
// status so callers can render 403 (plan limit) vs 429 (rate limit).
import { supabase, supabaseEnabled } from './supabase'
import { DEMO_ME, DEMO_PROJECT, DEMO_QUEUE } from './demo'
import type { ImageEntry, Me, Project, Slideshow } from './types'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Preview mode: Supabase env vars are not set yet, so serve canned data and
// the whole app can be reviewed before auth is wired up. Reads return real
// demo content; writes answer with a clear "not connected" error. This path
// disappears the moment VITE_SUPABASE_* are configured.
function previewReq<T>(path: string, init: RequestInit): Promise<T> {
  const method = init.method ?? 'GET'
  if (method === 'GET') {
    if (path === '/me') return Promise.resolve(DEMO_ME as unknown as T)
    if (path === '/projects') return Promise.resolve([DEMO_PROJECT] as unknown as T)
    if (path.startsWith('/queue')) return Promise.resolve(DEMO_QUEUE as unknown as T)
    if (path.startsWith('/library')) return Promise.resolve([] as unknown as T)
  }
  return Promise.reject(new ApiError(501, 'Preview mode. Connect Supabase to use this.'))
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseEnabled) return previewReq<T>(path, init)
  const session = await supabase?.auth.getSession()
  const token = session?.data.session?.access_token
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`/api${path}`, { ...init, headers, cache: 'no-store' })
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // keep the status-text fallback
    }
    throw new ApiError(res.status, message)
  }
  return res.json() as Promise<T>
}

export interface GenerateRequest {
  count: number
  projectId: string
  idea?: string
  packs?: string[]
}

export const api = {
  me: () => req<Me>('/me'),
  createProject: (name?: string) => req<Project>('/projects', { method: 'POST', body: JSON.stringify({ name }) }),
  listProjects: () => req<Project[]>('/projects'),
  updateProject: (id: string, body: { name?: string; brain?: Partial<import('./types').Brain> }) =>
    req<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id: string) => req<{ ok: true }>(`/projects/${id}`, { method: 'DELETE' }),
  generate: (body: GenerateRequest) =>
    req<{ slideshows: Slideshow[] }>('/generate', { method: 'POST', body: JSON.stringify(body) }),
  queue: (projectId: string) => req<Slideshow[]>(`/queue?projectId=${encodeURIComponent(projectId)}`),
  updateQueue: (
    id: string,
    body: Partial<Pick<Slideshow, 'title' | 'hook' | 'caption' | 'hashtags' | 'slides' | 'status'>>,
  ) => req<Slideshow>(`/queue/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQueue: (id: string) => req<{ ok: true }>(`/queue/${id}`, { method: 'DELETE' }),
  library: (projectId: string) => req<ImageEntry[]>(`/library?projectId=${encodeURIComponent(projectId)}`),
  pullImages: (body: { searches?: string; count?: number; projectId: string }) =>
    req<{ entries: ImageEntry[] }>('/library/pull', { method: 'POST', body: JSON.stringify(body) }),
  deleteLibraryImage: (id: string, projectId: string) =>
    req<{ ok: true }>(`/library/${encodeURIComponent(id)}?projectId=${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
    }),
  createExport: (body: {
    projectId: string
    slideshowId: string
    caption?: string
    hashtags?: string[]
    slides: { text?: string; bg: { id: string } | null }[]
  }) => req<{ url: string; token: string }>('/exports', { method: 'POST', body: JSON.stringify(body) }),
  upgradeUrl: (annual = false) => req<{ url: string }>(`/upgrade-url${annual ? '?annual=1' : ''}`),
}

// Every background loads same-origin so canvas export is never tainted.
export function imageUrl(bg?: { id: string; url: string } | null): string {
  return bg?.id ? `/api/images/${encodeURIComponent(bg.id)}` : ''
}

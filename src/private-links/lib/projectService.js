import { supabase } from './supabaseClient'
import { projects as defaultProjects } from '../../data/portfolio'

const STORAGE_KEY = 'roshzen_projects'

function getLocalProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore error
  }
  return defaultProjects.map((p, i) => ({
    id: p.id || `proj-${i + 1}`,
    ...p,
    is_active: p.is_active ?? true,
    position: p.position || i + 1,
  }))
}

function saveLocalProjects(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function normalizeProject(item, index = 0) {
  return {
    id: item.id || `proj-${Date.now()}-${index}`,
    title: item.title || '',
    idea: item.idea || item.description || '',
    stack: Array.isArray(item.stack)
      ? item.stack
      : typeof item.stack === 'string'
      ? item.stack.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    features: Array.isArray(item.features)
      ? item.features
      : typeof item.features === 'string'
      ? item.features.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    github: item.github || '',
    live: item.live || '',
    is_active: item.is_active ?? true,
    position: Number(item.position) || index + 1,
  }
}

export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('position', { ascending: true })

    if (!error && data && data.length > 0) {
      const normalized = data.map((d, i) => normalizeProject(d, i))
      saveLocalProjects(normalized)
      return normalized
    }
  } catch {
    // fallback
  }

  const local = getLocalProjects()
  return local.map((d, i) => normalizeProject(d, i)).sort((a, b) => (a.position || 0) - (b.position || 0))
}

export async function createProject(payload) {
  const newProj = normalizeProject({
    ...payload,
    id: `proj-${Date.now()}`,
  })

  try {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userData?.user?.id,
          title: newProj.title,
          idea: newProj.idea,
          stack: newProj.stack,
          features: newProj.features,
          github: newProj.github,
          live: newProj.live,
          is_active: newProj.is_active,
          position: newProj.position,
        },
      ])
      .select()

    if (!error && data?.[0]) {
      const saved = normalizeProject(data[0])
      const local = getLocalProjects()
      saveLocalProjects([...local, saved])
      return saved
    }
  } catch {
    // fallback
  }

  const local = getLocalProjects()
  const updated = [...local, newProj]
  saveLocalProjects(updated)
  return newProj
}

export async function updateProject(id, updates) {
  const local = getLocalProjects()
  const existing = local.find((p) => p.id === id) || {}
  const merged = normalizeProject({ ...existing, ...updates, id })

  try {
    const dbPayload = { updated_at: new Date().toISOString() }
    if (updates.title !== undefined) dbPayload.title = updates.title
    if (updates.idea !== undefined) dbPayload.idea = updates.idea
    if (updates.stack !== undefined) {
      dbPayload.stack = Array.isArray(updates.stack)
        ? updates.stack
        : updates.stack.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (updates.features !== undefined) {
      dbPayload.features = Array.isArray(updates.features)
        ? updates.features
        : updates.features.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (updates.github !== undefined) dbPayload.github = updates.github
    if (updates.live !== undefined) dbPayload.live = updates.live
    if (updates.is_active !== undefined) dbPayload.is_active = updates.is_active
    if (updates.position !== undefined) dbPayload.position = updates.position

    const { data, error } = await supabase
      .from('projects')
      .update(dbPayload)
      .eq('id', id)
      .select()

    if (!error && data?.[0]) {
      const saved = normalizeProject(data[0])
      const updatedList = local.map((p) => (p.id === id ? saved : p))
      saveLocalProjects(updatedList)
      return saved
    }
  } catch {
    // fallback
  }

  const updatedList = local.map((p) => (p.id === id ? merged : p))
  saveLocalProjects(updatedList)
  return merged
}

export async function deleteProject(id) {
  try {
    await supabase.from('projects').delete().eq('id', id)
  } catch {
    // fallback
  }

  const local = getLocalProjects()
  const updated = local.filter((p) => p.id !== id)
  saveLocalProjects(updated)
  return true
}

export async function reorderProjects(orderedProjects) {
  const normalized = orderedProjects.map((p, idx) => ({
    ...normalizeProject(p),
    position: idx + 1,
  }))

  saveLocalProjects(normalized)

  try {
    await Promise.all(
      normalized.map((p) =>
        supabase
          .from('projects')
          .update({ position: p.position, updated_at: new Date().toISOString() })
          .eq('id', p.id)
      )
    )
  } catch {
    // fallback
  }

  return normalized
}

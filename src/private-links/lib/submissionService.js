import { supabase } from './supabaseClient'

const STORAGE_KEY = 'roshzen_inquiries'

const defaultSeedSubmissions = [
  {
    id: 'sub-seed-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@techbuilds.io',
    projectType: 'Portfolio website',
    message: 'Hey Arun, really loved your cyber-terminal portfolio. We have a frontend contract opening and would love to chat about your availability for next month.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: false,
    starred: true,
  },
  {
    id: 'sub-seed-2',
    name: 'Sarah Chen',
    email: 'sarah.c@creativestudios.dev',
    projectType: 'React app ideas',
    message: 'Looking for someone to design a high-converting dark-mode landing page for our SaaS startup. Can you send over your typical timeline and rates?',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isRead: true,
    starred: false,
  },
]

function getLocalSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore
  }
  return defaultSeedSubmissions
}

function saveLocalSubmissions(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export async function fetchSubmissions() {
  // Try Supabase if table exists
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        projectType: item.project_type || 'General',
        message: item.message,
        receivedAt: item.created_at || new Date().toISOString(),
        isRead: item.is_read ?? false,
        starred: item.starred ?? false,
      }))
      saveLocalSubmissions(mapped)
      return mapped
    }
  } catch {
    // ignore
  }

  // Also try local express server backend if reachable
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const res = await fetch(`${apiUrl}/api/submissions`, { signal: AbortSignal.timeout(1000) })
    if (res.ok) {
      const serverData = await res.json()
      if (Array.isArray(serverData) && serverData.length > 0) {
        const local = getLocalSubmissions()
        // Merge without duplicates
        const existingIds = new Set(local.map((s) => s.id))
        const newItems = serverData
          .filter((s) => !existingIds.has(s.id))
          .map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            projectType: s.projectType || 'General',
            message: s.message,
            receivedAt: s.receivedAt || new Date().toISOString(),
            isRead: false,
            starred: false,
          }))
        const merged = [...newItems, ...local]
        saveLocalSubmissions(merged)
        return merged
      }
    }
  } catch {
    // ignore
  }

  return getLocalSubmissions()
}

export async function saveSubmission(entry) {
  const newSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: entry.name || 'Anonymous',
    email: entry.email || '',
    projectType: entry.projectType || 'General Inquiry',
    message: entry.message || '',
    receivedAt: new Date().toISOString(),
    isRead: false,
    starred: false,
  }

  // Save to Supabase
  try {
    await supabase.from('contact_submissions').insert([
      {
        name: newSubmission.name,
        email: newSubmission.email,
        project_type: newSubmission.projectType,
        message: newSubmission.message,
        is_read: false,
        starred: false,
      },
    ])
  } catch {
    // ignore
  }

  const local = getLocalSubmissions()
  const updated = [newSubmission, ...local]
  saveLocalSubmissions(updated)
  return newSubmission
}

export async function markSubmissionRead(id, isRead = true) {
  try {
    await supabase
      .from('contact_submissions')
      .update({ is_read: isRead })
      .eq('id', id)
  } catch {
    // ignore
  }

  const local = getLocalSubmissions()
  const updated = local.map((s) => (s.id === id ? { ...s, isRead } : s))
  saveLocalSubmissions(updated)
  return updated
}

export async function toggleSubmissionStar(id) {
  const local = getLocalSubmissions()
  const item = local.find((s) => s.id === id)
  const newStarred = item ? !item.starred : true

  try {
    await supabase
      .from('contact_submissions')
      .update({ starred: newStarred })
      .eq('id', id)
  } catch {
    // ignore
  }

  const updated = local.map((s) => (s.id === id ? { ...s, starred: newStarred } : s))
  saveLocalSubmissions(updated)
  return updated
}

export async function deleteSubmission(id) {
  try {
    await supabase.from('contact_submissions').delete().eq('id', id)
  } catch {
    // ignore
  }

  const local = getLocalSubmissions()
  const updated = local.filter((s) => s.id !== id)
  saveLocalSubmissions(updated)
  return true
}

export async function clearAllSubmissions() {
  saveLocalSubmissions([])
  return true
}

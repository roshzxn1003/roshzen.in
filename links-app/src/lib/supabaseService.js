import { supabase, isSupabaseConfigured } from './supabaseClient'
import { defaultProfile, defaultLinks } from '../data/linksData'

export async function fetchProfile() {
  if (!isSupabaseConfigured) {
    return defaultProfile
  }
  try {
    const { data, error } = await supabase.from('profiles').select('*').single()
    if (error || !data) return defaultProfile
    return {
      name: data.name || defaultProfile.name,
      username: data.username || defaultProfile.username,
      bio: data.bio || defaultProfile.bio,
      avatarUrl: data.avatar_url || defaultProfile.avatarUrl,
      verified: data.verified ?? true,
      theme: data.theme || 'cyber-dark',
      primaryColor: data.primary_color || '#ef4444',
    }
  } catch {
    return defaultProfile
  }
}

export async function fetchLinks() {
  if (!isSupabaseConfigured) {
    return defaultLinks
  }
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('position', { ascending: true })
    if (error || !data || data.length === 0) return defaultLinks
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      iconName: item.icon || 'ExternalLink',
      platform: item.platform || 'web',
      position: item.position || 0,
      is_active: item.is_active ?? true,
      color: item.color || '#ef4444',
    }))
  } catch {
    return defaultLinks
  }
}

export async function recordAnalyticsEvent(linkId, eventType = 'click') {
  if (!isSupabaseConfigured) return
  try {
    await supabase.from('analytics').insert([
      {
        link_id: linkId,
        event_type: eventType,
        created_at: new Date().toISOString(),
      },
    ])
  } catch {
    // Ignore analytics error gracefully
  }
}

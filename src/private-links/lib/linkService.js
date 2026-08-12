import { supabase } from './supabaseClient'
import { defaultLinks, defaultProfile } from './supabaseService'

export async function getAllLinksAdmin() {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('position', { ascending: true })
    if (error || !data) return defaultLinks
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      url: item.url,
      iconName: item.icon || 'Globe',
      platform: item.platform || 'web',
      position: item.position || 0,
      is_active: item.is_active ?? true,
      color: item.color || '#ef4444',
    }))
  } catch {
    return defaultLinks
  }
}

export async function createLink(linkPayload) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id

  const { data, error } = await supabase
    .from('links')
    .insert([
      {
        user_id: userId,
        title: linkPayload.title,
        description: linkPayload.description || '',
        url: linkPayload.url,
        icon: linkPayload.iconName || 'Globe',
        platform: linkPayload.platform || 'web',
        position: linkPayload.position || 0,
        is_active: linkPayload.is_active ?? true,
        color: linkPayload.color || '#ef4444',
      },
    ])
    .select()

  if (error) throw error
  return data[0]
}

export async function updateLink(id, updates) {
  const payload = {}
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.url !== undefined) payload.url = updates.url
  if (updates.iconName !== undefined) payload.icon = updates.iconName
  if (updates.platform !== undefined) payload.platform = updates.platform
  if (updates.position !== undefined) payload.position = updates.position
  if (updates.is_active !== undefined) payload.is_active = updates.is_active
  if (updates.color !== undefined) payload.color = updates.color
  payload.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('links')
    .update(payload)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export async function deleteLink(id) {
  const { error } = await supabase.from('links').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function updateProfile(profileUpdates) {
  const { data: currentProfile } = await supabase.from('profiles').select('id').single()

  const payload = {
    name: profileUpdates.name,
    username: profileUpdates.username,
    bio: profileUpdates.bio,
    avatar_url: profileUpdates.avatarUrl,
    verified: profileUpdates.verified,
    theme: profileUpdates.theme,
    primary_color: profileUpdates.primaryColor,
    updated_at: new Date().toISOString(),
  }

  let result
  if (currentProfile?.id) {
    result = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', currentProfile.id)
      .select()
  } else {
    result = await supabase.from('profiles').insert([payload]).select()
  }

  if (result.error) throw result.error
  return result.data[0]
}

export async function getAnalyticsSummary() {
  try {
    const { data: analyticsData, error } = await supabase
      .from('analytics')
      .select('id, link_id, created_at')
      .order('created_at', { ascending: false })

    if (error || !analyticsData) {
      return { totalClicks: 0, recentClicks: [], linkCounts: {} }
    }

    const linkCounts = {}
    analyticsData.forEach((row) => {
      if (row.link_id) {
        linkCounts[row.link_id] = (linkCounts[row.link_id] || 0) + 1
      }
    })

    return {
      totalClicks: analyticsData.length,
      recentClicks: analyticsData.slice(0, 10),
      linkCounts,
    }
  } catch {
    return { totalClicks: 0, recentClicks: [], linkCounts: {} }
  }
}

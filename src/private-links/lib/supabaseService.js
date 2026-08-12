import { supabase } from './supabaseClient'

export const defaultProfile = {
  name: 'Arun Roshan',
  username: 'RoshZen ⚡',
  bio: 'Developer • CSE Student • Builder • Tech Enthusiast',
  avatarUrl: 'https://github.com/roshzxn1003.png',
  verified: true,
  theme: 'cyber-dark',
  primaryColor: '#ef4444',
}

export const defaultLinks = [
  {
    id: 'link-1',
    title: 'Portfolio Website',
    description: 'Explore my main personal portfolio & interactive projects',
    url: 'https://www.roshzen.in',
    iconName: 'Globe',
    platform: 'web',
    position: 1,
    is_active: true,
    color: '#ef4444',
  },
  {
    id: 'link-2',
    title: 'GitHub Repositories',
    description: 'Open source code, tools, and developer experiments',
    url: 'https://github.com/roshzxn1003',
    iconName: 'Github',
    platform: 'github',
    position: 2,
    is_active: true,
    color: '#f8fafc',
  },
  {
    id: 'link-3',
    title: 'LinkedIn Network',
    description: 'Connect with me professionally & read my updates',
    url: 'https://www.linkedin.com/in/arun-roshan-gj/',
    iconName: 'Linkedin',
    platform: 'linkedin',
    position: 3,
    is_active: true,
    color: '#38bdf8',
  },
  {
    id: 'link-4',
    title: 'YouTube Channel',
    description: 'Coding tutorials, tech walkthroughs & project demos',
    url: 'https://www.youtube.com/@roshzxn',
    iconName: 'Youtube',
    platform: 'youtube',
    position: 4,
    is_active: true,
    color: '#f43f5e',
  },
  {
    id: 'link-5',
    title: 'Instagram',
    description: 'Behind the scenes, dev setup, and daily tech life',
    url: 'https://instagram.com/rosh.zxn',
    iconName: 'Instagram',
    platform: 'instagram',
    position: 5,
    is_active: true,
    color: '#ec4899',
  },
  {
    id: 'link-6',
    title: 'Download Resume (PDF)',
    description: 'View my full academic background & technical experience',
    url: 'https://www.roshzen.in/AR-resume.pdf',
    iconName: 'FileText',
    platform: 'document',
    position: 6,
    is_active: true,
    color: '#a855f7',
  },
  {
    id: 'link-7',
    title: 'Direct Email',
    description: 'Get in touch for collaborations, projects & inquiries',
    url: 'mailto:arunroshan1003@gmail.com',
    iconName: 'Mail',
    platform: 'email',
    position: 7,
    is_active: true,
    color: '#10b981',
  },
]

export async function fetchProfile() {
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

export async function recordAnalyticsEvent(linkId, eventType = 'click') {
  try {
    await supabase.from('analytics').insert([
      {
        link_id: linkId,
        event_type: eventType,
        created_at: new Date().toISOString(),
      },
    ])
  } catch {
    // Ignore analytics error
  }
}

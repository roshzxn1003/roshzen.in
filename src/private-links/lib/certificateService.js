import { supabase } from './supabaseClient'
import { defaultCertificates } from '../../data/certificates'

const STORAGE_KEY = 'roshzen_certificates'

function getLocalCertificates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore parse error
  }
  return defaultCertificates
}

function saveLocalCertificates(certs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs))
  } catch {
    // ignore storage quota error
  }
}

function normalizeCert(item) {
  return {
    id: item.id || `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: item.title || '',
    issuer: item.issuer || '',
    date: item.date || item.issue_date || '',
    credentialId: item.credentialId || item.credential_id || '',
    about: item.about || item.description || '',
    skills: Array.isArray(item.skills)
      ? item.skills
      : typeof item.skills === 'string'
      ? item.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    certificateImage: item.certificateImage || item.certificate_image || item.image_url || '',
    viewUrl: item.viewUrl || item.view_url || item.certificateImage || '',
    verifyUrl: item.verifyUrl || item.verify_url || item.credential_url || '',
    is_active: item.is_active ?? true,
    featured: item.featured ?? false,
    position: Number(item.position) || 0,
  }
}

export async function fetchCertificates() {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('position', { ascending: true })

    if (!error && data && data.length > 0) {
      const normalized = data.map(normalizeCert)
      saveLocalCertificates(normalized)
      return normalized
    }
  } catch {
    // Network or table missing fallback
  }

  const local = getLocalCertificates()
  return local.map(normalizeCert).sort((a, b) => (a.position || 0) - (b.position || 0))
}

export async function createCertificate(certPayload) {
  const newCert = normalizeCert({
    ...certPayload,
    id: `cert-${Date.now()}`,
  })

  // Try Supabase first
  try {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('certificates')
      .insert([
        {
          user_id: userData?.user?.id,
          title: newCert.title,
          issuer: newCert.issuer,
          issue_date: newCert.date,
          credential_id: newCert.credentialId,
          about: newCert.about,
          skills: newCert.skills,
          certificate_image: newCert.certificateImage,
          view_url: newCert.viewUrl,
          verify_url: newCert.verifyUrl,
          is_active: newCert.is_active,
          featured: newCert.featured,
          position: newCert.position,
        },
      ])
      .select()

    if (!error && data?.[0]) {
      const saved = normalizeCert(data[0])
      const local = getLocalCertificates()
      saveLocalCertificates([...local, saved])
      return saved
    }
  } catch {
    // continue to local storage
  }

  // Local fallback
  const local = getLocalCertificates()
  const updated = [...local, newCert]
  saveLocalCertificates(updated)
  return newCert
}

export async function updateCertificate(id, updates) {
  const currentList = getLocalCertificates()
  const existing = currentList.find((c) => c.id === id) || {}
  const merged = normalizeCert({ ...existing, ...updates, id })

  // Try Supabase
  try {
    const dbPayload = {
      updated_at: new Date().toISOString(),
    }
    if (updates.title !== undefined) dbPayload.title = updates.title
    if (updates.issuer !== undefined) dbPayload.issuer = updates.issuer
    if (updates.date !== undefined) dbPayload.issue_date = updates.date
    if (updates.credentialId !== undefined) dbPayload.credential_id = updates.credentialId
    if (updates.about !== undefined) dbPayload.about = updates.about
    if (updates.skills !== undefined) {
      dbPayload.skills = Array.isArray(updates.skills)
        ? updates.skills
        : updates.skills.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (updates.certificateImage !== undefined) dbPayload.certificate_image = updates.certificateImage
    if (updates.viewUrl !== undefined) dbPayload.view_url = updates.viewUrl
    if (updates.verifyUrl !== undefined) dbPayload.verify_url = updates.verifyUrl
    if (updates.is_active !== undefined) dbPayload.is_active = updates.is_active
    if (updates.featured !== undefined) dbPayload.featured = updates.featured
    if (updates.position !== undefined) dbPayload.position = updates.position

    const { data, error } = await supabase
      .from('certificates')
      .update(dbPayload)
      .eq('id', id)
      .select()

    if (!error && data?.[0]) {
      const saved = normalizeCert(data[0])
      const updatedList = currentList.map((c) => (c.id === id ? saved : c))
      saveLocalCertificates(updatedList)
      return saved
    }
  } catch {
    // continue to local
  }

  // Local update
  const updatedList = currentList.map((c) => (c.id === id ? merged : c))
  saveLocalCertificates(updatedList)
  return merged
}

export async function deleteCertificate(id) {
  try {
    await supabase.from('certificates').delete().eq('id', id)
  } catch {
    // continue to local
  }

  const currentList = getLocalCertificates()
  const updatedList = currentList.filter((c) => c.id !== id)
  saveLocalCertificates(updatedList)
  return true
}

export async function reorderCertificates(orderedCerts) {
  const normalized = orderedCerts.map((cert, index) => ({
    ...normalizeCert(cert),
    position: index + 1,
  }))

  saveLocalCertificates(normalized)

  try {
    await Promise.all(
      normalized.map((c) =>
        supabase
          .from('certificates')
          .update({ position: c.position, updated_at: new Date().toISOString() })
          .eq('id', c.id)
      )
    )
  } catch {
    // silent fallback
  }

  return normalized
}

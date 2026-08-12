import { useState, useEffect, useCallback, useMemo } from 'react'
import { linkTreeConfig, socialLinks } from '../data/portfolio'

const STORAGE_KEYS = {
  THEME: 'roshzen_linktree_theme',
  ANALYTICS: 'roshzen_linktree_analytics',
  SESSION: 'roshzen_linktree_session',
}

const DEFAULT_ANALYTICS = {
  totalClicks: 0,
  linkClicks: {},
  sessions: 0,
  lastVisit: null,
}

export function useLinkTree() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return linkTreeConfig.defaultTheme
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || linkTreeConfig.defaultTheme
    } catch {
      return linkTreeConfig.defaultTheme
    }
  })

  const [analytics, setAnalytics] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ANALYTICS
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS)
      return stored ? JSON.parse(stored) : DEFAULT_ANALYTICS
    } catch {
      return DEFAULT_ANALYTICS
    }
  })

  const [toast, setToast] = useState(null)
  const [qrVisible, setQrVisible] = useState({ linkId: null, x: 0, y: 0 })
  const [activeCategory, setActiveCategory] = useState('all')
  const [mounted, setMounted] = useState(false)

  const trackSession = useCallback(() => {
    const sessionKey = STORAGE_KEYS.SESSION
    const hasVisited = sessionStorage.getItem(sessionKey)
    if (!hasVisited) {
      sessionStorage.setItem(sessionKey, 'true')
      setAnalytics((prev) => ({
        ...prev,
        sessions: prev.sessions + 1,
        lastVisit: new Date().toISOString(),
      }))
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    if (linkTreeConfig.enableAnalytics) {
      trackSession()
    }
  }, [trackSession])

  const trackClick = useCallback((linkId, _label, _href) => {
    if (!linkTreeConfig.enableAnalytics) return
    setAnalytics((prev) => {
      const newLinkClicks = { ...prev.linkClicks }
      newLinkClicks[linkId] = (newLinkClicks[linkId] || 0) + 1
      const newAnalytics = {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        linkClicks: newLinkClicks,
        lastVisit: new Date().toISOString(),
      }
      try {
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(newAnalytics))
      } catch {
        // Ignore
      }
      return newAnalytics
    })
  }, [])

  const setTheme = useCallback((newTheme) => {
    if (!linkTreeConfig.themes.includes(newTheme)) return
    setThemeState(newTheme)
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    } catch {
      // Ignore
    }
    document.documentElement.setAttribute('data-linktree-theme', newTheme)
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`Copied ${label}!`, 'success')
      return true
    } catch {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        showToast(`Copied ${label}!`, 'success')
        return true
      } catch {
        showToast('Failed to copy', 'error')
        return false
      }
    }
  }, [showToast])

  const showQR = useCallback((linkId, x, y) => {
    if (!linkTreeConfig.enableQR) return
    setQrVisible({ linkId, x, y })
  }, [])

  const hideQR = useCallback(() => {
    setQrVisible({ linkId: null, x: 0, y: 0 })
  }, [])

  const filteredLinks = useMemo(() => {
    if (activeCategory === 'all') return socialLinks
    return socialLinks.filter((link) => link.category === activeCategory)
  }, [activeCategory])

  const sortedLinks = useMemo(() => {
    return [...filteredLinks].sort((a, b) => (a.priority || 99) - (b.priority || 99))
  }, [filteredLinks])

  const getLinkStats = useCallback((linkId) => {
    return analytics.linkClicks[linkId] || 0
  }, [analytics])

  const exportAnalytics = useCallback(() => {
    const data = JSON.stringify(analytics, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linktree-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast('Analytics exported!', 'success')
  }, [analytics, showToast])

  const resetAnalytics = useCallback(() => {
    setAnalytics(DEFAULT_ANALYTICS)
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS))
    } catch {
      // Ignore
    }
    showToast('Analytics reset!', 'success')
  }, [showToast])

  useEffect(() => {
    document.documentElement.setAttribute('data-linktree-theme', theme)
  }, [theme])

  return {
    theme,
    setTheme,
    analytics,
    toast,
    qrVisible,
    showQR,
    hideQR,
    activeCategory,
    setActiveCategory,
    sortedLinks,
    categories: linkTreeConfig.categories,
    config: linkTreeConfig,
    trackClick,
    copyToClipboard,
    showToast,
    getLinkStats,
    exportAnalytics,
    resetAnalytics,
    mounted,
  }
}

export const themes = linkTreeConfig.themes
export const categories = linkTreeConfig.categories
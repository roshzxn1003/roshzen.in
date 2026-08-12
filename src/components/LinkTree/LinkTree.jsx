import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Share2, RefreshCw } from 'lucide-react'
import { socialLinks } from '../../data/portfolio'
import { useLinkTree } from '../../hooks/useLinkTree'
import LinkTreeCard from './LinkTreeCard'
import LinkTreeQR from './LinkTreeQR'
import LinkTreeThemeToggle from './LinkTreeThemeToggle'
import './LinkTree.css'

export default function LinkTree({ mode = 'page', onClose, initialTheme }) {
  const {
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
    categories,
    config,
    trackClick,
    copyToClipboard,
    showToast,
    getLinkStats,
    exportAnalytics,
    resetAnalytics,
    mounted,
  } = useLinkTree()
  const [showStatsPanel, setShowStatsPanel] = useState(false)
  const [selectedLinkForStats, setSelectedLinkForStats] = useState(null)

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme)
    }
    if (mode === 'modal') {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (mode === 'modal') {
        document.body.style.overflow = ''
      }
    }
  }, [mode, initialTheme, setTheme])

  const handleLinkClick = useCallback((link) => {
    trackClick(link.href, link.label, link.href)
    if (link.href.startsWith('http') || link.href.startsWith('mailto:')) {
      window.open(link.href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = link.href
    }
  }, [trackClick])

  const handleCopy = useCallback((href, label) => {
    copyToClipboard(href, label)
  }, [copyToClipboard])

  const handleShowQR = useCallback((href, x, y) => {
    const link = socialLinks.find((l) => l.href === href)
    if (link) {
      showQR(link.href, x, y)
    }
  }, [showQR])

  const handleShowStats = useCallback((link) => {
    setSelectedLinkForStats(link)
    setShowStatsPanel(true)
  }, [])

  const renderPage = () => (
    <div className={`lt-page ${theme}`} data-theme={theme}>
      <header className="lt-header">
        <div className="lt-header-left">
          <img src={config.avatar} alt={config.title} className="lt-avatar" />
          <div className="lt-title-block">
            <h1 className="lt-title">{config.title}</h1>
            <p className="lt-subtitle">{config.subtitle}</p>
          </div>
        </div>
        <div className="lt-header-right">
          <LinkTreeThemeToggle theme={theme} onChange={setTheme} compact />
        </div>
      </header>

      <p className="lt-bio">{config.bio}</p>

      <nav className="lt-categories" role="tablist" aria-label="Filter links by category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`lt-category-btn ${activeCategory === cat.id ? 'lt-active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <cat.icon size={16} />
            <span>{cat.label}</span>
          </button>
        ))}
      </nav>

      <main className="lt-main">
        <div className="lt-grid" role="list">
          {sortedLinks.map((link, index) => (
            <LinkTreeCard
              key={link.href}
              link={link}
              index={index}
              theme={theme}
              entranceDelay={index * config.animations.staggerDelay}
              onClick={handleLinkClick}
              onCopy={handleCopy}
              onShowQR={handleShowQR}
              onShowStats={handleShowStats}
              clickCount={getLinkStats(link.href)}
              config={config}
            />
          ))}
        </div>

        {sortedLinks.length === 0 && (
          <div className="lt-empty">
            <p>No links in this category</p>
          </div>
        )}
      </main>

      <footer className="lt-footer">
        <p className="lt-copyright">© 2026 Arun Roshan. Built with React & clean UI thinking.</p>
        <div className="lt-footer-links">
          <button className="lt-footer-btn" onClick={exportAnalytics} title="Export analytics">
            <Download size={14} />
          </button>
          <button className="lt-footer-btn" onClick={resetAnalytics} title="Reset analytics">
            <RefreshCw size={14} />
          </button>
          <button className="lt-footer-btn" onClick={() => copyToClipboard(window.location.href, 'page URL')} title="Share page">
            <Share2 size={14} />
          </button>
        </div>
      </footer>

      {qrVisible.linkId && (
        <LinkTreeQR
          link={socialLinks.find((l) => l.href === qrVisible.linkId)}
          onClose={hideQR}
          onCopy={showToast}
          theme={theme}
        />
      )}

      {showStatsPanel && (
        <LinkTreeStatsPanel
          link={selectedLinkForStats}
          analytics={analytics}
          onClose={() => setShowStatsPanel(false)}
        />
      )}

      {toast && (
        <div className={`lt-toast lt-toast-${toast.type}`} role="alert">
          {toast.message}
        </div>
      )}
    </div>
  )

  if (!mounted) {
    return (
      <div className="lt-page lt-loading" data-theme={theme}>
        <div className="lt-loader" aria-label="Loading links...">
          <div className="lt-spinner" />
        </div>
      </div>
    )
  }

  const content = renderPage()

  if (mode === 'modal') {
    return createPortal(
      <div className="lt-modal-overlay" onClick={onClose}>
        <div className="lt-modal" onClick={(e) => e.stopPropagation()}>
          <button className="lt-modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
          {content}
        </div>
      </div>,
      document.getElementById('linktree-modal-root') || document.body
    )
  }

  return content
}

function LinkTreeStatsPanel({ link, analytics, onClose }) {
  const linkClicks = analytics.linkClicks[link?.href] || 0
  const totalClicks = analytics.totalClicks
  const percentage = totalClicks > 0 ? ((linkClicks / totalClicks) * 100).toFixed(1) : 0

  const sortedLinks = Object.entries(analytics.linkClicks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <div className="lt-stats-overlay" onClick={onClose}>
      <div className="lt-stats-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lt-stats-header">
          <h3>Link Analytics</h3>
          <button className="lt-stats-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {link && (
          <div className="lt-stats-selected">
            <div className="lt-stats-link-info">
              <link.icon size={24} style={{ color: link.color }} />
              <div>
                <h4>{link.label}</h4>
                <p>{link.handle}</p>
              </div>
            </div>
            <div className="lt-stats-metric">
              <span className="lt-stats-value">{linkClicks}</span>
              <span className="lt-stats-label">Clicks</span>
            </div>
            <div className="lt-stats-metric">
              <span className="lt-stats-value">{percentage}%</span>
              <span className="lt-stats-label">Of Total</span>
            </div>
            <div className="lt-stats-bar">
              <div className="lt-stats-fill" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )}

        <div className="lt-stats-all">
          <h4>Top Links</h4>
          <ul className="lt-stats-list">
            {sortedLinks.length === 0 ? (
              <li className="lt-stats-empty">No clicks recorded yet</li>
            ) : (
              sortedLinks.map(([href, clicks], idx) => {
                const linkData = socialLinks.find((l) => l.href === href)
                const Icon = linkData?.icon
                return (
                  <li key={href} className="lt-stats-item">
                    <span className="lt-stats-rank">#{idx + 1}</span>
                    {Icon && <Icon size={16} style={{ color: linkData.color }} />}
                    <span className="lt-stats-name">{linkData?.label || href}</span>
                    <span className="lt-stats-clicks">{clicks}</span>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        <div className="lt-stats-summary">
          <div className="lt-stats-total">
            <span className="lt-stats-value">{analytics.totalClicks}</span>
            <span className="lt-stats-label">Total Clicks</span>
          </div>
          <div className="lt-stats-total">
            <span className="lt-stats-value">{analytics.sessions}</span>
            <span className="lt-stats-label">Sessions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
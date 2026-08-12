import { useRef, useEffect, useState } from 'react'
import { ExternalLink, Copy, QrCode, BarChart2, MousePointer } from 'lucide-react'

export default function LinkTreeCard({
  link,
  onClick,
  onCopy,
  onShowQR,
  onShowStats,
  clickCount,
  entranceDelay,
  config,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      cardRef.current?.classList.add('lt-card-visible')
    }, entranceDelay)
    return () => clearTimeout(timer)
  }, [entranceDelay])

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    onShowQR?.(link.href, e.clientX, e.clientY)
  }

  const brandColor = link.color || '#dc2626'

  return (
    <article
      ref={cardRef}
      className="lt-card"
      style={{
        '--brand-color': brandColor,
        '--entrance-delay': `${entranceDelay}ms`,
        transitionDelay: `${entranceDelay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        if (!e.target.closest('.lt-card-action')) {
          onClick(link)
        }
      }}
    >
      <div className="lt-card-glow" aria-hidden="true" />
      <div className="lt-card-border" aria-hidden="true" />

      <div className="lt-card-content">
        <div className="lt-card-icon" style={{ backgroundColor: `${brandColor}20` }}>
          <link.icon size={24} style={{ color: brandColor }} />
        </div>

        <div className="lt-card-info">
          <h3 className="lt-card-label">{link.label}</h3>
          <p className="lt-card-handle">{link.handle}</p>
          {link.description && <p className="lt-card-desc">{link.description}</p>}
        </div>

        {clickCount > 0 && config.enableAnalytics && (
          <span className="lt-card-stats" title="Clicks">
            <BarChart2 size={12} />
            {clickCount}
          </span>
        )}
      </div>

      <div className="lt-card-actions">
        <button
          className="lt-card-action lt-action-primary"
          onClick={(e) => {
            e.stopPropagation()
            onClick(link)
          }}
          aria-label={`Open ${link.label}`}
        >
          <ExternalLink size={16} />
          <span>Open</span>
        </button>

        <button
          className="lt-card-action"
          onClick={(e) => {
            e.stopPropagation()
            onCopy(link.href, link.label)
          }}
          aria-label={`Copy ${link.label} link`}
        >
          <Copy size={16} />
        </button>

        {config.enableQR && (
          <button
            className="lt-card-action"
            onClick={(e) => {
              e.stopPropagation()
              const rect = cardRef.current?.getBoundingClientRect()
              if (rect) {
                onShowQR(link.href, rect.right, rect.top + rect.height / 2)
              }
            }}
            aria-label={`Show QR for ${link.label}`}
          >
            <QrCode size={16} />
          </button>
        )}

        {config.enableAnalytics && clickCount > 0 && (
          <button
            className="lt-card-action"
            onClick={(e) => {
              e.stopPropagation()
              onShowStats(link)
            }}
            aria-label={`Show stats for ${link.label}`}
          >
            <BarChart2 size={16} />
          </button>
        )}
      </div>

      {isHovered && link.description && (
        <div
          className="lt-card-tooltip"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
          }}
        >
          <MousePointer size={12} />
          <span>Right-click for QR</span>
        </div>
      )}
    </article>
  )
}
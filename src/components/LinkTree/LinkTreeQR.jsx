import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { Download, X, Check } from 'lucide-react'

function LinkTreeQR({ link, onClose, onCopy, theme }) {
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCopied(false)
  }, [link])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${link.label.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    onCopy?.(`Downloaded QR for ${link.label}`)
  }

  const copyImage = async () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current.querySelector('canvas')
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        onCopy?.(`Copied QR for ${link.label} to clipboard`)
      }, 'image/png')
    } catch {
      onCopy?.('Failed to copy QR image')
    }
  }

  const themeColors = {
    cyberpunk: { dark: '#dc2626', light: '#050505' },
    minimal: { dark: '#111827', light: '#ffffff' },
    dark: { dark: '#1f2937', light: '#111827' },
    light: { dark: '#111827', light: '#ffffff' },
  }

  const colors = themeColors[theme] || themeColors.cyberpunk

  return (
    <div className="lt-qr-overlay" onClick={onClose}>
      <div className="lt-qr-card" onClick={(e) => e.stopPropagation()}>
        <div className="lt-qr-header">
          <span className="lt-qr-title">QR Code: {link.label}</span>
          <button className="lt-qr-close" onClick={onClose} aria-label="Close QR">
            <X size={20} />
          </button>
        </div>
        <div className="lt-qr-content" ref={canvasRef}>
          <QRCode
            value={link.href}
            size={200}
            level="M"
            fgColor={colors.dark}
            bgColor={colors.light}
            includeMargin={true}
          />
        </div>
        <p className="lt-qr-url">{link.href}</p>
        <div className="lt-qr-actions">
          <button className="lt-qr-btn" onClick={copyImage} aria-label="Copy QR image">
            <Check size={16} className={copied ? 'lt-copied' : ''} />
            {copied ? 'Copied!' : 'Copy Image'}
          </button>
          <button className="lt-qr-btn" onClick={downloadQR} aria-label="Download QR">
            <Download size={16} />
            Download
          </button>
          <button className="lt-qr-btn lt-qr-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkTreeQR
import { useEffect, useRef, useState } from 'react'

const interactiveSelector =
  'a, button, input, textarea, select, .glass-panel, .project-card, .skill-card, .service-card, .journey-card'

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const frameRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const activeRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncEnabled = () => setEnabled(finePointer.matches && !reducedMotion.matches)
    syncEnabled()

    finePointer.addEventListener('change', syncEnabled)
    reducedMotion.addEventListener('change', syncEnabled)

    return () => {
      finePointer.removeEventListener('change', syncEnabled)
      reducedMotion.removeEventListener('change', syncEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    document.body.classList.add('custom-cursor-enabled')

    const move = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY }
      const isActive = Boolean(event.target.closest(interactiveSelector))
      if (isActive !== activeRef.current) {
        activeRef.current = isActive
        setActive(isActive)
      }
    }

    const click = (event) => {
      const id = `${event.clientX}-${event.clientY}-${Date.now()}`
      setRipples((items) => [...items, { id, x: event.clientX, y: event.clientY }])
      window.setTimeout(() => {
        setRipples((items) => items.filter((item) => item.id !== id))
      }, 620)
    }

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }

      frameRef.current = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', click)
    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', click)
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span ref={dotRef} className={`cursor-dot ${active ? 'is-active' : ''}`} />
      <span ref={ringRef} className={`cursor-ring ${active ? 'is-active' : ''}`} />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="cursor-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  )
}

export default CustomCursor
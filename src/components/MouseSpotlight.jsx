import { useEffect, useRef } from 'react'

function MouseSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e) => {
      el.style.setProperty('--spot-x', `${e.clientX}px`)
      el.style.setProperty('--spot-y', `${e.clientY}px`)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] opacity-50 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(220, 38, 38, 0.06), transparent 40%)',
      }}
      aria-hidden="true"
    />
  )
}

export default MouseSpotlight

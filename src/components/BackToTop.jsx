import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'motion/react'
import { ArrowUp } from 'lucide-react'

function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const [dashOffset, setDashOffset] = useState(138.2)

  const circumference = 2 * Math.PI * 22

  useMotionValueEvent(progress, 'change', (v) => {
    setDashOffset(circumference * (1 - v))
  })

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_30px_rgba(220,38,38,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] active:scale-95"
          aria-label="Back to top"
        >
          <svg
            className="absolute inset-0 -rotate-90"
            width="48"
            height="48"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2.5"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(239, 68, 68, 0.9)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.1s ease' }}
            />
          </svg>
          <ArrowUp size={20} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop

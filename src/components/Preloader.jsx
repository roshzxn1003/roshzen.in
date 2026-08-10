import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import WebThreads from './WebThreads'

function Preloader() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (count >= 100) return
    const speed = count < 30 ? 35 : count < 70 ? 20 : count < 90 ? 30 : 50
    const timeout = setTimeout(() => setCount((c) => Math.min(c + 1, 100)), speed)
    return () => clearTimeout(timeout)
  }, [count])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Background WebThreads Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-80">
            <WebThreads
              color1="#ef4444"
              color2="#991b1b"
              color3="#ffffff"
              speed={0.25}
              threadCount={8}
              frequency={4.5}
              spread={0.22}
              taper={1.0}
              position={0.5}
              fanMode="center"
              glow={0.03}
              falloff={0.5}
              thickness={1.2}
              brightness={0.8}
              opacity={0.9}
              mirror={true}
              shimmer={true}
              grain={true}
              grainIntensity={0.04}
              mouseInteraction={true}
              mouseStrength={0.4}
            />
          </div>

          {/* Subtle corner accents */}
          <div className="absolute left-8 top-8 h-16 w-16 border-l border-t border-red-500/20" />
          <div className="absolute right-8 top-8 h-16 w-16 border-r border-t border-red-500/20" />
          <div className="absolute bottom-8 left-8 h-16 w-16 border-b border-l border-red-500/20" />
          <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-red-500/20" />

          {/* Faded background counter */}
          <motion.span
            className="absolute select-none font-mono text-[16rem] sm:text-[22rem] font-black leading-none text-white/[0.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {String(count).padStart(2, '0')}
          </motion.span>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Ultra-bold metallic 3D AR Typography */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              {/* Metallic 3D AR Text SVG */}
              <svg
                viewBox="0 0 500 220"
                className="w-[320px] h-[140px] sm:w-[500px] sm:h-[220px] select-none"
                style={{
                  filter:
                    'drop-shadow(0 20px 30px rgba(0,0,0,0.95)) drop-shadow(0 0 45px rgba(239, 68, 68, 0.55))',
                }}
              >
                <defs>
                  {/* Metallic Red-to-White Fill Gradient */}
                  <linearGradient id="metallic-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="28%" stopColor="#f87171" />
                    <stop offset="60%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </linearGradient>

                  {/* 3D Metallic Bevel Border */}
                  <linearGradient id="metallic-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#f87171" stopOpacity="0.6" />
                    <stop offset="65%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#991b1b" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                <text
                  x="50%"
                  y="52%"
                  dominantBaseline="central"
                  textAnchor="middle"
                  fontFamily="Syncopate, sans-serif"
                  fontWeight="700"
                  fontSize="160"
                  letterSpacing="-4"
                  fill="url(#metallic-fill)"
                  stroke="url(#metallic-bevel)"
                  strokeWidth="3.5"
                >
                  AR
                </text>
              </svg>

              {/* Red glow baseline */}
              <motion.div
                className="mt-3 h-px w-full max-w-[320px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            {/* Name reveal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-red-400/90">
                Arun Roshan
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Portfolio • 2025
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-52">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Loading
                </span>
                <span className="font-mono text-[10px] tabular-nums tracking-wider text-red-400">
                  {count}%
                </span>
              </div>
              <div className="h-px w-full bg-white/[0.08]">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
                  style={{ width: `${count}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subtle scanline */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader

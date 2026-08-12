import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function Preloader() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // End preloader slightly after hitting 100
    const timer = setTimeout(() => setLoading(false), 3800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (count >= 100) return
    const easeOut = count < 40 ? 15 : count < 75 ? 25 : count < 95 ? 40 : 80
    const timeout = setTimeout(() => setCount(c => Math.min(c + 1, 100)), easeOut)
    return () => clearTimeout(timeout)
  }, [count])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.15,
            filter: "blur(10px)",
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030303] overflow-hidden"
        >
          {/* Ambient Glowing Orbs Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
            <motion.div
              animate={{ 
                x: ['-10%', '10%', '-10%'],
                y: ['-10%', '10%', '-10%'],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-red-600/15 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ 
                x: ['10%', '-10%', '10%'],
                y: ['10%', '-10%', '10%'],
                scale: [1.2, 1, 1.2]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-rose-900/20 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full px-6">
            
            {/* The Main Circular HUD */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="relative flex flex-col items-center justify-center p-8 sm:p-12"
            >
              
              {/* Outer Spinning Rings (Sci-Fi HUD Effect) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 sm:-inset-4 border border-white/[0.03] rounded-full"
                style={{ borderTopColor: 'rgba(239, 68, 68, 0.8)', borderRightColor: 'rgba(239, 68, 68, 0.2)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 sm:-inset-10 border border-white/[0.02] rounded-full"
                style={{ borderBottomColor: 'rgba(255, 255, 255, 0.4)', borderLeftColor: 'rgba(255, 255, 255, 0.1)' }}
              />

              {/* Central Glassmorphic Core */}
              <div className="relative flex items-center justify-center w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden">
                
                {/* Rising Liquid Gradient */}
                <motion.div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-600/40 via-red-500/20 to-transparent"
                  initial={{ height: "0%" }}
                  animate={{ height: `${count}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
                
                {/* Core Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.span 
                    className="font-mono text-5xl sm:text-7xl font-bold text-white tracking-tighter"
                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.4)" }}
                  >
                    {count}
                  </motion.span>
                  <motion.span 
                    animate={{ opacity: count === 100 ? [1, 0.5, 1] : 1 }}
                    transition={{ repeat: count === 100 ? Infinity : 0, duration: 1 }}
                    className="text-red-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] mt-2"
                  >
                    {count === 100 ? 'Unlocked' : 'Loading'}
                  </motion.span>
                </div>
              </div>

            </motion.div>

            {/* Premium Typography Reveal */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="mt-16 sm:mt-24 text-center"
            >
              <h2 className="text-xl sm:text-3xl font-black tracking-[0.4em] sm:tracking-[0.6em] text-white uppercase ml-[0.4em] sm:ml-[0.6em]" style={{ textShadow: "0 10px 30px rgba(239,68,68,0.3)" }}>
                Arun Roshan
              </h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-red-500/50" />
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-slate-400 uppercase">
                  Interactive Portfolio
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-red-500/50" />
              </div>
            </motion.div>

            {/* Sleek Loading Bar */}
            <div className="w-full max-w-[240px] sm:max-w-xs h-[2px] bg-white/[0.05] mt-12 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-400 to-white"
                style={{ width: `${count}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${count}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
              {/* Laser flare on the tip of the loading bar */}
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-12 h-[6px] bg-white/60 blur-[3px] rounded-full"
                style={{ left: `calc(${count}% - 48px)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: count > 5 && count < 100 ? 1 : 0 }}
              />
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader

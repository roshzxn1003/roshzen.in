import { useState } from 'react'
import { motion } from 'motion/react'
import * as Icons from 'lucide-react'

export default function LinkCard({ link, index, onLinkClick }) {
  const [copied, setCopied] = useState(false)

  const IconComponent = Icons[link.iconName] || Icons.ExternalLink
  const brandColor = link.color || '#ef4444'

  const handleCopy = (e) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(link.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(link)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center justify-between w-full p-4 sm:p-5 mb-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: brandColor }}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at center, ${brandColor}, transparent 70%)`,
        }}
      />

      <div className="flex items-center gap-4 relative z-10 min-w-0 pr-2">
        <div
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-black/40 group-hover:scale-105 transition duration-300"
          style={{ boxShadow: `0 0 15px ${brandColor}25` }}
        >
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 transition duration-300" style={{ color: brandColor }} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate group-hover:text-red-400 transition">
              {link.title}
            </span>
          </div>
          {link.description && (
            <p className="text-xs text-slate-400 font-normal truncate mt-0.5 group-hover:text-slate-300 transition">
              {link.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
        <button
          onClick={handleCopy}
          title="Copy Link URL"
          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition opacity-70 group-hover:opacity-100"
        >
          {copied ? (
            <Icons.Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Icons.Copy className="w-4 h-4" />
          )}
        </button>
        <div className="p-2 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition duration-300">
          <Icons.ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </motion.a>
  )
}

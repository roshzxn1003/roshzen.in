import { motion } from 'motion/react'
import { CheckCircle2, Zap } from 'lucide-react'

export default function ProfileHeader({ profile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center text-center mb-8"
    >
      {/* Background Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Avatar */}
      <div className="relative mb-5 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-[#0a0a0f] border border-white/20 shadow-2xl overflow-hidden">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-500"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Arun+Roshan&background=ef4444&color=fff'
            }}
          />
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050508] shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="System Active" />
      </div>

      {/* Name */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          {profile.name}
        </h1>
        {profile.verified && (
          <CheckCircle2 className="w-5 h-5 text-red-500 fill-red-500/20" title="Verified Creator" />
        )}
      </div>

      {/* Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 shadow-inner">
        <Zap className="w-3.5 h-3.5 text-red-400" />
        <span className="text-xs font-mono font-medium text-slate-300 tracking-wide">
          {profile.username}
        </span>
        <span className="w-1 h-1 rounded-full bg-red-500" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Private Hub
        </span>
      </div>

      {/* Bio */}
      <p className="max-w-md text-sm text-slate-400 font-normal leading-relaxed px-4">
        {profile.bio}
      </p>
    </motion.div>
  )
}

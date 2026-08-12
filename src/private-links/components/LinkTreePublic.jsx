import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import ProfileHeader from './ProfileHeader'
import LinkCard from './LinkCard'
import { defaultProfile, defaultLinks, fetchProfile, fetchLinks, recordAnalyticsEvent } from '../lib/supabaseService'
import { Shield, Terminal, Lock, Loader2 } from 'lucide-react'

export default function LinkTreePublic() {
  const [profile, setProfile] = useState(defaultProfile)
  const [links, setLinks] = useState(defaultLinks)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [profData, linksData] = await Promise.all([fetchProfile(), fetchLinks()])
        if (profData) setProfile(profData)
        if (linksData && linksData.length > 0) setLinks(linksData)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const activeLinks = [...links]
    .filter((l) => l.is_active)
    .sort((a, b) => (a.position || 0) - (b.position || 0))

  const handleLinkClick = (link) => {
    recordAnalyticsEvent(link.id, 'click')
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-8 bg-[#050508] text-slate-100 overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Background Animated Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <main className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto pt-6 pb-12 flex-1 flex flex-col justify-start">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="font-mono text-xs text-slate-400">Loading RoshZen Link Hub...</span>
          </div>
        ) : (
          <>
            <ProfileHeader profile={profile} />
            <div className="w-full space-y-1">
              {activeLinks.map((link, index) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  index={index}
                  onLinkClick={handleLinkClick}
                />
              ))}
            </div>
          </>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center flex flex-col items-center gap-3 pt-6 border-t border-white/5"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Shield className="w-3.5 h-3.5 text-red-500/80" />
            <span>RoshZen Private Hub</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-slate-500" />
              Private URL Route
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-[11px] text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            <span>CLI Launch: <code className="text-white">roshzen-links open</code></span>
          </div>

          <p className="text-[10px] font-mono text-slate-600 mt-2">
            © {new Date().getFullYear()} RoshZen. All rights reserved. Private System.
          </p>
        </motion.footer>
      </main>
    </div>
  )
}

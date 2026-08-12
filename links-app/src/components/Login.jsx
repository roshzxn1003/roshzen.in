import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050508] text-slate-100 relative overflow-hidden selection:bg-red-500 selection:text-white">
      {/* Background Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative z-10"
      >
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition duration-200" />
            <span>Back to Link Hub</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Gateway</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Lock className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            RoshZen Admin Login
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Protected Private Link Management Gateway
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@roshzen.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-red-500 focus:outline-none text-sm text-white placeholder:text-slate-600 font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-red-500 focus:outline-none text-sm text-white placeholder:text-slate-600 font-mono transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest font-bold transition shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Authorize Access</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-4 border-t border-white/5">
          <p className="text-[10px] font-mono text-slate-600">
            Unauthorized access attempts are logged and audited.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

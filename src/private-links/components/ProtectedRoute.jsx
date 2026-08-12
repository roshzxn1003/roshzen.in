import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children, onRedirectToLogin }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-white">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <span className="font-mono text-xs text-slate-400">Verifying Admin Session...</span>
      </div>
    )
  }

  if (!user) {
    onRedirectToLogin?.()
    return null
  }

  return children
}

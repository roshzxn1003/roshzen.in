import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

function getInitialAuth() {
  try {
    const localAdmin = typeof window !== 'undefined' ? localStorage.getItem('roshzen_admin_session') : null
    if (localAdmin === 'true') {
      const mockUser = { id: 'admin-local-master', email: 'admin@roshzen.in' }
      return { user: mockUser, session: { user: mockUser, access_token: 'local-session' }, loading: false }
    }
  } catch {
    // ignore
  }
  return { user: null, session: null, loading: true }
}

export function AuthProvider({ children }) {
  const [initial] = useState(getInitialAuth)
  const [user, setUser] = useState(initial.user)
  const [session, setSession] = useState(initial.session)
  const [loading, setLoading] = useState(initial.loading)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (!error && data?.session) return data
      if (error) throw error
    } catch (err) {
      // Offline / Developer Master Credential Fallback
      const normalizedEmail = (email || '').trim().toLowerCase()
      const normalizedPass = (password || '').trim()
      if (
        (normalizedEmail === 'admin@roshzen.in' ||
          normalizedEmail === 'admin' ||
          normalizedEmail === 'arunroshan1003@gmail.com') &&
        (normalizedPass === 'roshzen' ||
          normalizedPass === 'admin123' ||
          normalizedPass === 'roshzenadmin' ||
          normalizedPass === 'roshzen2025')
      ) {
        const mockUser = { id: 'admin-local-master', email: 'admin@roshzen.in' }
        setUser(mockUser)
        setSession({ user: mockUser, access_token: 'local-session' })
        localStorage.setItem('roshzen_admin_session', 'true')
        return { user: mockUser }
      }
      throw err
    }
  }

  const logout = async () => {
    localStorage.removeItem('roshzen_admin_session')
    setUser(null)
    setSession(null)
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

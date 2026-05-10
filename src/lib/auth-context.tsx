'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User as FBUser } from 'firebase/auth'
import { auth } from './firebase'
import { authAPI } from './api'

interface AppUser {
  uid: string; email: string; displayName: string
  role: string; plan: string; wordsUsed: number
}
interface AuthCtx {
  user: AppUser | null; fbUser: FBUser | null
  loading: boolean; token: string
  setTokens: (access: string, refresh: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}
const Ctx = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<AppUser | null>(null)
  const [fbUser, setFbUser] = useState<FBUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken]   = useState('')

  const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setToken(access)
  }

  const logout = () => {
    auth.signOut()
    localStorage.clear()
    setUser(null); setFbUser(null); setToken('')
    window.location.href = '/login'
  }

  const refreshUser = async () => {
    try {
      const u = await authAPI.me()
      setUser(u)
    } catch {}
  }

  useEffect(() => {
    const stored = localStorage.getItem('access_token')
    if (stored) setToken(stored)

    const unsub = onAuthStateChanged(auth, async fbU => {
      setFbUser(fbU)
      if (!fbU) { setUser(null); setLoading(false); return }
      try {
        const u = await authAPI.me()
        setUser(u)
      } catch {}
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <Ctx.Provider value={{ user, fbUser, loading, token, setTokens, logout, refreshUser }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)

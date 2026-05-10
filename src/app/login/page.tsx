'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setTokens } = useAuth()
  const router = useRouter()

  const handleLogin = async (idToken: string) => {
    const data = await authAPI.loginWithToken(idToken)
    if (data.user.role !== 'user' && data.user.role !== 'admin') throw new Error('Access denied')
    setTokens(data.access, data.refresh)
    router.push('/dashboard')
  }

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cred    = await signInWithEmailAndPassword(auth, email, pass)
      const idToken = await cred.user.getIdToken()
      await handleLogin(idToken)
      toast.success('Welcome back!')
    } catch (err: any) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
        ? 'Invalid email or password.' : err.message
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const onGoogle = async () => {
    setLoading(true)
    try {
      const prov    = new GoogleAuthProvider()
      const cred    = await signInWithPopup(auth, prov)
      const idToken = await cred.user.getIdToken()
      await handleLogin(idToken)
      toast.success('Welcome!')
    } catch (err: any) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-bold text-base">SaleIQ</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6">
          <button onClick={onGoogle} disabled={loading}
            className="btn-secondary w-full mb-4 py-2.5 gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
          </div>

          <form onSubmit={onEmail} className="space-y-4">
            <div>
              <label className="lbl">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="inp" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="lbl mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand hover:underline">Forgot?</Link>
              </div>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                className="inp" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand font-medium hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}

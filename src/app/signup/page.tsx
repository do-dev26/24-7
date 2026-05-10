'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setTokens } = useAuth()
  const router = useRouter()

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pass.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const data = await authAPI.register(email, pass, name)
      setTokens(data.access, data.refresh)
      toast.success('Account created!')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const onGoogle = async () => {
    setLoading(true)
    try {
      const prov    = new GoogleAuthProvider()
      const cred    = await signInWithPopup(auth, prov)
      const idToken = await cred.user.getIdToken()
      const data    = await authAPI.loginWithToken(idToken)
      setTokens(data.access, data.refresh)
      toast.success('Account created!')
      router.push('/dashboard')
    } catch (err: any) { toast.error(err.message) }
    finally { setLoading(false) }
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
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Free plan · No credit card needed</p>
        </div>

        <div className="card p-6">
          <button onClick={onGoogle} disabled={loading} className="btn-secondary w-full mb-4 py-2.5 gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
          </div>
          <form onSubmit={onEmail} className="space-y-3">
            <div><label className="lbl">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="inp" placeholder="Rahul Sharma" required />
            </div>
            <div><label className="lbl">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="inp" placeholder="you@example.com" required />
            </div>
            <div><label className="lbl">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="inp" placeholder="Min 8 characters" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-3">
          Already have an account? <Link href="/login" className="text-brand font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

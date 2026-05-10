'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong')
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
          <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
          <p className="text-sm text-gray-500 mt-1">We&apos;ll send a reset link to your email</p>
        </div>
        <div className="card p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📬</div>
              <div className="font-medium text-gray-900 mb-1">Check your email</div>
              <p className="text-sm text-gray-500">We sent a reset link to <strong>{email}</strong></p>
              <Link href="/login" className="btn-primary mt-4 inline-flex">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="lbl">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="inp" placeholder="you@example.com" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/login" className="text-brand hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  )
}

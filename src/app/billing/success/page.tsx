'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { billingAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function BillingSuccessPage() {
  const params  = useSearchParams()
  const router  = useRouter()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [plan,   setPlan]   = useState('')

  useEffect(() => {
    const sessionId = params.get('session_id')
    if (!sessionId) { router.push('/dashboard/billing'); return }

    // Poll subscription until it's active (Stripe webhook may take a few seconds)
    let tries = 0
    const poll = async () => {
      try {
        const sub = await billingAPI.subscription()
        if (sub?.plan && sub.plan !== 'free') {
          setPlan(sub.plan)
          await refreshUser()      // update sidebar plan badge
          setStatus('success')
        } else if (tries < 8) {
          tries++
          setTimeout(poll, 1500)   // retry every 1.5s up to 8 times (~12s)
        } else {
          setStatus('success')     // show success anyway — webhook may be slow
        }
      } catch {
        setStatus('error')
      }
    }
    poll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Activating your plan…</p>
      </div>
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center card p-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your payment may have gone through — check your email for a Stripe receipt.
          If the plan hasn't activated in a few minutes, contact support.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard/billing" className="btn-secondary">Go to billing</Link>
          <a href="mailto:support@saleiq.ai" className="btn-primary">Contact support</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center card p-10">
        {/* Animated checkmark */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set! 🎉</h1>
        {plan && (
          <div className="inline-block bg-brand-light text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-4 capitalize">
            {plan} Plan activated
          </div>
        )}
        <p className="text-sm text-gray-500 mb-8">
          Your plan is now active. All features are unlocked — start building your AI sales widgets.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard/widgets/new" className="btn-primary w-full py-2.5 block text-center">
            Create your first widget →
          </Link>
          <Link href="/dashboard" className="btn-secondary w-full py-2.5 block text-center">
            Go to dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          A receipt has been sent to your email by Stripe.
          Manage your subscription anytime in{' '}
          <Link href="/dashboard/billing" className="text-brand hover:underline">Billing settings</Link>.
        </p>
      </div>
    </div>
  )
}

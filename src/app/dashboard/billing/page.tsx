'use client'
import useSWR from 'swr'
import { billingAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'
import { useState } from 'react'

const PLAN_FEATURES: Record<string, string[]> = {
  free:       ['1 widget', '500 words/month', 'Basic analytics', 'Email support'],
  starter:    ['3 widgets', '5,000 words/month', 'Lead export CSV', 'All AI brains'],
  pro:        ['10 widgets', '50,000 words/month', 'Advanced analytics', 'Priority support'],
  enterprise: ['Unlimited widgets', 'Unlimited words', 'Custom AI instructions', 'Dedicated support'],
}

export default function BillingPage() {
  const { user } = useAuth()
  const { data: plans = [] }   = useSWR('plans', billingAPI.plans)
  const { data: sub }          = useSWR('sub', billingAPI.subscription)
  const [loading, setLoading]  = useState('')

  const checkout = async (planId: string) => {
    setLoading(planId)
    try {
      const { url } = await billingAPI.checkout(planId)
      window.location.href = url
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to open checkout')
    } finally { setLoading('') }
  }

  const portal = async () => {
    setLoading('portal')
    try {
      const { url } = await billingAPI.portal()
      window.location.href = url
    } catch { toast.error('Failed to open billing portal') }
    finally { setLoading('') }
  }

  const cancel = async () => {
    if (!confirm('Cancel your subscription? It will remain active until the end of the billing period.')) return
    try {
      await billingAPI.cancel()
      toast.success('Subscription cancelled. Active until period end.')
    } catch { toast.error('Failed to cancel') }
  }

  const currentPlan = user?.plan || 'free'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your plan and subscription</p>
      </div>

      {/* Current subscription */}
      {sub && sub.plan !== 'free' && (
        <div className="card p-5 mb-6 border-l-4 border-brand">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 capitalize">{sub.plan} Plan</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {sub.cancelAtPeriodEnd
                  ? `Cancels on ${new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN', { day:'numeric', month:'long' })}`
                  : `Renews on ${new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN', { day:'numeric', month:'long' })}`}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={portal} disabled={loading === 'portal'} className="btn-secondary text-sm">
                {loading === 'portal' ? 'Opening…' : 'Manage billing'}
              </button>
              {!sub.cancelAtPeriodEnd && (
                <button onClick={cancel} className="btn-danger text-sm">Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-4 gap-4">
        {(['free','starter','pro','enterprise'] as const).map(planId => {
          const p       = plans.find((x: any) => x.id === planId) || { id: planId, name: planId, price: 0 }
          const isCurr  = currentPlan === planId
          const isPro   = planId === 'pro'
          return (
            <div key={planId}
              className={`card p-5 flex flex-col ${isPro ? 'border-2 border-brand ring-2 ring-brand/10' : ''}`}>
              {isPro && (
                <div className="text-xs font-semibold text-brand bg-brand-light px-3 py-1 rounded-full mb-3 text-center">
                  Most popular
                </div>
              )}
              <div className="capitalize font-semibold text-gray-900 mb-1">{p.name}</div>
              <div className="mb-4">
                {p.price === 0
                  ? <span className="text-2xl font-bold text-gray-900">Free</span>
                  : p.price === null
                  ? <span className="text-2xl font-bold text-gray-900">Custom</span>
                  : <><span className="text-2xl font-bold text-gray-900">${p.price}</span><span className="text-sm text-gray-400">/mo</span></>}
              </div>
              <ul className="text-sm text-gray-500 space-y-1.5 flex-1 mb-4">
                {(PLAN_FEATURES[planId] || []).map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <svg width="12" height="12" fill="none" stroke="#10a37f" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              {isCurr ? (
                <div className="text-center text-sm text-gray-400 py-2 font-medium">Current plan</div>
              ) : planId === 'enterprise' ? (
                <a href="mailto:hello@saleiq.ai" className="btn-secondary text-center text-sm">Contact us</a>
              ) : planId === 'free' ? (
                <div className="text-center text-sm text-gray-400 py-2">Always free</div>
              ) : (
                <button onClick={() => checkout(planId)} disabled={loading === planId}
                  className={`${isPro ? 'btn-primary' : 'btn-secondary'} w-full text-sm`}>
                  {loading === planId ? 'Redirecting…' : `Upgrade to ${p.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

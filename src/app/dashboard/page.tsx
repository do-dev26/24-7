'use client'
import useSWR from 'swr'
import { analyticsAPI, widgetAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { BRAIN_LABELS, PLANS } from '@/lib/config'

function StatCard({ label, value, sub, color = 'brand' }: any) {
  return (
    <div className="card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</div>
      <div className="text-[28px] font-bold tracking-tight text-gray-900">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: summary, isLoading: sLoad } = useSWR('summary', analyticsAPI.summary)
  const { data: widgets, isLoading: wLoad } = useSWR('widgets', widgetAPI.list)

  const plan    = (user?.plan || 'free') as keyof typeof PLANS
  const planCfg = PLANS[plan] || PLANS.free
  const pct     = Math.min(100, Math.round(((summary?.wordsUsed || 0) / planCfg.words) * 100))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Good morning, {user?.displayName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Here&apos;s what&apos;s happening with your widgets</p>
        </div>
        <Link href="/dashboard/widgets/new" className="btn-primary gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New widget
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {sLoad ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />) : <>
          <StatCard label="Total Widgets"   value={summary?.totalWidgets}   sub="across all sites" />
          <StatCard label="Total Leads"     value={summary?.totalLeads}     sub={`+${summary?.totalLeads || 0} all time`} />
          <StatCard label="Conversations"   value={summary?.totalChats}     sub="AI chat sessions" />
          <StatCard label="Words Used"      value={`${summary?.wordUsagePct || 0}%`} sub={`${(summary?.wordsUsed||0).toLocaleString()} / ${planCfg.words === 999999 ? '∞' : planCfg.words.toLocaleString()}`} />
        </>}
      </div>

      {/* Word usage bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">Monthly word usage</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 capitalize">{planCfg.label} plan</span>
            <Link href="/dashboard/billing" className="text-xs text-brand hover:underline font-medium">Upgrade →</Link>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-400' : pct > 60 ? 'bg-amber-400' : 'bg-brand'}`}
            style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{(summary?.wordsUsed || 0).toLocaleString()} used</span>
          <span>Resets {summary?.usageResetDate ? new Date(summary.usageResetDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'monthly'}</span>
        </div>
      </div>

      {/* Widgets */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Your widgets</h2>
        <Link href="/dashboard/widgets" className="text-xs text-brand hover:underline">View all</Link>
      </div>

      {wLoad ? (
        <div className="grid grid-cols-2 gap-3">
          {Array(2).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      ) : !widgets?.length ? (
        <div className="card p-12 text-center">
          <div className="text-3xl mb-3">🤖</div>
          <div className="font-medium text-gray-700 mb-1">No widgets yet</div>
          <p className="text-sm text-gray-400 mb-4">Create your first AI sales widget and add it to your website</p>
          <Link href="/dashboard/widgets/new" className="btn-primary">Create first widget</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {widgets.slice(0, 4).map((w: any) => (
            <Link href={`/dashboard/widgets/${w.id}`} key={w.id}
              className="card p-4 hover:border-gray-200 transition-all cursor-pointer block">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: w.color + '20' }}>
                    {BRAIN_LABELS[w.brainType]?.split(' ')[0] || '⚡'}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{w.name}</div>
                    <div className="text-xs text-gray-400">{BRAIN_LABELS[w.brainType] || 'Generic'}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {w.isActive ? 'Live' : 'Off'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><span className="font-semibold text-gray-900">{w.totalChats || 0}</span> chats</div>
                <div><span className="font-semibold text-gray-900">{w.totalLeads || 0}</span> leads</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick start for new users */}
      {!widgets?.length && (
        <div className="card p-5 mt-6 border-l-4 border-brand">
          <div className="font-medium text-sm text-gray-900 mb-2">🚀 Quick start guide</div>
          <ol className="text-sm text-gray-500 space-y-1.5">
            <li>1. Create a widget and choose your AI brain type</li>
            <li>2. Fill in your business details in Business Setup</li>
            <li>3. Copy the embed snippet and add it to your website</li>
            <li>4. Watch leads come in automatically!</li>
          </ol>
        </div>
      )}
    </div>
  )
}

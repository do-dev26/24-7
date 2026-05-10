'use client'
import useSWR from 'swr'
import { analyticsAPI, widgetAPI } from '@/lib/api'
import { useState } from 'react'
import { BRAIN_LABELS } from '@/lib/config'

function Metric({ label, value, sub }: any) {
  return (
    <div className="card p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</div>
      <div className="text-3xl font-bold tracking-tight text-gray-900">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [days, setDays]           = useState(30)
  const [selectedWidget, setWid]  = useState('')
  const { data: summary }         = useSWR(['summary', days], analyticsAPI.summary)
  const { data: convos }          = useSWR(['convos', days], () => analyticsAPI.conversations(days))
  const { data: leadAnalytics }   = useSWR('leadAnalytics', analyticsAPI.leads)
  const { data: widgets = [] }    = useSWR('widgets', widgetAPI.list)
  const { data: wAnalytics }      = useSWR(selectedWidget ? ['wana', selectedWidget, days] : null,
    () => analyticsAPI.widget(selectedWidget, days))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track performance across all widgets</p>
        </div>
        <select className="inp w-32" value={days} onChange={e => setDays(Number(e.target.value))}>
          <option value={7}>Last 7d</option>
          <option value={30}>Last 30d</option>
          <option value={90}>Last 90d</option>
        </select>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Metric label="Total Chats"       value={summary?.totalChats}         sub="all widgets" />
        <Metric label="Total Leads"       value={summary?.totalLeads}         sub="captured by AI" />
        <Metric label="Unique Sessions"   value={convos?.uniqueSessions}      sub={`last ${days} days`} />
        <Metric label="Avg Words/Chat"    value={convos?.avgWordsPerChat}     sub="per conversation" />
      </div>

      {/* Conversation stats */}
      {convos && (
        <div className="card p-5 mb-6">
          <div className="text-sm font-semibold text-gray-800 mb-4">Conversation overview ({days}d)</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-2xl font-bold text-gray-900">{convos.totalChats}</div><div className="text-xs text-gray-400">Total chats</div></div>
            <div><div className="text-2xl font-bold text-gray-900">{convos.uniqueSessions}</div><div className="text-xs text-gray-400">Unique visitors</div></div>
            <div><div className="text-2xl font-bold text-gray-900">{(convos.totalWords || 0).toLocaleString()}</div><div className="text-xs text-gray-400">Total words processed</div></div>
          </div>
        </div>
      )}

      {/* Lead analytics */}
      {leadAnalytics && (
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div className="card p-5">
            <div className="text-sm font-semibold text-gray-800 mb-4">Leads by status</div>
            {Object.entries(leadAnalytics.byStatus || {}).map(([st, count]: any) => (
              <div key={st} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm capitalize text-gray-600">{st}</span>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
            {!Object.keys(leadAnalytics.byStatus || {}).length && (
              <div className="text-sm text-gray-400">No lead data yet</div>
            )}
          </div>
          <div className="card p-5">
            <div className="text-sm font-semibold text-gray-800 mb-4">Leads by widget</div>
            {Object.entries(leadAnalytics.byWidget || {}).slice(0, 5).map(([wid, count]: any) => {
              const w = widgets.find((x: any) => x.id === wid)
              return (
                <div key={wid} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600 truncate max-w-[160px]">{w?.name || wid.slice(0, 12)}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Per-widget analytics */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-800">Widget analytics</div>
          <select className="inp w-52" value={selectedWidget} onChange={e => setWid(e.target.value)}>
            <option value="">Select a widget</option>
            {widgets.map((w: any) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        {wAnalytics ? (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{wAnalytics.totalChats}</div>
                <div className="text-xs text-gray-400">Chats</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{wAnalytics.totalLeads}</div>
                <div className="text-xs text-gray-400">Leads</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand">{wAnalytics.conversionRate}</div>
                <div className="text-xs text-gray-400">Conversion</div>
              </div>
            </div>
            {Object.keys(wAnalytics.dailyBreakdown || {}).length > 0 && (
              <div>
                <div className="text-xs text-gray-400 mb-2">Daily chats</div>
                <div className="flex items-end gap-1 h-20">
                  {Object.entries(wAnalytics.dailyBreakdown).slice(-14).map(([day, count]: any) => {
                    const max = Math.max(...Object.values(wAnalytics.dailyBreakdown) as number[]) || 1
                    const h   = Math.round((count / max) * 64)
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1" title={`${day}: ${count}`}>
                        <div className="w-full bg-brand rounded-sm" style={{ height: h || 2 }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400 py-4 text-center">Select a widget to see detailed analytics</div>
        )}
      </div>
    </div>
  )
}

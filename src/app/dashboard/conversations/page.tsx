'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { widgetAPI, chatAPI } from '@/lib/api'
import Link from 'next/link'

export default function ConversationsPage() {
  const { data: widgets = [] }  = useSWR('widgets', widgetAPI.list)
  const [wid, setWid]           = useState('')
  const [search, setSearch]     = useState('')

  const { data: sessions = [], isLoading } = useSWR(
    wid ? ['sessions', wid] : null,
    () => chatAPI.sessions(wid)
  )

  const filtered = sessions.filter((s: any) =>
    !search || s.sessionId?.toLowerCase().includes(search.toLowerCase()) ||
    s.lastMessage?.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Conversations</h1>
        <p className="text-sm text-gray-400 mt-0.5">Browse all chat sessions from your widgets</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select className="inp w-56" value={wid} onChange={e => { setWid(e.target.value); setSearch('') }}>
          <option value="">Select a widget</option>
          {widgets.map((w: any) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
        {wid && (
          <input className="inp flex-1" placeholder="Search sessions…"
            value={search} onChange={e => setSearch(e.target.value)} />
        )}
      </div>

      {/* No widget selected */}
      {!wid && (
        <div className="card p-12 text-center">
          <div className="text-3xl mb-3">💬</div>
          <div className="text-sm font-medium text-gray-600 mb-1">Select a widget to view conversations</div>
          <div className="text-xs text-gray-400">All chat sessions from that widget will appear here</div>
        </div>
      )}

      {/* Loading */}
      {wid && isLoading && (
        <div className="card p-12 text-center">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Sessions list */}
      {wid && !isLoading && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-sm text-gray-500">
            {search ? 'No sessions match your search' : 'No conversations yet for this widget'}
          </div>
        </div>
      )}

      {wid && !isLoading && filtered.length > 0 && (
        <div className="card divide-y divide-gray-50">
          {filtered.map((s: any) => (
            <Link key={s.sessionId}
              href={`/dashboard/conversations/${wid}/${s.sessionId}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" fill="none" stroke="#10a37f" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    Session {s.sessionId?.slice(0, 8)}…
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {s.lastMessage || 'No preview available'}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-xs text-gray-400">{fmt(s.lastAt || s.createdAt)}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {s.turnCount || 1} {s.turnCount === 1 ? 'message' : 'messages'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

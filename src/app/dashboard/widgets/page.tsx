'use client'
import useSWR from 'swr'
import { widgetAPI } from '@/lib/api'
import Link from 'next/link'
import { BRAIN_LABELS } from '@/lib/config'
import toast from 'react-hot-toast'

export default function WidgetsPage() {
  const { data: widgets, isLoading, mutate } = useSWR('widgets', widgetAPI.list)

  const toggleActive = async (w: any) => {
    try {
      await widgetAPI.update(w.id, { isActive: !w.isActive })
      mutate()
      toast.success(w.isActive ? 'Deactivated' : 'Activated')
    } catch { toast.error('Failed') }
  }

  const deleteWidget = async (id: string) => {
    if (!confirm('Delete this widget?')) return
    try {
      await widgetAPI.delete(id)
      mutate()
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Widgets</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your AI sales agents</p>
        </div>
        <Link href="/dashboard/widgets/new" className="btn-primary gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New widget
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-xl" />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !widgets?.length && (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <div className="font-semibold text-gray-700 mb-1">No widgets yet</div>
          <p className="text-sm text-gray-400 mb-5">Create your first AI widget to start capturing leads</p>
          <Link href="/dashboard/widgets/new" className="btn-primary">Create widget</Link>
        </div>
      )}

      {/* Cards grid */}
      {!isLoading && widgets?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {widgets.map((w: any) => (
            <div key={w.id} className="card p-5">

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: (w.color || '#10a37f') + '22' }}
                  >
                    {BRAIN_LABELS[w.brainType]?.split(' ')[0] || '⚡'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{w.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{BRAIN_LABELS[w.brainType] || 'Generic'}</div>
                  </div>
                </div>

                {/* Live toggle */}
                <button
                  onClick={() => toggleActive(w)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all flex-shrink-0
                    ${w.isActive
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                  {w.isActive ? '● Live' : '○ Off'}
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4 py-3 border-y border-gray-50">
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">{w.totalChats || 0}</div>
                  <div className="text-xs text-gray-400">Chats</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">{w.totalLeads || 0}</div>
                  <div className="text-xs text-gray-400">Leads</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {w.totalChats ? Math.round((w.totalLeads / w.totalChats) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-400">Conversion</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/widgets/${w.id}`}
                  className="btn-secondary text-xs px-3 py-1.5 flex-1 text-center"
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/widgets/${w.id}/snippet`}
                  className="btn-secondary text-xs px-3 py-1.5 flex-1 text-center"
                >
                  &lt;/&gt; Embed
                </Link>
                <button
                  onClick={() => deleteWidget(w.id)}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

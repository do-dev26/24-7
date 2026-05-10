'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { leadAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['new','contacted','converted','lost']
const STATUS_STYLES: Record<string, string> = {
  new: 'badge-blue', contacted: 'badge-amber', converted: 'badge-green', lost: 'badge-gray'
}

export default function LeadsPage() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const { data: leads = [], isLoading, mutate } = useSWR(
    ['leads', status], () => leadAPI.list(status ? { status } : {})
  )

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await leadAPI.update(id, { status: newStatus })
      mutate()
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  const exportCSV = async () => {
    try {
      const res = await leadAPI.export()
      const url = URL.createObjectURL(res.data)
      const a   = document.createElement('a')
      a.href = url; a.download = `leads-${Date.now()}.csv`; a.click()
      toast.success('Downloaded!')
    } catch { toast.error('Export failed — upgrade to Starter plan') }
  }

  const filtered = leads.filter((l: any) =>
    !search ||
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">{leads.length} total leads collected</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary gap-2">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input className="inp max-w-xs" placeholder="Search name, email, phone…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp w-40" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : !filtered.length ? (
        <div className="card p-16 text-center">
          <div className="text-3xl mb-3">📋</div>
          <div className="font-medium text-gray-700">No leads found</div>
          <p className="text-sm text-gray-400 mt-1">Leads will appear here once visitors chat with your widget</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Intent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l: any) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-900">{l.name || '—'}</div>
                    <div className="text-xs text-gray-400">{l.email || 'No email'}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{l.phone || '—'}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">{l.intent || '—'}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={l.status || 'new'}
                      onChange={e => updateStatus(l.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border cursor-pointer outline-none
                        ${l.status === 'converted' ? 'bg-green-50 text-green-700 border-green-100' :
                          l.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          l.status === 'lost'      ? 'bg-gray-100 text-gray-500 border-gray-200' :
                                                     'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

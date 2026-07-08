'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { widgetAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function SnippetPage() {
  const { id }        = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    widgetAPI.snippet(id as string).then(setData).catch(() => {})
  }, [id])

  const copy = () => {
    navigator.clipboard.writeText(data?.snippet || '')
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Embed code</h1>
        <p className="text-sm text-gray-400 mt-0.5">Paste this before &lt;/body&gt; on your website</p>
      </div>
      {data ? (
        <div className="card p-5">
          <pre className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all mb-4">{data.snippet}</pre>
          <div className="flex gap-3">
            <button onClick={copy} className="btn-primary gap-2">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Copy code
            </button>
            <Link href={`/dashboard/widgets/${id}`} className="btn-secondary">Back to widget</Link>
          </div>
          <div className="mt-4 p-3 bg-brand-light rounded-lg text-xs text-brand">
            ✅ After pasting, the widget will appear on your site within 30 seconds.
          </div>
        </div>
      ) : (
        <div className="skeleton h-40 rounded-xl" />
      )}
    </div>
  )
}

'use client'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { chatAPI } from '@/lib/api'
import Link from 'next/link'

export default function ConversationDetailPage() {
  const { widgetId, sessionId } = useParams()
  const router = useRouter()

  const { data: turns = [], isLoading } = useSWR(
    widgetId && sessionId ? ['history', widgetId, sessionId] : null,
    () => chatAPI.history(widgetId as string, sessionId as string)
  )

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-700 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Conversation</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">Session: {(sessionId as string)?.slice(0, 16)}…</p>
        </div>
      </div>

      {isLoading && (
        <div className="card p-12 text-center">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!isLoading && turns.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-3xl mb-3">💬</div>
          <div className="text-sm text-gray-500">No messages found for this session</div>
          <Link href="/dashboard/conversations" className="btn-secondary mt-4 inline-flex">
            Back to conversations
          </Link>
        </div>
      )}

      {!isLoading && turns.length > 0 && (
        <div className="space-y-4">
          {turns.map((t: any, i: number) => (
            <div key={i} className="space-y-3">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-brand text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
                    {t.userMessage}
                  </div>
                  <div className="text-xs text-gray-400 text-right mt-1">{fmt(t.createdAt)}</div>
                </div>
              </div>
              {/* AI reply */}
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center">
                      <svg width="10" height="10" fill="white" viewBox="0 0 24 24" className="fill-brand">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">SaleIQ AI</span>
                  </div>
                  <div className="bg-white border border-gray-100 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 leading-relaxed text-gray-700 shadow-sm">
                    {t.aiReply}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{t.wordCount} words · {t.tokens} tokens</div>
                </div>
              </div>
            </div>
          ))}

          {/* Session summary */}
          <div className="card p-4 mt-4 bg-gray-50 border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-900">{turns.length}</div>
                <div className="text-xs text-gray-400">Exchanges</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {turns.reduce((a: number, t: any) => a + (t.wordCount || 0), 0)}
                </div>
                <div className="text-xs text-gray-400">Total words</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {turns.reduce((a: number, t: any) => a + (t.tokens || 0), 0)}
                </div>
                <div className="text-xs text-gray-400">Tokens used</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

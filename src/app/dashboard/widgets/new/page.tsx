'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { widgetAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const COLORS = ['#10a37f','#6366f1','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']
const POSITIONS = ['bottom-right','bottom-left','top-right','top-left']

export default function NewWidgetPage() {
  const router = useRouter()
  const { data: brains = [] } = useSWR('brains', widgetAPI.brainOptions)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', brainType: 'generic', color: '#10a37f',
    position: 'bottom-right', welcomeMessage: 'Hi! How can I help you today? 👋',
    instructions: '', collectEmail: true, collectName: true,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Widget name is required'); return }
    setLoading(true)
    try {
      const w = await widgetAPI.create(form)
      toast.success('Widget created!')
      router.push(`/dashboard/widgets/${w.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create widget')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Create widget</h1>
        <p className="text-sm text-gray-400 mt-0.5">Set up your AI sales agent</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="card p-5 space-y-4">
          <div>
            <label className="lbl">Widget name *</label>
            <input className="inp" placeholder="e.g. Main website bot" value={form.name}
              onChange={e => set('name', e.target.value)} required />
          </div>

          <div>
            <label className="lbl">AI Sales Brain</label>
            <select className="inp" value={form.brainType} onChange={e => set('brainType', e.target.value)}>
              {brains.length ? brains.map((b: any) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              )) : (
                <>
                  <option value="generic">⚡ Generic Assistant</option>
                  <option value="real_estate">🏠 Real Estate</option>
                  <option value="saas">💻 SaaS / Software</option>
                  <option value="education">🎓 Education</option>
                  <option value="ecommerce">🛍️ E-commerce</option>
                  <option value="healthcare">🏥 Healthcare</option>
                  <option value="fno">📈 F&O Trading</option>
                  <option value="restaurant">🍽️ Restaurant</option>
                </>
              )}
            </select>
            <p className="text-xs text-gray-400 mt-1">Each brain is tuned for that industry&apos;s sales conversations</p>
          </div>

          <div>
            <label className="lbl">Welcome message</label>
            <input className="inp" value={form.welcomeMessage}
              onChange={e => set('welcomeMessage', e.target.value)}
              placeholder="Hi! How can I help you today? 👋" />
          </div>

          <div>
            <label className="lbl">Custom instructions (optional)</label>
            <textarea className="inp" rows={3} value={form.instructions}
              onChange={e => set('instructions', e.target.value)}
              placeholder="e.g. Always offer a free consultation. Focus on 2BHK properties in Pune." />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <label className="lbl">Widget color</label>
            <div className="flex gap-2 mt-1">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                  style={{ background: c }} />
              ))}
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-7 h-7 rounded-full border-0 cursor-pointer" title="Custom color" />
            </div>
          </div>

          <div>
            <label className="lbl">Position</label>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map(p => (
                <button key={p} type="button" onClick={() => set('position', p)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all text-left
                    ${form.position === p ? 'border-brand bg-brand-light text-brand' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-gray-700">Collect email</div>
              <div className="text-xs text-gray-400">AI will naturally ask for visitor&apos;s email</div>
            </div>
            <button type="button" onClick={() => set('collectEmail', !form.collectEmail)}
              className={`w-10 h-6 rounded-full transition-all ${form.collectEmail ? 'bg-brand' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-1 ${form.collectEmail ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
            {loading ? 'Creating…' : 'Create widget'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-2.5">Cancel</button>
        </div>
      </form>
    </div>
  )
}


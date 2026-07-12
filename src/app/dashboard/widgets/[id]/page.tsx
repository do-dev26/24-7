'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { widgetAPI } from '@/lib/api'
import { BRAIN_LABELS } from '@/lib/config'
import toast from 'react-hot-toast'
import Link from 'next/link'

const COLORS  = ['#10a37f','#6366f1','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']
const POSITIONS = ['bottom-right','bottom-left','top-right','top-left']

export default function WidgetEditPage() {
  const { id } = useParams()
  const router  = useRouter()
  const [form, setForm]       = useState<any>(null)
  const [saving, setSaving]   = useState(false)
  const [brains, setBrains]   = useState<any[]>([])

  useEffect(() => {
    widgetAPI.get(id as string).then(setForm).catch(() => router.push('/dashboard/widgets'))
    widgetAPI.brainOptions().then(setBrains).catch(() => {})
  }, [id])

  const set = (k: string, v: any) => setForm((f:any) => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await widgetAPI.update(id as string, form)
      toast.success('Widget saved!')
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  if (!form) return <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{form.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{BRAIN_LABELS[form.brainType] || 'Generic'}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/widgets/${id}/snippet`} className="btn-secondary text-sm">&lt;/&gt; Get embed code</Link>
        </div>
      </div>

      <form onSubmit={save} className="space-y-5">
        <div className="card p-5 space-y-4">
          <div><label className="lbl">Widget name</label>
            <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
          <div><label className="lbl">AI Brain</label>
            <select className="inp" value={form.brainType} onChange={e => set('brainType', e.target.value)}>
              {brains.length ? brains.map((b:any) => <option key={b.value} value={b.value}>{b.label}</option>)
                : Object.entries(BRAIN_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select></div>
          <div><label className="lbl">Welcome message</label>
            <input className="inp" value={form.welcomeMessage} onChange={e => set('welcomeMessage', e.target.value)} /></div>
          <div><label className="lbl">Custom instructions</label>
            <textarea className="inp" rows={3} value={form.instructions} onChange={e => set('instructions', e.target.value)}
              placeholder="Additional context for the AI…" /></div>
        </div>

        <div className="card p-5 space-y-4">
          <div><label className="lbl">Widget color</label>
            <div className="flex gap-2 mt-1">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  className={`w-7 h-7 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                  style={{ background: c }} />
              ))}
            </div></div>
          <div><label className="lbl">Position</label>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map(p => (
                <button key={p} type="button" onClick={() => set('position', p)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all
                    ${form.position === p ? 'border-brand bg-brand-light text-brand' : 'border-gray-200 text-gray-500'}`}>
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div></div>
          <div className="flex items-center justify-between">
            <div><div className="text-sm font-medium text-gray-700">Active</div>
              <div className="text-xs text-gray-400">Widget visible on website</div></div>
            <button type="button" onClick={() => set('isActive', !form.isActive)}
              className={`w-10 h-6 rounded-full transition-all ${form.isActive ? 'bg-brand' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 transition-all ${form.isActive ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-6">{saving ? 'Saving…' : 'Save changes'}</button>
          <Link href="/dashboard/widgets" className="btn-secondary px-6">Back</Link>
        </div>
      </form>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { widgetAPI, businessAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function SetupPage() {
  const { data: widgets = [] } = useSWR('widgets', widgetAPI.list)
  const [wid, setWid]          = useState('')
  const [scraping, setScraping]= useState(false)
  const [saving, setSaving]    = useState(false)
  const [form, setForm]        = useState<any>({
    businessName:'', businessType:'generic', tagline:'', description:'',
    websiteUrl:'', phone:'', workingHours:'', offers:'', ratings:'',
    ctaGoal:'lead', ctaText:'Get in Touch',
    topProducts:[], fnoDetails:{ services:[], riskDisclaimer:'', returns:'', minCapital:'' },
    realEstateDetails:{ propertyTypes:[], locations:[], priceRange:'', amenities:[], reraNumber:'' },
  })

  useEffect(() => {
    if (widgets.length && !wid) setWid(widgets[0].id)
  }, [widgets])

  useEffect(() => {
    if (!wid) return
    businessAPI.get(wid).then(p => { if (p) setForm((f:any) => ({ ...f, ...p })) }).catch(() => {})
  }, [wid])

  const set = (k: string, v: any) => setForm((f:any) => ({ ...f, [k]: v }))

  const save = async () => {
    if (!wid) { toast.error('Select a widget first'); return }
    setSaving(true)
    try {
      await businessAPI.save(wid, form)
      toast.success('Business profile saved! Website scraping in background…')
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const rescrape = async () => {
    if (!wid) return
    setScraping(true)
    try {
      await businessAPI.rescrape(wid)
      toast.success('Website re-scraped successfully!')
    } catch (e: any) { toast.error(e.response?.data?.message || 'Scrape failed') }
    finally { setScraping(false) }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Business Setup</h1>
        <p className="text-sm text-gray-400 mt-0.5">AI uses this info in every sales conversation</p>
      </div>

      <div className="mb-5">
        <label className="lbl">Select widget</label>
        <select className="inp" value={wid} onChange={e => setWid(e.target.value)}>
          {widgets.map((w:any) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      <div className="card p-5 space-y-4 mb-5">
        <div className="text-sm font-semibold text-gray-800">Basic info</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl">Business name</label>
            <input className="inp" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Sharma Properties" /></div>
          <div><label className="lbl">Business type</label>
            <select className="inp" value={form.businessType} onChange={e => set('businessType', e.target.value)}>
              {['generic','real_estate','saas','education','ecommerce','healthcare','fno','restaurant'].map(t =>
                <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select></div>
        </div>
        <div><label className="lbl">Tagline</label>
          <input className="inp" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Find your dream home" /></div>
        <div><label className="lbl">Description</label>
          <textarea className="inp" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What your business does…" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl">Phone</label>
            <input className="inp" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
          <div><label className="lbl">Working hours</label>
            <input className="inp" value={form.workingHours} onChange={e => set('workingHours', e.target.value)} placeholder="Mon-Sat 10am-7pm" /></div>
        </div>
        <div><label className="lbl">Offers / Promotions</label>
          <input className="inp" value={form.offers} onChange={e => set('offers', e.target.value)} placeholder="Zero brokerage this month!" /></div>
        <div><label className="lbl">Ratings / Social proof</label>
          <input className="inp" value={form.ratings} onChange={e => set('ratings', e.target.value)} placeholder="4.9★ Google (300+ reviews)" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl">CTA goal</label>
            <select className="inp" value={form.ctaGoal} onChange={e => set('ctaGoal', e.target.value)}>
              {['lead','booking','purchase','call'].map(g => <option key={g} value={g}>{g}</option>)}
            </select></div>
          <div><label className="lbl">CTA button text</label>
            <input className="inp" value={form.ctaText} onChange={e => set('ctaText', e.target.value)} placeholder="Get in Touch" /></div>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="text-sm font-semibold text-gray-800 mb-4">Website URL — auto scrape</div>
        <div className="flex gap-2">
          <input className="inp flex-1" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="https://yourwebsite.com" />
          <button onClick={rescrape} disabled={scraping || !form.websiteUrl} className="btn-secondary whitespace-nowrap">
            {scraping ? 'Scraping…' : '🔄 Re-scrape'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">AI reads your website and uses the content in sales conversations automatically</p>
      </div>

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="btn-primary px-6">
          {saving ? 'Saving…' : 'Save business profile'}
        </button>
      </div>
    </div>
  )
}

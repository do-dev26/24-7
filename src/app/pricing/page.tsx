'use client'
import Link from 'next/link'

const PLANS = [
  { id:'free', name:'Free', price:0, features:['1 widget','500 words/month','Basic analytics','Community support'], cta:'Get started', href:'/signup' },
  { id:'starter', name:'Starter', price:29, features:['3 widgets','5,000 words/month','Lead export CSV','All 5 AI brains','Email support'], cta:'Start Starter', href:'/signup' },
  { id:'pro', name:'Pro', price:79, popular:true, features:['10 widgets','50,000 words/month','Advanced analytics','Website scraping','Priority support'], cta:'Start Pro', href:'/signup' },
  { id:'enterprise', name:'Enterprise', price:null, features:['Unlimited widgets','Unlimited words','Custom AI training','Dedicated account manager','SLA guarantee'], cta:'Contact us', href:'mailto:hello@saleiq.ai' },
]
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <svg width="13" height="13" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span className="font-bold text-[15px]">SaleIQ</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm px-3 py-1.5">Login</Link>
          <Link href="/signup" className="btn-primary text-sm px-3 py-1.5">Get started</Link>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-400">Start free. Upgrade as you grow. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {PLANS.map(p => (
            <div key={p.id} className={`card p-6 flex flex-col ${p.popular ? 'border-2 border-brand ring-2 ring-brand/10' : ''}`}>
              {p.popular && <div className="text-xs font-semibold text-brand bg-brand-light px-3 py-1 rounded-full mb-3 text-center">Most popular</div>}
              <div className="font-bold text-gray-900 mb-2">{p.name}</div>
              <div className="mb-5">
                {p.price === null ? <span className="text-2xl font-bold">Custom</span>
                  : p.price === 0 ? <span className="text-2xl font-bold">Free</span>
                  : <><span className="text-3xl font-bold">${p.price}</span><span className="text-gray-400 text-sm">/mo</span></>}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <svg width="12" height="12" fill="none" stroke="#10a37f" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={`text-center py-2.5 rounded-lg text-sm font-medium transition-all
                ${p.popular ? 'bg-brand text-white hover:bg-brand-dark' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
          <Link href="/refund">Refund</Link><Link href="/support">Support</Link>
        </div>
        © {new Date().getFullYear()} SaleIQ
      </footer>
    </div>
  )
}

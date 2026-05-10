'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && user) router.push('/dashboard') }, [user, loading])

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <svg width="13" height="13" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span className="font-bold text-[15px]">SaleIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-800">Pricing</Link>
          <Link href="/login"   className="btn-secondary text-sm px-3 py-1.5">Login</Link>
          <Link href="/signup"  className="btn-primary  text-sm px-3 py-1.5">Get started</Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          ✨ AI-powered sales conversion
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-5 leading-tight">
          Turn visitors into leads<br />while you sleep
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Add a smart AI sales agent to any website in 2 minutes. Real estate, SaaS, healthcare,
          restaurants — 5 specialised AI brains included.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">Start free →</Link>
          <Link href="/pricing" className="btn-secondary px-6 py-3 text-base">See pricing</Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required · Free plan available</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-3 gap-6">
        {[
          { icon: '🤖', title: '5 AI Sales Brains', desc: 'Real Estate, SaaS, Education, Healthcare, E-commerce — each tuned for conversion.' },
          { icon: '🎯', title: 'Auto Lead Capture', desc: 'AI extracts name, email, phone, and intent from every conversation automatically.' },
          { icon: '📊', title: 'Real-time Analytics', desc: 'Track chats, leads, conversion rate, and word usage across all your widgets.' },
          { icon: '🌐', title: 'Website Scraping', desc: 'Paste your URL — AI reads your site and uses that info in every sales conversation.' },
          { icon: '💳', title: 'Flexible Plans', desc: 'Start free. Upgrade when you grow. Cancel anytime from your dashboard.' },
          { icon: '⚡', title: '2-min Setup', desc: 'Copy one line of code. Widget appears on your site instantly. No developer needed.' },
        ].map(f => (
          <div key={f.title} className="card p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="font-semibold text-sm text-gray-900 mb-1">{f.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-6 mb-2">
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          <Link href="/refund" className="hover:text-gray-600">Refund</Link>
          <Link href="/support" className="hover:text-gray-600">Support</Link>
        </div>
        © {new Date().getFullYear()} SaleIQ. All rights reserved.
      </footer>
    </main>
  )
}

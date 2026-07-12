'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { PLANS } from '@/lib/config'

const NAV = [
  { href: '/dashboard',           label: 'Overview',       icon: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
  { href: '/dashboard/widgets',   label: 'Widgets',        icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { href: '/dashboard/leads',     label: 'Leads',          icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 010 3.38 2 2 0 012 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.26-1.26a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
  { href: '/dashboard/analytics', label: 'Analytics',      icon: 'M18 20V10M12 20V4M6 20v-6' },
  { href: '/dashboard/setup',     label: 'Business Setup', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  { href: '/dashboard/billing',   label: 'Billing',        icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { href: '/dashboard/settings',  label: 'Settings',       icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    </div>
  )
  if (!user) return null

  // Fix #1: Use actual plan word limit, not hardcoded 500
  const planCfg = PLANS[(user.plan as keyof typeof PLANS)] || PLANS.free
  const planPct = Math.min(100, Math.round(((user.wordsUsed || 0) / planCfg.words) * 100))
  const initials = (user.displayName || user.email || 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[220px] bg-white border-r border-gray-100 flex flex-col z-50">
        <div className="px-4 py-4 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-bold text-[14px] text-gray-900">SaleIQ</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => {
            const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all
                  ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"
                  viewBox="0 0 24 24" className={active ? 'opacity-100' : 'opacity-60'}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={n.icon}/>
                </svg>
                {n.label}
              </Link>
            )
          })}
        </nav>

        {/* Usage bar — Fix #1: correct plan words */}
        <div className="mx-3 mb-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Words used</span>
            <span className="font-medium text-gray-600">{planPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${planPct > 80 ? 'bg-red-400' : planPct > 60 ? 'bg-amber-400' : 'bg-brand'}`}
              style={{ width: `${planPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span className="capitalize">{planCfg.label} plan</span>
            <span>{(user.wordsUsed || 0).toLocaleString()} / {planCfg.words === 999999 ? '∞' : planCfg.words.toLocaleString()}</span>
          </div>
        </div>

        {/* User row */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-xs font-semibold text-brand flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{user.displayName || 'User'}</div>
              <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
            </div>
            <button onClick={logout} title="Logout"
              className="text-gray-300 hover:text-red-400 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-7">{children}</main>
      </div>
    </div>
  )
}

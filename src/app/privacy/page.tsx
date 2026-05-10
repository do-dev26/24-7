import Link from 'next/link'
export default function Page() {
  const titles: Record<string,string> = { privacy:'Privacy Policy', refund:'Refund Policy', terms:'Terms & Conditions', support:'Support' }
  const slug: string = 'privacy'
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <svg width="13" height="13" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span className="font-bold text-[15px]">SaleIQ</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{titles[slug]}</h1>
        <div className="prose text-gray-600 text-sm leading-relaxed space-y-4">
          {slug === 'support' ? (
            <>
              <p>Need help? We&apos;re here for you.</p>
              <p><strong>Email:</strong> <a href="mailto:support@saleiq.ai" className="text-brand">support@saleiq.ai</a></p>
              <p><strong>Response time:</strong> Within 24 hours on business days.</p>
            </>
          ) : (
            <p>Please contact us at <a href="mailto:legal@saleiq.ai" className="text-brand">legal@saleiq.ai</a> for the full document.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://24-7-hyaq.vercel.app/'


export const PLANS = {
  free:       { label: 'Free',       words: 500,    price: 0  },
  starter:    { label: 'Starter',    words: 5000,   price: 29 },
  pro:        { label: 'Pro',        words: 50000,  price: 79 },
  enterprise: { label: 'Enterprise', words: 999999, price: 299 },
}

export const BRAIN_LABELS: Record<string, string> = {
  real_estate: '🏠 Real Estate',
  saas:        '💻 SaaS / Software',
  education:   '🎓 Education',
  ecommerce:   '🛍️ E-commerce',
  healthcare:  '🏥 Healthcare',
  fno:         '📈 F&O Trading',
  restaurant:  '🍽️ Restaurant',
  generic:     '⚡ Generic',
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const FIREBASE_CONFIG = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
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

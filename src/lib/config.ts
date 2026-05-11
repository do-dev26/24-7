export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC3sIauDUSY-q7ZWx_n2EpIsctZsWGE6Bs",
  authDomain: "data-credit-a48bd.firebaseapp.com",
  projectId: "data-credit-a48bd",
  storageBucket: "data-credit-a48bd.firebasestorage.app",
  messagingSenderId: "154490671024",
  appId: "1:154490671024:web:e87588a05df41c4c625075",
  measurementId: "G-5E6DF2Y208"

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

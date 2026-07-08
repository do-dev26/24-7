export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://24-7-hyaq.vercel.app/'

export const firebaseConfig = {
  apiKey: "AIzaSyBKvn0N0hUzic1EWTJ0U9x9DO39bvEc4dc",
  authDomain: "wsetw-7302c.firebaseapp.com",
  projectId: "wsetw-7302c",
  storageBucket: "wsetw-7302c.firebasestorage.app",
  messagingSenderId: "916747800024",
  appId: "1:916747800024:web:8b2baeb5b64194859276ad",
  measurementId: "G-4MGLCB6L2B"
};

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

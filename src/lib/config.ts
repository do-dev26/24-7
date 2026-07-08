export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://24-7-hyaq.vercel.app/'

const firebaseConfig = {
  apiKey: "AIzaSyCUeIklxbz6dq1vRdOveeZZl-9tdIhKuB4",
  authDomain: "testora-98f88.firebaseapp.com",
  projectId: "testora-98f88",
  storageBucket: "testora-98f88.firebasestorage.app",
  messagingSenderId: "243615465573",
  appId: "1:243615465573:web:04af838f19fdf26140468c",
  measurementId: "G-GG8LBD8HBB"
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

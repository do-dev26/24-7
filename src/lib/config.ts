export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://24-7-hyaq.vercel.app/'

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBsAEpp3hooCCHYEdmTNqTId9aWK0a69Ms",
  authDomain: "ai-vit-52666.firebaseapp.com",
  projectId: "ai-vit-52666",
  storageBucket: "ai-vit-52666.firebasestorage.app",
  messagingSenderId: "137839510307",
  appId: "1:137839510307:web:c8f56f623c8234b4638296",
  measurementId: "G-CDTY9LJLC7",
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

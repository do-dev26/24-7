# SaleIQ Frontend

Next.js 14 frontend for SaleIQ — AI Sales Widget SaaS.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in your environment variables
npm run dev
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_API_URL` — Your Render backend URL
- `NEXT_PUBLIC_FIREBASE_*` — Firebase project config

## Deploy to Vercel

```bash
npx vercel --prod
```

Add all `NEXT_PUBLIC_*` env vars in Vercel dashboard.

## Pages

- `/` — Landing page
- `/login` — Login (Email + Google)
- `/signup` — Register
- `/forgot-password` — Password reset
- `/pricing` — Plans
- `/dashboard` — Main dashboard
- `/dashboard/widgets` — Widget management
- `/dashboard/leads` — Lead management
- `/dashboard/analytics` — Analytics
- `/dashboard/setup` — Business profile
- `/dashboard/billing` — Billing & plans
- `/dashboard/settings` — Account settings

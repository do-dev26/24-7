# SaleIQ — Firebase + Razorpay Integration Guide

## FILES IN THIS ZIP (Replace/Add these in your project)

```
update-files/
├── assets/js/
│   ├── firebase-config.js   ← NEW: apna Firebase config yahan
│   ├── auth.js              ← UPDATED: Firebase Auth
│   └── payment.js           ← NEW: Razorpay payment
├── login.html               ← UPDATED
├── signup.html              ← UPDATED
├── forgot-password.html     ← UPDATED
├── pricing.html             ← UPDATED (Razorpay buttons)
├── dashboard.html           ← UPDATED (Firebase data)
└── INTEGRATION_GUIDE.md     ← This file
```

---

## STEP 1 — Firebase Setup (15 min)

1. console.firebase.google.com → New Project → "saleiq-prod"
2. Authentication → Sign-in method → Enable:
   - Email/Password ✓
   - Google ✓
3. Firestore Database → Create database → Production mode
4. Project Settings → Your apps → </> Web
5. Register app → copy firebaseConfig
6. Paste in: assets/js/firebase-config.js (replace the placeholder values)

---

## STEP 2 — Firestore Security Rules

Go to Firestore → Rules → paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /leads/{leadId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /followups/{fid} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    match /payments/{pid} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false;
    }
  }
}
```

---

## STEP 3 — Razorpay Setup

1. razorpay.com → Sign up → Complete KYC
2. Settings → API Keys → Generate Test Key
3. Copy Key ID → paste in assets/js/payment.js line 8:
   const RAZORPAY_KEY = 'rzp_test_XXXXXXXX';
4. For production: rzp_live_XXXXXXXX

---

## STEP 4 — Cloud Functions (for payment verification)

Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
cd functions
npm install razorpay
```

Paste this in functions/index.js:
(Full code in INTEGRATION_GUIDE — see Step 4 in the main guide)

```bash
firebase functions:config:set razorpay.key_id="rzp_test_XXX" razorpay.key_secret="XXX"
firebase deploy --only functions
```

Update CLOUD_FN_URL in payment.js with your project URL.

---

## TESTING CHECKLIST

- [ ] signup.html → creates user in Firebase Auth + Firestore
- [ ] login.html → redirects to dashboard
- [ ] forgot-password.html → sends real Firebase reset email
- [ ] pricing.html → Razorpay checkout opens (test mode)
- [ ] Payment success → plan updates in Firestore
- [ ] dashboard.html → reads real user data from Firestore

---

## RAZORPAY TEST CARDS

Card: 4111 1111 1111 1111  Expiry: any future  CVV: any
UPI:  success@razorpay  (for test UPI payments)

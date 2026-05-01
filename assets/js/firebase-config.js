// ============================================================
// firebase-config.js
// Step 1: Firebase console.firebase.google.com pe jao
// Step 2: New Project → saleiq-prod
// Step 3: Authentication → Enable Email/Password + Google
// Step 4: Firestore Database → Create (production mode)
// Step 5: Project Settings → Web App → Register → copy config below
// ============================================================

import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth }          from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore }     from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ── APNA CONFIG YAHAN PASTE KARO ──────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSy_REPLACE_THIS",
  authDomain:        "saleiq-prod.firebaseapp.com",
  projectId:         "saleiq-prod",
  storageBucket:     "saleiq-prod.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
// ──────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

// ============================================================
// firebase-config.js — SaleIQ Firebase Connection
// Project: testora-98f88
// ============================================================

import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth }          from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore }     from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAnalytics }     from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCUeIklxbz6dq1vRdOveeZZl-9tdIhKuB4",
  authDomain:        "testora-98f88.firebaseapp.com",
  projectId:         "testora-98f88",
  storageBucket:     "testora-98f88.firebasestorage.app",
  messagingSenderId: "243615465573",
  appId:             "1:243615465573:web:04af838f19fdf26140468c",
  measurementId:     "G-GG8LBD8HBB"
};

// Initialize Firebase
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db   = getFirestore(app);

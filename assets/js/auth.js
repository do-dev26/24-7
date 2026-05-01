// ============================================================
// auth.js — Firebase Auth (replaces old localStorage version)
// ============================================================
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ── Toast ────────────────────────────────────────────────
window.showToast = function(m, t = 'success') {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const d = document.createElement('div');
  d.className = 'toast';
  const bg = { success:'#0d0d0d', error:'#dc2626', info:'#2563eb', warning:'#d97706' };
  d.style.cssText = `background:${bg[t]||'#0d0d0d'};color:#fff;padding:11px 16px;border-radius:9px;font-size:13px;font-family:'Inter',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.15);min-width:220px;`;
  d.textContent = m;
  c.appendChild(d);
  setTimeout(() => { d.style.opacity = '0'; d.style.transition = 'opacity 0.3s'; setTimeout(() => d.remove(), 300); }, 3000);
};

// ── Sign Up ──────────────────────────────────────────────
window.handleSignUp = async function(e) {
  e.preventDefault();
  const name     = document.getElementById('name')?.value.trim();
  const email    = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const confirm  = document.getElementById('confirm-password')?.value;

  if (!name || !email || !password) return showToast('Please fill all fields', 'error');
  if (password.length < 6) return showToast('Password min 6 characters', 'error');
  if (password !== confirm) return showToast('Passwords do not match', 'error');

  const btn = e.target.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:         cred.user.uid,
      name,
      email,
      plan:        'trial',
      wordsUsed:   0,
      wordsLimit:  5000,
      planExpiry:  new Date(Date.now() + 7 * 86400000),
      widgetId:    'wid_' + cred.user.uid.slice(0, 8),
      createdAt:   serverTimestamp()
    });

    showToast('Account created! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1200);

  } catch (err) {
    const msgs = {
      'auth/email-already-in-use': 'Email already registered. Login instead.',
      'auth/weak-password':        'Password too weak (min 6 chars)',
      'auth/invalid-email':        'Invalid email address'
    };
    showToast(msgs[err.code] || err.message, 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Create account'; }
  }
};

// ── Login ────────────────────────────────────────────────
window.handleLogin = async function(e) {
  e.preventDefault();
  const email    = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  if (!email || !password) return showToast('Please fill all fields', 'error');

  const btn = e.target.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const params  = new URLSearchParams(window.location.search);
    window.location.href = params.get('redirect') || 'dashboard.html';

  } catch (err) {
    const msgs = {
      'auth/user-not-found':    'No account with this email',
      'auth/wrong-password':    'Incorrect password',
      'auth/invalid-credential':'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Try later.'
    };
    showToast(msgs[err.code] || 'Login failed', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Sign in'; }
  }
};

// ── Google Login ─────────────────────────────────────────
window.handleGoogleLogin = async function() {
  try {
    const provider = new GoogleAuthProvider();
    const cred     = await signInWithPopup(auth, provider);
    const user     = cred.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid:        user.uid,
        name:       user.displayName || '',
        email:      user.email,
        plan:       'trial',
        wordsUsed:  0,
        wordsLimit: 5000,
        planExpiry: new Date(Date.now() + 7 * 86400000),
        widgetId:   'wid_' + user.uid.slice(0, 8),
        createdAt:  serverTimestamp()
      });
    }
    window.location.href = 'dashboard.html';

  } catch (err) {
    showToast('Google login failed: ' + err.message, 'error');
  }
};

// ── Forgot Password ──────────────────────────────────────
window.handleForgotPassword = async function(e) {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  if (!email) return showToast('Please enter your email', 'error');

  try {
    await sendPasswordResetEmail(auth, email);
    showToast('Reset link sent to ' + email, 'success');
    setTimeout(() => window.location.href = 'login.html', 2000);
  } catch (err) {
    showToast('Email not found', 'error');
  }
};

// ── Auth Guard (dashboard.html use karta hai) ────────────
window.requireAuth = function() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          resolve({ ...snap.data(), uid: firebaseUser.uid, firebaseUser });
        } else {
          resolve({ uid: firebaseUser.uid, email: firebaseUser.email, plan: 'trial', firebaseUser });
        }
      } catch {
        resolve({ uid: firebaseUser.uid, email: firebaseUser.email, plan: 'trial', firebaseUser });
      }
    });
  });
};

// ── Redirect if already logged in ───────────────────────
window.redirectIfLoggedIn = function() {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = 'dashboard.html';
  });
};

// ── Logout ───────────────────────────────────────────────
window.handleLogout = async function() {
  if (!confirm('Sign out?')) return;
  await signOut(auth);
  localStorage.clear();
  window.location.href = 'login.html';
};

// ── Toggle Password Visibility ───────────────────────────
window.togglePassword = function(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.style.color = inp.type === 'text' ? '#10a37f' : '#ababab';
};

// ── Password Strength ────────────────────────────────────
window.checkStrength = function(val) {
  const bars  = [1,2,3,4].map(i => document.getElementById('s'+i));
  const label = document.getElementById('strength-label');
  bars.forEach(b => { if(b) b.style.background = '#e5e5e6'; });
  if (!val) { if(label) label.textContent = ''; return; }
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const colors = ['#ef4444','#f59e0b','#10a37f','#059669'];
  const labels = ['Weak','Fair','Good','Strong'];
  for (let i = 0; i < score; i++) { if(bars[i]) bars[i].style.background = colors[score-1]; }
  if (label) { label.textContent = labels[score-1]||''; label.style.color = colors[score-1]||'#ababab'; }
};

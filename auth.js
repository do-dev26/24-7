// ============================================================
// AUTH.JS — Firebase Auth Flow (localStorage-based simulation)
// Replace localStorage calls with actual Firebase SDK calls
// ============================================================

// ── Toast Notification ─────────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--accent)',
    warning: 'var(--warning)'
  };
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:${colors[type]};font-weight:700;font-size:16px;">${icons[type]}</span>
    <span style="color:var(--text);font-size:14px;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeInUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Auth Guard ──────────────────────────────────────────────
function requireAuth() {
  const user = localStorage.getItem('saleiq_user');
  if (!user) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
    return false;
  }
  return JSON.parse(user);
}

function redirectIfLoggedIn() {
  const user = localStorage.getItem('saleiq_user');
  if (user) {
    window.location.href = 'dashboard.html';
  }
}

// ── Sign Up ─────────────────────────────────────────────────
function handleSignUp(e) {
  e.preventDefault();

  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const confirm = document.getElementById('confirm-password')?.value;

  if (!name || !email || !password) {
    return showToast('Please fill in all fields.', 'error');
  }
  if (password.length < 8) {
    return showToast('Password must be at least 8 characters.', 'error');
  }
  if (password !== confirm) {
    return showToast('Passwords do not match.', 'error');
  }

  // Simulate Firebase: firebase.auth().createUserWithEmailAndPassword(email, password)
  const userData = {
    uid: 'uid_' + Date.now(),
    name,
    email,
    plan: 'Basic',
    wordsUsed: 0,
    wordsLimit: 5000,
    planExpiry: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('saleiq_user', JSON.stringify(userData));
  showToast('Account created! Redirecting...', 'success');
  setTimeout(() => window.location.href = 'dashboard.html', 1200);
}

// ── Log In ──────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    return showToast('Please enter your email and password.', 'error');
  }

  // Simulate Firebase: firebase.auth().signInWithEmailAndPassword(email, password)
  // For demo: any email/password logs in
  const userData = {
    uid: 'uid_demo',
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    email,
    plan: 'Pro',
    wordsUsed: 3420,
    wordsLimit: 10000,
    planExpiry: new Date(Date.now() + 18 * 86400000).toISOString(),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('saleiq_user', JSON.stringify(userData));

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect') || 'dashboard.html';
  showToast('Welcome back!', 'success');
  setTimeout(() => window.location.href = redirect, 1000);
}

// ── Forgot Password ─────────────────────────────────────────
function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  if (!email) return showToast('Please enter your email.', 'error');

  // Simulate Firebase: firebase.auth().sendPasswordResetEmail(email)
  showToast('Reset link sent to ' + email, 'success');
  setTimeout(() => window.location.href = 'login.html', 2000);
}

// ── Password Visibility Toggle ──────────────────────────────
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

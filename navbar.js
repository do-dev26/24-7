function renderNavbar(activePage = '') {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const isLoggedIn = localStorage.getItem('saleiq_user') !== null;
  nav.innerHTML = `
    <nav style="
      position:fixed;top:0;left:0;right:0;z-index:500;
      height:57px;background:rgba(255,255,255,0.95);
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border-bottom:1px solid #e5e5e6;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 24px;
    ">
      <a href="index.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;">
        <div style="width:28px;height:28px;border-radius:7px;background:#10a37f;display:flex;align-items:center;justify-content:center;">
          <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <span style="font-size:15px;font-weight:600;color:#0d0d0d;letter-spacing:-0.02em;">SaleIQ</span>
      </a>

      <div style="display:flex;align-items:center;gap:2px;">
        <a href="index.html" style="padding:6px 12px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;color:${activePage==='home'?'#0d0d0d':'#6b6b6b'};background:${activePage==='home'?'#f0f0f1':'transparent'};transition:all 0.12s;">Home</a>
        <a href="pricing.html" style="padding:6px 12px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;color:${activePage==='pricing'?'#0d0d0d':'#6b6b6b'};background:${activePage==='pricing'?'#f0f0f1':'transparent'};transition:all 0.12s;">Pricing</a>
        <a href="support.html" style="padding:6px 12px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;color:${activePage==='support'?'#0d0d0d':'#6b6b6b'};background:${activePage==='support'?'#f0f0f1':'transparent'};transition:all 0.12s;">Support</a>
      </div>

      <div style="display:flex;align-items:center;gap:8px;">
        ${isLoggedIn ? `
          <a href="dashboard.html" style="display:inline-flex;align-items:center;gap:6px;background:#0d0d0d;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none;">Dashboard</a>
        ` : `
          <a href="login.html" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;color:#6b6b6b;text-decoration:none;border:1px solid #e5e5e6;background:#fff;transition:all 0.12s;">Log in</a>
          <a href="signup.html" style="display:inline-flex;align-items:center;background:#0d0d0d;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none;">Get started</a>
        `}
      </div>
    </nav>
    <div style="height:57px;"></div>
  `;
}

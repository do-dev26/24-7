// ============================================================
// SIDEBAR COMPONENT
// ============================================================
function renderSidebar(activeSection = 'overview') {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const user = JSON.parse(localStorage.getItem('saleiq_user') || '{}');
  const userName = user.name || 'User';
  const userEmail = user.email || '';
  const userPlan = user.plan || 'Basic';

  const navItems = [
    { id: 'overview', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`, label: 'Overview' },
    { id: 'leads', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, label: 'Leads' },
    { id: 'followups', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`, label: 'Follow-Ups' },
    { id: 'widget', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`, label: 'Widget Settings' },
    { id: 'billing', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`, label: 'Billing' },
  ];

  sidebar.innerHTML = `
    <div class="sidebar">
      <!-- Logo -->
      <div style="padding:20px 16px 16px;border-bottom:1px solid var(--border);">
        <a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent3));display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:17px;">Sale<span style="color:var(--accent)">IQ</span></span>
        </a>
      </div>

      <!-- Nav -->
      <nav style="padding:12px 10px;flex:1;overflow-y:auto;">
        <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);padding:4px 6px 10px;">Main Menu</p>
        ${navItems.map(item => `
          <button
            class="sidebar-nav-item ${activeSection === item.id ? 'active' : ''}"
            onclick="switchSection('${item.id}')"
          >
            ${item.icon}
            ${item.label}
          </button>
        `).join('')}
      </nav>

      <!-- User card -->
      <div style="padding:12px 10px;border-top:1px solid var(--border);">
        <div style="background:var(--surface2);border-radius:10px;padding:12px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;flex-shrink:0;">
              ${userName.charAt(0).toUpperCase()}
            </div>
            <div style="overflow:hidden;">
              <p style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${userName}</p>
              <p style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${userEmail}</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span class="badge badge-accent" style="font-size:11px;">${userPlan} Plan</span>
            <button onclick="handleLogout()" style="font-size:12px;color:var(--muted);background:none;border:none;cursor:pointer;transition:color 0.15s;" onmouseover="this.style.color='var(--danger)'" onmouseout="this.style.color='var(--muted)'">Logout</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile toggle -->
    <button id="sidebar-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')" style="
      display:none;position:fixed;top:16px;left:16px;z-index:200;
      background:var(--surface);border:1px solid var(--border);
      border-radius:8px;padding:8px;cursor:pointer;
    ">
      <svg width="20" height="20" fill="none" stroke="var(--text)" stroke-width="2" viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  `;
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('saleiq_user');
    window.location.href = 'login.html';
  }
}

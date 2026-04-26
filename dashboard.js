// ============================================================
// DASHBOARD.JS — All dashboard logic
// ============================================================

// ── Sample Data ─────────────────────────────────────────────
let leads = [
  { id: 1, name: 'Priya Sharma', email: 'priya@techco.in', phone: '+91 98765 43210', message: 'Interested in Pro plan for our e-commerce site', status: 'converted', date: '2025-04-15' },
  { id: 2, name: 'James Walker', email: 'j.walker@growth.io', phone: '+1 415 555 0132', message: 'Need AI agent for SaaS sales page', status: 'contacted', date: '2025-04-16' },
  { id: 3, name: 'Fatima Al-Hassan', email: 'fatima@venturex.com', phone: '+971 50 123 4567', message: 'Evaluating for enterprise team', status: 'new', date: '2025-04-17' },
  { id: 4, name: 'Carlos Mejia', email: 'cmejia@launchpad.mx', phone: '+52 55 1234 5678', message: 'Wants demo before deciding', status: 'new', date: '2025-04-17' },
  { id: 5, name: 'Yuki Tanaka', email: 'yuki@bytegrowth.jp', phone: '+81 90 1234 5678', message: 'Basic plan for startup website', status: 'contacted', date: '2025-04-18' },
  { id: 6, name: 'Sophie Müller', email: 's.muller@nextstep.de', phone: '+49 151 12345678', message: 'Looking for affordable option', status: 'converted', date: '2025-04-18' },
];

let followups = [
  { id: 1, name: 'Fatima Al-Hassan', date: '2025-04-18', status: 'overdue', notes: 'Send enterprise pricing deck' },
  { id: 2, name: 'Carlos Mejia', date: '2025-04-19', status: 'today', notes: 'Schedule product demo call' },
  { id: 3, name: 'James Walker', date: '2025-04-19', status: 'today', notes: 'Follow up on Pro trial signup' },
  { id: 4, name: 'Yuki Tanaka', date: '2025-04-20', status: 'upcoming', notes: 'Send case studies' },
  { id: 5, name: 'Priya Sharma', date: '2025-04-10', status: 'done', notes: 'Onboarding complete ✅' },
];

let selectedColor = '#6c63ff';

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  renderSidebar('overview');
  initOverview(user);
  renderLeads();
  renderFollowups();
  updateEmbedCode();
});

// ── Section Switcher ─────────────────────────────────────────
function switchSection(id) {
  document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('sec-' + id);
  if (target) target.classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${id}'`));
  });

  // Close mobile sidebar
  document.querySelector('.sidebar')?.classList.remove('open');
}

// ── Overview ─────────────────────────────────────────────────
function initOverview(user) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = user.name?.split(' ')[0] || 'there';
  const el = document.getElementById('welcome-text');
  if (el) el.textContent = `${greeting}, ${name} 👋`;

  // Words usage
  const used = user.wordsUsed || 3420;
  const limit = user.wordsLimit || 10000;
  const pct = Math.round((used / limit) * 100);

  const wBar = document.getElementById('words-bar');
  const wLabel = document.getElementById('words-label');
  const wStat = document.getElementById('stat-words');
  if (wBar) wBar.style.width = pct + '%';
  if (wLabel) wLabel.textContent = `${used.toLocaleString()} / ${limit.toLocaleString()} used`;
  if (wStat) wStat.textContent = used.toLocaleString();

  // Plan expiry
  if (user.planExpiry) {
    const days = Math.max(0, Math.floor((new Date(user.planExpiry) - Date.now()) / 86400000));
    const expiryEl = document.getElementById('stat-expiry');
    if (expiryEl) expiryEl.textContent = days + ' days';
  }

  // Billing
  const bPlan = document.getElementById('billing-plan-name');
  const bPrice = document.getElementById('billing-price');
  const bWords = document.getElementById('bill-words');
  const bBar = document.getElementById('bill-bar');
  const bExpiry = document.getElementById('billing-expiry');
  if (bPlan) bPlan.textContent = (user.plan || 'Pro') + ' Plan';
  if (bPrice) bPrice.textContent = user.plan === 'Basic' ? '$49/month' : '$79/month';
  if (bWords) bWords.textContent = `${(used).toLocaleString()} / ${limit.toLocaleString()}`;
  if (bBar) bBar.style.width = pct + '%';
  if (bExpiry && user.planExpiry) {
    bExpiry.textContent = new Date(user.planExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // Recent leads table
  renderRecentLeads();
}

// ── Leads ────────────────────────────────────────────────────
function renderLeads(filter = '') {
  const tbody = document.getElementById('leads-table');
  const recentTbody = document.getElementById('recent-leads-table');
  if (!tbody) return;

  const search = (document.getElementById('lead-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('status-filter')?.value || '';

  const filtered = leads.filter(l =>
    (!search || l.name.toLowerCase().includes(search) || l.email.toLowerCase().includes(search)) &&
    (!statusF || l.status === statusF)
  );

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted);">No leads found</td></tr>`
    : filtered.map(lead => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:9px;">
            <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">
              ${lead.name.charAt(0)}
            </div>
            <span style="font-weight:500;font-size:14px;">${lead.name}</span>
          </div>
        </td>
        <td style="font-size:13px;color:var(--muted);">${lead.email}</td>
        <td style="font-size:13px;color:var(--muted);">${lead.phone}</td>
        <td style="font-size:13px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);">${lead.message}</td>
        <td>
          <select onchange="updateLeadStatus(${lead.id}, this.value)" style="background:none;border:none;cursor:pointer;font-size:12px;font-weight:500;outline:none;" class="status-${lead.status}">
            <option value="new" ${lead.status==='new'?'selected':''}>🔵 New</option>
            <option value="contacted" ${lead.status==='contacted'?'selected':''}>🟡 Contacted</option>
            <option value="converted" ${lead.status==='converted'?'selected':''}>🟢 Converted</option>
          </select>
        </td>
        <td style="font-size:13px;color:var(--muted);">${formatDate(lead.date)}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button onclick="addFollowupForLead('${lead.name}')" style="background:rgba(108,99,255,0.1);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:11px;color:var(--accent);">Follow up</button>
            <button onclick="deleteLead(${lead.id})" style="background:rgba(255,107,107,0.1);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:11px;color:var(--danger);">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
}

function renderRecentLeads() {
  const tbody = document.getElementById('recent-leads-table');
  if (!tbody) return;
  tbody.innerHTML = leads.slice(0, 5).map(lead => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:27px;height:27px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${lead.name.charAt(0)}</div>
          <span style="font-size:13px;font-weight:500;">${lead.name}</span>
        </div>
      </td>
      <td style="font-size:12px;color:var(--muted);">${lead.email}</td>
      <td><span class="badge ${lead.status==='new'?'badge-accent':lead.status==='contacted'?'badge-warning':'badge-success'}" style="font-size:11px;">${lead.status}</span></td>
      <td style="font-size:12px;color:var(--muted);">${formatDate(lead.date)}</td>
    </tr>
  `).join('');
  const stat = document.getElementById('stat-leads');
  if (stat) stat.textContent = leads.length;
}

function filterLeads() { renderLeads(); }

function updateLeadStatus(id, status) {
  const lead = leads.find(l => l.id === id);
  if (lead) { lead.status = status; showToast('Status updated', 'success'); renderRecentLeads(); }
}

function deleteLead(id) {
  if (!confirm('Delete this lead?')) return;
  leads = leads.filter(l => l.id !== id);
  renderLeads();
  renderRecentLeads();
  showToast('Lead deleted', 'success');
}

function openAddLeadModal() {
  document.getElementById('add-lead-modal').classList.add('open');
}

function addLead(e) {
  e.preventDefault();
  const name = document.getElementById('new-name').value.trim();
  const email = document.getElementById('new-email').value.trim();
  const phone = document.getElementById('new-phone').value.trim();
  const message = document.getElementById('new-message').value.trim();
  leads.unshift({ id: Date.now(), name, email, phone: phone || '—', message: message || '—', status: 'new', date: new Date().toISOString().split('T')[0] });
  closeModal('add-lead-modal');
  renderLeads();
  renderRecentLeads();
  showToast('Lead added!', 'success');
  e.target.reset();
}

function exportLeads() {
  const rows = [['Name', 'Email', 'Phone', 'Message', 'Status', 'Date']];
  leads.forEach(l => rows.push([l.name, l.email, l.phone, l.message, l.status, l.date]));
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'saleiq-leads.csv';
  a.click();
  showToast('Leads exported!', 'success');
}

// ── Follow-Ups ────────────────────────────────────────────────
function renderFollowups() {
  const container = document.getElementById('followups-list');
  if (!container) return;

  const groups = {
    overdue: followups.filter(f => f.status === 'overdue'),
    today: followups.filter(f => f.status === 'today'),
    upcoming: followups.filter(f => f.status === 'upcoming'),
    done: followups.filter(f => f.status === 'done'),
  };

  const fuOv = document.getElementById('fu-overdue');
  const fuToday = document.getElementById('fu-today');
  const fuDone = document.getElementById('fu-done');
  if (fuOv) fuOv.textContent = groups.overdue.length;
  if (fuToday) fuToday.textContent = groups.today.length;
  if (fuDone) fuDone.textContent = groups.done.length;

  const renderGroup = (title, items, color) => {
    if (!items.length) return '';
    return `
      <div style="margin-bottom:24px;">
        <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${color};margin-bottom:12px;">${title} (${items.length})</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${items.map(f => `
            <div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid ${color};border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
              <div>
                <p style="font-size:15px;font-weight:600;margin-bottom:4px;">${f.name}</p>
                <p style="font-size:13px;color:var(--muted);">${f.notes}</p>
                <p style="font-size:12px;color:var(--muted);margin-top:4px;">📅 ${formatDate(f.date)}</p>
              </div>
              <div style="display:flex;gap:8px;">
                ${f.status !== 'done' ? `<button onclick="markFollowupDone(${f.id})" style="background:rgba(67,232,192,0.1);border:1px solid rgba(67,232,192,0.2);border-radius:8px;padding:7px 14px;font-size:12px;font-weight:500;color:var(--success);cursor:pointer;">✓ Done</button>` : ''}
                <button onclick="deleteFollowup(${f.id})" style="background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.15);border-radius:8px;padding:7px 14px;font-size:12px;font-weight:500;color:var(--danger);cursor:pointer;">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  container.innerHTML =
    renderGroup('🔴 Overdue', groups.overdue, 'var(--danger)') +
    renderGroup('🟡 Due Today', groups.today, 'var(--warning)') +
    renderGroup('🔵 Upcoming', groups.upcoming, 'var(--accent)') +
    renderGroup('✅ Completed', groups.done, 'var(--success)') ||
    `<div style="text-align:center;padding:60px;color:var(--muted);">No follow-ups yet. Add your first reminder!</div>`;
}

function openAddFollowupModal() {
  document.getElementById('add-followup-modal').classList.add('open');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fu-date').value = today;
}

function addFollowupForLead(name) {
  switchSection('followups');
  document.getElementById('add-followup-modal').classList.add('open');
  document.getElementById('fu-name').value = name;
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fu-date').value = today;
}

function addFollowup(e) {
  e.preventDefault();
  const name = document.getElementById('fu-name').value.trim();
  const date = document.getElementById('fu-date').value;
  const notes = document.getElementById('fu-notes').value.trim();
  const today = new Date().toISOString().split('T')[0];
  const status = date < today ? 'overdue' : date === today ? 'today' : 'upcoming';
  followups.unshift({ id: Date.now(), name, date, notes: notes || 'Follow up', status });
  closeModal('add-followup-modal');
  renderFollowups();
  showToast('Reminder added!', 'success');
  e.target.reset();
}

function markFollowupDone(id) {
  const f = followups.find(f => f.id === id);
  if (f) { f.status = 'done'; renderFollowups(); showToast('Marked as done!', 'success'); }
}

function deleteFollowup(id) {
  followups = followups.filter(f => f.id !== id);
  renderFollowups();
  showToast('Reminder deleted', 'success');
}

// ── Widget ────────────────────────────────────────────────────
function selectColor(color, el) {
  selectedColor = color;
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  // Update preview
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) prevBtn.style.background = color;
  updateEmbedCode();
}

function updateEmbedCode() {
  const name = document.getElementById('agent-name')?.value || 'Alex';
  const greeting = document.getElementById('agent-greeting')?.value || 'Hi!';
  const color = selectedColor;

  const code = document.getElementById('embed-code');
  if (code) {
    code.textContent = `<script
  src="https://cdn.saleiq.app/widget.js"
  data-key="sk_live_YOUR_KEY"
  data-agent="${name}"
  data-color="${color}"
  data-greeting="${greeting.substring(0, 80)}"
><\/script>`;
  }

  const prevName = document.getElementById('prev-name');
  if (prevName) prevName.textContent = name;
  const prevGreeting = document.getElementById('prev-greeting');
  if (prevGreeting) prevGreeting.textContent = greeting;
}

// Update preview live
['agent-name', 'agent-greeting'].forEach(id => {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(id)?.addEventListener('input', updateEmbedCode);
  });
});

function copyEmbedCode() {
  const code = document.getElementById('embed-code')?.textContent || '';
  navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success'));
}

function saveWidgetSettings() {
  showToast('Widget settings saved!', 'success');
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

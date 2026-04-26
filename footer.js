function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <footer style="background:#f7f7f8;border-top:1px solid #e5e5e6;padding:52px 24px 32px;margin-top:80px;">
      <div style="max-width:1080px;margin:0 auto;">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:40px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <div style="width:26px;height:26px;border-radius:6px;background:#10a37f;display:flex;align-items:center;justify-content:center;">
                <svg width="13" height="13" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style="font-size:15px;font-weight:600;color:#0d0d0d;">SaleIQ</span>
            </div>
            <p style="font-size:14px;color:#6b6b6b;line-height:1.7;max-width:240px;">AI-powered sales agent that captures leads and converts visitors 24/7.</p>
          </div>
          <div>
            <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#ababab;margin-bottom:14px;">Product</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <a href="pricing.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;transition:color 0.12s;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Pricing</a>
              <a href="dashboard.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Dashboard</a>
              <a href="support.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Support</a>
            </div>
          </div>
          <div>
            <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#ababab;margin-bottom:14px;">Legal</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <a href="term-condition.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Terms of Service</a>
              <a href="privacy.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Privacy Policy</a>
              <a href="refund.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Refund Policy</a>
            </div>
          </div>
          <div>
            <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#ababab;margin-bottom:14px;">Account</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <a href="login.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Log In</a>
              <a href="signup.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Sign Up</a>
              <a href="forgot-password.html" style="color:#6b6b6b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#0d0d0d'" onmouseout="this.style.color='#6b6b6b'">Reset Password</a>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid #e5e5e6;padding-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <p style="color:#ababab;font-size:13px;">© 2025 SaleIQ. All rights reserved.</p>
          <p style="color:#ababab;font-size:13px;">Built for modern sales teams.</p>
        </div>
      </div>
    </footer>
  `;
}

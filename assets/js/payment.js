// ============================================================
// payment.js — Razorpay Integration
// CDN add karo pricing.html + dashboard.html mein:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
// ============================================================
import { auth } from './firebase-config.js';

// ── CONFIG ───────────────────────────────────────────────
const RAZORPAY_KEY = 'rzp_test_REPLACE_THIS'; // rzp_live_XXX production ke liye
const CLOUD_FN_URL = 'https://us-central1-saleiq-prod.cloudfunctions.net';

const PLANS = {
  basic: { amount: 4900,  label: 'Basic Plan — ₹49/month',  wordsLimit: 5000  },
  pro:   { amount: 7900,  label: 'Pro Plan — ₹79/month',    wordsLimit: 10000 }
};

// ── INITIATE PAYMENT ─────────────────────────────────────
window.initiatePayment = async function(plan) {
  const user = auth.currentUser;
  if (!user) { window.location.href = 'login.html'; return; }

  const planData = PLANS[plan];
  if (!planData) return showToast('Invalid plan', 'error');

  showToast('Opening payment...', 'info');

  try {
    // Step 1: Cloud Function se order create karo
    const token  = await user.getIdToken();
    const res    = await fetch(`${CLOUD_FN_URL}/createOrder`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body:    JSON.stringify({ plan, userId: user.uid })
    });
    const order = await res.json();
    if (!order.id) throw new Error('Order creation failed');

    // Step 2: Razorpay checkout open karo
    const options = {
      key:         RAZORPAY_KEY,
      amount:      order.amount,
      currency:    'INR',
      name:        'SaleIQ',
      description: planData.label,
      order_id:    order.id,
      image:       '/assets/images/logo.png',
      prefill: {
        name:  user.displayName || '',
        email: user.email       || '',
      },
      notes: { plan, userId: user.uid },
      theme: { color: '#10a37f' },

      handler: async function(response) {
        showToast('Verifying payment...', 'info');
        await verifyPayment(response, plan, user);
      },
      modal: {
        ondismiss: () => showToast('Payment cancelled', 'warning')
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', r => showToast('Payment failed: ' + r.error.description, 'error'));

  } catch (err) {
    showToast('Payment init failed: ' + err.message, 'error');
  }
};

// ── VERIFY PAYMENT ───────────────────────────────────────
async function verifyPayment(response, plan, user) {
  try {
    const token = await user.getIdToken();
    const res   = await fetch(`${CLOUD_FN_URL}/verifyPayment`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        razorpay_order_id:   response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature:  response.razorpay_signature,
        plan,
        userId: user.uid
      })
    });
    const result = await res.json();

    if (result.success) {
      showToast('🎉 Payment successful! Plan activated.', 'success');
      setTimeout(() => window.location.reload(), 1800);
    } else {
      showToast('Verification failed. Contact support.', 'error');
    }
  } catch (err) {
    showToast('Verification error: ' + err.message, 'error');
  }
}

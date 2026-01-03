/**
 * 🏦 STRIPE PAYMENT INTEGRATION
 * 
 * Bu dosya gerçek Stripe entegrasyonu için tam bir rehber ve kodları içerir.
 * 
 * KURULUM:
 * 1. npm install stripe
 * 2. Stripe hesabı aç: https://dashboard.stripe.com/register
 * 3. API anahtarlarını .env dosyasına ekle
 */

// ============================================
// .env DOSYASINA EKLENECEKLER:
// ============================================
/*
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
*/

// ============================================
// BACKEND - STRIPE ROUTES (server.js'e eklenecek)
// ============================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * 1️⃣ ÖDEME INTENT OLUŞTURMA
 * Client ödeme yapmak istediğinde çağrılır
 */
const createPaymentIntent = async (req, res) => {
  const { project_id, bid_id, amount } = req.body;
  const client_id = req.user.id;

  try {
    // Bid ve proje doğrulama (mevcut kodunuzdaki gibi)
    // ... validation logic ...

    // Stripe Payment Intent oluştur
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe kuruş cinsinden alır (100 = 1 dolar)
      currency: 'usd',
      metadata: {
        project_id: project_id.toString(),
        bid_id: bid_id.toString(),
        client_id: client_id.toString(),
        freelancer_id: bid.freelancer_id.toString()
      },
      // Otomatik ödeme yöntemleri
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Veritabanına PENDING kayıt ekle
    db.run(
      `INSERT INTO payments (project_id, bid_id, client_id, freelancer_id, amount, status, payment_method, transaction_id) 
       VALUES (?, ?, ?, ?, ?, 'PENDING', 'stripe', ?)`,
      [project_id, bid_id, client_id, bid.freelancer_id, amount, paymentIntent.id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 2️⃣ STRIPE WEBHOOK - Ödeme durumu güncellemesi
 * Stripe ödeme tamamlandığında bu endpoint'i çağırır
 */
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Event tipine göre işlem yap
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
  }

  res.json({ received: true });
};

async function handlePaymentSuccess(paymentIntent) {
  const { project_id, bid_id, freelancer_id } = paymentIntent.metadata;
  
  // Veritabanını güncelle
  db.run(
    `UPDATE payments SET status = 'SUCCESS', completed_at = CURRENT_TIMESTAMP WHERE transaction_id = ?`,
    [paymentIntent.id]
  );
  
  // Proje durumunu güncelle
  db.run(`UPDATE projects SET status = 'in_progress' WHERE id = ?`, [project_id]);
  
  // Freelancer'a bildirim gönder
  createNotification(
    freelancer_id,
    'payment',
    `💰 $${paymentIntent.amount / 100} ödeme alındı!`,
    project_id
  );
}

async function handlePaymentFailure(paymentIntent) {
  db.run(
    `UPDATE payments SET status = 'FAILED' WHERE transaction_id = ?`,
    [paymentIntent.id]
  );
}

/**
 * 3️⃣ ESCROW SİSTEMİ (Stripe Connect)
 * Para önce platformda tutulur, iş tamamlanınca freelancer'a aktarılır
 */
const createEscrowPayment = async (req, res) => {
  const { amount, freelancer_stripe_account_id } = req.body;
  
  // Platform komisyonu (%10)
  const platformFee = Math.round(amount * 0.10);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    // Para freelancer'ın Stripe Connect hesabına gidecek
    transfer_data: {
      destination: freelancer_stripe_account_id,
    },
    // Platform komisyonu
    application_fee_amount: platformFee * 100,
    // Ödemeyi beklet (escrow)
    capture_method: 'manual',
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
};

/**
 * 4️⃣ ESCROW RELEASE - İş tamamlandığında parayı serbest bırak
 */
const releaseEscrow = async (req, res) => {
  const { payment_intent_id } = req.body;
  
  try {
    // Bekleyen ödemeyi yakala (freelancer'a aktar)
    const paymentIntent = await stripe.paymentIntents.capture(payment_intent_id);
    
    res.json({ 
      success: true, 
      message: 'Ödeme freelancer\'a aktarıldı',
      amount: paymentIntent.amount / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 5️⃣ FREELANCER STRIPE CONNECT HESABI OLUŞTURMA
 * Freelancer'ların ödeme alabilmesi için
 */
const createFreelancerAccount = async (req, res) => {
  const { freelancer_id, email } = req.body;
  
  try {
    // Stripe Connect hesabı oluştur
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // veya 'TR' Türkiye için
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    
    // Freelancer'ın account ID'sini kaydet
    db.run(
      `UPDATE users SET stripe_account_id = ? WHERE id = ?`,
      [account.id, freelancer_id]
    );
    
    // Onboarding linki oluştur
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/stripe/refresh`,
      return_url: `${process.env.FRONTEND_URL}/stripe/success`,
      type: 'account_onboarding',
    });
    
    res.json({ url: accountLink.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// EXPRESS ROUTES
// ============================================
/*
// server.js'e eklenecek routes:

// Raw body for Stripe webhooks
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook);

// Payment endpoints
app.post('/api/payments/create-intent', authMiddleware, roleCheck(['client']), createPaymentIntent);
app.post('/api/payments/escrow/release', authMiddleware, roleCheck(['client']), releaseEscrow);
app.post('/api/freelancer/stripe-connect', authMiddleware, roleCheck(['freelancer']), createFreelancerAccount);
*/

module.exports = {
  createPaymentIntent,
  stripeWebhook,
  createEscrowPayment,
  releaseEscrow,
  createFreelancerAccount
};

# 🏦 Stripe Ödeme Sistemi Kurulum Rehberi

## Adım 1: Stripe Hesabı Oluştur

1. [Stripe Dashboard](https://dashboard.stripe.com/register) adresine git
2. Hesap oluştur (ücretsiz)
3. Test mode'da başla (gerçek para geçmez)

## Adım 2: API Anahtarlarını Al

1. Stripe Dashboard → Developers → API Keys
2. Şu anahtarları kopyala:
   - `Publishable key` (pk_test_...)
   - `Secret key` (sk_test_...)

## Adım 3: Backend Kurulumu

```bash
cd backend
npm install stripe
```

`.env` dosyasına ekle:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## Adım 4: Frontend Kurulumu

```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/stripe-js
```

`.env` dosyasına ekle:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

## Adım 5: Webhook Kurulumu (Önemli!)

Stripe ödemelerin durumunu webhook ile bildirir.

### Lokal Test için:
```bash
# Stripe CLI indir: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

### Production için:
1. Stripe Dashboard → Developers → Webhooks
2. "Add endpoint" tıkla
3. URL: `https://your-domain.com/api/stripe/webhook`
4. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 💳 Test Kartları

| Senaryo | Kart Numarası | Sonuç |
|---------|---------------|-------|
| Başarılı | 4242 4242 4242 4242 | ✅ Ödeme başarılı |
| Yetersiz bakiye | 4000 0000 0000 9995 | ❌ Reddedilir |
| 3D Secure | 4000 0000 0000 3220 | 🔐 Doğrulama gerekir |
| Expired | 4000 0000 0000 0069 | ❌ Kartın süresi dolmuş |

> Son kullanma: Gelecek herhangi bir tarih (örn: 12/34)
> CVC: Herhangi 3 rakam (örn: 123)

## 🔄 Ödeme Akışı

```
Client "Öde" tıklar
        ↓
Frontend → Backend: /payments/create-intent
        ↓
Backend → Stripe: PaymentIntent oluştur
        ↓
Stripe → Backend: clientSecret döner
        ↓
Backend → Frontend: clientSecret
        ↓
Frontend: Stripe Elements ile kart bilgisi al
        ↓
Frontend → Stripe: confirmCardPayment(clientSecret)
        ↓
Stripe ödemeyi işler
        ↓
Stripe → Backend: Webhook (payment_intent.succeeded)
        ↓
Backend: DB güncelle, freelancer'a bildirim gönder
```

## 💰 Escrow Sistemi (İsteğe Bağlı)

Freelance marketplace için ideal: Para önce platformda tutulur, iş tamamlanınca freelancer'a aktarılır.

### Stripe Connect ile Escrow:

1. Freelancer'lar Stripe Connect hesabı açar
2. Client ödeme yapar → Para Stripe'da tutulur
3. İş tamamlanınca → "Release" ile freelancer'a aktarılır

```javascript
// Ödemeyi beklet
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100
  currency: 'usd',
  capture_method: 'manual', // Otomatik çekme
});

// İş tamamlandığında serbest bırak
await stripe.paymentIntents.capture(paymentIntentId);
```

## 🇹🇷 Türkiye için Alternatif: iyzico

```bash
npm install iyzipay
```

```javascript
const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  uri: 'https://sandbox-api.iyzipay.com' // Test için
});
```

## 📊 Komisyon Yapısı

Stripe ücretleri (ABD):
- %2.9 + $0.30 per transaction
- Connect için +%0.25

Platform komisyonu ekle:
```javascript
const platformFee = amount * 0.10; // %10 platform komisyonu

const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100,
  currency: 'usd',
  application_fee_amount: platformFee * 100,
  transfer_data: {
    destination: freelancerStripeAccountId,
  },
});
```

## ✅ Production Checklist

- [ ] Stripe hesabını "Live" moda geçir
- [ ] Gerçek API anahtarlarını kullan (sk_live_..., pk_live_...)
- [ ] Webhook endpoint'ini production URL ile güncelle
- [ ] SSL sertifikası (HTTPS zorunlu)
- [ ] PCI DSS uyumluluğu (Stripe Elements kullanarak otomatik)
- [ ] Hata loglama ekle
- [ ] Refund (iade) işlevselliği ekle

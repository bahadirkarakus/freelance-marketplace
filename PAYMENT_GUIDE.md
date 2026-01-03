# 💳 Ödeme Sistemi Rehberi

## 🎯 Ödeme Nasıl Yapılır?

### **ADIM 1: Proje Oluştur (Client)**
1. **Client** olarak giriş yap
2. **"Add New Project"** butonuna tıkla
3. Proje detaylarını doldur:
   - Title, Description, Budget, Duration, Category
4. Projeyi oluştur

---

### **ADIM 2: Bid (Teklif) Ver (Freelancer)**
1. **Freelancer** olarak giriş yap
2. **Projects** sayfasına git
3. Bir projeye tıkla
4. **"Submit Proposal"** butonuna tıkla
5. Teklif detaylarını gir:
   - Amount (teklif tutarı)
   - Delivery Time (kaç günde teslim)
   - Proposal (teklif mesajı)
6. Teklifi gönder

---

### **ADIM 3: Teklifi Kabul Et (Client)**
1. **Client** olarak giriş yap
2. Kendi projena git
3. Gelen teklifleri gör
4. Beğendiğin teklife **"Accept Bid"** tıkla
5. ✅ Proje durumu **"Accepted"** olur

---

### **ADIM 4: ÖDEME YAP 💰** (Burada başlıyor!)

#### 4.1 Ödeme Butonu Görünür
- Client projeye girdiğinde **"Pay Freelancer $XXX"** butonu görünür
- Bu buton **sadece accepted bid'ler için** çıkar

#### 4.2 Payment Modal Açılır
1. **"Pay Freelancer"** butonuna tıkla
2. Ödeme modalı açılır:
   - ✅ Cüzdan bakiyeni görürsün
   - ✅ Ödenecek tutarı görürsün
   - ✅ Freelancer bilgisi
   - ✅ Güvenlik bildirimi

#### 4.3 Bakiye Kontrolü
```
Bakiye Yeterli ✅  → Ödeme yapılabilir
Bakiye Yetersiz ❌ → "Add funds" butonu çıkar
```

#### 4.4 Ödemeyi Onayla
1. **"Pay $XXX"** butonuna tıkla
2. **Processing** ekranı görünür:
   ```
   ⏳ Verifying payment details...
   ⏳ Processing payment...
   ⏳ Finalizing transaction...
   ```
3. **1.5 saniye** simülasyon (gerçekçi bekleme süresi)

#### 4.5 Başarılı Ödeme ✅
```
✅ Payment Successful! 🎉
- Funds transferred to freelancer
- Transaction ID: SIM_1735567890_abc123
- Status: ✓ Completed
```

---

## 🔐 Güvenlik Kontrolleri

Backend'de şu kontroller yapılır:

### 1️⃣ **Authorization Check**
```javascript
❌ Freelancer ödeme yapamaz (sadece client)
❌ Başkasının projesine ödeme yapılamaz
✅ Sadece proje sahibi ödeme yapabilir
```

### 2️⃣ **Business Rules**
```javascript
❌ Bid accepted değilse ödeme yapılamaz
❌ Zaten ödenmiş işe tekrar ödeme yapılamaz
✅ Sadece accepted bid'lere ödeme yapılır
```

### 3️⃣ **Validation**
```javascript
❌ Negatif tutar
❌ Eksik alan (project_id, bid_id, amount)
❌ Yetersiz bakiye
✅ Tüm validasyonlar geçilmeli
```

---

## 🔄 Backend Akışı

### Endpoint: `POST /api/payments/pay`

```javascript
// 1️⃣ STEP 1: Verify project ownership
const project = db.get("SELECT * FROM projects WHERE id = ? AND client_id = ?")
if (!project) return 403 "Authorization failed"

// 2️⃣ STEP 2: Verify bid is accepted
const bid = db.get("SELECT * FROM bids WHERE id = ? AND status = 'accepted'")
if (!bid) return 400 "Business rule violation"

// 3️⃣ STEP 3: Check duplicate payment
const existingPayment = db.get("SELECT * FROM payments WHERE status = 'SUCCESS'")
if (existingPayment) return 400 "Duplicate payment prevented"

// 4️⃣ STEP 4: Create PENDING record
db.run("INSERT INTO payments (...) VALUES (..., 'PENDING')")

// 5️⃣ STEP 5: Simulate processing (1.5s)
await sleep(1500)

// 6️⃣ STEP 6: Mark as SUCCESS
db.run("UPDATE payments SET status = 'SUCCESS'")

// 7️⃣ STEP 7: Update project status
db.run("UPDATE projects SET status = 'in_progress'")

// 8️⃣ STEP 8: Transfer funds
db.run("UPDATE users SET balance = balance - ? WHERE id = ?", client_id)
db.run("UPDATE users SET balance = balance + ? WHERE id = ?", freelancer_id)

// 9️⃣ STEP 9: Notify freelancer
createNotification(freelancer_id, "payment", "💰 Payment received!")
```

---

## 📊 Database İşlemleri

### `payments` tablosu:
```sql
id              INTEGER PRIMARY KEY
project_id      INTEGER (FK)
bid_id          INTEGER (FK)
client_id       INTEGER (FK)
freelancer_id   INTEGER (FK)
amount          REAL
status          TEXT (PENDING → SUCCESS)
payment_method  TEXT ('simulated')
transaction_id  TEXT (SIM_timestamp_random)
created_at      DATETIME
completed_at    DATETIME
```

### Örnek Payment Kaydı:
```json
{
  "id": 1,
  "project_id": 5,
  "bid_id": 12,
  "client_id": 2,
  "freelancer_id": 7,
  "amount": 500,
  "status": "SUCCESS",
  "payment_method": "simulated",
  "transaction_id": "SIM_1735567890_abc123",
  "created_at": "2025-12-30 10:30:00",
  "completed_at": "2025-12-30 10:30:01.5"
}
```

---

## 🎨 UI/UX Özellikleri

### Payment Modal States:

1. **IDLE (Hazır)** 💤
   - Balance display
   - Payment details
   - "Pay" ve "Cancel" butonları

2. **PROCESSING (İşleniyor)** ⏳
   - Animasyonlu spinner
   - Progress bar
   - Stage mesajları

3. **SUCCESS (Başarılı)** ✅
   - Yeşil tick icon (bounce animation)
   - Transaction ID
   - Updated balance
   - "Done" butonu

4. **FAILED (Başarısız)** ❌
   - Kırmızı X icon
   - Error message
   - "Try Again" butonu

---

## 🧪 Test Senaryosu

### Başarılı Ödeme:
```bash
1. Client login (email: client@test.com, password: password)
2. Cüzdana para ekle (/api/wallet/deposit) → +1000$
3. Freelancer login (freelancer@test.com)
4. Projeye bid ver → 500$
5. Client tekrar login
6. Bid'i accept et
7. "Pay Freelancer $500" butonuna bas
8. Modal açılır → "Pay $500" bas
9. ✅ SUCCESS! Transaction ID alırsın
```

### Yetersiz Bakiye:
```bash
1. Client login
2. Bakiye: 100$ (ama bid 500$)
3. "Pay" butonuna bas
4. ⚠️ "Insufficient balance!" mesajı
5. "Add funds" butonu çıkar
```

### Duplicate Payment:
```bash
1. İlk ödeme yapılır → SUCCESS
2. Tekrar "Pay" butonuna bas
3. ❌ Error: "Duplicate payment prevented"
```

---

## 📱 Canlı Demo

1. Frontend: http://localhost:3002
2. Backend: http://localhost:3001

### Test Users:
```javascript
// Client
email: client@test.com
password: password
balance: 5000$ (eklenebilir)

// Freelancer  
email: freelancer@test.com
password: password
balance: 0$ (başlangıç)
```

---

## 💡 İpuçları

✅ **Ödeme sadece client yapabilir** (freelancer ödeme yapamaz)  
✅ **Bid accepted olmalı** (pending bid'e ödeme yapılamaz)  
✅ **Bir kere ödeme yapılır** (duplicate prevention)  
✅ **Bakiye yeterli olmalı** (yetersizse uyarı çıkar)  
✅ **Processing 1.5s sürer** (gerçekçi deneyim)  

---

## 🚀 Sonuç

Sisteminiz:
- ✅ Backend validation (3 katmanlı güvenlik)
- ✅ Real processing flow (PENDING → SUCCESS)
- ✅ Professional UI/UX (loading states, animations)
- ✅ Error handling (try again, duplicate prevention)
- ✅ Transaction tracking (unique IDs)
- ✅ Notification system (freelancer bildirim alır)

**DEMO'ya hazır!** 🎉

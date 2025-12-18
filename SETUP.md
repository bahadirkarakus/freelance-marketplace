# 🚀 Freelance Marketplace - Kurulum Rehberi

## 📋 Gereksinimler

- **Node.js** (v14 veya üzeri) - [nodejs.org](https://nodejs.org)
- **npm** (Node.js ile birlikte gelir)

## 🔧 Kurulum Adımları

### 1️⃣ Backend Kurulumu

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
node server.js
```

Backend **http://localhost:4000** adresinde çalışacak.

### 2️⃣ Frontend Kurulumu

**YENİ BİR TERMINAL AÇIN** ve şu komutları çalıştırın:

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm start
```

Frontend **http://localhost:3001** adresinde çalışacak ve otomatik olarak tarayıcıda açılacak.

## 🎯 Test Hesapları

Proje otomatik olarak demo veriler ve test hesapları oluşturur:

### 👤 Client (İş Veren) Hesapları
- **Email:** client1@demo.com | **Şifre:** demo123
- **Email:** client2@demo.com | **Şifre:** demo123

### 💼 Freelancer Hesapları
- **Email:** freelancer1@demo.com | **Şifre:** demo123
- **Email:** freelancer2@demo.com | **Şifre:** demo123
- **Email:** freelancer3@demo.com | **Şifre:** demo123

## 🌟 Özellikler

### ✅ Tamamlanan Özellikler

1. **Kullanıcı Yönetimi**
   - JWT kimlik doğrulama
   - Bcrypt şifre hashleme
   - Client ve Freelancer rolleri

2. **Proje Yönetimi**
   - Proje oluşturma ve listeleme
   - Dosya yükleme (Multer)
   - Sayfalama (9 proje/sayfa)
   - Proje detayları
   - Durum yönetimi (Open, In Progress, Completed, Cancelled)

3. **Teklif Sistemi**
   - Teklif gönderme
   - Teklif kabul/red
   - Teklif geçmişi
   - Otomatik durum güncellemeleri

4. **İnceleme & Değerlendirme**
   - 5 yıldız değerlendirme sistemi
   - Yorum ekleme
   - Ortalama puan hesaplama
   - Profilde görüntüleme

5. **Gerçek Zamanlı Mesajlaşma**
   - Socket.IO ile anlık mesajlaşma
   - Online kullanıcı takibi
   - Mesaj geçmişi

6. **Dashboard & Analytics**
   - Chart.js ile görselleştirme
   - Client dashboard (proje istatistikleri, teklif analizi)
   - Freelancer dashboard (kazanç, başarı oranı, performans)
   - Aylık trend grafikleri

7. **Modern UI/UX**
   - Gradient tasarımlar
   - Glassmorphism efektleri
   - Responsive tasarım
   - React Hot Toast bildirimleri

## 📁 Proje Yapısı

```
freelance-marketplace/
├── backend/
│   ├── server.js           # Ana sunucu dosyası
│   ├── package.json        # Backend bağımlılıkları
│   ├── database.db         # SQLite veritabanı (otomatik oluşur)
│   ├── uploads/            # Yüklenen dosyalar (otomatik oluşur)
│   └── .env               # Ortam değişkenleri (opsiyonel)
│
└── frontend/
    ├── src/
    │   ├── components/    # React bileşenleri
    │   ├── pages/         # Sayfa bileşenleri
    │   ├── context/       # Context API
    │   └── utils/         # Yardımcı fonksiyonlar
    ├── package.json       # Frontend bağımlılıkları
    └── public/            # Statik dosyalar
```

## 🛠️ Kullanılan Teknolojiler

### Backend
- Node.js & Express.js
- SQLite3 (Veritabanı)
- JWT (Kimlik doğrulama)
- Bcrypt (Şifre hashleme)
- Socket.IO (Gerçek zamanlı iletişim)
- Multer (Dosya yükleme)

### Frontend
- React 19.2.1
- React Router DOM
- Chart.js & react-chartjs-2
- Axios
- Socket.IO Client
- React Hot Toast
- Tailwind CSS 3.4.1

## ⚠️ Önemli Notlar

1. **Backend'i önce başlatın**, sonra frontend'i başlatın.
2. İlk çalıştırmada veritabanı otomatik olarak oluşturulur ve demo veriler eklenir.
3. Eğer veritabanını sıfırlamak isterseniz, `backend/database.db` dosyasını silin ve sunucuyu yeniden başlatın.
4. `uploads/` klasörü ilk dosya yüklendiğinde otomatik oluşur.

## 🐛 Sorun Giderme

### Port Zaten Kullanımda
Eğer "Port already in use" hatası alırsanız:

**Windows için:**
```bash
# Port 4000'i kullanan process'i bul ve kapat
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# Port 3001'i kullanan process'i bul ve kapat
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### npm install Hataları
Eğer `npm install` sırasında hata alırsanız:
```bash
# npm cache'i temizle
npm cache clean --force

# Tekrar dene
npm install
```

## 📞 İletişim

Herhangi bir sorun yaşarsanız veya sorularınız varsa benimle iletişime geçebilirsiniz.

---

**İyi Kodlamalar! 🚀**

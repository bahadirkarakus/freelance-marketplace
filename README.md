# Freelance Talent Marketplace

Tam özellikli bir freelance marketplace platformu. Client'lar proje oluşturabilir, freelancer'lar teklif verebilir.

## 🚀 Teknolojiler

### Backend
- **Node.js + Express** - REST API
- **SQLite3** - Database
- **CORS** - Cross-origin requests

### Frontend
- **React 19** - UI framework
- **React Router** - Sayfa yönlendirme
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Context API** - State management

## 📦 Kurulum

### Backend Kurulum
```bash
cd backend
npm install
node server.js
```
Backend http://localhost:4000 üzerinde çalışacak.

### Frontend Kurulum
```bash
cd frontend
npm install
npm start
```
Frontend http://localhost:3000 üzerinde çalışacak.

## ✨ Özellikler

### Kullanıcı Özellikleri
- ✅ Kayıt olma (Client veya Freelancer olarak)
- ✅ Giriş yapma
- ✅ Profil düzenleme
- ✅ Dashboard

### Client Özellikleri
- ✅ Proje oluşturma
- ✅ Proje yönetimi
- ✅ Teklifleri görüntüleme
- ✅ Teklif kabul etme
- ✅ Freelancer atama

### Freelancer Özellikleri
- ✅ Projeleri görüntüleme
- ✅ Projelere teklif verme
- ✅ Kendi tekliflerini takip etme
- ✅ Beceri ve ücret bilgisi ekleme
- ✅ Rating sistemi

### Genel Özellikler
- ✅ Proje listeleme ve filtreleme
- ✅ Freelancer profilleri
- ✅ Kategori bazlı arama
- ✅ Durum takibi (open, in_progress, completed)
- ✅ Responsive tasarım
- ✅ Modern UI/UX

## 📁 Database Şeması

### Users
- id, email, password, name, user_type (client/freelancer)
- bio, skills, hourly_rate, rating

### Projects
- id, title, description, budget, duration, category
- status (open/in_progress/completed/cancelled)
- client_id, freelancer_id

### Bids
- id, project_id, freelancer_id
- amount, delivery_time, proposal
- status (pending/accepted/rejected)

### Reviews
- id, project_id, reviewer_id, reviewee_id
- rating (1-5), comment

## 🎯 API Endpoints

### Auth
- POST `/api/auth/register` - Kayıt
- POST `/api/auth/login` - Giriş

### Users
- GET `/api/freelancers` - Tüm freelancer'lar
- GET `/api/users/:id` - Kullanıcı profili
- PUT `/api/users/:id` - Profil güncelleme
- GET `/api/users/:id/projects` - Kullanıcının projeleri
- GET `/api/users/:id/bids` - Freelancer'ın teklifleri
- GET `/api/users/:id/reviews` - Kullanıcı yorumları

### Projects
- POST `/api/projects` - Proje oluştur
- GET `/api/projects` - Tüm projeler (filtreleme: status, category)
- GET `/api/projects/:id` - Proje detay
- PUT `/api/projects/:id` - Proje güncelle
- DELETE `/api/projects/:id` - Proje sil
- GET `/api/projects/:id/bids` - Proje teklifleri

### Bids
- POST `/api/bids` - Teklif ver
- PUT `/api/bids/:id` - Teklif durumu güncelle (kabul/red)

### Reviews
- POST `/api/reviews` - Yorum yaz

## 🔐 Authentication

LocalStorage kullanılarak basit authentication yapılmıştır. Production'da JWT kullanılması önerilir.

## 🎨 Sayfalar

1. **Home** - Ana sayfa ve hero section
2. **Login/Register** - Kullanıcı girişi ve kaydı
3. **Projects** - Proje listeleme ve filtreleme
4. **Project Detail** - Proje detayları ve teklif verme
5. **Create Project** - Yeni proje oluşturma
6. **Freelancers** - Freelancer listesi
7. **Dashboard** - Kullanıcı dashboard'u
8. **Profile** - Profil düzenleme

## 🚀 Başlarken

1. Backend'i başlat: `cd backend && node server.js`
2. Frontend'i başlat: `cd frontend && npm start`
3. http://localhost:3000 adresini ziyaret et
4. Kayıt ol ve kullanmaya başla!

## 📝 Notlar

- Database otomatik olarak oluşturulur (SQLite)
- İlk kullanımda kullanıcı ve proje oluşturmanız gerekir
- Client hesabıyla proje oluşturabilir, freelancer hesabıyla teklif verebilirsiniz

# 🚀 FreelanceHub Backend API Documentation

## 📋 Genel Bakış
Node.js ve Express ile geliştirilmiş RESTful API. SQLite veritabanı kullanır, JWT authentication içerir.

## 🗂️ Proje Yapısı
```
backend/
├── server.js              # Ana backend dosyası (tüm API endpoints)
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── upload.js         # Multer file upload middleware
├── uploads/              # Yüklenen dosyalar (profil resimleri)
├── database.db           # SQLite veritabanı
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## 🔧 Kurulum ve Çalıştırma

### 1. Gerekli Paketleri Yükle
```bash
cd backend
npm install
```

### 2. Environment Variables (.env dosyası)
```
PORT=4000
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
```

### 3. Server'ı Başlat
```bash
node server.js
```

Server http://localhost:4000 adresinde çalışacak.

## 📦 Kullanılan Teknolojiler

- **express** (5.2.1) - Web framework
- **sqlite3** - Veritabanı
- **bcryptjs** - Şifre hashleme
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **multer** - File upload
- **socket.io** - Real-time messaging
- **cors** - Cross-origin resource sharing

## 🗄️ Veritabanı Şeması

### Users Tablosu
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT CHECK(user_type IN ('client', 'freelancer')),
  bio TEXT,
  skills TEXT,
  hourly_rate REAL,
  rating REAL DEFAULT 0,
  profile_picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Projects Tablosu
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget REAL NOT NULL,
  duration TEXT,
  category TEXT,
  status TEXT DEFAULT 'open',
  client_id INTEGER NOT NULL,
  freelancer_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
)
```

### Bids Tablosu
```sql
CREATE TABLE bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  freelancer_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  delivery_time TEXT,
  proposal TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
)
```

### Reviews Tablosu
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  reviewee_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Messages Tablosu
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔐 Authentication

### JWT Token Sistemi
- Token **7 gün** geçerli
- Header: `Authorization: Bearer <token>`
- Token payload: `{ id, email, user_type }`

### Protected Routes
`authMiddleware` ile korunan route'lar:
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- POST /api/bids
- PUT /api/bids/:id
- POST /api/reviews
- POST /api/messages
- PUT /api/users/:id

## 📡 API Endpoints

### 🔑 Authentication Routes

#### POST /api/auth/register
Yeni kullanıcı kaydı
```json
Request:
{
  "email": "user@example.com",
  "password": "123456",
  "name": "John Doe",
  "user_type": "client" | "freelancer",
  "bio": "...",
  "skills": "React, Node.js",
  "hourly_rate": 50
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": { "id": 1, "email": "...", "name": "...", "user_type": "..." }
}
```

#### POST /api/auth/login
Kullanıcı girişi
```json
Request:
{
  "email": "user@example.com",
  "password": "123456"
}

Response:
{
  "token": "jwt-token",
  "user": { "id": 1, "email": "...", "name": "...", "user_type": "..." }
}
```

### 👤 User Routes

#### GET /api/users/:id
Kullanıcı detayları
```json
Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "user_type": "freelancer",
  "bio": "...",
  "skills": "React, Node.js",
  "hourly_rate": 50,
  "rating": 4.5,
  "profile_picture": "/uploads/profile.jpg"
}
```

#### GET /api/freelancers?page=1&limit=12
Freelancer listesi (pagination)
```json
Response:
{
  "freelancers": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 12,
    "totalPages": 5
  }
}
```

#### PUT /api/users/:id (Protected)
Profil güncelleme

#### POST /api/users/:id/upload (Protected)
Profil resmi yükleme (Multer)

### 📝 Project Routes

#### GET /api/projects?page=1&limit=9&search=&category=
Proje listesi (pagination, search, filter)
```json
Response:
{
  "projects": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 9,
    "totalPages": 12
  }
}
```

#### GET /api/projects/:id
Proje detayı

#### POST /api/projects (Protected)
Yeni proje oluştur
```json
Request:
{
  "title": "E-commerce Website",
  "description": "...",
  "budget": 2500,
  "duration": "4 weeks",
  "category": "Web Design"
}
```

#### PUT /api/projects/:id (Protected)
Proje güncelle

#### DELETE /api/projects/:id (Protected)
Proje sil

### 💼 Bid Routes

#### POST /api/bids (Protected)
Teklif ver
```json
Request:
{
  "project_id": 1,
  "freelancer_id": 2,
  "amount": 2200,
  "delivery_time": "3 weeks",
  "proposal": "I have extensive experience..."
}
```

#### GET /api/projects/:id/bids
Projeye gelen teklifler

#### GET /api/users/:id/bids
Freelancer'ın verdiği teklifler

#### PUT /api/bids/:id (Protected)
Teklif kabul/red
```json
Request:
{
  "status": "accepted" | "rejected"
}
```
**Not:** Teklif kabul edildiğinde proje otomatik olarak "in_progress" statüsüne geçer.

### ⭐ Review Routes

#### POST /api/reviews (Protected)
Değerlendirme yap
```json
Request:
{
  "project_id": 1,
  "reviewee_id": 2,
  "rating": 5,
  "comment": "Excellent work!"
}
```

#### GET /api/reviews/:userId
Kullanıcının aldığı değerlendirmeler

#### GET /api/reviews/:userId/stats
Değerlendirme istatistikleri
```json
Response:
{
  "total_reviews": 15,
  "avg_rating": 4.5,
  "five_star": 10,
  "four_star": 3,
  "three_star": 2,
  "two_star": 0,
  "one_star": 0
}
```

### 💬 Message Routes

#### POST /api/messages (Protected)
Mesaj gönder
```json
Request:
{
  "receiver_id": 2,
  "content": "Hello, I'm interested in your project..."
}
```

#### GET /api/messages/conversations (Protected)
Sohbet listesi

#### GET /api/messages/:userId (Protected)
Belirli kullanıcı ile mesajlaşma

#### PUT /api/messages/:id/read (Protected)
Mesajı okundu olarak işaretle

## 🔌 Socket.IO Events

### Real-time Messaging
```javascript
// Connection
socket.on('connection', (socket) => {
  socket.on('user_connected', (userId) => {
    // Kullanıcı online
  });

  socket.on('send_message', (data) => {
    // Mesaj gönder
    io.to(receiverSocketId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // Kullanıcı offline
  });
});
```

## 📊 Demo Data

Server ilk çalıştırıldığında otomatik demo data eklenir:

### Demo Kullanıcılar
- **Client:** client1@demo.com / 123456
- **Freelancer 1:** freelancer1@demo.com / 123456 (Sarah Designer)
- **Freelancer 2:** freelancer2@demo.com / 123456 (Mike Developer)
- **Freelancer 3:** freelancer3@demo.com / 123456 (Emma Writer)

### 6 Örnek Proje
### 7 Örnek Bid

## 🛡️ Security Features

1. **Password Hashing:** bcrypt (10 salt rounds)
2. **JWT Authentication:** 7 günlük token
3. **Protected Routes:** authMiddleware
4. **File Upload Validation:** 5MB limit, image/document only
5. **SQL Injection Protection:** Prepared statements

## 🧪 API Test Örnekleri

### Postman / Thunder Client ile Test

1. **Register**
```
POST http://localhost:4000/api/auth/register
Body (JSON):
{
  "email": "test@test.com",
  "password": "123456",
  "name": "Test User",
  "user_type": "freelancer"
}
```

2. **Login**
```
POST http://localhost:4000/api/auth/login
Body (JSON):
{
  "email": "test@test.com",
  "password": "123456"
}
```

3. **Protected Request**
```
GET http://localhost:4000/api/projects
Headers:
Authorization: Bearer <your-jwt-token>
```

## 📝 Notlar

- SQLite database.db dosyası silerse, server otomatik yeni database ve demo data oluşturur
- Tüm tarih/saat değerleri CURRENT_TIMESTAMP (UTC) kullanır
- File upload'lar /uploads klasörüne kaydedilir
- Socket.IO port 4000'de HTTP server ile birlikte çalışır

## 🐛 Debugging

### Server logları kontrol et:
```bash
node server.js
```

### Database'i kontrol et:
```bash
sqlite3 database.db
.tables
.schema users
SELECT * FROM users;
```

## 📞 Destek

Sorular için: backend kodu tamamen `server.js` dosyasında, inceleyebilirsiniz.

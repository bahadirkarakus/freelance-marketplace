# 🚀 BK Marketplace - Backend API Documentation

## 📋 Overview
RESTful API developed with Node.js and Express. Uses SQLite database with JWT authentication.

## 🗂️ Project Structure
```
backend/
├── server.js              # Main backend file (all API endpoints)
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── upload.js         # Multer file upload middleware
├── uploads/              # Uploaded files (profile pictures)
├── database.db           # SQLite database
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## 🔧 Installation and Running

### 1. Install Required Packages
```bash
cd backend
npm install
```

### 2. Environment Variables (.env file)
```
PORT=4000
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
```

### 3. Start the Server
```bash
node server.js
```

Server runs on http://localhost:4000

## 📦 Technologies Used

- **express** (5.2.1) - Web framework
- **sqlite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **multer** - File upload
- **socket.io** - Real-time messaging
- **cors** - Cross-origin resource sharing

## 🗄️ Database Schema

### Users Table
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

### Projects Table
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

### Bids Table
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

### Reviews Table
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

### Messages Table
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

### JWT Token System
- Token valid for **7 days**
- Header: `Authorization: Bearer <token>`
- Token payload: `{ id, email, user_type }`

### Protected Routes
Routes protected with `authMiddleware`:
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
Register new user
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
User login
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
Get user details
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
Get freelancer list (pagination)
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
Update profile

#### POST /api/users/:id/upload (Protected)
Upload profile picture (Multer)

### 📝 Project Routes

#### GET /api/projects?page=1&limit=9&search=&category=
Get project list (pagination, search, filter)
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
Get project details

#### POST /api/projects (Protected)
Create new project
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
Update project

#### DELETE /api/projects/:id (Protected)
Delete project

### 💼 Bid Routes

#### POST /api/bids (Protected)
Submit proposal
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
Get project proposals

#### GET /api/users/:id/bids
Get freelancer's proposals

#### PUT /api/bids/:id (Protected)
Accept/reject proposal
```json
Request:
{
  "status": "accepted" | "rejected"
}
```
**Note:** When a proposal is accepted, the project automatically moves to "in_progress" status.

### ⭐ Review Routes

#### POST /api/reviews (Protected)
Submit review
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
Get user's reviews

#### GET /api/reviews/:userId/stats
Get review statistics
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
Send message
```json
Request:
{
  "receiver_id": 2,
  "content": "Hello, I'm interested in your project..."
}
```

#### GET /api/messages/conversations (Protected)
Get conversation list

#### GET /api/messages/:userId (Protected)
Get messages with specific user

#### PUT /api/messages/:id/read (Protected)
Mark message as read

## 🔌 Socket.IO Events

### Real-time Messaging
```javascript
// Connection
socket.on('connection', (socket) => {
  socket.on('user_connected', (userId) => {
    // User is online
  });

  socket.on('send_message', (data) => {
    // Send message
    io.to(receiverSocketId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // User is offline
  });
});
```

## 📊 Demo Data

Demo data is automatically added on first server run:

### Demo Users
- **Client:** client1@demo.com / 123456
- **Freelancer 1:** freelancer1@demo.com / 123456 (Sarah Designer)
- **Freelancer 2:** freelancer2@demo.com / 123456 (Mike Developer)
- **Freelancer 3:** freelancer3@demo.com / 123456 (Emma Writer)

### 6 Sample Projects
### 7 Sample Bids

## 🛡️ Security Features

1. **Password Hashing:** bcrypt (10 salt rounds)
2. **JWT Authentication:** 7-day token validity
3. **Protected Routes:** authMiddleware
4. **File Upload Validation:** 5MB limit, image/document only
5. **SQL Injection Protection:** Prepared statements

## 🧪 API Testing Examples

### Test with Postman / Thunder Client

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

## 📝 Notes

- If the SQLite database.db file is deleted, the server automatically creates a new database with demo data
- All timestamp values use CURRENT_TIMESTAMP (UTC)
- File uploads are saved to /uploads folder
- Socket.IO runs on port 4000 with HTTP server

## 🐛 Debugging

### Check server logs:
```bash
node server.js
```

### Check database:
```bash
sqlite3 database.db
.tables
.schema users
SELECT * FROM users;
```

## 📞 Support

For questions: all backend code is in the `server.js` file, you can review it there.

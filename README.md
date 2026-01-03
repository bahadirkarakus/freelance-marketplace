# 🚀 BK Freelance Marketplace

<div align="center">

![Freelance Marketplace Banner](https://img.shields.io/badge/🎯_Freelance_Marketplace-Platform-blue?style=for-the-badge)

[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](https://github.com/bahadirkarakus/freelance-marketplace)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat-square&logo=sqlite)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Modern, Full-Stack Freelance Marketplace Platform**

*Clients meet talented freelancers. Projects come to life.*

[🌐 Demo](#-demo) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [✨ Features](#-features)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**BK Freelance Marketplace** is a comprehensive platform that connects clients with talented freelancers worldwide. Built with modern web technologies, it provides a seamless experience for project posting, bidding, secure payments, and real-time communication.

### 🎪 Key Highlights

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Escrow System** | Payments held safely until work is approved |
| 💬 **Real-time Messaging** | Socket.IO powered instant communication |
| 🌍 **Multi-language** | Turkish and English support |
| 🌓 **Dark/Light Mode** | User preference-based theming |
| 📱 **Fully Responsive** | Perfect on desktop, tablet, and mobile |
| 👥 **40+ Sample Freelancers** | Pre-loaded diverse professionals |

---

## ✨ Features

### 👤 User Management

<details>
<summary><b>🔐 Authentication System</b></summary>

- ✅ Secure registration with email verification
- ✅ JWT-based authentication (7-day token expiry)
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Auto-login after registration
- ✅ Axios interceptors for token injection

</details>

<details>
<summary><b>👥 User Types & Profiles</b></summary>

- **Clients** - Post projects, review bids, hire freelancers, make payments
- **Freelancers** - Browse projects, submit bids, showcase portfolios, receive payments
- **Admin** - Full platform management, dispute resolution, user monitoring

**Profile Features:**
- Profile picture upload with preview (5MB limit)
- Bio, skills, and hourly rate editing
- Avatar display (uploaded image or initials fallback)
- Public freelancer profiles

</details>

### 💼 Project Management

<details>
<summary><b>📝 Project Lifecycle</b></summary>

| Status | Description |
|--------|-------------|
| `open` | Project posted, accepting bids |
| `in_progress` | Freelancer assigned, work started |
| `completed` | Work delivered and approved |
| `disputed` | Issue raised, under review |

**Features:**
- Create projects with title, description, budget, deadline
- Category-based organization (15+ categories)
- Advanced filtering and search
- Pagination (9 projects per page)

</details>

### 💰 Bidding & Escrow System

<details>
<summary><b>🎯 Bidding Workflow</b></summary>

```
Client Posts Project → Freelancers Submit Bids → Client Reviews Bids
                                                        ↓
Escrow Released ← Client Approves ← Freelancer Submits ← Payment to Escrow ← Bid Accepted
```

**Bid Components:**
- Bid amount
- Delivery time estimate
- Detailed proposal
- Status tracking (pending, accepted, rejected)

</details>

<details>
<summary><b>💳 Secure Payment System</b></summary>

- **Escrow Protection** - Funds held until work approved
- **Professional Payment Modal** - Credit card-style UI
- **Wallet System** - Balance management for both parties
- **Payment History** - Complete transaction records

**Payment Flow:**
1. Client accepts bid → Payment moves to escrow
2. Freelancer completes work → Marks as completed
3. Client approves → Escrow released to freelancer
4. Both parties can dispute if issues arise

</details>

### 💬 Communication

<details>
<summary><b>📨 Real-time Messaging</b></summary>

- Socket.IO powered instant messaging
- Conversation list with last message preview
- Unread message count badges
- Read/unread status tracking
- Online user indicators
- Auto-scroll to latest message
- Message persistence in database

**Access Points:**
- Project detail pages
- Freelancer profiles
- Dashboard quick actions

</details>

<details>
<summary><b>🔔 Notification System</b></summary>

| Type | Trigger |
|------|---------|
| `bid` | New bid on your project |
| `message` | New message received |
| `payment` | Payment status update |
| `review` | New review received |
| `project` | Project status change |
| `completion` | Work marked complete |
| `dispute` | Dispute raised |
| `system` | Platform announcements |

</details>

### 📊 Additional Features

<details>
<summary><b>⭐ Review System</b></summary>

- Star rating (1-5 stars)
- Written reviews
- Average rating calculation
- Review display on profiles

</details>

<details>
<summary><b>🖼️ Portfolio Showcase</b></summary>

- Multiple portfolio items per freelancer
- Image upload support
- Project descriptions
- Category tagging

</details>

<details>
<summary><b>📱 User Experience</b></summary>

- 🌓 Dark/Light mode toggle
- 🌍 Turkish/English language switch
- 📱 Mobile-first responsive design
- 🔍 Advanced search and filtering
- 🍞 Toast notifications for all actions
- ⏳ Skeleton loading states

</details>

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | 19.2.1 | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 6.0.6 | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | 3.4.1 | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white) | 7.10.1 | Routing |
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white) | 4.8.1 | Real-time |
| ![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white) | 25.7.3 | Internationalization |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | 4.5.1 | Data Visualization |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | 1.13.2 | HTTP Client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | 20.x | Runtime |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | 5.2.1 | Web Framework |
| ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) | 5.1.7 | Database |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) | 9.0.3 | Authentication |
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white) | 4.8.1 | WebSocket |
| ![Multer](https://img.shields.io/badge/Multer-FF6F00?style=flat-square&logoColor=white) | 2.0.2 | File Upload |
| ![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=flat-square&logoColor=white) | 3.0.3 | Password Hashing |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=flat-square&logoColor=white) | 7.0.12 | Email Service |

---

## 📸 Screenshots

<details>
<summary><b>🏠 Home Page</b></summary>

- Hero section with call-to-action
- Featured freelancers carousel
- Category showcase
- Statistics display

</details>

<details>
<summary><b>💼 Projects Page</b></summary>

- Project cards with key info
- Filter by category, budget, status
- Search functionality
- Pagination

</details>

<details>
<summary><b>👤 Freelancer Profile</b></summary>

- Profile header with avatar
- Skills tags
- Portfolio showcase
- Reviews section
- Contact button

</details>

<details>
<summary><b>💬 Messaging</b></summary>

- Conversation list sidebar
- Real-time chat interface
- Message status indicators
- Typing indicators

</details>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher (comes with Node.js)
- **Git** for cloning the repository

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/bahadirkarakus/freelance-marketplace.git
cd freelance-marketplace
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

> 🟢 Backend runs on `http://localhost:4000`

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> 🟢 Frontend runs on `http://localhost:3002`

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Payment (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Supabase (Optional - for cloud database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
```

### Quick Commands

```bash
# Root directory

# Start backend
cd backend && npm start

# Start frontend (new terminal)
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

### Windows Quick Start

Double-click `start-backend.bat` in the root directory to start the backend server.

---

## 📁 Project Structure

```
freelance-marketplace/
├── 📂 backend/                    # Node.js/Express API Server
│   ├── 📂 controllers/            # Business logic handlers
│   │   └── AuthController.js      # Authentication logic
│   ├── 📂 middleware/             # Express middleware
│   │   ├── auth.js                # JWT verification
│   │   ├── roleCheck.js           # Role-based access
│   │   ├── upload.js              # File upload config
│   │   └── validation.js          # Input validation
│   ├── 📂 routes/                 # API route definitions
│   │   ├── admin.js               # Admin endpoints
│   │   ├── auth.js                # Auth endpoints
│   │   ├── bids.js                # Bid management
│   │   ├── messages.js            # Messaging system
│   │   ├── notifications.js       # Notification system
│   │   ├── payments.js            # Payment processing
│   │   ├── portfolio.js           # Portfolio management
│   │   ├── projects.js            # Project CRUD + escrow
│   │   ├── reviews.js             # Review system
│   │   ├── users.js               # User management
│   │   └── wallet.js              # Wallet operations
│   ├── 📂 utils/                  # Utility functions
│   │   ├── encryption.js          # Data encryption
│   │   └── helpers.js             # Helper functions
│   ├── 📂 uploads/                # Uploaded files storage
│   ├── database.js                # SQLite connection
│   ├── server.js                  # Main server file
│   └── package.json               # Backend dependencies
│
├── 📂 frontend/                   # React Frontend Application
│   ├── 📂 public/                 # Static assets
│   │   ├── index.html             # HTML template
│   │   ├── manifest.json          # PWA manifest
│   │   └── robots.txt             # SEO robots file
│   ├── 📂 src/
│   │   ├── 📂 components/         # Reusable UI Components
│   │   │   ├── Badge.jsx          # Status badges
│   │   │   ├── BidForm.jsx        # Bid submission form
│   │   │   ├── BidList.jsx        # Bid listing
│   │   │   ├── Button.jsx         # Custom button
│   │   │   ├── Card.jsx           # Card container
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── FreelancerFilters.jsx
│   │   │   ├── Input.jsx          # Form inputs
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── PaymentModal.jsx   # Payment UI
│   │   │   ├── ProfilePictureUpload.jsx
│   │   │   ├── ProjectFilters.jsx
│   │   │   ├── ProtectedRoute.jsx # Route guard
│   │   │   ├── ReviewForm.jsx     # Review submission
│   │   │   ├── ReviewList.jsx     # Review display
│   │   │   ├── SkeletonCard.jsx   # Loading state
│   │   │   ├── StarRating.jsx     # Rating component
│   │   │   ├── StripePaymentModal.jsx
│   │   │   └── WalletCard.jsx     # Wallet display
│   │   ├── 📂 context/            # React Context
│   │   │   ├── AuthContext.jsx    # Auth state
│   │   │   └── ThemeContext.jsx   # Theme state
│   │   ├── 📂 hooks/              # Custom Hooks
│   │   │   └── useAuth.js         # Auth hook
│   │   ├── 📂 locales/            # Translations
│   │   │   ├── en.json            # English
│   │   │   └── tr.json            # Turkish
│   │   ├── 📂 pages/              # Page Components
│   │   │   ├── About.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── CategoryDetail.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FreelancerProfile.jsx
│   │   │   ├── Freelancers.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── HowItWorksFreelancer.jsx
│   │   │   ├── HowItWorksHiring.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── MyBids.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Register.jsx
│   │   ├── 📂 utils/              # Utilities
│   │   ├── App.jsx                # Main App
│   │   ├── App.css                # Global styles
│   │   ├── i18n.js                # i18n config
│   │   ├── index.css              # Tailwind imports
│   │   └── main.jsx               # Entry point
│   ├── tailwind.config.cjs        # Tailwind config
│   ├── vite.config.js             # Vite config
│   └── package.json               # Frontend dependencies
│
├── 📂 uploads/                    # Global uploads folder
├── 📄 FEATURES.md                 # Feature documentation
├── 📄 SETUP.md                    # Detailed setup guide
├── 📄 PAYMENT_GUIDE.md            # Payment integration guide
├── 📄 STRIPE_SETUP.md             # Stripe configuration
├── 📄 LICENSE                     # MIT License
└── 📄 README.md                   # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `GET` | `/auth/me` | Get current user | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users` | List all users | ❌ |
| `GET` | `/users/:id` | Get user by ID | ❌ |
| `GET` | `/users/:id/reviews` | Get user reviews | ❌ |
| `PUT` | `/users/profile` | Update profile | ✅ |
| `POST` | `/users/profile-picture` | Upload avatar | ✅ |

### Project Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/projects` | List all projects | ❌ |
| `GET` | `/projects/:id` | Get project details | ❌ |
| `POST` | `/projects` | Create new project | ✅ |
| `PUT` | `/projects/:id` | Update project | ✅ |
| `DELETE` | `/projects/:id` | Delete project | ✅ |
| `GET` | `/projects/:id/bids` | Get project bids | ✅ |
| `POST` | `/projects/:id/complete` | Mark as complete | ✅ |
| `POST` | `/projects/:id/approve-completion` | Approve & release escrow | ✅ |
| `POST` | `/projects/:id/dispute` | Raise dispute | ✅ |

### Bid Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/bids` | List user's bids | ✅ |
| `POST` | `/bids` | Submit a bid | ✅ |
| `PUT` | `/bids/:id/accept` | Accept a bid | ✅ |
| `PUT` | `/bids/:id/reject` | Reject a bid | ✅ |

### Message Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/messages/conversations` | List conversations | ✅ |
| `GET` | `/messages/:recipientId` | Get chat messages | ✅ |
| `POST` | `/messages` | Send message | ✅ |
| `PUT` | `/messages/:id/read` | Mark as read | ✅ |

### Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/payments` | List user payments | ✅ |
| `POST` | `/payments/create-intent` | Create payment intent | ✅ |
| `POST` | `/payments/confirm` | Confirm payment | ✅ |

### Wallet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/wallet` | Get wallet balance | ✅ |
| `GET` | `/wallet/transactions` | Transaction history | ✅ |
| `POST` | `/wallet/withdraw` | Request withdrawal | ✅ |

### Notification Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notifications` | List notifications | ✅ |
| `PUT` | `/notifications/:id/read` | Mark as read | ✅ |
| `PUT` | `/notifications/read-all` | Mark all as read | ✅ |

### Review Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/reviews/user/:userId` | Get user reviews | ❌ |
| `POST` | `/reviews` | Create review | ✅ |

### Portfolio Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/portfolio/:userId` | Get user portfolio | ❌ |
| `POST` | `/portfolio` | Add portfolio item | ✅ |
| `DELETE` | `/portfolio/:id` | Remove item | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/stats` | Platform statistics | 🔐 Admin |
| `GET` | `/admin/users` | List all users | 🔐 Admin |
| `PUT` | `/admin/users/:id/status` | Update user status | 🔐 Admin |
| `GET` | `/admin/disputes` | List disputes | 🔐 Admin |
| `PUT` | `/admin/disputes/:id/resolve` | Resolve dispute | 🔐 Admin |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type TEXT CHECK(user_type IN ('client', 'freelancer', 'admin')),
    bio TEXT,
    skills TEXT,
    hourly_rate REAL,
    profile_picture TEXT,
    balance REAL DEFAULT 0,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES users(id),
    freelancer_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget REAL NOT NULL,
    deadline DATE,
    category TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'disputed', 'cancelled')),
    freelancer_approved BOOLEAN DEFAULT 0,
    client_approved BOOLEAN DEFAULT 0,
    completion_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bids Table
```sql
CREATE TABLE bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    freelancer_id INTEGER REFERENCES users(id),
    amount REAL NOT NULL,
    delivery_time INTEGER NOT NULL,
    proposal TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    client_id INTEGER REFERENCES users(id),
    freelancer_id INTEGER REFERENCES users(id),
    amount REAL NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SUCCESS', 'FAILED')),
    payment_method TEXT,
    transaction_id TEXT,
    freelancer_submitted_at DATETIME,
    client_approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    type TEXT CHECK(type IN ('bid', 'message', 'payment', 'review', 'project', 'completion', 'dispute', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reviewer_id INTEGER REFERENCES users(id),
    reviewee_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Portfolio Table
```sql
CREATE TABLE portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Security

### Implemented Security Measures

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with salt rounds |
| **Authentication** | JWT tokens (7-day expiry) |
| **Protected Routes** | Middleware verification |
| **Input Validation** | Server-side validation |
| **File Upload** | Type & size restrictions |
| **SQL Injection** | Parameterized queries |
| **CORS** | Configured allowed origins |
| **XSS Protection** | React's built-in escaping |

### Best Practices

```javascript
// Example: Protected Route Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite) → React Router → Context API → Components │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                         HTTP REST API + WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Express.js → Middleware → Routes → Controllers → Services    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Socket.IO Server (Real-time messaging & notifications)       │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │
│  │  SQLite Database    │    │  File System (uploads/)             │ │
│  │  - Users            │    │  - Profile pictures                 │ │
│  │  - Projects         │    │  - Portfolio images                 │ │
│  │  - Bids             │    │  - Project attachments              │ │
│  │  - Messages         │    │                                     │ │
│  │  - Payments         │    │                                     │ │
│  │  - Notifications    │    │                                     │ │
│  └─────────────────────┘    └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Client Request → CORS → Auth Middleware → Validation → Route Handler
                                                            │
                                                            ▼
                                                    Business Logic
                                                            │
                                                            ▼
                                                    Database Query
                                                            │
                                                            ▼
                                                    JSON Response
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Profile update and picture upload
- [ ] Project creation and browsing
- [ ] Bid submission and acceptance
- [ ] Real-time messaging
- [ ] Payment flow (escrow)
- [ ] Review submission
- [ ] Notification system
- [ ] Admin panel functions

### Sample Test Accounts

```
Client Account:
- Email: client@test.com
- Password: password123

Freelancer Account:
- Email: freelancer@test.com
- Password: password123

Admin Account:
- Email: admin@test.com
- Password: admin123
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secret
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure production database
- [ ] Set up file storage (AWS S3 / Cloudinary)
- [ ] Configure email service
- [ ] Set up monitoring and logging

### Recommended Hosting

| Service | Layer |
|---------|-------|
| **Vercel / Netlify** | Frontend |
| **Railway / Render** | Backend |
| **PlanetScale / Supabase** | Database |
| **Cloudinary** | File Storage |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a **feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open a **Pull Request**

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns
- Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Bahadır Karakuş

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

<div align="center">

**Bahadır Karakuş**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bahadirkarakus)

</div>

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Express.js](https://expressjs.com/) - Backend Framework
- [Socket.IO](https://socket.io/) - Real-time Communication
- [SQLite](https://sqlite.org/) - Database

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ and ☕

</div>

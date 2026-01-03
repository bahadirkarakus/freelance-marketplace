# 🚀 BK Marketplace - Setup Guide

## 📋 Requirements

- **Node.js** (v14 or higher) - [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

## ⚠️ Important: Environment Setup

### Backend Environment
```bash
cd backend
cp .env.example .env
# Edit .env file with your credentials
```

### Frontend Environment
```bash
cd frontend
cp .env.example .env
# Edit .env file - set VITE_API_URL to your backend URL
```

## 🔧 Installation Steps

### 1️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file (IMPORTANT!)
cp .env.example .env
# Edit .env file with your database credentials

# Start the server
node server.js
```

Backend runs on http://localhost:4000

### 2️⃣ Frontend Setup

**OPEN A NEW TERMINAL** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Copy environment file (IMPORTANT!)
cp .env.example .env
# Edit .env file if your backend is not on localhost:4000

# Start the application
npm start
```

Frontend runs on http://localhost:3002 and will open in your browser automatically.

## 🎯 Test Accounts

The project automatically creates demo data and test accounts:

### 👤 Client Accounts
- **Email:** client1@demo.com | **Password:** demo123
- **Email:** client2@demo.com | **Password:** demo123

### 💼 Freelancer Accounts
- **Email:** freelancer1@demo.com | **Password:** demo123
- **Email:** freelancer2@demo.com | **Password:** demo123
- **Email:** freelancer3@demo.com | **Password:** demo123

## 🌟 Features

### ✅ Implemented Features

1. **User Management**
   - JWT authentication
   - Bcrypt password hashing
   - Client and Freelancer roles

2. **Project Management**
   - Create and list projects
   - File uploads (Multer)
   - Pagination (9 projects/page)
   - Project details
   - Status management (Open, In Progress, Completed, Cancelled)

3. **Bidding System**
   - Submit proposals
   - Accept/reject proposals
   - Proposal history
   - Automatic status updates

4. **Reviews & Ratings**
   - 5-star rating system
   - Add comments
   - Calculate average rating
   - Display in profile

5. **Real-time Messaging**
   - Instant messaging with Socket.IO
   - Online user tracking
   - Message history

6. **Dashboard & Analytics**
   - Data visualization with Chart.js
   - Client dashboard (project stats, bid analysis)
   - Freelancer dashboard (earnings, success rate, performance)
   - Monthly trend graphs

7. **Modern UI/UX**
   - Gradient designs
   - Glassmorphism effects
   - Responsive design
   - React Hot Toast notifications

## 📁 Project Structure

```
freelance-marketplace/
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── database.db         # SQLite database (auto-created)
│   ├── uploads/            # Uploaded files (auto-created)
│   └── .env               # Environment variables (optional)
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── context/       # Context API
    │   └── utils/         # Utility functions
    ├── package.json       # Frontend dependencies
    └── public/            # Static files
```

## 🛠️ Technologies Used

### Backend
- Node.js & Express.js
- SQLite3 (Database)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Socket.IO (Real-time communication)
- Multer (File upload)

### Frontend
- React 19.2.1
- React Router DOM
- Chart.js & react-chartjs-2
- Axios
- Socket.IO Client
- React Hot Toast
- Tailwind CSS 3.4.1

## ⚠️ Important Notes

1. **Start the backend first**, then start the frontend.
2. On first run, the database is automatically created and demo data is added.
3. If you want to reset the database, delete `backend/database.db` and restart the server.
4. The `uploads/` folder is created automatically when the first file is uploaded.

## 🐛 Troubleshooting

### Port Already in Use
If you get "Port already in use" error:

**For Windows:**
```bash
# Find and close process using port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# Find and close process using port 3002
Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess | Stop-Process -Force
```

### npm install Errors
If you get errors during `npm install`:
```bash
# Clean npm cache
npm cache clean --force

# Try again
npm install
```

## 📞 Contact

If you encounter any issues or have questions, feel free to reach out.

---

**Happy Coding! 🚀**

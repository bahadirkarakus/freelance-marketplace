# BK Freelance Marketplace 🚀

A modern, full-stack freelance marketplace platform where clients can post projects and freelancers can bid on them. Built with React, Node.js, and modern web technologies.

![Freelance Marketplace](https://img.shields.io/badge/Status-Active-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-Latest-brightgreen)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure registration and login for clients and freelancers
- **Project Management** - Create, browse, and manage projects with detailed descriptions
- **Bidding System** - Freelancers can submit competitive bids on projects
- **Real-time Messaging** - Built-in chat system for communication
- **Review System** - Rate and review completed work
- **Wallet System** - Secure payment handling and balance management
- **Portfolio Showcase** - Freelancers can display their best work

### 🎨 User Experience
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes for better user experience
- **Multi-language Support** - Turkish and English language options
- **Advanced Filtering** - Find freelancers by skills, rating, and price range
- **Search Functionality** - Quick project and freelancer discovery

### 👥 User Types
- **Clients** - Post projects, review bids, hire freelancers, make payments
- **Freelancers** - Browse projects, submit bids, showcase portfolios, receive payments
- **Admin** - Manage users, monitor platform activity, handle disputes

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/REACT-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/VITE-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TAILWIND-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/NODE.JS-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/EXPRESS-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLITE-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/VERCEL-FRONTEND-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/RAILWAY-BACKEND-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Netlify](https://img.shields.io/badge/NETLIFY-ALTERNATIVE-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

### **Complete Stack**
**Modern Full-Stack Freelance Marketplace Platform**

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/freelance-marketplace.git
   cd freelance-marketplace
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on `http://localhost:4000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3002`

4. **Database Setup**
   The SQLite database will be created automatically when you first run the backend.

### Environment Variables

Create a `.env` file in the backend directory:
```env
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## 📱 Key Highlights

- **40+ Sample Freelancers** - Pre-loaded with diverse professionals across 15+ categories
- **Secure Payments** - Integrated Stripe payment processing
- **Real-time Features** - Live messaging and notifications
- **Professional UI** - Modern, clean design with excellent UX
- **Mobile Responsive** - Perfect experience on all devices
- **Multi-language** - Turkish and English support

## 🏗 Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
├─────────────────────────────────────────────────────────┤
│  Browser (React SPA) → HTTPS → CDN (Vercel/Netlify)    │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                Application Layer                        │
├─────────────────────────────────────────────────────────┤
│  React Router → Components → Context API → API Service │
└─────────────────────────────────────────────────────────┘
                              │
                          REST API
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend Layer                           │
├─────────────────────────────────────────────────────────┤
│  Express API → JWT Middleware → Business Logic         │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                             │
├─────────────────────────────────────────────────────────┤
│           SQLite Database → File Storage               │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### **Client Layer**
- **React SPA**: Single-page application with modern React 18
- **HTTPS**: Secure communication with SSL/TLS encryption
- **CDN**: Fast content delivery via Vercel or Netlify

#### **Application Layer**
- **React Router**: Client-side routing for seamless navigation
- **Context API**: Global state management for user data
- **API Service**: Centralized HTTP client with Axios

#### **Backend Layer**
- **Express API**: RESTful API with clean endpoint structure
- **JWT Middleware**: Token-based authentication and authorization
- **Business Logic**: Separate controllers for different features

#### **Data Layer**
- **SQLite**: Lightweight relational database for development
- **File Storage**: Local file system for profile pictures and portfolios

## 📂 Project Structure

```
freelance-marketplace/
├── backend/                 # Node.js/Express backend
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, upload
│   ├── models/             # Data models
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   └── database.js         # SQLite setup
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── locales/       # Translation files
│   │   └── utils/         # Frontend utilities
└── README.md
```

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or DigitalOcean
- Set up environment variables
- Configure database (PostgreSQL for production)

### Frontend Deployment
- Build with `npm run build`
- Deploy to Netlify, Vercel, or similar platforms
- Update API endpoints for production

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Built with ❤️ by a passionate developer

---

⭐ **Star this repo if you found it helpful!**

## 📄 License

This project is open source and available under the MIT License.

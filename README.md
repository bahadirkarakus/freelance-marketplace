# BK Marketplace - Freelance Services Platform

A full-featured freelance marketplace platform where clients can create projects and freelancers can submit proposals. Built with React and Node.js.

## 🚀 Technology Stack

### Backend
- **Node.js + Express** - REST API
- **SQLite3** - Database
- **Socket.IO** - Real-time messaging
- **JWT** - Authentication
- **Multer** - File uploads

### Frontend
- **React 19** - UI framework
- **React Router** - Page routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Context API** - State management

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on http://localhost:4000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3002 (or 3001 if available)

## ✨ Features

### User Features
- ✅ Registration (Client or Freelancer)
- ✅ Login with JWT authentication
- ✅ Profile editing and management
- ✅ Dashboard with statistics
- ✅ Profile picture upload
- ✅ Real-time messaging

### Client Features
- ✅ Create projects
- ✅ Manage projects
- ✅ View proposals
- ✅ Accept/reject proposals
- ✅ Assign freelancers
- ✅ Leave reviews

### Freelancer Features
- ✅ Browse projects with filters
- ✅ Submit proposals
- ✅ Track proposals
- ✅ Add skills and hourly rate
- ✅ View ratings and reviews
- ✅ Communicate with clients

### General Features
- ✅ Project listing with pagination
- ✅ Advanced filtering (category, budget, duration)
- ✅ Freelancer directory
- ✅ Status tracking (open, in_progress, completed)
- ✅ 5-star rating system
- ✅ Real-time messaging
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Multi-language support (EN/TR)

## 📁 Database Schema

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

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Users
- GET `/api/freelancers` - Get all freelancers
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update profile
- GET `/api/users/:id/projects` - Get user projects
- GET `/api/users/:id/bids` - Get user bids
- GET `/api/users/:id/reviews` - Get user reviews

### Projects
- POST `/api/projects` - Create project
- GET `/api/projects` - Get all projects (with filters)
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- GET `/api/projects/:id/bids` - Get project proposals

### Bids
- POST `/api/bids` - Submit proposal
- PUT `/api/bids/:id` - Update proposal status

### Reviews
- POST `/api/reviews` - Submit review

## 🔐 Authentication

JWT-based authentication with 7-day token expiration. Passwords are hashed with bcrypt.

## 🎨 Pages

1. **Home** - Landing page with hero section, how it works, testimonials, and FAQ
2. **Login/Register** - User authentication
3. **Projects** - Browse and filter projects
4. **Project Detail** - View project details and submit proposals
5. **Create Project** - Create new project (clients only)
6. **Freelancers** - Browse freelancer directory
7. **Dashboard** - User dashboard with statistics
8. **Profile** - Edit user profile
9. **Messages** - Real-time messaging

## 🚀 Getting Started

1. Start backend: `cd backend && node server.js`
2. Start frontend: `cd frontend && npm start`
3. Visit http://localhost:3002
4. Register and start using!

## 📝 Notes

- Database is automatically created on first run (SQLite)
- Sample projects are seeded into the database
- Use a Client account to create projects
- Use a Freelancer account to submit proposals

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

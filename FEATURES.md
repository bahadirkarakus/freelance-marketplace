# Freelance Marketplace - Implemented Features

## Technology Stack
- **Frontend**: React 19.2.1, React Router DOM, Tailwind CSS 3.4.1
- **Backend**: Node.js, Express 5.2.1, SQLite3
- **Authentication**: JWT tokens (7-day expiration), bcrypt password hashing
- **Real-time**: Socket.IO for messaging
- **File Upload**: Multer (5MB limit)
- **UI Feedback**: react-hot-toast

## ✅ Completed Features

### 1. Authentication System
- User registration with auto-login
- Login with JWT token management
- Password hashing with bcrypt
- Protected routes with middleware
- Automatic token injection via Axios interceptors
- Toast notifications for auth actions

### 2. User Management
- User types: Client and Freelancer
- Profile editing with bio, skills, hourly rate
- Profile picture upload with preview
- Avatar display (uploaded image or initials)

### 3. Project Management
- Browse projects with pagination (9 per page)
- Project creation (clients only)
- Project details with full information
- Project status tracking (open, in_progress, completed)
- Category and duration fields

### 4. Bidding System
- Freelancers can submit bids on projects
- Bid details: amount, delivery time, proposal
- Clients can accept bids
- Bid status management

### 5. Reviews and Ratings
- Users can leave reviews
- Rating system with star display
- Average rating calculation

### 6. Freelancer Directory
- Browse freelancers with pagination (12 per page)
- Skills display with tags
- Hourly rate display
- Rating display

### 7. Real-time Messaging System 🆕
- One-on-one chat between users
- Socket.IO for real-time message delivery
- Message persistence in database
- Conversation list with last message preview
- Unread message count badges
- Read/unread status tracking
- Online user tracking
- "Send Message" buttons on:
  - Project detail pages
  - Freelancer profiles
  - Dashboard

**Messaging Features:**
- Messages page showing all conversations
- Individual chat page with real-time updates
- Message bubbles with timestamps
- Auto-scroll to latest message
- Profile pictures in conversation list
- Back button to return to messages list

### 8. Dashboard
- User statistics display
- Active projects list
- Submitted/received bids
- Quick access to actions

### 9. File Upload System
- Profile picture upload
- Image preview before upload
- File size validation (5MB limit)
- Supported formats: images and documents
- Secure storage in /uploads directory

### 10. Toast Notifications
- Success/error feedback on all actions
- User-friendly error messages
- Consistent UX across all pages

## Running the Project

### Backend (Port 4000)
```bash
cd backend
npm install
node server.js
```

### Frontend (Port 3001)
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (protected)
- `POST /api/users/:id/upload-picture` - Upload profile picture (protected)
- `GET /api/freelancers?page=1&limit=12` - Get freelancers with pagination

### Projects
- `GET /api/projects?page=1&limit=9` - Get projects with pagination
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)

### Bids
- `GET /api/projects/:id/bids` - Get project bids
- `POST /api/bids` - Create bid (protected)
- `PUT /api/bids/:id` - Update bid status (protected)

### Reviews
- `GET /api/reviews/:userId` - Get user reviews
- `POST /api/reviews` - Create review (protected)

### Messages 🆕
- `GET /api/conversations` - Get all conversations (protected)
- `GET /api/messages/:userId` - Get messages with specific user (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:userId/read` - Mark messages as read (protected)

### Socket.IO Events
- `user_online` - Emitted when user connects
- `send_message` - Emitted when sending a message
- `receive_message` - Received when a new message arrives
- `disconnect` - Handled when user disconnects

## Database Schema

### users
- id, name, email, password, user_type, bio, skills, hourly_rate, profile_picture, created_at

### projects
- id, client_id, title, description, budget, duration, category, status, created_at

### bids
- id, project_id, freelancer_id, amount, delivery_time, proposal, status, created_at

### reviews
- id, reviewer_id, reviewee_id, project_id, rating, comment, created_at

### messages 🆕
- id, sender_id, receiver_id, project_id, message, is_read, created_at

## Next Steps (Optional Enhancements)
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Dispute resolution system
- [ ] Portfolio uploads for freelancers
- [ ] Video call integration
- [ ] Mobile responsive improvements
- [ ] Admin dashboard
- [ ] Analytics and reporting

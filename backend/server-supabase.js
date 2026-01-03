require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require("./middleware/auth");
const roleCheck = require("./middleware/roleCheck");
const upload = require("./middleware/upload");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('Connected to Supabase');

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, user_type } = req.body;
    
    if (!email || !password || !name || !user_type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, name, user_type }])
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, user_type: newUser.user_type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, user_type: newUser.user_type }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name, user_type: user.user_type, profile_picture: user.profile_picture }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ USER ROUTES ============

// Get current user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, user_type, bio, skills, hourly_rate, profile_picture, balance')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, user_type, bio, skills, hourly_rate, profile_picture, balance, created_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', req.params.id);

    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ ...user, rating: avgRating, review_count: reviews?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, bio, skills, hourly_rate } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, bio, skills, hourly_rate })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload profile picture
app.post("/api/users/:id/upload-picture", authMiddleware, upload.single('profile_picture'), async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const profilePicturePath = `/uploads/${req.file.filename}`;

    const { error } = await supabase
      .from('users')
      .update({ profile_picture: profilePicturePath })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ profile_picture: profilePicturePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get freelancers
app.get("/api/freelancers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { data: freelancers, error, count } = await supabase
      .from('users')
      .select('id, name, email, bio, skills, hourly_rate, profile_picture', { count: 'exact' })
      .eq('user_type', 'freelancer')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get ratings for each freelancer
    const freelancersWithRating = await Promise.all(freelancers.map(async (f) => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', f.id);
      
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      return { ...f, rating: avgRating };
    }));

    res.json({
      freelancers: freelancersWithRating,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROJECT ROUTES ============

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const status = req.query.status;

    let query = supabase
      .from('projects')
      .select('*, client:users!projects_client_id_fkey(id, name, profile_picture)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    const { data: projects, error, count } = await query;

    if (error) throw error;

    res.json({
      projects,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get("/api/projects/:id", async (req, res) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, client:users!projects_client_id_fkey(id, name, profile_picture, email)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget, duration, category } = req.body;

    const { data: project, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        budget,
        duration,
        category,
        client_id: req.user.id,
        status: 'open'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget, duration, category, status, freelancer_id } = req.body;

    const { data: project, error } = await supabase
      .from('projects')
      .update({ title, description, budget, duration, category, status, freelancer_id })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BID ROUTES ============

// Get bids for a project
app.get("/api/projects/:id/bids", async (req, res) => {
  try {
    const { data: bids, error } = await supabase
      .from('bids')
      .select('*, freelancer:users!bids_freelancer_id_fkey(id, name, profile_picture, skills, hourly_rate)')
      .eq('project_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get ratings for each freelancer
    const bidsWithRating = await Promise.all(bids.map(async (bid) => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', bid.freelancer.id);
      
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      return { ...bid, freelancer: { ...bid.freelancer, rating: avgRating } };
    }));

    res.json(bidsWithRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create bid
app.post("/api/bids", authMiddleware, async (req, res) => {
  try {
    const { project_id, amount, delivery_time, proposal } = req.body;

    // Check if already bid
    const { data: existingBid } = await supabase
      .from('bids')
      .select('id')
      .eq('project_id', project_id)
      .eq('freelancer_id', req.user.id)
      .single();

    if (existingBid) {
      return res.status(400).json({ error: "You have already bid on this project" });
    }

    const { data: bid, error } = await supabase
      .from('bids')
      .insert([{
        project_id,
        freelancer_id: req.user.id,
        amount,
        delivery_time,
        proposal
      }])
      .select()
      .single();

    if (error) throw error;

    // Get project and create notification
    const { data: project } = await supabase
      .from('projects')
      .select('client_id, title')
      .eq('id', project_id)
      .single();

    if (project) {
      const { data: freelancer } = await supabase
        .from('users')
        .select('name')
        .eq('id', req.user.id)
        .single();

      await supabase.from('notifications').insert([{
        user_id: project.client_id,
        type: 'bid',
        message: `${freelancer.name} placed a $${amount} bid on "${project.title}"`,
        related_id: project_id
      }]);
    }

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept bid
app.put("/api/bids/:id/accept", authMiddleware, async (req, res) => {
  try {
    // Get bid info
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*, project:projects(*)')
      .eq('id', req.params.id)
      .single();

    if (bidError || !bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    // Update bid status
    await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', req.params.id);

    // Update project
    await supabase
      .from('projects')
      .update({ status: 'in_progress', freelancer_id: bid.freelancer_id })
      .eq('id', bid.project_id);

    // Reject other bids
    await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('project_id', bid.project_id)
      .neq('id', req.params.id);

    // Notify freelancer
    await supabase.from('notifications').insert([{
      user_id: bid.freelancer_id,
      type: 'bid_accepted',
      message: `Your bid on "${bid.project.title}" was accepted!`,
      related_id: bid.project_id
    }]);

    res.json({ message: "Bid accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bids
app.get("/api/my-bids", authMiddleware, async (req, res) => {
  try {
    const { data: bids, error } = await supabase
      .from('bids')
      .select('*, project:projects(id, title, budget, status, client:users!projects_client_id_fkey(name))')
      .eq('freelancer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ REVIEW ROUTES ============

// Get reviews for a user
app.get("/api/reviews/:userId", async (req, res) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, reviewer:users!reviews_reviewer_id_fkey(id, name, profile_picture), project:projects(title)')
      .eq('reviewee_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { reviewee_id, project_id, rating, comment } = req.body;

    const { data: review, error } = await supabase
      .from('reviews')
      .insert([{
        reviewer_id: req.user.id,
        reviewee_id,
        project_id,
        rating,
        comment
      }])
      .select()
      .single();

    if (error) throw error;

    // Notify reviewee
    const { data: reviewer } = await supabase
      .from('users')
      .select('name')
      .eq('id', req.user.id)
      .single();

    await supabase.from('notifications').insert([{
      user_id: reviewee_id,
      type: 'review',
      message: `${reviewer.name} left you a ${rating}-star review`,
      related_id: reviewee_id
    }]);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MESSAGE ROUTES ============

// Get messages with a user
app.get("/api/messages/:userId", authMiddleware, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    const currentUserId = req.user.id;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', currentUserId);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post("/api/messages", authMiddleware, async (req, res) => {
  try {
    const { receiver_id, message, project_id } = req.body;

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: req.user.id,
        receiver_id,
        message,
        project_id
      }])
      .select()
      .single();

    if (error) throw error;

    // Create notification
    const { data: sender } = await supabase
      .from('users')
      .select('name')
      .eq('id', req.user.id)
      .single();

    await supabase.from('notifications').insert([{
      user_id: receiver_id,
      type: 'message',
      message: `💬 ${sender.name}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      related_id: req.user.id
    }]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversations
app.get("/api/conversations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages involving this user
    const { data: messages, error } = await supabase
      .from('messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) throw error;

    // Get unique user IDs
    const userIds = [...new Set(messages.map(m => 
      m.sender_id === userId ? m.receiver_id : m.sender_id
    ))];

    if (userIds.length === 0) {
      return res.json([]);
    }

    // Get conversation details for each user
    const conversations = await Promise.all(userIds.map(async (otherUserId) => {
      // Get user info
      const { data: userData } = await supabase
        .from('users')
        .select('id, name, profile_picture')
        .eq('id', otherUserId)
        .single();

      // Get last message
      const { data: lastMessages } = await supabase
        .from('messages')
        .select('message, created_at')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(1);

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      return {
        user_id: userData?.id,
        user_name: userData?.name,
        profile_picture: userData?.profile_picture,
        last_message: lastMessages?.[0]?.message || '',
        last_message_time: lastMessages?.[0]?.created_at || '',
        unread_count: unreadCount || 0
      };
    }));

    // Sort by last message time
    conversations.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    res.json(conversations);
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ NOTIFICATION ROUTES ============

// Get notifications
app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.put("/api/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
app.put("/api/notifications/read-all", authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id);

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WALLET ROUTES ============

// Get balance
app.get("/api/wallet/balance", authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ balance: user.balance || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deposit
app.post("/api/wallet/deposit", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', req.user.id)
      .single();

    const newBalance = (user.balance || 0) + amount;

    await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', req.user.id);

    res.json({ balance: newBalance, message: "Deposit successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PAYMENT ROUTES ============

// Create payment
app.post("/api/payments", authMiddleware, async (req, res) => {
  try {
    const { project_id, freelancer_id, amount } = req.body;

    // Get client balance
    const { data: client } = await supabase
      .from('users')
      .select('balance')
      .eq('id', req.user.id)
      .single();

    if (client.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Get freelancer
    const { data: freelancer } = await supabase
      .from('users')
      .select('balance')
      .eq('id', freelancer_id)
      .single();

    // Transfer money
    await supabase
      .from('users')
      .update({ balance: client.balance - amount })
      .eq('id', req.user.id);

    await supabase
      .from('users')
      .update({ balance: (freelancer.balance || 0) + amount })
      .eq('id', freelancer_id);

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        project_id,
        client_id: req.user.id,
        freelancer_id,
        amount,
        status: 'completed'
      }])
      .select()
      .single();

    if (error) throw error;

    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'completed' })
      .eq('id', project_id);

    // Notify freelancer
    await supabase.from('notifications').insert([{
      user_id: freelancer_id,
      type: 'payment',
      message: `You received a payment of $${amount}!`,
      related_id: project_id
    }]);

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DASHBOARD ROUTES ============

// Get dashboard stats
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.user_type;

    if (userType === 'client') {
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId);

      const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId)
        .eq('status', 'in_progress');

      const { data: totalSpentData } = await supabase
        .from('payments')
        .select('amount')
        .eq('client_id', userId);

      const totalSpent = totalSpentData?.reduce((sum, p) => sum + p.amount, 0) || 0;

      res.json({ projectCount, activeProjects, totalSpent });
    } else {
      const { count: bidCount } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('freelancer_id', userId);

      const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('freelancer_id', userId)
        .eq('status', 'in_progress');

      const { data: totalEarnedData } = await supabase
        .from('payments')
        .select('amount')
        .eq('freelancer_id', userId);

      const totalEarned = totalEarnedData?.reduce((sum, p) => sum + p.amount, 0) || 0;

      res.json({ bidCount, activeProjects, totalEarned });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SOCKET.IO ============

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('users_online', Array.from(onlineUsers.keys()));
  });

  socket.on('send_message', async (data) => {
    const receiverSocketId = onlineUsers.get(data.receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('users_online', Array.from(onlineUsers.keys()));
  });
});

console.log('Server started with Supabase!');

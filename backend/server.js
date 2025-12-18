require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const upload = require("./middleware/upload");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// DATABASE
const db = new sqlite3.Database("./database.db");

// CREATE TABLES
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      user_type TEXT NOT NULL CHECK(user_type IN ('client', 'freelancer')),
      bio TEXT,
      skills TEXT,
      specialties TEXT,
      hourly_rate REAL,
      rating REAL DEFAULT 0,
      profile_picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      budget REAL NOT NULL,
      duration TEXT,
      category TEXT,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      client_id INTEGER NOT NULL,
      freelancer_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `, () => {
    // Add missing columns if they don't exist
    db.all("PRAGMA table_info(projects)", (err, columns) => {
      if (err) return;
      const hasDuration = columns.some(col => col.name === 'duration');
      if (!hasDuration) {
        db.run("ALTER TABLE projects ADD COLUMN duration TEXT");
      }
      const hasCategory = columns.some(col => col.name === 'category');
      if (!hasCategory) {
        db.run("ALTER TABLE projects ADD COLUMN category TEXT");
      }
      const hasClientId = columns.some(col => col.name === 'client_id');
      if (!hasClientId) {
        db.run("ALTER TABLE projects ADD COLUMN client_id INTEGER");
      }
      const hasCreatedAt = columns.some(col => col.name === 'created_at');
      if (!hasCreatedAt) {
        db.run("ALTER TABLE projects ADD COLUMN created_at DATETIME", () => {
          db.run("UPDATE projects SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
        });
      }
    });
  });

  // Bids table
  db.run(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      freelancer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      delivery_time TEXT,
      proposal TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      reviewee_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id)
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      project_id INTEGER,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `);

  // Insert demo data
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (err) console.error(err);
    if (row && row.count === 0) {
      console.log("Inserting demo data...");
      
      const hashedPassword = await bcrypt.hash("123456", 10);
      
      // Demo users
      const users = [
        { email: 'client1@demo.com', password: hashedPassword, name: 'John Client', type: 'client' },
        { email: 'freelancer1@demo.com', password: hashedPassword, name: 'Sarah Designer', type: 'freelancer', bio: 'Professional UI/UX Designer with 5 years experience', skills: 'Figma, Adobe XD, UI Design, UX Research', specialties: 'Logo Design,UI/UX Design,Brand Identity', rate: 50, rating: 4.8, picture: 'https://i.pravatar.cc/150?img=5' },
        { email: 'freelancer2@demo.com', password: hashedPassword, name: 'Mike Developer', type: 'freelancer', bio: 'Full-stack developer specializing in React and Node.js', skills: 'React, Node.js, MongoDB, Express', specialties: 'React Development,Node.js Development,Full Stack Development,API Development', rate: 65, rating: 4.9, picture: 'https://i.pravatar.cc/150?img=12' },
        { email: 'freelancer3@demo.com', password: hashedPassword, name: 'Emma Writer', type: 'freelancer', bio: 'Content writer and copywriter for tech companies', skills: 'Content Writing, Copywriting, SEO, Blog Posts', specialties: 'Content Writing,Copywriting,SEO Services,Blog Writing', rate: 40, rating: 4.7, picture: 'https://i.pravatar.cc/150?img=9' },
        { email: 'ai1@demo.com', password: hashedPassword, name: 'Alex AI Expert', type: 'freelancer', bio: 'AI & Machine Learning specialist with expertise in chatbot development', skills: 'Python, TensorFlow, NLP, ChatGPT API', specialties: 'AI Chatbot Development,Machine Learning,Natural Language Processing,AI Model Training', rate: 85, rating: 5.0, picture: 'https://i.pravatar.cc/150?img=13' },
        { email: 'ai2@demo.com', password: hashedPassword, name: 'Lisa Data Scientist', type: 'freelancer', bio: 'Data scientist specializing in AI solutions and automation', skills: 'Python, Data Analysis, AI, Automation', specialties: 'Data Analysis,AI Development,Predictive Modeling,AI Automation', rate: 75, rating: 4.8, picture: 'https://i.pravatar.cc/150?img=20' },
        { email: 'dev1@demo.com', password: hashedPassword, name: 'David Python Dev', type: 'freelancer', bio: 'Python developer with 7 years of experience', skills: 'Python, Django, Flask, FastAPI', specialties: 'Python Development,Django,API Development,Backend Development', rate: 70, rating: 4.9, picture: 'https://i.pravatar.cc/150?img=15' },
        { email: 'design1@demo.com', password: hashedPassword, name: 'Sophia Designer', type: 'freelancer', bio: 'Creative designer specializing in branding and visual identity', skills: 'Photoshop, Illustrator, Figma, Branding', specialties: 'Logo Design,Brand Identity,Graphic Design,Illustration', rate: 55, rating: 4.7, picture: 'https://i.pravatar.cc/150?img=27' }
      ];

      users.forEach(user => {
        db.run(
          `INSERT INTO users (email, password, name, user_type, bio, skills, specialties, hourly_rate, rating, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user.email, user.password, user.name, user.type, user.bio || null, user.skills || null, user.specialties || null, user.rate || null, user.rating || 0, user.picture || null]
        );
      });

      // Demo projects
      setTimeout(() => {
        const projects = [
          { title: 'E-commerce Website Design', description: 'Need a modern, responsive e-commerce website design with shopping cart functionality. Must include product pages, checkout flow, and user account pages.', budget: 2500, duration: '4 weeks', category: 'Web Design', client_id: 1 },
          { title: 'Mobile App Development', description: 'Looking for a React Native developer to build a fitness tracking mobile app. Features include workout logging, progress tracking, and social sharing.', budget: 5000, duration: '8 weeks', category: 'Mobile Development', client_id: 1 },
          { title: 'Logo Design and Branding', description: 'Startup needs complete branding package including logo design, color palette, typography, and brand guidelines.', budget: 800, duration: '2 weeks', category: 'Graphic Design', client_id: 1 },
          { title: 'Content Writing for Tech Blog', description: 'Need 10 well-researched blog posts about web development trends, each 1500-2000 words. SEO optimized with proper structure.', budget: 600, duration: '3 weeks', category: 'Content Writing', client_id: 1 },
          { title: 'React Dashboard Development', description: 'Build an admin dashboard with React, charts, data tables, user management, and responsive design. Backend API already exists.', budget: 3500, duration: '6 weeks', category: 'Web Development', client_id: 1 },
          { title: 'WordPress Website Setup', description: 'Need help setting up a WordPress website for a small business. Theme customization, plugin configuration, and content migration required.', budget: 1200, duration: '2 weeks', category: 'WordPress', client_id: 1 }
        ];

        projects.forEach(project => {
          db.run(
            `INSERT INTO projects (title, description, budget, duration, category, status, client_id) VALUES (?, ?, ?, ?, ?, 'open', ?)`,
            [project.title, project.description, project.budget, project.duration, project.category, project.client_id]
          );
        });

        // Demo bids
        setTimeout(() => {
          const bids = [
            { project_id: 1, freelancer_id: 2, amount: 2200, delivery_time: '3 weeks', proposal: 'I have extensive experience in e-commerce design. I can create a modern, conversion-optimized design with smooth user flows. My portfolio includes 15+ successful e-commerce projects.' },
            { project_id: 1, freelancer_id: 3, amount: 2400, delivery_time: '4 weeks', proposal: 'I specialize in full-stack e-commerce development with a focus on performance and user experience. I will use React for the frontend and Node.js for the backend.' },
            { project_id: 2, freelancer_id: 3, amount: 4800, delivery_time: '7 weeks', proposal: 'I am a senior React Native developer with 5+ years experience. I have built similar fitness apps with real-time tracking and social features. Can provide references.' },
            { project_id: 3, freelancer_id: 2, amount: 750, delivery_time: '10 days', proposal: 'As a UI/UX designer, I create memorable brand identities. I will provide multiple logo concepts, complete brand guidelines, and all source files.' },
            { project_id: 4, freelancer_id: 4, amount: 550, delivery_time: '2.5 weeks', proposal: 'I am a professional tech content writer with SEO expertise. All articles will be thoroughly researched, engaging, and optimized for search engines.' },
            { project_id: 5, freelancer_id: 3, amount: 3200, delivery_time: '5 weeks', proposal: 'I have built 20+ React dashboards with complex data visualization. I will use modern libraries like Chart.js and implement responsive design for all devices.' },
            { project_id: 5, freelancer_id: 2, amount: 3400, delivery_time: '6 weeks', proposal: 'I can build a beautiful and functional React dashboard with Material-UI components, interactive charts, and smooth animations.' }
          ];

          bids.forEach(bid => {
            db.run(
              `INSERT INTO bids (project_id, freelancer_id, amount, delivery_time, proposal, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
              [bid.project_id, bid.freelancer_id, bid.amount, bid.delivery_time, bid.proposal]
            );
          });

          console.log("Demo bids inserted successfully!");
        }, 700);

        console.log("Demo data inserted successfully!");
      }, 500);
    }
  });
});

// ========== AUTH ROUTES ==========
// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, user_type, bio, skills, hourly_rate } = req.body;
  
  if (!email || !password || !name || !user_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (email, password, name, user_type, bio, skills, hourly_rate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, user_type, bio, skills, hourly_rate],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint")) {
            return res.status(409).json({ error: "Email already exists" });
          }
          return res.status(500).json({ error: err.message });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: this.lastID, email, user_type },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({ 
          message: "User registered successfully",
          token,
          user: { id: this.lastID, email, name, user_type }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, user_type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Don't send password to client
      delete user.password;

      res.json({ 
        message: "Login successful",
        token,
        user
      });
    }
  );
});

// ========== USER ROUTES ==========
// Get all freelancers (with pagination)
app.get("/api/freelancers", (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  // Get total count
  db.get(
    "SELECT COUNT(*) as total FROM users WHERE user_type = 'freelancer'",
    [],
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err.message });

      // Get paginated freelancers
      db.all(
        "SELECT id, name, bio, skills, hourly_rate, rating, profile_picture FROM users WHERE user_type = 'freelancer' LIMIT ? OFFSET ?",
        [parseInt(limit), parseInt(offset)],
        (err, freelancers) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.json({
            freelancers,
            pagination: {
              total: countResult.total,
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: Math.ceil(countResult.total / limit)
            }
          });
        }
      );
    }
  );
});

// Advanced freelancer search
app.get("/api/freelancers/search", (req, res) => {
  const { 
    q,              // search query (name, skills, specialties)
    min_rate,       // minimum hourly rate
    max_rate,       // maximum hourly rate
    min_rating,     // minimum rating
    sort = 'date',  // sort by: date, rate_asc, rate_desc, rating
    page = 1, 
    limit = 12 
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, name, bio, skills, specialties, hourly_rate, rating, profile_picture 
    FROM users 
    WHERE user_type = 'freelancer'
  `;
  let countQuery = `SELECT COUNT(*) as total FROM users WHERE user_type = 'freelancer'`;
  
  const params = [];
  const countParams = [];
  const conditions = [];
  
  // Search in name, skills, and specialties
  if (q) {
    conditions.push("(name LIKE ? OR skills LIKE ? OR specialties LIKE ?)");
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm, searchTerm);
  }
  
  // Hourly rate range filter
  if (min_rate) {
    conditions.push("hourly_rate >= ?");
    params.push(parseFloat(min_rate));
    countParams.push(parseFloat(min_rate));
  }
  if (max_rate) {
    conditions.push("hourly_rate <= ?");
    params.push(parseFloat(max_rate));
    countParams.push(parseFloat(max_rate));
  }
  
  // Rating filter
  if (min_rating) {
    conditions.push("rating >= ?");
    params.push(parseFloat(min_rating));
    countParams.push(parseFloat(min_rating));
  }
  
  // Add conditions if they exist
  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
    countQuery += " AND " + conditions.join(" AND ");
  }
  
  // Sorting
  switch(sort) {
    case 'rate_asc':
      query += " ORDER BY hourly_rate ASC";
      break;
    case 'rate_desc':
      query += " ORDER BY hourly_rate DESC";
      break;
    case 'rating':
      query += " ORDER BY rating DESC";
      break;
    case 'date':
    default:
      query += " ORDER BY created_at DESC";
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Get filtered freelancers
    db.all(query, params, (err, freelancers) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        freelancers,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Get user profile
app.get("/api/users/:id", (req, res) => {
  db.get(
    "SELECT id, email, name, user_type, bio, skills, hourly_rate, rating, created_at FROM users WHERE id = ?",
    [req.params.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    }
  );
});

// Update user profile (Protected)
app.put("/api/users/:id", authMiddleware, (req, res) => {
  const { name, bio, skills, hourly_rate } = req.body;
  
  // Check if user is updating their own profile
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: "Not authorized" });
  }
  
  db.run(
    "UPDATE users SET name = ?, bio = ?, skills = ?, hourly_rate = ? WHERE id = ?",
    [name, bio, skills, hourly_rate, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

// ========== USER ROUTES ==========
// Get user by ID
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  
  db.get(
    "SELECT id, email, name, user_type, bio, skills, hourly_rate, rating, profile_picture, created_at FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    }
  );
});

// ========== PROJECT ROUTES ==========
// Create project (Protected)
app.post("/api/projects", authMiddleware, (req, res) => {
  const { title, description, budget, duration, category, client_id } = req.body;

  if (!title || !description || !budget || !client_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO projects (title, description, budget, duration, category, client_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, budget, duration, category, client_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: "Project created!" });
    }
  );
});

// Get all projects (with pagination)
app.get("/api/projects", (req, res) => {
  const { status, category, page = 1, limit = 9 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT p.*, u.name as client_name 
    FROM projects p 
    JOIN users u ON p.client_id = u.id
  `;
  let countQuery = `SELECT COUNT(*) as total FROM projects p`;
  const params = [];
  const countParams = [];

  if (status || category) {
    const whereClause = " WHERE";
    query += whereClause;
    countQuery += whereClause;
    
    if (status) {
      query += " p.status = ?";
      countQuery += " p.status = ?";
      params.push(status);
      countParams.push(status);
    }
    if (category) {
      query += (status ? " AND" : "") + " p.category = ?";
      countQuery += (status ? " AND" : "") + " p.category = ?";
      params.push(category);
      countParams.push(category);
    }
  }

  query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get paginated projects
    db.all(query, params, (err, projects) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        projects,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Advanced project search
app.get("/api/projects/search", (req, res) => {
  const { 
    q,              // search query
    min_budget,     // minimum budget
    max_budget,     // maximum budget
    category,       // category filter
    status,         // status filter
    sort = 'date',  // sort by: date, budget_asc, budget_desc
    page = 1, 
    limit = 9 
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT p.*, u.name as client_name 
    FROM projects p 
    JOIN users u ON p.client_id = u.id
  `;
  let countQuery = `SELECT COUNT(*) as total FROM projects p`;
  
  const params = [];
  const countParams = [];
  const conditions = [];
  
  // Search in title and description
  if (q) {
    conditions.push("(p.title LIKE ? OR p.description LIKE ?)");
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm);
  }
  
  // Budget range filter
  if (min_budget) {
    conditions.push("p.budget >= ?");
    params.push(parseFloat(min_budget));
    countParams.push(parseFloat(min_budget));
  }
  if (max_budget) {
    conditions.push("p.budget <= ?");
    params.push(parseFloat(max_budget));
    countParams.push(parseFloat(max_budget));
  }
  
  // Category filter
  if (category) {
    conditions.push("p.category = ?");
    params.push(category);
    countParams.push(category);
  }
  
  // Status filter
  if (status) {
    conditions.push("p.status = ?");
    params.push(status);
    countParams.push(status);
  }
  
  // Add WHERE clause if conditions exist
  if (conditions.length > 0) {
    const whereClause = " WHERE " + conditions.join(" AND ");
    query += whereClause;
    countQuery += whereClause;
  }
  
  // Sorting
  switch(sort) {
    case 'budget_asc':
      query += " ORDER BY p.budget ASC";
      break;
    case 'budget_desc':
      query += " ORDER BY p.budget DESC";
      break;
    case 'date':
    default:
      query += " ORDER BY p.created_at DESC";
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Get filtered projects
    db.all(query, params, (err, projects) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        projects,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Get single project
app.get("/api/projects/:id", (req, res) => {
  db.get(
    `SELECT p.*, u.name as client_name, u.email as client_email 
     FROM projects p 
     JOIN users u ON p.client_id = u.id 
     WHERE p.id = ?`,
    [req.params.id],
    (err, project) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    }
  );
});

// Update project (Protected)
app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const { title, description, budget, duration, category, status } = req.body;
  
  db.run(
    `UPDATE projects SET title = ?, description = ?, budget = ?, 
     duration = ?, category = ?, status = ? WHERE id = ?`,
    [title, description, budget, duration, category, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Project not found" });
      res.json({ message: "Project updated successfully" });
    }
  );
});

// Delete project (Protected)
app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  });
});

// Get user's projects
app.get("/api/users/:id/projects", (req, res) => {
  db.all(
    "SELECT * FROM projects WHERE client_id = ? OR freelancer_id = ? ORDER BY created_at DESC",
    [req.params.id, req.params.id],
    (err, projects) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(projects);
    }
  );
});

// ========== BID ROUTES ==========
// Create bid (Protected)
app.post("/api/bids", authMiddleware, (req, res) => {
  const { project_id, freelancer_id, amount, delivery_time, proposal } = req.body;

  if (!project_id || !freelancer_id || !amount || !proposal) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO bids (project_id, freelancer_id, amount, delivery_time, proposal) 
     VALUES (?, ?, ?, ?, ?)`,
    [project_id, freelancer_id, amount, delivery_time, proposal],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: "Bid submitted!" });
    }
  );
});

// Get bids for a project
app.get("/api/projects/:id/bids", (req, res) => {
  db.all(
    `SELECT b.*, u.name as freelancer_name, u.rating as freelancer_rating, u.skills 
     FROM bids b 
     JOIN users u ON b.freelancer_id = u.id 
     WHERE b.project_id = ? 
     ORDER BY b.created_at DESC`,
    [req.params.id],
    (err, bids) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(bids);
    }
  );
});

// Get freelancer's bids
app.get("/api/users/:id/bids", (req, res) => {
  db.all(
    `SELECT b.*, p.title as project_title, p.budget as project_budget 
     FROM bids b 
     JOIN projects p ON b.project_id = p.id 
     WHERE b.freelancer_id = ? 
     ORDER BY b.created_at DESC`,
    [req.params.id],
    (err, bids) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(bids);
    }
  );
});

// Update bid status (accept/reject) (Protected)
app.put("/api/bids/:id", authMiddleware, (req, res) => {
  const { status } = req.body;
  
  if (!status || !['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.run(
    "UPDATE bids SET status = ? WHERE id = ?",
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Bid not found" });
      
      // If accepted, update project status and assign freelancer
      if (status === 'accepted') {
        db.get("SELECT project_id, freelancer_id FROM bids WHERE id = ?", [req.params.id], (err, bid) => {
          if (!err && bid) {
            db.run(
              "UPDATE projects SET status = 'in_progress', freelancer_id = ? WHERE id = ?",
              [bid.freelancer_id, bid.project_id]
            );
          }
        });
      }
      
      res.json({ message: "Bid updated successfully" });
    }
  );
});

// ========== REVIEW ROUTES ==========
// Create review (Protected)
app.post("/api/reviews", authMiddleware, (req, res) => {
  const { project_id, reviewer_id, reviewee_id, rating, comment } = req.body;

  if (!project_id || !reviewer_id || !reviewee_id || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO reviews (project_id, reviewer_id, reviewee_id, rating, comment) 
     VALUES (?, ?, ?, ?, ?)`,
    [project_id, reviewer_id, reviewee_id, rating, comment],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Update user's average rating
      db.all(
        "SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?",
        [reviewee_id],
        (err, result) => {
          if (!err && result[0]) {
            db.run("UPDATE users SET rating = ? WHERE id = ?", [result[0].avg_rating, reviewee_id]);
          }
        }
      );
      
      res.status(201).json({ id: this.lastID, message: "Review submitted!" });
    }
  );
});

// Get reviews for a user
app.get("/api/users/:id/reviews", (req, res) => {
  db.all(
    `SELECT r.*, u.name as reviewer_name, p.title as project_title 
     FROM reviews r 
     JOIN users u ON r.reviewer_id = u.id 
     JOIN projects p ON r.project_id = p.id 
     WHERE r.reviewee_id = ? 
     ORDER BY r.created_at DESC`,
    [req.params.id],
    (err, reviews) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(reviews);
    }
  );
});

// ========== FILE UPLOAD ROUTES ==========
// Upload profile picture
app.post("/api/users/:id/upload-picture", authMiddleware, upload.single('profile_picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  db.run(
    "UPDATE users SET profile_picture = ? WHERE id = ?",
    [fileUrl, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile picture uploaded successfully', fileUrl });
    }
  );
});

// ========== MESSAGING ROUTES ==========
// Send message
app.post("/api/messages", authMiddleware, (req, res) => {
  const { receiver_id, project_id, message } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO messages (sender_id, receiver_id, project_id, message) 
     VALUES (?, ?, ?, ?)`,
    [sender_id, receiver_id, project_id, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Get the created message with user info
      db.get(
        `SELECT m.*, s.name as sender_name, r.name as receiver_name 
         FROM messages m 
         JOIN users s ON m.sender_id = s.id 
         JOIN users r ON m.receiver_id = r.id 
         WHERE m.id = ?`,
        [this.lastID],
        (err, message) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Message sent!", data: message });
        }
      );
    }
  );
});

// Get conversation between two users
app.get("/api/messages/:userId", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  db.all(
    `SELECT m.*, s.name as sender_name, r.name as receiver_name 
     FROM messages m 
     JOIN users s ON m.sender_id = s.id 
     JOIN users r ON m.receiver_id = r.id 
     WHERE (m.sender_id = ? AND m.receiver_id = ?) 
        OR (m.sender_id = ? AND m.receiver_id = ?) 
     ORDER BY m.created_at ASC`,
    [currentUserId, otherUserId, otherUserId, currentUserId],
    (err, messages) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(messages);
    }
  );
});

// Get all conversations
app.get("/api/conversations", authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT DISTINCT 
       CASE 
         WHEN m.sender_id = ? THEN m.receiver_id 
         ELSE m.sender_id 
       END as user_id,
       u.name as user_name,
       u.profile_picture,
       (SELECT message FROM messages 
        WHERE (sender_id = ? AND receiver_id = user_id) 
           OR (sender_id = user_id AND receiver_id = ?) 
        ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT created_at FROM messages 
        WHERE (sender_id = ? AND receiver_id = user_id) 
           OR (sender_id = user_id AND receiver_id = ?) 
        ORDER BY created_at DESC LIMIT 1) as last_message_time,
       (SELECT COUNT(*) FROM messages 
        WHERE sender_id = user_id AND receiver_id = ? AND is_read = 0) as unread_count
     FROM messages m
     JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.id
     WHERE m.sender_id = ? OR m.receiver_id = ?
     ORDER BY last_message_time DESC`,
    [userId, userId, userId, userId, userId, userId, userId, userId, userId],
    (err, conversations) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(conversations);
    }
  );
});

// Mark messages as read
app.put("/api/messages/:userId/read", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  db.run(
    "UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?",
    [otherUserId, currentUserId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Messages marked as read" });
    }
  );
});

// ==================== REVIEWS ====================

// Create a review
app.post("/api/reviews", authMiddleware, (req, res) => {
  const { project_id, reviewee_id, rating, comment } = req.body;
  const reviewer_id = req.user.id;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // Check if review already exists
  db.get(
    "SELECT id FROM reviews WHERE project_id = ? AND reviewer_id = ?",
    [project_id, reviewer_id],
    (err, existingReview) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existingReview) {
        return res.status(400).json({ error: "You have already reviewed this project" });
      }

      // Insert review
      db.run(
        `INSERT INTO reviews (project_id, reviewer_id, reviewee_id, rating, comment) 
         VALUES (?, ?, ?, ?, ?)`,
        [project_id, reviewer_id, reviewee_id, rating, comment],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          // Update user's average rating
          db.get(
            "SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?",
            [reviewee_id],
            (err, result) => {
              if (err) console.error(err);
              if (result && result.avg_rating) {
                db.run(
                  "UPDATE users SET rating = ? WHERE id = ?",
                  [result.avg_rating, reviewee_id]
                );
              }
            }
          );

          res.status(201).json({ 
            id: this.lastID, 
            message: "Review submitted successfully" 
          });
        }
      );
    }
  );
});

// Get reviews for a user (freelancer)
app.get("/api/reviews/:userId", (req, res) => {
  const userId = req.params.userId;

  db.all(
    `SELECT r.*, 
            u.name as reviewer_name,
            u.profile_picture as reviewer_picture,
            p.title as project_title
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     JOIN projects p ON r.project_id = p.id
     WHERE r.reviewee_id = ?
     ORDER BY r.created_at DESC`,
    [userId],
    (err, reviews) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(reviews);
    }
  );
});

// Get review stats for a user
app.get("/api/reviews/:userId/stats", (req, res) => {
  const userId = req.params.userId;

  db.get(
    `SELECT 
       COUNT(*) as total_reviews,
       AVG(rating) as avg_rating,
       SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
       SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
       SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
       SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
       SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
     FROM reviews 
     WHERE reviewee_id = ?`,
    [userId],
    (err, stats) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(stats);
    }
  );
});

// ========== ANALYTICS ROUTES ==========
// Get client analytics
app.get("/api/analytics/client/:id", (req, res) => {
  const clientId = req.params.id;

  // Get project counts by status
  db.all(
    `SELECT 
       COUNT(*) as total_projects,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_projects,
       SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_projects,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_projects,
       SUM(budget) as total_budget,
       AVG(budget) as avg_budget
     FROM projects 
     WHERE client_id = ?`,
    [clientId],
    (err, projectStats) => {
      if (err) return res.status(500).json({ error: err.message });

      // Get bid statistics
      db.get(
        `SELECT 
           COUNT(DISTINCT b.id) as total_bids_received,
           COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) as pending_bids,
           COUNT(DISTINCT CASE WHEN b.status = 'accepted' THEN b.id END) as accepted_bids,
           COUNT(DISTINCT CASE WHEN b.status = 'rejected' THEN b.id END) as rejected_bids,
           AVG(b.amount) as avg_bid_amount
         FROM bids b
         JOIN projects p ON b.project_id = p.id
         WHERE p.client_id = ?`,
        [clientId],
        (err, bidStats) => {
          if (err) return res.status(500).json({ error: err.message });

          // Get monthly project data for charts (last 6 months)
          db.all(
            `SELECT 
               strftime('%Y-%m', created_at) as month,
               COUNT(*) as count,
               SUM(budget) as total_budget
             FROM projects 
             WHERE client_id = ?
               AND created_at >= date('now', '-6 months')
             GROUP BY strftime('%Y-%m', created_at)
             ORDER BY month ASC`,
            [clientId],
            (err, monthlyData) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({
                projects: projectStats[0],
                bids: bidStats,
                monthly: monthlyData
              });
            }
          );
        }
      );
    }
  );
});

// Get freelancer analytics
app.get("/api/analytics/freelancer/:id", (req, res) => {
  const freelancerId = req.params.id;

  // Get bid statistics
  db.get(
    `SELECT 
       COUNT(*) as total_bids,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bids,
       SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_bids,
       SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_bids,
       SUM(amount) as total_bid_value,
       AVG(amount) as avg_bid_amount,
       SUM(CASE WHEN status = 'accepted' THEN amount ELSE 0 END) as total_earnings
     FROM bids 
     WHERE freelancer_id = ?`,
    [freelancerId],
    (err, bidStats) => {
      if (err) return res.status(500).json({ error: err.message });

      // Get project statistics
      db.get(
        `SELECT 
           COUNT(*) as total_projects,
           SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active_projects,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
           SUM(budget) as total_project_value
         FROM projects 
         WHERE freelancer_id = ?`,
        [freelancerId],
        (err, projectStats) => {
          if (err) return res.status(500).json({ error: err.message });

          // Get monthly bid data for charts (last 6 months)
          db.all(
            `SELECT 
               strftime('%Y-%m', created_at) as month,
               COUNT(*) as count,
               SUM(amount) as total_amount,
               SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_count
             FROM bids 
             WHERE freelancer_id = ?
               AND created_at >= date('now', '-6 months')
             GROUP BY strftime('%Y-%m', created_at)
             ORDER BY month ASC`,
            [freelancerId],
            (err, monthlyData) => {
              if (err) return res.status(500).json({ error: err.message });

              // Calculate success rate
              const successRate = bidStats.total_bids > 0 
                ? ((bidStats.accepted_bids / bidStats.total_bids) * 100).toFixed(1)
                : 0;

              res.json({
                bids: { ...bidStats, success_rate: successRate },
                projects: projectStats,
                monthly: monthlyData
              });
            }
          );
        }
      );
    }
  );
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// Socket.IO setup
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3001",
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

  socket.on('send_message', (message) => {
    const receiverSocketId = onlineUsers.get(message.receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', message);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('users_online', Array.from(onlineUsers.keys()));
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

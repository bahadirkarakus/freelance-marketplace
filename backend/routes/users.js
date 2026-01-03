const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const { adminCheck } = require('../utils/helpers');

// Search freelancers with filters
router.get("/search", (req, res) => {
  const { 
    q,           // search query (name, skills)
    min_rate,    // minimum hourly rate
    max_rate,    // maximum hourly rate
    min_rating,  // minimum rating
    sort = 'rating', // sort by: rating, rate_asc, rate_desc, date
    page = 1, 
    limit = 12 
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, name, bio, skills, hourly_rate, rating, profile_picture, created_at
    FROM users 
    WHERE user_type = 'freelancer'
  `;
  let countQuery = `SELECT COUNT(*) as total FROM users WHERE user_type = 'freelancer'`;
  const params = [];
  const countParams = [];

  // Search filter
  if (q) {
    query += ` AND (name LIKE ? OR skills LIKE ? OR bio LIKE ?)`;
    countQuery += ` AND (name LIKE ? OR skills LIKE ? OR bio LIKE ?)`;
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  // Rate filters
  if (min_rate) {
    query += ` AND hourly_rate >= ?`;
    countQuery += ` AND hourly_rate >= ?`;
    params.push(Number(min_rate));
    countParams.push(Number(min_rate));
  }

  if (max_rate) {
    query += ` AND hourly_rate <= ?`;
    countQuery += ` AND hourly_rate <= ?`;
    params.push(Number(max_rate));
    countParams.push(Number(max_rate));
  }

  // Rating filter
  if (min_rating) {
    query += ` AND rating >= ?`;
    countQuery += ` AND rating >= ?`;
    params.push(Number(min_rating));
    countParams.push(Number(min_rating));
  }

  // Sorting
  switch (sort) {
    case 'rate_asc':
      query += ` ORDER BY hourly_rate ASC`;
      break;
    case 'rate_desc':
      query += ` ORDER BY hourly_rate DESC`;
      break;
    case 'date':
      query += ` ORDER BY created_at DESC`;
      break;
    case 'rating':
    default:
      query += ` ORDER BY rating DESC`;
      break;
  }

  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get paginated freelancers
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

// Get all freelancers
router.get("/freelancers", (req, res) => {
  db.all(
    `SELECT id, name, bio, skills, hourly_rate, rating, profile_picture 
     FROM users WHERE user_type = 'freelancer' ORDER BY rating DESC`,
    [],
    (err, freelancers) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(freelancers);
    }
  );
});

// Get user by ID
router.get("/:id", (req, res) => {
  db.get(
    `SELECT id, email, name, user_type, bio, skills, hourly_rate, rating, profile_picture, created_at 
     FROM users WHERE id = ?`,
    [req.params.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    }
  );
});

// Update user profile (Protected)
router.put("/:id", authMiddleware, (req, res) => {
  const { name, bio, skills, hourly_rate } = req.body;
  const userId = req.params.id;

  // Security: Users can only update their own profile
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  db.run(
    `UPDATE users SET name = ?, bio = ?, skills = ?, hourly_rate = ? WHERE id = ?`,
    [name, bio, skills, hourly_rate, userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

// Upload profile picture (Protected)
router.post("/:id/upload-picture", authMiddleware, upload.single('profile_picture'), (req, res) => {
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

// Get user's projects
router.get("/:id/projects", (req, res) => {
  db.all(
    "SELECT * FROM projects WHERE client_id = ? OR freelancer_id = ? ORDER BY created_at DESC",
    [req.params.id, req.params.id],
    (err, projects) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(projects);
    }
  );
});

// Get user's reviews
router.get("/:id/reviews", (req, res) => {
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

// ========== WALLET ROUTES ==========

// Get wallet balance
router.get("/:id/wallet", authMiddleware, (req, res) => {
  const userId = req.params.id;

  // Security: Users can only view their own wallet
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  db.get(
    "SELECT id, balance FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ balance: user.balance });
    }
  );
});

// Deposit to wallet
router.post("/:id/wallet/deposit", authMiddleware, (req, res) => {
  const { amount } = req.body;
  const userId = req.params.id;

  // Security: Users can only deposit to their own wallet
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  db.run(
    "UPDATE users SET balance = balance + ? WHERE id = ?",
    [amount, userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ 
        message: "Deposit successful",
        amount,
        timestamp: new Date().toISOString()
      });
    }
  );
});

// ========== ANALYTICS ROUTES ==========

// Get client analytics
router.get("/analytics/client/:id", (req, res) => {
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
router.get("/analytics/freelancer/:id", (req, res) => {
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

// ========== ADMIN ROUTES ==========

// Get admin dashboard stats
router.get('/admin/stats', authMiddleware, adminCheck, (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as total FROM users', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalUsers = row.total;
    
    db.get('SELECT COUNT(*) as total FROM users WHERE user_type = "freelancer"', [], (err, row) => {
      stats.totalFreelancers = row.total;
      
      db.get('SELECT COUNT(*) as total FROM users WHERE user_type = "client"', [], (err, row) => {
        stats.totalClients = row.total;
        
        db.get('SELECT COUNT(*) as total FROM projects', [], (err, row) => {
          stats.totalProjects = row.total;
          
          db.get('SELECT COUNT(*) as total FROM projects WHERE status = "open"', [], (err, row) => {
            stats.openProjects = row.total;
            
            db.get('SELECT COUNT(*) as total FROM projects WHERE status = "completed"', [], (err, row) => {
              stats.completedProjects = row.total;
              
              db.get('SELECT COUNT(*) as total FROM bids', [], (err, row) => {
                stats.totalBids = row.total;
                
                db.get('SELECT SUM(amount) as total FROM payments WHERE status = "SUCCESS"', [], (err, row) => {
                  stats.totalRevenue = row.total || 0;
                  
                  db.get('SELECT COUNT(*) as total FROM messages', [], (err, row) => {
                    stats.totalMessages = row.total;
                    
                    // Get recent activity
                    db.all(`
                      SELECT 'user' as type, name as title, created_at 
                      FROM users ORDER BY created_at DESC LIMIT 5
                    `, [], (err, recentUsers) => {
                      stats.recentUsers = recentUsers || [];
                      
                      db.all(`
                        SELECT 'project' as type, title, created_at 
                        FROM projects ORDER BY created_at DESC LIMIT 5
                      `, [], (err, recentProjects) => {
                        stats.recentProjects = recentProjects || [];
                        
                        res.json(stats);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Get all users (admin)
router.get('/admin/users', authMiddleware, adminCheck, (req, res) => {
  const { page = 1, limit = 20, search, user_type } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `SELECT id, email, name, user_type, bio, skills, hourly_rate, rating, profile_picture, is_admin, created_at FROM users WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
  const params = [];
  const countParams = [];
  
  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ?)`;
    countQuery += ` AND (name LIKE ? OR email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
    countParams.push(`%${search}%`, `%${search}%`);
  }
  
  if (user_type) {
    query += ` AND user_type = ?`;
    countQuery += ` AND user_type = ?`;
    params.push(user_type);
    countParams.push(user_type);
  }
  
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(query, params, (err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        users,
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

// Update user (admin)
router.put('/admin/users/:id', authMiddleware, adminCheck, (req, res) => {
  const { id } = req.params;
  const { name, email, user_type, is_admin, bio, skills, hourly_rate } = req.body;
  
  db.run(
    `UPDATE users SET name = ?, email = ?, user_type = ?, is_admin = ?, bio = ?, skills = ?, hourly_rate = ?
     WHERE id = ?`,
    [name, email, user_type, is_admin ? 1 : 0, bio, skills, hourly_rate, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete user (admin)
router.delete('/admin/users/:id', authMiddleware, adminCheck, (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting self
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Check if user is admin
router.get('/admin/check', authMiddleware, (req, res) => {
  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ isAdmin: user && user.is_admin === 1 });
  });
});

module.exports = router;

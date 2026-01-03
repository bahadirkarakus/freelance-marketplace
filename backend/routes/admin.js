const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const { adminCheck } = require('../utils/helpers');

// Get admin dashboard stats
router.get('/stats', authMiddleware, adminCheck, (req, res) => {
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
router.get('/users', authMiddleware, adminCheck, (req, res) => {
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

// Get all projects (admin)
router.get('/projects', authMiddleware, adminCheck, (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT p.*, u.name as client_name, u.email as client_email
    FROM projects p
    LEFT JOIN users u ON p.client_id = u.id
    WHERE 1=1
  `;
  let countQuery = `SELECT COUNT(*) as total FROM projects WHERE 1=1`;
  const params = [];
  const countParams = [];
  
  if (status) {
    query += ` AND p.status = ?`;
    countQuery += ` AND status = ?`;
    params.push(status);
    countParams.push(status);
  }
  
  if (search) {
    query += ` AND p.title LIKE ?`;
    countQuery += ` AND title LIKE ?`;
    params.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }
  
  query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
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

// Update user (admin)
router.put('/users/:id', authMiddleware, adminCheck, (req, res) => {
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
router.delete('/users/:id', authMiddleware, adminCheck, (req, res) => {
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

// Delete project (admin)
router.delete('/projects/:id', authMiddleware, adminCheck, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  });
});

// Update project status (admin)
router.put('/projects/:id/status', authMiddleware, adminCheck, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['open', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.run('UPDATE projects SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project status updated successfully' });
  });
});

// Check if user is admin
router.get('/check', authMiddleware, (req, res) => {
  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ isAdmin: user && user.is_admin === 1 });
  });
});

module.exports = router;

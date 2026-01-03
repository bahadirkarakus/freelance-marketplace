const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { validateBid } = require('../middleware/validation');
const { createNotification } = require('../utils/helpers');

// Create bid (Protected - Freelancer only)
router.post("/", authMiddleware, roleCheck(['freelancer']), validateBid, (req, res) => {
  const { project_id, freelancer_id, amount, delivery_time, proposal } = req.body;

  if (!project_id || !freelancer_id || !amount || !proposal) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if freelancer already applied to this project
  db.get(
    `SELECT id FROM bids WHERE project_id = ? AND freelancer_id = ?`,
    [project_id, freelancer_id],
    (err, existingBid) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (existingBid) {
        return res.status(400).json({ error: "You have already applied to this project" });
      }

      // Create bid
      db.run(
        `INSERT INTO bids (project_id, freelancer_id, amount, delivery_time, proposal) 
         VALUES (?, ?, ?, ?, ?)`,
        [project_id, freelancer_id, amount, delivery_time, proposal],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          
          // Get project owner and freelancer name for notification
          db.get(
            `SELECT p.client_id, p.title, u.name as freelancer_name 
             FROM projects p, users u 
             WHERE p.id = ? AND u.id = ?`,
            [project_id, freelancer_id],
            (err, data) => {
              if (!err && data) {
                createNotification(
                  data.client_id,
                  'bid',
                  `${data.freelancer_name} submitted a bid of $${amount} for "${data.title}"`,
                  project_id
                );
              }
            }
          );
          
          res.status(201).json({ id: this.lastID, message: "Bid submitted!" });
        }
      );
    }
  );
});

// Get bids for a project
router.get("/project/:id", (req, res) => {
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
router.get("/freelancer/:id", (req, res) => {
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
router.put("/:id", authMiddleware, (req, res) => {
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
              "UPDATE projects SET status = 'in_progress', assigned_freelancer_id = ? WHERE id = ?",
              [bid.freelancer_id, bid.project_id]
            );
            
            // Send notification to freelancer
            db.get("SELECT title FROM projects WHERE id = ?", [bid.project_id], (err, project) => {
              if (!err && project) {
                createNotification(
                  bid.freelancer_id,
                  'bid',
                  `✅ Your bid for "${project.title}" has been accepted!`,
                  bid.project_id
                );
              }
            });
          }
        });
      }
      
      // If rejected, notify freelancer
      if (status === 'rejected') {
        db.get(
          `SELECT b.freelancer_id, p.title 
           FROM bids b 
           JOIN projects p ON b.project_id = p.id 
           WHERE b.id = ?`,
          [req.params.id],
          (err, data) => {
            if (!err && data) {
              createNotification(
                data.freelancer_id,
                'bid',
                `Your bid for "${data.title}" was not accepted this time`,
                data.project_id
              );
            }
          }
        );
      }
      
      res.json({ message: "Bid updated successfully" });
    }
  );
});

module.exports = router;

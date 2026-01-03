const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');
const { createNotification, adminCheck } = require('../utils/helpers');

// Get all projects (with pagination)
router.get("/", (req, res) => {
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
router.get("/search", (req, res) => {
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
router.get("/:id", (req, res) => {
  db.get(
    `SELECT p.*, 
            u.name as client_name, 
            u.email as client_email,
            f.id as freelancer_id,
            f.name as freelancer_name
     FROM projects p 
     JOIN users u ON p.client_id = u.id 
     LEFT JOIN users f ON p.assigned_freelancer_id = f.id
     WHERE p.id = ?`,
    [req.params.id],
    (err, project) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    }
  );
});

// Create project (Protected)
router.post("/", authMiddleware, validateProject, (req, res) => {
  const { title, description, budget, duration, category } = req.body;
  const client_id = req.user.id;

  if (!title || !description || !budget || !duration || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO projects (title, description, budget, duration, category, client_id, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'open')`,
    [title, description, budget, duration, category, client_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: this.lastID, 
        message: "Project created successfully" 
      });
    }
  );
});

// Update project (Protected)
router.put("/:id", authMiddleware, (req, res) => {
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
router.delete("/:id", authMiddleware, (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  });
});

// ========== ESCROW SYSTEM ROUTES ==========

/**
 * 1️⃣ FREELANCER SUBMITS WORK COMPLETION
 */
router.post("/:id/submit-completion", authMiddleware, (req, res) => {
  const projectId = req.params.id;
  const freelancerId = req.user.id;

  db.get(
    "SELECT * FROM projects WHERE id = ? AND assigned_freelancer_id = ?",
    [projectId, freelancerId],
    (err, project) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!project) return res.status(403).json({ error: "Not authorized. You are not assigned to this project." });
      if (project.status !== 'in_progress') {
        return res.status(400).json({ error: "Project is not in progress" });
      }
      if (project.freelancer_approved) {
        return res.status(400).json({ error: "Work already submitted for approval" });
      }

      db.run(
        `UPDATE projects SET freelancer_approved = 1, completion_date = CURRENT_TIMESTAMP WHERE id = ?`,
        [projectId],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });

          db.run(
            `UPDATE payments SET status = 'in_escrow', freelancer_submitted_at = CURRENT_TIMESTAMP WHERE project_id = ?`,
            [projectId]
          );

          db.get(
            "SELECT client_id, title FROM projects WHERE id = ?",
            [projectId],
            (err, projData) => {
              if (projData) {
                createNotification(
                  projData.client_id,
                  'completion',
                  `✅ Freelancer submitted work for "${projData.title}". Review and approve to release payment.`,
                  projectId
                );
              }
            }
          );

          res.status(200).json({ 
            success: true,
            message: "✅ Work submitted for client approval!",
            status: "waiting_client_approval"
          });
        }
      );
    }
  );
});

/**
 * 2️⃣ CLIENT APPROVES WORK & RELEASES PAYMENT
 */
router.post("/:id/approve-completion", authMiddleware, (req, res) => {
  const projectId = req.params.id;
  const clientId = req.user.id;

  db.get(
    "SELECT * FROM projects WHERE id = ? AND client_id = ?",
    [projectId, clientId],
    (err, project) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!project) return res.status(403).json({ error: "Not authorized. You are not the project owner." });
      if (!project.freelancer_approved) {
        return res.status(400).json({ error: "Freelancer hasn't submitted work yet" });
      }
      if (project.client_approved) {
        return res.status(400).json({ error: "Work already approved" });
      }

      db.get(
        "SELECT * FROM payments WHERE project_id = ?",
        [projectId],
        (err, payment) => {
          if (err) return res.status(500).json({ error: err.message });
          if (!payment) return res.status(400).json({ error: "Payment record not found" });

          const freelancerId = project.assigned_freelancer_id;
          const amount = payment.amount;

          db.serialize(() => {
            db.get(
              "SELECT balance FROM users WHERE id = ?",
              [clientId],
              (err, clientData) => {
                if (err) return res.status(500).json({ error: err.message });
                if (clientData.balance < amount) {
                  return res.status(400).json({ error: "Insufficient balance to release payment" });
                }

                db.run(
                  "UPDATE users SET balance = balance - ? WHERE id = ?",
                  [amount, clientId],
                  (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    db.run(
                      "UPDATE users SET balance = balance + ? WHERE id = ?",
                      [amount, freelancerId],
                      (err) => {
                        if (err) return res.status(500).json({ error: err.message });

                        db.run(
                          `UPDATE projects SET client_approved = 1, status = 'completed' WHERE id = ?`,
                          [projectId]
                        );

                        db.run(
                          `UPDATE payments SET status = 'completed', client_approved_at = CURRENT_TIMESTAMP WHERE project_id = ?`,
                          [projectId]
                        );

                        db.get(
                          "SELECT title FROM projects WHERE id = ?",
                          [projectId],
                          (err, projData) => {
                            if (projData) {
                              createNotification(
                                freelancerId,
                                'payment',
                                `💰 Payment approved! $${amount} received for "${projData.title}"`,
                                projectId
                              );
                            }
                          }
                        );

                        res.status(200).json({
                          success: true,
                          message: "✅ Work approved! Payment released to freelancer.",
                          payment: {
                            amount,
                            status: "completed",
                            freelancer_id: freelancerId
                          }
                        });
                      }
                    );
                  }
                );
              }
            );
          });
        }
      );
    }
  );
});

/**
 * 3️⃣ CLIENT REJECTS WORK & OPENS DISPUTE
 */
router.post("/:id/reject-completion", authMiddleware, (req, res) => {
  const { reason } = req.body;
  const projectId = req.params.id;
  const clientId = req.user.id;

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ error: "Please provide a reason for rejection" });
  }

  db.get(
    "SELECT * FROM projects WHERE id = ? AND client_id = ?",
    [projectId, clientId],
    (err, project) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!project) return res.status(403).json({ error: "Not authorized" });
      if (!project.freelancer_approved) {
        return res.status(400).json({ error: "No work submitted to reject" });
      }

      db.run(
        `INSERT INTO disputes (project_id, created_by, reason, status) VALUES (?, ?, ?, 'open')`,
        [projectId, clientId, reason],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });

          db.run(
            `UPDATE payments SET status = 'disputed' WHERE project_id = ?`,
            [projectId]
          );

          db.run(
            `UPDATE projects SET status = 'in_dispute' WHERE id = ?`,
            [projectId]
          );

          db.get(
            "SELECT assigned_freelancer_id FROM projects WHERE id = ?",
            [projectId],
            (err, projData) => {
              if (projData) {
                createNotification(
                  projData.assigned_freelancer_id,
                  'dispute',
                  `⚠️ Your work was rejected. Reason: "${reason}". Admin will review.`,
                  projectId
                );
              }
            }
          );

          db.all(
            "SELECT id FROM users WHERE is_admin = 1",
            [],
            (err, admins) => {
              admins?.forEach(admin => {
                createNotification(
                  admin.id,
                  'dispute',
                  `New dispute opened for project #${projectId}. Reason: "${reason}"`,
                  projectId
                );
              });
            }
          );

          res.status(201).json({
            success: true,
            message: "⚠️ Dispute created. Payment is held in escrow. Admins will review.",
            dispute_id: this.lastID,
            status: "in_dispute"
          });
        }
      );
    }
  );
});

/**
 * 4️⃣ ADMIN RESOLVES DISPUTE
 */
router.post("/:id/resolve-dispute", authMiddleware, adminCheck, (req, res) => {
  const { resolution, admin_comment } = req.body;
  const projectId = req.params.id;

  if (!['approve', 'refund'].includes(resolution)) {
    return res.status(400).json({ error: "Invalid resolution. Use 'approve' or 'refund'" });
  }

  db.get(
    "SELECT * FROM disputes WHERE project_id = ?",
    [projectId],
    (err, dispute) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!dispute) return res.status(404).json({ error: "Dispute not found" });

      db.get(
        "SELECT p.*, py.amount FROM projects p JOIN payments py ON p.id = py.project_id WHERE p.id = ?",
        [projectId],
        (err, projectData) => {
          if (err) return res.status(500).json({ error: err.message });

          const amount = projectData.amount;
          const freelancerId = projectData.assigned_freelancer_id;
          const clientId = projectData.client_id;

          db.serialize(() => {
            if (resolution === 'approve') {
              db.run(
                "UPDATE users SET balance = balance - ? WHERE id = ?",
                [amount, clientId]
              );
              db.run(
                "UPDATE users SET balance = balance + ? WHERE id = ?",
                [amount, freelancerId]
              );
              db.run(
                `UPDATE payments SET status = 'completed' WHERE project_id = ?`,
                [projectId]
              );
            } else if (resolution === 'refund') {
              db.run(
                `UPDATE payments SET status = 'refunded' WHERE project_id = ?`,
                [projectId]
              );
            }

            db.run(
              `UPDATE disputes SET status = ?, admin_comment = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?`,
              [resolution === 'approve' ? 'resolved' : 'refunded', admin_comment, dispute.id]
            );

            db.run(
              `UPDATE projects SET status = ? WHERE id = ?`,
              [resolution === 'approve' ? 'completed' : 'cancelled', projectId]
            );

            createNotification(
              clientId,
              'dispute_resolved',
              `Dispute resolved. ${resolution === 'approve' ? 'Freelancer approved.' : 'Payment refunded.'}`,
              projectId
            );
            createNotification(
              freelancerId,
              'dispute_resolved',
              `Dispute resolved. ${resolution === 'approve' ? 'Payment released.' : 'Work rejected, payment refunded to client.'}`,
              projectId
            );

            res.status(200).json({
              success: true,
              message: `✅ Dispute resolved: ${resolution}`,
              resolution,
              amount
            });
          });
        }
      );
    }
  );
});

module.exports = router;

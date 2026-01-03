const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createNotification, adminCheck } = require('../utils/helpers');

/**
 * Payment System - Full Workflow Implementation
 * State Machine: NOT_CREATED → PENDING → SUCCESS / FAILED
 * Security: Only client can pay, only for accepted bids, no duplicate payments
 */

// POST /api/payments/pay - Client pays accepted freelancer
router.post("/pay", authMiddleware, roleCheck(['client']), async (req, res) => {
  const { project_id, bid_id, amount } = req.body;
  const client_id = req.user.id;

  try {
    // ✅ VALIDATION 1: Required fields
    if (!project_id || !bid_id || !amount) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["project_id", "bid_id", "amount"]
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Payment amount must be positive" });
    }

    // ✅ SECURITY 1: Verify project ownership
    const project = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM projects WHERE id = ? AND client_id = ?`,
        [project_id, client_id],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (!project) {
      return res.status(403).json({ 
        error: "Authorization failed: You don't own this project" 
      });
    }

    // ✅ BUSINESS RULE 1: Verify bid is ACCEPTED
    const bid = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM bids WHERE id = ? AND project_id = ? AND status = 'accepted'`,
        [bid_id, project_id],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (!bid) {
      return res.status(400).json({ 
        error: "Business rule violation: Payment only allowed for accepted bids",
        current_bid_status: bid?.status || 'not_found'
      });
    }

    // ✅ SECURITY 2: Prevent duplicate payments
    const existingPayment = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM payments WHERE project_id = ? AND bid_id = ? AND status = 'SUCCESS'`,
        [project_id, bid_id],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (existingPayment) {
      return res.status(400).json({ 
        error: "Duplicate payment prevented: This job is already paid",
        payment_id: existingPayment.id,
        paid_at: existingPayment.completed_at
      });
    }

    // 🔸 STEP 1: Create PENDING payment record
    const transaction_id = `SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment_id = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO payments (project_id, bid_id, client_id, freelancer_id, amount, status, payment_method, transaction_id) 
         VALUES (?, ?, ?, ?, ?, 'PENDING', 'simulated', ?)`,
        [project_id, bid_id, client_id, bid.freelancer_id, amount, transaction_id],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // 🎬 SIMULATE PROCESSING (1.5 seconds - realistic delay)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 🔸 STEP 2: Mark payment as SUCCESS
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE payments SET status = 'SUCCESS', completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [payment_id],
        (err) => err ? reject(err) : resolve()
      );
    });

    // 🔸 STEP 3: Update project status to PAID (in_progress)
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE projects SET status = 'in_progress' WHERE id = ?`,
        [project_id],
        (err) => err ? reject(err) : resolve()
      );
    });

    // 🔸 STEP 4: Transfer funds (wallet to wallet)
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET balance = balance - ? WHERE id = ?`,
        [amount, client_id],
        (err) => err ? reject(err) : resolve()
      );
    });

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET balance = balance + ? WHERE id = ?`,
        [amount, bid.freelancer_id],
        (err) => err ? reject(err) : resolve()
      );
    });

    // 🔔 STEP 5: Notify freelancer
    const projectData = await new Promise((resolve, reject) => {
      db.get(
        `SELECT p.title, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = ?`,
        [project_id],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    if (projectData) {
      createNotification(
        bid.freelancer_id,
        'payment',
        `💰 Payment received: $${amount} for "${projectData.title}"`,
        project_id
      );
    }

    // ✅ SUCCESS RESPONSE
    res.status(201).json({
      success: true,
      message: "Payment processed successfully",
      payment: {
        id: payment_id,
        transaction_id,
        amount,
        status: 'SUCCESS',
        project_id,
        freelancer_id: bid.freelancer_id
      }
    });

  } catch (error) {
    console.error('Payment error:', error);
    
    res.status(500).json({ 
      error: "Payment processing failed",
      details: error.message 
    });
  }
});

// Get payment status
router.get("/:id", authMiddleware, (req, res) => {
  const payment_id = req.params.id;

  db.get(
    `SELECT p.*, pr.title as project_title, u.name as freelancer_name
     FROM payments p
     JOIN projects pr ON p.project_id = pr.id
     JOIN users u ON p.freelancer_id = u.id
     WHERE p.id = ?`,
    [payment_id],
    (err, payment) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Security: Only client or freelancer can view payment
      if (payment.client_id !== req.user.id && payment.freelancer_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(payment);
    }
  );
});

// Get payments for a project
router.get("/project/:id", authMiddleware, (req, res) => {
  const project_id = req.params.id;

  db.all(
    `SELECT p.*, u.name as freelancer_name
     FROM payments p
     JOIN users u ON p.freelancer_id = u.id
     WHERE p.project_id = ?
     ORDER BY p.created_at DESC`,
    [project_id],
    (err, payments) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(payments);
    }
  );
});

module.exports = router;

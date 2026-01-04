const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

// Get notifications for logged-in user
router.get('/', authMiddleware, (req, res) => {
  db.all(
    `SELECT id, user_id, type, title, message, read as is_read, created_at, related_id 
     FROM notifications 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [req.user.id],
    (err, notifications) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(notifications);
    }
  );
});

// Mark notification as read
router.put('/:id/read', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  db.run(
    `UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?`,
    [id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
});

// Mark all notifications as read
router.put('/read-all', authMiddleware, (req, res) => {
  db.run(
    `UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0`,
    [req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `${this.changes} notifications marked as read` });
    }
  );
});

module.exports = router;

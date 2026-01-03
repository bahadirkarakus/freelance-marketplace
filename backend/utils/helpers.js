const db = require('../database');

/**
 * Create notification for user
 * @param {number} userId - User ID to notify
 * @param {string} type - Notification type (bid, payment, message, dispute, etc)
 * @param {string} message - Notification message
 * @param {number} relatedId - Related project/user/bid ID
 */
function createNotification(userId, type, message, relatedId = null) {
  db.run(
    `INSERT INTO notifications (user_id, type, message, related_id) VALUES (?, ?, ?, ?)`,
    [userId, type, message, relatedId],
    (err) => {
      if (err) console.error('Error creating notification:', err);
    }
  );
}

/**
 * Admin middleware - checks if user is admin
 */
const adminCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

module.exports = {
  createNotification,
  adminCheck
};

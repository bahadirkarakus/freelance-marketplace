const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('../utils/helpers');

// Get all conversations  
router.get("/conversations", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all users user has messaged with
    const userIds = await new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT 
           CASE 
             WHEN sender_id = ? THEN receiver_id 
             ELSE sender_id 
           END as other_user_id
         FROM messages 
         WHERE sender_id = ? OR receiver_id = ?`,
        [userId, userId, userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    if (userIds.length === 0) {
      return res.json([]);
    }

    // Get conversation details for each user
    const conversationPromises = userIds.map(row => {
      return new Promise((resolve, reject) => {
        const otherUserId = row.other_user_id;
        
        db.get(
          `SELECT 
             u.id as user_id,
             u.name as user_name,
             u.profile_picture
           FROM users u WHERE u.id = ?`,
          [otherUserId],
          (err, userData) => {
            if (err || !userData) {
              resolve(null);
              return;
            }

            // Get last message
            db.get(
              `SELECT message, created_at 
               FROM messages 
               WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
               ORDER BY created_at DESC LIMIT 1`,
              [userId, otherUserId, otherUserId, userId],
              (err, lastMsg) => {
                // Get unread message count
                db.get(
                  `SELECT COUNT(*) as count FROM messages 
                   WHERE sender_id = ? AND receiver_id = ? AND read = 0`,
                  [otherUserId, userId],
                  (err, unread) => {
                    resolve({
                      user_id: userData.user_id,
                      user_name: userData.user_name,
                      profile_picture: userData.profile_picture,
                      last_message: lastMsg?.message || '',
                      last_message_time: lastMsg?.created_at || '',
                      unread_count: unread?.count || 0
                    });
                  }
                );
              }
            );
          }
        );
      });
    });

    const conversations = (await Promise.all(conversationPromises)).filter(c => c !== null);
    
    // Sort by last message time
    conversations.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    
    res.json(conversations);
    
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post("/", authMiddleware, (req, res) => {
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
      
      const messageId = this.lastID;
      
      // Get the created message with user info
      db.get(
        `SELECT m.*, s.name as sender_name, r.name as receiver_name 
         FROM messages m 
         JOIN users s ON m.sender_id = s.id 
         JOIN users r ON m.receiver_id = r.id 
         WHERE m.id = ?`,
        [messageId],
        (err, msgData) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Create notification for receiver
          createNotification(
            receiver_id,
            'message',
            `💬 ${msgData.sender_name}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
            sender_id
          );
          
          res.status(201).json({ message: "Message sent!", data: msgData });
        }
      );
    }
  );
});

// Get conversation between two users
router.get("/:userId", authMiddleware, (req, res) => {
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

// Mark messages as read
router.put("/:userId/read", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  db.run(
    "UPDATE messages SET read = 1 WHERE sender_id = ? AND receiver_id = ?",
    [otherUserId, currentUserId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Messages marked as read" });
    }
  );
});

module.exports = router;

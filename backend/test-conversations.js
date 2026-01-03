const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const userId = 9; // Bahadır

console.log('Testing conversations for user:', userId);

// Test 1: Get all messages
db.all('SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId], (err, rows) => {
  console.log('\n1. All messages for user', userId, ':');
  console.log(rows);
  
  // Test 2: Get distinct user IDs
  db.all(`SELECT DISTINCT 
       CASE 
         WHEN sender_id = ? THEN receiver_id 
         ELSE sender_id 
       END as other_user_id
     FROM messages 
     WHERE sender_id = ? OR receiver_id = ?`, [userId, userId, userId], (err, userIds) => {
    console.log('\n2. Other user IDs:', userIds);
    
    if (userIds && userIds.length > 0) {
      const otherUserId = userIds[0].other_user_id;
      
      // Test 3: Get user info
      db.get('SELECT id, name, profile_picture FROM users WHERE id = ?', [otherUserId], (err, user) => {
        console.log('\n3. Other user info:', user);
        
        // Test 4: Get last message
        db.get(`SELECT message, created_at FROM messages 
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                ORDER BY created_at DESC LIMIT 1`, 
          [userId, otherUserId, otherUserId, userId], (err, lastMsg) => {
          console.log('\n4. Last message:', lastMsg);
          
          db.close();
        });
      });
    } else {
      db.close();
    }
  });
});

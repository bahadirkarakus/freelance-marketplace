const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('bid', 'message', 'payment', 'review', 'project')),
    message TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Notifications table created successfully!');
  }
  db.close();
});

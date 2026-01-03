const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// First add the is_admin column if it doesn't exist
db.all("PRAGMA table_info(users)", (err, columns) => {
  if (err) {
    console.error('Error checking columns:', err);
    db.close();
    return;
  }
  
  const hasIsAdmin = columns.some(col => col.name === 'is_admin');
  
  if (!hasIsAdmin) {
    console.log('Adding is_admin column...');
    db.run("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0", (err) => {
      if (err) {
        console.error('Error adding column:', err);
        db.close();
        return;
      }
      console.log('✅ is_admin column added');
      setAdmin();
    });
  } else {
    console.log('is_admin column already exists');
    setAdmin();
  }
});

function setAdmin() {
  // Set user with id=1 as admin
  db.run("UPDATE users SET is_admin = 1 WHERE id = 1", function(err) {
    if (err) {
      console.error('Error setting admin:', err);
    } else {
      console.log('✅ User with id=1 is now an admin');
    }
    
    // Verify
    db.get("SELECT id, name, email, is_admin FROM users WHERE id = 1", (err, row) => {
      if (row) {
        console.log('\n📋 Admin user info:');
        console.log('   ID:', row.id);
        console.log('   Name:', row.name);
        console.log('   Email:', row.email);
        console.log('   Is Admin:', row.is_admin ? 'Yes ✓' : 'No');
      }
      db.close();
    });
  });
}

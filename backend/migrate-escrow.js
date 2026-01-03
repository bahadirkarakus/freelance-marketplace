/**
 * 🔒 ESCROW SYSTEM - Database Migration
 * Runs once to add escrow fields to existing tables
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

console.log('🔄 Running escrow system migration...\n');

// Add columns to projects table if they don't exist
db.serialize(() => {
  // Projects table - Add escrow columns
  db.run(`ALTER TABLE projects ADD COLUMN freelancer_approved BOOLEAN DEFAULT 0`, (err) => {
    if (err && err.message.includes('duplicate')) {
      console.log('✅ freelancer_approved column already exists');
    } else if (err) {
      console.error('❌ Error adding freelancer_approved:', err.message);
    } else {
      console.log('✅ Added freelancer_approved column');
    }
  });

  db.run(`ALTER TABLE projects ADD COLUMN client_approved BOOLEAN DEFAULT 0`, (err) => {
    if (err && err.message.includes('duplicate')) {
      console.log('✅ client_approved column already exists');
    } else if (err) {
      console.error('❌ Error adding client_approved:', err.message);
    } else {
      console.log('✅ Added client_approved column');
    }
  });

  db.run(`ALTER TABLE projects ADD COLUMN completion_date DATETIME`, (err) => {
    if (err && err.message.includes('duplicate')) {
      console.log('✅ completion_date column already exists');
    } else if (err) {
      console.error('❌ Error adding completion_date:', err.message);
    } else {
      console.log('✅ Added completion_date column');
    }
  });

  // Create payments table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      bid_id INTEGER,
      client_id INTEGER NOT NULL,
      freelancer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_escrow', 'completed', 'disputed', 'refunded')),
      freelancer_submitted_at DATETIME,
      client_approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (bid_id) REFERENCES bids(id),
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err && err.message.includes('already exists')) {
      console.log('✅ Payments table already exists');
    } else if (err) {
      console.error('❌ Error creating payments table:', err.message);
    } else {
      console.log('✅ Created payments table');
    }
  });

  // Create disputes table
  db.run(`
    CREATE TABLE IF NOT EXISTS disputes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'resolved', 'refunded')),
      admin_comment TEXT,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `, (err) => {
    if (err && err.message.includes('already exists')) {
      console.log('✅ Disputes table already exists');
    } else if (err) {
      console.error('❌ Error creating disputes table:', err.message);
    } else {
      console.log('✅ Created disputes table');
    }
  });

  setTimeout(() => {
    console.log('\n✅ Migration completed successfully!\n');
    db.close();
  }, 1000);
});

const db = require('./database');

// Add missing columns for escrow system
const columns = [
  "ALTER TABLE projects ADD COLUMN freelancer_approved INTEGER DEFAULT 0",
  "ALTER TABLE projects ADD COLUMN client_approved INTEGER DEFAULT 0", 
  "ALTER TABLE projects ADD COLUMN completion_date DATETIME"
];

let completed = 0;
columns.forEach(sql => {
  db.run(sql, (err) => {
    if (err) {
      if (err.message.includes('duplicate column')) {
        console.log('Column already exists:', sql.split('ADD COLUMN ')[1].split(' ')[0]);
      } else {
        console.error('Error:', err.message);
      }
    } else {
      console.log('Added column:', sql.split('ADD COLUMN ')[1].split(' ')[0]);
    }
    completed++;
    if (completed === columns.length) {
      db.close();
      console.log('Done!');
    }
  });
});

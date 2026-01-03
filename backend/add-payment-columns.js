const db = require('./database');

const alterations = [
  "ALTER TABLE payments ADD COLUMN client_approved_at DATETIME",
  "ALTER TABLE payments ADD COLUMN freelancer_submitted_at DATETIME"
];

let completed = 0;
alterations.forEach(sql => {
  db.run(sql, (err) => {
    if (err) {
      if (err.message.includes('duplicate column')) {
        console.log('Column already exists');
      } else {
        console.error('Error:', err.message);
      }
    } else {
      console.log('Success:', sql.split('ADD COLUMN ')[1]);
    }
    completed++;
    if (completed === alterations.length) {
      db.close();
      console.log('Done!');
    }
  });
});

const db = require('./database');

db.run(
  `INSERT INTO payments (project_id, bid_id, client_id, freelancer_id, amount, status, payment_method) 
   VALUES (14, 14, 47, 48, 200, 'PENDING', 'simulated')`,
  function(err) {
    if (err) console.error('Error:', err.message);
    else console.log('Created payment ID:', this.lastID);
    db.close();
  }
);

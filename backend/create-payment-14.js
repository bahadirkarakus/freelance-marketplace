const db = require('./database');

// Create payment record for project 14
db.get(
  `SELECT b.id as bid_id, b.amount, b.freelancer_id, p.client_id 
   FROM bids b 
   JOIN projects p ON b.project_id = p.id 
   WHERE b.project_id = 14 AND b.status = 'accepted'`,
  [],
  (err, bid) => {
    if (err) {
      console.error('Error:', err);
      db.close();
      return;
    }
    
    if (!bid) {
      console.log('No accepted bid found for project 14');
      db.close();
      return;
    }
    
    console.log('Found bid:', bid);
    
    // Check if payment already exists
    db.get('SELECT id FROM payments WHERE project_id = 14', [], (err, existing) => {
      if (existing) {
        console.log('Payment already exists for project 14');
        db.close();
        return;
      }
      
      db.run(
        `INSERT INTO payments (project_id, bid_id, client_id, freelancer_id, amount, status, payment_method) 
         VALUES (14, ?, ?, ?, ?, 'pending', 'escrow')`,
        [bid.bid_id, bid.client_id, bid.freelancer_id, bid.amount],
        function(err) {
          if (err) {
            console.error('Error creating payment:', err);
          } else {
            console.log('Payment created with ID:', this.lastID);
          }
          db.close();
        }
      );
    });
  }
);

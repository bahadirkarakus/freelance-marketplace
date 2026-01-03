const db = require('./database');
db.run("UPDATE bids SET status = 'pending' WHERE id = 13", function(err) {
  if(err) console.error(err);
  else console.log('Updated', this.changes, 'rows');
  db.close();
});

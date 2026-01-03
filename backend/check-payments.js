const db = require('./database');
db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='payments'", [], (err, row) => { 
  console.log(row?.sql); 
  db.close(); 
});

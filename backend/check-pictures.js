const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all("SELECT id, name, profile_picture FROM users WHERE user_type = 'freelancer'", (err, rows) => {
  console.log('Freelancer profile pictures:');
  rows.forEach(r => {
    console.log(`${r.id}. ${r.name}: ${r.profile_picture || 'NO PICTURE'}`);
  });
  db.close();
});

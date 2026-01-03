const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Balance kolonu ekle
db.run(`ALTER TABLE users ADD COLUMN balance REAL DEFAULT 1000`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column')) {
      console.log('Balance kolonu zaten var');
    } else {
      console.log('Hata:', err.message);
    }
  } else {
    console.log('✅ Balance kolonu eklendi!');
  }
  
  // Mevcut kullanıcılara $1000 ver
  db.run(`UPDATE users SET balance = 1000 WHERE balance IS NULL`, (err) => {
    if (err) console.log('Update hatası:', err.message);
    else console.log('✅ Tüm kullanıcılara $1000 bakiye verildi!');
    
    // Kontrol et
    db.all(`SELECT id, name, user_type, balance FROM users`, (err, rows) => {
      console.log('\n📊 Kullanıcı Bakiyeleri:');
      rows.forEach(u => console.log(`  ${u.name} (${u.user_type}): $${u.balance}`));
      db.close();
    });
  });
});

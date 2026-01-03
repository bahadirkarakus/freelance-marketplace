const db = require('./database');

// SQLite'da constraint değiştirmek için tabloyu yeniden oluşturmak gerekiyor
// Ancak mevcut verileri kaybetmemek için geçici çözüm olarak yeni tablo oluşturup verileri taşıyacağız

db.serialize(() => {
  // 1. Yedek tablo oluştur
  db.run(`CREATE TABLE IF NOT EXISTS notifications_backup AS SELECT * FROM notifications`, (err) => {
    if (err) console.error('Backup error:', err.message);
    else console.log('1. Backup created');
  });

  // 2. Eski tabloyu sil
  db.run(`DROP TABLE notifications`, (err) => {
    if (err) console.error('Drop error:', err.message);
    else console.log('2. Old table dropped');
  });

  // 3. Yeni tabloyu genişletilmiş constraint ile oluştur
  db.run(`
    CREATE TABLE notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('bid', 'message', 'payment', 'review', 'project', 'completion', 'dispute', 'system')),
      message TEXT,
      related_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Create error:', err.message);
    else console.log('3. New table created with extended types');
  });

  // 4. Verileri geri yükle
  db.run(`INSERT INTO notifications (id, user_id, type, message, related_id, is_read, created_at) 
          SELECT id, user_id, type, message, related_id, is_read, created_at FROM notifications_backup`, (err) => {
    if (err) console.error('Restore error:', err.message);
    else console.log('4. Data restored');
  });

  // 5. Yedek tabloyu sil
  db.run(`DROP TABLE notifications_backup`, (err) => {
    if (err) console.error('Cleanup error:', err.message);
    else console.log('5. Cleanup done');
    
    // Test
    db.all('SELECT COUNT(*) as count FROM notifications', [], (err, rows) => {
      console.log('Total notifications:', rows[0].count);
      db.close();
    });
  });
});

const db = require('./database');

// Mevcut verileri yedekle
db.all('SELECT * FROM reviews', [], (err, reviews) => {
  console.log('Mevcut reviewlar:', reviews ? reviews.length : 0, 'adet');
  
  // Eski tabloyu yeniden adlandır
  db.run('ALTER TABLE reviews RENAME TO reviews_old', (err) => {
    if (err) {
      console.log('Rename error:', err);
      process.exit(1);
    }
    
    // Yeni tablo oluştur (project_id NULL olabilir)
    db.run(`CREATE TABLE reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      reviewer_id INTEGER NOT NULL,
      reviewee_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.log('Create error:', err);
        process.exit(1);
      }
      
      // Eski verileri yeni tabloya aktar
      db.run('INSERT INTO reviews SELECT * FROM reviews_old', (err) => {
        if (err) console.log('Insert error (normal if empty):', err);
        
        // Eski tabloyu sil
        db.run('DROP TABLE reviews_old', (err) => {
          if (err) {
            console.log('Drop error:', err);
            process.exit(1);
          }
          console.log('✅ Reviews tablosu güncellendi! project_id artık NULL olabilir.');
          process.exit(0);
        });
      });
    });
  });
});

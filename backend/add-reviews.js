const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const reviews = [
  { project_id: 1, reviewer_id: 1, reviewee_id: 2, rating: 5, comment: 'Harika bir çalışma! Zamanında teslim etti ve kaliteli kod yazdı.' },
  { project_id: 2, reviewer_id: 3, reviewee_id: 2, rating: 4, comment: 'İyi iletişim ve profesyonel yaklaşım. Küçük düzeltmeler gerekti ama genel olarak memnun kaldım.' },
  { project_id: 3, reviewer_id: 4, reviewee_id: 2, rating: 5, comment: 'Mükemmel! Beklentilerimi aştı. Kesinlikle tekrar çalışmak isterim.' },
  { project_id: 1, reviewer_id: 2, reviewee_id: 1, rating: 4, comment: 'İyi bir müşteri, net açıklamalar yaptı ve ödemeler zamanında geldi.' },
  { project_id: 4, reviewer_id: 1, reviewee_id: 3, rating: 5, comment: 'Çok yetenekli bir geliştirici. Karmaşık problemleri kolayca çözdü.' },
  { project_id: 5, reviewer_id: 2, reviewee_id: 3, rating: 3, comment: 'Orta seviye bir deneyimdi. İletişim biraz yavaştı.' },
  { project_id: 6, reviewer_id: 1, reviewee_id: 4, rating: 5, comment: 'Fantastic work! Very responsive and delivered exactly what I needed.' },
  { project_id: 7, reviewer_id: 5, reviewee_id: 4, rating: 4, comment: 'Solid developer with good technical skills. Would recommend.' },
  { project_id: 2, reviewer_id: 2, reviewee_id: 5, rating: 5, comment: 'Amazing designer! Creative solutions and beautiful UI/UX work.' },
  { project_id: 3, reviewer_id: 1, reviewee_id: 5, rating: 4, comment: 'Great attention to detail. Delivered on time.' }
];

let completed = 0;
reviews.forEach((review) => {
  db.run(
    `INSERT INTO reviews (project_id, reviewer_id, reviewee_id, rating, comment, created_at) 
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [review.project_id, review.reviewer_id, review.reviewee_id, review.rating, review.comment],
    (err) => {
      if (err && !err.message.includes('UNIQUE')) {
        console.error('Hata:', err.message);
      }
      completed++;
      if (completed === reviews.length) {
        console.log('✅ ' + reviews.length + ' adet review eklendi!');
        db.close();
      }
    }
  );
});

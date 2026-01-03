/**
 * Email Encryption Migration Script
 * Mevcut email'leri AES-256 ile şifreler
 */

const db = require('./database');
const { encrypt, decrypt } = require('./utils/encryption');

console.log('🔐 Email şifreleme migration başlatılıyor...\n');

// Tüm kullanıcıları al
db.all('SELECT id, email FROM users', [], (err, users) => {
  if (err) {
    console.error('❌ Hata:', err);
    process.exit(1);
  }

  console.log(`📧 ${users.length} kullanıcı bulundu.\n`);

  let updated = 0;
  let skipped = 0;

  users.forEach((user, index) => {
    // Zaten şifreli mi kontrol et (: karakteri varsa şifrelidir)
    if (user.email.includes(':')) {
      console.log(`⏭️  ${user.id}: Zaten şifreli, atlanıyor`);
      skipped++;
      checkComplete(index, users.length);
      return;
    }

    // Email'i şifrele
    const encryptedEmail = encrypt(user.email);
    
    db.run(
      'UPDATE users SET email = ? WHERE id = ?',
      [encryptedEmail, user.id],
      function(err) {
        if (err) {
          console.error(`❌ ${user.id}: Şifreleme hatası -`, err.message);
        } else {
          console.log(`✅ ${user.id}: ${user.email} → ${encryptedEmail.substring(0, 30)}...`);
          updated++;
        }
        checkComplete(index, users.length);
      }
    );
  });

  function checkComplete(index, total) {
    if (index === total - 1) {
      setTimeout(() => {
        console.log('\n========================================');
        console.log(`✅ Tamamlandı!`);
        console.log(`   Şifrelenen: ${updated}`);
        console.log(`   Atlanan: ${skipped}`);
        console.log('========================================\n');
        
        // Doğrulama - şifreleri çözerek kontrol et
        console.log('🔍 Doğrulama yapılıyor...\n');
        db.all('SELECT id, email FROM users LIMIT 5', [], (err, sample) => {
          if (err) {
            console.error('Doğrulama hatası:', err);
            process.exit(1);
          }
          
          sample.forEach(u => {
            const decrypted = decrypt(u.email);
            console.log(`   ID ${u.id}: ${decrypted}`);
          });
          
          console.log('\n✅ Email\'ler veritabanında şifreli, çözülebilir durumda!\n');
          process.exit(0);
        });
      }, 500);
    }
  }
});

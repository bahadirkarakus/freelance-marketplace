/**
 * Email Encryption Utility
 * AES-256 şifreleme ile email'leri güvenli saklar
 */

const crypto = require('crypto');

// .env'den al veya default key kullan (production'da mutlaka .env'de olmalı)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'freelance-marketplace-secret-key-32'; // 32 karakter
const IV_LENGTH = 16; // AES için IV uzunluğu

/**
 * Metni şifreler
 * @param {string} text - Şifrelenecek metin
 * @returns {string} - Şifrelenmiş metin (hex formatında)
 */
function encrypt(text) {
  if (!text) return text;
  
  try {
    // Key'i 32 byte'a normalize et
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Hata durumunda orijinal metni döndür
  }
}

/**
 * Şifreli metni çözer
 * @param {string} encryptedText - Şifrelenmiş metin
 * @returns {string} - Çözülmüş metin
 */
function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText;
  
  // Eğer şifreli değilse (eski veri), olduğu gibi döndür
  if (!encryptedText.includes(':')) {
    return encryptedText;
  }
  
  try {
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Hata durumunda şifreli metni döndür
  }
}

/**
 * Email'in şifreli halini bulur (login için)
 * @param {string} plainEmail - Düz email
 * @param {Array} encryptedEmails - Şifreli email listesi [{id, email}]
 * @returns {object|null} - Eşleşen kayıt veya null
 */
function findEmailMatch(plainEmail, encryptedEmails) {
  for (const record of encryptedEmails) {
    const decrypted = decrypt(record.email);
    if (decrypted.toLowerCase() === plainEmail.toLowerCase()) {
      return record;
    }
  }
  return null;
}

module.exports = {
  encrypt,
  decrypt,
  findEmailMatch
};

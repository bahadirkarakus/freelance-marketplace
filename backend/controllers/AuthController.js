const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { encrypt, decrypt, findEmailMatch } = require('../utils/encryption');

class AuthController {
  static async register(req, res) {
    const { email, password, name, user_type, bio, skills, hourly_rate } = req.body;
    
    if (!email || !password || !name || !user_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
      // Önce email var mı kontrol et (tüm email'leri decrypt ederek)
      db.all("SELECT id, email FROM users", [], async (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const existingUser = findEmailMatch(email, users);
        if (existingUser) {
          return res.status(409).json({ error: "Email already exists" });
        }

        // Hash password ve encrypt email
        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedEmail = encrypt(email);
        
        // Client'lar $200 başlangıç bakiyesi ile başlar
        const initialBalance = user_type === 'client' ? 200 : 0;

        db.run(
          `INSERT INTO users (email, password, name, user_type, bio, skills, hourly_rate, balance) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [encryptedEmail, hashedPassword, name, user_type, bio, skills, hourly_rate, initialBalance],
          function (err) {
            if (err) {
              console.error('Registration DB error:', err.message);
              return res.status(500).json({ error: err.message });
            }

            // Generate JWT token
            const token = jwt.sign(
              { id: this.lastID, email: email, user_type },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({ 
              message: "User registered successfully",
              token,
              user: { id: this.lastID, email: email, name, user_type }
            });
          }
        );
      });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  }

  static login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Tüm kullanıcıları al ve email'leri decrypt ederek karşılaştır
    db.all(
      "SELECT * FROM users",
      [],
      async (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Email eşleşmesi bul
        let user = null;
        for (const u of users) {
          const decryptedEmail = decrypt(u.email);
          if (decryptedEmail.toLowerCase() === email.toLowerCase()) {
            user = u;
            break;
          }
        }
        
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token - email'i decrypt edilmiş haliyle kullan
        const decryptedEmail = decrypt(user.email);
        const token = jwt.sign(
          { id: user.id, email: decryptedEmail, user_type: user.user_type },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        // Don't send password to client, email'i decrypt et
        delete user.password;
        user.email = decryptedEmail;

        res.json({ 
          message: "Login successful",
          token,
          user
        });
      }
    );
  }
}

module.exports = AuthController;

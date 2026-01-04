const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

// CREATE TABLES
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      user_type TEXT NOT NULL CHECK(user_type IN ('client', 'freelancer')),
      bio TEXT,
      skills TEXT,
      specialties TEXT,
      hourly_rate REAL,
      rating REAL DEFAULT 0,
      balance REAL DEFAULT 0,
      profile_picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      budget REAL NOT NULL,
      duration TEXT,
      category TEXT,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      client_id INTEGER NOT NULL,
      assigned_freelancer_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (assigned_freelancer_id) REFERENCES users(id)
    )
  `);

  // Bids table
  db.run(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      freelancer_id INTEGER NOT NULL,
      bid_amount REAL NOT NULL,
      proposal TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewer_id INTEGER NOT NULL,
      reviewee_id INTEGER NOT NULL,
      rating REAL NOT NULL,
      comment TEXT,
      project_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    )
  `);

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT,
      message TEXT,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Wallet table
  db.run(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Portfolio table
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      freelancer_id INTEGER NOT NULL,
      title TEXT,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      freelancer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (freelancer_id) REFERENCES users(id)
    )
  `);

  // ========== AUTO SEED IF EMPTY ==========
  // Check if freelancers exist, if not seed them
  db.get("SELECT COUNT(*) as count FROM users WHERE user_type = 'freelancer'", [], (err, row) => {
    if (err) return;
    if (row.count === 0) {
      console.log('🌱 Seeding initial data...');
      seedDatabase();
    }
  });
});

// Seed function for initial data
function seedDatabase() {
  const bcrypt = require('bcryptjs');
  const { encrypt } = require('./utils/encryption');
  
  // Hash password for all users
  const hashedPassword = bcrypt.hashSync('123456', 10);
  
  // Freelancers data
  const freelancers = [
    { name: 'Ahmet Yılmaz', email: 'ahmet@test.com', skills: 'React, Node.js, TypeScript', bio: 'Full-stack developer with 5 years experience', hourly_rate: 45, rating: 4.8 },
    { name: 'Elif Kaya', email: 'elif@test.com', skills: 'Vue.js, Python, Django', bio: 'Frontend specialist and Python developer', hourly_rate: 40, rating: 4.6 },
    { name: 'Mehmet Demir', email: 'mehmet@test.com', skills: 'Angular, Java, Spring Boot', bio: 'Enterprise application developer', hourly_rate: 55, rating: 4.9 },
    { name: 'Zeynep Çelik', email: 'zeynep@test.com', skills: 'React Native, Flutter, iOS', bio: 'Mobile app developer for iOS and Android', hourly_rate: 50, rating: 4.7 },
    { name: 'Can Özkan', email: 'can@test.com', skills: 'PHP, Laravel, MySQL', bio: 'Backend developer specialized in Laravel', hourly_rate: 35, rating: 4.5 },
    { name: 'Selin Arslan', email: 'selin@test.com', skills: 'UI/UX Design, Figma, Adobe XD', bio: 'Creative UI/UX designer', hourly_rate: 42, rating: 4.8 },
    { name: 'Burak Yıldız', email: 'burak@test.com', skills: 'AWS, Docker, Kubernetes', bio: 'DevOps engineer and cloud architect', hourly_rate: 60, rating: 4.9 },
    { name: 'Ayşe Koç', email: 'ayse@test.com', skills: 'Python, Machine Learning, TensorFlow', bio: 'Data scientist and ML engineer', hourly_rate: 65, rating: 4.7 },
    { name: 'Emre Şahin', email: 'emre@test.com', skills: 'WordPress, Shopify, WooCommerce', bio: 'E-commerce and CMS specialist', hourly_rate: 30, rating: 4.4 },
    { name: 'Deniz Aydın', email: 'deniz@test.com', skills: 'SEO, Digital Marketing, Content', bio: 'Digital marketing expert', hourly_rate: 35, rating: 4.6 },
    { name: 'Fatma Erdoğan', email: 'fatma@test.com', skills: 'GraphQL, PostgreSQL, Redis', bio: 'Database and API specialist', hourly_rate: 48, rating: 4.5 },
    { name: 'Murat Güneş', email: 'murat@test.com', skills: 'Rust, Go, Systems Programming', bio: 'Systems programmer and performance optimizer', hourly_rate: 70, rating: 4.8 },
    { name: 'İrem Yılmaz', email: 'irem@test.com', skills: 'Blockchain, Solidity, Web3', bio: 'Blockchain developer and smart contract expert', hourly_rate: 75, rating: 4.7 },
    { name: 'Oğuz Kara', email: 'oguz@test.com', skills: 'Unity, C#, Game Development', bio: 'Game developer with Unity expertise', hourly_rate: 45, rating: 4.6 },
    { name: 'Ceren Aktaş', email: 'ceren@test.com', skills: 'Swift, iOS, SwiftUI', bio: 'Native iOS developer', hourly_rate: 55, rating: 4.8 }
  ];

  // Insert freelancers
  const insertFreelancer = db.prepare(`
    INSERT INTO users (email, password, name, user_type, bio, skills, hourly_rate, rating, balance)
    VALUES (?, ?, ?, 'freelancer', ?, ?, ?, ?, 0)
  `);

  freelancers.forEach(f => {
    const encryptedEmail = encrypt(f.email);
    insertFreelancer.run([encryptedEmail, hashedPassword, f.name, f.bio, f.skills, f.hourly_rate, f.rating]);
  });

  insertFreelancer.finalize();

  // Create a demo client
  const clientEmail = encrypt('client@test.com');
  db.run(`
    INSERT INTO users (email, password, name, user_type, bio, balance)
    VALUES (?, ?, 'Demo Client', 'client', 'Demo client account for testing', 500)
  `, [clientEmail, hashedPassword]);

  // Create sample projects after a short delay to ensure client is created
  setTimeout(() => {
    db.get("SELECT id FROM users WHERE user_type = 'client' LIMIT 1", [], (err, client) => {
      if (err || !client) return;
      
      const projects = [
        { title: 'E-commerce Website Development', description: 'Build a modern e-commerce website with React and Node.js. Features: product catalog, shopping cart, payment integration, admin panel.', budget: 2500, category: 'Web Development', duration: '4 weeks' },
        { title: 'Mobile App for Fitness Tracking', description: 'Develop a cross-platform mobile app for fitness tracking with workout plans, progress charts, and social features.', budget: 3000, category: 'Mobile Development', duration: '6 weeks' },
        { title: 'Logo and Brand Identity Design', description: 'Create a professional logo and complete brand identity including color palette, typography, and brand guidelines.', budget: 500, category: 'Design', duration: '1 week' },
        { title: 'WordPress Blog Setup', description: 'Set up a WordPress blog with custom theme, SEO optimization, and content management training.', budget: 400, category: 'Web Development', duration: '1 week' },
        { title: 'API Integration Service', description: 'Integrate multiple third-party APIs (payment, shipping, CRM) into existing e-commerce platform.', budget: 1200, category: 'Backend Development', duration: '2 weeks' },
        { title: 'Data Analysis Dashboard', description: 'Create an interactive dashboard for business analytics using Python and visualization libraries.', budget: 1800, category: 'Data Science', duration: '3 weeks' }
      ];

      const insertProject = db.prepare(`
        INSERT INTO projects (title, description, budget, category, duration, client_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'open')
      `);

      projects.forEach(p => {
        insertProject.run([p.title, p.description, p.budget, p.category, p.duration, client.id]);
      });

      insertProject.finalize();
      console.log('✅ Database seeded with freelancers and projects!');
      console.log('📧 Demo accounts: client@test.com / 123456 (client) or ahmet@test.com / 123456 (freelancer)');
    });
  }, 500);
}

module.exports = db;

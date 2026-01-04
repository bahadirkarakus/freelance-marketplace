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
      project_id INTEGER,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
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
  
  // Freelancers data with profile pictures and detailed bios
  const freelancers = [
    { 
      name: 'Alex Johnson', 
      email: 'alex@test.com', 
      skills: 'React, Node.js, TypeScript, MongoDB', 
      bio: 'Senior Full-Stack Developer with 8+ years of experience building scalable web applications. Specialized in React ecosystem and Node.js microservices. Previously worked at tech startups in Silicon Valley. Passionate about clean code and best practices.', 
      hourly_rate: 75, 
      rating: 4.9,
      profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Sarah Chen', 
      email: 'sarah@test.com', 
      skills: 'UI/UX Design, Figma, Adobe XD, Sketch, Prototyping', 
      bio: 'Award-winning UI/UX Designer with a passion for creating beautiful, user-centered digital experiences. 6 years of experience working with Fortune 500 companies and innovative startups. Expert in design systems and accessibility.', 
      hourly_rate: 65, 
      rating: 4.8,
      profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Marcus Williams', 
      email: 'marcus@test.com', 
      skills: 'Python, Django, Machine Learning, TensorFlow, Data Science', 
      bio: 'Data Scientist and ML Engineer with PhD in Computer Science from MIT. Specialized in building AI-powered solutions for business problems. Published researcher with expertise in NLP and computer vision.', 
      hourly_rate: 95, 
      rating: 5.0,
      profile_picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Emma Rodriguez', 
      email: 'emma@test.com', 
      skills: 'React Native, Flutter, iOS, Android, Mobile Development', 
      bio: 'Mobile App Developer who has launched 50+ apps on App Store and Play Store. Expert in cross-platform development with React Native and Flutter. Focus on performance optimization and beautiful animations.', 
      hourly_rate: 70, 
      rating: 4.7,
      profile_picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'David Kim', 
      email: 'david@test.com', 
      skills: 'AWS, Docker, Kubernetes, CI/CD, DevOps, Terraform', 
      bio: 'DevOps Engineer and Cloud Architect with 10 years of experience. AWS Certified Solutions Architect Professional. Helped companies reduce infrastructure costs by 60% while improving reliability.', 
      hourly_rate: 85, 
      rating: 4.9,
      profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Olivia Taylor', 
      email: 'olivia@test.com', 
      skills: 'WordPress, Shopify, WooCommerce, E-commerce, SEO', 
      bio: 'E-commerce Specialist who has built 200+ online stores generating over $50M in combined revenue. Expert in Shopify and WooCommerce customization. Also provide SEO and conversion optimization services.', 
      hourly_rate: 55, 
      rating: 4.6,
      profile_picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'James Anderson', 
      email: 'james@test.com', 
      skills: 'Blockchain, Solidity, Web3, Smart Contracts, DeFi', 
      bio: 'Blockchain Developer and Web3 Expert with experience building DeFi protocols and NFT marketplaces. Audited smart contracts securing over $100M in TVL. Early contributor to several successful crypto projects.', 
      hourly_rate: 120, 
      rating: 4.8,
      profile_picture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Sophie Martin', 
      email: 'sophie@test.com', 
      skills: 'Vue.js, Nuxt.js, JavaScript, CSS, Animation', 
      bio: 'Frontend Developer specializing in Vue.js ecosystem. Love creating smooth, interactive web experiences with attention to micro-interactions. 5 years of experience with remote teams worldwide.', 
      hourly_rate: 60, 
      rating: 4.7,
      profile_picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Michael Brown', 
      email: 'michael@test.com', 
      skills: 'Java, Spring Boot, Microservices, PostgreSQL, Enterprise', 
      bio: 'Enterprise Java Developer with 12 years of experience in banking and fintech. Expert in building secure, high-performance backend systems. Certified Scrum Master and technical team lead.', 
      hourly_rate: 80, 
      rating: 4.8,
      profile_picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Isabella Garcia', 
      email: 'isabella@test.com', 
      skills: 'Content Writing, Copywriting, SEO, Marketing, Branding', 
      bio: 'Content Strategist and Copywriter who has helped 100+ brands tell their story. Specialized in SaaS, tech, and lifestyle brands. My content has generated millions in revenue for clients.', 
      hourly_rate: 45, 
      rating: 4.6,
      profile_picture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Daniel Lee', 
      email: 'daniel@test.com', 
      skills: 'Unity, C#, Unreal Engine, Game Development, 3D', 
      bio: 'Game Developer with 7 years of experience creating mobile and PC games. Shipped 15+ titles with combined 10M+ downloads. Expert in Unity and Unreal Engine. Available for full game development or consulting.', 
      hourly_rate: 65, 
      rating: 4.7,
      profile_picture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Ava Wilson', 
      email: 'ava@test.com', 
      skills: 'Swift, iOS, SwiftUI, Objective-C, Apple Ecosystem', 
      bio: 'Native iOS Developer with 6 years of experience building apps for iPhone and iPad. Former Apple WWDC Scholar. Specialized in SwiftUI and ARKit. Apps featured multiple times on App Store.', 
      hourly_rate: 75, 
      rating: 4.9,
      profile_picture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Ryan Thompson', 
      email: 'ryan@test.com', 
      skills: 'Go, Rust, Systems Programming, Performance, Backend', 
      bio: 'Systems Programmer specializing in high-performance backend services. Expert in Go and Rust for building blazing-fast APIs. Previously optimized systems handling 1M+ requests per second.', 
      hourly_rate: 90, 
      rating: 4.8,
      profile_picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Mia Jackson', 
      email: 'mia@test.com', 
      skills: 'Graphic Design, Branding, Logo Design, Illustration, Print', 
      bio: 'Creative Graphic Designer with 8 years of experience in branding and visual identity. Worked with clients from startups to Fortune 500. My designs have won multiple industry awards.', 
      hourly_rate: 55, 
      rating: 4.7,
      profile_picture: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Ethan Davis', 
      email: 'ethan@test.com', 
      skills: 'PHP, Laravel, MySQL, Redis, API Development', 
      bio: 'Backend Developer with deep expertise in PHP and Laravel framework. Built and maintained applications serving millions of users. Clean code advocate and open source contributor.', 
      hourly_rate: 50, 
      rating: 4.5,
      profile_picture: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Charlotte White', 
      email: 'charlotte@test.com', 
      skills: 'Video Editing, After Effects, Premiere Pro, Motion Graphics', 
      bio: 'Video Editor and Motion Designer creating stunning visual content for brands and creators. 5 years of experience in commercial and social media video production. Fast turnaround guaranteed.', 
      hourly_rate: 50, 
      rating: 4.6,
      profile_picture: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Noah Martinez', 
      email: 'noah@test.com', 
      skills: 'Angular, TypeScript, RxJS, NgRx, Enterprise Frontend', 
      bio: 'Angular Expert with 6 years of experience building enterprise-grade applications. Google Developer Expert for Angular. Regular speaker at tech conferences and meetups.', 
      hourly_rate: 70, 
      rating: 4.8,
      profile_picture: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Amelia Harris', 
      email: 'amelia@test.com', 
      skills: 'Data Analysis, Excel, Power BI, Tableau, SQL', 
      bio: 'Data Analyst helping businesses make data-driven decisions. Expert in creating insightful dashboards and reports. 4 years of experience in retail, finance, and healthcare analytics.', 
      hourly_rate: 45, 
      rating: 4.5,
      profile_picture: 'https://images.unsplash.com/photo-1546961342-ea1f6a20f92c?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Liam Clark', 
      email: 'liam@test.com', 
      skills: 'Cybersecurity, Penetration Testing, Security Audit, Ethical Hacking', 
      bio: 'Cybersecurity Expert and Certified Ethical Hacker. Performed security audits for banks, hospitals, and government agencies. Help companies identify and fix vulnerabilities before hackers do.', 
      hourly_rate: 100, 
      rating: 4.9,
      profile_picture: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Harper Lewis', 
      email: 'harper@test.com', 
      skills: 'Social Media, Instagram, TikTok, Marketing, Growth', 
      bio: 'Social Media Manager who has grown accounts from 0 to 500K+ followers. Expert in Instagram, TikTok, and LinkedIn growth strategies. Help brands build engaged communities and drive sales.', 
      hourly_rate: 40, 
      rating: 4.6,
      profile_picture: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face'
    }
  ];

  // Insert freelancers
  const insertFreelancer = db.prepare(`
    INSERT INTO users (email, password, name, user_type, bio, skills, hourly_rate, rating, balance, profile_picture)
    VALUES (?, ?, ?, 'freelancer', ?, ?, ?, ?, 0, ?)
  `);

  freelancers.forEach(f => {
    const encryptedEmail = encrypt(f.email);
    insertFreelancer.run([encryptedEmail, hashedPassword, f.name, f.bio, f.skills, f.hourly_rate, f.rating, f.profile_picture]);
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
        { title: 'E-commerce Website Development', description: 'Looking for an experienced full-stack developer to build a modern e-commerce platform. Must include product catalog with search/filter, shopping cart, secure payment integration (Stripe), user authentication, order management, and admin dashboard. Mobile responsive design required.', budget: 3500, category: 'Web Development', duration: '6 weeks' },
        { title: 'iOS & Android Fitness App', description: 'Need a cross-platform mobile app for fitness tracking. Features: workout plans with video tutorials, progress tracking with charts, calorie counter, social features (challenges, leaderboards), Apple Health/Google Fit integration, push notifications.', budget: 5000, category: 'Mobile Development', duration: '8 weeks' },
        { title: 'Brand Identity & Logo Design', description: 'Startup seeking complete brand identity package. Deliverables: primary logo + variations, color palette, typography guide, business card design, letterhead, social media templates, and comprehensive brand guidelines document.', budget: 800, category: 'Design', duration: '2 weeks' },
        { title: 'WordPress Business Website', description: 'Professional business website needed on WordPress. 10-15 pages including home, about, services, portfolio, blog, and contact. Must be SEO optimized, fast loading, and include contact forms. Training session required after delivery.', budget: 1200, category: 'Web Development', duration: '2 weeks' },
        { title: 'REST API Development', description: 'Build a scalable REST API for our SaaS platform using Node.js/Express or Python/FastAPI. Must include JWT authentication, rate limiting, comprehensive documentation (Swagger), unit tests, and Docker containerization.', budget: 2500, category: 'Backend Development', duration: '4 weeks' },
        { title: 'Business Intelligence Dashboard', description: 'Create an interactive BI dashboard using Python (Dash/Streamlit) or Power BI. Connect to our PostgreSQL database, visualize sales trends, customer analytics, inventory levels, and generate automated weekly reports.', budget: 2000, category: 'Data Science', duration: '3 weeks' },
        { title: 'Smart Contract Development', description: 'Develop and audit Solidity smart contracts for our NFT marketplace. Must include ERC-721 implementation, royalty system, auction functionality, and comprehensive security audit. Testnet deployment required.', budget: 4000, category: 'Blockchain', duration: '4 weeks' },
        { title: 'UI/UX Redesign for SaaS App', description: 'Complete UI/UX overhaul for our project management SaaS. Deliverables: user research summary, wireframes, high-fidelity Figma designs for 20+ screens, interactive prototype, and design system documentation.', budget: 3000, category: 'Design', duration: '4 weeks' },
        { title: 'DevOps & AWS Infrastructure', description: 'Set up production-ready AWS infrastructure. Requirements: ECS/EKS cluster, RDS database, ElastiCache, CloudFront CDN, CI/CD pipeline (GitHub Actions), monitoring (CloudWatch), and infrastructure as code (Terraform).', budget: 4500, category: 'DevOps', duration: '3 weeks' },
        { title: 'Social Media Marketing Campaign', description: 'Launch and manage 3-month social media campaign across Instagram, TikTok, and LinkedIn. Includes content strategy, 60 posts creation, community management, influencer outreach, and monthly performance reports.', budget: 2500, category: 'Marketing', duration: '12 weeks' }
      ];

      const insertProject = db.prepare(`
        INSERT INTO projects (title, description, budget, category, duration, client_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'open')
      `);

      projects.forEach(p => {
        insertProject.run([p.title, p.description, p.budget, p.category, p.duration, client.id]);
      });

      insertProject.finalize();
      console.log('✅ Database seeded with 20 freelancers and 10 projects!');
      console.log('📧 Demo accounts: client@test.com (client) or alex@test.com (freelancer) - Password: 123456');
    });
  }, 500);
}

module.exports = db;

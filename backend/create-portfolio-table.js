const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Create portfolio table
db.run(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    category TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating portfolio table:', err);
  } else {
    console.log('✅ Portfolio table created successfully');
  }
  
  // Add some demo portfolio items
  const portfolioItems = [
    { user_id: 2, title: 'E-commerce Dashboard', description: 'A modern admin dashboard for online stores with real-time analytics', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', project_url: 'https://example.com', category: 'Web Development', tags: 'React, Node.js, Dashboard' },
    { user_id: 2, title: 'Mobile Banking App', description: 'Secure and user-friendly mobile banking application', image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', project_url: 'https://example.com', category: 'UI/UX Design', tags: 'Figma, Mobile, Finance' },
    { user_id: 3, title: 'SaaS Landing Page', description: 'High-converting landing page for a B2B SaaS product', image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800', project_url: 'https://example.com', category: 'Web Development', tags: 'React, Tailwind, Landing Page' },
    { user_id: 5, title: 'AI Chatbot Interface', description: 'Conversational AI interface with natural language processing', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', project_url: 'https://example.com', category: 'AI/ML', tags: 'Python, NLP, ChatGPT' },
    { user_id: 5, title: 'Machine Learning Model', description: 'Predictive analytics model for customer churn prediction', image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', project_url: 'https://example.com', category: 'AI/ML', tags: 'TensorFlow, Python, ML' },
    { user_id: 8, title: 'Brand Identity Package', description: 'Complete brand identity including logo, colors, and guidelines', image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800', project_url: 'https://example.com', category: 'Branding', tags: 'Logo, Branding, Identity' },
  ];
  
  const stmt = db.prepare(`INSERT INTO portfolio (user_id, title, description, image_url, project_url, category, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
  portfolioItems.forEach(item => {
    stmt.run([item.user_id, item.title, item.description, item.image_url, item.project_url, item.category, item.tags]);
  });
  
  stmt.finalize((err) => {
    if (err) {
      console.error('Error inserting demo portfolio items:', err);
    } else {
      console.log('✅ Demo portfolio items added');
    }
    
    // Verify
    db.all("SELECT id, user_id, title, category FROM portfolio", (err, rows) => {
      console.log('\n📋 Portfolio items:');
      rows.forEach(row => {
        console.log(`   [${row.id}] User ${row.user_id}: ${row.title} (${row.category})`);
      });
      db.close();
    });
  });
});

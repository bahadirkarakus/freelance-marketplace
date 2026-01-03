const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./database.db');

const freelancers = [
  // Finance & Accounting
  {
    email: 'finance1@demo.com',
    name: 'Emma Accountant',
    bio: 'Certified Public Accountant with 8 years experience in bookkeeping and tax preparation',
    skills: 'Bookkeeping, Tax Preparation, QuickBooks, Financial Analysis',
    hourly_rate: 55,
    rating: 4.8,
    pic: 'https://i.pravatar.cc/150?img=25'
  },
  {
    email: 'finance2@demo.com',
    name: 'Robert CFO',
    bio: 'Former CFO offering financial consulting and investment advisory',
    skills: 'Financial Planning, Budget Analysis, Investment Advice, SAP',
    hourly_rate: 85,
    rating: 4.9,
    pic: 'https://i.pravatar.cc/150?img=33'
  },
  // Legal
  {
    email: 'legal1@demo.com',
    name: 'Jennifer Attorney',
    bio: 'Corporate lawyer specializing in contract drafting and IP law',
    skills: 'Contract Drafting, Business Law, IP Law, NDA',
    hourly_rate: 120,
    rating: 4.9,
    pic: 'https://i.pravatar.cc/150?img=26'
  },
  {
    email: 'legal2@demo.com',
    name: 'Michael Legal',
    bio: 'Legal consultant with expertise in compliance and corporate regulations',
    skills: 'Legal Research, Compliance, Corporate Law, Trademark',
    hourly_rate: 95,
    rating: 4.7,
    pic: 'https://i.pravatar.cc/150?img=51'
  },
  // HR & Training
  {
    email: 'hr1@demo.com',
    name: 'Amanda HR Expert',
    bio: 'Senior HR professional with 10 years experience in recruiting and training',
    skills: 'Recruiting, HR Consulting, Employee Training, Performance Management',
    hourly_rate: 60,
    rating: 4.8,
    pic: 'https://i.pravatar.cc/150?img=27'
  },
  {
    email: 'hr2@demo.com',
    name: 'Daniel Trainer',
    bio: 'Corporate trainer specializing in leadership development',
    skills: 'Corporate Training, Leadership Development, Team Building, Workshops',
    hourly_rate: 70,
    rating: 4.6,
    pic: 'https://i.pravatar.cc/150?img=53'
  },
  // Engineering & Architecture
  {
    email: 'engineer1@demo.com',
    name: 'Alex Engineer',
    bio: 'Mechanical engineer with expertise in CAD design and 3D modeling',
    skills: 'AutoCAD, SolidWorks, 3D Modeling, Mechanical Design',
    hourly_rate: 75,
    rating: 4.9,
    pic: 'https://i.pravatar.cc/150?img=59'
  },
  {
    email: 'architect1@demo.com',
    name: 'Sofia Architect',
    bio: 'Licensed architect specializing in residential design',
    skills: 'Architecture, Interior Design, Revit, SketchUp',
    hourly_rate: 80,
    rating: 4.8,
    pic: 'https://i.pravatar.cc/150?img=28'
  },
  // Admin & Support
  {
    email: 'admin1@demo.com',
    name: 'Rachel Assistant',
    bio: 'Professional virtual assistant offering admin support',
    skills: 'Virtual Assistant, Data Entry, Calendar Management, Customer Support',
    hourly_rate: 35,
    rating: 4.7,
    pic: 'https://i.pravatar.cc/150?img=29'
  },
  {
    email: 'admin2@demo.com',
    name: 'Chris Support',
    bio: 'Customer support specialist with help desk experience',
    skills: 'Customer Support, Live Chat, Help Desk, Zendesk',
    hourly_rate: 30,
    rating: 4.5,
    pic: 'https://i.pravatar.cc/150?img=54'
  }
];

const pwd = bcrypt.hashSync('demo123', 10);
let done = 0;

freelancers.forEach(f => {
  db.run(
    'INSERT OR IGNORE INTO users (email, name, password, user_type, bio, skills, hourly_rate, rating, profile_picture, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1000)',
    [f.email, f.name, pwd, 'freelancer', f.bio, f.skills, f.hourly_rate, f.rating, f.pic],
    function(err) {
      done++;
      if (err) {
        console.log('Error:', f.name, err.message);
      } else if (this.changes > 0) {
        console.log('✅ Added:', f.name);
      } else {
        console.log('⏭️  Already exists:', f.name);
      }
      
      if (done === freelancers.length) {
        console.log('\n🎉 Done! Listing all freelancers:');
        db.all('SELECT id, name, skills FROM users WHERE user_type = ?', ['freelancer'], (err, rows) => {
          rows.forEach(r => console.log(`  ${r.id}. ${r.name}`));
          console.log(`\nTotal: ${rows.length} freelancers`);
          db.close();
        });
      }
    }
  );
});

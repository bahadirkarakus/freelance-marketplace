require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./database.db");

const projectData = [
  // Web Development
  {
    title: "Build an E-commerce Website",
    description: "Need a professional e-commerce platform built with React and Node.js. Should include product catalog, shopping cart, payment integration with Stripe, and admin dashboard.",
    budget: 2500,
    duration: "45 days",
    category: "development",
    status: "open"
  },
  {
    title: "WordPress Blog Setup",
    description: "Create a custom WordPress blog with premium theme customization. Need SEO optimization, contact forms, and newsletter integration.",
    budget: 800,
    duration: "10 days",
    category: "development",
    status: "open"
  },
  {
    title: "Mobile App API Development",
    description: "Build REST API for iOS and Android app. Need user authentication, data validation, and documentation. Should be scalable and production-ready.",
    budget: 3000,
    duration: "60 days",
    category: "development",
    status: "open"
  },
  {
    title: "Website Redesign",
    description: "Redesign existing company website to be more modern and mobile-responsive. Must maintain current functionality and improve UX.",
    budget: 1500,
    duration: "30 days",
    category: "design",
    status: "open"
  },
  {
    title: "Fix Website Bugs",
    description: "Fix critical bugs in our production website. Issues include slow page load, broken payment system, and mobile view problems.",
    budget: 500,
    duration: "5 days",
    category: "development",
    status: "open"
  },
  {
    title: "Database Optimization",
    description: "Optimize MySQL database queries and implement caching. Site is currently slow due to inefficient queries. Need performance improvement by 50%.",
    budget: 1200,
    duration: "20 days",
    category: "development",
    status: "open"
  },
  {
    title: "React Dashboard Development",
    description: "Build an interactive dashboard with React 19, TypeScript, and Chart.js. Need real-time data visualization, dark mode, and responsive design.",
    budget: 2000,
    duration: "35 days",
    category: "development",
    status: "open"
  },
  {
    title: "Vue.js Dashboard Development",
    description: "Build an interactive dashboard with Vue.js 3, Chart.js, and real-time data visualization. Need responsive design and dark mode.",
    budget: 2000,
    duration: "35 days",
    category: "development",
    status: "open"
  },
  {
    title: "Python Django Web App",
    description: "Develop a Django web application with user authentication, database models, and REST API. Project should be scalable and well-documented.",
    budget: 2200,
    duration: "40 days",
    category: "development",
    status: "open"
  },
  {
    title: "Shopify Theme Development",
    description: "Customize Shopify store theme with new features, product filters, and checkout optimization. Must improve conversion rate.",
    budget: 1600,
    duration: "25 days",
    category: "development",
    status: "open"
  },
  {
    title: "Next.js Full-Stack Application",
    description: "Build a full-stack application using Next.js 14, TypeScript, and MongoDB. Include authentication, file uploads, and payment integration.",
    budget: 3500,
    duration: "50 days",
    category: "development",
    status: "open"
  },
  {
    title: "Angular Application Migration",
    description: "Migrate legacy AngularJS app to modern Angular 17. Need to maintain functionality while improving performance and maintainability.",
    budget: 2800,
    duration: "45 days",
    category: "development",
    status: "open"
  },
  {
    title: "GraphQL API Development",
    description: "Build a GraphQL API using Apollo Server and Node.js. Need schema design, resolvers, and comprehensive documentation.",
    budget: 2400,
    duration: "38 days",
    category: "development",
    status: "open"
  },
  {
    title: "Progressive Web App (PWA)",
    description: "Convert existing website to PWA with offline functionality, push notifications, and home screen installation capability.",
    budget: 1800,
    duration: "30 days",
    category: "development",
    status: "open"
  },
  {
    title: "REST API Testing & Documentation",
    description: "Write comprehensive API tests, set up CI/CD pipeline, and create interactive API documentation with Swagger/OpenAPI.",
    budget: 1300,
    duration: "20 days",
    category: "development",
    status: "open"
  },
  {
    title: "React E-Commerce Admin Panel",
    description: "Build a complete admin panel with React, Redux, and Material-UI. Need product management, order tracking, analytics, and user management.",
    budget: 2600,
    duration: "42 days",
    category: "development",
    status: "open"
  },
  {
    title: "React Native Mobile App",
    description: "Develop a cross-platform mobile app using React Native. Need iOS and Android builds, payment integration, and push notifications.",
    budget: 3200,
    duration: "55 days",
    category: "development",
    status: "open"
  },
  {
    title: "React Chat Application",
    description: "Build a real-time chat application with React, WebSocket, and MongoDB. Need user authentication, message history, and notifications.",
    budget: 2100,
    duration: "38 days",
    category: "development",
    status: "open"
  },
  {
    title: "React Task Management Tool",
    description: "Create a task/project management tool with React, Drag-and-drop functionality, calendar view, and team collaboration features.",
    budget: 1900,
    duration: "33 days",
    category: "development",
    status: "open"
  },

  // Design
  {
    title: "Logo Design",
    description: "Need a modern, professional logo for our tech startup. Should work in all formats and sizes. Prefer minimalist style.",
    budget: 500,
    duration: "7 days",
    category: "design",
    status: "open"
  },
  {
    title: "UI/UX Design for App",
    description: "Design complete UI/UX for a fitness tracking mobile app. Need wireframes, mockups, and interactive prototypes.",
    budget: 1800,
    duration: "40 days",
    category: "design",
    status: "open"
  },
  {
    title: "Social Media Graphics",
    description: "Create 20 unique social media graphics for our Instagram and Twitter. Should match brand guidelines and be eye-catching.",
    budget: 400,
    duration: "10 days",
    category: "design",
    status: "open"
  },
  {
    title: "Business Card & Branding",
    description: "Design complete branding package including business cards, letterhead, and brand guidelines. Modern, professional style.",
    budget: 700,
    duration: "15 days",
    category: "design",
    status: "open"
  },
  {
    title: "Website Banner Redesign",
    description: "Create 5 professional website banners for our marketing campaigns. Should be high-converting and match our brand.",
    budget: 350,
    duration: "8 days",
    category: "design",
    status: "open"
  },
  {
    title: "Packaging Design",
    description: "Design product packaging for our eco-friendly product line. Need 3D mockups and printing specifications.",
    budget: 1200,
    duration: "25 days",
    category: "design",
    status: "open"
  },

  // Writing
  {
    title: "Blog Post Writing",
    description: "Write 10 SEO-optimized blog posts about digital marketing. 1500-2000 words each. Must be well-researched and engaging.",
    budget: 600,
    duration: "20 days",
    category: "writing",
    status: "open"
  },
  {
    title: "Product Description Writing",
    description: "Write compelling product descriptions for 50 e-commerce products. Need to be conversion-focused and SEO-friendly.",
    budget: 750,
    duration: "15 days",
    category: "writing",
    status: "open"
  },
  {
    title: "Content Strategy & Planning",
    description: "Create a 6-month content strategy for our SaaS company. Need competitor analysis, content calendar, and distribution plan.",
    budget: 1500,
    duration: "14 days",
    category: "writing",
    status: "open"
  },
  {
    title: "Copywriting for Landing Page",
    description: "Write persuasive copy for our new SaaS landing page. Need headline, hero copy, feature descriptions, and CTA.",
    budget: 400,
    duration: "7 days",
    category: "writing",
    status: "open"
  },
  {
    title: "Email Newsletter Writing",
    description: "Write weekly newsletter content for our 10k subscribers. Should be engaging, informative, and drive clicks.",
    budget: 500,
    duration: "4 weeks",
    category: "writing",
    status: "open"
  },
  {
    title: "Technical Documentation",
    description: "Write comprehensive technical documentation for our API. Need endpoint descriptions, examples, and troubleshooting guide.",
    budget: 800,
    duration: "18 days",
    category: "writing",
    status: "open"
  },

  // Marketing
  {
    title: "Social Media Campaign",
    description: "Plan and execute a 3-month social media marketing campaign for our e-commerce store. Need content creation and community management.",
    budget: 2000,
    duration: "90 days",
    category: "marketing",
    status: "open"
  },
  {
    title: "SEO Optimization",
    description: "Optimize our website for search engines. Need keyword research, on-page optimization, link building strategy.",
    budget: 1200,
    duration: "60 days",
    category: "marketing",
    status: "open"
  },
  {
    title: "Email Marketing Setup",
    description: "Set up complete email marketing system using Mailchimp. Need list segmentation, automation flows, and templates.",
    budget: 600,
    duration: "14 days",
    category: "marketing",
    status: "open"
  },
  {
    title: "Google Ads Campaign",
    description: "Create and manage Google Ads campaign for our service business. Need keyword research, ad creation, and optimization.",
    budget: 800,
    duration: "30 days",
    category: "marketing",
    status: "open"
  },
  {
    title: "Influencer Marketing Outreach",
    description: "Manage influencer partnerships for our brand. Find and negotiate with relevant influencers in our niche.",
    budget: 1500,
    duration: "45 days",
    category: "marketing",
    status: "open"
  },
  {
    title: "Video Marketing Strategy",
    description: "Develop video marketing strategy and create promotional videos. Need script, filming, and editing.",
    budget: 2500,
    duration: "60 days",
    category: "marketing",
    status: "open"
  }
];

// First, create a test client user
db.run(
  `INSERT INTO users (email, password, name, user_type, bio) VALUES (?, ?, ?, ?, ?)`,
  ['testclient@example.com', bcrypt.hashSync('password123', 10), 'Test Client', 'client', 'Testing account for projects'],
  function(err) {
    if (err) {
      console.log('Client already exists or error:', err.message);
    } else {
      console.log('Test client created with ID:', this.lastID);
    }

    // Get the client ID (usually 1 for first user, but let's be safe)
    db.get(`SELECT id FROM users WHERE email = 'testclient@example.com'`, (err, row) => {
      if (err) {
        console.error('Error getting client ID:', err);
        process.exit(1);
      }

      const clientId = row.id;
      console.log('Using client ID:', clientId);

      // Insert sample projects
      projectData.forEach((project, index) => {
        db.run(
          `INSERT INTO projects (title, description, budget, duration, category, status, client_id, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            project.title,
            project.description,
            project.budget,
            project.duration,
            project.category,
            project.status,
            clientId
          ],
          function(err) {
            if (err) {
              console.error(`Error inserting project "${project.title}":`, err.message);
            } else {
              console.log(`✓ Project created: ${project.title} (ID: ${this.lastID})`);
            }

            // Close connection after all inserts
            if (index === projectData.length - 1) {
              setTimeout(() => {
                db.close(() => {
                  console.log('\n✓ Database seeding completed!');
                  process.exit(0);
                });
              }, 500);
            }
          }
        );
      });
    });
  }
);

const db = require('./database');

// English bios for all freelancers based on their skills
const bioUpdates = [
  // Web Development
  { name: 'Ahmet Yılmaz', bio: 'Full-stack web developer specializing in React and Node.js. Building modern, scalable web applications.' },
  { name: 'Elif Kaya', bio: 'Frontend developer with Vue.js expertise. Creating beautiful and responsive user interfaces.' },
  { name: 'Mehmet Demir', bio: 'Backend developer focused on Python and Django. Building robust APIs and server-side solutions.' },
  { name: 'Zeynep Aksoy', bio: 'Full-stack developer with Angular expertise. Delivering end-to-end web solutions.' },
  
  // Mobile Development
  { name: 'Can Öztürk', bio: 'Mobile app developer specializing in React Native. Building cross-platform mobile applications.' },
  { name: 'Ayşe Çelik', bio: 'iOS developer with Swift expertise. Creating elegant and performant Apple applications.' },
  { name: 'Burak Şahin', bio: 'Android developer using Kotlin. Building native Android apps with modern architecture.' },
  
  // UI/UX Design
  { name: 'Deniz Yıldız', bio: 'UI/UX designer creating user-centered digital experiences with Figma and Adobe XD.' },
  { name: 'Selin Aydın', bio: 'Product designer specializing in mobile app interfaces and design systems.' },
  { name: 'Emre Koç', bio: 'UX researcher and designer. Conducting user research and creating intuitive interfaces.' },
  
  // Graphic Design
  { name: 'Gizem Arslan', bio: 'Brand identity designer. Creating logos, visual identities, and brand guidelines.' },
  { name: 'Hakan Türk', bio: 'Illustrator and graphic designer. Creating unique illustrations and visual content.' },
  { name: 'İrem Başar', bio: 'Print and digital designer. Designing brochures, packaging, and marketing materials.' },
  
  // Content Writing
  { name: 'Kerem Güneş', bio: 'SEO content writer creating engaging blog posts and website copy that ranks.' },
  { name: 'Leyla Özkan', bio: 'Copywriter specializing in advertising and persuasive content for brands.' },
  { name: 'Murat Kılıç', bio: 'Technical writer creating documentation, user guides, and API documentation.' },
  
  // Digital Marketing
  { name: 'Nur Erdem', bio: 'Social media manager and strategist. Growing brands across all platforms.' },
  { name: 'Oğuz Çetin', bio: 'Google Ads and PPC specialist. Managing paid campaigns for maximum ROI.' },
  { name: 'Pelin Korkmaz', bio: 'SEO expert helping businesses rank higher and drive organic traffic.' },
  
  // Data Science & AI
  { name: 'Rıza Aktaş', bio: 'Data scientist with Python and TensorFlow expertise. Building ML models and analytics solutions.' },
  { name: 'Sevgi Doğan', bio: 'Business intelligence analyst. Creating dashboards and data visualizations with Power BI.' },
  { name: 'Tolga Eren', bio: 'AI engineer specializing in NLP and computer vision applications.' },
  
  // Video & Animation
  { name: 'Ufuk Gül', bio: 'Video editor and colorist. Creating professional video content with Premiere Pro.' },
  { name: 'Vildan Sezer', bio: '2D animator creating explainer videos and motion graphics.' },
  { name: 'Yusuf Karaca', bio: '3D artist and animator. Creating product visualizations and animations.' },
  
  // Translation
  { name: 'Aslı Tekin', bio: 'Professional translator for English-Turkish pairs. Specializing in technical and legal documents.' },
  { name: 'Berk Ünal', bio: 'German-Turkish translator with expertise in business and marketing content.' },
  { name: 'Ceren Polat', bio: 'French-Turkish translator specializing in literary and academic translations.' },
  
  // DevOps & Cloud
  { name: 'Doruk Özdemir', bio: 'DevOps engineer specializing in AWS and CI/CD pipelines. Automating infrastructure.' },
  { name: 'Ece Şimşek', bio: 'Cloud architect with Azure expertise. Designing scalable cloud solutions.' },
  
  // Cybersecurity
  { name: 'Ferhat Yalçın', bio: 'Penetration tester and security consultant. Finding vulnerabilities before hackers do.' },
  { name: 'Gamze Çakır', bio: 'Security analyst specializing in network security and compliance audits.' },
  
  // E-commerce
  { name: 'Harun Keskin', bio: 'Shopify expert building and optimizing e-commerce stores for maximum conversions.' },
  { name: 'Ipek Acar', bio: 'WooCommerce developer creating custom e-commerce solutions on WordPress.' },
  
  // WordPress
  { name: 'Janset Kurt', bio: 'WordPress developer building custom themes and plugins for businesses.' },
  { name: 'Kaan Yılmaz', bio: 'Email marketing specialist and CRM expert. Managing customer relationships and campaigns.' },
  
  // Game Development
  { name: 'Lale Özdemir', bio: 'Unity game developer creating 2D and 3D games for mobile and PC platforms.' },
  { name: 'Mehmet Kara', bio: 'AI and deep learning engineer building intelligent systems and neural networks.' },
  
  // More professionals
  { name: 'Nazlı Tuncer', bio: 'Data visualization specialist creating reports and dashboards with Tableau and Power BI.' },
  { name: 'Onur Başaran', bio: 'Professional video editor and colorist. Creating cinematic content.' },
  { name: 'Pınar Erdem', bio: '2D animator and character designer. Creating engaging animated content.' },
  { name: 'Rıza Aksoy', bio: '3D modeler and game artist. Creating game assets and product visualizations.' },
  { name: 'Sibel Doğan', bio: 'Professional English-Turkish translator. Specializing in localization services.' },
  { name: 'Tarık Avcı', bio: 'German-Turkish translator for legal and technical documents.' },
  { name: 'Ülkü Yavuz', bio: 'Unreal Engine developer creating AAA-quality game experiences.' },
  { name: 'Volkan Tekin', bio: 'Blockchain developer building smart contracts and DeFi applications.' },
  { name: 'Yasemin Kurt', bio: 'NFT artist and Web3 consultant. Creating digital art and blockchain solutions.' }
];

console.log('🔄 Updating freelancer bios to English...\n');

let updated = 0;
let notFound = 0;

const updateBio = (freelancer) => {
  return new Promise((resolve) => {
    db.run(
      'UPDATE users SET bio = ? WHERE name = ? AND user_type = ?',
      [freelancer.bio, freelancer.name, 'freelancer'],
      function(err) {
        if (err) {
          console.error(`❌ Error updating ${freelancer.name}:`, err.message);
        } else if (this.changes > 0) {
          console.log(`✅ Updated: ${freelancer.name}`);
          updated++;
        } else {
          console.log(`⚠️ Not found: ${freelancer.name}`);
          notFound++;
        }
        resolve();
      }
    );
  });
};

(async () => {
  for (const freelancer of bioUpdates) {
    await updateBio(freelancer);
  }
  
  console.log('\n🎉 Bio update completed!');
  console.log(`   Updated: ${updated} freelancers`);
  console.log(`   Not found: ${notFound}`);
  
  process.exit(0);
})();

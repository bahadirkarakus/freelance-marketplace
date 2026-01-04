const db = require('./database');
const bcrypt = require('bcryptjs');
const { encrypt } = require('./utils/encryption');

const freelancers = [
  // Web Development
  { name: "Ahmet Yılmaz", email: "ahmet.yilmaz@test.com", skills: "React, Node.js, MongoDB, Express", hourly_rate: 45, bio: "5 yıllık deneyime sahip full-stack geliştirici. Modern web teknolojilerinde uzman.", profile_picture: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Elif Kaya", email: "elif.kaya@test.com", skills: "Vue.js, Laravel, MySQL, Tailwind CSS", hourly_rate: 40, bio: "Frontend ve backend geliştirmede 4 yıllık tecrübesi var.", profile_picture: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Murat Demir", email: "murat.demir@test.com", skills: "Angular, .NET Core, SQL Server, Azure", hourly_rate: 55, bio: "Kurumsal uygulamalar ve bulut çözümlerinde uzman.", profile_picture: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Zeynep Arslan", email: "zeynep.arslan@test.com", skills: "Next.js, TypeScript, PostgreSQL, AWS", hourly_rate: 50, bio: "Performant ve ölçeklenebilir web uygulamaları geliştirme.", profile_picture: "https://randomuser.me/api/portraits/women/4.jpg" },
  
  // Mobile Development
  { name: "Can Özturk", email: "can.ozturk@test.com", skills: "React Native, Flutter, iOS, Android", hourly_rate: 50, bio: "Cross-platform mobil uygulama geliştirme uzmanı.", profile_picture: "https://randomuser.me/api/portraits/men/5.jpg" },
  { name: "Selin Yıldırım", email: "selin.yildirim@test.com", skills: "Swift, Kotlin, Firebase, Xcode", hourly_rate: 55, bio: "Native iOS ve Android uygulamalarında 6 yıl deneyim.", profile_picture: "https://randomuser.me/api/portraits/women/6.jpg" },
  { name: "Emre Çelik", email: "emre.celik@test.com", skills: "Flutter, Dart, REST API, SQLite", hourly_rate: 45, bio: "50+ mobil uygulama geliştirdi. App Store ve Play Store'da yayınlandı.", profile_picture: "https://randomuser.me/api/portraits/men/7.jpg" },
  
  // UI/UX Design
  { name: "Ayşe Korkmaz", email: "ayse.korkmaz@test.com", skills: "Figma, Adobe XD, Sketch, UI Design", hourly_rate: 40, bio: "Kullanıcı odaklı arayüz tasarımları oluşturma.", profile_picture: "https://randomuser.me/api/portraits/women/8.jpg" },
  { name: "Burak Şahin", email: "burak.sahin@test.com", skills: "UX Research, Wireframing, Prototyping, Figma", hourly_rate: 45, bio: "UX araştırması ve kullanılabilirlik testinde uzman.", profile_picture: "https://randomuser.me/api/portraits/men/9.jpg" },
  { name: "Deniz Aydın", email: "deniz.aydin@test.com", skills: "Web Design, Mobile UI, Design Systems, Illustrator", hourly_rate: 35, bio: "Modern ve minimalist tasarımlar oluşturma.", profile_picture: "https://randomuser.me/api/portraits/women/10.jpg" },
  
  // Graphic Design
  { name: "Kerem Yalçın", email: "kerem.yalcin@test.com", skills: "Photoshop, Illustrator, Logo Design, Branding", hourly_rate: 35, bio: "Kurumsal kimlik ve logo tasarımında 7 yıl deneyim.", profile_picture: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Merve Koç", email: "merve.koc@test.com", skills: "InDesign, Print Design, Packaging, Typography", hourly_rate: 30, bio: "Baskı malzemeleri ve ambalaj tasarımında uzman.", profile_picture: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Oğuz Erdoğan", email: "oguz.erdogan@test.com", skills: "Motion Graphics, After Effects, Premiere Pro", hourly_rate: 50, bio: "Video düzenleme ve animasyon tasarımı uzmanı.", profile_picture: "https://randomuser.me/api/portraits/men/13.jpg" },
  
  // Content Writing
  { name: "Fatma Öztürk", email: "fatma.ozturk@test.com", skills: "SEO Writing, Blog Posts, Copywriting, English", hourly_rate: 25, bio: "SEO dostu içerik ve blog yazısı.", profile_picture: "https://randomuser.me/api/portraits/women/14.jpg" },
  { name: "Ali Güneş", email: "ali.gunes@test.com", skills: "Technical Writing, Documentation, API Docs", hourly_rate: 35, bio: "Teknik dokümantasyon ve kullanıcı rehberi yazma.", profile_picture: "https://randomuser.me/api/portraits/men/15.jpg" },
  { name: "Gizem Aktaş", email: "gizem.aktas@test.com", skills: "Content Strategy, Social Media, Marketing Copy", hourly_rate: 30, bio: "İçerik stratejisi ve sosyal medya yönetimi.", profile_picture: "https://randomuser.me/api/portraits/women/16.jpg" },
  
  // Digital Marketing
  { name: "Hakan Polat", email: "hakan.polat@test.com", skills: "Google Ads, Facebook Ads, SEO, Analytics", hourly_rate: 40, bio: "Dijital pazarlama ve performans reklamcılığı uzmanı.", profile_picture: "https://randomuser.me/api/portraits/men/17.jpg" },
  { name: "İrem Çetin", email: "irem.cetin@test.com", skills: "Social Media Marketing, Instagram, TikTok", hourly_rate: 35, bio: "Sosyal medya pazarlaması ve influencer yönetimi.", profile_picture: "https://randomuser.me/api/portraits/women/18.jpg" },
  { name: "Kaan Yılmaz", email: "kaan.yilmaz@test.com", skills: "Email Marketing, CRM, Mailchimp, HubSpot", hourly_rate: 30, bio: "E-mail pazarlaması ve müşteri ilişkileri yönetimi.", profile_picture: "https://randomuser.me/api/portraits/men/19.jpg" },
  
  // Data Science & AI
  { name: "Lale Özdemir", email: "lale.ozdemir@test.com", skills: "Python, Machine Learning, TensorFlow, Data Analysis", hourly_rate: 60, bio: "Makine öğrenmesi ve veri analizi uzmanı.", profile_picture: "https://randomuser.me/api/portraits/women/20.jpg" },
  { name: "Mehmet Kara", email: "mehmet.kara@test.com", skills: "Deep Learning, NLP, Computer Vision, PyTorch", hourly_rate: 65, bio: "Yapay zeka ve derin öğrenme projeleri geliştirme.", profile_picture: "https://randomuser.me/api/portraits/men/21.jpg" },
  { name: "Nazlı Tuncer", email: "nazli.tuncer@test.com", skills: "Data Visualization, Tableau, Power BI, SQL", hourly_rate: 45, bio: "Veri görselleştirme ve iş zekası raporlaması.", profile_picture: "https://randomuser.me/api/portraits/women/22.jpg" },
  
  // Video & Animation
  { name: "Onur Başaran", email: "onur.basaran@test.com", skills: "Video Editing, Premiere Pro, DaVinci Resolve", hourly_rate: 40, bio: "Profesyonel video düzenleme ve renk düzeltme.", profile_picture: "https://randomuser.me/api/portraits/men/23.jpg" },
  { name: "Pınar Erdem", email: "pinar.erdem@test.com", skills: "2D Animation, After Effects, Character Animation", hourly_rate: 45, bio: "2D animasyon ve karakter tasarımı.", profile_picture: "https://randomuser.me/api/portraits/women/24.jpg" },
  { name: "Rıza Aksoy", email: "riza.aksoy@test.com", skills: "3D Modeling, Blender, Cinema 4D, Unity", hourly_rate: 55, bio: "3D modeller ve oyun kaynakları oluşturma.", profile_picture: "https://randomuser.me/api/portraits/men/25.jpg" },
  
  // Translation
  { name: "Sibel Doğan", email: "sibel.dogan@test.com", skills: "English-Turkish, Translation, Localization", hourly_rate: 25, bio: "Profesyonel İngilizce-Türkçe çeviri hizmetleri.", profile_picture: "https://randomuser.me/api/portraits/women/26.jpg" },
  { name: "Tarık Avcı", email: "tarik.avci@test.com", skills: "German-Turkish, Legal Translation, Technical", hourly_rate: 35, bio: "Almanca-Türkçe hukuki ve teknik çeviri.", profile_picture: "https://randomuser.me/api/portraits/men/27.jpg" },
  { name: "Ülkü Yavuz", email: "ulku.yavuz@test.com", skills: "French-Turkish, Literary Translation, Subtitling", hourly_rate: 30, bio: "Fransızca-Türkçe edebi çeviri ve altyazı.", profile_picture: "https://randomuser.me/api/portraits/women/28.jpg" },
  
  // DevOps & Cloud
  { name: "Volkan Tekin", email: "volkan.tekin@test.com", skills: "AWS, Docker, Kubernetes, CI/CD", hourly_rate: 60, bio: "Bulut altyapısı ve DevOps uzmanı.", profile_picture: "https://randomuser.me/api/portraits/men/29.jpg" },
  { name: "Yasemin Kurt", email: "yasemin.kurt@test.com", skills: "Azure, Terraform, Jenkins, Linux", hourly_rate: 55, bio: "Altyapı otomasyonu ve bulut mimarisi.", profile_picture: "https://randomuser.me/api/portraits/women/30.jpg" },
  
  // Cybersecurity
  { name: "Zafer Öz", email: "zafer.oz@test.com", skills: "Penetration Testing, Security Audit, Ethical Hacking", hourly_rate: 70, bio: "Siber güvenlik danışmanlığı ve penetrasyon testi.", profile_picture: "https://randomuser.me/api/portraits/men/31.jpg" },
  { name: "Aslı Demirci", email: "asli.demirci@test.com", skills: "Network Security, Firewall, SIEM, SOC", hourly_rate: 65, bio: "Ağ güvenliği ve güvenlik operasyonları merkezi.", profile_picture: "https://randomuser.me/api/portraits/women/32.jpg" },
  
  // E-commerce
  { name: "Baran Şen", email: "baran.sen@test.com", skills: "Shopify, WooCommerce, E-commerce SEO", hourly_rate: 40, bio: "E-ticaret mağazası kurulumu ve optimizasyonu.", profile_picture: "https://randomuser.me/api/portraits/men/33.jpg" },
  { name: "Ceren Acar", email: "ceren.acar@test.com", skills: "Amazon FBA, Dropshipping, Product Listing", hourly_rate: 35, bio: "Amazon ve marketplace mağazası yönetimi.", profile_picture: "https://randomuser.me/api/portraits/women/34.jpg" },
  
  // WordPress
  { name: "Doğan Kılıç", email: "dogan.kilic@test.com", skills: "WordPress, Elementor, Theme Development, PHP", hourly_rate: 35, bio: "WordPress tema ve eklenti geliştirme.", profile_picture: "https://randomuser.me/api/portraits/men/35.jpg" },
  { name: "Ece Yıldız", email: "ece.yildiz@test.com", skills: "WordPress Security, Speed Optimization, Maintenance", hourly_rate: 30, bio: "WordPress güvenliği ve performans optimizasyonu.", profile_picture: "https://randomuser.me/api/portraits/women/36.jpg" },
  
  // Game Development
  { name: "Ferhat Arslan", email: "ferhat.arslan@test.com", skills: "Unity, C#, Game Design, 2D Games", hourly_rate: 45, bio: "Unity ile mobil ve PC oyunları geliştirme.", profile_picture: "https://randomuser.me/api/portraits/men/37.jpg" },
  { name: "Gamze Türk", email: "gamze.turk@test.com", skills: "Unreal Engine, C++, 3D Games, Level Design", hourly_rate: 55, bio: "Unreal Engine ile AAA kalite oyun geliştirme.", profile_picture: "https://randomuser.me/api/portraits/women/38.jpg" },
  
  // Blockchain
  { name: "Harun Çelik", email: "harun.celik@test.com", skills: "Solidity, Smart Contracts, Web3, Ethereum", hourly_rate: 70, bio: "Blockchain ve akıllı kontrat geliştirme.", profile_picture: "https://randomuser.me/api/portraits/men/39.jpg" },
  { name: "Işıl Koç", email: "isil.koc@test.com", skills: "NFT, DeFi, dApp Development, Rust", hourly_rate: 65, bio: "NFT ve DeFi projeleri geliştirme.", profile_picture: "https://randomuser.me/api/portraits/women/40.jpg" }
];

async function seedFreelancers() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  let added = 0;
  let skipped = 0;

  for (const freelancer of freelancers) {
    const encryptedEmail = encrypt(freelancer.email);
    
    await new Promise((resolve) => {
      // Önce email var mı kontrol et
      db.get("SELECT id FROM users WHERE email = ?", [encryptedEmail], (err, existing) => {
        if (existing) {
          skipped++;
          resolve();
          return;
        }
        
        db.run(
          `INSERT INTO users (email, password, name, user_type, bio, skills, hourly_rate, profile_picture, rating, balance) 
           VALUES (?, ?, ?, 'freelancer', ?, ?, ?, ?, ?, ?)`,
          [
            encryptedEmail,
            hashedPassword,
            freelancer.name,
            freelancer.bio,
            freelancer.skills,
            freelancer.hourly_rate,
            freelancer.profile_picture,
            (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0 arası rastgele rating
            Math.floor(Math.random() * 5000) // 0 - 5000 arası rastgele bakiye
          ],
          function(err) {
            if (err) {
              console.error(`Error adding ${freelancer.name}:`, err.message);
            } else {
              added++;
              console.log(`✅ Added: ${freelancer.name} - ${freelancer.skills.split(',')[0]}`);
            }
            resolve();
          }
        );
      });
    });
  }

  console.log(`\n🎉 Seeding completed!`);
  console.log(`   Added: ${added} freelancers`);
  console.log(`   Skipped: ${skipped} (already exist)`);
  process.exit(0);
}

seedFreelancers();

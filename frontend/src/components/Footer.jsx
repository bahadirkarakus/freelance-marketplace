import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = {
    'Platform': [
      { label: 'How it Works (Hiring)', href: '/how-it-works/hiring' },
      { label: 'How it Works (Freelancer)', href: '/how-it-works/freelancer' },
      { label: 'Browse Projects', href: '/projects' },
      { label: 'Browse Freelancers', href: '/freelancers' },
      { label: 'Categories', href: '/projects' },
    ],
    'Company': [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/about' },
      { label: 'Blog', href: '/projects' },
      { label: 'Careers', href: '/about' },
      { label: 'Press', href: '/about' },
    ],
    'Legal': [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/policy' },
      { label: 'Copyright Policy', href: '/terms' },
      { label: 'Code of Conduct', href: '/terms' },
      { label: 'Security', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: '📘', label: 'Facebook', href: '#facebook' },
    { icon: '𝕏', label: 'Twitter', href: '#twitter' },
    { icon: '📺', label: 'YouTube', href: '#youtube' },
    { icon: '📷', label: 'Instagram', href: '#instagram' },
    { icon: '💼', label: 'LinkedIn', href: '#linkedin' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black dark:from-gray-950 dark:to-black text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl text-white font-bold">BK</span>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                BK Marketplace
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Connect with talented freelancers and build amazing projects together.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 my-8"></div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 py-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
              5,000+
            </div>
            <p className="text-gray-400 text-sm">Active Freelancers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              1,000+
            </div>
            <p className="text-gray-400 text-sm">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">
              $2M+
            </div>
            <p className="text-gray-400 text-sm">Total Payments</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left text-gray-400 text-sm">
            <p>© {currentYear} BK Marketplace. All rights reserved.</p>
            <p className="mt-2">
              Empowering freelancers and businesses worldwide 🚀
            </p>
          </div>

          {/* Language & Settings */}
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-gray-300 text-sm transition-all hover:text-white flex items-center gap-2"
            >
              <span>🌍</span>
              {i18n.language === 'en' ? 'English' : 'Türkçe'}
            </button>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-gray-300 text-sm transition-all hover:text-white flex items-center gap-2"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;

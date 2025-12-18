import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoryDetail = () => {
  const { category } = useParams();
  const { t } = useTranslation();

  const categoryData = {
    aiServices: {
      title: t('categories.detail.aiServices.title'),
      subtitle: t('categories.detail.aiServices.subtitle'),
      color: 'from-blue-500 to-cyan-500',
      icon: '🤖',
      popular: [
        { name: 'AI Chatbot Development', icon: '💬' },
        { name: 'Machine Learning', icon: '🧠' },
        { name: 'Data Analysis', icon: '📊' },
        { name: 'AI Content Generation', icon: '✍️' },
        { name: 'Computer Vision', icon: '👁️' }
      ],
      services: [
        {
          title: 'AI Development',
          items: ['AI Model Training', 'Natural Language Processing', 'Deep Learning', 'Neural Networks']
        },
        {
          title: 'Data Science',
          items: ['Data Analysis', 'Predictive Modeling', 'Big Data', 'Statistical Analysis']
        },
        {
          title: 'AI Integration',
          items: ['ChatGPT Integration', 'API Development', 'AI Automation', 'Bot Development']
        }
      ]
    },
    development: {
      title: t('categories.detail.development.title'),
      subtitle: t('categories.detail.development.subtitle'),
      color: 'from-purple-500 to-pink-500',
      icon: '💻',
      popular: [
        { name: 'Python Developers', icon: '🐍' },
        { name: 'JavaScript Developers', icon: '⚡' },
        { name: 'React Developers', icon: '⚛️' },
        { name: 'Node.js Developers', icon: '🟢' },
        { name: 'Full Stack Developers', icon: '🎯' }
      ],
      services: [
        {
          title: 'Website Development',
          items: ['WordPress', 'E-commerce', 'Landing Pages', 'Custom Websites']
        },
        {
          title: 'Mobile Apps',
          items: ['iOS Development', 'Android Development', 'React Native', 'Flutter']
        },
        {
          title: 'Backend Development',
          items: ['API Development', 'Database Design', 'Server Setup', 'DevOps']
        },
        {
          title: 'Frontend Development',
          items: ['React', 'Vue.js', 'Angular', 'HTML/CSS']
        }
      ]
    },
    design: {
      title: t('categories.detail.design.title'),
      subtitle: t('categories.detail.design.subtitle'),
      color: 'from-pink-500 to-rose-500',
      icon: '🎨',
      popular: [
        { name: 'Logo Design', icon: '🎯' },
        { name: 'UI/UX Design', icon: '📱' },
        { name: 'Graphic Design', icon: '🖼️' },
        { name: 'Illustration', icon: '✏️' },
        { name: 'Brand Identity', icon: '🏷️' }
      ],
      services: [
        {
          title: 'Graphics & Design',
          items: ['Logo Design', 'Brand Identity', 'Business Cards', 'Poster Design']
        },
        {
          title: 'UI/UX Design',
          items: ['Web Design', 'Mobile App Design', 'Wireframing', 'Prototyping']
        },
        {
          title: 'Visual Design',
          items: ['Illustration', '3D Design', 'Animation', 'Video Editing']
        }
      ]
    },
    marketing: {
      title: t('categories.detail.marketing.title'),
      subtitle: t('categories.detail.marketing.subtitle'),
      color: 'from-orange-500 to-yellow-500',
      icon: '📱',
      popular: [
        { name: 'SEO Services', icon: '🔍' },
        { name: 'Social Media Marketing', icon: '📲' },
        { name: 'Content Marketing', icon: '📝' },
        { name: 'Email Marketing', icon: '✉️' },
        { name: 'PPC Advertising', icon: '💰' }
      ],
      services: [
        {
          title: 'Digital Marketing',
          items: ['SEO', 'Social Media Marketing', 'Email Campaigns', 'Content Strategy']
        },
        {
          title: 'Advertising',
          items: ['Google Ads', 'Facebook Ads', 'Instagram Marketing', 'LinkedIn Marketing']
        },
        {
          title: 'Marketing Strategy',
          items: ['Market Research', 'Brand Strategy', 'Growth Hacking', 'Analytics']
        }
      ]
    },
    writing: {
      title: t('categories.detail.writing.title'),
      subtitle: t('categories.detail.writing.subtitle'),
      color: 'from-green-500 to-emerald-500',
      icon: '✍️',
      popular: [
        { name: 'Content Writing', icon: '📝' },
        { name: 'Copywriting', icon: '✨' },
        { name: 'Translation', icon: '🌐' },
        { name: 'Technical Writing', icon: '📋' },
        { name: 'Blog Writing', icon: '📰' }
      ],
      services: [
        {
          title: 'Content Writing',
          items: ['Blog Posts', 'Articles', 'Product Descriptions', 'Website Content']
        },
        {
          title: 'Translation',
          items: ['Document Translation', 'Website Translation', 'Localization', 'Proofreading']
        },
        {
          title: 'Creative Writing',
          items: ['Storytelling', 'Scriptwriting', 'eBook Writing', 'Ghost Writing']
        }
      ]
    },
    admin: {
      title: t('categories.detail.admin.title'),
      subtitle: t('categories.detail.admin.subtitle'),
      color: 'from-indigo-500 to-blue-500',
      icon: '👔',
      popular: [
        { name: 'Virtual Assistant', icon: '💼' },
        { name: 'Data Entry', icon: '⌨️' },
        { name: 'Customer Support', icon: '🎧' },
        { name: 'Project Management', icon: '📊' },
        { name: 'Admin Support', icon: '📁' }
      ],
      services: [
        {
          title: 'Virtual Assistance',
          items: ['Email Management', 'Calendar Management', 'Travel Planning', 'Research']
        },
        {
          title: 'Data Management',
          items: ['Data Entry', 'Data Mining', 'Excel Work', 'Database Management']
        },
        {
          title: 'Customer Service',
          items: ['Live Chat Support', 'Email Support', 'Phone Support', 'Help Desk']
        }
      ]
    }
  };

  const data = categoryData[category] || categoryData.development;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${data.color} text-white py-20`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">{data.icon}</div>
          <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
          <p className="text-xl mb-8">{data.subtitle}</p>
          <Link
            to="/projects"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            {t('categories.detail.howItWorks')}
          </Link>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {t('categories.detail.popular')}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {data.popular.map((service, index) => (
              <Link
                key={index}
                to={`/freelancers?service=${service.name}`}
                className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-6 py-4 hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {service.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
            {t('categories.detail.explore')} {data.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <ul className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to={`/freelancers?service=${item}`}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        → {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-gradient-to-r ${data.color} text-white py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('categories.detail.cta.title')}
          </h2>
          <p className="text-xl mb-8">{t('categories.detail.cta.subtitle')}</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              {t('categories.detail.cta.browseProjects')}
            </Link>
            <Link
              to="/register"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              {t('categories.detail.cta.getStarted')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;

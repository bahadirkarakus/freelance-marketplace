import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFreelancers, setFeaturedFreelancers] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchFeaturedFreelancers();
  }, []);

  const fetchFeaturedFreelancers = async () => {
    try {
      const response = await api.get('/users/freelancers?limit=4');
      setFeaturedFreelancers(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    }
  };

  const categories = [
    { icon: '💻', name: t('home.categories.development'), slug: 'development', jobs: '2,541' },
    { icon: '🎨', name: t('home.categories.design'), slug: 'design', jobs: '1,847' },
    { icon: '📱', name: t('home.categories.marketing'), slug: 'marketing', jobs: '1,234' },
    { icon: '✍️', name: t('home.categories.writing'), slug: 'writing', jobs: '987' },
    { icon: '🤖', name: t('home.categories.aiServices'), slug: 'aiServices', jobs: '756' },
    { icon: '💰', name: t('home.categories.finance'), slug: 'finance', jobs: '543' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/freelancers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 dark:opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full px-4 py-2 mb-8">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {t('homePage.hero.badge')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('homePage.hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {t('homePage.hero.titleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
              {t('homePage.hero.subtitle')}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('homePage.hero.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white shadow-lg shadow-gray-100 dark:shadow-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
              >
                {t('homePage.hero.primaryButton')}
              </button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-16">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-gray-500 dark:text-gray-400">{t('homePage.hero.stats.freelancers')}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">5K+</div>
                <div className="text-gray-500 dark:text-gray-400">{t('homePage.hero.stats.projects')}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-gray-500 dark:text-gray-400">{t('homePage.hero.stats.rating')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('homePage.categories.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('homePage.categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.jobs} {t('home.categories.jobs', 'jobs')}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/freelancers"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-4 transition-all"
            >
              {t('homePage.categories.viewAll')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            {t('home.whyChoose.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('home.whyChoose.talent.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.whyChoose.talent.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('home.whyChoose.matching.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.whyChoose.matching.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('home.whyChoose.quality.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.whyChoose.quality.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t('home.whyChoose.payment.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.whyChoose.payment.description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              {t('home.whyChoose.joinButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('home.features.quality.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.quality.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('home.features.diverse.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.diverse.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('home.features.fast.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.features.fast.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.guides.title')}
            </h2>
            <Link to="/projects" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:gap-3 font-semibold transition-all">
              {t('home.guides.seeMore')} <span>→</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <Link to="/register" className="group">
              <div className="h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <div className="h-40 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"></div>
                  <svg className="w-20 h-20 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {t('home.guides.freelancer.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                    {t('home.guides.freelancer.description')}
                  </p>
                  <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Learn more <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Guide 2 */}
            <Link to="/projects" className="group">
              <div className="h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <div className="h-40 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"></div>
                  <svg className="w-20 h-20 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('home.guides.client.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                    {t('home.guides.client.description')}
                  </p>
                  <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Learn more <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Guide 3 */}
            <Link to="/freelancers" className="group">
              <div className="h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <div className="h-40 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"></div>
                  <svg className="w-20 h-20 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t('home.guides.remote.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                    {t('home.guides.remote.description')}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Learn more <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.howItWorks.title', 'How it works')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle', 'Complete your project in 3 simple steps')}
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link to="/how-it-works/hiring" className="px-6 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold">
                {t('home.howItWorks.forHiring', 'For hiring')}
              </Link>
              <Link to="/how-it-works/freelancer" className="px-6 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold">
                {t('home.howItWorks.forFindingWork', 'For finding work')}
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg z-10 group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 shadow-md hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" 
                    alt="Browse or post projects"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {t('home.howItWorks.step1.title', 'Browse or post projects')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('home.howItWorks.step1.description', 'Find the perfect freelancer or post your project to get started')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg z-10 group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-md hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" 
                    alt="Get proposals and hire"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('home.howItWorks.step2.title', 'Get proposals and hire')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('home.howItWorks.step2.description', 'Review bids and choose the best freelancer for your project')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg z-10 group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-indigo-900/30 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" 
                    alt="Pay when work is done"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t('home.howItWorks.step3.title', 'Pay when work is done')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('home.howItWorks.step3.description', 'Secure payment and reliable work completion')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedStep && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedStep === 1 && t('home.howItWorks.step1.title', 'Browse or post projects')}
                  {selectedStep === 2 && t('home.howItWorks.step2.title', 'Get proposals and hire')}
                  {selectedStep === 3 && t('home.howItWorks.step3.title', 'Pay when work is done')}
                </h2>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {selectedStep === 1 && t('home.howItWorks.step1.description', 'Find the perfect freelancer or post your project to get started')}
                {selectedStep === 2 && t('home.howItWorks.step2.description', 'Review bids and choose the best freelancer for your project')}
                {selectedStep === 3 && t('home.howItWorks.step3.description', 'Secure payment and reliable work completion')}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedStep(null);
                    if (selectedStep === 1) {
                      navigate('/projects');
                    } else if (selectedStep === 2) {
                      navigate('/freelancers');
                    } else if (selectedStep === 3) {
                      navigate('/register');
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {selectedStep === 1 && t('nav.projects')}
                  {selectedStep === 2 && t('nav.freelancers')}
                  {selectedStep === 3 && t('homePage.cta.button')}
                </button>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {t('common.cancel', 'Close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('homePage.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('homePage.testimonials.subtitle')}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: AI Services */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Category Header */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="p-6">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.ai')}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.ai')}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=1" alt="Arda K" className="w-12 h-12 rounded-full ring-2 ring-blue-100 dark:ring-blue-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Arda K.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">LLM/RAG Agent System</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Dev & IT */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.dev')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.dev')}"
                </p>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=2" alt="Berkay S" className="w-12 h-12 rounded-full ring-2 ring-emerald-100 dark:ring-emerald-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Berkay S.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Full-Stack Developer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Design & Creative */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-600" />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-rose-500 rounded-full" />
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.design')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.design')}"
                </p>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=3" alt="Emre Y" className="w-12 h-12 rounded-full ring-2 ring-rose-100 dark:ring-rose-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Emre Y.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Video Editor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Marketing */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-600" />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-violet-500 rounded-full" />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.marketing')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.marketing')}"
                </p>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=4" alt="Caner Z" className="w-12 h-12 rounded-full ring-2 ring-violet-100 dark:ring-violet-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Caner Z.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Digital Marketing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Writing & Translation */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.writing')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.writing')}"
                </p>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Mehmet L" className="w-12 h-12 rounded-full ring-2 ring-amber-100 dark:ring-amber-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Mehmet L.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Copywriter & Content</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Admin & Support */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
              <div className="p-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-widest">
                    {t('homePage.testimonials.categories.admin')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-5">
                  "{t('homePage.testimonials.reviews.admin')}"
                </p>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <img src="https://i.pravatar.cc/100?img=6" alt="Ahmet A" className="w-12 h-12 rounded-full ring-2 ring-red-100 dark:ring-red-900/30 object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Ahmet A.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Project Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {t('homePage.faq.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
            {t('homePage.faq.subtitle')}
          </p>

          <div className="space-y-3">
            {/* FAQ Item 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q1')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 1 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('homePage.faq.a1')}
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q2')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 2 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 2 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('homePage.faq.a2_client')}</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>{t('homePage.faq.a2_freelancer')}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 3 ? null : 3)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q3')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 3 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 3 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('homePage.faq.a3_business')}</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>{t('homePage.faq.a3_freelancer')}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 4 ? null : 4)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q4')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 4 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 4 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {t('homePage.faq.a4')}
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 5 ? null : 5)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q5')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 5 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 5 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('homePage.faq.a5')}
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 6 ? null : 6)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {t('homePage.faq.q6')}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    expandedFaq === 6 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === 6 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('homePage.faq.a6')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('homePage.faq.getStarted')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8">{t('home.cta.subtitle')}</p>
          <Link
            to="/register"
            className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 inline-block"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

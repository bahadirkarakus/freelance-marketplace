import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { icon: '🤖', nameKey: 'aiServices', color: 'from-blue-500 to-cyan-500' },
    { icon: '💻', nameKey: 'development', color: 'from-purple-500 to-pink-500' },
    { icon: '🎨', nameKey: 'design', color: 'from-pink-500 to-rose-500' },
    { icon: '📱', nameKey: 'marketing', color: 'from-orange-500 to-yellow-500' },
    { icon: '✍️', nameKey: 'writing', color: 'from-green-500 to-emerald-500' },
    { icon: '👔', nameKey: 'admin', color: 'from-indigo-500 to-blue-500' },
    { icon: '💰', nameKey: 'finance', color: 'from-yellow-500 to-amber-500' },
    { icon: '⚖️', nameKey: 'legal', color: 'from-gray-500 to-slate-500' },
    { icon: '👥', nameKey: 'hr', color: 'from-teal-500 to-cyan-500' },
    { icon: '⚙️', nameKey: 'engineering', color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="space-x-4">
            <Link
              to="/projects"
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 inline-block"
            >
              {t('home.hero.browseProjects')}
            </Link>
            <Link
              to="/freelancers"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white inline-block"
            >
              {t('home.hero.findFreelancers')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {t('home.categories.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
            {t('home.categories.subtitle')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.nameKey}`}
                className="group bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`text-5xl mb-4 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t(`home.categories.${category.nameKey}`)}
                </h3>
              </Link>
            ))}
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
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.guides.title')}
            </h2>
            <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              {t('home.guides.seeMore')} →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <Link to="/register" className="group">
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-white text-2xl font-bold">
                      {t('home.guides.freelancer.icon')}
                    </h3>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t('home.guides.freelancer.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.guides.freelancer.description')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Guide 2 */}
            <Link to="/projects" className="group">
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-green-400 to-teal-400 dark:from-green-600 dark:to-teal-600 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-white text-2xl font-bold">
                      {t('home.guides.client.icon')}
                    </h3>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t('home.guides.client.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.guides.client.description')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Guide 3 */}
            <Link to="/freelancers" className="group">
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-white text-2xl font-bold">
                      {t('home.guides.remote.icon')}
                    </h3>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t('home.guides.remote.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.guides.remote.description')}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t('home.howItWorks.title', 'How it works')}
            </h2>
            <div className="hidden md:flex gap-4">
              <button className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold">
                {t('home.howItWorks.forHiring', 'For hiring')}
              </button>
              <button className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold">
                {t('home.howItWorks.forFindingWork', 'For finding work')}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <button 
              onClick={() => setSelectedStep(1)}
              className="group relative text-left hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute -top-4 -left-4 bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg z-10">
                1
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-yellow-200 via-green-200 to-cyan-200 dark:from-yellow-400 dark:via-green-400 dark:to-cyan-400 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop" 
                    alt="Browse or post projects"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('home.howItWorks.step1.title', 'Browse or post projects')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.howItWorks.step1.description', 'Find the perfect freelancer or post your project to get started')}
                  </p>
                </div>
              </div>
            </button>

            {/* Step 2 */}
            <button 
              onClick={() => setSelectedStep(2)}
              className="group relative text-left hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute -top-4 -left-4 bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg z-10">
                2
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-orange-200 via-pink-200 to-red-200 dark:from-orange-400 dark:via-pink-400 dark:to-red-400 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" 
                    alt="Get proposals and hire"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('home.howItWorks.step2.title', 'Get proposals and hire')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.howItWorks.step2.description', 'Review bids and choose the best freelancer for your project')}
                  </p>
                </div>
              </div>
            </button>

            {/* Step 3 */}
            <button 
              onClick={() => setSelectedStep(3)}
              className="group relative text-left hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute -top-4 -left-4 bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg z-10">
                3
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-teal-200 via-green-200 to-blue-200 dark:from-teal-400 dark:via-green-400 dark:to-blue-400 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" 
                    alt="Pay when work is done"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('home.howItWorks.step3.title', 'Pay when work is done')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('home.howItWorks.step3.description', 'Secure payment and reliable work completion')}
                  </p>
                </div>
              </div>
            </button>
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
                  {selectedStep === 1 && t('home.guides.seeMore', 'Browse Projects')}
                  {selectedStep === 2 && 'See All Freelancers'}
                  {selectedStep === 3 && 'Get Started'}
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
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Real results from clients
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
            See what our users are saying about working with freelancers on our platform
          </p>

          <div className="space-y-12">
            {/* Row 1 */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* AI Services */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-300 mb-2 uppercase">AI SERVICES</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "Rick is a fantastic AI/ML engineer with specialization in LLMs, delivering end-to-end solutions. He had a few concepts when we started the work, ultimately, he delivered a working solution. Looking forward to working with him again."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <img src="https://i.pravatar.cc/100?img=1" alt="Richard C" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Richard C.</div>
                    <div className="text-gray-600 dark:text-gray-400">LLM/RAG Agent System Development</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Mar 28, 2025</div>
                  </div>
                </div>
              </div>

              {/* Dev & IT */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-green-600 dark:text-green-300 mb-2 uppercase">DEV & IT</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "Haris came in and helped us transfer knowledge from our departing developer, meeting a serious deadline, without fail. His knowledge and experience are exceptional."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-green-200 dark:border-green-700">
                  <img src="https://i.pravatar.cc/100?img=2" alt="Haris S" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Haris S.</div>
                    <div className="text-gray-600 dark:text-gray-400">Full-Stack Developer</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Apr 7, 2025</div>
                  </div>
                </div>
              </div>

              {/* Design & Creative */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-pink-600 dark:text-pink-300 mb-2 uppercase">DESIGN & CREATIVE</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "Ezzan did an amazing job editing my videos— fast turnaround, great attention to detail, and very easy to work with. He follows directions well and delivers high-quality work consistently. Highly recommend him!"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-pink-200 dark:border-pink-700">
                  <img src="https://i.pravatar.cc/100?img=3" alt="Ezzan S" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Ezzan S.</div>
                    <div className="text-gray-600 dark:text-gray-400">Short form and long form video editor</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Mar 14, 2025</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sales & Marketing */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-300 mb-2 uppercase">SALES & MARKETING</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "We loved working with Jibran and his team. They are very professional and know what they are doing. Very responsive and actually take the time to understand the project and are very methodical and thoughtful about how to approach each project."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-purple-200 dark:border-purple-700">
                  <img src="https://i.pravatar.cc/100?img=4" alt="Jibran Z" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Jibran Z.</div>
                    <div className="text-gray-600 dark:text-gray-400">Social media posts and marketing</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Mar 10, 2025</div>
                  </div>
                </div>
              </div>

              {/* Writing & Translation */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-yellow-600 dark:text-yellow-300 mb-2 uppercase">WRITING & TRANSLATION</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "Michael is very skilled and highly professional. Understood the assignment, followed instructions, and was also able to be flexible and creative. One of the rare copywriters I've worked with who can come up with something outside the box, but still on brand."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-yellow-200 dark:border-yellow-700">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Michael L" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Michael L.</div>
                    <div className="text-gray-600 dark:text-gray-400">Email marketing series to announce brand launch</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Jan 31, 2025</div>
                  </div>
                </div>
              </div>

              {/* Admin & Customer Support */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-red-600 dark:text-red-300 mb-2 uppercase">ADMIN & SUPPORT</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      "Ahmed was a great asset to our team. He brought a keen eye for inefficiencies, spotted process rigor, and expertly configured ClickUp to ensure sustainable usage and management moving forward. His insights and structured approach have had a lasting impact on our workflows."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-red-200 dark:border-red-700">
                  <img src="https://i.pravatar.cc/100?img=6" alt="Ahmed A" className="w-10 h-10 rounded-full" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900 dark:text-white">Ahmed A.</div>
                    <div className="text-gray-600 dark:text-gray-400">Technical Project Manager</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Feb 5, 2025</div>
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
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
            Everything you need to know about BK Marketplace
          </p>

          <div className="space-y-3">
            {/* FAQ Item 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  What is BK Marketplace?
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
                    BK Marketplace is a global work marketplace that connects businesses, agencies, and freelancers. It's free for anyone to sign up and get started. Whether you're looking for skilled professionals or seeking projects, you'll find both on our platform.
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
                  How does BK Marketplace work?
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
                    <strong>For Clients:</strong> Browse for freelancers, post projects, review proposals, and conduct interviews on our platform.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>For Freelancers:</strong> Browse projects, submit proposals, collaborate with clients, and get paid securely through our platform.
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
                  Who is BK Marketplace for?
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
                    <strong>For Businesses:</strong> Companies of all sizes can use BK Marketplace to find flexible, reliable freelance talent.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>For Freelancers:</strong> It's a great place for beginners to start freelancing and grow their career. Experienced freelancers use it to find consistent work.
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
                  How much does BK Marketplace cost?
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
                    It's free to sign up and create a profile. Pricing varies depending on membership plans, but basic access is free for both freelancers and clients.
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
                  How do I get paid?
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
                    You get paid when the client approves the work. We use secure payment processing to ensure both freelancers and clients are protected. Payment is transferred to your preferred method once the project is completed and approved.
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
                  Is it safe to work on BK Marketplace?
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
                    Yes. We use secure payment processing, verified profiles, and rating systems to protect both freelancers and clients. Always communicate through our platform and use secure payments for your protection.
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
              Get Started Today
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

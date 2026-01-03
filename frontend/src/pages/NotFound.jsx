import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-bounce">
              404
            </div>
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-20 -z-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-lg mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </p>

          {/* Illustration */}
          <div className="mb-10">
            <div className="inline-block">
              <div className="w-48 h-48 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Lost character */}
                  <circle cx="100" cy="60" r="20" fill="#667eea" opacity="0.2" />
                  <circle cx="100" cy="60" r="15" fill="none" stroke="#667eea" strokeWidth="2" />
                  
                  {/* Confused face */}
                  <circle cx="95" cy="55" r="2" fill="#667eea" />
                  <circle cx="105" cy="55" r="2" fill="#667eea" />
                  <path d="M 95 65 Q 100 62 105 65" stroke="#667eea" strokeWidth="2" fill="none" strokeLinecap="round" />
                  
                  {/* Body */}
                  <rect x="85" y="75" width="30" height="40" fill="none" stroke="#764ba2" strokeWidth="2" rx="5" />
                  
                  {/* Arms */}
                  <line x1="70" y1="85" x2="85" y2="85" stroke="#764ba2" strokeWidth="2" strokeLinecap="round" />
                  <line x1="115" y1="85" x2="130" y2="85" stroke="#764ba2" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Legs */}
                  <line x1="90" y1="115" x2="90" y2="140" stroke="#fa709a" strokeWidth="2" strokeLinecap="round" />
                  <line x1="110" y1="115" x2="110" y2="140" stroke="#fa709a" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Question marks */}
                  <text x="30" y="40" fontSize="24" fill="#fee140" opacity="0.6">?</text>
                  <text x="160" y="80" fontSize="28" fill="#fa709a" opacity="0.5">?</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              Go Home
            </Link>
            
            <Link
              to="/projects"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              Browse Projects
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
              Or explore these sections:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/projects"
                className="px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:shadow-md transition-all"
              >
                Projects
              </Link>
              <Link
                to="/freelancers"
                className="px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:shadow-md transition-all"
              >
                Freelancers
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded-lg font-semibold hover:shadow-md transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-gray-500 dark:text-gray-500">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFound;

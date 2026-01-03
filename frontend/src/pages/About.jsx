import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About BK Marketplace</h1>
          <p className="text-xl opacity-90">
            Connecting talented freelancers with businesses worldwide
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              At BK Marketplace, we believe in empowering freelancers and businesses to achieve their goals together. 
              Our mission is to create a seamless platform where talent meets opportunity, enabling professionals 
              to showcase their skills and businesses to find the perfect match for their projects.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              Founded in 2024, BK Marketplace was born from a simple idea: make freelancing accessible, 
              transparent, and rewarding for everyone. We've grown from a small startup to a thriving community 
              of over 5,000 freelancers and countless successful projects.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  🎯 For Clients
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Access to verified freelancers</li>
                  <li>• Secure payment system</li>
                  <li>• Project management tools</li>
                  <li>• Quality assurance</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  💼 For Freelancers
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Global opportunities</li>
                  <li>• Fair payment terms</li>
                  <li>• Portfolio showcase</li>
                  <li>• Skill-based matching</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Trust & Transparency
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe in building trust through transparency in all our operations and communications.
                </p>
              </div>
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Quality First
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We maintain high standards and ensure quality in every project and interaction.
                </p>
              </div>
              <div className="border-l-4 border-pink-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Innovation
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We continuously improve our platform with cutting-edge features and technologies.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Join Us Today
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Whether you're looking to hire talent or showcase your skills, BK Marketplace is here to help 
              you succeed. Join our growing community and start your journey today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/projects"
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Browse Projects
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;

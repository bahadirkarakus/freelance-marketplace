import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: December 31, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using BK Marketplace, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Platform Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BK Marketplace is a platform that connects clients who need services with freelancers who provide 
              those services. We facilitate the connection but are not party to the actual contracts between 
              clients and freelancers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You must be at least 18 years old to use our platform</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You may not create multiple accounts</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. For Clients
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide clear and accurate project descriptions</li>
              <li>Set reasonable budgets and deadlines</li>
              <li>Review bids carefully before accepting</li>
              <li>Communicate professionally with freelancers</li>
              <li>Make timely payments for completed work</li>
              <li>Provide fair reviews and ratings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. For Freelancers
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Accurately represent your skills and experience</li>
              <li>Submit honest and competitive bids</li>
              <li>Deliver work as described and on time</li>
              <li>Communicate professionally with clients</li>
              <li>Provide original work and respect intellectual property</li>
              <li>Maintain portfolio with your actual work</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Payments and Fees
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All payments are processed securely through Stripe. BK Marketplace charges a service fee on all 
              transactions. Payment terms are agreed upon between clients and freelancers.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Platform fee: 10% on all transactions</li>
              <li>Payments are held securely until project completion</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Disputes must be reported within 14 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Prohibited Activities
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Circumvent the platform's payment system</li>
              <li>Post fraudulent, misleading, or illegal content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to scrape or copy platform data</li>
              <li>Engage in price manipulation or bid rigging</li>
              <li>Violate intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Dispute Resolution
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In case of disputes between users, we encourage direct communication first. If unresolved, 
              you may contact our support team for mediation. We reserve the right to make final decisions 
              on disputes affecting platform integrity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to terminate or suspend accounts that violate these terms without prior 
              notice. You may also delete your account at any time from your profile settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about these Terms & Conditions, contact us at:
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Email: legal@bkmarketplace.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

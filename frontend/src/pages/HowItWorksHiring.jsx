import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorksHiring = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: "Post Your Project",
      description: "Describe your project, set your budget, and specify the skills you need. It's free to post!",
      icon: "📝",
      color: "from-blue-500 to-cyan-500",
      details: [
        "Write a clear project description",
        "Set your budget range",
        "Choose project category",
        "Define timeline and milestones"
      ]
    },
    {
      number: 2,
      title: "Review Proposals",
      description: "Receive bids from talented freelancers worldwide. Compare portfolios, ratings, and prices.",
      icon: "👀",
      color: "from-purple-500 to-pink-500",
      details: [
        "Compare freelancer profiles",
        "Review portfolios and past work",
        "Check ratings and reviews",
        "Chat with candidates"
      ]
    },
    {
      number: 3,
      title: "Hire the Best",
      description: "Select the perfect freelancer for your project. Discuss details and agree on terms.",
      icon: "🤝",
      color: "from-green-500 to-emerald-500",
      details: [
        "Interview top candidates",
        "Negotiate terms and price",
        "Set clear expectations",
        "Accept the winning bid"
      ]
    },
    {
      number: 4,
      title: "Pay Securely",
      description: "Our secure payment system ensures your money is protected until work is completed.",
      icon: "💳",
      color: "from-yellow-500 to-orange-500",
      details: [
        "Secure escrow system",
        "Milestone-based payments",
        "Money-back guarantee",
        "24/7 payment support"
      ]
    }
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Global Talent Pool",
      description: "Access millions of skilled professionals from around the world"
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Find quality work at competitive prices that fit your budget"
    },
    {
      icon: "⚡",
      title: "Fast Turnaround",
      description: "Get your projects done quickly with dedicated freelancers"
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "Your payment is protected until you approve the work"
    },
    {
      icon: "⭐",
      title: "Quality Guaranteed",
      description: "Review ratings and portfolios to find the best talent"
    },
    {
      icon: "💬",
      title: "Easy Communication",
      description: "Chat directly with freelancers and track progress in real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6">
              👔 FOR EMPLOYERS
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hire the Best Freelancers for Your Project
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Find talented professionals, get quality work done, and only pay when you're satisfied with the results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-project"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Post a Project Free →
              </Link>
              <Link
                to="/freelancers"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Browse Freelancers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Hire in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our streamlined process makes it easy to find and hire the perfect freelancer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 z-0"></div>
                )}
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-3xl mb-6`}>
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Hire on Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of businesses who trust us for their freelance needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Active Freelancers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Post your project today and start receiving proposals from talented freelancers within minutes.
              </p>
              <Link
                to="/create-project"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Post a Project Now →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksHiring;

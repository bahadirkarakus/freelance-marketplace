import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorksFreelancer = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Build a compelling profile that showcases your skills, experience, and portfolio.",
      icon: "👤",
      color: "from-emerald-500 to-teal-500",
      details: [
        "Add your professional bio",
        "List your skills and expertise",
        "Upload portfolio samples",
        "Set your hourly rate"
      ]
    },
    {
      number: 2,
      title: "Browse Projects",
      description: "Explore thousands of projects posted by clients worldwide. Filter by category, budget, and skills.",
      icon: "🔍",
      color: "from-blue-500 to-indigo-500",
      details: [
        "Search by skill or category",
        "Filter by budget range",
        "Save interesting projects",
        "Get notifications for new jobs"
      ]
    },
    {
      number: 3,
      title: "Submit Proposals",
      description: "Send compelling proposals to projects that match your expertise. Stand out from the competition.",
      icon: "📨",
      color: "from-purple-500 to-pink-500",
      details: [
        "Write personalized proposals",
        "Showcase relevant experience",
        "Set competitive pricing",
        "Propose realistic timelines"
      ]
    },
    {
      number: 4,
      title: "Get Paid",
      description: "Complete the work and receive secure payments directly to your account. Build your reputation!",
      icon: "💵",
      color: "from-yellow-500 to-orange-500",
      details: [
        "Milestone-based payments",
        "Secure payment protection",
        "Multiple withdrawal options",
        "Build your ratings"
      ]
    }
  ];

  const benefits = [
    {
      icon: "🏠",
      title: "Work From Anywhere",
      description: "Freedom to work from home, a cafe, or anywhere in the world"
    },
    {
      icon: "⏰",
      title: "Flexible Schedule",
      description: "Choose your own hours and work when you're most productive"
    },
    {
      icon: "💸",
      title: "Unlimited Earnings",
      description: "No cap on how much you can earn - the sky's the limit!"
    },
    {
      icon: "📈",
      title: "Grow Your Career",
      description: "Build your portfolio and reputation with each project"
    },
    {
      icon: "🌟",
      title: "Diverse Projects",
      description: "Work on exciting projects across different industries"
    },
    {
      icon: "🤝",
      title: "Direct Client Contact",
      description: "Communicate directly with clients without middlemen"
    }
  ];

  const categories = [
    { name: "Web Development", icon: "💻", jobs: "5,000+" },
    { name: "Mobile Apps", icon: "📱", jobs: "3,200+" },
    { name: "UI/UX Design", icon: "🎨", jobs: "4,100+" },
    { name: "Content Writing", icon: "✍️", jobs: "6,500+" },
    { name: "Digital Marketing", icon: "📊", jobs: "2,800+" },
    { name: "Video Editing", icon: "🎬", jobs: "1,900+" },
    { name: "Data Science", icon: "📉", jobs: "1,500+" },
    { name: "Translation", icon: "🌐", jobs: "2,200+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6">
              💼 FOR FREELANCERS
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Turn Your Skills Into Income
            </h1>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Join thousands of freelancers earning money doing what they love. Find projects, work flexibly, and build your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Freelancing →
              </Link>
              <Link
                to="/projects"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Browse Projects
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
              Start Earning in 4 Easy Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform makes it simple to find work and get paid
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
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
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

      {/* Popular Categories */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find work in your area of expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/projects?category=${encodeURIComponent(category.name)}`}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 dark:hover:from-gray-800 dark:hover:to-gray-800 transition-all duration-300 group text-center"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                  {category.jobs} jobs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Freelance With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enjoy the freedom and flexibility of freelance work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
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

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Freelancer Success Stories
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-emerald-600">
                  AK
                </div>
                <div className="ml-4">
                  <div className="text-white font-bold">Alex K.</div>
                  <div className="text-emerald-200 text-sm">Web Developer</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "I quit my 9-5 job and now earn 3x more working on my own terms. Best decision ever!"
              </p>
              <div className="mt-4 text-emerald-200 font-semibold">$150K+ earned</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-emerald-600">
                  SM
                </div>
                <div className="ml-4">
                  <div className="text-white font-bold">Sarah M.</div>
                  <div className="text-emerald-200 text-sm">Graphic Designer</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "Started as a side hustle, now it's my full-time career. The platform made it so easy to find clients!"
              </p>
              <div className="mt-4 text-emerald-200 font-semibold">$80K+ earned</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-emerald-600">
                  JL
                </div>
                <div className="ml-4">
                  <div className="text-white font-bold">John L.</div>
                  <div className="text-emerald-200 text-sm">Content Writer</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "As a college student, this platform helped me pay my tuition while gaining real experience."
              </p>
              <div className="mt-4 text-emerald-200 font-semibold">$45K+ earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Freelance Journey?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Create your free profile today and start receiving project invitations from clients worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Create Free Account →
                </Link>
                <Link
                  to="/projects"
                  className="inline-block px-10 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  View Open Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksFreelancer;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Award,
  Users,
  Recycle,
  Globe,
  CheckCircle,
  ArrowRight,
  Shield,
  Heart,
  BarChart
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Admin Home Page
 * Showcases sustainability goals, principles, and platform purpose
 */
const AdminHome = () => {
  const navigate = useNavigate();
  const { admin, isAuthenticated } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const impactRef = useRef(null);

  // Counter animation for impact statistics
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (impactRef.current) {
      observer.observe(impactRef.current);
    }

    return () => {
      if (impactRef.current) {
        observer.unobserve(impactRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      const isPercentage = target.includes('%');
      const isKg = target.includes('K');
      const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
      
      let current = 0;
      const increment = numericTarget / 100;
      const duration = 2000; // 2 seconds
      const stepTime = duration / 100;

      const updateCounter = () => {
        current += increment;
        if (current < numericTarget) {
          if (isKg) {
            counter.textContent = Math.ceil(current) + 'K+';
          } else if (isPercentage) {
            counter.textContent = Math.ceil(current) + '%';
          } else {
            counter.textContent = Math.ceil(current) + '+';
          }
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  };

  const principles = [
    {
      icon: <Recycle className="h-8 w-8" />,
      title: 'Reduce & Recycle',
      description: 'Minimize waste generation and maximize material recovery through efficient collection systems.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Environmental Protection',
      description: 'Protect our planet by ensuring proper waste disposal and promoting circular economy practices.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Engagement',
      description: 'Empower citizens to participate actively in sustainable waste management initiatives.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Efficient Operations',
      description: 'Optimize collection routes and schedules to reduce carbon footprint and operational costs.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const benefits = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: 'Environmental Impact',
      points: [
        'Reduced landfill waste by up to 60%',
        'Lower greenhouse gas emissions',
        'Conservation of natural resources',
        'Protection of ecosystems'
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      title: 'Economic Benefits',
      points: [
        'Cost-effective waste collection',
        'Job creation in recycling sector',
        'Revenue from recyclable materials',
        'Reduced municipal costs'
      ]
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: 'Social Value',
      points: [
        'Cleaner, healthier communities',
        'Improved quality of life',
        'Educational opportunities',
        'Community pride and ownership'
      ]
    }
  ];

  const sdgGoals = [
    {
      number: '11',
      title: 'Sustainable Cities',
      description: 'Make cities inclusive, safe, resilient and sustainable'
    },
    {
      number: '12',
      title: 'Responsible Consumption',
      description: 'Ensure sustainable consumption and production patterns'
    },
    {
      number: '13',
      title: 'Climate Action',
      description: 'Take urgent action to combat climate change'
    }
  ];

  const achievements = [
    { value: '10K+', label: 'Waste Collected (kg)' },
    { value: '500+', label: 'Active Users' },
    { value: '95%', label: 'Customer Satisfaction' },
    { value: '40%', label: 'Carbon Reduction' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Welcome Banner for Authenticated Admin */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Welcome, {admin?.name || admin?.firstName || 'Admin'}! 👋
            </h2>
            <p className="text-green-100 mt-1">
              Ready to manage and optimize our waste management system?
            </p>
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-gradient-to-r from-green-800 to-emerald-900 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero/clean-environment.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-900/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-green-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Building a Sustainable Future
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Empowering communities through intelligent waste management and environmental stewardship
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {admin ? (
                <>
                  <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200 bg-white text-green-800 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </button>
                  <button 
                    onClick={() => navigate('/requests')}
                    className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    View Requests
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/admin/login')}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200 bg-white text-green-800 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Login
                  </button>
                  <button 
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Learn More
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              To revolutionize waste management through technology, creating cleaner cities and a healthier planet. 
              We believe that every piece of waste properly managed is a step towards environmental sustainability 
              and a better future for generations to come.
            </p>
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/images/hero/smart-waste.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Core Principles
            </h2>
            <p className="text-xl text-gray-300">
              Guiding our approach to sustainable waste management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                  {principle.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Benefits of Sustainable Waste Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Creating value for communities, environment, and economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {benefit.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SDG Goals */}
      <div 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/images/hero/admin-stats.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Globe className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">
              UN Sustainable Development Goals
            </h2>
            <p className="text-xl text-blue-100">
              Aligned with global sustainability targets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sdgGoals.map((goal, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center hover:bg-white/20 transition-all"
              >
                <div className="text-6xl font-bold text-white mb-4">
                  {goal.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {goal.title}
                </h3>
                <p className="text-blue-100">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div ref={impactRef} className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real results in sustainability and waste management
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div 
                  className="counter text-5xl font-bold text-green-600 mb-2"
                  data-target={achievement.value}
                >
                  0
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Start managing sustainable waste operations today
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {admin ? (
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200 bg-white text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Shield className="h-5 w-5 mr-2" />
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200 bg-white text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

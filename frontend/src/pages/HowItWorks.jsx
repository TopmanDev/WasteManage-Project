import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Recycle,
  MapPin,
  Clock,
  Shield,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * How It Works Page
 * Step-by-step guide on using the platform
 */
const HowItWorks = () => {
  // State to track which FAQ items are expanded
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };
  const steps = [
    {
      number: '01',
      icon: <UserPlus className="h-12 w-12" />,
      title: 'Create Your Account',
      description: 'Sign up in minutes with your basic information. It\'s free and easy to get started.',
      image: '/images/steps/step1-signup.jpg',
      details: [
        'Enter your name and contact details',
        'Provide your address for pickup',
        'Set up your secure password',
        'Verify your email address'
      ]
    },
    {
      number: '02',
      icon: <FileText className="h-12 w-12" />,
      title: 'Submit a Pickup Request',
      description: 'Tell us what type of waste you have and how much. Select from paper, plastics, or metal.',
      image: '/images/steps/step2-request.jpg',
      details: [
        'Choose your waste type (paper, plastics, metal)',
        'Estimate the weight of your waste',
        'Add any special instructions',
        'Upload photos if needed'
      ]
    },
    {
      number: '03',
      icon: <Calendar className="h-12 w-12" />,
      title: 'Schedule Your Pickup',
      description: 'Choose a convenient date and time for collection. Our system finds the optimal route.',
      image: '/images/steps/step3-schedule.jpg',
      details: [
        'Select your preferred pickup date',
        'Choose a convenient time slot',
        'Get instant confirmation',
        'Receive reminders before pickup'
      ]
    },
    {
      number: '04',
      icon: <Truck className="h-12 w-12" />,
      title: 'We Collect Your Waste',
      description: 'Our team arrives at your scheduled time to collect your recyclables safely and efficiently.',
      image: '/images/steps/step4-collect.jpg',
      details: [
        'Track your pickup in real-time',
        'Get notified when driver is nearby',
        'Safe and professional collection',
        'Immediate confirmation upon completion'
      ]
    },
    {
      number: '05',
      icon: <Recycle className="h-12 w-12" />,
      title: 'Recycling & Impact',
      description: 'Your waste is processed responsibly. Track your environmental impact and contribution.',
      image: '/images/steps/step5-recycle.jpg',
      details: [
        'View your recycling statistics',
        'See your environmental impact',
        'Earn rewards for consistency',
        'Contribute to community goals'
      ]
    }
  ];

  const features = [
    {
      icon: <MapPin className="h-10 w-10" />,
      title: 'Smart Routing',
      description: 'AI-powered route optimization ensures efficient collection and reduces carbon footprint.'
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: 'Flexible Scheduling',
      description: 'Choose pickup times that work for you with our easy-to-use scheduling system.'
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Secure & Reliable',
      description: 'Your data is protected, and our service is dependable with 95% on-time pickups.'
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Track Your Impact',
      description: 'See real-time statistics on your recycling contributions and environmental impact.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero/clean-environment.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Simple, efficient, and sustainable waste collection in 5 easy steps
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-lg">Get started in less than 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Journey to Sustainable Waste Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Follow these simple steps to make a positive environmental impact
            </p>
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} animate-slide-${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl font-bold text-green-600/20">
                      {step.number}
                    </div>
                    <div className="bg-green-600 text-white p-4 rounded-2xl">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} animate-slide-${index % 2 === 0 ? 'right' : 'left'}`}>
                  <div 
                    className="rounded-2xl overflow-hidden shadow-2xl h-96 bg-cover bg-center transform hover:scale-105 transition-all duration-500"
                    style={{ backgroundImage: `url(${step.image})` }}
                  >
                    <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div className="text-white">
                        <div className="text-4xl font-bold mb-2">Step {index + 1}</div>
                        <div className="text-xl">{step.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built with modern technology for maximum convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6 text-green-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Common Questions
            </h2>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              👆 Click on each question to see the answer
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Is there a fee for using the service?',
                a: 'No! Creating an account and submitting pickup requests is completely free. We believe in making sustainable waste management accessible to everyone.'
              },
              {
                q: 'How quickly can I schedule a pickup?',
                a: 'You can schedule pickups as soon as the next business day. Our smart routing system optimizes collection times for maximum efficiency.'
              },
              {
                q: 'What types of waste do you collect?',
                a: 'We currently collect three main categories: paper (cardboard boxes, packaging), plastics (bottles, containers), and metal (aluminum cans, metal containers).'
              },
              {
                q: 'Can I track my pickup in real-time?',
                a: 'Yes! Once your pickup is scheduled, you can track the status in real-time and receive notifications when our collection team is nearby.'
              }
            ].map((faq, index) => {
              const isExpanded = expandedFaqs.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => toggleFaq(index)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-start justify-between gap-3">
                    <span className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-6 w-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-green-600 flex-shrink-0" />
                    )}
                  </h3>
                  {isExpanded && (
                    <p className="text-gray-600 dark:text-gray-400 ml-9 animate-slide-up">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero/smart-waste.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-blue-600/90"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10">
            Join thousands of users making a positive environmental impact every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Create Free Account
              <ArrowRight className="h-6 w-6" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition-all transform hover:scale-105 shadow-2xl border-2 border-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;

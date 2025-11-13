// Import React and necessary components
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, MapPin, TrendingUp, Users, ChevronLeft, ChevronRight, Star, Leaf, Award, CheckCircle } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { useAuth } from '../context/AuthContext';

/**
 * Home page component
 * Landing page with overview and call-to-action
 */
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const impactRef = useRef(null);
  const { user, admin, isAuthenticated } = useAuth();

  // Image carousel data
  const carouselImages = [
    {
      url: '/images/hero/clean-environment.jpg',
      title: 'Clean Environment',
      subtitle: 'Building sustainable communities together'
    },
    {
      url: '/images/hero/smart-waste.jpg',
      title: 'Smart Waste Management',
      subtitle: 'Technology-driven recycling solutions'
    },
    {
      url: '/images/hero/recycling-easy.jpg',
      title: 'Recycling Made Easy',
      subtitle: 'One request at a time'
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

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
    const currentRef = impactRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      const isPercentage = target.includes('%');
      const isKPlus = target.includes('K+');
      const isPlus = target.includes('+') && !isKPlus;
      
      let numericTarget;
      if (isKPlus) {
        numericTarget = parseInt(target.replace('K+', '')) * 1000;
      } else {
        numericTarget = parseInt(target.replace(/[^\d]/g, ''));
      }
      
      let current = 0;
      const increment = numericTarget / 100;
      const duration = 2000; // 2 seconds
      const stepTime = duration / 100;

      const updateCounter = () => {
        current += increment;
        if (current < numericTarget) {
          if (isKPlus) {
            counter.textContent = (current / 1000).toFixed(0) + 'K+';
          } else if (isPercentage) {
            counter.textContent = Math.ceil(current) + '%';
          } else if (isPlus) {
            counter.textContent = Math.ceil(current) + '+';
          } else {
            counter.textContent = Math.ceil(current);
          }
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  };

  // Features data
  const features = [
    {
      icon: <Recycle className="h-12 w-12 text-green-600" />,
      title: 'Easy Pickup Requests',
      description: 'Submit waste pickup requests for paper, plastics, and metal with just a few clicks.'
    },
    {
      icon: <MapPin className="h-12 w-12 text-blue-600" />,
      title: 'Smart Routing',
      description: 'Optimized collection routes ensure efficient and timely waste pickup services.'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
      title: 'Track Progress',
      description: 'Monitor your pickup requests and view real-time status updates.'
    },
    {
      icon: <Users className="h-12 w-12 text-orange-600" />,
      title: 'Community Impact',
      description: 'Join the sustainable waste management movement and make a difference.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Welcome Banner for Authenticated Users */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Welcome, {user?.firstName || admin?.name || admin?.firstName || 'User'}! 👋
            </h2>
            <p className="text-green-100 mt-1">
              Ready to make a difference in waste management today?
            </p>
          </div>
        </div>
      )}

      {/* Image Carousel Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/80"></div>
          </div>
        ))}

        {/* Carousel Content */}
        <div className="relative h-full flex items-center justify-center text-white z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                {carouselImages[currentSlide].title}
              </h1>
              <p className="text-2xl md:text-3xl mb-8 text-green-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {carouselImages[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {isAuthenticated ? (
                  <>
                    <Link to="/new-request">
                      <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                        Request Pickup
                      </button>
                    </Link>
                    <Link to="/dashboard">
                      <button className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                        My Dashboard
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                        Get Started
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Modern solutions for efficient waste collection and recycling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste Types Section with Images */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/images/hero/clean-environment.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin-slow" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What We Collect
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We specialize in recyclable waste materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Paper */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/waste-types/paper.jpg)' }}
              >
                <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-3xl font-bold text-white">📦 Paper</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Cardboard boxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Packaging materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Paper products</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plastics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/waste-types/plastics.jpg)' }}
              >
                <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-3xl font-bold text-white">♻️ Plastics</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>PET bottles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Plastic containers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Bags and packaging</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Metal */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/waste-types/metal.jpg)' }}
              >
                <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-3xl font-bold text-white">🥫 Metal</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Aluminum cans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Metal containers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Tin packaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={impactRef} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Pickups Completed', icon: <CheckCircle className="h-8 w-8" /> },
              { value: '5K+', label: 'Happy Customers', icon: <Users className="h-8 w-8" /> },
              { value: '95%', label: 'Satisfaction Rate', icon: <Star className="h-8 w-8" /> },
              { value: '50+', label: 'Tons Recycled', icon: <Recycle className="h-8 w-8" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-all duration-300">
                <div className="flex justify-center mb-3 text-green-600">
                  {stat.icon}
                </div>
                <div 
                  className="counter text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  data-target={stat.value}
                >
                  0
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of households and businesses in creating a cleaner, greener future.
          </p>
          {isAuthenticated ? (
            <Link to="/new-request">
              <button className="px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Request Pickup Now
              </button>
            </Link>
          ) : (
            <Link to="/register">
              <button className="px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Get Started Today
              </button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

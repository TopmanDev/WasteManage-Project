import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Target, Heart, Users, Globe, Recycle, Award, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * About Us Page
 * Information about the waste management platform
 */
const AboutUs = () => {
  // State to track which value cards are expanded
  const [expandedCards, setExpandedCards] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Toggle card expansion
  const toggleCard = (index) => {
    if (expandedCards.includes(index)) {
      setExpandedCards(expandedCards.filter(i => i !== index));
    } else {
      setExpandedCards([...expandedCards, index]);
    }
  };

  // Counter animation for statistics
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
    const currentRef = statsRef.current;
    
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
      const hasComma = target.includes(',');
      const isPlus = target.includes('+');
      
      // Extract numeric value
      let numericTarget = parseInt(target.replace(/[^\d]/g, ''));
      
      let current = 0;
      const increment = numericTarget / 100;
      const duration = 2000; // 2 seconds
      const stepTime = duration / 100;

      const updateCounter = () => {
        current += increment;
        if (current < numericTarget) {
          let displayValue = Math.ceil(current);
          
          // Format the display value
          if (hasComma && displayValue >= 1000) {
            displayValue = displayValue.toLocaleString();
          }
          
          if (isPercentage) {
            counter.textContent = displayValue + '%';
          } else if (isPlus) {
            counter.textContent = displayValue + '+';
          } else {
            counter.textContent = displayValue;
          }
          
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  };

  const values = [
    {
      icon: <Leaf className="h-10 w-10" />,
      title: 'Sustainability',
      description: 'We are committed to creating a sustainable future through responsible waste management practices.'
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: 'Community First',
      description: 'We prioritize community needs and work together to build cleaner, healthier neighborhoods.'
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Environmental Impact',
      description: 'Every action we take is designed to minimize environmental harm and maximize recycling.'
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Excellence',
      description: 'We strive for excellence in service delivery and customer satisfaction at every step.'
    }
  ];

  const team = [
    {
      name: 'Environmental Leadership',
      role: 'Dedicated to Sustainability',
      image: '/images/team/environmental.jpg',
      description: 'Our team brings decades of environmental expertise'
    },
    {
      name: 'Technology Innovation',
      role: 'Smart Solutions',
      image: '/images/team/technology.jpg',
      description: 'Leveraging technology for efficient waste collection'
    },
    {
      name: 'Community Engagement',
      role: 'People-Centered Approach',
      image: '/images/team/community.jpg',
      description: 'Building partnerships with local communities'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero/smart-waste.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Our Mission
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Transforming waste management through innovation, sustainability, and community partnership
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">SDG 11</div>
                <div className="text-sm">Sustainable Cities</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">SDG 12</div>
                <div className="text-sm">Responsible Consumption</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <Target className="h-12 w-12 text-green-600 mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  We started with a simple vision: to make waste collection and recycling accessible, 
                  efficient, and impactful for everyone in our community.
                </p>
                <p>
                  Recognizing the growing challenges of urban waste management and the critical need 
                  for sustainable solutions, we developed a platform that connects households and 
                  businesses with smart, optimized waste collection services.
                </p>
                <p>
                  Today, we're proud to be part of the global movement towards sustainable cities 
                  and responsible consumption, supporting the United Nations Sustainable Development 
                  Goals 11 and 12.
                </p>
              </div>
            </div>
            <div className="animate-slide-right">
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl h-96 bg-cover bg-center transform hover:scale-105 transition-all duration-300"
                style={{ backgroundImage: 'url(/images/hero/clean-environment.jpg)' }}
              >
                <div className="h-full bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Making a Difference</h3>
                    <p>One pickup at a time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
              The principles that guide everything we do
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              👆 Click on each card to learn more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const isExpanded = expandedCards.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => toggleCard(index)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="flex justify-center mb-6 text-green-600">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center flex items-center justify-center gap-2">
                    {value.title}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-green-600" />
                    )}
                  </h3>
                  {isExpanded && (
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed animate-slide-up">
                      {value.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Approach
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Combining expertise, technology, and community focus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
              >
                <div 
                  className="h-64 bg-cover bg-center transform group-hover:scale-110 transition-all duration-500"
                  style={{ backgroundImage: `url(${member.image})` }}
                >
                  <div className="h-full bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-green-300">{member.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section 
        ref={statsRef}
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/images/hero/recycling-easy.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-green-900/85"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Successful Pickups' },
              { value: '5,000+', label: 'Happy Users' },
              { value: '50+', label: 'Tons Recycled' },
              { value: '95%', label: 'Customer Satisfaction' }
            ].map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div 
                  className="counter text-5xl font-bold text-green-400 mb-2"
                  data-target={stat.value}
                >
                  0
                </div>
                <div className="text-lg text-green-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Recycle className="h-16 w-16 mx-auto mb-6 animate-spin-slow" />
          <h2 className="text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8">
            Be part of the sustainable waste management revolution. Together, we can create cleaner communities.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

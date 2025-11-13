import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Star, Clock, CheckCircle } from 'lucide-react';

/**
 * Contact Us Page
 * Contact information, feedback form, and customer reviews
 */
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 5
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Email Us',
      details: 'support@wastemanage.com',
      subdetails: 'We reply within 24 hours',
      link: 'mailto:support@wastemanage.com'
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Call Us',
      details: '+234 803 000 0000',
      subdetails: 'Mon-Sat, 8AM - 6PM',
      link: 'tel:+2348030000000'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Visit Us',
      details: '123 Green Street',
      subdetails: 'Ikeja, Lagos State',
      link: '#'
    }
  ];

  const reviews = [
    {
      name: 'Adebayo Tolulope',
      role: 'Homeowner',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rating: 5,
      comment: 'Excellent service! The pickup was on time and the team was very professional. I love how easy it is to schedule through the app.',
      date: '2 weeks ago'
    },
    {
      name: 'Okanlawon Peace',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rating: 5,
      comment: 'We use this service for our office waste management. The route optimization is impressive, and the dashboard makes tracking so simple.',
      date: '1 month ago'
    },
    {
      name: 'Ifeanyi Okoro',
      role: 'Environmental Advocate',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      rating: 5,
      comment: 'Finally, a waste management solution that actually cares about sustainability! The impact tracking feature is amazing.',
      date: '3 weeks ago'
    },
    {
      name: 'David Thompson',
      role: 'Apartment Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 4,
      comment: 'Great platform for managing waste collection for our entire complex. The scheduling flexibility is a game-changer.',
      date: '1 week ago'
    },
    {
      name: 'Titi Adewale',
      role: 'Restaurant Owner',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      rating: 5,
      comment: 'As a restaurant, we generate a lot of recyclable waste. This service has made our waste management efficient and eco-friendly.',
      date: '2 months ago'
    },
    {
      name: 'Okoro Precious',
      role: 'Retail Store Manager',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 5,
      comment: 'Reliable, professional, and environmentally conscious. The customer support is also top-notch. Highly recommend!',
      date: '3 weeks ago'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero/contact-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-slide-up">
            <MessageSquare className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose your preferred way to reach us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="group bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="flex justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {info.title}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  {info.details}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.subdetails}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Send className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you shortly
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg flex items-center gap-3 animate-slide-left">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="How can we help you?"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate Your Experience (Optional)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Tell us more about your inquiry or feedback..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4 fill-yellow-400" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real feedback from real people making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${review.image})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {review.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {review.role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  "{review.comment}"
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  {review.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/images/hero/contact-cta.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Coverage Area
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Currently serving Lagos State - Nigeria's commercial hub
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
              <img
                src="/images/maps/nigeria-map.png"
                alt="Map of Nigeria highlighting Lagos State"
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-center p-8"><p class="text-gray-600 dark:text-gray-400 mb-2">Lagos State, Nigeria</p><p class="text-sm text-gray-500">Our primary service area</p></div>';
                }}
              />
              {/* Lagos State Indicator */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border-2 border-green-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">Lagos State</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Our Service Area</p>
              </div>
            </div>
            {/* Lagos Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">20+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Local Government Areas</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">15M+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Population Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

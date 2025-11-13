// Import React and icons
import React from 'react';
import { Recycle, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer component with links and copyright information
 * Displays company info, quick links, and contact details
 */
const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="h-8 w-8 text-green-500 dark:text-green-400" />
              <span className="font-bold text-xl text-white">WasteManage</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Making waste management efficient and sustainable.
              Supporting SDG 11 (Sustainable Cities) and SDG 12 (Responsible Consumption).
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:support@wastemanage.com"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Pickup Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/new-request"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  New Request
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 dark:border-gray-800 mt-8 pt-8 text-center">
          {/* Made with love text - Simple (TOP) */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
              Made with
              <Heart className="h-5 w-5 text-red-500 dark:text-red-400" />
              for a sustainable future
            </p>
          </div>
          
          {/* Copyright text - Enhanced (BOTTOM) */}
          <div className="relative inline-block">
            <p className="text-base font-bold relative z-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-300 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent animate-gradient">
              &copy; {currentYear} WasteManage. All rights reserved.
            </p>
            {/* Glow effect layers */}
            <div className="absolute inset-0 blur-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-300 dark:via-blue-400 dark:to-purple-500 opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 blur-md bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-300 dark:via-blue-400 dark:to-purple-500 opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            {/* Sparkle effects */}
            <span className="absolute -top-2 left-8 w-1.5 h-1.5 bg-white dark:bg-yellow-200 rounded-full animate-ping shadow-lg shadow-white dark:shadow-yellow-200"></span>
            <span className="absolute -top-1 right-12 w-1 h-1 bg-yellow-300 dark:bg-yellow-200 rounded-full animate-ping shadow-lg shadow-yellow-300 dark:shadow-yellow-200" style={{ animationDelay: '0.5s' }}></span>
            <span className="absolute top-0 left-1/3 w-1 h-1 bg-blue-300 dark:bg-blue-200 rounded-full animate-ping shadow-lg shadow-blue-300 dark:shadow-blue-200" style={{ animationDelay: '1s' }}></span>
            <span className="absolute -bottom-1 right-1/4 w-1.5 h-1.5 bg-green-300 dark:bg-green-200 rounded-full animate-ping shadow-lg shadow-green-300 dark:shadow-green-200" style={{ animationDelay: '1.5s' }}></span>
            <span className="absolute top-1 right-1/3 w-1 h-1 bg-purple-300 dark:bg-purple-200 rounded-full animate-ping shadow-lg shadow-purple-300 dark:shadow-purple-200" style={{ animationDelay: '2s' }}></span>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for gradient animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `
      }} />
    </footer>
  );
};

export default Footer;

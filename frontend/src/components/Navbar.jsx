// Import React and hooks
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Recycle, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar component for site navigation
 * Includes responsive mobile menu and theme toggle
 */
const Navbar = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get current location for active link styling
  const location = useLocation();

  // Get theme context for dark mode toggle
  const { theme, toggleTheme } = useTheme();
  
  // Get auth context
  const { user, admin, logout, isAuthenticated } = useAuth();

  // Navigation links configuration based on user role
  const getNavLinks = () => {
    const baseLinks = [{ path: '/', label: 'Home' }];
    
    if (admin) {
      // Admin navigation
      return [
        ...baseLinks,
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/requests', label: 'Requests', icon: '📦' },
        { path: '/routing', label: 'Routes', icon: '🗺️' }
      ];
    } else if (user) {
      // User navigation
      return [
        ...baseLinks,
        { path: '/dashboard', label: 'My Dashboard', icon: '📊' },
        { path: '/my-requests', label: 'My Requests', icon: '📋' },
        { path: '/new-request', label: 'Request Pickup', icon: '➕' }
      ];
    } else {
      // Public navigation
      return [
        ...baseLinks,
        { path: '/about', label: 'About Us' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/contact', label: 'Contact Us' }
      ];
    }
  };

  const navLinks = getNavLinks();

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <style>{`
        @keyframes slideInText {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }
        @keyframes spinSmooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slide-text {
          animation: slideInText 2s ease-in-out infinite;
        }
        .animate-spin-smooth {
          animation: spinSmooth 3s linear infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Recycle className="h-8 w-8 text-green-600 group-hover:animate-spin-smooth transition-all duration-300 animate-spin-smooth" />
              <span className="font-bold text-xl bg-gradient-to-r from-green-600 via-green-700 to-green-600 dark:from-green-400 dark:via-green-500 dark:to-green-400 bg-clip-text text-transparent animate-slide-text">
                WasteManage
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(link.path)
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon && <span className="mr-1">{link.icon}</span>}
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>{user?.firstName || admin?.name || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveLink('/login')
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveLink('/register')
                      ? 'bg-green-700 text-white ring-2 ring-green-400'
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveLink(link.path)
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 inline mr-2" />
                    {user?.firstName || admin?.name || 'User'}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

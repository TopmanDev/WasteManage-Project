// Import React
import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

/**
 * Layout component that wraps pages with Navbar and Footer
 * Provides consistent structure across all pages
 * @param {ReactNode} children - Page content to be wrapped
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

// Import React hooks for state and context management
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for theme management
const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ThemeProvider component to wrap the application
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage, system preference, or default to 'light'
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Then check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // Default to light
    return 'light';
  });

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = document.documentElement;
    // Remove both classes first
    root.classList.remove('light', 'dark');
    // Add current theme class
    root.classList.add(theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
    // Update meta theme-color for mobile browsers
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#111827' : '#ffffff'
    );
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Context value to be provided
  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

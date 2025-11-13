import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const { loginAdmin, isAuthenticated } = useAuth();

  // Background images for sliding effect
  const backgrounds = [
    '/images/auth/admin-office.jpg',
    '/images/auth/admin-workspace.jpg',
    '/images/auth/green-technology.jpg'
  ];

  // Auto-change background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await loginAdmin(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Current Background Image Only */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{
          backgroundImage: `url(${backgrounds[currentBg]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-green-900/90 to-emerald-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full animate-bounce">
              <Shield className="h-16 w-16 text-green-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-white mb-3">
            Admin Portal
          </h2>
          <p className="text-xl text-green-100 mb-2">
            Secure Administrator Access
          </p>
          {!isAuthenticated && (
            <p className="mt-4 text-sm text-white/80">
              Regular user?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-green-400 hover:text-green-300 underline"
              >
                Sign in here
              </Link>
            </p>
          )}
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg animate-slide-left">
                <p className="text-red-600 dark:text-red-400 font-medium">🔒 {error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/admin/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </Button>
          </form>
        </div>

        {/* Back to Home link */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-white/80 mb-2">Not an administrator?</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
          >
            <Users className="h-4 w-4" />
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
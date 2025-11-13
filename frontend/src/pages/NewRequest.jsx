// Import React and necessary hooks
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Calendar, Clock, Weight, FileText } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { pickupRequestAPI } from '../utils/api.js';

/**
 * New Pickup Request Form Page
 * Allows users to submit new waste pickup requests
 */
const NewRequest = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    address: '',
    wasteType: [],
    estimatedWeight: '',
    description: '',
    preferredDate: '',
    preferredTimeSlot: 'morning'
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle waste type checkbox changes
  const handleWasteTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      wasteType: prev.wasteType.includes(type)
        ? prev.wasteType.filter(t => t !== type)
        : [...prev.wasteType, type]
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.userName.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.userEmail.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.userPhone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (formData.wasteType.length === 0) {
      setError('Please select at least one waste type');
      return false;
    }
    if (!formData.estimatedWeight || formData.estimatedWeight < 1) {
      setError('Please enter a valid weight (minimum 1 kg)');
      return false;
    }
    if (!formData.preferredDate) {
      setError('Please select a preferred date');
      return false;
    }

    // Check if date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Please select a future date');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Coerce numeric and date fields to proper types before sending
      const payload = {
        ...formData,
        estimatedWeight: Number(formData.estimatedWeight),
        // preferredDate can remain a YYYY-MM-DD string which Mongoose will parse;
        // if you prefer an ISO string uncomment the next line
        // preferredDate: new Date(formData.preferredDate).toISOString(),
      };

      console.log('Submitting pickup request:', payload);

      // Submit pickup request
      const response = await pickupRequestAPI.create(payload);

      console.log('Request submitted successfully:', response);

      // Set success BEFORE resetting form
      setSuccess(true);
      setIsLoading(false);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form after a short delay to ensure success message is visible
      setTimeout(() => {
        setFormData({
          userName: '',
          userEmail: '',
          userPhone: '',
          address: '',
          wasteType: [],
          estimatedWeight: '',
          description: '',
          preferredDate: '',
          preferredTimeSlot: 'morning'
        });
      }, 100);

    } catch (err) {
      console.error('Request submission error:', err);
      // If backend returns structured error object, prefer its message
      setError(err.message || 'Failed to submit request. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Request Waste Pickup
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Fill out the form below to schedule your waste collection
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                      Request Submitted Successfully! 🎉
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mb-4">
                      Your waste pickup request has been received. Our team will review it and contact you shortly to confirm the pickup schedule.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/my-requests')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        View My Requests
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        View Dashboard
                      </button>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-4 py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors font-medium"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information Section */}
            {!success && (
              <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Personal Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="userPhone"
                      value={formData.userPhone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="123 Main Street, City, State, ZIP"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Information Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Waste Information
              </h2>

              <div className="space-y-4">
                {/* Waste Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Waste Type * (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {['paper', 'plastics', 'metal', 'mixed'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.wasteType.includes(type)}
                          onChange={() => handleWasteTypeChange(type)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actual Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Actual Weight (kg) *
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="estimatedWeight"
                      value={formData.estimatedWeight}
                      onChange={handleChange}
                      min="1"
                      step="0.1"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 5.5"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Please provide the actual weight of your waste in kilograms
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Any additional details about your waste..."
                      rows="3"
                      maxLength="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Schedule Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Pickup Schedule
              </h2>

              <div className="space-y-4">
                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="preferredTimeSlot"
                      value={formData.preferredTimeSlot}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="morning">Morning (8 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/my-requests')}
              >
                Cancel
              </Button>
            </div>
            </>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewRequest;

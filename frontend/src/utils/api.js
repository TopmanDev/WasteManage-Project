// API utility for making HTTP requests to the backend

// Base API URL - update this based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage (check both user and admin tokens)
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = userToken || adminToken;

    // Merge headers safely so defaults are preserved even when options contains headers
    const mergedHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // Add Authorization header if token exists
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Build final fetch options with merged headers; options spread goes after
    // so other keys (method, body, etc.) in options are preserved.
    const fetchOptions = {
      ...options,
      headers: mergedHeaders,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Pickup Request API methods
export const pickupRequestAPI = {
  /**
   * Get current user's own pickup requests (User only)
   * @returns {Promise} - List of user's pickup requests
   */
  getMyRequests: async () => {
    return fetchAPI('/pickup-requests/my-requests');
  },

  /**
   * Get all pickup requests with optional filters (Admin only)
   * @param {object} filters - Query filters (status, wasteType, startDate, endDate)
   * @returns {Promise} - List of pickup requests
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/pickup-requests?${queryParams}` : '/pickup-requests';
    return fetchAPI(endpoint);
  },

  /**
   * Get a single pickup request by ID
   * @param {string} id - Pickup request ID
   * @returns {Promise} - Pickup request data
   */
  getById: async (id) => {
    return fetchAPI(`/pickup-requests/${id}`);
  },

  /**
   * Create a new pickup request
   * @param {object} data - Pickup request data
   * @returns {Promise} - Created pickup request
   */
  create: async (data) => {
    return fetchAPI('/pickup-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a pickup request
   * @param {string} id - Pickup request ID
   * @param {object} data - Updated data
   * @returns {Promise} - Updated pickup request
   */
  update: async (id, data) => {
    return fetchAPI(`/pickup-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update pickup request status
   * @param {string} id - Pickup request ID
   * @param {string} status - New status
   * @returns {Promise} - Updated pickup request
   */
  updateStatus: async (id, status) => {
    return fetchAPI(`/pickup-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete a pickup request
   * @param {string} id - Pickup request ID
   * @returns {Promise} - Delete confirmation
   */
  delete: async (id) => {
    return fetchAPI(`/pickup-requests/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get statistics for dashboard
   * @returns {Promise} - Statistics data
   */
  getStatistics: async () => {
    return fetchAPI('/pickup-requests/statistics');
  },
};

// User API methods
export const userAPI = {
  /**
   * Get total count of registered users (Admin only)
   * @returns {Promise} - User count
   */
  getUserCount: async () => {
    return fetchAPI('/users/count');
  },

  /**
   * Send forgot password email
   * @param {string} email - User's email address
   * @returns {Promise} - Success message
   */
  forgotPassword: async (email) => {
    return fetchAPI('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise} - Success message
   */
  resetPassword: async (token, newPassword) => {
    return fetchAPI('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }
};

export default pickupRequestAPI;

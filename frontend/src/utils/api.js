// api.js - Unified API utility for frontend

// Base API URL (remove /api from env, we'll append routes in code)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with proper headers, token, and error handling
 * @param {string} endpoint - API endpoint starting with /api/...
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<any>} - Response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage (user or admin)
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');

    // Merge headers
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Something went wrong');

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/////////////////////////////////////
// PICKUP REQUEST API METHODS
/////////////////////////////////////
export const pickupRequestAPI = {
  getMyRequests: () => fetchAPI('/api/pickup-requests/my-requests'),
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/api/pickup-requests${query ? `?${query}` : ''}`);
  },
  getById: (id) => fetchAPI(`/api/pickup-requests/${id}`),
  create: (data) => fetchAPI('/api/pickup-requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/api/pickup-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    fetchAPI(`/api/pickup-requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => fetchAPI(`/api/pickup-requests/${id}`, { method: 'DELETE' }),
  getStatistics: () => fetchAPI('/api/pickup-requests/statistics'),
};

/////////////////////////////////////
// USER API METHODS
/////////////////////////////////////
export const userAPI = {
  login: (data) => fetchAPI('/api/users/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => fetchAPI('/api/users/register', { method: 'POST', body: JSON.stringify(data) }),
  getUserCount: () => fetchAPI('/api/users/count'),
  forgotPassword: (email) =>
    fetchAPI('/api/users/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, newPassword) =>
    fetchAPI('/api/users/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
};

/////////////////////////////////////
// ADMIN API METHODS
/////////////////////////////////////
export const adminAPI = {
  login: (data) => fetchAPI('/api/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  getAllUsers: () => fetchAPI('/api/users'), // only if you define GET /api/users
};

export default fetchAPI;
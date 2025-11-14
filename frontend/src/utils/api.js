// api.js - Unified API utility for frontend

// Base API URL - should NOT include /api suffix, we append routes in the code
// If VITE_API_URL includes /api, remove it
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

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

    // Debug logging
    console.log(`[API] ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    console.log(`[API] Token present: ${!!token}`);

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

    // Check content type to determine if response is JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, treat as text
      const text = await response.text();
      console.error('[API] Non-JSON response:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        preview: text.substring(0, 200)
      });
      throw new Error(`Server error (${response.status}): Invalid response format. Check server logs.`);
    }

    console.log(`[API] Response status: ${response.status}`, data);

    if (!response.ok) {
      throw new Error(data.message || data.error || `Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('[API Error]', error.message);
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
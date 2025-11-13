const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUserCount,
  forgotPassword,
  resetPassword
} = require('../controllers/userAuthController');
const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.post('/change-password', authenticateUser, changePassword);

// Admin routes
router.get('/count', authenticateAdmin, getUserCount);

module.exports = router;

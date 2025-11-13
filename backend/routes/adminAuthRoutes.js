const express = require('express');
const router = express.Router();
const {
  adminLogin,
  resetPasswordInsideApp
} = require('../controllers/adminAuthController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', adminLogin);

// Protected routes (require admin authentication)
router.post('/reset-password', authenticateAdmin, resetPasswordInsideApp);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  createPickupRequest,
  getUserPickupRequests,
  getAllPickupRequests,
  getPickupRequestById,
  updatePickupRequest,
  deletePickupRequest,
  updatePickupStatus,
  getStatistics
} = require('../controllers/pickupRequestController');

const {
  authenticateUser,
  authenticateAdmin
} = require('../middleware/authMiddleware');

// ✅ User routes (must come before ID routes to avoid conflicts)
router.post('/', authenticateUser, createPickupRequest);
router.get('/my-requests', authenticateUser, getUserPickupRequests);

// ✅ Admin only routes
router.get('/statistics', authenticateAdmin, getStatistics);
router.get('/', authenticateAdmin, getAllPickupRequests);
router.get('/:id', authenticateAdmin, getPickupRequestById);
router.put('/:id', authenticateAdmin, updatePickupRequest);
router.patch('/:id/status', authenticateAdmin, updatePickupStatus);
router.delete('/:id', authenticateAdmin, deletePickupRequest);

module.exports = router;

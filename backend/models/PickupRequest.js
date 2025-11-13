const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  
  // ✅ Linked User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Location
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },

  coordinates: {
    latitude: Number,
    longitude: Number
  },

  // Waste Information
  wasteType: {
    type: [String],
    enum: ['paper', 'plastics', 'metal', 'mixed'],
    required: true
  },

  estimatedWeight: {
    type: Number,
    required: true,
    min: 1
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Scheduling
  preferredDate: {
    type: Date,
    required: true
  },

  preferredTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Route Optimization
  routeId: String,
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },

  completedAt: Date

}, { timestamps: true });

// Indexes
pickupRequestSchema.index({ status: 1, createdAt: -1 });
pickupRequestSchema.index({ preferredDate: 1 });

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);

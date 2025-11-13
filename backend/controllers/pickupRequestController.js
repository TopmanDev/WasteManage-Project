const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');

// ✅ User — Create new pickup request
exports.createPickupRequest = async (req, res) => {
  try {
    const {
      address,
      coordinates,
      wasteType,
      estimatedWeight,
      description,
      preferredDate,
      preferredTimeSlot
    } = req.body;

    // Validate required fields
    if (!address || !wasteType || !estimatedWeight || !preferredDate || !preferredTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create pickup request
    const pickupRequest = new PickupRequest({
      user: req.user.id,
      address,
      coordinates,
      wasteType,
      estimatedWeight,
      description,
      preferredDate,
      preferredTimeSlot
    });

    await pickupRequest.save();

    // Populate user information
    await pickupRequest.populate('user', 'firstName lastName email phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: pickupRequest
    });

  } catch (error) {
    console.error('Create pickup request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pickup request',
      error: error.message
    });
  }
};

// ✅ User — Get their own pickup requests
exports.getUserPickupRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    
    const pickupRequests = await PickupRequest
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickupRequests.length,
      data: pickupRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Get All Pickup Requests with filtering
exports.getAllPickupRequests = async (req, res) => {
  try {
    const { status, wasteType, startDate, endDate } = req.query;
    
    const filter = {};

    if (status) filter.status = status;
    if (wasteType) filter.wasteType = { $in: [wasteType] };
    if (startDate || endDate) {
      filter.preferredDate = {};
      if (startDate) filter.preferredDate.$gte = new Date(startDate);
      if (endDate) filter.preferredDate.$lte = new Date(endDate);
    }

    const pickupRequests = await PickupRequest
      .find(filter)
      .populate('user', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickupRequests.length,
      data: pickupRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Get single request by ID
exports.getPickupRequestById = async (req, res) => {
  try {
    const pickupRequest = await PickupRequest
      .findById(req.params.id)
      .populate('user', 'firstName lastName email phoneNumber');

    if (!pickupRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, data: pickupRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Update request (full update)
exports.updatePickupRequest = async (req, res) => {
  try {
    const pickupRequest = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pickupRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Pickup request updated successfully',
      data: pickupRequest
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Update status ONLY
exports.updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending','scheduled','in-progress','completed','cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'completed') updateData.completedAt = new Date();

    const updated = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Delete request
exports.deletePickupRequest = async (req, res) => {
  try {
    const deleted = await PickupRequest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Pickup request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin — Dashboard statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = {
      totalRequests: await PickupRequest.countDocuments(),
      pending: await PickupRequest.countDocuments({ status: 'pending' }),
      scheduled: await PickupRequest.countDocuments({ status: 'scheduled' }),
      inProgress: await PickupRequest.countDocuments({ status: 'in-progress' }),
      completed: await PickupRequest.countDocuments({ status: 'completed' }),
    };

    const wasteTypeStats = await PickupRequest.aggregate([
      { $unwind: '$wasteType' },
      { $group: { _id: '$wasteType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: { ...stats, wasteTypeStats }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

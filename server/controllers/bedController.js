const Bed = require('../models/Bed');

/**
 * @desc    Get all beds
 * @route   GET /api/beds
 * @access  Public / Private
 */
const getBeds = async (req, res, next) => {
  try {
    const { room, hostel, status } = req.query;
    const filter = {};

    if (room) filter.room = room;
    if (hostel) filter.hostel = hostel;
    if (status) filter.status = status;

    const beds = await Bed.find(filter)
      .populate('room', 'roomNumber floor type rentPerMonth')
      .populate('hostel', 'name code')
      .populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: beds.length,
      data: beds,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single bed by ID
 * @route   GET /api/beds/:id
 * @access  Public / Private
 */
const getBedById = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id)
      .populate('room', 'roomNumber floor type')
      .populate('hostel', 'name code')
      .populate('student', 'name email');

    if (!bed) {
      res.status(404);
      throw new Error('Bed not found');
    }

    res.status(200).json({
      success: true,
      data: bed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new bed
 * @route   POST /api/beds
 * @access  Private/Admin
 */
const createBed = async (req, res, next) => {
  try {
    const { bedNumber, room, hostel, student, status } = req.body;

    if (!bedNumber || !room) {
      res.status(400);
      throw new Error('Please provide bed identifier and room');
    }

    const bed = await Bed.create({
      bedNumber,
      room,
      hostel: hostel || null,
      student: student || null,
      status: status || 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Bed created successfully',
      data: bed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update bed (allocation / status change)
 * @route   PUT /api/beds/:id
 * @access  Private
 */
const updateBed = async (req, res, next) => {
  try {
    const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('room', 'roomNumber floor')
      .populate('student', 'name email');

    if (!bed) {
      res.status(404);
      throw new Error('Bed not found');
    }

    res.status(200).json({
      success: true,
      message: 'Bed updated successfully',
      data: bed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete bed
 * @route   DELETE /api/beds/:id
 * @access  Private/Admin
 */
const deleteBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (!bed) {
      res.status(404);
      throw new Error('Bed not found');
    }

    await bed.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bed deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed,
};

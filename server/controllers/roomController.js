const Room = require('../models/Room');

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
const getRooms = async (req, res, next) => {
  try {
    const { hostel, floor, type, status } = req.query;
    const filter = {};

    if (hostel) filter.hostel = hostel;
    if (floor) filter.floor = Number(floor);
    if (type) filter.type = type;
    if (status) filter.status = status;

    const rooms = await Room.find(filter)
      .populate('hostel', 'name code gender')
      .sort({ roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single room by ID
 * @route   GET /api/rooms/:id
 * @access  Public
 */
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostel', 'name code gender warden');

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new room
 * @route   POST /api/rooms
 * @access  Private/Admin
 */
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, hostel, floor, capacity, type, rentPerMonth, amenities } = req.body;

    if (!roomNumber || !hostel) {
      res.status(400);
      throw new Error('Please provide room number and hostel block');
    }

    const existingRoom = await Room.findOne({ roomNumber, hostel });
    if (existingRoom) {
      res.status(400);
      throw new Error(`Room ${roomNumber} already exists in this hostel block`);
    }

    const room = await Room.create({
      roomNumber,
      hostel,
      floor: floor || 1,
      capacity: capacity || 2,
      type: type || 'Standard',
      rentPerMonth: rentPerMonth || 5000,
      amenities: amenities || ['Beds', 'Study Table', 'Cupboard', 'Fan'],
    });

    const populatedRoom = await Room.findById(room._id).populate('hostel', 'name code');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: populatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:id
 * @access  Private
 */
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hostel', 'name code');

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:id
 * @access  Private/Admin
 */
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

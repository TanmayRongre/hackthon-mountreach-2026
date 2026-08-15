const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Student = require('../models/Student');

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public / Private
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
 * @access  Public / Private
 */
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostel', 'name code gender warden');

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // Fetch beds in this room
    const beds = await Bed.find({ room: room._id }).populate('student', 'name email');

    res.status(200).json({
      success: true,
      data: {
        ...room.toObject(),
        beds,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new room and automatically generate capacity beds
 * @route   POST /api/rooms
 * @access  Private/Admin
 */
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, hostel, floor, capacity = 2, type, rentPerMonth, amenities } = req.body;

    if (!roomNumber || !hostel) {
      res.status(400);
      throw new Error('Please provide room number and hostel block');
    }

    const cleanRoomNum = String(roomNumber).trim();

    const existingRoom = await Room.findOne({ roomNumber: cleanRoomNum, hostel });
    if (existingRoom) {
      res.status(400);
      throw new Error(`Room ${cleanRoomNum} already exists in this hostel block`);
    }

    const roomCapacity = Number(capacity) || 2;

    const room = await Room.create({
      roomNumber: cleanRoomNum,
      hostel,
      floor: floor || 1,
      capacity: roomCapacity,
      type: type || 'Standard',
      rentPerMonth: rentPerMonth || 5000,
      amenities: amenities || ['Beds', 'Study Table', 'Cupboard', 'Fan'],
      occupiedCount: 0,
      status: 'available',
    });

    // Automatically create beds for this room
    const bedPromises = [];
    for (let i = 1; i <= roomCapacity; i++) {
      bedPromises.push(
        Bed.create({
          bedNumber: `Bed-${i}`,
          room: room._id,
          hostel: hostel,
          status: 'available',
        })
      );
    }
    await Promise.all(bedPromises);

    const populatedRoom = await Room.findById(room._id).populate('hostel', 'name code');
    const createdBeds = await Bed.find({ room: room._id });

    res.status(201).json({
      success: true,
      message: `Room ${cleanRoomNum} created with ${roomCapacity} beds initialized successfully`,
      data: {
        ...populatedRoom.toObject(),
        beds: createdBeds,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update room and synchronize bed capacity safely
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin
 */
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const oldCapacity = room.capacity || 0;
    const newCapacity = req.body.capacity !== undefined ? Number(req.body.capacity) : oldCapacity;

    if (newCapacity < oldCapacity) {
      // Check if shrinking capacity would delete occupied beds
      const existingBeds = await Bed.find({ room: room._id });
      const occupiedBeds = existingBeds.filter((b) => b.status === 'occupied');

      if (occupiedBeds.length > newCapacity) {
        res.status(400);
        throw new Error(
          `Cannot reduce room capacity to ${newCapacity}. There are currently ${occupiedBeds.length} residents assigned to this room.`
        );
      }
    } else if (newCapacity > oldCapacity) {
      // Add more beds
      const existingBeds = await Bed.find({ room: room._id });
      const existingBedCount = existingBeds.length;
      for (let i = existingBedCount + 1; i <= newCapacity; i++) {
        await Bed.create({
          bedNumber: `Bed-${i}`,
          room: room._id,
          hostel: room.hostel,
          status: 'available',
        });
      }
    }

    // Update room fields
    Object.assign(room, req.body);
    if (req.body.capacity !== undefined) {
      room.capacity = newCapacity;
    }

    // Recompute status
    const currentBeds = await Bed.find({ room: room._id });
    const occupiedCount = currentBeds.filter((b) => b.status === 'occupied').length;
    room.occupiedCount = occupiedCount;
    room.status = occupiedCount >= room.capacity ? 'full' : 'available';

    await room.save();

    const populated = await Room.findById(room._id).populate('hostel', 'name code');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete room safely
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

    // Check if room has active students
    const activeStudents = await Student.countDocuments({ room: room._id, status: 'active' });
    if (activeStudents > 0) {
      res.status(400);
      throw new Error(`Cannot delete room. ${activeStudents} active student(s) are currently assigned to this room.`);
    }

    // Delete associated beds
    await Bed.deleteMany({ room: room._id });
    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room and its associated beds deleted successfully',
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

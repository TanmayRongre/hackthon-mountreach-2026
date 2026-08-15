const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Student = require('../models/Student');
const Bed = require('../models/Bed');

/**
 * @desc    Get all hostels
 * @route   GET /api/hostels
 * @access  Public
 */
const getHostels = async (req, res, next) => {
  try {
    const { gender, status } = req.query;
    const filter = {};

    if (gender) filter.gender = gender;
    if (status) filter.status = status;

    const hostels = await Hostel.find(filter)
      .populate('warden', 'name email role')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single hostel by ID
 * @route   GET /api/hostels/:id
 * @access  Public
 */
const getHostelById = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('warden', 'name email role');

    if (!hostel) {
      res.status(404);
      throw new Error('Hostel not found');
    }

    const rooms = await Room.find({ hostel: hostel._id });
    const students = await Student.find({ hostel: hostel._id, status: 'active' }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: {
        ...hostel.toObject(),
        rooms,
        residentsCount: students.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new hostel block
 * @route   POST /api/hostels
 * @access  Private/Admin
 */
const createHostel = async (req, res, next) => {
  try {
    const { name, code, gender, totalFloors, totalRooms, warden, facilities, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide hostel name');
    }

    const cleanName = name.trim();
    const existingHostel = await Hostel.findOne({ name: cleanName });
    if (existingHostel) {
      res.status(400);
      throw new Error('A hostel block with this name already exists');
    }

    const hostel = await Hostel.create({
      name: cleanName,
      code: code ? code.trim().toUpperCase() : cleanName.slice(0, 3).toUpperCase(),
      gender: gender || 'co-ed',
      totalFloors: totalFloors || 3,
      totalRooms: totalRooms || 30,
      warden: warden || null,
      facilities: facilities || ['Wi-Fi', '24/7 Water', 'Study Room', 'CCTV Security'],
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Hostel block created successfully',
      data: hostel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update hostel block
 * @route   PUT /api/hostels/:id
 * @access  Private/Admin
 */
const updateHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('warden', 'name email');

    if (!hostel) {
      res.status(404);
      throw new Error('Hostel not found');
    }

    res.status(200).json({
      success: true,
      message: 'Hostel block updated successfully',
      data: hostel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete hostel block safely
 * @route   DELETE /api/hostels/:id
 * @access  Private/Admin
 */
const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      res.status(404);
      throw new Error('Hostel not found');
    }

    // Check for active residents
    const activeStudents = await Student.countDocuments({ hostel: hostel._id, status: 'active' });
    if (activeStudents > 0) {
      res.status(400);
      throw new Error(`Cannot delete hostel. ${activeStudents} active resident(s) are currently allotted to this block.`);
    }

    // Delete associated rooms and beds
    const rooms = await Room.find({ hostel: hostel._id });
    const roomIds = rooms.map((r) => r._id);
    await Bed.deleteMany({ room: { $in: roomIds } });
    await Room.deleteMany({ hostel: hostel._id });
    await hostel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hostel block and associated rooms deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};

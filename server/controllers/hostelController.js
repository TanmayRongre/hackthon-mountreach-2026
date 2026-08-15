const Hostel = require('../models/Hostel');

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

    res.status(200).json({
      success: true,
      data: hostel,
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

    const existingHostel = await Hostel.findOne({ name });
    if (existingHostel) {
      res.status(400);
      throw new Error('A hostel block with this name already exists');
    }

    const hostel = await Hostel.create({
      name,
      code: code || name.slice(0, 3).toUpperCase(),
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
 * @desc    Delete hostel block
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

    await hostel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hostel block deleted successfully',
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

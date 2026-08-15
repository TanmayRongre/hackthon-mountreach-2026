const Mess = require('../models/Mess');

/**
 * @desc    Get mess schedule / menus
 * @route   GET /api/mess
 * @access  Public
 */
const getMesses = async (req, res, next) => {
  try {
    const { dayOfWeek, mealType, hostel } = req.query;
    const filter = {};

    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;
    if (mealType) filter.mealType = mealType;
    if (hostel) filter.hostel = hostel;

    const menus = await Mess.find(filter).populate('hostel', 'name code');

    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single mess menu entry by ID
 * @route   GET /api/mess/:id
 * @access  Public
 */
const getMessById = async (req, res, next) => {
  try {
    const menu = await Mess.findById(req.params.id).populate('hostel', 'name code');

    if (!menu) {
      res.status(404);
      throw new Error('Mess menu record not found');
    }

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create / Add mess menu
 * @route   POST /api/mess
 * @access  Private
 */
const createMess = async (req, res, next) => {
  try {
    const { dayOfWeek, mealType, timing, menuItems, specialDiet, hostel } = req.body;

    if (!dayOfWeek || !mealType || !menuItems) {
      res.status(400);
      throw new Error('Please provide day, meal type, and menu items');
    }

    const messMenu = await Mess.create({
      dayOfWeek,
      mealType,
      timing: timing || '7:30 AM - 9:30 AM',
      menuItems: Array.isArray(menuItems) ? menuItems : menuItems.split(',').map((i) => i.trim()),
      specialDiet: specialDiet || '',
      hostel: hostel || null,
    });

    res.status(201).json({
      success: true,
      message: 'Mess menu scheduled successfully',
      data: messMenu,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update mess menu
 * @route   PUT /api/mess/:id
 * @access  Private
 */
const updateMess = async (req, res, next) => {
  try {
    const menu = await Mess.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      res.status(404);
      throw new Error('Mess menu record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Mess menu updated successfully',
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete mess menu
 * @route   DELETE /api/mess/:id
 * @access  Private
 */
const deleteMess = async (req, res, next) => {
  try {
    const menu = await Mess.findById(req.params.id);

    if (!menu) {
      res.status(404);
      throw new Error('Mess menu record not found');
    }

    await menu.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mess menu deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess,
};

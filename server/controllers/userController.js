const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

const Notification = require('../models/Notification');

/**
 * @desc    Get notifications for user
 * @route   GET /api/notifications
 * @access  Private / Public
 */
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : req.query.user;
    const filter = userId ? { user: userId } : {};

    const notifications = await Notification.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single notification by ID
 * @route   GET /api/notifications/:id
 * @access  Private
 */
const getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new notification
 * @route   POST /api/notifications
 * @access  Private
 */
const createNotification = async (req, res, next) => {
  try {
    const { user, title, message, type, link } = req.body;

    if (!user || !title || !message) {
      res.status(400);
      throw new Error('Please provide user, title, and message');
    }

    const notification = await Notification.create({
      user,
      title,
      message,
      type: type || 'info',
      link: link || '',
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notification (e.g. Mark as read)
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
const updateNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};

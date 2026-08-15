// notificationController.js
const getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all notifications' });
  } catch (error) {
    next(error);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get notification by id' });
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Notification created' });
  } catch (error) {
    next(error);
  }
};

const updateNotification = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Notification updated' });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Notification deleted' });
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

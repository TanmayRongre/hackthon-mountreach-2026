// leaveController.js
const getLeaves = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all leaves' });
  } catch (error) {
    next(error);
  }
};

const getLeaveById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get leave by id' });
  } catch (error) {
    next(error);
  }
};

const createLeave = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Leave created' });
  } catch (error) {
    next(error);
  }
};

const updateLeave = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Leave updated' });
  } catch (error) {
    next(error);
  }
};

const deleteLeave = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Leave deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
};

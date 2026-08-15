// attendanceController.js
const getAttendances = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Get all attendances' });
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Get attendance by id' });
  } catch (error) {
    next(error);
  }
};

const createAttendance = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Attendance created' });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.body, message: 'Attendance updated' });
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Attendance deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};

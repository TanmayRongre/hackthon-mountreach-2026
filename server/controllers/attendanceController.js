const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

/**
 * @desc    Scan and mark daily student attendance via QR code
 * @route   POST /api/attendance/scan
 * @access  Private
 */
const scanAttendance = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user._id : req.body.student;
    if (!studentId) {
      res.status(400);
      throw new Error('Please login to mark attendance');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if already scanned today
    let record = await Attendance.findOne({
      student: studentId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (record) {
      return res.status(200).json({
        success: true,
        alreadyMarked: true,
        message: 'Attendance already scanned and verified for today!',
        data: record,
      });
    }

    const studentDoc = await Student.findOne({ user: studentId });

    record = await Attendance.create({
      student: studentId,
      hostel: studentDoc?.hostel || null,
      room: studentDoc?.room || null,
      date: new Date(),
      status: 'present',
      markedBy: studentId,
      remarks: 'Verified via Smart Hostel QR Scan Terminal',
    });

    const populated = await Attendance.findById(record._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      alreadyMarked: false,
      message: '✅ Attendance verified & marked Present successfully!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance records
 * @route   GET /api/attendance
 * @access  Public / Private
 */
const getAttendances = async (req, res, next) => {
  try {
    const { student, hostel, room, date, status } = req.query;
    const filter = {};

    if (student) {
      filter.student = student;
    } else if (req.user && req.user.role === 'student') {
      filter.student = req.user._id;
    }

    if (hostel) filter.hostel = hostel;
    if (room) filter.room = room;
    if (status) filter.status = status;
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.date = { $gte: dayStart, $lte: dayEnd };
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name email role')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('markedBy', 'name role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance by ID
 * @route   GET /api/attendance/:id
 * @access  Public / Private
 */
const getAttendanceById = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate('student', 'name email')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber');

    if (!record) {
      res.status(404);
      throw new Error('Attendance record not found');
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark attendance
 * @route   POST /api/attendance
 * @access  Private
 */
const createAttendance = async (req, res, next) => {
  try {
    const { student, hostel, room, date, status, remarks } = req.body;

    const studentId = student || (req.user ? req.user._id : null);
    if (!studentId) {
      res.status(400);
      throw new Error('Please specify student');
    }

    const record = await Attendance.create({
      student: studentId,
      hostel: hostel || null,
      room: room || null,
      date: date || Date.now(),
      status: status || 'present',
      markedBy: req.user ? req.user._id : null,
      remarks: remarks || '',
    });

    const populated = await Attendance.findById(record._id)
      .populate('student', 'name email')
      .populate('markedBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update attendance record
 * @route   PUT /api/attendance/:id
 * @access  Private
 */
const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'name email')
      .populate('markedBy', 'name role');

    if (!record) {
      res.status(404);
      throw new Error('Attendance record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Private/Admin
 */
const deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id);

    if (!record) {
      res.status(404);
      throw new Error('Attendance record not found');
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanAttendance,
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};

const Leave = require('../models/Leave');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');

/**
 * @desc    Get all leave / outpass requests (scoped by role)
 * @route   GET /api/leaves
 * @access  Private
 */
const getLeaves = async (req, res, next) => {
  try {
    const { status, leaveType } = req.query;
    const filter = {};

    // Role scoping
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (req.user.role === 'warden') {
      const assignedHostels = await Hostel.find({ warden: req.user._id }).select('_id');
      const hostelIds = assignedHostels.map((h) => h._id);
      if (hostelIds.length > 0) {
        const hostelStudents = await Student.find({ hostel: { $in: hostelIds } }).select('user');
        const userIds = hostelStudents.map((s) => s.user);
        filter.student = { $in: userIds };
      }
    }

    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const leaves = await Leave.find(filter)
      .populate('student', 'name email role')
      .populate('approvedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single leave request by ID
 * @route   GET /api/leaves/:id
 * @access  Private
 */
const getLeaveById = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('student', 'name email')
      .populate('approvedBy', 'name role');

    if (!leave) {
      res.status(404);
      throw new Error('Leave request not found');
    }

    if (req.user.role === 'student' && !leave.student._id.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view another student leave record');
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create outpass / leave request with input validation
 * @route   POST /api/leaves
 * @access  Private
 */
const createLeave = async (req, res, next) => {
  try {
    const { reason, leaveType, fromDate, toDate, destination, emergencyContact } = req.body;

    if (!reason || !fromDate || !toDate || !destination) {
      res.status(400);
      throw new Error('Please provide reason, departure date, return date, and destination');
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400);
      throw new Error('Please provide valid departure and return dates');
    }

    if (start >= end) {
      res.status(400);
      throw new Error('Expected return date must be later than departure date');
    }

    const leave = await Leave.create({
      student: req.user._id,
      leaveType: leaveType || 'outpass',
      reason: reason.trim(),
      fromDate: start,
      toDate: end,
      destination: destination.trim(),
      emergencyContact: emergencyContact || '',
      status: 'pending',
    });

    const populated = await Leave.findById(leave._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully for Warden review',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve / Reject leave request (Warden/Admin only) or cancel (Student)
 * @route   PUT /api/leaves/:id
 * @access  Private
 */
const updateLeave = async (req, res, next) => {
  try {
    const { status, approvalRemarks, actualReturnDate } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      res.status(404);
      throw new Error('Leave request not found');
    }

    // Role verification
    if (req.user.role === 'student') {
      if (!leave.student.equals(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to modify another student leave application');
      }
      if (status && !['cancelled', 'pending'].includes(status)) {
        res.status(403);
        throw new Error('Students cannot approve or reject leave applications');
      }
      if (status === 'cancelled') {
        leave.status = 'cancelled';
      }
    } else {
      // Warden / Admin approval
      if (status) leave.status = status;
      if (approvalRemarks) leave.approvalRemarks = approvalRemarks.trim();
      if (actualReturnDate) leave.actualReturnDate = new Date(actualReturnDate);

      if (['approved', 'rejected'].includes(status)) {
        leave.approvedBy = req.user._id;
      }
    }

    await leave.save();

    const populated = await Leave.findById(leave._id)
      .populate('student', 'name email')
      .populate('approvedBy', 'name role');

    res.status(200).json({
      success: true,
      message: `Leave application marked as ${status || 'updated'} successfully`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete leave request
 * @route   DELETE /api/leaves/:id
 * @access  Private (Warden / Admin)
 */
const deleteLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      res.status(404);
      throw new Error('Leave request not found');
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave application record deleted successfully',
    });
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

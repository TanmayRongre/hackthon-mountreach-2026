const Leave = require('../models/Leave');

/**
 * @desc    Get all leave / outpass requests
 * @route   GET /api/leaves
 * @access  Public / Private
 */
const getLeaves = async (req, res, next) => {
  try {
    const { student, status, leaveType } = req.query;
    const filter = {};

    if (student) filter.student = student;
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
 * @access  Public / Private
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

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create outpass / leave request
 * @route   POST /api/leaves
 * @access  Private
 */
const createLeave = async (req, res, next) => {
  try {
    const { reason, leaveType, fromDate, toDate, destination, emergencyContact } = req.body;

    if (!reason || !fromDate || !toDate || !destination) {
      res.status(400);
      throw new Error('Please provide reason, from-date, to-date, and destination');
    }

    const studentId = req.user ? req.user._id : req.body.student;
    if (!studentId) {
      res.status(400);
      throw new Error('Please specify student');
    }

    const leave = await Leave.create({
      student: studentId,
      leaveType: leaveType || 'outpass',
      reason,
      fromDate,
      toDate,
      destination,
      emergencyContact: emergencyContact || '',
      status: 'pending',
    });

    const populated = await Leave.findById(leave._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Outpass / Leave request submitted successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve / Reject leave request
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

    if (status) leave.status = status;
    if (approvalRemarks) leave.approvalRemarks = approvalRemarks;
    if (actualReturnDate) leave.actualReturnDate = actualReturnDate;
    if (req.user && ['approved', 'rejected'].includes(status)) {
      leave.approvedBy = req.user._id;
    }

    await leave.save();

    const populated = await Leave.findById(leave._id)
      .populate('student', 'name email')
      .populate('approvedBy', 'name role');

    res.status(200).json({
      success: true,
      message: `Leave request ${status || 'updated'} successfully`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete leave request
 * @route   DELETE /api/leaves/:id
 * @access  Private
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
      message: 'Leave request deleted successfully',
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

const Visitor = require('../models/Visitor');

/**
 * @desc    Get visitor requests
 * @route   GET /api/visitors
 * @access  Private
 */
const getVisitors = async (req, res, next) => {
  try {
    const { student, status } = req.query;
    const filter = {};

    if (student) {
      filter.student = student;
    } else if (req.user && req.user.role === 'student') {
      filter.student = req.user._id;
    }

    if (status) filter.status = status;

    const visitors = await Visitor.find(filter)
      .populate('student', 'name email')
      .populate('approvedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create visitor pass request
 * @route   POST /api/visitors
 * @access  Private
 */
const createVisitor = async (req, res, next) => {
  try {
    const { visitorName, relationship, phone, visitDate, timeSlot, purpose, idProof } = req.body;

    if (!visitorName || !phone || !visitDate || !purpose) {
      res.status(400);
      throw new Error('Please provide visitor name, phone, visit date, and purpose');
    }

    const studentId = req.user ? req.user._id : req.body.student;
    if (!studentId) {
      res.status(400);
      throw new Error('Please specify student host');
    }

    const passNumber = `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const visitor = await Visitor.create({
      student: studentId,
      visitorName,
      relationship: relationship || 'Parent',
      phone,
      visitDate,
      timeSlot: timeSlot || '10:00 AM - 1:00 PM',
      purpose,
      idProof: idProof || 'Aadhar Card / Govt ID',
      passNumber,
      status: 'approved', // Auto-approved for recognized guardians or instant pass
    });

    const populated = await Visitor.findById(visitor._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Visitor pass issued successfully!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update visitor pass status
 * @route   PUT /api/visitors/:id
 * @access  Private
 */
const updateVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('student', 'name email');

    if (!visitor) {
      res.status(404);
      throw new Error('Visitor record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Visitor pass updated',
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete visitor pass
 * @route   DELETE /api/visitors/:id
 * @access  Private
 */
const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      res.status(404);
      throw new Error('Visitor record not found');
    }
    await visitor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Visitor record deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor,
};

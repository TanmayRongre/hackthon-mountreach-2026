const Visitor = require('../models/Visitor');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');

/**
 * @desc    Get visitor requests (scoped by role)
 * @route   GET /api/visitors
 * @access  Private
 */
const getVisitors = async (req, res, next) => {
  try {
    const { status } = req.query;
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

    const passNumber = `VP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const visitor = await Visitor.create({
      student: req.user._id,
      visitorName: visitorName.trim(),
      relationship: relationship || 'Parent',
      phone: phone.trim(),
      visitDate: new Date(visitDate),
      timeSlot: timeSlot || '10:00 AM - 1:00 PM',
      purpose: purpose.trim(),
      idProof: idProof || 'Aadhar Card / Govt ID',
      passNumber,
      status: 'pending',
    });

    const populated = await Visitor.findById(visitor._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Visitor pass application submitted for Warden verification!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update visitor pass status (Warden / Admin)
 * @route   PUT /api/visitors/:id
 * @access  Private (Warden / Admin)
 */
const updateVisitor = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      res.status(404);
      throw new Error('Visitor record not found');
    }

    if (status) visitor.status = status;
    if (remarks) visitor.remarks = remarks.trim();
    if (['approved', 'checked_in', 'completed', 'rejected'].includes(status)) {
      visitor.approvedBy = req.user._id;
    }

    await visitor.save();

    const populated = await Visitor.findById(visitor._id)
      .populate('student', 'name email')
      .populate('approvedBy', 'name role');

    res.status(200).json({
      success: true,
      message: `Visitor pass updated to ${status}`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete visitor pass
 * @route   DELETE /api/visitors/:id
 * @access  Private (Admin)
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
      message: 'Visitor pass record deleted successfully',
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

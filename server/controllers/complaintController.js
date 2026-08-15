const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');

/**
 * @desc    Get all complaints (scoped by role)
 * @route   GET /api/complaints
 * @access  Private
 */
const getComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, hostel } = req.query;
    const filter = {};

    // Role scoping
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (req.user.role === 'warden') {
      const assignedHostels = await Hostel.find({ warden: req.user._id }).select('_id');
      const hostelIds = assignedHostels.map((h) => h._id);
      if (hostelIds.length > 0) {
        filter.hostel = { $in: hostelIds };
      }
    }

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (hostel && req.user.role !== 'student') filter.hostel = hostel;

    const complaints = await Complaint.find(filter)
      .populate('student', 'name email role')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('resolvedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('resolvedBy', 'name role');

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    // Role check: student can only view self
    if (req.user.role === 'student' && !complaint.student._id.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to access another resident complaint');
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private
 */
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide complaint title and description');
    }

    // Derive student details from database
    const studentDoc = await Student.findOne({ user: req.user._id });

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      priority: priority || 'medium',
      student: req.user._id,
      hostel: studentDoc?.hostel || req.body.hostel || null,
      room: studentDoc?.room || req.body.room || null,
      status: 'pending',
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name email')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor');

    res.status(201).json({
      success: true,
      message: 'Grievance ticket created and assigned to Warden successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint status & resolution
 * @route   PUT /api/complaints/:id
 * @access  Private
 */
const updateComplaint = async (req, res, next) => {
  try {
    const { status, resolutionNotes, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    // Student role can only cancel their own pending complaint
    if (req.user.role === 'student') {
      if (!complaint.student.equals(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to update another student complaint');
      }
      if (status && !['rejected', 'pending'].includes(status)) {
        res.status(403);
        throw new Error('Students are not authorized to mark complaints as resolved');
      }
      if (status === 'rejected') {
        complaint.status = 'rejected';
      }
    } else {
      // Warden / Admin can resolve, assign, update priority
      if (status) complaint.status = status;
      if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
      if (priority) complaint.priority = priority;

      if (status === 'resolved') {
        complaint.resolvedAt = new Date();
        complaint.resolvedBy = req.user._id;
      }
    }

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name email')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('resolvedBy', 'name role');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private (Warden / Admin)
 */
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};

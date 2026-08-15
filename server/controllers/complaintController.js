const Complaint = require('../models/Complaint');

/**
 * @desc    Get all complaints
 * @route   GET /api/complaints
 * @access  Public / Private
 */
const getComplaints = async (req, res, next) => {
  try {
    const { student, category, status, priority, hostel } = req.query;
    const filter = {};

    if (student) filter.student = student;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (hostel) filter.hostel = hostel;

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
 * @access  Public / Private
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
    const { title, description, category, priority, hostel, room } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide complaint title and description');
    }

    const studentId = req.user ? req.user._id : req.body.student;
    if (!studentId) {
      res.status(400);
      throw new Error('Please specify student raising the complaint');
    }

    const complaint = await Complaint.create({
      title,
      description,
      category: category || 'Other',
      priority: priority || 'medium',
      student: studentId,
      hostel: hostel || null,
      room: room || null,
      status: 'pending',
    });

    const populated = await Complaint.findById(complaint._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint
 * @route   PUT /api/complaints/:id
 * @access  Private
 */
const updateComplaint = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (status) complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
      if (req.user) complaint.resolvedBy = req.user._id;
    }

    Object.keys(req.body).forEach((key) => {
      if (!['status', 'resolutionNotes', '_id'].includes(key)) {
        complaint[key] = req.body[key];
      }
    });

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name email')
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
 * @access  Private
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

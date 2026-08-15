const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');

/**
 * @desc    Get all fee records (scoped by role)
 * @route   GET /api/fees
 * @access  Private
 */
const getFees = async (req, res, next) => {
  try {
    const { status, feeType } = req.query;
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
    if (feeType) filter.feeType = feeType;

    const fees = await Fee.find(filter)
      .populate('student', 'name email')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get fee record by ID
 * @route   GET /api/fees/:id
 * @access  Private
 */
const getFeeById = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name email role');

    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }

    if (req.user.role === 'student' && !fee.student._id.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to access another resident fee invoice');
    }

    res.status(200).json({
      success: true,
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create fee invoice
 * @route   POST /api/fees
 * @access  Private (Admin / Warden)
 */
const createFee = async (req, res, next) => {
  try {
    const { student, title, amount, feeType, dueDate, status, paymentMode } = req.body;

    if (!student || !title || amount === undefined || !dueDate) {
      res.status(400);
      throw new Error('Please provide student, title, amount, and due date');
    }

    const fee = await Fee.create({
      student,
      title: title.trim(),
      amount: Number(amount),
      feeType: feeType || 'Hostel Fee',
      dueDate: new Date(dueDate),
      status: status || 'pending',
      paymentMode: paymentMode || 'Pending',
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    });

    const populatedFee = await Fee.findById(fee._id).populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Fee invoice created successfully',
      data: populatedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Pay fee / Process simulated secure payment
 * @route   POST /api/fees/:id/pay
 * @access  Private
 */
const payFee = async (req, res, next) => {
  try {
    const { paymentMode, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      res.status(404);
      throw new Error('Fee invoice not found');
    }

    // Ensure student is paying own fee
    if (req.user.role === 'student' && !fee.student.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to pay fee invoices for other residents');
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMode = paymentMode || 'Online (UPI/NetBanking)';
    fee.transactionId = transactionId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    fee.receiptNumber = fee.receiptNumber || `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    await fee.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified & recorded successfully. Digital receipt generated.',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update fee record
 * @route   PUT /api/fees/:id
 * @access  Private (Admin / Warden)
 */
const updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('student', 'name email');

    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Fee invoice updated successfully',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete fee record
 * @route   DELETE /api/fees/:id
 * @access  Private (Admin)
 */
const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Fee record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFees,
  getFeeById,
  createFee,
  payFee,
  updateFee,
  deleteFee,
};

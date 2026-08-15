const Fee = require('../models/Fee');

/**
 * @desc    Get all fee records
 * @route   GET /api/fees
 * @access  Public / Private
 */
const getFees = async (req, res, next) => {
  try {
    const { student, status, feeType } = req.query;
    const filter = {};

    // If authenticated user is requesting their own fees, default to req.user._id if not admin
    if (student) {
      filter.student = student;
    } else if (req.user && req.user.role === 'student') {
      filter.student = req.user._id;
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
 * @access  Public / Private
 */
const getFeeById = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name email role');

    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
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
 * @access  Private/Admin
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
      title,
      amount,
      feeType: feeType || 'Hostel Fee',
      dueDate,
      status: status || 'pending',
      paymentMode: paymentMode || 'Pending',
      receiptNumber: `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
 * @desc    Pay fee / Process payment
 * @route   POST /api/fees/:id/pay
 * @access  Private
 */
const payFee = async (req, res, next) => {
  try {
    const { paymentMode, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMode = paymentMode || 'Online (UPI/NetBanking)';
    fee.transactionId = transactionId || `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    fee.receiptNumber = fee.receiptNumber || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await fee.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully! Receipt generated.',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update fee record
 * @route   PUT /api/fees/:id
 * @access  Private
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
      message: 'Fee record updated successfully',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete fee record
 * @route   DELETE /api/fees/:id
 * @access  Private/Admin
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

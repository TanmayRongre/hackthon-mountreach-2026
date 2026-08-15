const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify student'],
    },
    leaveType: {
      type: String,
      enum: ['outpass', 'vacation', 'emergency', 'weekend'],
      default: 'outpass',
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for leave/outpass'],
      trim: true,
    },
    fromDate: {
      type: Date,
      required: [true, 'Please provide departure date and time'],
    },
    toDate: {
      type: Date,
      required: [true, 'Please provide expected return date and time'],
    },
    destination: {
      type: String,
      required: [true, 'Please provide destination/home address'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalRemarks: {
      type: String,
      trim: true,
    },
    actualReturnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;

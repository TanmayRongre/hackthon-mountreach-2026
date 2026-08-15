const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify student host'],
    },
    visitorName: {
      type: String,
      required: [true, 'Please provide visitor full name'],
      trim: true,
    },
    relationship: {
      type: String,
      enum: ['Parent', 'Guardian', 'Sibling', 'Friend', 'Relative', 'Other'],
      default: 'Parent',
    },
    phone: {
      type: String,
      required: [true, 'Please provide visitor phone number'],
      trim: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Please specify date of visit'],
    },
    timeSlot: {
      type: String,
      default: '10:00 AM - 1:00 PM',
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, 'Please state purpose of visit'],
      trim: true,
    },
    idProof: {
      type: String,
      trim: true,
    },
    passNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'checked_in', 'completed', 'rejected'],
      default: 'approved',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;

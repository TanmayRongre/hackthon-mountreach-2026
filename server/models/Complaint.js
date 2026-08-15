const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide complaint details'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Electrical', 'Plumbing', 'Furniture', 'Mess & Food', 'Cleanliness', 'Wi-Fi / Internet', 'Security', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify student'],
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;

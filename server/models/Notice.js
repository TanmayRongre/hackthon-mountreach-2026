const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide notice title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide notice content'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Rules & Discipline', 'Mess', 'Maintenance', 'Fee Reminder', 'Event', 'Emergency'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'wardens', 'specific_block'],
      default: 'all',
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;

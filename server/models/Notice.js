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
      default: 'General',
      trim: true,
    },
    priority: {
      type: String,
      default: 'normal',
      trim: true,
    },
    targetAudience: {
      type: String,
      default: 'all',
      trim: true,
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

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: [true, 'Please specify date'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'on_leave', 'late'],
      default: 'present',
    },
    markedBy: {
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

attendanceSchema.index({ student: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

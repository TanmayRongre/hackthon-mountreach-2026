const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    enrollmentNumber: {
      type: String,
      required: [true, 'Please provide student enrollment ID'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    year: {
      type: String,
      default: '1st Year',
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      default: null,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      default: null,
    },
    phone: {
      type: String,
      trim: true,
    },
    parentName: {
      type: String,
      trim: true,
    },
    parentPhone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'graduated', 'suspended', 'left'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

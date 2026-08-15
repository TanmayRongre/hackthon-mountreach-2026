const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hostel name (e.g. Block A)'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    gender: {
      type: String,
      enum: ['boys', 'girls', 'co-ed'],
      default: 'co-ed',
    },
    totalFloors: {
      type: Number,
      default: 3,
    },
    totalRooms: {
      type: Number,
      default: 30,
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;

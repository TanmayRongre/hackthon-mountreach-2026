const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      trim: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Please specify hostel block'],
    },
    floor: {
      type: Number,
      default: 1,
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify bed capacity'],
      default: 2,
    },
    occupiedCount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['AC', 'Non-AC', 'Deluxe', 'Standard'],
      default: 'Standard',
    },
    rentPerMonth: {
      type: Number,
      default: 5000,
    },
    status: {
      type: String,
      enum: ['available', 'full', 'maintenance', 'reserved'],
      default: 'available',
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure room number is unique per hostel block
roomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

const mongoose = require('mongoose');

const messSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      required: [true, 'Please specify day of week (Monday to Sunday)'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    mealType: {
      type: String,
      required: [true, 'Please specify meal type (Breakfast, Lunch, Snacks, Dinner)'],
      enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    },
    timing: {
      type: String,
      trim: true,
      default: '7:30 AM - 9:30 AM',
    },
    menuItems: [
      {
        type: String,
        trim: true,
      },
    ],
    specialDiet: {
      type: String,
      trim: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
    },
  },
  {
    timestamps: true,
  }
);

messSchema.index({ dayOfWeek: 1, mealType: 1, hostel: 1 });

const Mess = mongoose.model('Mess', messSchema);

module.exports = Mess;

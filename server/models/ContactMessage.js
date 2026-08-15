const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    inquiry: {
      type: String,
      enum: ['general', 'booking', 'fees', 'facilities', 'complaint', 'other'],
      default: 'general',
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    responseNotes: {
      type: String,
      trim: true,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  next();
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;

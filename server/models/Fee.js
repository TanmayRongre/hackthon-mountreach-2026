const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify student'],
    },
    title: {
      type: String,
      required: [true, 'Please provide fee title (e.g. Semester 1 Hostel Fee)'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify amount in INR'],
    },
    feeType: {
      type: String,
      enum: ['Hostel Fee', 'Mess Fee', 'Caution Deposit', 'Maintenance', 'Fine', 'Other'],
      default: 'Hostel Fee',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide due date'],
    },
    paidDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partially_paid'],
      default: 'pending',
    },
    paymentMode: {
      type: String,
      enum: ['Online (UPI/NetBanking)', 'Cash', 'Cheque', 'Demand Draft', 'Pending'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    receiptNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;

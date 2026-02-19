const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'Please provide patient'],
  },
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Insurance', 'Online', 'Other'],
  },
  paymentDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Billing', billingSchema);

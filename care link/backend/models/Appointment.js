const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'Please provide patient'],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide doctor'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide appointment date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide appointment time'],
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'],
    default: 'Scheduled',
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for visit'],
  },
  notes: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 30, // minutes
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

module.exports = mongoose.model('Appointment', appointmentSchema);

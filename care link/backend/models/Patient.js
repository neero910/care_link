const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please specify gender'],
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
  },
  medicalHistory: {
    type: String,
    default: '',
  },
  allergies: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  registeredBy: {
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

module.exports = mongoose.model('Patient', patientSchema);

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'patient_id'
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'doctor_id'
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'appointment_date'
  },
  appointmentTime: {
    type: DataTypes.STRING(5),
    allowNull: false,
    field: 'appointment_time'
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show'),
    defaultValue: 'Scheduled'
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

module.exports = Appointment;

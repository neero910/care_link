const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Billing = sequelize.define('Billing', {
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
  appointmentId: {
    type: DataTypes.INTEGER,
    field: 'appointment_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Overdue', 'Cancelled'),
    defaultValue: 'Pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Card', 'Insurance', 'Online', 'Other'),
    field: 'payment_method'
  },
  paymentDate: {
    type: DataTypes.DATE,
    field: 'payment_date'
  },
  dueDate: {
    type: DataTypes.DATE,
    field: 'due_date'
  },
  notes: {
    type: DataTypes.TEXT
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
  tableName: 'billing',
  timestamps: true
});

module.exports = Billing;

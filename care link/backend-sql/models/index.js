const User = require('./User');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const Billing = require('./Billing');

// Define associations
User.hasMany(Patient, { foreignKey: 'registered_by', as: 'registeredPatients' });
Patient.belongsTo(User, { foreignKey: 'registered_by', as: 'registeredBy' });

User.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

User.hasMany(Appointment, { foreignKey: 'created_by', as: 'createdAppointments' });
Appointment.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });

Patient.hasMany(Billing, { foreignKey: 'patient_id', as: 'billings' });
Billing.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

Appointment.hasMany(Billing, { foreignKey: 'appointment_id', as: 'billings' });
Billing.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

User.hasMany(Billing, { foreignKey: 'created_by', as: 'createdBillings' });
Billing.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });

module.exports = {
  User,
  Patient,
  Appointment,
  Billing
};

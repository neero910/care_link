const { Patient, User } = require('../models');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: User, as: 'registeredBy', attributes: ['name', 'username'] }]
    });

    res.json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patients'
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, as: 'registeredBy', attributes: ['name', 'username'] }]
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient'
    });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory, allergies, notes } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      email,
      phone,
      address,
      medicalHistory,
      allergies,
      notes,
      registeredBy: req.user.userId
    });

    await patient.reload({
      include: [{ model: User, as: 'registeredBy', attributes: ['name', 'username'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating patient'
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory, allergies, notes } = req.body;
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.update({
      name,
      age,
      gender,
      email,
      phone,
      address,
      medicalHistory,
      allergies,
      notes
    });

    await patient.reload({
      include: [{ model: User, as: 'registeredBy', attributes: ['name', 'username'] }]
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating patient'
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.destroy();

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting patient'
    });
  }
};

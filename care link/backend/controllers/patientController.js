const Patient = require('../models/Patient');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('registeredBy', 'name username');
    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patients',
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'name username');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient',
    });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory, allergies, notes } = req.body;

    const patient = new Patient({
      name,
      age,
      gender,
      email,
      phone,
      address,
      medicalHistory,
      allergies,
      notes,
      registeredBy: req.user.userId,
    });

    await patient.save();
    await patient.populate('registeredBy', 'name username');

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating patient',
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory, allergies, notes } = req.body;

    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, email, phone, address, medicalHistory, allergies, notes },
      { new: true, runValidators: true }
    ).populate('registeredBy', 'name username');

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating patient',
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting patient',
    });
  }
};

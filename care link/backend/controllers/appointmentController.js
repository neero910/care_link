const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, patientId, doctorId, date } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name username email')
      .populate('createdBy', 'name username');

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching appointments',
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name username email')
      .populate('createdBy', 'name username');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching appointment',
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, notes, duration } = req.body;

    // Validate patient and doctor exist
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      User.findById(doctorId),
    ]);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date: new Date(date),
      time,
      reason,
      notes,
      duration: duration || 30,
      createdBy: req.user.userId,
    });

    await appointment.save();
    await appointment.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'doctorId', select: 'name username email' },
      { path: 'createdBy', select: 'name username' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating appointment',
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { date, time, reason, notes, status, duration } = req.body;

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date: date ? new Date(date) : appointment.date, time, reason, notes, status, duration },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'doctorId', select: 'name username email' },
      { path: 'createdBy', select: 'name username' },
    ]);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating appointment',
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting appointment',
    });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name username')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient appointments',
    });
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = { doctorId: req.params.doctorId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name phone')
      .sort({ time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching doctor schedule',
    });
  }
};

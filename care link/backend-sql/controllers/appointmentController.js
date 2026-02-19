const { Appointment, Patient, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, patientId, doctorId, date } = req.query;
    let where = {};

    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.appointmentDate = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'doctor', attributes: ['name', 'username', 'email'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching appointments'
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'doctor', attributes: ['name', 'username', 'email'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching appointment'
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, notes, duration } = req.body;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate: new Date(date),
      appointmentTime: time,
      reason,
      notes,
      duration: duration || 30,
      createdBy: req.user.userId
    });

    await appointment.reload({
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'doctor', attributes: ['name', 'username', 'email'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating appointment'
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { date, time, reason, notes, status, duration } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({
      appointmentDate: date ? new Date(date) : appointment.appointmentDate,
      appointmentTime: time || appointment.appointmentTime,
      reason: reason || appointment.reason,
      notes: notes || appointment.notes,
      status: status || appointment.status,
      duration: duration || appointment.duration
    });

    await appointment.reload({
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: User, as: 'doctor', attributes: ['name', 'username', 'email'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating appointment'
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.destroy();

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting appointment'
    });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.params.patientId },
      include: [
        { model: User, as: 'doctor', attributes: ['name', 'username'] }
      ],
      order: [['appointmentDate', 'DESC']]
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient appointments'
    });
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const { date } = req.query;
    let where = { doctorId: req.params.doctorId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.appointmentDate = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'phone'] }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching doctor schedule'
    });
  }
};

const { Billing, Patient, Appointment, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllBilling = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    let where = {};

    if (status) where.status = status;
    if (patientId) where.patientId = patientId;

    const billing = await Billing.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: Appointment, as: 'appointment', attributes: ['appointmentDate', 'appointmentTime', 'reason'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.json({
      success: true,
      count: billing.length,
      billing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching billing records'
    });
  }
};

exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: Appointment, as: 'appointment', attributes: ['appointmentDate', 'appointmentTime', 'reason'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    res.json({
      success: true,
      billing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching billing record'
    });
  }
};

exports.createBilling = async (req, res) => {
  try {
    const { patientId, appointmentId, amount, description, status, paymentMethod, dueDate } = req.body;

    const billing = await Billing.create({
      patientId,
      appointmentId,
      amount,
      description,
      status: status || 'Pending',
      paymentMethod,
      dueDate,
      createdBy: req.user.userId
    });

    await billing.reload({
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: Appointment, as: 'appointment', attributes: ['appointmentDate', 'appointmentTime', 'reason'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Billing record created successfully',
      billing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating billing record'
    });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    const { amount, description, status, paymentMethod, paymentDate, dueDate, notes } = req.body;
    const billing = await Billing.findByPk(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    await billing.update({
      amount: amount || billing.amount,
      description: description || billing.description,
      status: status || billing.status,
      paymentMethod: paymentMethod || billing.paymentMethod,
      paymentDate: paymentDate || billing.paymentDate,
      dueDate: dueDate || billing.dueDate,
      notes: notes || billing.notes
    });

    await billing.reload({
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email', 'phone'] },
        { model: Appointment, as: 'appointment', attributes: ['appointmentDate', 'appointmentTime', 'reason'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.json({
      success: true,
      message: 'Billing record updated successfully',
      billing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating billing record'
    });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    await billing.destroy();

    res.json({
      success: true,
      message: 'Billing record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting billing record'
    });
  }
};

exports.getPatientBilling = async (req, res) => {
  try {
    const billing = await Billing.findAll({
      where: { patientId: req.params.patientId },
      include: [
        { model: Appointment, as: 'appointment', attributes: ['appointmentDate', 'reason'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: billing.length,
      billing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient billing'
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const billing = await Billing.findByPk(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    await billing.update({
      status: 'Paid',
      paymentMethod,
      paymentDate: new Date()
    });

    await billing.reload({
      include: [
        { model: Patient, as: 'patient', attributes: ['name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['name', 'username'] }
      ]
    });

    res.json({
      success: true,
      message: 'Billing marked as paid',
      billing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error marking billing as paid'
    });
  }
};

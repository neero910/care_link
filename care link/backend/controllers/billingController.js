const Billing = require('../models/Billing');
const Patient = require('../models/Patient');

exports.getAllBilling = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;

    const billing = await Billing.find(filter)
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'date time reason')
      .populate('createdBy', 'name username');

    res.json({
      success: true,
      count: billing.length,
      billing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching billing records',
    });
  }
};

exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'date time reason')
      .populate('createdBy', 'name username');

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found',
      });
    }

    res.json({
      success: true,
      billing,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching billing record',
    });
  }
};

exports.createBilling = async (req, res) => {
  try {
    const { patientId, appointmentId, amount, description, status, paymentMethod, dueDate } = req.body;

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const billing = new Billing({
      patientId,
      appointmentId,
      amount,
      description,
      status: status || 'Pending',
      paymentMethod,
      dueDate,
      createdBy: req.user.userId,
    });

    await billing.save();
    await billing.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'appointmentId', select: 'date time reason' },
      { path: 'createdBy', select: 'name username' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Billing record created successfully',
      billing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating billing record',
    });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    const { amount, description, status, paymentMethod, paymentDate, dueDate, notes } = req.body;

    let billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found',
      });
    }

    billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { amount, description, status, paymentMethod, paymentDate, dueDate, notes },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'appointmentId', select: 'date time reason' },
      { path: 'createdBy', select: 'name username' },
    ]);

    res.json({
      success: true,
      message: 'Billing record updated successfully',
      billing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating billing record',
    });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found',
      });
    }

    res.json({
      success: true,
      message: 'Billing record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting billing record',
    });
  }
};

exports.getPatientBilling = async (req, res) => {
  try {
    const billing = await Billing.find({ patientId: req.params.patientId })
      .populate('appointmentId', 'date reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: billing.length,
      billing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient billing',
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Paid',
        paymentMethod,
        paymentDate: new Date(),
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name email' },
      { path: 'createdBy', select: 'name username' },
    ]);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found',
      });
    }

    res.json({
      success: true,
      message: 'Billing marked as paid',
      billing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking billing as paid',
    });
  }
};

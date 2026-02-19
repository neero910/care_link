const validateUserInput = (req, res, next) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  if (role && !['admin', 'doctor', 'nurse', 'reception', 'manager'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  next();
};

const validatePatientInput = (req, res, next) => {
  const { name, age, gender, phone, address } = req.body;

  if (!name || !age || !gender || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  if (age < 0 || age > 150) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid age',
    });
  }

  next();
};

const validateAppointmentInput = (req, res, next) => {
  const { patientId, doctorId, date, time, reason } = req.body;

  if (!patientId || !doctorId || !date || !time || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  next();
};

const validateBillingInput = (req, res, next) => {
  const { patientId, amount, description } = req.body;

  if (!patientId || !amount || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0',
    });
  }

  next();
};

module.exports = {
  validateUserInput,
  validatePatientInput,
  validateAppointmentInput,
  validateBillingInput,
};

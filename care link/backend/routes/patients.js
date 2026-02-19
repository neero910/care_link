const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { auth, authorize } = require('../middleware/auth');
const { validatePatientInput } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', validatePatientInput, authorize('admin', 'doctor', 'nurse', 'reception'), createPatient);
router.put('/:id', validatePatientInput, authorize('admin', 'doctor', 'nurse', 'reception'), updatePatient);
router.delete('/:id', authorize('admin', 'manager'), deletePatient);

module.exports = router;

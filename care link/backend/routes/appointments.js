const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getDoctorSchedule,
} = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');
const { validateAppointmentInput } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', validateAppointmentInput, authorize('admin', 'doctor', 'reception', 'manager'), createAppointment);
router.put('/:id', authorize('admin', 'doctor', 'reception', 'manager'), updateAppointment);
router.delete('/:id', authorize('admin', 'manager'), deleteAppointment);

// Additional routes
router.get('/patient/:patientId', getPatientAppointments);
router.get('/doctor/:doctorId/schedule', getDoctorSchedule);

module.exports = router;

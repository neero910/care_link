const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getDoctorSchedule
} = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', authorize('admin', 'doctor', 'reception', 'manager'), createAppointment);
router.put('/:id', authorize('admin', 'doctor', 'reception', 'manager'), updateAppointment);
router.delete('/:id', authorize('admin', 'manager'), deleteAppointment);

router.get('/patient/:patientId', getPatientAppointments);
router.get('/doctor/:doctorId/schedule', getDoctorSchedule);

module.exports = router;

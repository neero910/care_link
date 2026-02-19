const express = require('express');
const router = express.Router();
const {
  getAllBilling,
  getBillingById,
  createBilling,
  updateBilling,
  deleteBilling,
  getPatientBilling,
  markAsPaid
} = require('../controllers/billingController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.get('/', getAllBilling);
router.get('/:id', getBillingById);
router.post('/', authorize('admin', 'manager', 'reception'), createBilling);
router.put('/:id', authorize('admin', 'manager', 'reception'), updateBilling);
router.delete('/:id', authorize('admin', 'manager'), deleteBilling);

router.get('/patient/:patientId', getPatientBilling);
router.put('/:id/mark-paid', authorize('admin', 'manager', 'reception'), markAsPaid);

module.exports = router;

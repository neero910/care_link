const express = require('express');
const router = express.Router();
const {
  getAllBilling,
  getBillingById,
  createBilling,
  updateBilling,
  deleteBilling,
  getPatientBilling,
  markAsPaid,
} = require('../controllers/billingController');
const { auth, authorize } = require('../middleware/auth');
const { validateBillingInput } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.get('/', getAllBilling);
router.get('/:id', getBillingById);
router.post('/', validateBillingInput, authorize('admin', 'manager', 'reception'), createBilling);
router.put('/:id', authorize('admin', 'manager', 'reception'), updateBilling);
router.delete('/:id', authorize('admin', 'manager'), deleteBilling);

// Additional routes
router.get('/patient/:patientId', getPatientBilling);
router.put('/:id/mark-paid', authorize('admin', 'manager', 'reception'), markAsPaid);

module.exports = router;

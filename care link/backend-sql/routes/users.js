const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin', 'manager'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;

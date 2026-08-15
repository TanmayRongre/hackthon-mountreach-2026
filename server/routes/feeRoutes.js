const express = require('express');
const {
  getFees,
  getFeeById,
  createFee,
  payFee,
  updateFee,
  deleteFee,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getFees);
router.get('/:id', protect, getFeeById);
router.post('/', protect, authorize('admin', 'warden'), createFee);
router.post('/:id/pay', protect, payFee);
router.put('/:id', protect, authorize('admin', 'warden'), updateFee);
router.delete('/:id', protect, authorize('admin'), deleteFee);

module.exports = router;

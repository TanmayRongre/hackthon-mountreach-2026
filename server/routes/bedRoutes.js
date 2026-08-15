const express = require('express');
const {
  getBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed,
} = require('../controllers/bedController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getBeds);
router.get('/:id', protect, getBedById);
router.post('/', protect, authorize('admin'), createBed);
router.put('/:id', protect, authorize('admin', 'warden'), updateBed);
router.delete('/:id', protect, authorize('admin'), deleteBed);

module.exports = router;

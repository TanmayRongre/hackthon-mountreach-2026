const express = require('express');
const {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getHostels);
router.get('/:id', getHostelById);
router.post('/', protect, authorize('admin'), createHostel);
router.put('/:id', protect, authorize('admin', 'warden'), updateHostel);
router.delete('/:id', protect, authorize('admin'), deleteHostel);

module.exports = router;

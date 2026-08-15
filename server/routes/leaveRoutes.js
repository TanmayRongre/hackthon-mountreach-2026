const express = require('express');
const {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for leave / outpass operations
router.get('/', protect, getLeaves);
router.get('/:id', protect, getLeaveById);
router.post('/', protect, createLeave);
router.put('/:id', protect, updateLeave);
router.delete('/:id', protect, authorize('admin', 'warden'), deleteLeave);

module.exports = router;

const express = require('express');
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for complaint operations
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.post('/', protect, createComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, authorize('admin', 'warden'), deleteComplaint);

module.exports = router;

const express = require('express');
const {
  scanAttendance,
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/scan', protect, scanAttendance);
router.get('/', protect, getAttendances);
router.get('/:id', protect, getAttendanceById);
router.post('/', protect, authorize('warden', 'admin'), createAttendance);
router.put('/:id', protect, authorize('warden', 'admin'), updateAttendance);
router.delete('/:id', protect, authorize('admin'), deleteAttendance);

module.exports = router;

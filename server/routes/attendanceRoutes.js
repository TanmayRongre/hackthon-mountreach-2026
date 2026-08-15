const express = require('express');
const {
  scanAttendance,
  generateAttendanceQR,
  getActiveAttendanceSession,
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-qr', protect, authorize('warden', 'admin'), generateAttendanceQR);
router.get('/active-session', protect, getActiveAttendanceSession);
router.post('/scan', protect, scanAttendance);
router.get('/', protect, getAttendances);
router.get('/:id', protect, getAttendanceById);
router.post('/', protect, authorize('warden', 'admin'), createAttendance);
router.put('/:id', protect, authorize('warden', 'admin'), updateAttendance);
router.delete('/:id', protect, authorize('admin'), deleteAttendance);

module.exports = router;

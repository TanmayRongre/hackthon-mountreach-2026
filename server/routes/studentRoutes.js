const express = require('express');
const {
  getMyStudentProfile,
  admitStudent,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student's own profile and admission routes
router.get('/me', protect, getMyStudentProfile);
router.post('/admit', protect, admitStudent);

// Student management routes
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudentById);
router.post('/', protect, authorize('admin', 'warden'), createStudent);
router.put('/:id', protect, authorize('admin', 'warden'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
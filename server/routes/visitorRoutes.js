const express = require('express');
const {
  getVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getVisitors);
router.post('/', protect, createVisitor);
router.put('/:id', protect, authorize('warden', 'admin'), updateVisitor);
router.delete('/:id', protect, authorize('admin'), deleteVisitor);

module.exports = router;

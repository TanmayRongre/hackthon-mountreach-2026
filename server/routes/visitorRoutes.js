const express = require('express');
const {
  getVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getVisitors);
router.post('/', protect, createVisitor);
router.put('/:id', protect, updateVisitor);
router.delete('/:id', protect, deleteVisitor);

module.exports = router;

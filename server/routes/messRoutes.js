const express = require('express');
const {
  getMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess,
} = require('../controllers/messController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMesses);
router.get('/:id', getMessById);
router.post('/', protect, authorize('admin', 'warden'), createMess);
router.put('/:id', protect, authorize('admin', 'warden'), updateMess);
router.delete('/:id', protect, authorize('admin'), deleteMess);

module.exports = router;

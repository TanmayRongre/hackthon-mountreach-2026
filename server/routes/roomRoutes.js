const express = require('express');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin', 'warden'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;

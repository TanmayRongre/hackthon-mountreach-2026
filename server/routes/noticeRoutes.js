const express = require('express');
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getNotices);
router.get('/:id', getNoticeById);
router.post('/', protect, authorize('admin', 'warden'), createNotice);
router.put('/:id', protect, authorize('admin', 'warden'), updateNotice);
router.delete('/:id', protect, authorize('admin', 'warden'), deleteNotice);

module.exports = router;

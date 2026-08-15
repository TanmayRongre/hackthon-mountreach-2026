const express = require('express');
const {
  submitContact,
  getContactMessages,
  updateContactMessage,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public submission
router.post('/', submitContact);

// Admin / Warden ticket review
router.get('/', protect, authorize('admin', 'warden'), getContactMessages);
router.put('/:id', protect, authorize('admin', 'warden'), updateContactMessage);

module.exports = router;

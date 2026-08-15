const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Item CRUD Routes
router.route('/')
  .get(getItems)         // Public: Get all items
  .post(protect, createItem); // Protected: Create item

router.route('/:id')
  .get(getItemById)       // Public: Get single item
  .put(protect, updateItem)   // Protected: Update item (owner or admin)
  .delete(protect, deleteItem); // Protected: Delete item (owner or admin)

module.exports = router;

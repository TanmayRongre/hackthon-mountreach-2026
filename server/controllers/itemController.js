const Item = require('../models/Item');

/**
 * @desc    Get all items
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({})
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Private (Authenticated users)
 */
const createItem = async (req, res, next) => {
  try {
    const { title, description, category, status } = req.body;

    // Validate required fields
    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide title and description');
    }

    const item = await Item.create({
      title,
      description,
      category: category || 'General',
      status: status || 'active',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an item
 * @route   PUT /api/items/:id
 * @access  Private (Owner or Admin)
 */
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Check authorization: Must be the owner or an admin
    const isOwner = item.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this item');
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validation on update
      }
    ).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an item
 * @route   DELETE /api/items/:id
 * @access  Private (Owner or Admin)
 */
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Check authorization: Must be the owner or an admin
    const isOwner = item.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this item');
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
